const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dbPromise = require("../db");
const auth = require("../middleware/auth");
require("dotenv").config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_key_change_me";
const JWT_EXPIRES_IN = "7d";

// POST /api/users/register
router.post("/register", async (req, res) => {
  try {
    const db = await dbPromise;
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email and password are required" });
    }

    const existingUser = await db.get(
      "SELECT * FROM users WHERE email = ?",
      email
    );

    if (existingUser) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const passwordHash = bcrypt.hashSync(password, 10);

    const result = await db.run(
      "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)",
      name,
      email,
      passwordHash
    );

    const userId = result.lastID;

    const token = jwt.sign({ id: userId, email }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    return res.status(201).json({
      message: "User registered successfully",
      user: { id: userId, name, email },
      token,
    });
  } catch (err) {
    console.error("Error in register:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// POST /api/users/login
router.post("/login", async (req, res) => {
  try {
    const db = await dbPromise;
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await db.get("SELECT * FROM users WHERE email = ?", email);

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = bcrypt.compareSync(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    return res.json({
      message: "Login successful",
      user: { id: user.id, name: user.name, email: user.email },
      token,
    });
  } catch (err) {
    console.error("Error in login:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// GET /api/users/me
router.get("/me", auth, async (req, res) => {
  try {
    const db = await dbPromise;
    const userId = req.user.id;

    const user = await db.get(
      "SELECT id, name, email, created_at FROM users WHERE id = ?",
      userId
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({ user });
  } catch (err) {
    console.error("Error in /me:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
