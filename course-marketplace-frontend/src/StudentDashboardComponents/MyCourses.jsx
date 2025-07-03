// StudentDashboardComponents/MyCourses.jsx

import React from "react";
import { User } from "lucide-react";

const MyCourses = ({ courses }) => {
  const myCourses = courses.filter((course) => course.enrolled);

  if (myCourses.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400 italic text-lg">
          You haven’t enrolled in any courses yet.
        </p>
        <p className="text-sm text-gray-400 mt-1">Start learning something new today!</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-indigo-700 dark:text-indigo-400">🎓 My Courses</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {myCourses.map((course) => (
          <div
            key={course.id}
            className="bg-white dark:bg-gray-900 p-5 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all group"
          >
            {/* Thumbnail */}
            <div className="relative mb-4 overflow-hidden rounded-xl h-40">
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Title & Instructor */}
            <h3 className="text-lg font-semibold mb-1 text-gray-900 dark:text-white">
              {course.title}
            </h3>

            <p className="text-sm text-gray-700 dark:text-gray-400 flex items-center gap-1 mb-3">
              <User className="w-4 h-4" />
              {course.instructor}
            </p>

            {/* Progress Bar */}
            <div className="mb-1">
              <div className="flex justify-between text-sm text-indigo-600 dark:text-indigo-400 mb-1">
                <span>{course.progress}% Completed</span>
              </div>
              <div className="w-full h-2 bg-gray-300 dark:bg-gray-700 rounded-full">
                <div
                  className="h-2 bg-indigo-500 rounded-full transition-all"
                  style={{ width: `${course.progress}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyCourses;
