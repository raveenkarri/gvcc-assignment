const sqlite3 = require("sqlite3").verbose();
const { open } = require("sqlite");
const path = require("path");

async function initDB() {
  const db = await open({
    filename: path.join(__dirname, "database.db"),
    driver: sqlite3.Database,
  });

  await db.exec("PRAGMA foreign_keys = ON");

  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT,
      short_desc TEXT,
      long_desc TEXT,
      price DECIMAL(10, 2),
      image_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS enquiries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      message TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (product_id) REFERENCES products(id)
    )
  `);

  const row = await db.get("SELECT COUNT(*) AS count FROM products");
  if (row.count === 0) {
    console.log("Seeding sample products...");

    const products = [
      [
        "Wireless Mouse",
        "Electronics",
        "Compact wireless mouse",
        "A smooth and responsive 2.4 GHz wireless mouse, perfect for everyday use with laptops and desktops.",
        799.0,
        "https://via.placeholder.com/300x200?text=Wireless+Mouse",
      ],
      [
        "Mechanical Keyboard",
        "Electronics",
        "Tactile mechanical keyboard",
        "Backlit mechanical keyboard with blue switches, ideal for programmers and gamers.",
        3499.0,
        "https://via.placeholder.com/300x200?text=Mechanical+Keyboard",
      ],
      [
        "Noise Cancelling Headphones",
        "Electronics",
        "Over-ear noise cancelling",
        "Comfortable over-ear headphones with active noise cancellation and long battery life.",
        5999.0,
        "https://via.placeholder.com/300x200?text=Headphones",
      ],
      [
        "JavaScript: The Good Parts",
        "Books",
        "JS concepts book",
        "Classic JavaScript book covering the most important and elegant parts of the language.",
        499.0,
        "https://via.placeholder.com/300x200?text=JS+Book",
      ],
      [
        "Clean Code",
        "Books",
        "Clean code practices",
        "A handbook of agile software craftsmanship, focusing on writing clean and maintainable code.",
        899.0,
        "https://via.placeholder.com/300x200?text=Clean+Code",
      ],
      [
        "Cotton T-Shirt",
        "Clothing",
        "Basic cotton t-shirt",
        "Soft 100% cotton unisex t-shirt, perfect for daily wear.",
        399.0,
        "https://via.placeholder.com/300x200?text=T-Shirt",
      ],
      [
        "Stainless Steel Water Bottle",
        "Home & Kitchen",
        "Insulated water bottle",
        "Double-wall insulated steel bottle that keeps drinks cold for 24 hours and hot for 12 hours.",
        699.0,
        "https://via.placeholder.com/300x200?text=Water+Bottle",
      ],
      [
        "Ergonomic Office Chair",
        "Furniture",
        "Adjustable office chair",
        "Ergonomic chair with lumbar support, height adjustment, and breathable mesh back.",
        7499.0,
        "https://via.placeholder.com/300x200?text=Office+Chair",
      ],
    ];

    const insertSql = `
      INSERT INTO products (name, category, short_desc, long_desc, price, image_url)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const stmt = await db.prepare(insertSql);
    try {
      for (const p of products) {
        await stmt.run(p);
      }
    } finally {
      await stmt.finalize();
    }

    console.log("Sample products inserted");
  } else {
    console.log(`products table already has ${row.count} rows, skipping seed.`);
  }

  console.log("DB initialized");
  return db;
}

// Export a promise that resolves to the db
const dbPromise = initDB().catch((err) => {
  console.error("Error initializing DB:", err);
  process.exit(1);
});

module.exports = dbPromise;
