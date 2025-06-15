// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "../api/axios";
import { motion } from "framer-motion";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post("/auth/login", form);
      login(res.data.user);
      navigate("/dashboard");

    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-gray-900 via-black to-gray-800 flex items-center justify-center relative overflow-hidden font-sans">
      {/* Background bubbles */}
      <motion.div
        animate={{ y: [0, 20, 0] }}
        transition={{ repeat: Infinity, duration: 6 }}
        className="absolute w-72 h-72 bg-purple-700 opacity-30 rounded-full -top-10 -left-10 blur-3xl"
      />
      <motion.div
        animate={{ y: [0, -20, 0] }}
        transition={{ repeat: Infinity, duration: 7 }}
        className="absolute w-96 h-96 bg-indigo-500 opacity-30 rounded-full -bottom-20 -right-20 blur-3xl"
      />

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 backdrop-blur-md bg-white/5 border border-white/10 rounded-3xl shadow-2xl p-10 w-full max-w-md text-white"
      >
        <h2 className="text-3xl font-bold text-center text-indigo-300 mb-8 drop-shadow">
          Sign In to CourseHub
        </h2>

        {error && (
          <div className="bg-red-500/10 text-red-300 p-3 mb-4 rounded text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm mb-1 text-gray-300">Email</label>
            <input
              type="email"
              name="email"
              onChange={handleChange}
              required
              placeholder="you@example.com"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-gray-300">Password</label>
            <input
              type="password"
              name="password"
              onChange={handleChange}
              required
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 transition rounded-lg font-semibold shadow-lg text-white"
          >
            Log In
          </button>
        </form>

        <p className="text-sm text-gray-400 text-center mt-6">
          Don’t have an account?{" "}
          <a href="/register" className="text-indigo-400 hover:underline">
            Register
          </a>
        </p>
      </motion.div>
    </div>
  );
}
