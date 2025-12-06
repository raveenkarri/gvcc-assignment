const express = require("express");
const dbPromise = require("../db");
const auth = require("../middleware/auth");

const router = express.Router();

// POST /api/enquiries
router.post("/", async (req, res) => {
  try {
    const db = await dbPromise;
    const { product_id, name, email, phone, message } = req.body;

    if (!name || !email || !message) {
      return res
        .status(400)
        .json({ message: "Name, email and message are required" });
    }

    const sql = `
      INSERT INTO enquiries (product_id, name, email, phone, message)
      VALUES (?, ?, ?, ?, ?)
    `;

    const result = await db.run(
      sql,
      product_id || null,
      name,
      email,
      phone || null,
      message
    );

    return res.status(201).json({
      message: "Enquiry submitted successfully",
      enquiryId: result.lastID,
    });
  } catch (err) {
    console.error("Error creating enquiry:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

router.get("/", auth, async (req, res) => {
  try {
    const db = await dbPromise;

    const sql = `
      SELECT e.*, p.name AS product_name
      FROM enquiries e
      LEFT JOIN products p ON e.product_id = p.id
      ORDER BY e.created_at DESC
    `;

    const enquiries = await db.all(sql);

    return res.json({ data: enquiries });
  } catch (err) {
    console.error("Error fetching enquiries:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
