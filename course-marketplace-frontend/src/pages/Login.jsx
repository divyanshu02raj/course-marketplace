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
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // Show password state

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true); // start spinner
    try {
      const res = await axios.post("/auth/login", form);
      login(res.data.user);
      navigate("/dashboard");

    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
    finally {
    setLoading(false); // stop spinner
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
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"} // Toggle between text and password
                name="password"
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 focus:outline-none"
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 12c0 2.21-1.79 4-4 4s-4-1.79-4-4 1.79-4 4-4 4 1.79 4 4z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M2.458 12C3.732 7.943 7.936 5 12 5c4.064 0 8.268 2.943 9.542 7-1.274 4.057-5.478 7-9.542 7-4.064 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 12c0 2.21-1.79 4-4 4s-4-1.79-4-4 1.79-4 4-4 4 1.79 4 4z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M2.458 12C3.732 7.943 7.936 5 12 5c4.064 0 8.268 2.943 9.542 7-1.274 4.057-5.478 7-9.542 7-4.064 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-semibold shadow-lg text-white transition ${
              loading ? "bg-indigo-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Logging in...</span>
              </div>
            ) : (
              "Log In"
            )}
          </button>
        </form>

        <p className="text-sm text-gray-400 text-center mt-6">
          Don’t have an account?{" "}
          <a href="/register" className="text-indigo-400 hover:underline">
            Register
          </a>
        </p>
        <div className="mt-6 text-center">
  <button
    type="button"
    onClick={() => navigate("/")}
    className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-400 rounded-lg text-white font-semibold shadow-md transform hover:scale-105 hover:translate-y-1 hover:shadow-lg hover:shadow-indigo-500 hover:text-gray-100 hover:animate-bounce transition-all duration-300 ease-in-out"
  >
    ← Back to Home
  </button>
</div>

      </motion.div>
    </div>
  );
}
