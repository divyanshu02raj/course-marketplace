// StudentDashboardComponents/CoursesView.jsx
import React from "react";

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

  return (
    <div>
      <h2 className="text-2xl font-semibold text-indigo-300 mb-6">My Courses</h2>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-700 text-white p-3 rounded-xl border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex gap-4">
          <select
            value={enrollmentFilter}
            onChange={(e) => setEnrollmentFilter(e.target.value)}
            className="bg-gray-700 text-white p-3 rounded-xl border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Courses</option>
            <option value="enrolled">Enrolled</option>
            <option value="not-enrolled">Not Enrolled</option>
          </select>

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredCourses.length > 0 ? (
          filteredCourses.map((course, idx) => (
            <div
              key={idx}
              className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-lg hover:shadow-xl transition-all"
            >
              <img
                src={course.thumbnail}
                alt={`${course.title} Thumbnail`}
                className="w-full h-32 object-cover rounded-xl mb-4"
              />
              <h3 className="text-lg font-semibold text-white mb-2">{course.title}</h3>
              <p className="text-sm text-gray-400 mb-4">{course.description}</p>
              <p className="text-xs text-gray-500 mb-4">👨‍🏫 {course.instructor}</p>

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

              {!course.enrolled && (
                <button className="mt-4 w-full py-2 px-4 bg-indigo-600 text-white rounded-full hover:bg-indigo-500 transition-colors">
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
  );
};

export default CoursesView;
