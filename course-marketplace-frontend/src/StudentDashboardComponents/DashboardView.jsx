// src/StudentDashboardComponents/DashboardView.jsx
import React from "react";
import { BookOpen, Calendar, Award, MessageSquare, CheckCircle } from "lucide-react"; // ✅ Corrected: Added CheckCircle
import { useAuth } from "../context/AuthContext";

export default function DashboardView() {
  const { user } = useAuth();

  const stats = [
    { label: "Active Courses", value: 3, icon: <BookOpen className="text-indigo-500 dark:text-indigo-400" /> },
    { label: "Upcoming Sessions", value: 2, icon: <Calendar className="text-green-500 dark:text-green-400" /> },
    { label: "Certificates Earned", value: 5, icon: <Award className="text-yellow-500 dark:text-yellow-400" /> },
    { label: "Unread Messages", value: 1, icon: <MessageSquare className="text-pink-500 dark:text-pink-400" /> },
  ];

  const recentActivity = [
    { text: "Completed lesson 'Introduction to React Hooks'", time: "2 hours ago", type: "complete" },
    { text: "Enrolled in new course 'Advanced CSS Mastery'", time: "1 day ago", type: "enroll" },
    { text: "Received a new message from your instructor", time: "2 days ago", type: "message" },
  ];

  return (
    <div className="space-y-10 text-gray-900 dark:text-white">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
            Welcome back, {user?.name || "Student"}!
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Here’s a quick snapshot of your progress and updates.
          </p>
        </div>
        <button className="mt-4 sm:mt-0 px-5 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition shadow-md hover:shadow-lg">
          Continue Learning
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map(({ label, value, icon }, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-800 hover:shadow-lg hover:-translate-y-1 transition-all"
          >
            <div className="flex items-center gap-4 mb-3">
              <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full">
                {icon}
              </div>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{label}</span>
            </div>
            <p className="text-4xl font-bold text-gray-800 dark:text-white">{value}</p>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-800">
        <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-5">Recent Activity</h3>
        <ul className="space-y-4">
          {recentActivity.map((activity, idx) => (
            <li key={idx} className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center ${
                  activity.type === 'complete' ? 'bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400' :
                  activity.type === 'enroll' ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400' :
                  'bg-pink-100 dark:bg-pink-900/50 text-pink-600 dark:text-pink-400'
              }`}>
                {activity.type === 'complete' ? <CheckCircle size={20} /> : 
                 activity.type === 'enroll' ? <BookOpen size={20} /> : 
                 <MessageSquare size={20} />}
              </div>
              <div>
                <p className="text-sm text-gray-800 dark:text-gray-200">{activity.text}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
