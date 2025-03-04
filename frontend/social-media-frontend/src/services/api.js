import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://aidan-capstone.onrender.com/api",
});

export default api;
