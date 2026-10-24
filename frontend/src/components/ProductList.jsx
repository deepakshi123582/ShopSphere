import React, { useEffect, useState } from "react";
import { fetchProducts } from "../services/api";
import ProductDetailModal from "./ProductDetailModal";

const categories = ["All", "Electronics", "Fashion", "Footwear", "Home", "Books"];

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProductId, setSelectedProductId] = useState(null);

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

  return (
    <div className="max-w-7xl mx-auto p-6">
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
          <p className="text-sm">Search query ya category filter change karke check karein.</p>
        </div>
      )}

      {!loading && !error && products.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              onClick={() => setSelectedProductId(product.id)}
              className="border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition cursor-pointer hover:-translate-y-1"
            >
              <img
                src={product.image || "https://via.placeholder.com/200"}
                alt={product.name}
                className="w-full h-48 object-cover rounded-lg mb-3"
              />
              <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                {product.category}
              </span>
              <h3 className="font-semibold text-gray-800 text-lg my-1 truncate">{product.name}</h3>
              <div className="flex items-center justify-between mt-3">
                <div>
                  <span className="font-bold text-lg text-gray-900">₹{product.price}</span>
                  {product.originalPrice && (
                    <span className="text-sm text-gray-400 line-through ml-2">₹{product.originalPrice}</span>
                  )}
                </div>
                <span className="text-yellow-500 font-bold text-sm">★ {product.rating || "4.5"}</span>
              </div>
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
            alert(`${product.name} added to cart!`);
            setSelectedProductId(null);
          }}
        />
      )}
    </div>
  );
};

export default ProductList;