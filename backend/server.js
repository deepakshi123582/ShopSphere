const express = require("express");
const cors = require("cors");
require("dotenv").config();
const pool = require("./config/db");

// Import Routes
const authRoutes = require("./routes/auth");
const cartRoutes = require("./routes/cart");

const app = express();
const PORT = Number(process.env.PORT) || 5000;

app.use(cors());
app.use(express.json());

// Base Route
app.get("/", (req, res) => {
  res.status(200).send("ShopSphere API is running successfully!");
});

// Health Check API
app.get("/api/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.status(200).json({
      success: true,
      message: "ShopSphere backend and MySQL are working!",
      database: "connected"
    });
  } catch (error) {
    console.error("Health check error:", error.message);
    res.status(500).json({
      success: false,
      message: "Database connection failed."
    });
  }
});

// Fetch All Products (with Category & Search filter)
app.get("/api/products", async (req, res) => {
  try {
    const { category, search } = req.query;
    let sql = "SELECT id, name, category, price, originalPrice, rating, image FROM products";
    const conditions = [];
    const values = [];

    if (category && category.toLowerCase() !== "all") {
      conditions.push("LOWER(category) = LOWER(?)");
      values.push(category);
    }

    if (search && search.trim()) {
      conditions.push("LOWER(name) LIKE LOWER(?)");
      values.push(`%${search.trim()}%`);
    }

    if (conditions.length > 0) {
      sql += " WHERE " + conditions.join(" AND ");
    }

    sql += " ORDER BY id DESC";

    const [products] = await pool.query(sql, values);

    res.status(200).json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    console.error("Products API error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch products from database."
    });
  }
});

// Single Product API
app.get("/api/products/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID."
      });
    }

    const [products] = await pool.execute(
      "SELECT id, name, category, price, originalPrice, rating, image FROM products WHERE id = ?",
      [id]
    );

    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found."
      });
    }

    res.status(200).json({
      success: true,
      product: products[0]
    });
  } catch (error) {
    console.error("Single product API error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch product."
    });
  }
});

// MOUNT ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/cart", cartRoutes);

// 404 Fallback for unhandled /api routes
app.use("/api", (req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found."
  });
});

async function startServer() {
  try {
    await pool.query("SELECT 1");
    console.log("MySQL database connected successfully!");
    const server = app.listen(PORT, () => {
      console.log(`ShopSphere backend running on http://localhost:${PORT}`);
    });

    server.on("error", (error) => {
      console.error("HTTP server error:", error.stack || error);
    });
  } catch (error) {
    console.error("Database startup error:", error.stack || error);
    process.exitCode = 1;
  }
}

startServer().catch((error) => {
  console.error("Fatal startup error:", error.stack || error);
});