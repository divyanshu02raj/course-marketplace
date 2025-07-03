import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { Eye, EyeOff } from "lucide-react";

const CLOUD_NAME = "dg05wkeqo";
const UPLOAD_PRESET = "profile_pictures";

const InstructorSettingsView = () => {
  const [user, setUser] = useState({ name: "", email: "", phone: "", profileImage: "" });
  const [loading, setLoading] = useState(true);
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

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.secure_url) {
        setUser((prev) => ({ ...prev, profileImage: data.secure_url }));
        alert("Image uploaded. Click Save Changes to apply.");
      } else {
        throw new Error("Upload failed");
      }
    } catch (err) {
      console.error("Image upload failed:", err);
      alert("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return <div className="text-center p-10 text-gray-900 dark:text-white">Loading...</div>;
  }

  return (
    <div className="w-full px-6 py-10 text-gray-900 dark:text-white">
      <h1 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-10">
        Instructor Settings
      </h1>

      {/* Profile Info Section */}
      <div className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow p-6 mb-12">
        <h2 className="text-xl font-semibold mb-6">Profile Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
          <div className="flex flex-col items-center">
            <img
              src={user.profileImage || "https://placehold.co/100x100"}
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
                value={user.name}
                onChange={handleChange}
                className="mt-1 w-full p-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-indigo-500"
              />
            </label>
            <label className="block text-sm font-medium">
              Email Address
              <input
                type="email"
                name="email"
                value={user.email}
                onChange={handleChange}
                className="mt-1 w-full p-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-indigo-500"
              />
            </label>
            <label className="block text-sm font-medium col-span-1 sm:col-span-2">
              Phone Number
              <input
                type="text"
                name="phone"
                value={user.phone}
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

      {/* Password Change Section */}
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
