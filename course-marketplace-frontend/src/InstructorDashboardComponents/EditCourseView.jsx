// src/InstructorDashboardComponents/EditCourseView.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import toast from "react-hot-toast";
import { ArrowLeft, BookText, ListVideo, Type, Tag, FileText, DollarSign, Sun, Moon } from "lucide-react";
import LessonManager from "./LessonManager";
import { useAuth } from "../context/AuthContext"; // Import useAuth to get user info
import useTheme from "../hooks/useTheme"; // Import useTheme for the toggle

export default function EditCourseView() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth(); // Get user from context
  const { theme, toggleTheme } = useTheme(); // Get theme state and toggle function

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("details");

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(`/courses/${courseId}`);
        setCourse(response.data);
      } catch (error) {
        toast.error("Failed to fetch course data.");
        console.error("Fetch course error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCourse((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = async () => {
    setSaving(true);
    const toastId = toast.loading("Saving changes...");
    try {
      const { title, shortDesc, description, category, price } = course;
      const updatedData = { title, shortDesc, description, category, price };
      
      await axios.patch(`/courses/${courseId}`, updatedData);
      toast.success("Course updated successfully!", { id: toastId });
    } catch (error) {
      toast.error("Failed to save changes.", { id: toastId });
      console.error("Update course error:", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading course...</div>;
  }

  if (!course) {
    return <div className="p-8 text-center text-red-500">Could not load course data.</div>;
  }

  // Helper component for styled input fields with icons
  const FormInput = ({ icon, name, value, onChange, placeholder, type = "text" }) => (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
        {icon}
      </div>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full p-3 pl-12 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
      />
    </div>
  );

  return (
    <div className="w-full text-gray-900 dark:text-white">
      {/* New Integrated Header */}
      <header className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            Course Editor
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Editing: {course.title}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5 text-yellow-400" />
            ) : (
              <Moon className="w-5 h-5 text-blue-600" />
            )}
          </button>
          {user && (
            <span className="hidden sm:inline text-sm font-medium text-gray-700 dark:text-gray-200">
              Hi, {user.name}
            </span>
          )}
        </div>
      </header>

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-lg p-6 sm:p-8">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400 hover:underline mb-6 font-semibold"
        >
          <ArrowLeft size={16} />
          Back to My Courses
        </button>

        <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
          <nav className="flex gap-6" aria-label="Tabs">
            <button
              onClick={() => setActiveTab("details")}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors ${
                activeTab === "details"
                  ? "border-indigo-500 text-indigo-600 dark:text-indigo-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300"
              }`}
            >
              <BookText size={16} />
              Course Details
            </button>
            <button
              onClick={() => setActiveTab("lessons")}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors ${
                activeTab === "lessons"
                  ? "border-indigo-500 text-indigo-600 dark:text-indigo-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300"
              }`}
            >
              <ListVideo size={16} />
              Lessons & Curriculum
            </button>
          </nav>
        </div>

        {activeTab === 'details' && (
          <div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-6">
                      <div>
                          <label className="block text-sm font-medium mb-2">Course Title</label>
                          <FormInput icon={<Type size={18} />} name="title" value={course.title} onChange={handleInputChange} placeholder="e.g., The Ultimate React Course" />
                      </div>
                      <div>
                          <label className="block text-sm font-medium mb-2">Short Description</label>
                          <FormInput icon={<FileText size={18} />} name="shortDesc" value={course.shortDesc} onChange={handleInputChange} placeholder="A brief summary for the course card" />
                      </div>
                      <div>
                          <label className="block text-sm font-medium mb-2">Detailed Description</label>
                          <textarea name="description" value={course.description} onChange={handleInputChange} rows="8" className="w-full p-3 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition" placeholder="Describe what students will learn..."></textarea>
                      </div>
                  </div>
                  <div className="space-y-6 bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border dark:border-gray-700">
                      <div>
                          <label className="block text-sm font-medium mb-2">Category</label>
                          <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                  <Tag size={18} />
                              </div>
                              <select name="category" value={course.category} onChange={handleInputChange} className="w-full p-3 pl-12 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition appearance-none">
                                  <option value="web-dev">Web Development</option>
                                  <option value="design">Design</option>
                                  <option value="marketing">Marketing</option>
                                  <option value="ai">Artificial Intelligence</option>
                              </select>
                          </div>
                      </div>
                      <div>
                          <label className="block text-sm font-medium mb-2">Price (USD)</label>
                          <FormInput icon={<DollarSign size={18} />} type="number" name="price" value={course.price} onChange={handleInputChange} placeholder="e.g., 49.99" />
                      </div>
                  </div>
              </div>
              <div className="flex justify-end pt-8 mt-8 border-t border-gray-200 dark:border-gray-700">
                  <button
                      onClick={handleSaveChanges}
                      disabled={saving}
                      className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition disabled:opacity-50"
                  >
                      {saving ? "Saving..." : "Save Changes"}
                  </button>
              </div>
          </div>
        )}

        {activeTab === 'lessons' && (
          <div>
              <LessonManager courseId={courseId} />
          </div>
        )}
      </div>
    </div>
  );
}
