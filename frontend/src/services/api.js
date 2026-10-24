import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor to attach JWT token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Fetch Products
export const fetchProducts = async (category = "All", search = "") => {
  try {
    const response = await API.get("/products", {
      params: { category, search },
    });
    return response.data;
  } catch (error) {
    console.error("fetchProducts error:", error.response?.data || error.message);
    return { success: false, products: [] };
  }
};

// Cart Operations
export const fetchCart = async (userId) => {
  try {
    const response = await API.get(`/cart/${userId}`);
    return response.data;
  } catch (error) {
    console.error("fetchCart error:", error.response?.data || error.message);
    return { success: false, cart: [] };
  }
};

export const addToCart = async (userId, productId, quantity = 1) => {
  try {
    const response = await API.post("/cart/add", { userId, productId, quantity });
    return response.data;
  } catch (error) {
    console.error("addToCart error:", error.response?.data || error.message);
    throw error;
  }
};

export const updateCartQuantity = async (cartId, quantity) => {
  try {
    const response = await API.put("/cart/update", { cartId, quantity });
    return response.data;
  } catch (error) {
    console.error("updateCartQuantity error:", error.response?.data || error.message);
    throw error;
  }
};

export const removeFromCart = async (cartId) => {
  try {
    const response = await API.delete(`/cart/remove/${cartId}`);
    return response.data;
  } catch (error) {
    console.error("removeFromCart error:", error.response?.data || error.message);
    throw error;
  }
};

export default API;