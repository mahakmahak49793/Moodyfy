import { Outlet, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "./Navbar";

const Layout = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check login status on mount and when localStorage changes
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    // Remove JWT token and user data from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user"); // Remove user data if stored
    
    // Update state
    setIsLoggedIn(false);
    
    // Redirect to home page
    navigate("/");
    
  };

  return (
    <>
      <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default Layout;