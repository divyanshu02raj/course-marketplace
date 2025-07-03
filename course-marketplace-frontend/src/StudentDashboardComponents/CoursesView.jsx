// StudentDashboardComponents/CoursesView.jsx
import React from "react";
import { User, Bookmark } from "lucide-react";

const CoursesView = ({
  searchQuery,
  setSearchQuery,
  enrollmentFilter,
  setEnrollmentFilter,
  categoryFilter,
  setCategoryFilter,
  courseCategories,
  courses,
}) => {
  const filteredCourses = courses
    .filter((course) =>
      course.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((course) => {
      if (enrollmentFilter === "enrolled") return course.enrolled;
      if (enrollmentFilter === "not-enrolled") return !course.enrolled;
      return true;
    })
    .filter((course) => {
      if (categoryFilter) return course.category === categoryFilter;
      return true;
    });

  const enrollmentFilters = [
    { label: "All", value: "all" },
    { label: "Enrolled", value: "enrolled" },
    { label: "Not Enrolled", value: "not-enrolled" },
  ];

  return (
    <div className="text-gray-900 dark:text-white space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-3xl font-bold text-indigo-700 dark:text-indigo-400">
          📚 My Courses
        </h2>

        <input
          type="text"
          placeholder="Search courses..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full sm:max-w-sm p-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 outline-none"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        {enrollmentFilters.map((f) => (
          <button
            key={f.value}
            onClick={() => setEnrollmentFilter(f.value)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
              enrollmentFilter === f.value
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-indigo-500 hover:text-white"
            }`}
          >
            {f.label}
          </button>
        ))}

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white p-2 rounded-xl focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">All Categories</option>
          {courseCategories.map((cat, i) => (
            <option key={i} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredCourses.length > 0 ? (
          filteredCourses.map((course, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-gray-900 p-5 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all group"
            >
              {/* Thumbnail */}
              <div className="relative mb-4 overflow-hidden rounded-xl h-40">
                <img
                  src={course.thumbnail}
                  alt={`${course.title} thumbnail`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Title & Instructor */}
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                {course.title}
              </h3>

              <p className="text-sm text-gray-700 dark:text-gray-400 mb-2 line-clamp-2">
                {course.description}
              </p>

              <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mb-4">
                <User className="w-4 h-4" />
                {course.instructor}
              </p>

              {/* Progress Bar */}
              {course.enrolled && (
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-indigo-600 dark:text-indigo-400 mb-1">
                    <span>{course.progress}% Completed</span>
                  </div>
                  <div className="w-full h-2 bg-gray-300 dark:bg-gray-700 rounded-full">
                    <div
                      className={`h-2 rounded-full bg-indigo-500 transition-all`}
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* CTA */}
              {!course.enrolled ? (
                <button className="w-full py-2 px-4 bg-indigo-600 text-white rounded-full hover:bg-indigo-500 transition-colors mt-2">
                  Enroll
                </button>
              ) : (
                <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                  Enrolled
                </span>
              )}
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-10">
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              No courses match your current filters.
            </p>
            <p className="text-sm text-gray-400">
              Try changing your search or selecting a different category.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursesView;
