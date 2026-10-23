import React, { useEffect, useState } from "react";
import { fetchProducts } from "../services/api";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getProducts = async () => {
      try {
        setLoading(true);
        const data = await fetchProducts();
        if (data.success) {
          setProducts(data.products);
        } else {
          setError("Products load nahi ho paye.");
        }
      } catch (err) {
        console.error("API Fetch Error:", err);
        setError("Backend server se connect nahi ho pa raha hai.");
      } finally {
        setLoading(false);
      }
    };

    getProducts();
  }, []);

  if (loading) {
    return <div className="text-center py-10 text-xl">Loading products...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
      {products.map((product) => (
        <div key={product.id} className="border rounded-lg p-4 shadow hover:shadow-lg transition">
          <img
            src={product.image || "https://via.placeholder.com/150"}
            alt={product.name}
            className="w-full h-48 object-cover rounded-md mb-3"
          />
          <span className="text-xs text-gray-500 uppercase tracking-wide">{product.category}</span>
          <h3 className="font-semibold text-lg my-1">{product.name}</h3>
          <div className="flex items-center justify-between mt-2">
            <div>
              <span className="font-bold text-lg">₹{product.price}</span>
              {product.originalPrice && (
                <span className="text-sm text-gray-400 line-through ml-2">₹{product.originalPrice}</span>
              )}
            </div>
            <span className="text-yellow-500 font-bold">★ {product.rating || "4.5"}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductList;