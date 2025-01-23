import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService";

const LoginPage = ({ onLogin }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login(formData);
      console.log("Login successful, token:", response.token);

      // Save the token and user info in localStorage
      localStorage.setItem("token", response.token);
      localStorage.setItem(
        "user",
        JSON.stringify({ username: "testuser", firstName: "John", lastName: "Doe" })
      );

      onLogin(); // Update the app state
      setMessage("Login successful!");
      console.log("Redirecting to home...");
      navigate("/"); // Redirect to home
    } catch (error) {
      console.error(error.response?.data || "Error occurred during login.");
      setMessage("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-indigo-600 mb-6">Login</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            className="block w-full p-3 mb-4 border rounded-lg"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            autoComplete="current-password" // Fix for autocomplete warning
            value={formData.password}
            onChange={handleInputChange}
            className="block w-full p-3 mb-4 border rounded-lg"
            required
          />
          <button
            type="submit"
            className="w-full bg-indigo-500 text-white py-3 rounded-lg hover:bg-indigo-600 transition"
          >
            Login
          </button>
        </form>
        {message && <p className="text-center mt-4 text-red-500">{message}</p>}
      </div>
    </div>
  );
};

export default LoginPage;
