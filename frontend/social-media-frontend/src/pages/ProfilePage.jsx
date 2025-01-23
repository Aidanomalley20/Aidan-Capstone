import React from "react";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const navigate = useNavigate();

  // Mock user data (replace with API fetch if needed)
  const user = JSON.parse(localStorage.getItem("user")) || {
    username: "testuser",
    firstName: "John",
    lastName: "Doe",
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-indigo-600 mb-6">
          Welcome, {user.firstName} {user.lastName}!
        </h1>
        <p className="text-center text-gray-600 mb-6">@{user.username}</p>
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
