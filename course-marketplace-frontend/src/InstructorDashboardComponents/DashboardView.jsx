import { useState } from "react";
import { TrendingUp, DollarSign, Users, FileText, CheckCircle } from "lucide-react";
import { LineChart, Line, ResponsiveContainer, Tooltip, CartesianGrid, XAxis, YAxis } from "recharts"; // For performance graph

// Mock data for dashboard stats
const dashboardStats = {
  totalCourses: 15,
  totalStudents: 345,
  earnings: 2000,
  upcomingCourses: 3,
};

// Sample performance data for line chart (This will be dynamic in production)
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
    <div className="text-gray-300">
      <h2 className="text-3xl font-semibold mb-6 text-indigo-400">Instructor Dashboard</h2>
      <p className="text-lg mb-10">
        Welcome to your instructor space. Monitor your courses, performance, and more, all in one place.
      </p>

      {/* Dashboard Stats Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        {/* Total Courses */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 p-6 rounded-lg shadow-xl transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-semibold text-gray-200">Total Courses</h3>
              <p className="text-4xl font-bold">{dashboardStats.totalCourses}</p>
            </div>
            <TrendingUp size={32} className="text-indigo-300" />
          </div>
        </div>

        {/* Total Students */}
        <div className="bg-gradient-to-r from-green-500 to-green-700 p-6 rounded-lg shadow-xl transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-semibold text-gray-200">Total Students</h3>
              <p className="text-4xl font-bold">{dashboardStats.totalStudents}</p>
            </div>
            <Users size={32} className="text-green-300" />
          </div>
        </div>

        {/* Earnings */}
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-6 rounded-lg shadow-xl transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-semibold text-gray-200">Earnings</h3>
              <p className="text-4xl font-bold">${dashboardStats.earnings}</p>
            </div>
            <DollarSign size={32} className="text-yellow-300" />
          </div>
        </div>

        {/* Upcoming Courses */}
        <div className="bg-gradient-to-r from-red-500 to-red-700 p-6 rounded-lg shadow-xl transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-semibold text-gray-200">Upcoming Courses</h3>
              <p className="text-4xl font-bold">{dashboardStats.upcomingCourses}</p>
            </div>
            <FileText size={32} className="text-red-300" />
          </div>
        </div>
      </div>

      {/* Course Performance Section */}
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl mb-10">
        <h3 className="text-2xl font-semibold mb-6 text-indigo-300">Course Performance</h3>

        <div className="relative">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="name" stroke="#ddd" />
              <YAxis stroke="#ddd" />
              <Tooltip contentStyle={{ backgroundColor: '#333' }} />
              <Line type="monotone" dataKey="performance" stroke="#82ca9d" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>

          <div className="absolute top-0 right-0 text-sm text-indigo-300">
            <button className="px-4 py-2 bg-indigo-600 rounded-md hover:bg-indigo-500 focus:outline-none">
              View More
            </button>
          </div>
        </div>
      </div>

      {/* Course Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
        {/* Student Feedback */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-700 p-6 rounded-lg shadow-xl transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
          <h3 className="text-xl font-semibold text-gray-200">Student Feedback</h3>
          <p className="text-3xl font-bold">4.9/5</p>
          <p className="text-gray-400">Based on 200 reviews</p>
        </div>

        {/* Average Rating */}
        <div className="bg-gradient-to-r from-purple-500 to-purple-700 p-6 rounded-lg shadow-xl transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
          <h3 className="text-xl font-semibold text-gray-200">Average Rating</h3>
          <p className="text-3xl font-bold">4.8/5</p>
        </div>

        {/* Recent Review */}
        <div className="bg-gradient-to-r from-teal-500 to-teal-700 p-6 rounded-lg shadow-xl transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
          <h3 className="text-xl font-semibold text-gray-200">Recent Review</h3>
          <p className="text-2xl font-bold">"Amazing course! Learned so much!"</p>
          <p className="text-gray-400">- Sarah L.</p>
        </div>
      </div>
    </div>
  );
}
