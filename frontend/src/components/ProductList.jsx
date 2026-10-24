import React, { useEffect, useState } from "react";
import { fetchProducts, fetchCart, addToCart, updateCartQuantity, removeFromCart } from "../services/api";
import ProductDetailModal from "./ProductDetailsModal"; // Fixed file import path matching Explorer
import CartDrawer from "./CartDrawer";

const categories = ["All", "Electronics", "Fashion", "Footwear", "Home", "Books"];
const DEMO_USER_ID = 1; // Guest/logged user ID for cart synchronization

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProductId, setSelectedProductId] = useState(null);

  // Cart State
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load Cart Data
  const loadCart = async () => {
    try {
      const data = await fetchCart(DEMO_USER_ID);
      if (data.success) {
        setCartItems(data.cart);
      }
    } catch (err) {
      console.error("Cart sync error:", err);
    }
  };

  useEffect(() => {
    loadCart();

    // Listen for openCart event dispatched from Navbar
    const handleOpenCartEvent = () => setIsCartOpen(true);
    window.addEventListener("openCart", handleOpenCartEvent);
    return () => window.removeEventListener("openCart", handleOpenCartEvent);
  }, []);

  useEffect(() => {
    const getProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchProducts(selectedCategory, searchQuery);
        if (data.success) {
          setProducts(data.products);
        } else {
          setError("Products load nahi ho paye.");
        }
      } catch (err) {
        console.error("API Fetch Error:", err);
        setError("Server se products load karte waqt error aaya.");
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      getProducts();
    }, 300);

    return () => clearTimeout(timer);
  }, [selectedCategory, searchQuery]);

  // Handle Add to Cart
  const handleAddToCart = async (product) => {
    try {
      await addToCart(DEMO_USER_ID, product.id || product.product_id, 1);
      await loadCart();
      setIsCartOpen(true);
    } catch (err) {
      alert("Cart me item add nahi ho paya.");
    }
  };

  // Handle Quantity Change
  const handleUpdateQuantity = async (item, newQuantity) => {
    if (newQuantity < 1) {
      handleRemoveItem(item);
      return;
    }
    try {
      await updateCartQuantity(item.cart_id, newQuantity);
      await loadCart();
    } catch (err) {
      console.error("Quantity update error:", err);
    }
  };

  // Handle Remove Item
  const handleRemoveItem = async (item) => {
    try {
      await removeFromCart(item.cart_id);
      await loadCart();
    } catch (err) {
      console.error("Remove item error:", err);
    }
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Navigation Header with Cart Button */}
      <div className="flex items-center justify-between pb-6 mb-6 border-b">
        <h1 className="text-2xl font-extrabold text-blue-600">ShopSphere</h1>
        <button
          onClick={() => setIsCartOpen(true)}
          className="relative bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg font-semibold text-gray-800 transition flex items-center gap-2"
        >
          🛒 Cart
          {totalCartCount > 0 && (
            <span className="bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {totalCartCount}
            </span>
          )}
        </button>
      </div>

      {/* Search Bar & Category Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
                selectedCategory.toLowerCase() === cat.toLowerCase()
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {loading && <div className="text-center py-12 text-lg text-gray-600">Loading products...</div>}

      {error && <div className="text-center py-12 text-red-500 font-semibold">{error}</div>}

      {!loading && !error && products.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg font-medium">Koi product nahi mila.</p>
        </div>
      )}

      {!loading && !error && products.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div onClick={() => setSelectedProductId(product.id)} className="cursor-pointer">
                <img
                  src={product.image || "https://via.placeholder.com/200"}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-lg mb-3"
                />
                <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                  {product.category}
                </span>
                <h3 className="font-semibold text-gray-800 text-lg my-1 truncate">{product.name}</h3>
                <div className="flex items-center justify-between mt-2">
                  <span className="font-bold text-lg text-gray-900">₹{product.price}</span>
                  <span className="text-yellow-500 font-bold text-sm">★ {product.rating || "4.5"}</span>
                </div>
              </div>

              <button
                onClick={() => handleAddToCart(product)}
                className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2 rounded-lg transition"
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Product Detail Modal View */}
      {selectedProductId && (
        <ProductDetailModal
          productId={selectedProductId}
          onClose={() => setSelectedProductId(null)}
          onAddToCart={(product) => {
            handleAddToCart(product);
            setSelectedProductId(null);
          }}
        />
      )}

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
      />
    </div>
  );
};

export default ProductList;