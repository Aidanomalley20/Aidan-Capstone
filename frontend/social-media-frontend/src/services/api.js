import axios from "axios";

const api = axios.create({
  baseURL: "https://aidan-capstone.onrender.com/api",
});

export default api;
