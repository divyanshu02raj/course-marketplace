import React from "react";
import { Settings } from "lucide-react";

const SettingsView = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 sm:p-8 bg-gray-900 rounded-3xl shadow-xl text-white space-y-12">
      <h2 className="text-3xl sm:text-4xl font-extrabold text-indigo-400 flex items-center gap-3 mb-8">
        <Settings className="text-indigo-400 w-8 h-8 sm:w-10 sm:h-10" /> Settings
      </h2>

      {/* Profile Picture and Personal Information */}
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
              placeholder="Jane Doe"
              className="w-full rounded-lg border border-gray-700 bg-gray-900 p-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </label>
          <label className="block">
            <span className="text-gray-300 font-medium mb-1 block">Email Address</span>
            <input
              type="email"
              placeholder="jane.doe@example.com"
              className="w-full rounded-lg border border-gray-700 bg-gray-900 p-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </label>
        </form>
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

          {/* Appearance */}
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
        <h3 className="text-2xl font-semibold border-b border-gray-700 pb-3 mb-6">
          Security
        </h3>

        <label className="block">
          <span className="text-gray-300 font-medium mb-1 block">Current Password</span>
          <input
            type="password"
            className="w-full rounded-lg border border-gray-700 bg-gray-900 p-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="••••••••"
          />
        </label>
        <label className="block">
          <span className="text-gray-300 font-medium mb-1 block">New Password</span>
          <input
            type="password"
            className="w-full rounded-lg border border-gray-700 bg-gray-900 p-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="••••••••"
          />
        </label>
        <label className="block">
          <span className="text-gray-300 font-medium mb-1 block">Confirm New Password</span>
          <input
            type="password"
            className="w-full rounded-lg border border-gray-700 bg-gray-900 p-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="••••••••"
          />
        </label>

        <button className="bg-indigo-600 hover:bg-indigo-700 w-full py-3 rounded-xl font-semibold transition mt-6">
          Update Password
        </button>
      </section>

      {/* Save all settings */}
      <div className="text-center mt-6">
        <button className="bg-indigo-600 hover:bg-indigo-700 px-10 py-3 rounded-xl font-extrabold text-lg transition">
          Save All Changes
        </button>
      </div>
    </div>
  );
};

export default SettingsView;