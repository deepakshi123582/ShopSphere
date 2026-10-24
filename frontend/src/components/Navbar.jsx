import React from "react";

const Navbar = ({ onOpenCart, onOpenAuth, user, onLogout, cartCount }) => {
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-2 cursor-pointer">
          <span className="text-2xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            ShopSphere
          </span>
        </div>

        {/* User & Cart Controls */}
        <div className="flex items-center gap-3 sm:gap-4">
          {user ? (
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-700 hidden sm:inline">
                Hi, {user.name}
              </span>
              <button
                onClick={onLogout}
                className="text-xs sm:text-sm font-medium text-red-600 hover:text-red-800 px-2 py-1 rounded hover:bg-red-50 transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="text-xs sm:text-sm font-semibold text-gray-700 hover:text-blue-600 px-3 py-1.5 rounded-lg border border-gray-300 hover:border-blue-600 transition"
            >
              Sign In
            </button>
          )}

          {/* Cart Button */}
          <button
            onClick={onOpenCart}
            className="relative bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-1.5 rounded-lg text-sm font-semibold transition flex items-center gap-1.5 shadow-sm"
          >
            <span>🛒</span>
            <span className="hidden sm:inline">Cart</span>
            {cartCount > 0 && (
              <span className="bg-white text-blue-600 text-xs font-bold px-1.5 py-0.2 rounded-full ml-0.5">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;