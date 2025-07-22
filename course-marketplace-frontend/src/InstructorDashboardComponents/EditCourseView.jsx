// src/InstructorDashboardComponents/EditCourseView.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import toast from "react-hot-toast";
import {
  ArrowLeft, BookText, ListVideo, Type, Tag, FileText,
  DollarSign, Sun, Moon, Plus, Trash2
} from "lucide-react";
import LessonManager from "./LessonManager";
import { useAuth } from "../context/AuthContext";
import useTheme from "../hooks/useTheme";

// ✅ Helper component is now defined OUTSIDE the main component
// This prevents it from being re-created on every render.
const FormField = ({ icon, label, name, value, onChange, placeholder, type = "text", textarea = false }) => (
    <div>
      <label htmlFor={name} className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
          {icon}
        </div>
        {textarea ? (
          <textarea
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            rows={6}
            placeholder={placeholder}
            className="w-full p-3 pl-12 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition resize-none"
          />
        ) : (
          <input
            id={name}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full p-3 pl-12 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
          />
        )}
      </div>
    </div>
);

export default function EditCourseView() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("details");

  // State for the dynamic list inputs
  const [learnInput, setLearnInput] = useState("");
  const [requirementInput, setRequirementInput] = useState("");

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(`/courses/${courseId}`);
        const courseData = response.data;
        if (!courseData.whatYouWillLearn) courseData.whatYouWillLearn = [];
        if (!courseData.requirements) courseData.requirements = [];
        setCourse(courseData);
      } catch (error) {
        toast.error("Failed to fetch course data.");
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

  const handleAddItem = (field, value, setValue) => {
    if (!value.trim()) return;
    setCourse(prev => ({ ...prev, [field]: [...prev[field], value.trim()] }));
    setValue("");
  };

  const handleRemoveItem = (field, index) => {
    setCourse(prev => ({ ...prev, [field]: prev[field].filter((_, i) => i !== index) }));
  };

  const handleSaveChanges = async () => {
    setSaving(true);
    const toastId = toast.loading("Saving changes...");
    try {
      await axios.patch(`/courses/${courseId}`, course);
      toast.success("Course updated successfully!", { id: toastId });
    } catch (error) {
      toast.error("Failed to save changes.", { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  if (loading || !course) {
    return (
      <div className="flex items-center justify-center h-screen bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400">
        Loading course editor...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 sm:p-6 lg:p-8">
      <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6 mb-8">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            🎓 Edit Course
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Editing: <span className="font-medium">{course.title}</span>
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            aria-label="Toggle theme"
            className="p-2 rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5 text-yellow-400" />
            ) : (
              <Moon className="w-5 h-5 text-blue-600" />
            )}
          </button>
          {user && (
            <div className="hidden sm:flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
              <div className="w-7 h-7 bg-indigo-600 text-white rounded-full flex items-center justify-center font-semibold text-xs uppercase">
                {user.name?.charAt(0) || "U"}
              </div>
              <span className="font-medium">Hi, {user.name}</span>
            </div>
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

        <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
          <nav className="flex gap-6" aria-label="Tabs">
            {[
              { key: 'details', label: 'Course Details', icon: BookText },
              { key: 'lessons', label: 'Lessons & Curriculum', icon: ListVideo }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`py-3 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors ${
                  activeTab === tab.key
                    ? "border-indigo-500 text-indigo-600 dark:text-indigo-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300"
                }`}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {activeTab === 'details' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <FormField
                icon={<Type size={18} />} label="Course Title" name="title" value={course.title}
                onChange={handleInputChange} placeholder="e.g., The Ultimate React Course"
              />
              <FormField
                icon={<FileText size={18} />} label="Short Description" name="shortDesc" value={course.shortDesc}
                onChange={handleInputChange} placeholder="A short tagline for the course"
              />
              <FormField
                icon={<FileText size={18} />} label="Detailed Description" name="description" value={course.description}
                onChange={handleInputChange} placeholder="What will students learn?" textarea
              />
              <div>
                <label className="block text-sm font-medium mb-2">What You'll Learn</label>
                <div className="space-y-2">
                  {course.whatYouWillLearn.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input type="text" value={item} readOnly className="w-full p-2 bg-gray-200 dark:bg-gray-700 rounded-md border-transparent"/>
                      <button onClick={() => handleRemoveItem('whatYouWillLearn', index)} className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-full"><Trash2 size={16}/></button>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <input type="text" value={learnInput} onChange={(e) => setLearnInput(e.target.value)} placeholder="Add a new learning objective" className="w-full p-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md"/>
                  <button onClick={() => handleAddItem('whatYouWillLearn', learnInput, setLearnInput)} className="p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700"><Plus size={16}/></button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Requirements</label>
                <div className="space-y-2">
                  {course.requirements.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input type="text" value={item} readOnly className="w-full p-2 bg-gray-200 dark:bg-gray-700 rounded-md border-transparent"/>
                      <button onClick={() => handleRemoveItem('requirements', index)} className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-full"><Trash2 size={16}/></button>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <input type="text" value={requirementInput} onChange={(e) => setRequirementInput(e.target.value)} placeholder="Add a new requirement" className="w-full p-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md"/>
                  <button onClick={() => handleAddItem('requirements', requirementInput, setRequirementInput)} className="p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700"><Plus size={16}/></button>
                </div>
              </div>
            </div>
            <div className="space-y-6 bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border dark:border-gray-700">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">Category</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <Tag size={18} />
                  </div>
                  <select
                    name="category" value={course.category} onChange={handleInputChange}
                    className="w-full p-3 pl-12 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none appearance-none"
                  >
                    <option value="web-dev">Web Development</option>
                    <option value="design">Design</option>
                    <option value="marketing">Marketing</option>
                    <option value="ai">Artificial Intelligence</option>
                  </select>
                </div>
              </div>
              <FormField
                icon={<DollarSign size={18} />} label="Price (USD)" name="price" type="number" value={course.price}
                onChange={handleInputChange} placeholder="e.g., 49.99"
              />
              <div>
                <label className="block text-sm font-medium mb-2">Target Audience</label>
                <input type="text" name="targetAudience" value={course.targetAudience || ''} onChange={handleInputChange} placeholder="e.g., Beginner developers" className="w-full p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg"/>
              </div>
            </div>
            <div className="md:col-span-3 flex justify-end pt-8 mt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={handleSaveChanges} disabled={saving}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow transition disabled:opacity-50"
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
