import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, } from "react-router-dom";
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
  Menu,
  X,
} from "lucide-react";
import AddCourse from "./instructor/AddCourse"; // adjust the path if necessary


export default function InstructorDashboard() {
  const [active, setActive] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
    { label: "Create Course", icon: <PlusCircle />, key: "create", path: "/instructor/AddCourse" },
    { label: "Student Q&A", icon: <Users />, key: "qa" },
    { label: "Earnings", icon: <DollarSign />, key: "earnings" },
    { label: "Messages", icon: <MessageSquare />, key: "messages" },
    { label: "Settings", icon: <Settings />, key: "settings" },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-900 text-white">
      {/* Sidebar */}
      <aside
  className={`md:h-screen h-full w-64 bg-gray-950 border-r border-white/10 p-6 transition-all duration-300 ease-in-out z-30
    ${sidebarOpen ? "fixed top-0 left-0 transform translate-x-0" : "fixed top-0 left-0 transform -translate-x-full md:static md:translate-x-0"}`}
>

      
        {/* Close button for mobile */}
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
                setSidebarOpen(false);
              }}
              className={`flex items-center gap-3 px-4 py-2 rounded-xl transition-all w-full text-left ${
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
          className="mt-8 flex items-center gap-3 text-sm text-red-400 hover:text-red-300"
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

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <header className="flex justify-between items-center px-4 md:px-8 py-4 border-b border-white/10 bg-gray-900">
          <div className="flex items-center gap-4">
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
                src="https://i.pravatar.cc/40?img=5"
                alt="Avatar"
                className="w-8 h-8 rounded-full"
              />
              <span className="text-sm text-gray-300">Hi, {user.name}</span>
            </div>
          </div>
        </header>

        {/* Content area */}
        <main className="flex-1 p-4 md:p-8 bg-gray-900 overflow-y-auto">
                  {active === "dashboard" && (
          <p className="text-gray-400">Welcome to your dashboard overview!</p>
        )}

        {active === "create" && (
          <AddCourse />
        )}

        {active !== "dashboard" && active !== "create" && (
          <p className="text-gray-400">This is the <span className="text-white">{active}</span> section content.</p>
        )}

        </main>
      </div>
    </div>
  );

}
