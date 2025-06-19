import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Home,
  BookOpen,
  Calendar,
  Award,
  MessageSquare,
  Settings,
  LogOut,
  Bell,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function StudentDashboard() {
  const [active, setActive] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const menu = [
    { label: "Dashboard", icon: <Home />, key: "dashboard" },
    { label: "My Courses", icon: <BookOpen />, key: "courses" },
    { label: "Schedule", icon: <Calendar />, key: "schedule" },
    { label: "Certificates", icon: <Award />, key: "certificates" },
    { label: "Messages", icon: <MessageSquare />, key: "messages" },
    { label: "Settings", icon: <Settings />, key: "settings" },
  ];

  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-400">
        You are logged out.
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-900 text-white">
      {/* Sidebar */}
      <aside
        className={`fixed md:static z-30 top-0 left-0 h-full md:h-auto w-64 bg-gray-950 border-r border-white/10 p-6 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Close button in mobile */}
        <div className="flex md:hidden justify-end mb-4">
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-white hover:text-gray-300"
          >
            <X size={24} />
          </button>
        </div>

        <h1 className="text-2xl font-bold text-indigo-400 mb-8">🎓 CourseHub</h1>
        <nav className="flex-1 space-y-4">
          {menu.map((item) => (
            <button
              key={item.key}
              onClick={() => {
                setActive(item.key);
                setSidebarOpen(false); // Close sidebar on mobile after selection
              }}
              className={`flex items-center gap-3 px-4 py-2 rounded-xl transition-all w-full text-left ${
                active === item.key
                  ? "bg-indigo-600 text-white"
                  : "text-gray-400 hover:bg-gray-800"
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>
        <button
          onClick={handleLogout}
          className="mt-8 flex items-center gap-3 text-sm text-red-400 hover:text-red-300"
        >
          <LogOut size={18} /> Logout
        </button>
      </aside>

      {/* Overlay on mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <header className="flex justify-between items-center px-4 md:px-8 py-4 border-b border-white/10 bg-gray-900">
          <div className="flex items-center gap-4">
            {/* Mobile menu button */}
            <button
              className="md:hidden text-white"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <h2 className="text-xl font-semibold capitalize text-indigo-300">
              {active}
            </h2>
          </div>
          <div className="flex items-center gap-6">
            <button className="relative">
              <Bell className="text-gray-400 hover:text-white" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-2">
              <img
                src="https://i.pravatar.cc/40?img=3"
                alt="Avatar"
                className="w-8 h-8 rounded-full"
              />
              <span className="text-sm text-gray-300">Hi, {user.name}</span>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-4 md:p-8 bg-gray-900 overflow-y-auto">
          <div className="text-gray-400 text-sm">
            <p>
              This is the{" "}
              <span className="text-white font-medium">{active}</span> section
              content.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
