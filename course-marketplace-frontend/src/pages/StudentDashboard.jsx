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
  Calendar as CalendarIcon,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import CalendarWidget from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../styles/CustomCalendar.css";

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
    { label: "Schedule", icon: <Calendar />, key: "schedule" },
    { label: "Certificates", icon: <Award />, key: "certificates" },
    { label: "Messages", icon: <MessageSquare />, key: "messages" },
    { label: "Settings", icon: <Settings />, key: "settings" },
    { label: "Assessments", icon: <ClipboardCheck />, key: "assessments" },
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
    // Add more certificates as needed
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


          {active === "dashboard" && (
  <div className="space-y-10 text-white">
    {/* Welcome Header */}
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
      <div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-indigo-400">Welcome back, Jane 👋</h2>
        <p className="text-gray-400 mt-2">Here’s a quick snapshot of your progress and updates.</p>
      </div>
      <button className="mt-4 sm:mt-0 px-5 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition">
        Continue Learning
      </button>
    </div>

    {/* Summary Stats */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {[
        { label: "Active Courses", value: 3, icon: <BookOpen className="text-indigo-400" /> },
        { label: "Upcoming Sessions", value: 2, icon: <Calendar className="text-green-400" /> },
        { label: "Certificates", value: 5, icon: <Award className="text-yellow-400" /> },
        { label: "Unread Messages", value: 1, icon: <MessageSquare className="text-pink-400" /> },
      ].map(({ label, value, icon }, idx) => (
        <div
          key={idx}
          className="bg-gray-800 p-6 rounded-2xl shadow border border-gray-700 hover:shadow-lg transition-all"
        >
          <div className="flex items-center gap-4 mb-3">
            <div className="p-2 bg-gray-700 rounded-full">{icon}</div>
            <span className="text-sm text-gray-400">{label}</span>
          </div>
          <p className="text-3xl font-bold text-white">{value}</p>
        </div>
      ))}
    </div>

    {/* Recent Activity */}
    <div className="bg-gray-800 p-6 rounded-2xl shadow border border-gray-700">
      <h3 className="text-2xl font-semibold text-indigo-300 mb-5">Recent Activity</h3>
      <ul className="space-y-4 text-sm text-gray-300">
        <li className="flex items-center gap-3">
          <span className="text-green-400">✅</span>
          Completed <strong className="text-white">"Algebra Basics"</strong> course
        </li>
        <li className="flex items-center gap-3">
          <span className="text-blue-400">📅</span>
          Attended session <strong className="text-white">"Intro to Biology"</strong> on June 25
        </li>
        <li className="flex items-center gap-3">
          <span className="text-yellow-400">📜</span>
          Earned certificate <strong className="text-white">"Data Science Fundamentals"</strong>
        </li>
      </ul>
    </div>

    {/* Optional: Progress Chart Placeholder */}
    <div className="bg-gray-800 p-6 rounded-2xl shadow border border-gray-700 text-center">
      <h3 className="text-xl font-semibold text-indigo-300 mb-2">Weekly Learning Progress</h3>
      <p className="text-sm text-gray-500 mb-4">Coming soon: charts, insights, and goals!</p>
      <div className="h-32 bg-gray-700 rounded-xl flex items-center justify-center text-gray-500">
        📊 Progress chart placeholder
      </div>
    </div>
  </div>
)}

       {active === "courses" && (
  <div>
    <h2 className="text-2xl font-semibold text-indigo-300 mb-6">My Courses</h2>

    {/* Search and Filter Section */}
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      {/* Search Bar */}
      <div className="flex-1">
        <input
          type="text"
          placeholder="Search courses..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-gray-700 text-white p-3 rounded-xl border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        {/* Enrollment Status Filter */}
        <select
          value={enrollmentFilter}
          onChange={(e) => setEnrollmentFilter(e.target.value)}
          className="bg-gray-700 text-white p-3 rounded-xl border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">All Courses</option>
          <option value="enrolled">Enrolled</option>
          <option value="not-enrolled">Not Enrolled</option>
        </select>

        {/* Category Filter */}
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="bg-gray-700 text-white p-3 rounded-xl border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">All Categories</option>
          {courseCategories.map((category, index) => (
            <option key={index} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
    </div>

    {/* Courses List */}
   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
  {courses.length > 0 ? (
    courses.map((course, idx) => (
      <div
        key={idx}
        className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-lg hover:shadow-xl transition-all"
      >
        {/* Course Thumbnail */}
        <img
          src={course.thumbnail} // Thumbnail URL
          alt={`${course.title} Thumbnail`}
          className="w-full h-32 object-cover rounded-xl mb-4"
        />

        {/* Course Title */}
        <h3 className="text-lg font-semibold text-white mb-2">{course.title}</h3>

        {/* Course Description */}
        <p className="text-sm text-gray-400 mb-4">{course.description}</p>

        {/* Instructor Name */}
        <p className="text-xs text-gray-500 mb-4">👨‍🏫 {course.instructor}</p>

        {/* Progress Bar */}
        <div className="mt-4 mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-indigo-400">{course.progress}% Completed</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-indigo-500 h-2 rounded-full"
              style={{ width: `${course.progress}%` }}
            ></div>
          </div>
        </div>

        {/* Enroll Button */}
        {!course.enrolled && (
          <button
            className="mt-4 w-full py-2 px-4 bg-indigo-600 text-white rounded-full hover:bg-indigo-500 transition-colors"
          >
            Enroll
          </button>
        )}
      </div>
    ))
  ) : (
    <p className="text-gray-500 italic">No courses match your filter.</p>
  )}
</div>

  </div>
)}



          {active === "schedule" && (
            <div>
              <h2 className="text-2xl font-semibold text-indigo-300 mb-6 flex items-center gap-2">
                <CalendarIcon className="text-indigo-400" /> Schedule Overview
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-8 items-start">
                {/* Calendar */}
                <div className="w-full max-w-xl bg-white text-gray-900 p-8 rounded-3xl shadow-lg border border-gray-100">
  <CalendarWidget
    value={selectedDate}
    onChange={setSelectedDate}
    showNeighboringMonth={false}
    tileClassName={({ date, view }) => {
      const iso = date.toISOString().split("T")[0];
      const isToday = iso === new Date().toISOString().split("T")[0];
      const hasSession = sessionDates.includes(iso);

      return [
        isToday ? "custom-tile-today" : "",
        hasSession ? "custom-tile-session" : "",
      ].join(" ");
    }}
    tileContent={({ date, view }) => {
      const iso = date.toISOString().split("T")[0];
      const sessionCount = sessions.filter(s => s.date === iso).length;

      return sessionCount > 0 ? (
        <div className="custom-tile-dot" />
      ) : null;
    }}
    next2Label={null}
    prev2Label={null}
  />
</div>



                {/* Sessions */}
                <div className="space-y-4">
                  {filteredSessions.length > 0 ? (
                    filteredSessions.map((session, idx) => (
                      <div
                        key={idx}
                        className="bg-gray-800 p-5 rounded-2xl border border-gray-700 shadow hover:shadow-lg transition-all"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="text-lg font-semibold text-white">
                            {session.course}
                          </h3>
                          <span className="text-xs px-2 py-1 border rounded-full text-indigo-400 border-indigo-500">
                            {session.date}
                          </span>
                        </div>
                        <p className="text-sm text-gray-400">
                          ⏰ {session.time}
                        </p>
                        <p className="text-sm text-gray-400">
                          👨‍🏫 {session.instructor}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 italic">
                      No sessions on this day.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}


         {active === "certificates" && (
  <div className="space-y-8">
    {/* Filters */}
    <div className="flex gap-6 mb-6">
      {/* Search input */}
      <div className="flex-1 max-w-md">
        <input
          type="text"
          placeholder="Search by course name"
          className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      {/* Filter dropdown */}
      <select
        className="p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        onChange={(e) => setCertificateFilter(e.target.value)}
      >
        <option value="all">All Certificates</option>
        <option value="active">Active Certificates</option>
        <option value="expired">Expired Certificates</option>
      </select>
    </div>

    {/* Certificate Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {/* Map through certificates */}
      {certificates
        .filter((certificate) => {
          const currentDate = new Date();
          const expiryDate = new Date(certificate.expiryDate);
          if (certificateFilter === "active") {
            return expiryDate >= currentDate;
          }
          if (certificateFilter === "expired") {
            return expiryDate < currentDate;
          }
          return true; // Show all certificates if no filter is applied
        })
        .map((certificate, idx) => (
          <div key={idx} className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-lg hover:shadow-xl transition-all">
            {/* Certificate Thumbnail */}
            <img
              src={certificate.thumbnail || "https://via.placeholder.com/150?text=Course+Name"}
              alt={certificate.name}
              className="w-full h-32 object-cover rounded-xl mb-4"
            />
            
            {/* Course Name */}
            <h3 className="text-lg font-semibold text-white mb-2">{certificate.name}</h3>

            {/* Completion Date */}
            <p className="text-sm text-gray-400 mb-2">Completed on: {new Date(certificate.completionDate).toLocaleDateString()}</p>

            {/* Certificate Status */}
            <span className={`text-xs px-2 py-1 rounded-full ${certificate.status === "completed" ? "text-green-400 bg-green-900" : "text-yellow-400 bg-yellow-900"} mb-4 block`}>
              {certificate.status === "completed" ? "Completed" : "In Progress"}
            </span>

            {/* Download Certificate */}
            <div className="flex gap-4 mt-4">
              <a
                href={certificate.viewLink || "#"}
                className="block py-2 px-4 bg-indigo-600 text-white rounded-full text-center hover:bg-indigo-500 transition-colors w-full text-center"
              >
                View Certificate
              </a>
              <a
                href={certificate.downloadLink || "#"}
                className="block py-2 px-4 bg-indigo-500 text-white rounded-full text-center hover:bg-indigo-400 transition-colors w-full text-center"
              >
                Download
              </a>
            </div>
            
            {/* Expiry Date */}
            <p className="text-xs text-gray-400 mt-4">Expires on: {new Date(certificate.expiryDate).toLocaleDateString()}</p>
          </div>
        ))}
    </div>
  </div>
)}
{active === "messages" && (
  <div className="relative h-full">
    <h2 className="text-2xl font-semibold text-indigo-300 mb-6 flex items-center gap-2">
      <MessageSquare className="text-indigo-400" /> Messages
    </h2>

    <div className="flex flex-col lg:flex-row gap-6 h-[80vh]">
      {/* Inbox */}
      <div className={`bg-gray-800 rounded-2xl p-4 shadow w-full lg:w-1/3 overflow-y-auto`}>
        <h3 className="text-white text-lg font-semibold mb-4">Inbox</h3>
        <div className="space-y-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              onClick={() => setSelectedMessage(msg)}
              className={`cursor-pointer p-4 rounded-xl transition-all border ${
                selectedMessage?.id === msg.id
                  ? "bg-indigo-700 border-indigo-500"
                  : msg.read
                  ? "bg-gray-700 border-transparent"
                  : "bg-gray-700 border-indigo-300"
              } hover:bg-gray-600`}
            >
              <h4 className="text-white font-medium truncate">{msg.subject}</h4>
              <p className="text-gray-400 text-sm truncate">{msg.sender}</p>
              <p className="text-xs text-gray-500 mt-1">{msg.timestamp}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="bg-gray-900 rounded-2xl shadow-md flex flex-col w-full lg:w-2/3">
        {selectedMessage ? (
          <>
{/* Header */}
<div
  className="flex items-center justify-between px-6 py-4 bg-gray-800 rounded-t-2xl shadow-lg border border-gray-700"
  style={{ zIndex: 10 }}
>
  <div className="flex items-center gap-4">
    <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">
      {selectedMessage.sender[0]}
    </div>
    <div>
      <h4 className="text-lg font-semibold text-white">{selectedMessage.subject}</h4>
      <p className="text-sm text-gray-400">{selectedMessage.sender}</p>
    </div>
  </div>
  <button
    onClick={() => setSelectedMessage(null)}
    className="text-gray-400 hover:text-white text-sm"
  >
    ✕
  </button>
</div>

            {/* Message Thread */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 bg-gray-800 rounded-b-2xl">
              {selectedMessage?.thread?.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.fromMe ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow ${
                      msg.fromMe
                        ? "bg-indigo-600 text-white rounded-br-none"
                        : "bg-gray-700 text-gray-100 rounded-bl-none"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

{/* Reply Bar */}
<div
  className="border-t border-gray-700 px-4 py-3 bg-gray-800 rounded-b-2xl shadow-lg flex items-center gap-3"
  style={{ zIndex: 10 }}
>
  <button className="text-gray-400 hover:text-white flex-shrink-0">📎</button>
  <input
    type="text"
    placeholder="Type your message..."
    className="flex-grow bg-gray-700 text-white p-3 rounded-xl focus:outline-none min-w-0"
  />
  <button className="bg-indigo-600 text-white px-5 py-2 rounded-xl hover:bg-indigo-700 flex-shrink-0">
    Send
  </button>
</div>

          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500 italic">
            Select a message to view
          </div>
        )}
      </div>
    </div>
  </div>
)}
{active === "settings" && (
  <div className="max-w-4xl mx-auto p-6 sm:p-8 bg-gray-900 rounded-3xl shadow-xl text-white space-y-12">
    <h2 className="text-3xl sm:text-4xl font-extrabold text-indigo-400 flex items-center gap-3 mb-8">
      <Settings className="text-indigo-400 w-8 h-8 sm:w-10 sm:h-10" /> Settings
    </h2>

    {/* Profile Picture and Personal Information */}
    <section className="bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-md flex flex-col sm:flex-row items-center sm:items-start gap-6">
      <div className="flex-shrink-0 flex flex-col items-center sm:items-start">
        <img
          src="https://placehold.co/96x96/png" // Replace with actual user profile URL
          alt="Profile"
          className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-indigo-500 object-cover"
        />
        <button className="mt-3 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition text-sm whitespace-nowrap">
          Change Picture
        </button>
      </div>

      <form className="flex-1 space-y-6 w-full max-w-lg">
        <label className="block">
          <span className="text-gray-300 font-medium mb-1 block">Full Name</span>
          <input
            type="text"
            placeholder="Jane Doe"
            className="w-full rounded-lg border border-gray-700 bg-gray-900 p-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </label>
        <label className="block">
          <span className="text-gray-300 font-medium mb-1 block">Email Address</span>
          <input
            type="email"
            placeholder="jane.doe@example.com"
            className="w-full rounded-lg border border-gray-700 bg-gray-900 p-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </label>
      </form>
    </section>

    {/* Preferences */}
    <section className="bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-md space-y-8">
      <h3 className="text-2xl font-semibold border-b border-gray-700 pb-3 mb-6">
        Preferences
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {/* Notifications */}
        <div>
          <h4 className="text-xl font-semibold mb-4">Notifications</h4>
          <label className="flex items-center gap-3 mb-3 cursor-pointer">
            <input type="checkbox" className="form-checkbox h-5 w-5 text-indigo-500" />
            <span>Email Notifications</span>
          </label>
          <label className="flex items-center gap-3 mb-3 cursor-pointer">
            <input type="checkbox" className="form-checkbox h-5 w-5 text-indigo-500" />
            <span>Push Notifications</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" className="form-checkbox h-5 w-5 text-indigo-500" />
            <span>SMS Notifications</span>
          </label>
        </div>

        {/* Appearance */}
        <div>
          <h4 className="text-xl font-semibold mb-4">Appearance</h4>
          <label className="flex items-center gap-3 mb-3 cursor-pointer">
            <input type="radio" name="theme" className="form-radio h-5 w-5 text-indigo-500" defaultChecked />
            <span>Dark Mode</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="radio" name="theme" className="form-radio h-5 w-5 text-indigo-500" />
            <span>Light Mode</span>
          </label>
        </div>
      </div>
    </section>

    {/* Security */}
    <section className="bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-md space-y-6 max-w-lg mx-auto">
      <h3 className="text-2xl font-semibold border-b border-gray-700 pb-3 mb-6">
        Security
      </h3>

      <label className="block">
        <span className="text-gray-300 font-medium mb-1 block">Current Password</span>
        <input
          type="password"
          className="w-full rounded-lg border border-gray-700 bg-gray-900 p-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
          placeholder="••••••••"
        />
      </label>
      <label className="block">
        <span className="text-gray-300 font-medium mb-1 block">New Password</span>
        <input
          type="password"
          className="w-full rounded-lg border border-gray-700 bg-gray-900 p-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
          placeholder="••••••••"
        />
      </label>
      <label className="block">
        <span className="text-gray-300 font-medium mb-1 block">Confirm New Password</span>
        <input
          type="password"
          className="w-full rounded-lg border border-gray-700 bg-gray-900 p-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
          placeholder="••••••••"
        />
      </label>

      <button className="bg-indigo-600 hover:bg-indigo-700 w-full py-3 rounded-xl font-semibold transition mt-6">
        Update Password
      </button>
    </section>

    {/* Save all settings */}
    <div className="text-center mt-6">
      <button className="bg-indigo-600 hover:bg-indigo-700 px-10 py-3 rounded-xl font-extrabold text-lg transition">
        Save All Changes
      </button>
    </div>
  </div>
)}
{active === "assessments" && (
  <div className="max-w-6xl mx-auto p-8 bg-gray-900 rounded-3xl shadow-xl text-white space-y-14">
    <header className="flex items-center gap-4 mb-10">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-12 w-12 text-indigo-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12h6m-6 4h6m2 4H7a2 2 0 01-2-2V7a2 2 0 012-2h5l5 5v8a2 2 0 01-2 2z"
        />
      </svg>
      <h2 className="text-4xl font-extrabold tracking-tight text-indigo-400">Assessments</h2>
    </header>

    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
      {/* Assessment Card Template */}
      <article className="bg-gray-800 rounded-3xl p-7 shadow-lg hover:shadow-indigo-600 transition-shadow transform hover:-translate-y-1">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-2xl font-bold leading-snug text-white">Math Test</h3>
          <span className="inline-block rounded-full bg-gradient-to-tr from-indigo-600 to-indigo-400 px-3 py-1 text-xs font-semibold tracking-wide text-white select-none">
            Upcoming
          </span>
        </div>
        <p className="text-gray-400 mb-5 leading-relaxed">
          A comprehensive algebra and geometry test. Duration: 30 minutes.
        </p>
        <p className="text-sm text-gray-500 mb-5">
          <strong>Date:</strong>{" "}
          <time dateTime="2025-06-30" className="italic">
            June 30, 2025
          </time>
        </p>

        <button
          className="flex items-center justify-center gap-3 w-full rounded-xl bg-indigo-600 py-3 font-semibold text-white hover:bg-indigo-700 active:scale-95 transition-transform"
          aria-label="Start Math Test"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M14.752 11.168l-6.516-3.758A1 1 0 007 8.256v7.488a1 1 0 001.236.97l6.516-1.879a1 1 0 000-1.84z"
            />
          </svg>
          Start Test
        </button>
      </article>

      <article className="bg-gray-800 rounded-3xl p-7 shadow-lg hover:shadow-green-600 transition-shadow transform hover:-translate-y-1">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-2xl font-bold leading-snug text-white">Science Quiz</h3>
          <span className="inline-block rounded-full bg-gradient-to-tr from-green-600 to-green-400 px-3 py-1 text-xs font-semibold tracking-wide text-white select-none">
            Completed
          </span>
        </div>
        <p className="text-gray-400 mb-5 leading-relaxed">
          Quick quiz covering biology and chemistry basics.
        </p>
        <p className="text-sm text-gray-500 mb-5">
          <strong>Date:</strong>{" "}
          <time dateTime="2025-07-05" className="italic">
            July 5, 2025
          </time>
        </p>

        <button
          disabled
          className="flex items-center justify-center gap-3 w-full rounded-xl bg-gray-700 py-3 font-semibold text-gray-400 cursor-not-allowed select-none"
          aria-label="Science Quiz Completed"
          title="You have completed this quiz"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          Completed
        </button>
      </article>

      <article className="bg-gray-800 rounded-3xl p-7 shadow-lg hover:shadow-yellow-500 transition-shadow transform hover:-translate-y-1 flex flex-col justify-between">
        <div className="mb-4">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-2xl font-bold leading-snug text-white">History Assignment</h3>
            <span className="inline-block rounded-full bg-gradient-to-tr from-yellow-500 to-yellow-400 px-3 py-1 text-xs font-semibold tracking-wide text-gray-900 select-none">
              In Progress
            </span>
          </div>
          <p className="text-gray-400 mb-5 leading-relaxed">
            Essay and multiple choice questions about World War II.
          </p>
          <p className="text-sm text-gray-500 mb-4">
            <strong>Date:</strong>{" "}
            <time dateTime="2025-07-12" className="italic">
              July 12, 2025
            </time>
          </p>
          {/* Progress bar */}
          <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
            <div
              className="bg-yellow-400 h-3 rounded-full transition-all duration-500"
              style={{ width: "65%" }}
              aria-valuenow={65}
              aria-valuemin={0}
              aria-valuemax={100}
              role="progressbar"
              aria-label="History Assignment progress"
            />
          </div>
        </div>

        <button
          className="mt-auto flex items-center justify-center gap-3 w-full rounded-xl bg-yellow-500 text-gray-900 py-3 font-semibold hover:bg-yellow-600 active:scale-95 transition-transform"
          aria-label="Continue History Assignment"
        >
          Continue
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </article>
    </section>
  </div>
)}


</main>
      </div>
    </div>
  );
}