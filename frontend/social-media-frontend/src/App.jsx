import React, { useState, useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import Navbar from "./components/Navbar";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if a token exists in localStorage to determine authentication
    setIsAuthenticated(!!localStorage.getItem("token"));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
  };

  const handleLogin = () => {
    setIsAuthenticated(true); // Update authentication state
  };

  return (
    <BrowserRouter>
      {isAuthenticated && <Navbar onLogout={handleLogout} />}
      <AppRoutes isAuthenticated={isAuthenticated} onLogin={handleLogin} />
    </BrowserRouter>
  );
}

export default App;
