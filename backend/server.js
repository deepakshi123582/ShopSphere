const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("ShopSphere API is running successfully!");
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "ShopSphere backend is working!",
  });
});

app.listen(PORT, () => {
  console.log(`ShopSphere backend running on http://localhost:${PORT}`);
});