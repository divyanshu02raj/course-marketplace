import React from "react";
import { BookOpen, Calendar, Award, MessageSquare } from "lucide-react";

const DashboardView = () => {
  const stats = [
    { label: "Active Courses", value: 3, icon: <BookOpen className="text-indigo-400" /> },
    { label: "Upcoming Sessions", value: 2, icon: <Calendar className="text-green-400" /> },
    { label: "Certificates", value: 5, icon: <Award className="text-yellow-400" /> },
    { label: "Unread Messages", value: 1, icon: <MessageSquare className="text-pink-400" /> },
  ];

  return (
    <div className="space-y-10 text-white">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <p className="text-gray-400 mt-2">
            Here’s a quick snapshot of your progress and updates.
          </p>
        </div>
        <button className="mt-4 sm:mt-0 px-5 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition">
          Continue Learning
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map(({ label, value, icon }, idx) => (
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
            Earned certificate{" "}
            <strong className="text-white">"Data Science Fundamentals"</strong>
          </li>
        </ul>
      </div>

      {/* Progress Chart Placeholder */}
      <div className="bg-gray-800 p-6 rounded-2xl shadow border border-gray-700 text-center">
        <h3 className="text-xl font-semibold text-indigo-300 mb-2">
          Weekly Learning Progress
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Coming soon: charts, insights, and goals!
        </p>
        <div className="h-32 bg-gray-700 rounded-xl flex items-center justify-center text-gray-500">
          📊 Progress chart placeholder
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
