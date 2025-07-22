// course-marketplace-frontend/src/pages/StudentDashboard.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Home, BookOpen, Calendar, Award, MessageSquare, Settings, LogOut, Bell, Menu, ClipboardCheck, X, Sun, Moon
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import useTheme from "../hooks/useTheme";
import axios from "../api/axios";
import toast from "react-hot-toast";

import CoursesView from "../StudentDashboardComponents/CoursesView";
import MyCourses from "../StudentDashboardComponents/MyCourses";
import CertificatesView from "../StudentDashboardComponents/CertificatesView";
import ScheduleView from "../StudentDashboardComponents/ScheduleView";
import MessagesView from "../StudentDashboardComponents/MessagesView";
import SettingsView from "../StudentDashboardComponents/SettingsView";
import AssessmentsView from "../StudentDashboardComponents/AssessmentsView";
import DashboardView from "../StudentDashboardComponents/DashboardView";

export default function StudentDashboard() {
  const { theme, toggleTheme } = useTheme();
  const [active, setActive] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [allCourses, setAllCourses] = useState([]);
  const [myEnrolledCourses, setMyEnrolledCourses] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);

  const fetchAllCourses = async () => {
      try {
          const response = await axios.get("/courses");
          setAllCourses(response.data);
      } catch (error) {
          toast.error("Could not fetch courses.");
      }
  };

  const fetchEnrolledCourses = async () => {
      try {
          const response = await axios.get("/courses/enrolled");
          setMyEnrolledCourses(response.data);
      } catch (error) {
          toast.error("Could not fetch your enrolled courses.");
      }
  };

  useEffect(() => {
    const loadInitialData = async () => {
        setDataLoading(true);
        await Promise.all([fetchAllCourses(), fetchEnrolledCourses()]);
        setDataLoading(false);
    };
    if (user) {
        loadInitialData();
    }
  }, [user]);

  // The handleEnroll function has been removed as it's no longer needed here.

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const menu = [
    { label: "Dashboard", icon: <Home />, key: "dashboard" },
    { label: "Courses", icon: <BookOpen />, key: "courses" },
    { label: "My Courses", icon: <BookOpen />, key: "my-courses" },
    { label: "Schedule", icon: <Calendar />, key: "schedule" },
    { label: "Certificates", icon: <Award />, key: "certificates" },
    { label: "Messages", icon: <MessageSquare />, key: "messages" },
    { label: "Settings", icon: <Settings />, key: "settings" },
    { label: "Assessments", icon: <ClipboardCheck />, key: "assessments" },
  ];

  // Mock data for other sections
  const [notifications, setNotifications] = useState([{ title: "New message from Mr. Smith", time: "5 min ago", read: false }]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [certificates] = useState([{ name: "React Basics", completionDate: "2025-05-20", expiryDate: "2025-06-20", status: "completed", thumbnail: "https://via.placeholder.com/150?text=React+Basics", viewLink: "#", downloadLink: "#" }]);
  const [certificateFilter, setCertificateFilter] = useState("all");
  const [messages] = useState([{ id: 1, subject: "Upcoming Course Update", sender: "Instructor Team", timestamp: "June 24, 2025", read: false, thread: [{ fromMe: false, text: "Hello! Your course has an updated schedule." }, { fromMe: true, text: "Thanks! I’ll check it out." }] }]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [sessions] = useState([{ course: "React Basics", date: "2025-06-13", time: "10:00 AM - 11:30 AM", instructor: "John Doe" }]);
  
  const unreadCount = notifications.filter(n => !n.read).length;
  const selectedISO = selectedDate.toISOString().split("T")[0];
  const filteredSessions = sessions.filter((s) => s.date === selectedISO);
  const sessionDates = sessions.map((s) => s.date);

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
        <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-8">🎓 CourseHub</h1>
        <nav className="flex-1 space-y-4">
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
                        <Bell className="text-gray-500 dark:text-gray-400 w-6 h-6" />
                        {unreadCount > 0 && <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />}
                    </button>
                    {showNotifications && (
                        <div className="absolute top-full right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                            <div className="p-4 border-b border-gray-200 dark:border-gray-700 text-indigo-600 dark:text-indigo-400 font-semibold">Notifications</div>
                            <ul className="max-h-60 overflow-y-auto divide-y divide-gray-200 dark:divide-gray-700">
                                {notifications.length ? (
                                notifications.map((note, i) => (
                                    <li key={i} className="p-4 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm">
                                    <p className="text-gray-800 dark:text-white font-medium">{note.title}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{note.time}</p>
                                    </li>
                                ))
                                ) : (
                                <li className="p-4 text-gray-500 text-sm text-center">No notifications</li>
                                )}
                            </ul>
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
          {active === "dashboard" && <DashboardView />}
          {active === "courses" && <CoursesView courses={allCourses} myCourses={myEnrolledCourses} />}
          {active === "my-courses" && <MyCourses courses={myEnrolledCourses} />}
          {active === "schedule" && <ScheduleView selectedDate={selectedDate} setSelectedDate={setSelectedDate} sessions={sessions} filteredSessions={filteredSessions} sessionDates={sessionDates} />}
          {active === "certificates" && <CertificatesView certificates={certificates} certificateFilter={certificateFilter} setCertificateFilter={setCertificateFilter} />}
          {active === "messages" && <MessagesView messages={messages} selectedMessage={selectedMessage} setSelectedMessage={setSelectedMessage} />}
          {active === "settings" && <SettingsView />}
          {active === "assessments" && <AssessmentsView />}
        </main>
      </div>
    </div>
  );
}
