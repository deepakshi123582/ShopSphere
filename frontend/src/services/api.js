import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Products
export const fetchProducts = async (category = "All", search = "") => {
  const params = {};
  if (category && category !== "All") params.category = category;
  if (search && search.trim() !== "") params.search = search.trim();

  const response = await API.get("/products", { params });
  return response.data;
};

export const fetchProductById = async (id) => {
  const response = await API.get(`/products/${id}`);
  return response.data;
};

// Cart APIs
export const fetchCart = async (userId) => {
  const response = await API.get(`/cart/${userId}`);
  return response.data;
};

export const addToCart = async (userId, productId, quantity = 1) => {
  const response = await API.post("/cart/add", { userId, productId, quantity });
  return response.data;
};

export const updateCartQuantity = async (cartId, quantity) => {
  const response = await API.put("/cart/update", { cartId, quantity });
  return response.data;
};

export const removeFromCart = async (cartId) => {
  const response = await API.delete(`/cart/remove/${cartId}`);
  return response.data;
};

export default API;