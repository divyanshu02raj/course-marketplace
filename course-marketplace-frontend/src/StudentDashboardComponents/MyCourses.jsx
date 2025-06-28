// StudentDashboardComponents/MyCourses.jsx
import React from "react";

const MyCourses = ({ courses }) => {
  // Filter courses where enrolled === true
  const myCourses = courses.filter((course) => course.enrolled);

  if (myCourses.length === 0) {
    return <p className="text-gray-500 italic">You have no enrolled courses.</p>;
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">My Courses</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {myCourses.map((course) => (
          <div key={course.id} className="bg-gray-800 p-6 rounded-xl shadow">
            <img
              src={course.thumbnail}
              alt={course.title}
              className="w-full h-32 object-cover rounded-md mb-4"
            />
            <h3 className="text-lg font-semibold text-white">{course.title}</h3>
            <p className="text-sm text-gray-400">Instructor: {course.instructor}</p>
            <p className="mt-2 text-indigo-400">{course.progress}% completed</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyCourses;
