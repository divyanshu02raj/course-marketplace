// src/InstructorDashboardComponents/SettingsView.jsx
import React, { useState, useEffect } from "react";
import axios from "../api/axios";
import baseAxios from "axios";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const CLOUD_NAME = "dg05wkeqo";
const UPLOAD_PRESET = "profile_pictures";

const InstructorSettingsView = () => {
  const { user, updateUser } = useAuth();
  const [formUser, setFormUser] = useState(user);
  
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  useEffect(() => {
    if (user) {
      setFormUser(user);
    }
  }, [user]);

  const handleChange = (e) => {
    setFormUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePasswordChange = (e) => {
    setPasswordForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    setSaving(true);
    const toastId = toast.loading("Saving profile...");
    try {
      const res = await axios.patch("/auth/update", formUser);
      toast.success("Profile updated successfully!", { id: toastId });
      updateUser(res.data.user);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile.", { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordUpdate = async () => {
    const { currentPassword, newPassword, confirmPassword } = passwordForm;

    // ✅ Corrected Validation Logic
    if (!newPassword || !confirmPassword) {
      return toast.error("Please provide and confirm your new password.");
    }
    if (newPassword !== confirmPassword) {
      return toast.error("New passwords do not match.");
    }

    const toastId = toast.loading("Updating password...");
    try {
      await axios.patch("/auth/update-password", {
        currentPassword, // Send it even if it's empty
        newPassword,
      });
      toast.success("Password updated successfully!", { id: toastId });
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update password.", { id: toastId });
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const toastId = toast.loading("Uploading image...");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
      const res = await baseAxios.post(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, formData);
      const data = res.data;
      if (data.secure_url) {
        setFormUser((prev) => ({ ...prev, profileImage: data.secure_url }));
        toast.success("Image uploaded. Click Save Changes to apply.", { id: toastId });
      } else {
        throw new Error("Upload failed");
      }
    } catch (err) {
      console.error("Image upload failed:", err);
      toast.error("Failed to upload image.", { id: toastId });
    } finally {
      setUploading(false);
    }
  };

  if (!formUser) {
    return <div className="text-center p-10 text-gray-900 dark:text-white">Loading...</div>;
  }

  return (
    <div className="w-full px-6 py-10 text-gray-900 dark:text-white">
      <h1 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-10">
        Instructor Settings
      </h1>
      <div className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow p-6 mb-12">
        <h2 className="text-xl font-semibold mb-6">Profile Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
          <div className="flex flex-col items-center">
            <img
              src={formUser.profileImage || "https://placehold.co/100x100"}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-2 border-indigo-500"
            />
            <label className="mt-2">
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              <span className="cursor-pointer px-4 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700 inline-block">
                {uploading ? "Uploading..." : "Change Picture"}
              </span>
            </label>
          </div>
          <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="block text-sm font-medium">
              Full Name
              <input
                type="text"
                name="name"
                value={formUser.name}
                onChange={handleChange}
                className="mt-1 w-full p-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-indigo-500"
              />
            </label>
            <label className="block text-sm font-medium">
              Email Address
              <input
                type="email"
                name="email"
                value={formUser.email}
                onChange={handleChange}
                className="mt-1 w-full p-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-indigo-500"
              />
            </label>
            <label className="block text-sm font-medium col-span-1 sm:col-span-2">
              Phone Number
              <input
                type="text"
                name="phone"
                value={formUser.phone || ''}
                onChange={handleChange}
                className="mt-1 w-full p-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-indigo-500"
              />
            </label>
          </div>
        </div>
        <div className="text-right mt-6">
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-indigo-600 hover:bg-indigo-700 px-6 py-2 rounded-md text-white text-sm disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      <div className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-6">Change Password</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {["current", "new", "confirm"].map((key) => {
            const labels = {
              current: "Current Password",
              new: "New Password",
              confirm: "Confirm New Password",
            };
            return (
              <div key={key} className="relative">
                <label className="block text-sm font-medium mb-1">{labels[key]}</label>
                <input
                  type={showPassword[key] ? "text" : "password"}
                  name={key + "Password"}
                  value={passwordForm[key + "Password"]}
                  onChange={handlePasswordChange}
                  className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-sm pr-10 focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((prev) => ({
                      ...prev,
                      [key]: !prev[key],
                    }))
                  }
                  className="absolute right-3 top-9 text-gray-500 dark:text-gray-400"
                >
                  {showPassword[key] ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            );
          })}
        </div>
        <div className="text-right mt-6">
          <button
            onClick={handlePasswordUpdate}
            className="bg-indigo-600 hover:bg-indigo-700 px-6 py-2 rounded-md text-white text-sm"
          >
            Update Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstructorSettingsView;
