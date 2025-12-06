const express = require("express");
const cors = require("cors");
require("dotenv").config();

const productsRouter = require("./routes/products");
const enquiriesRouter = require("./routes/enquiries");
const userRouter = require("./routes/user");

require("./db");

const app = express();
const PORT = process.env.PORT || 5000;



const allowedOrigins = [
  "http://localhost:3000",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true
  })
);

app.use(express.json());


app.get("/", (req, res) => {
  res.json({ message: "Backend API is running" });
});

app.use("/api/products", productsRouter);
app.use("/api/enquiries", enquiriesRouter);
app.use("/api/users", userRouter);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
