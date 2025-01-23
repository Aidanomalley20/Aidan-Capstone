import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import ProfilePage from "../pages/ProfilePage";
import RegisterPage from "../pages/RegisterPage";

const AppRoutes = ({ isAuthenticated, onLogin }) => {
  console.log("AppRoutes isAuthenticated:", isAuthenticated); // Debugging

  return (
    <Routes>
      {!isAuthenticated ? (
        // Unauthenticated routes
        <>
          <Route path="/login" element={<LoginPage onLogin={onLogin} />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </>
      ) : (
        // Authenticated routes
        <>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </>
      )}
    </Routes>
  );
};

export default AppRoutes;
