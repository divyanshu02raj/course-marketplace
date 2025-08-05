import React, { useState, useEffect } from "react";
import { Routes, Route, NavLink, useNavigate } from "react-router-dom";
import {
  Home, BookOpen, Award, MessageSquare, Settings, LogOut, Bell, Menu, ClipboardCheck, X, Sun, Moon
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import useTheme from "../hooks/useTheme";
import axios from "../api/axios";
import toast from "react-hot-toast";

// Import your view components
import CoursesView from "../StudentDashboardComponents/CoursesView";
import MyCourses from "../StudentDashboardComponents/MyCourses";
import CertificatesView from "../StudentDashboardComponents/CertificatesView";
import MessagesView from "../StudentDashboardComponents/MessagesView";
import SettingsView from "../StudentDashboardComponents/SettingsView";
import AssessmentsView from "../StudentDashboardComponents/AssessmentsView";
import DashboardView from "../StudentDashboardComponents/DashboardView";

export default function StudentDashboard() {
  const { theme, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // State for live data
  const [allCourses, setAllCourses] = useState([]);
  const [myEnrolledCourses, setMyEnrolledCourses] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      if (!user) return;
      setDataLoading(true);
      try {
        const [coursesRes, enrolledRes, certsRes] = await Promise.all([
          axios.get("/courses"),
          axios.get("/courses/enrolled"),
          axios.get("/certificates/my")
        ]);
        setAllCourses(coursesRes.data);
        setMyEnrolledCourses(enrolledRes.data);
        setCertificates(certsRes.data);
      } catch (error) {
        toast.error("Failed to load some dashboard data.");
        console.error("Dashboard data fetch error:", error);
      } finally {
        setDataLoading(false);
      }
    };
    fetchAllData();
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // ** THE FIX IS HERE: "Schedule" has been removed from the menu **
  const menu = [
    { label: "Dashboard", icon: <Home />, path: "" },
    { label: "Courses", icon: <BookOpen />, path: "courses" },
    { label: "My Courses", icon: <BookOpen />, path: "my-courses" },
    { label: "Assessments", icon: <ClipboardCheck />, path: "assessments" },
    { label: "Certificates", icon: <Award />, path: "certificates" },
    { label: "Messages", icon: <MessageSquare />, path: "messages" },
    { label: "Settings", icon: <Settings />, path: "settings" },
  ];

  const [notifications] = useState([{ title: "New message from Mr. Smith", time: "5 min ago", read: false }]);
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  if (authLoading || dataLoading) {
    return <div className="h-screen flex items-center justify-center text-gray-400">Loading...</div>;
  }

  if (!user) {
    return <div className="h-screen flex items-center justify-center text-gray-400">You are logged out.</div>;
  }

  return (
    <div className="h-screen flex overflow-hidden bg-white text-black dark:bg-gray-900 dark:text-white">
      {/* Sidebar */}
      <aside
        className={`w-64 bg-gray-100 dark:bg-gray-950 border-r border-gray-200 dark:border-white/10 p-6 z-30 transform transition-transform duration-300 ease-in-out
        fixed md:relative h-full
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <div className="flex md:hidden justify-end mb-4">
          <button onClick={() => setSidebarOpen(false)} className="text-gray-700 dark:text-white">
            <X size={24} />
          </button>
        </div>
        <div className="mb-8 flex items-center justify-center">
          <img
            src={theme === "dark" ? "/full noBgColor.png" : "/full noBgBlack.png"}
            alt="Logo"
            className="h-16 object-contain"
            style={{ maxWidth: "220px" }}
          />
        </div>
        <nav className="flex-1 space-y-4">
          {menu.map((item) => (
            <NavLink
              key={item.path}
              to={`/dashboard/${item.path}`}
              end={item.path === ""}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-xl transition-all w-full text-left ${
                  isActive
                    ? "bg-indigo-600 text-white"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800"
                }`
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>
        <button onClick={handleLogout} className="mt-8 flex items-center gap-3 text-sm text-red-500 hover:text-red-400">
          <LogOut size={18} /> Logout
        </button>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex justify-between items-center px-4 md:px-8 py-4 border-b border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900 shadow-sm">
            <button className="md:hidden text-gray-700 dark:text-white" onClick={() => setSidebarOpen(true)}>
                <Menu size={24} />
            </button>
            <div className="flex-1"></div>
            <div className="flex items-center gap-4">
                <div className="relative">
                    <button onClick={() => setShowNotifications(!showNotifications)} className="relative p-2">
                        <Bell className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white w-6 h-6" />
                        {unreadCount > 0 && <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />}
                    </button>
                    {showNotifications && (
                        <div className="absolute top-full left-1/2 -translate-x-[60%] mt-2 w-[90vw] max-w-xs bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-50 sm:left-auto sm:right-0 sm:translate-x-0 sm:w-80">
                            {/* Notifications dropdown content... */}
                        </div>
                    )}
                </div>
                <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                    {theme === "dark" ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-blue-600" />}
                </button>
                <div key={user.profileImage} className="flex items-center gap-3">
                    <span className="hidden sm:inline text-sm font-medium text-gray-700 dark:text-gray-200">
                        Welcome, {user.name || "Student"}
                    </span>
                    <img src={user.profileImage || `https://placehold.co/40x40/a5b4fc/1e1b4b?text=${user.name.charAt(0)}`} alt="Profile" className="w-8 h-8 rounded-full object-cover"/>
                </div>
            </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-gray-50 dark:bg-gray-950">
          <Routes>
            <Route path="/" element={<DashboardView />} />
            <Route path="courses" element={<CoursesView courses={allCourses} myCourses={myEnrolledCourses} />} />
            <Route path="my-courses" element={<MyCourses courses={myEnrolledCourses} />} />
            {/* ** THE FIX IS HERE: The route for "Schedule" has been removed ** */}
            <Route path="assessments" element={<AssessmentsView />} />
            <Route path="certificates" element={<CertificatesView certificates={certificates} />} />
            <Route path="messages" element={<MessagesView />} />
            <Route path="settings" element={<SettingsView />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
