// course-marketplace-frontend\src\StudentDashboardComponents\MyCourses.jsx
import React from "react";
import { User, PlayCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const MyCourses = ({ courses }) => {
  const myCourses = courses;

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
        {myCourses.map((course, index) => (
          <motion.div
            key={course._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="bg-white dark:bg-gray-900 p-5 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all group flex flex-col"
          >
            <div className="relative mb-4 overflow-hidden rounded-xl h-40">
              <img
                src={course.thumbnail || "https://placehold.co/400x200/e2e8f0/475569?text=Course"}
                alt={course.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="flex-grow">
                <h3 className="text-lg font-semibold mb-1 text-gray-900 dark:text-white">
                    {course.title}
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-400 flex items-center gap-1 mb-3">
                    <User className="w-4 h-4" />
                    {course.instructor?.name || 'Instructor'}
                </p>
            </div>
            <div className="mt-auto pt-4">
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                <span>Progress</span>
                <span className="font-semibold text-indigo-600 dark:text-indigo-400">{Math.round(course.progress || 0)}% Complete</span>
              </div>
              <div className="w-full h-2 bg-gray-300 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-2 bg-indigo-500 rounded-full transition-all duration-500"
                  style={{ width: `${course.progress || 0}%` }}
                ></div>
              </div>
              <div className="mt-6">
                <Link 
                    to={`/learn/${course._id}`}
                    className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition-all transform active:scale-95"
                >
                    <PlayCircle size={18} />
                    {course.progress > 0 ? 'Continue Learning' : 'Start Course'}
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default MyCourses;
