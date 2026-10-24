import React, { useEffect, useState } from "react";
import API from "../services/api";

const ProductDetailsModal = ({ productId, onClose, onAddToCart }) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!productId) return;
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/products/${productId}`);
        if (res.data.success) {
          setProduct(res.data.product);
        }
      } catch (err) {
        console.error("Fetch product detail error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  if (!productId) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold"
        >
          &times;
        </button>

        {loading ? (
          <div className="text-center py-12 text-gray-500 font-medium">Loading product details...</div>
        ) : product ? (
          <div className="space-y-4">
            <img
              src={product.image || "https://via.placeholder.com/300"}
              alt={product.name}
              className="w-full h-56 object-cover rounded-xl"
            />
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-2.5 py-1 rounded-md">
              {product.category}
            </span>
            <h2 className="text-2xl font-bold text-gray-800">{product.name}</h2>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-black text-gray-900">₹{product.price}</span>
              <span className="text-amber-500 font-bold text-sm bg-amber-50 px-2.5 py-1 rounded-md">
                ★ {product.rating || "4.5"}
              </span>
            </div>
            <button
              onClick={() => onAddToCart(product)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition shadow-md"
            >
              Add to Cart
            </button>
          </div>
        ) : (
          <div className="text-center py-8 text-red-500 font-semibold">Product load nahi ho paaya.</div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailsModal;