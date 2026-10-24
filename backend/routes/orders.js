const express = require("express");
const router = express.Router();
const db = require("../config/db");

// POST /api/orders/checkout
router.post("/checkout", async (req, res) => {
  const { userId, cartItems, totalAmount, shippingAddress } = req.body;

  if (!userId || !cartItems || cartItems.length === 0 || !shippingAddress) {
    return res.status(400).json({ success: false, message: "Missing required order details." });
  }

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    // 1. Save Shipping Address
    const [addressResult] = await connection.query(
      `INSERT INTO user_addresses (user_id, full_name, phone, pincode, address_line, city, state)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        shippingAddress.fullName,
        shippingAddress.phone,
        shippingAddress.pincode,
        shippingAddress.addressLine,
        shippingAddress.city,
        shippingAddress.state,
      ]
    );

    const addressId = addressResult.insertId;

    // 2. Create Master Order Record
    const [orderResult] = await connection.query(
      `INSERT INTO orders (user_id, total_amount, status) VALUES (?, ?, 'PLACED')`,
      [userId, totalAmount]
    );

    const orderId = orderResult.insertId;

    // 3. Insert Individual Items into order_items Table
    const orderItemsData = cartItems.map((item) => [
      orderId,
      item.product_id || item.id,
      item.quantity,
      item.price,
    ]);

    await connection.query(
      `INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ?`,
      [orderItemsData]
    );

    // 4. Clear User Cart After Successful Order Placement
    await connection.query(`DELETE FROM cart WHERE user_id = ?`, [userId]);

    await connection.commit();

    res.status(201).json({
      success: true,
      message: "Order placed successfully!",
      orderId: orderId,
    });
  } catch (error) {
    await connection.rollback();
    console.error("Checkout transaction error:", error);
    res.status(500).json({ success: false, message: "Order processing failed.", error: error.message });
  } finally {
    connection.release();
  }
});

// GET /api/orders/user/:userId - Get User Order History
router.get("/user/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const [orders] = await db.query(
      `SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC`,
      [userId]
    );
    res.json({ success: true, orders });
  } catch (error) {
    console.error("Fetch orders error:", error);
    res.status(500).json({ success: false, message: "Error fetching orders." });
  }
});

module.exports = router;