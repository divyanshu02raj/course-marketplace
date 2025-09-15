// course-marketplace-frontend\src\pages\InstructorDashboard.jsx
import { useState } from "react";
import { Routes, Route, NavLink, useNavigate } from "react-router-dom";
import {
  Home,
  BookOpen,
  PlusCircle,
  DollarSign,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  X,
  Sun,
  Moon,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import useTheme from "../hooks/useTheme";

// Import your view components
import DashboardView from "../InstructorDashboardComponents/DashboardView";
import CreateCourseView from "../InstructorDashboardComponents/CreateCourseView";
import InstructorCoursesView from "../InstructorDashboardComponents/InstructorCoursesView";
import EarningsView from "../InstructorDashboardComponents/EarningsView";
import MessagesView from "../InstructorDashboardComponents/MessagesView";
import SettingsView from "../InstructorDashboardComponents/SettingsView";

export default function InstructorDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-400">
        Loading...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-400">
        You are logged out.
      </div>
    );
  }

  const menu = [
    { label: "Dashboard", icon: <Home />, path: "" },
    { label: "My Courses", icon: <BookOpen />, path: "courses" },
    { label: "Create Course", icon: <PlusCircle />, path: "create" },
    { label: "Earnings", icon: <DollarSign />, path: "earnings" },
    { label: "Messages", icon: <MessageSquare />, path: "messages" },
    { label: "Settings", icon: <Settings />, path: "settings" },
  ];

  return (
    <div className="h-screen flex overflow-hidden bg-white text-black dark:bg-gray-900 dark:text-white">
      {/* Sidebar */}
      <aside
        className={`w-64 bg-gray-100 dark:bg-gray-950 border-r border-gray-200 dark:border-white/10 p-6 z-30 transform transition-transform duration-300 ease-in-out
        fixed md:relative h-full
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <div className="flex md:hidden justify-end mb-4">
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-gray-700 dark:text-white hover:text-black dark:hover:text-gray-300"
          >
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
        <nav className="flex-1 space-y-4 overflow-y-auto">
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

        <button
          onClick={handleLogout}
          className="mt-8 flex items-center gap-3 text-sm text-red-500 hover:text-red-400"
        >
          <LogOut size={18} /> Logout
        </button>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex justify-between items-center px-4 md:px-8 py-4 border-b border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900 shadow-sm">
          <div className="flex items-center gap-4">
            <button
              className="md:hidden text-gray-700 dark:text-white"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
          </div>

          <div className="flex items-center gap-6">
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
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                Welcome, {user.name || "Instructor"}
              </span>
            )}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-white text-black dark:bg-gray-900 dark:text-white">
          <Routes>
            <Route path="/" element={<DashboardView />} />
            <Route path="create" element={<CreateCourseView />} />
            <Route path="courses" element={<InstructorCoursesView />} />
            <Route path="earnings" element={<EarningsView />} />
            <Route path="messages" element={<MessagesView />} />
            <Route path="settings" element={<SettingsView />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

