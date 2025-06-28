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
  ClipboardCheck,
  X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";



import CoursesView from "../StudentDashboardComponents/CoursesView";
import MyCourses from "../StudentDashboardComponents/MyCourses";
import CertificatesView from "../StudentDashboardComponents/CertificatesView";
import ScheduleView from "../StudentDashboardComponents/ScheduleView";
import MessagesView from "../StudentDashboardComponents/MessagesView";
import SettingsView from "../StudentDashboardComponents/SettingsView";
import AssessmentsView from "../StudentDashboardComponents/AssessmentsView";
import DashboardView from "../StudentDashboardComponents/DashboardView";



export default function StudentDashboard() {
  const [active, setActive] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const menu = [
    { label: "Dashboard", icon: <Home />, key: "dashboard" },
    { label: "Courses", icon: <BookOpen />, key: "courses" },
    { label: "My Courses", icon: <BookOpen />, key: "my-courses" }, // ✅ New item
    { label: "Schedule", icon: <Calendar />, key: "schedule" },
    { label: "Certificates", icon: <Award />, key: "certificates" },
    { label: "Messages", icon: <MessageSquare />, key: "messages" },
    { label: "Settings", icon: <Settings />, key: "settings" },
    { label: "Assessments", icon: <ClipboardCheck />, key: "assessments" },
  ];

    const courses = [
  {
    id: 1,
    title: "React Basics",
    instructor: "John Doe",
    progress: 75, // percent
    startDate: "2025-05-01",
    thumbnail:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=400&q=60",
  },
  {
    id: 2,
    title: "Node.js Advanced",
    instructor: "Jane Smith",
    progress: 40,
    startDate: "2025-04-15",
    enrolled: true, 
    thumbnail:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=400&q=60",
  },
  {
    id: 3,
    title: "UI/UX Workshop",
    instructor: "Alex Lee",
    progress: 100,
    startDate: "2025-03-20",
    thumbnail:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=400&q=60",
  },
];


  const sessions = [
    {
      course: "React Basics",
      date: "2025-06-13",
      time: "10:00 AM - 11:30 AM",
      instructor: "John Doe",
    },
    {
      course: "Node.js Advanced",
      date: "2025-06-14",
      time: "2:00 PM - 3:30 PM",
      instructor: "Jane Smith",
    },
    {
      course: "UI/UX Workshop",
      date: "2025-06-15",
      time: "5:00 PM - 6:30 PM",
      instructor: "Alex Lee",
    },
  ];

const courseCategories = [
  "Web Development",
  "UI/UX Design",
  "Data Science",
  "Machine Learning",
  "Mobile Development",
  "Cloud Computing",
  "Artificial Intelligence",
  "Cybersecurity",
];

const [certificateFilter, setCertificateFilter] = useState("all");
const [certificates] = useState([
  {
    name: "React Basics",
    completionDate: "2025-05-20",
    expiryDate: "2025-06-20",
    status: "completed",
    thumbnail: "https://via.placeholder.com/150?text=React+Basics",
    viewLink: "#",
    downloadLink: "#",
  },
  {
    name: "Node.js Advanced",
    completionDate: "2025-06-01",
    expiryDate: "2025-07-01",
    status: "in-progress",
    thumbnail: "https://via.placeholder.com/150?text=Node+JS",
    viewLink: "#",
    downloadLink: "#",
  },
]);


    // Example data for messages
const messages = [
  {
    id: 1,
    subject: "Upcoming Course Update",
    sender: "Instructor Team",
    timestamp: "June 24, 2025",
    read: false,
    thread: [
      { fromMe: false, text: "Hello! Your course has an updated schedule." },
      { fromMe: true, text: "Thanks! I’ll check it out." },
    ],
  },
  // more messages...
];

const upcomingAssessments = [
  { id: 1, title: "Module 1 Quiz", dueDate: "June 30, 2025" },
  { id: 2, title: "Assignment: React Components", dueDate: "July 2, 2025" },
];

const completedAssessments = [
  { id: 3, title: "Introduction Quiz", submittedDate: "June 20, 2025", score: 85 },
  { id: 4, title: "JavaScript Assignment", submittedDate: "June 23, 2025", score: 72 },
];


  const [selectedMessage, setSelectedMessage] = useState(null);

  const selectedISO = selectedDate.toISOString().split("T")[0];
  const filteredSessions = sessions.filter((s) => s.date === selectedISO);
  const sessionDates = sessions.map((s) => s.date);
  const [searchQuery, setSearchQuery] = useState(""); // Search query
// Define the state for enrollment filter
const [enrollmentFilter, setEnrollmentFilter] = useState("all"); // all, enrolled, not-enrolled
const [categoryFilter, setCategoryFilter] = useState(""); // Category filter
const [sortBy, setSortBy] = useState("newest"); // Sort courses by newest or oldest
const [notifications, setNotifications] = useState([
  { title: "New message from Mr. Smith", time: "5 min ago" },
  { title: "Science quiz results released", time: "1 hour ago" },
  { title: "Upcoming session: History 101", time: "Tomorrow at 10am" },
]);
const [showNotifications, setShowNotifications] = useState(false);
const unreadCount = notifications.length; // or filter only unread ones


const filteredCourses = courses.filter((course) => {
  const matchesSearch =
    course.title.toLowerCase().includes(searchQuery.toLowerCase());

  const matchesEnrollment =
    enrollmentFilter === "all" ||
    (enrollmentFilter === "enrolled" && course.enrolled) ||
    (enrollmentFilter === "not-enrolled" && !course.enrolled);

  const matchesCategory =
    !categoryFilter || course.category.toLowerCase().includes(categoryFilter.toLowerCase());

  return matchesSearch && matchesEnrollment && matchesCategory;
});

// Sort by date (newest or oldest)
const sortedCourses = filteredCourses.sort((a, b) => {
  if (sortBy === "newest") {
    return new Date(b.startDate) - new Date(a.startDate); // Newest first
  } else {
    return new Date(a.startDate) - new Date(b.startDate); // Oldest first
  }
});



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

  return (
<div className="h-screen flex overflow-hidden bg-gray-900 text-white">
  {/* Sidebar */}
  <aside
    className={`w-64 bg-gray-950 border-r border-white/10 p-6 z-30 transform transition-transform duration-300 ease-in-out
      fixed md:relative h-full md:h-auto
      ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
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

  {/* Mobile overlay */}
  {sidebarOpen && (
    <div
      className="fixed inset-0 bg-black bg-opacity-40 z-20 md:hidden"
      onClick={() => setSidebarOpen(false)}
    ></div>
  )}

  {/* Main Content */}
  <div className="flex-1 flex flex-col overflow-hidden">
    {/* Header */}
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
        <div className="relative">
  <button onClick={() => setShowNotifications(!showNotifications)} className="relative p-2">
    <Bell className="text-gray-400 hover:text-white w-6 h-6" />
    {unreadCount > 0 && (
      <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
    )}
  </button>

  {showNotifications && (
    <div
  className="absolute top-full left-1/2 -translate-x-[60%] mt-2 w-[90vw] max-w-xs bg-gray-800 rounded-xl shadow-lg border border-gray-700 z-50 sm:left-auto sm:right-0 sm:translate-x-0 sm:w-80"
>


      <div className="p-4 border-b border-gray-700 text-indigo-400 font-semibold">
        Notifications
      </div>
      <ul className="max-h-60 overflow-y-auto divide-y divide-gray-700">
        {notifications.length ? (
          notifications.map((note, i) => (
            <li key={i} className="p-4 hover:bg-gray-700 text-sm text-gray-300">
              <p className="text-white font-medium">{note.title}</p>
              <p className="text-xs text-gray-500">{note.time}</p>
            </li>
          ))
        ) : (
          <li className="p-4 text-gray-500 text-sm text-center">No notifications</li>
        )}
      </ul>
      <div className="p-3 text-center text-sm border-t border-gray-700 text-indigo-400 hover:underline cursor-pointer">
        View All
      </div>
    </div>
  )}
</div>


        <div className="flex items-center gap-2">
          <img
            src="https://i.pravatar.cc/40?img=3"
            alt="Avatar"
            className="w-8 h-8 rounded-full"
          />
          {user?.name ? (
            <span className="text-sm text-gray-300">Hi, {user.name}</span>
          ) : (
            <span className="text-sm text-gray-500 italic animate-pulse">
              Loading name...
            </span>
          )}
        </div>
      </div>
    </header>




          <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-gray-900">


          
{active === "dashboard" && <DashboardView />}

  {active === "courses" && (
  <CoursesView
    searchQuery={searchQuery}
    setSearchQuery={setSearchQuery}
    enrollmentFilter={enrollmentFilter}
    setEnrollmentFilter={setEnrollmentFilter}
    categoryFilter={categoryFilter}
    setCategoryFilter={setCategoryFilter}
    courseCategories={courseCategories}
    courses={courses}
  />
)}
{active === "my-courses" && <MyCourses courses={courses} />}

{active === "schedule" && (
  <ScheduleView
    selectedDate={selectedDate}
    setSelectedDate={setSelectedDate}
    sessions={sessions}
    filteredSessions={filteredSessions}
    sessionDates={sessionDates}
  />
)}

  
    {active === "certificates" && (
      <CertificatesView
        certificates={certificates}
        certificateFilter={certificateFilter}
        setCertificateFilter={setCertificateFilter}
      />
    )}
  

         

         
{active === "messages" && (
  <MessagesView
    messages={messages}
    selectedMessage={selectedMessage}
    setSelectedMessage={setSelectedMessage}
  />
)}

{active === "settings" && <SettingsView />}

{active === "assessments" && <AssessmentsView />}

</main>
      </div>
    </div>
  );
}