import React, { useState } from "react";
import { checkoutOrder } from "../services/api";

const DEMO_USER_ID = 1;

const CartDrawer = ({ isOpen, onClose, cartItems = [], onUpdateQuantity, onRemoveItem, onOrderSuccess }) => {
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    pincode: "",
    addressLine: "",
    city: "",
    state: "",
  });

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleInputChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const payload = {
        userId: DEMO_USER_ID,
        cartItems: cartItems,
        totalAmount: subtotal,
        shippingAddress: address,
      };

      const res = await checkoutOrder(payload);
      if (res.success) {
        alert(`🎉 Order Placed Successfully! Order ID: #${res.orderId}`);
        setShowAddressForm(false);
        onClose();
        if (onOrderSuccess) onOrderSuccess();
      }
    } catch (err) {
      alert("Order placement failed. Please check inputs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col p-6 relative overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">
            {showAddressForm ? "Shipping Address" : `Your Cart (${cartItems.length})`}
          </h2>
          <button onClick={onClose} className="text-2xl text-gray-400 hover:text-gray-600 font-bold">
            &times;
          </button>
        </div>

        {!showAddressForm ? (
          <>
            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              {cartItems.length === 0 ? (
                <div className="text-center py-12 text-gray-400 font-medium">Your cart is empty.</div>
              ) : (
                cartItems.map((item) => (
                  <div key={item.cart_id || item.id} className="flex items-center justify-between border-b pb-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image || "https://via.placeholder.com/60"}
                        alt={item.name}
                        className="w-14 h-14 object-cover rounded-lg"
                      />
                      <div>
                        <h4 className="font-semibold text-gray-800 text-sm">{item.name}</h4>
                        <span className="text-xs text-gray-500">₹{item.price} each</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onUpdateQuantity(item, item.quantity - 1)}
                        className="px-2 py-0.5 bg-gray-200 rounded font-bold text-gray-700"
                      >
                        -
                      </button>
                      <span className="text-sm font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item, item.quantity + 1)}
                        className="px-2 py-0.5 bg-gray-200 rounded font-bold text-gray-700"
                      >
                        +
                      </button>
                      <button
                        onClick={() => onRemoveItem(item)}
                        className="text-red-500 hover:text-red-700 ml-2 text-sm"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="border-t pt-4 space-y-3">
                <div className="flex justify-between font-bold text-lg text-gray-900">
                  <span>Total:</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <button
                  onClick={() => setShowAddressForm(true)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition shadow-md"
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </>
        ) : (
          <form onSubmit={handlePlaceOrder} className="py-4 space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-600 uppercase">Full Name</label>
              <input
                type="text"
                name="fullName"
                required
                value={address.fullName}
                onChange={handleInputChange}
                className="w-full mt-1 p-2 border rounded-lg text-sm"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-600 uppercase">Phone Number</label>
              <input
                type="text"
                name="phone"
                required
                value={address.phone}
                onChange={handleInputChange}
                className="w-full mt-1 p-2 border rounded-lg text-sm"
                placeholder="9876543210"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-bold text-gray-600 uppercase">Pincode</label>
                <input
                  type="text"
                  name="pincode"
                  required
                  value={address.pincode}
                  onChange={handleInputChange}
                  className="w-full mt-1 p-2 border rounded-lg text-sm"
                  placeholder="110001"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 uppercase">City</label>
                <input
                  type="text"
                  name="city"
                  required
                  value={address.city}
                  onChange={handleInputChange}
                  className="w-full mt-1 p-2 border rounded-lg text-sm"
                  placeholder="Delhi"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-600 uppercase">State</label>
              <input
                type="text"
                name="state"
                required
                value={address.state}
                onChange={handleInputChange}
                className="w-full mt-1 p-2 border rounded-lg text-sm"
                placeholder="Delhi"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-600 uppercase">Address Line</label>
              <textarea
                name="addressLine"
                required
                rows="2"
                value={address.addressLine}
                onChange={handleInputChange}
                className="w-full mt-1 p-2 border rounded-lg text-sm"
                placeholder="House No, Street Area"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddressForm(false)}
                className="w-1/2 bg-gray-200 text-gray-800 font-bold py-2.5 rounded-xl text-sm"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="w-1/2 bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 rounded-xl text-sm transition"
              >
                {loading ? "Placing..." : "Confirm Order"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;