const express = require("express");
const pool = require("../config/db");
const router = express.Router();

// 1. Get User Cart Items
router.get("/:userId", async (req, res) => {
  try {
    const userId = Number(req.params.userId);
    if (!Number.isInteger(userId)) {
      return res.status(400).json({ success: false, message: "Invalid user ID." });
    }

    const [items] = await pool.execute(
      `SELECT c.id AS cart_id, c.quantity, p.id AS product_id, p.name, p.price, p.image, p.category 
       FROM cart c 
       JOIN products p ON c.product_id = p.id 
       WHERE c.user_id = ?`,
      [userId]
    );

    res.status(200).json({ success: true, cart: items });
  } catch (error) {
    console.error("Fetch cart error:", error.message);
    res.status(500).json({ success: false, message: "Failed to fetch cart items." });
  }
});

// 2. Add Item to Cart (or update quantity if already exists)
router.post("/add", async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;
    const qty = Number(quantity) || 1;

    if (!userId || !productId) {
      return res.status(400).json({ success: false, message: "User ID and Product ID are required." });
    }

    // Check if item already in cart
    const [existing] = await pool.execute(
      "SELECT id, quantity FROM cart WHERE user_id = ? AND product_id = ?",
      [userId, productId]
    );

    if (existing.length > 0) {
      const newQuantity = existing[0].quantity + qty;
      await pool.execute("UPDATE cart SET quantity = ? WHERE id = ?", [newQuantity, existing[0].id]);
      return res.status(200).json({ success: true, message: "Cart updated successfully!" });
    }

    await pool.execute(
      "INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)",
      [userId, productId, qty]
    );

    res.status(201).json({ success: true, message: "Product added to cart!" });
  } catch (error) {
    console.error("Add to cart error:", error.message);
    res.status(500).json({ success: false, message: "Failed to add product to cart." });
  }
});

// 3. Update Item Quantity
router.put("/update", async (req, res) => {
  try {
    const { cartId, quantity } = req.body;
    const qty = Number(quantity);

    if (!cartId || qty < 1) {
      return res.status(400).json({ success: false, message: "Valid Cart ID and quantity required." });
    }

    await pool.execute("UPDATE cart SET quantity = ? WHERE id = ?", [qty, cartId]);
    res.status(200).json({ success: true, message: "Quantity updated!" });
  } catch (error) {
    console.error("Update cart error:", error.message);
    res.status(500).json({ success: false, message: "Failed to update quantity." });
  }
});

// 4. Remove Item from Cart
router.delete("/remove/:cartId", async (req, res) => {
  try {
    const cartId = Number(req.params.cartId);
    await pool.execute("DELETE FROM cart WHERE id = ?", [cartId]);
    res.status(200).json({ success: true, message: "Item removed from cart." });
  } catch (error) {
    console.error("Remove cart error:", error.message);
    res.status(500).json({ success: false, message: "Failed to remove item." });
  }
});

module.exports = router;