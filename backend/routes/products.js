const express = require("express");
const dbPromise = require("../db");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const db = await dbPromise;
    const { search = "", category = "", page = 1, limit = 8 } = req.query;

    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 8;
    const offset = (pageNum - 1) * limitNum;

    const params = [];
    const whereClauses = [];

    if (search) {
      whereClauses.push(
        "(name LIKE ? OR short_desc LIKE ? OR long_desc LIKE ?)"
      );
      const like = `%${search}%`;
      params.push(like, like, like);
    }

    if (category) {
      whereClauses.push("category = ?");
      params.push(category);
    }

    const whereSql =
      whereClauses.length > 0 ? `WHERE ${whereClauses.join(" AND ")}` : "";

    const baseSql = `FROM products ${whereSql}`;

    const countSql = `SELECT COUNT(*) AS total ${baseSql}`;
    const dataSql = `SELECT * ${baseSql} ORDER BY created_at DESC LIMIT ? OFFSET ?`;

    const countRow = await db.get(countSql, params);
    const total = countRow ? countRow.total : 0;

    const dataParams = [...params, limitNum, offset];
    const products = await db.all(dataSql, dataParams);

    return res.json({
      data: products,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (err) {
    console.error("Error fetching products:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const db = await dbPromise;
    const { id } = req.params;

    const product = await db.get("SELECT * FROM products WHERE id = ?", id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.json({ data: product });
  } catch (err) {
    console.error("Error fetching product:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
