import React from "react";

const CartDrawer = ({ isOpen, onClose, cartItems = [], onUpdateQuantity, onRemoveItem }) => {
  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col p-6 relative">
        <div className="flex items-center justify-between pb-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">Your Cart ({cartItems.length})</h2>
          <button onClick={onClose} className="text-2xl text-gray-400 hover:text-gray-600 font-bold">
            &times;
          </button>
        </div>

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
              onClick={() => alert("Checkout system active!")}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition shadow-md"
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;