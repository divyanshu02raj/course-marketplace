import { useState } from "react";
import { Edit, Trash2, Eye } from "lucide-react";

const courses = [
  {
    id: 1,
    title: "React for Beginners",
    description: "An introduction to React and modern front-end development.",
    studentsEnrolled: 120,
    creationDate: "2025-05-01",
    status: "Active",
  },
  {
    id: 2,
    title: "Advanced Node.js",
    description: "Deep dive into Node.js for building scalable applications.",
    studentsEnrolled: 90,
    creationDate: "2025-04-12",
    status: "Inactive",
  },
  {
    id: 3,
    title: "UI/UX Masterclass",
    description: "Comprehensive course on UI/UX design principles and practices.",
    studentsEnrolled: 200,
    creationDate: "2025-03-15",
    status: "Active",
  },
];

export default function InstructorCoursesView() {
  const [activeFilter, setActiveFilter] = useState("all");

  const filteredCourses = courses.filter((course) => {
    if (activeFilter === "all") return true;
    return course.status.toLowerCase() === activeFilter;
  });

  return (
    <div className="w-full px-4 sm:px-6 lg:px-12 py-8 text-gray-900 dark:text-white">
      <h2 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">📚 Your Courses</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Here you can manage all your created courses.
      </p>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-8">
        {["all", "active", "inactive"].map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-2 rounded-lg text-sm transition font-medium ${
              activeFilter === filter
                ? filter === "active"
                  ? "bg-green-600 text-white"
                  : filter === "inactive"
                  ? "bg-red-600 text-white"
                  : "bg-indigo-600 text-white"
                : "text-gray-500 dark:text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400"
            }`}
          >
            {filter === "all"
              ? "All Courses"
              : filter.charAt(0).toUpperCase() + filter.slice(1) + " Courses"}
          </button>
        ))}
      </div>

      {/* Course List */}
      <div className="space-y-5">
        {filteredCourses.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 italic">No courses to display.</p>
        ) : (
          filteredCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow hover:shadow-md transition"
            >
              <div className="flex justify-between items-start gap-6">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-1">{course.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{course.description}</p>

                  <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-500 dark:text-gray-400">
                    <span>👥 {course.studentsEnrolled} enrolled</span>
                    <span>📅 Created on {course.creationDate}</span>
                    <span
                      className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                        course.status === "Active"
                          ? "bg-green-100 dark:bg-green-600 text-green-800 dark:text-white"
                          : "bg-red-100 dark:bg-red-600 text-red-800 dark:text-white"
                      }`}
                    >
                      {course.status}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 text-gray-500 dark:text-gray-300 mt-2 lg:mt-0">
                  <button title="View Course" className="hover:text-blue-600">
                    <Eye size={20} />
                  </button>
                  <button title="Edit Course" className="hover:text-yellow-500">
                    <Edit size={20} />
                  </button>
                  <button title="Delete Course" className="hover:text-red-500">
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
