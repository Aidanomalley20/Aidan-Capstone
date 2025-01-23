import React from "react";
import { NavLink } from "react-router-dom";

const Navbar = ({ onLogout }) => {
  return (
    <nav className="bg-gradient-to-r from-blue-500 to-indigo-500 shadow-lg">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">
          <NavLink to="/">Social Media App</NavLink>
        </h1>
        <div className="flex space-x-4">
          <NavLink
            to="/profile"
            className="bg-white text-indigo-600 px-4 py-1 rounded shadow hover:bg-indigo-100"
          >
            Profile
          </NavLink>
          <button
            onClick={onLogout}
            className="bg-red-500 text-white px-4 py-1 rounded shadow hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
