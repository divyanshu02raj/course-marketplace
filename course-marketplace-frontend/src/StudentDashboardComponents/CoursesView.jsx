// course-marketplace-frontend\src\StudentDashboardComponents\CoursesView.jsx
import React, { useState } from "react";
import { User } from "lucide-react";
import { Link } from "react-router-dom";

const CoursesView = ({ courses, myCourses }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const myCourseIds = myCourses.map(c => c._id);

  const filteredCourses = courses
    .filter((course) =>
      course.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((course) => {
      if (categoryFilter) return course.category === categoryFilter;
      return true;
    });
  
  const courseCategories = [...new Set(courses.map(c => c.category))];

  return (
    <div className="text-gray-900 dark:text-white space-y-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
            <h2 className="text-3xl font-bold text-indigo-700 dark:text-indigo-400">
            📚 Explore Courses
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Browse our full catalog of available courses.</p>
        </div>
        <input
          type="text"
          placeholder="Search courses..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full sm:max-w-sm p-3 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none"
        />
      </div>

      <div className="flex flex-wrap gap-3">
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white p-2 rounded-xl border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">All Categories</option>
          {courseCategories.map((cat, i) => (
            <option key={i} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredCourses.length > 0 ? (
          filteredCourses.map((course) => (
            <div
              key={course._id}
              className="bg-white dark:bg-gray-900 p-5 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-xl hover:-translate-y-1 transition-all group flex flex-col"
            >
              <div className="relative mb-4 overflow-hidden rounded-xl h-40">
                <img
                  src={course.thumbnail || "https://placehold.co/400x200/e2e8f0/475569?text=Course"}
                  alt={`${course.title} thumbnail`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {e.target.onerror = null; e.target.src="https://placehold.co/400x200/e2e8f0/475569?text=Course"}}
                />
              </div>

              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white truncate">
                {course.title}
              </h3>

              <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mb-4">
                <User className="w-4 h-4" />
                {course.instructor.name}
              </p>

              <p className="text-sm text-gray-700 dark:text-gray-400 mb-4 line-clamp-2 h-10 flex-grow">
                {course.shortDesc}
              </p>

              <div className="mt-auto">
                <Link to={`/course/${course._id}`} className="block text-center w-full py-2 px-4 bg-indigo-600 text-white rounded-full hover:bg-indigo-500 transition-colors font-semibold text-sm">
                    View Details
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-10">
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              No courses match your current filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursesView;
