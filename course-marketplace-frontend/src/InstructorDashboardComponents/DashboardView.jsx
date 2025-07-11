// course-marketplace-frontend\src\InstructorDashboardComponents\DashboardView.jsx
import { TrendingUp, DollarSign, Users, FileText } from "lucide-react";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";

// Mock data for dashboard stats
const dashboardStats = {
  totalCourses: 15,
  totalStudents: 345,
  earnings: 2000,
  upcomingCourses: 3,
};

// Sample performance data
const performanceData = [
  { name: "Mon", performance: 90 },
  { name: "Tue", performance: 88 },
  { name: "Wed", performance: 92 },
  { name: "Thu", performance: 85 },
  { name: "Fri", performance: 95 },
  { name: "Sat", performance: 97 },
  { name: "Sun", performance: 99 },
];

export default function DashboardView() {
  return (
    <div className="text-gray-800 dark:text-gray-300">
      <h2 className="text-3xl font-semibold mb-6 text-indigo-700 dark:text-indigo-400">
        Instructor Dashboard
      </h2>
      <p className="text-lg mb-10 text-gray-600 dark:text-gray-400">
        Welcome to your instructor space. Monitor your courses, performance, and more, all in one place.
      </p>

      {/* Dashboard Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        {/* Total Courses */}
        <div className="bg-gradient-to-r from-indigo-500 to-indigo-700 dark:from-indigo-600 dark:to-indigo-800 p-6 rounded-lg shadow-md hover:shadow-xl transition-transform transform hover:scale-105">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-white">Total Courses</h3>
              <p className="text-4xl font-bold text-white">{dashboardStats.totalCourses}</p>
            </div>
            <TrendingUp size={32} className="text-indigo-200" />
          </div>
        </div>

        {/* Total Students */}
        <div className="bg-gradient-to-r from-green-500 to-green-700 dark:from-green-600 dark:to-green-800 p-6 rounded-lg shadow-md hover:shadow-xl transition-transform transform hover:scale-105">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-white">Total Students</h3>
              <p className="text-4xl font-bold text-white">{dashboardStats.totalStudents}</p>
            </div>
            <Users size={32} className="text-green-200" />
          </div>
        </div>

        {/* Earnings */}
        <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 dark:from-yellow-500 dark:to-yellow-700 p-6 rounded-lg shadow-md hover:shadow-xl transition-transform transform hover:scale-105">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-white">Earnings</h3>
              <p className="text-4xl font-bold text-white">${dashboardStats.earnings}</p>
            </div>
            <DollarSign size={32} className="text-yellow-200" />
          </div>
        </div>

        {/* Upcoming Courses */}
        <div className="bg-gradient-to-r from-red-500 to-red-700 dark:from-red-600 dark:to-red-800 p-6 rounded-lg shadow-md hover:shadow-xl transition-transform transform hover:scale-105">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-white">Upcoming Courses</h3>
              <p className="text-4xl font-bold text-white">{dashboardStats.upcomingCourses}</p>
            </div>
            <FileText size={32} className="text-red-200" />
          </div>
        </div>
      </div>

      {/* Course Performance Section */}
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md mb-12">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-semibold text-indigo-700 dark:text-indigo-300">Course Performance</h3>
          <button className="px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-500 text-white rounded-md transition">
            View More
          </button>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={performanceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
            <XAxis dataKey="name" stroke="#666" />
            <YAxis stroke="#666" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1f2937",
                border: "none",
                borderRadius: "0.5rem",
                color: "#fff",
              }}
              labelStyle={{ color: "#ccc" }}
            />
            <Line
              type="monotone"
              dataKey="performance"
              stroke="#10b981"
              strokeWidth={3}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Course Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
        {/* Student Feedback */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-700 dark:from-blue-600 dark:to-blue-800 p-6 rounded-lg shadow-md hover:shadow-xl transition-transform transform hover:scale-105">
          <h3 className="text-lg font-semibold text-white">Student Feedback</h3>
          <p className="text-3xl font-bold text-white">4.9/5</p>
          <p className="text-white text-opacity-70">Based on 200 reviews</p>
        </div>

        {/* Average Rating */}
        <div className="bg-gradient-to-r from-purple-500 to-purple-700 dark:from-purple-600 dark:to-purple-800 p-6 rounded-lg shadow-md hover:shadow-xl transition-transform transform hover:scale-105">
          <h3 className="text-lg font-semibold text-white">Average Rating</h3>
          <p className="text-3xl font-bold text-white">4.8/5</p>
        </div>

        {/* Recent Review */}
        <div className="bg-gradient-to-r from-teal-500 to-teal-700 dark:from-teal-600 dark:to-teal-800 p-6 rounded-lg shadow-md hover:shadow-xl transition-transform transform hover:scale-105">
          <h3 className="text-lg font-semibold text-white">Recent Review</h3>
          <p className="text-2xl font-bold text-white">"Amazing course! Learned so much!"</p>
          <p className="text-white text-opacity-70">- Sarah L.</p>
        </div>
      </div>
    </div>
  );
}
