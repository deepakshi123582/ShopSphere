const express = require("express");
const pool = require("../config/db");
const router = express.Router();

// Place Order API
router.post("/create", async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const { userId, items, totalAmount, shippingAddress } = req.body;

    if (!userId || !items || items.length === 0 || !shippingAddress) {
      return res.status(400).json({ success: false, message: "Missing required order details." });
    }

    await connection.beginTransaction();

    // 1. Insert into orders table
    const [orderResult] = await connection.execute(
      "INSERT INTO orders (user_id, total_amount, shipping_address) VALUES (?, ?, ?)",
      [userId, totalAmount, shippingAddress]
    );
    const orderId = orderResult.insertId;

    // 2. Insert order items
    for (const item of items) {
      await connection.execute(
        "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)",
        [orderId, item.product_id, item.quantity, item.price]
      );
    }

    // 3. Clear user's cart
    await connection.execute("DELETE FROM cart WHERE user_id = ?", [userId]);

    await connection.commit();
    res.status(201).json({ success: true, message: "Order placed successfully!", orderId });
  } catch (error) {
    await connection.rollback();
    console.error("Order creation error:", error.message);
    res.status(500).json({ success: false, message: "Failed to place order." });
  } finally {
    connection.release();
  }
});

// Get User Order History
router.get("/user/:userId", async (req, res) => {
  try {
    const userId = Number(req.params.userId);
    const [orders] = await pool.execute(
      "SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC",
      [userId]
    );
    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error("Fetch orders error:", error.message);
    res.status(500).json({ success: false, message: "Failed to fetch orders." });
  }
});

module.exports = router;