import React, { useEffect, useState } from "react";
import { fetchProductById } from "../services/api";

const ProductDetailModal = ({ productId, onClose, onAddToCart }) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getProductDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchProductById(productId);
        if (data.success) {
          setProduct(data.product);
        } else {
          setError("Product details load nahi ho paayi.");
        }
      } catch (err) {
        console.error("Product detail fetch error:", err);
        setError("Product details fetch karne mein issue aaya.");
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      getProductDetails();
    }
  }, [productId]);

  if (!productId) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 relative shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition"
        >
          &times;
        </button>

        {loading && <div className="text-center py-12 text-gray-600">Product details loading...</div>}

        {error && <div className="text-center py-12 text-red-500 font-semibold">{error}</div>}

        {!loading && !error && product && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
            {/* Image */}
            <div className="flex items-center justify-center bg-gray-50 rounded-xl p-4">
              <img
                src={product.image || "https://via.placeholder.com/300"}
                alt={product.name}
                className="max-h-72 object-contain rounded-lg"
              />
            </div>

            {/* Info */}
            <div className="flex flex-col justify-between">
              <div>
                <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                  {product.category}
                </span>
                <h2 className="text-2xl font-bold text-gray-800 my-2">{product.name}</h2>
                
                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-yellow-100 text-yellow-800 text-sm font-semibold px-2.5 py-0.5 rounded">
                    ★ {product.rating || "4.5"}
                  </span>
                  <span className="text-xs text-gray-500">In Stock</span>
                </div>

                <div className="my-4">
                  <span className="text-3xl font-extrabold text-gray-900">₹{product.price}</span>
                  {product.originalPrice && (
                    <span className="text-lg text-gray-400 line-through ml-3">₹{product.originalPrice}</span>
                  )}
                </div>

                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                  {product.description || "High quality product with premium materials and long-lasting durability. Perfect for daily usage."}
                </p>
              </div>

              {/* Action Button */}
              <button
                onClick={() => onAddToCart && onAddToCart(product)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition shadow-md hover:shadow-lg"
              >
                Add to Cart
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailModal;