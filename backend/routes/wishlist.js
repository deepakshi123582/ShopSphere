const express = require("express");
const pool = require("../config/db");
const router = express.Router();

// Get Wishlist items for user
router.get("/:userId", async (req, res) => {
  try {
    const userId = Number(req.params.userId);
    const [items] = await pool.execute(
      `SELECT w.id AS wishlist_id, p.id AS product_id, p.name, p.price, p.image, p.category, p.rating 
       FROM wishlist w 
       JOIN products p ON w.product_id = p.id 
       WHERE w.user_id = ?`,
      [userId]
    );
    res.status(200).json({ success: true, wishlist: items });
  } catch (error) {
    console.error("Fetch wishlist error:", error.message);
    res.status(500).json({ success: false, message: "Failed to fetch wishlist." });
  }
});

// Toggle Wishlist Item (Add if not exists, Remove if exists)
router.post("/toggle", async (req, res) => {
  try {
    const { userId, productId } = req.body;
    if (!userId || !productId) {
      return res.status(400).json({ success: false, message: "User ID and Product ID required." });
    }

    const [existing] = await pool.execute(
      "SELECT id FROM wishlist WHERE user_id = ? AND product_id = ?",
      [userId, productId]
    );

    if (existing.length > 0) {
      await pool.execute("DELETE FROM wishlist WHERE id = ?", [existing[0].id]);
      return res.status(200).json({ success: true, isFavorited: false, message: "Removed from wishlist." });
    } else {
      await pool.execute("INSERT INTO wishlist (user_id, product_id) VALUES (?, ?)", [userId, productId]);
      return res.status(201).json({ success: true, isFavorited: true, message: "Added to wishlist!" });
    }
  } catch (error) {
    console.error("Wishlist toggle error:", error.message);
    res.status(500).json({ success: false, message: "Wishlist update failed." });
  }
});

module.exports = router;