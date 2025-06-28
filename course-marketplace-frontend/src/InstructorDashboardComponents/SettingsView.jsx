import React, { useState } from "react";
import { Settings } from "lucide-react";

const InstructorSettingsView = () => {
  // Local state for form inputs
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [payoutMethod, setPayoutMethod] = useState("paypal"); // example
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: false,
  });
  const [theme, setTheme] = useState("dark");
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  // Handlers
  const handleNotificationChange = (type) => {
    setNotifications((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveSettings = () => {
    // TODO: validate and submit settings to backend
    alert("Settings saved!");
  };

  const handlePasswordUpdate = () => {
    // TODO: validate password inputs & submit password change
    alert("Password updated!");
  };

  return (
    <div className="max-w-4xl mx-auto p-6 sm:p-8 bg-gray-900 rounded-3xl shadow-xl text-white space-y-12">
      <h2 className="text-3xl sm:text-4xl font-extrabold text-indigo-400 flex items-center gap-3 mb-8">
        <Settings className="text-indigo-400 w-8 h-8 sm:w-10 sm:h-10" /> Settings
      </h2>

      {/* Profile Section */}
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
        <form className="flex-1 space-y-6 w-full max-w-lg" onSubmit={(e) => e.preventDefault()}>
          <label className="block">
            <span className="text-gray-300 font-medium mb-1 block">Full Name</span>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Jane Instructor"
              className="w-full rounded-lg border border-gray-700 bg-gray-900 p-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </label>
          <label className="block">
            <span className="text-gray-300 font-medium mb-1 block">Email Address</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jane.instructor@example.com"
              className="w-full rounded-lg border border-gray-700 bg-gray-900 p-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </label>
        </form>
      </section>

      {/* Payout Method Section */}
      <section className="bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-md max-w-lg mx-auto space-y-4">
        <h3 className="text-2xl font-semibold border-b border-gray-700 pb-3 mb-6">
          Payout Method
        </h3>
        <select
          value={payoutMethod}
          onChange={(e) => setPayoutMethod(e.target.value)}
          className="w-full rounded-lg border border-gray-700 bg-gray-900 p-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
        >
          <option value="paypal">PayPal</option>
          <option value="bank">Bank Transfer</option>
          <option value="stripe">Stripe</option>
        </select>
      </section>

      {/* Preferences */}
      <section className="bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-md space-y-8">
        <h3 className="text-2xl font-semibold border-b border-gray-700 pb-3 mb-6">
          Preferences
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {/* Notifications */}
          <div>
            <h4 className="text-xl font-semibold mb-4">Notifications</h4>
            {["email", "push", "sms"].map((type) => (
              <label
                key={type}
                className="flex items-center gap-3 mb-3 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={notifications[type]}
                  onChange={() => handleNotificationChange(type)}
                  className="form-checkbox h-5 w-5 text-indigo-500"
                />
                <span>
                  {type.charAt(0).toUpperCase() + type.slice(1)} Notifications
                </span>
              </label>
            ))}
          </div>

          {/* Appearance */}
          <div>
            <h4 className="text-xl font-semibold mb-4">Appearance</h4>
            <label className="flex items-center gap-3 mb-3 cursor-pointer">
              <input
                type="radio"
                name="theme"
                checked={theme === "dark"}
                onChange={() => setTheme("dark")}
                className="form-radio h-5 w-5 text-indigo-500"
              />
              <span>Dark Mode</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="theme"
                checked={theme === "light"}
                onChange={() => setTheme("light")}
                className="form-radio h-5 w-5 text-indigo-500"
              />
              <span>Light Mode</span>
            </label>
          </div>
        </div>
      </section>

      {/* Security */}
      <section className="bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-md space-y-6 max-w-lg mx-auto">
        <h3 className="text-2xl font-semibold border-b border-gray-700 pb-3 mb-6">
          Security
        </h3>

        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          <label className="block">
            <span className="text-gray-300 font-medium mb-1 block">Current Password</span>
            <input
              type="password"
              name="current"
              value={passwords.current}
              onChange={handlePasswordChange}
              className="w-full rounded-lg border border-gray-700 bg-gray-900 p-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="••••••••"
            />
          </label>
          <label className="block">
            <span className="text-gray-300 font-medium mb-1 block">New Password</span>
            <input
              type="password"
              name="new"
              value={passwords.new}
              onChange={handlePasswordChange}
              className="w-full rounded-lg border border-gray-700 bg-gray-900 p-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="••••••••"
            />
          </label>
          <label className="block">
            <span className="text-gray-300 font-medium mb-1 block">Confirm New Password</span>
            <input
              type="password"
              name="confirm"
              value={passwords.confirm}
              onChange={handlePasswordChange}
              className="w-full rounded-lg border border-gray-700 bg-gray-900 p-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="••••••••"
            />
          </label>

          <button
            type="button"
            onClick={handlePasswordUpdate}
            className="bg-indigo-600 hover:bg-indigo-700 w-full py-3 rounded-xl font-semibold transition mt-6"
          >
            Update Password
          </button>
        </form>
      </section>

      {/* Save all settings */}
      <div className="text-center mt-6">
        <button
          onClick={handleSaveSettings}
          className="bg-indigo-600 hover:bg-indigo-700 px-10 py-3 rounded-xl font-extrabold text-lg transition"
        >
          Save All Changes
        </button>
      </div>
    </div>
  );
};

export default InstructorSettingsView;
