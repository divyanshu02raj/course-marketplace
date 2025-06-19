import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Home,
  BookOpen,
  PlusCircle,
  Users,
  DollarSign,
  MessageSquare,
  Settings,
  LogOut,
  Bell,
} from "lucide-react";

export default function InstructorDashboard() {
  const [active, setActive] = useState("dashboard");
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (!user) {
    return <p className="text-center mt-10 text-gray-600">You are logged out.</p>;
  }

  const menu = [
    { label: "Dashboard", icon: <Home />, key: "dashboard" },
    { label: "My Courses", icon: <BookOpen />, key: "courses" },
    { label: "Create Course", icon: <PlusCircle />, key: "create" },
    { label: "Student Q&A", icon: <Users />, key: "qa" },
    { label: "Earnings", icon: <DollarSign />, key: "earnings" },
    { label: "Messages", icon: <MessageSquare />, key: "messages" },
    { label: "Settings", icon: <Settings />, key: "settings" },
  ];

  return (
    <div className="min-h-screen flex bg-gray-900 text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-950 border-r border-white/10 p-6 flex flex-col">
        <h1 className="text-2xl font-bold text-indigo-400 mb-8">🎓 CourseHub</h1>
        <nav className="flex-1 space-y-4">
          {menu.map((item) => (
            <button
              key={item.key}
              onClick={() => setActive(item.key)}
              className={`flex items-center gap-3 px-4 py-2 rounded-xl transition-all ${
                active === item.key ? "bg-indigo-600 text-white" : "text-gray-400 hover:bg-gray-800"
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>
        <button
          onClick={handleLogout}
          className="mt-auto flex items-center gap-3 text-sm text-red-400 hover:text-red-300"
        >
          <LogOut size={18} /> Logout
        </button>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <header className="flex justify-between items-center px-8 py-4 border-b border-white/10 bg-gray-900">
          <h2 className="text-xl font-semibold capitalize text-indigo-300">{active}</h2>
          <div className="flex items-center gap-6">
            <button className="relative">
              <Bell className="text-gray-400 hover:text-white" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-2">
              <img
                src="https://i.pravatar.cc/40?img=5"
                alt="Avatar"
                className="w-8 h-8 rounded-full"
              />
              <span className="text-sm text-gray-300">Hi, {user.name}</span>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-8 bg-gray-900 overflow-y-auto">
          <div className="text-gray-400 text-sm">
            <p>
              This is the <span className="text-white font-medium">{active}</span> section content.
            </p>
            {/* Replace with components like <CreateCourse />, <Earnings />, etc. */}
          </div>
        </main>
      </div>
    </div>
  );
}
