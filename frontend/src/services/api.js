import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

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

export default API;