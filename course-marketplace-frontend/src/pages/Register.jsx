// course-marketplace-frontend\src\pages\Register.jsx
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "../api/axios";
import { motion } from "framer-motion";
import { GoogleLogin } from '@react-oauth/google';
import toast from 'react-hot-toast';

export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const roleFromQuery = queryParams.get("role") || "student";

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: roleFromQuery,
    phone: "", 
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post("/auth/register", form);
      login(res.data.user);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  // Handler for successful Google Sign-Up
  const handleGoogleSuccess = async (credentialResponse) => {
    const toastId = toast.loading("Signing up with Google...");
    try {
        const res = await axios.post('/auth/google-login', {
            token: credentialResponse.credential,
            // Pass the role selected on the previous page (or the default)
            role: form.role 
        });
        login(res.data.user);
        toast.success("Signed up successfully!", { id: toastId });
        navigate("/dashboard");
    } catch (err) {
        toast.error(err.response?.data?.message || "Google Sign-Up failed.", { id: toastId });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-gray-900 via-black to-gray-800 flex items-center justify-center relative overflow-hidden font-sans p-4">
      {/* Background visuals */}
      <motion.div
        animate={{ y: [0, 30, 0] }}
        transition={{ repeat: Infinity, duration: 7 }}
        className="absolute w-72 h-72 bg-indigo-700 opacity-30 rounded-full -top-16 -left-16 blur-3xl"
      />
      <motion.div
        animate={{ y: [0, -30, 0] }}
        transition={{ repeat: Infinity, duration: 8 }}
        className="absolute w-96 h-96 bg-purple-500 opacity-30 rounded-full -bottom-24 -right-24 blur-3xl"
      />

      {/* Form Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 backdrop-blur-md bg-white/5 border border-white/10 rounded-3xl shadow-2xl p-8 sm:p-10 w-full max-w-md text-white"
      >
        <h2 className="text-3xl font-bold text-center text-indigo-300 mb-6 drop-shadow">
          Create Your Account
        </h2>

        {error && (
          <div className="bg-red-500/10 text-red-300 p-3 mb-4 rounded text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1 text-gray-300">Full Name</label>
            <input
              name="name" type="text" onChange={handleChange} required placeholder="John Doe"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-gray-300">Email</label>
            <input
              name="email" type="email" onChange={handleChange} required placeholder="you@example.com"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm mb-1 text-gray-300">Phone Number</label>
            <input
              name="phone" type="tel" onChange={handleChange} placeholder="+1 234 567 8900"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-gray-300">Password</label>
            <div className="relative">
              <input
                name="password" type={showPassword ? "text" : "password"} onChange={handleChange} required placeholder="••••••••"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 focus:outline-none"
              >
                {/* SVG for show/hide password */}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm mb-1 text-gray-300">Register as</label>
            <select
              name="role" value={form.role} onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-700 text-white border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="student" className="text-black">Student</option>
              <option value="instructor" className="text-black">Instructor</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 transition rounded-lg font-semibold shadow-lg text-white"
          >
            Create Account
          </button>
        </form>

        <div className="my-6 flex items-center">
            <div className="flex-grow border-t border-gray-600"></div>
            <span className="flex-shrink mx-4 text-gray-400 text-sm">OR</span>
            <div className="flex-grow border-t border-gray-600"></div>
        </div>
        <div className="flex justify-center">
            <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => {
                    toast.error('Google Sign-Up failed. Please try again.');
                }}
                theme="filled_black"
                text="signup_with"
                shape="pill"
            />
        </div>

        <p className="text-sm text-gray-400 text-center mt-6">
          Already have an account?{" "}
          <a href="/login" className="text-indigo-400 hover:underline">
            Log in
          </a>
        </p>

        <div className="mt-6 text-center">
          <button
            type="button" onClick={() => navigate("/")}
            className="text-sm text-indigo-400 hover:underline"
          >
            ← Back to Home
          </button>
        </div>
      </motion.div>
    </div>
  );
}
