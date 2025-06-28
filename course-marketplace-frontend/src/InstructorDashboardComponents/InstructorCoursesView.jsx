// /InstructorDashboardComponents/InstructorCoursesView.jsx
import { useState } from "react";
import { Edit, Trash2, Eye } from "lucide-react";

// Sample course data
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

  // Filter courses based on their status
  const filteredCourses = courses.filter((course) => {
    if (activeFilter === "all") return true;
    return course.status.toLowerCase() === activeFilter;
  });

  return (
    <div className="text-gray-300">
      <h2 className="text-2xl font-semibold mb-4">Your Courses</h2>
      <p className="mb-6">Here you can manage all your created courses.</p>

      {/* Filter options */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => setActiveFilter("all")}
          className={`px-4 py-2 rounded-lg text-sm ${
            activeFilter === "all" ? "bg-indigo-600 text-white" : "text-gray-400"
          }`}
        >
          All Courses
        </button>
        <button
          onClick={() => setActiveFilter("active")}
          className={`px-4 py-2 rounded-lg text-sm ${
            activeFilter === "active" ? "bg-green-600 text-white" : "text-gray-400"
          }`}
        >
          Active Courses
        </button>
        <button
          onClick={() => setActiveFilter("inactive")}
          className={`px-4 py-2 rounded-lg text-sm ${
            activeFilter === "inactive" ? "bg-red-600 text-white" : "text-gray-400"
          }`}
        >
          Inactive Courses
        </button>
      </div>

      {/* Courses List */}
      <div className="space-y-4">
        {filteredCourses.length === 0 ? (
          <p className="text-gray-500">You don't have any courses to display.</p>
        ) : (
          filteredCourses.map((course) => (
            <div
              key={course.id}
              className="bg-gray-800 rounded-lg p-6 shadow-md flex justify-between items-center"
            >
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{course.title}</h3>
                <p className="text-gray-400 text-sm">{course.description}</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-xs text-gray-500">Enrolled: {course.studentsEnrolled}</span>
                  <span className="text-xs text-gray-500">Created on: {course.creationDate}</span>
                </div>
                <div className="mt-3">
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full ${
                      course.status === "Active"
                        ? "bg-green-500 text-white"
                        : "bg-red-500 text-white"
                    }`}
                  >
                    {course.status}
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                {/* View Course */}
                <button
                  className="text-blue-400 hover:text-blue-600"
                  title="View Course"
                >
                  <Eye size={20} />
                </button>

                {/* Edit Course */}
                <button
                  className="text-yellow-400 hover:text-yellow-600"
                  title="Edit Course"
                >
                  <Edit size={20} />
                </button>

                {/* Delete Course */}
                <button
                  className="text-red-400 hover:text-red-600"
                  title="Delete Course"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
