import React, { useEffect, useState } from "react";
import { fetchProducts, fetchCart, addToCart, updateCartQuantity, removeFromCart } from "../services/api";
import ProductDetailModal from "./ProductDetailsModal";
import CartDrawer from "./CartDrawer";

const categories = [
  "All", 
  "Beauty", 
  "Skincare", 
  "Haircare", 
  "Fragrance", 
  "Electronics", 
  "Fashion", 
  "Footwear", 
  "Home", 
  "Books"
];

const DEMO_USER_ID = 1;

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProductId, setSelectedProductId] = useState(null);

  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

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

  const handleAddToCart = async (product) => {
    try {
      await addToCart(DEMO_USER_ID, product.id || product.product_id, 1);
      await loadCart();
      setIsCartOpen(true);
    } catch (err) {
      alert("Cart me item add nahi ho paya.");
    }
  };

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

  const handleRemoveItem = async (item) => {
    try {
      await removeFromCart(item.cart_id);
      await loadCart();
    } catch (err) {
      console.error("Remove item error:", err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Search Bar & Nykaa-Style Category Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <input
          type="text"
          placeholder="🔍 Search lipstick, skincare, perfumes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full md:w-1/3 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition"
        />

        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
                selectedCategory.toLowerCase() === cat.toLowerCase()
                  ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {loading && <div className="text-center py-20 text-gray-500 font-medium">Loading products...</div>}

      {error && <div className="text-center py-20 text-red-500 font-semibold">{error}</div>}

      {!loading && !error && products.length === 0 && (
        <div className="text-center py-20 text-gray-500">
          <p className="text-lg font-medium">Is category me koi product nahi mila.</p>
        </div>
      )}

      {!loading && !error && products.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div onClick={() => setSelectedProductId(product.id)} className="cursor-pointer">
                <div className="overflow-hidden rounded-xl bg-gray-50 mb-4 h-48 flex items-center justify-center">
                  <img
                    src={product.image || "https://via.placeholder.com/200"}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                </div>
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-1 rounded-md">
                  {product.category}
                </span>
                <h3 className="font-bold text-gray-800 text-base mt-2 truncate">{product.name}</h3>
                <div className="flex items-center justify-between mt-3">
                  <span className="font-extrabold text-lg text-gray-900">₹{product.price}</span>
                  <span className="text-amber-500 font-bold text-xs bg-amber-50 px-2 py-1 rounded-md">
                    ★ {product.rating || "4.5"}
                  </span>
                </div>
              </div>

              <button
                onClick={() => handleAddToCart(product)}
                className="w-full mt-4 bg-gray-900 hover:bg-blue-600 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors shadow-sm"
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      )}

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