import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { Settings } from "lucide-react";

const SettingsView = () => {
  const [user, setUser] = useState({ name: "", email: "", phone: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("/auth/me");
        setUser(res.data.user);
      } catch (err) {
        console.error("Failed to fetch user", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleChange = (e) => {
    setUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePasswordChange = (e) => {
    setPasswordForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await axios.patch("/auth/update", user);
      alert("Profile updated!");
      setUser(res.data.user);
    } catch (err) {
      console.error("Failed to update profile:", err);
      alert("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordUpdate = async () => {
    const { currentPassword, newPassword, confirmPassword } = passwordForm;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return alert("Please fill in all password fields.");
    }

    if (newPassword !== confirmPassword) {
      return alert("New passwords do not match.");
    }

    try {
      await axios.patch("/auth/update-password", {
        currentPassword,
        newPassword,
      });

      alert("Password updated successfully!");
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      console.error("Password update failed:", err);
      alert(err.response?.data?.message || "Failed to update password");
    }
  };

  if (loading) return <div className="text-center p-10 text-white">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 sm:p-8 bg-gray-900 rounded-3xl shadow-xl text-white space-y-12">
      <h2 className="text-3xl sm:text-4xl font-extrabold text-indigo-400 flex items-center gap-3 mb-8">
        <Settings className="text-indigo-400 w-8 h-8 sm:w-10 sm:h-10" /> Settings
      </h2>

      {/* Profile Info */}
      <section className="bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-md flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <div className="flex-shrink-0 flex flex-col items-center sm:items-start">
          <img
            src="https://placehold.co/96x96/png"
            alt="Profile"
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-indigo-500 object-cover"
          />
          <button className="mt-3 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition text-sm whitespace-nowrap">
            Change Picture
          </button>
        </div>

        <form className="flex-1 space-y-6 w-full max-w-lg">
          <label className="block">
            <span className="text-gray-300 font-medium mb-1 block">Full Name</span>
            <input
              type="text"
              name="name"
              value={user.name}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-700 bg-gray-900 p-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </label>
          <label className="block">
            <span className="text-gray-300 font-medium mb-1 block">Email Address</span>
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-700 bg-gray-900 p-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </label>
          <label className="block">
            <span className="text-gray-300 font-medium mb-1 block">Phone Number</span>
            <input
              type="text"
              name="phone"
              value={user.phone || ""}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-700 bg-gray-900 p-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </label>
        </form>
      </section>

      {/* Preferences */}
      <section className="bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-md space-y-8">
        <h3 className="text-2xl font-semibold border-b border-gray-700 pb-3 mb-6">Preferences</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div>
            <h4 className="text-xl font-semibold mb-4">Notifications</h4>
            <label className="flex items-center gap-3 mb-3 cursor-pointer">
              <input type="checkbox" className="form-checkbox h-5 w-5 text-indigo-500" />
              <span>Email Notifications</span>
            </label>
            <label className="flex items-center gap-3 mb-3 cursor-pointer">
              <input type="checkbox" className="form-checkbox h-5 w-5 text-indigo-500" />
              <span>Push Notifications</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" className="form-checkbox h-5 w-5 text-indigo-500" />
              <span>SMS Notifications</span>
            </label>
          </div>
          <div>
            <h4 className="text-xl font-semibold mb-4">Appearance</h4>
            <label className="flex items-center gap-3 mb-3 cursor-pointer">
              <input
                type="radio"
                name="theme"
                className="form-radio h-5 w-5 text-indigo-500"
                defaultChecked
              />
              <span>Dark Mode</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="radio" name="theme" className="form-radio h-5 w-5 text-indigo-500" />
              <span>Light Mode</span>
            </label>
          </div>
        </div>
      </section>

      {/* Security */}
      <section className="bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-md space-y-6 max-w-lg mx-auto">
        <h3 className="text-2xl font-semibold border-b border-gray-700 pb-3 mb-6">Security</h3>
        <label className="block">
          <span className="text-gray-300 font-medium mb-1 block">Current Password</span>
          <input
            type="password"
            name="currentPassword"
            value={passwordForm.currentPassword}
            onChange={handlePasswordChange}
            className="w-full rounded-lg border border-gray-700 bg-gray-900 p-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="••••••••"
          />
        </label>
        <label className="block">
          <span className="text-gray-300 font-medium mb-1 block">New Password</span>
          <input
            type="password"
            name="newPassword"
            value={passwordForm.newPassword}
            onChange={handlePasswordChange}
            className="w-full rounded-lg border border-gray-700 bg-gray-900 p-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="••••••••"
          />
        </label>
        <label className="block">
          <span className="text-gray-300 font-medium mb-1 block">Confirm New Password</span>
          <input
            type="password"
            name="confirmPassword"
            value={passwordForm.confirmPassword}
            onChange={handlePasswordChange}
            className="w-full rounded-lg border border-gray-700 bg-gray-900 p-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="••••••••"
          />
        </label>
        <button
          onClick={handlePasswordUpdate}
          className="bg-indigo-600 hover:bg-indigo-700 w-full py-3 rounded-xl font-semibold transition mt-6"
        >
          Update Password
        </button>
      </section>

      {/* Save All Changes */}
      <div className="text-center mt-6">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-indigo-600 hover:bg-indigo-700 px-10 py-3 rounded-xl font-extrabold text-lg transition disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save All Changes"}
        </button>
      </div>
    </div>
  );
};

export default SettingsView;
