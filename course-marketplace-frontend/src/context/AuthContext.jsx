import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = (userData) => setUser(userData);
const logout = async () => {
  try {
    await axios.post("/auth/logout", {}, { withCredentials: true }); // <-- include credentials
  } catch (err) {
    console.error("Logout failed:", err);
  } finally {
    setUser(null); // Clear local state regardless
  }
};



useEffect(() => {
  const fetchUser = async () => {
    try {
      const res = await axios.get("/auth/me");
      console.log("Fetched user:", res.data.user); // <-- Add this line
      setUser(res.data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  fetchUser();
}, []);


  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ This is required for components to consume AuthContext
export const useAuth = () => useContext(AuthContext);
