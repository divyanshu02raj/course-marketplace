import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Home,
  BookOpen,
  PlusCircle,
  DollarSign,
  MessageSquare,
  Settings,
  LogOut,
  Bell,
  Menu,
  X,
  Sun,
  Moon,
} from "lucide-react";

import useTheme from "../hooks/useTheme"; // ✅ Theme toggle hook

import DashboardView from "../InstructorDashboardComponents/DashboardView";
import CreateCourseView from "../InstructorDashboardComponents/CreateCourseView";
import InstructorCoursesView from "../InstructorDashboardComponents/InstructorCoursesView";
import EarningsView from "../InstructorDashboardComponents/EarningsView";
import MessagesView from "../InstructorDashboardComponents/MessagesView";
import SettingsView from "../InstructorDashboardComponents/SettingsView";

export default function InstructorDashboard() {
  const [active, setActive] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();

  const { theme, toggleTheme } = useTheme(); // ✅ Using theme hook

  const [notifications, setNotifications] = useState([
    { title: "New course approval", time: "5 min ago", read: false },
    { title: "Student feedback received", time: "1 hour ago", read: false },
    { title: "Payment received for your course", time: "2 hours ago", read: true },
  ]);

  const [showNotifications, setShowNotifications] = useState(false);

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
    { label: "Dashboard", icon: <Home />, key: "dashboard" },
    { label: "My Courses", icon: <BookOpen />, key: "courses" },
    { label: "Create Course", icon: <PlusCircle />, key: "create" },
    { label: "Earnings", icon: <DollarSign />, key: "earnings" },
    { label: "Messages", icon: <MessageSquare />, key: "messages" },
    { label: "Settings", icon: <Settings />, key: "settings" },
  ];

  const unreadCount = notifications.filter((note) => !note.read).length;

  return (
    <div className="h-screen flex overflow-hidden bg-white text-black dark:bg-gray-900 dark:text-white">
      {/* Sidebar */}
      <aside
        className={`w-64 bg-gray-100 dark:bg-gray-950 border-r border-gray-200 dark:border-white/10 p-6 z-30 transform transition-transform duration-300 ease-in-out
        fixed md:relative h-full md:h-auto
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        {/* Close button */}
        <div className="flex md:hidden justify-end mb-4">
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-gray-700 dark:text-white hover:text-black dark:hover:text-gray-300"
          >
            <X size={24} />
          </button>
        </div>

        <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-8">🎓 CourseHub</h1>
        <nav className="flex-1 space-y-4 overflow-y-auto">
          {menu.map((item) => (
            <button
              key={item.key}
              onClick={() => {
                setActive(item.key);
                setSidebarOpen(false);
              }}
              className={`flex items-center gap-3 px-4 py-2 rounded-xl transition-all w-full text-left ${
                active === item.key
                  ? "bg-indigo-600 text-white"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800"
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <button
          onClick={handleLogout}
          className="mt-8 flex items-center gap-3 text-sm text-red-500 hover:text-red-400"
        >
          <LogOut size={18} /> Logout
        </button>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex justify-between items-center px-4 md:px-8 py-4 border-b border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900 shadow-sm">
          <div className="flex items-center gap-4">
            <button
              className="md:hidden text-gray-700 dark:text-white"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <h2 className="text-xl font-semibold capitalize text-indigo-600 dark:text-indigo-300">
              {active}
            </h2>
          </div>

          <div className="flex items-center gap-6">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2"
              >
                <Bell className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white w-6 h-6" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
                )}
              </button>

              {showNotifications && (
                <div className="absolute top-full left-1/2 -translate-x-[60%] mt-2 w-[90vw] max-w-xs bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-50 sm:left-auto sm:right-0 sm:translate-x-0 sm:w-80">
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700 text-indigo-600 dark:text-indigo-400 font-semibold">
                    Notifications
                  </div>
                  <ul className="max-h-60 overflow-y-auto divide-y divide-gray-200 dark:divide-gray-700">
                    {notifications.length ? (
                      notifications.map((note, i) => (
                        <li
                          key={i}
                          className="p-4 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm text-gray-800 dark:text-gray-300"
                        >
                          <p className="text-black dark:text-white font-medium">
                            {note.title}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {note.time}
                          </p>
                        </li>
                      ))
                    ) : (
                      <li className="p-4 text-gray-500 text-sm text-center">No notifications</li>
                    )}
                  </ul>
                  <div className="p-3 text-center text-sm border-t border-gray-200 dark:border-gray-700 text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer">
                    View All
                  </div>
                </div>
              )}
            </div>

            {/* Theme Toggle */}
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

            {/* User */}
            <div className="flex items-center gap-2">
              <img
                src="https://i.pravatar.cc/40?img=5"
                alt="Avatar"
                className="w-8 h-8 rounded-full"
              />
              {user?.name ? (
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Hi, {user.name}
                </span>
              ) : (
                <span className="text-sm text-gray-400 italic animate-pulse">
                  Loading name...
                </span>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-white text-black dark:bg-gray-900 dark:text-white">
          {active === "dashboard" && <DashboardView />}
          {active === "create" && <CreateCourseView />}
          {active === "courses" && <InstructorCoursesView />}
          {active === "earnings" && <EarningsView />}
          {active === "messages" && <MessagesView />}
          {active === "settings" && <SettingsView />}
        </main>
      </div>
    </div>
  );
}
