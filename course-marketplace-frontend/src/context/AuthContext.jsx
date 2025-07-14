// course-marketplace-frontend/src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Start true to block rendering

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = async () => {
    try {
      await axios.post("/auth/logout", {}, { withCredentials: true });
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setUser(null);
      localStorage.removeItem("user");
    }
  };

useEffect(() => {
  const validateSession = async () => {
    setLoading(true); // ensure loading is true during check
    try {
      const res = await axios.get("/auth/me", { withCredentials: true });
      setUser(res.data.user);
      localStorage.setItem("user", JSON.stringify(res.data.user));
    } catch (err) {
      console.warn("Session invalid, logging out...");
      setUser(null);
      localStorage.removeItem("user");
    } finally {
      setLoading(false); // done checking
    }
  };

  validateSession();
}, []);


  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
