import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // <== NEW

  const login = (userData) => setUser(userData);
  const logout = () => setUser(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("/auth/me");
        setUser(res.data.user);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false); // <== Done loading
      }
    };

    fetchUser();
  }, []);

  if (loading) return <div>Loading...</div>; // ⏳ Optional: loading spinner here

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
