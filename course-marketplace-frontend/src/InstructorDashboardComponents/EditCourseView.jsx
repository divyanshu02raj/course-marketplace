// course-marketplace-frontend\src\InstructorDashboardComponents\EditCourseView.jsx
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "../api/axios";
import toast from "react-hot-toast";
import {
  ArrowLeft, BookText, ListVideo, Type, Tag, FileText,
  DollarSign, Sun, Moon, Plus, Trash2, ClipboardCheck
} from "lucide-react";
import LessonManager from "./LessonManager";
import AssessmentManager from "./AssessmentManager";
import { useAuth } from "../context/AuthContext";
import useTheme from "../hooks/useTheme";

// Helper component for form fields
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
          id={name} name={name} value={value} onChange={onChange} rows={6} placeholder={placeholder}
          className="w-full p-3 pl-12 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition resize-none"
        />
      ) : (
        <input
          id={name} name={name} type={type} value={value} onChange={onChange} placeholder={placeholder}
          className="w-full p-3 pl-12 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
        />
      )}
    </div>
  </div>
);

export default function EditCourseView() {
  const { courseId } = useParams();
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("details");

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
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-950 text-gray-500 dark:text-gray-400">
        Loading course editor...
      </div>
    );
  }

  const tabs = [
    { key: 'details', label: 'Course Details', icon: BookText },
    { key: 'lessons', label: 'Lessons & Curriculum', icon: ListVideo },
    { key: 'assessment', label: 'Final Assessment', icon: ClipboardCheck }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <div className="max-w-7xl mx-auto">
        {/* Sticky Header Section */}
        <div className="sticky top-0 z-30 bg-gray-50 dark:bg-gray-950 pt-4 sm:pt-6 lg:pt-8 px-4 sm:px-6 lg:px-8">
            <header className="mb-8">
                <Link
                    to="/dashboard/courses"
                    className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 mb-4 font-semibold"
                >
                    <ArrowLeft size={16} />
                    Back to My Courses
                </Link>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                        Course Editor
                    </h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 sm:mt-0">
                        Editing: <span className="font-medium text-indigo-600 dark:text-indigo-400">{course.title}</span>
                    </p>
                </div>
            </header>

            {/* Tabs */}
            <div className="bg-white dark:bg-gray-900 p-2 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
                <nav className="flex gap-2" aria-label="Tabs">
                    {tabs.map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`flex-1 justify-center py-3 px-4 text-sm font-semibold flex items-center gap-2 rounded-lg transition-colors ${
                        activeTab === tab.key
                            ? "bg-indigo-600 text-white shadow"
                            : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                        }`}
                    >
                        <tab.icon size={16} />
                        {tab.label}
                    </button>
                    ))}
                </nav>
            </div>
        </div>

        {/* Scrollable Content */}
        <main className="px-4 sm:px-6 lg:px-8 py-8">
            <div className="pb-24">
                {activeTab === 'details' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                        <div className="lg:col-span-2 space-y-8">
                            <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-md border border-gray-200 dark:border-gray-800">
                                <h3 className="text-xl font-bold mb-6">Basic Information</h3>
                                <div className="space-y-6">
                                    <FormField icon={<Type size={18} />} label="Course Title" name="title" value={course.title} onChange={handleInputChange} placeholder="e.g., The Ultimate React Course"/>
                                    <FormField icon={<FileText size={18} />} label="Short Description" name="shortDesc" value={course.shortDesc} onChange={handleInputChange} placeholder="A short tagline for the course"/>
                                    <FormField icon={<FileText size={18} />} label="Detailed Description" name="description" value={course.description} onChange={handleInputChange} placeholder="What will students learn?" textarea/>
                                </div>
                            </div>
                            <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-md border border-gray-200 dark:border-gray-800">
                                <h3 className="text-xl font-bold mb-6">Course Content Details</h3>
                                <div className="space-y-8">
                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">What You'll Learn</label>
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
                                            <button type="button" onClick={() => handleAddItem('whatYouWillLearn', learnInput, setLearnInput)} className="p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700"><Plus size={16}/></button>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">Requirements</label>
                                        <div className="space-y-2">
                                            {course.requirements.map((item, index) => (
                                                <div key={index} className="flex items-center gap-2">
                                                    <input type="text" value={item} readOnly className="w-full p-2 bg-gray-200 dark:bg-gray-700 rounded-md border-transparent"/>
                                                    <button type="button" onClick={() => handleRemoveItem('requirements', index)} className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-full"><Trash2 size={16}/></button>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="flex items-center gap-2 mt-2">
                                            <input type="text" value={requirementInput} onChange={(e) => setRequirementInput(e.target.value)} placeholder="Add a new requirement" className="w-full p-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md"/>
                                            <button type="button" onClick={() => handleAddItem('requirements', requirementInput, setRequirementInput)} className="p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700"><Plus size={16}/></button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="lg:col-span-1 space-y-8 sticky top-40">
                            <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-md border border-gray-200 dark:border-gray-800">
                                <h3 className="text-xl font-bold mb-6">Settings & Pricing</h3>
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">Category</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400"><Tag size={18} /></div>
                                            <select name="category" value={course.category} onChange={handleInputChange} className="w-full p-3 pl-12 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none appearance-none">
                                                <option value="web-dev">Web Development</option>
                                                <option value="design">Design</option>
                                                <option value="marketing">Marketing</option>
                                                <option value="ai">Artificial Intelligence</option>
                                            </select>
                                        </div>
                                    </div>
                                    <FormField icon={<DollarSign size={18} />} label="Price (INR)" name="price" type="number" value={course.price} onChange={handleInputChange} placeholder="e.g., 499"/>
                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">Target Audience</label>
                                        <input type="text" name="targetAudience" value={course.targetAudience || ''} onChange={handleInputChange} placeholder="e.g., Beginner developers" className="w-full p-3 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'lessons' && <LessonManager courseId={courseId} />}
                {activeTab === 'assessment' && <AssessmentManager courseId={courseId} />}
            </div>
        </main>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-t border-gray-200 dark:border-gray-800 z-40 print:hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-end items-center h-20">
                    <button
                        onClick={handleSaveChanges}
                        disabled={saving}
                        className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-indigo-500/50 transition disabled:opacity-50"
                    >
                        {saving ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </div>
        </div>
    </div>
  );
}

