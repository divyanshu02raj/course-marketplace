// course-marketplace-frontend\src\InstructorDashboardComponents\InstructorCoursesView.jsx
import { useEffect, useState } from "react";
import { Edit, Trash2, Eye, RefreshCw, Users } from "lucide-react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast"; // Import toast

export default function InstructorCoursesView() {
  const [courses, setCourses] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [togglingCourseId, setTogglingCourseId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get("/courses/my");
        setCourses(response.data);
      } catch (err) {
        console.error("Error:", err);
        setError("Failed to load courses. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const handleViewStudents = (id) => navigate(`/instructor/course/manage/${id}`);
  const handleEdit = (id) => navigate(`/instructor/course/edit/${id}`);

  // This function will be called if the user confirms deletion
  const proceedWithDeletion = async (id, toastId) => {
    try {
      await axios.delete(`/courses/${id}`);
      toast.success("Course deleted successfully!", { id: toastId });
      setCourses((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error("Could not delete course.", { id: toastId });
    }
  };

  // ❌ Delete course confirmation using toast
  const handleDelete = (id) => {
    const toastId = toast(
      (t) => (
        <div className="flex flex-col gap-3">
          <p className="font-semibold">Are you sure you want to delete this course?</p>
          <div className="flex gap-2">
            <button
              onClick={() => {
                toast.dismiss(t.id);
                // Show loading toast while deleting
                const deleteToastId = toast.loading("Deleting course...");
                proceedWithDeletion(id, deleteToastId);
              }}
              className="w-full bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-3 py-1 rounded"
            >
              Delete
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="w-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-sm font-medium px-3 py-1 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      {
        duration: 6000, // Keep the toast open longer for confirmation
      }
    );
  };

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "published" ? "draft" : "published";
    setTogglingCourseId(id);
    try {
      const response = await axios.patch(`/courses/${id}/status`, { status: newStatus });
      const updated = response.data;
      setCourses((prev) =>
        prev.map((course) =>
          course._id === id ? { ...course, status: updated.status } : course
        )
      );
      toast.success(`Course status changed to ${newStatus}.`);
    } catch (err) {
      console.error("Status update failed:", err);
      toast.error("Could not update course status.");
    } finally {
      setTogglingCourseId(null);
    }
  };

  const filteredCourses = courses.filter((course) => {
    if (activeFilter === "all") return true;
    return course.status.toLowerCase() === activeFilter;
  });

  return (
    <div className="w-full px-4 sm:px-6 lg:px-12 py-8 text-gray-900 dark:text-white">
       <h2 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">
         📚 Your Courses
       </h2>
       <p className="text-gray-600 dark:text-gray-400 mb-6">
         Here you can manage all your created courses.
       </p>
 
       {error && (
         <div className="text-red-600 dark:text-red-400 text-sm mb-6">{error}</div>
       )}
 
       <div className="flex items-center gap-4 mb-8">
         {["all", "published", "draft"].map((filter) => (
           <button
             key={filter}
             onClick={() => setActiveFilter(filter)}
             className={`px-4 py-2 rounded-lg text-sm transition font-medium ${
               activeFilter === filter
                 ? filter === "published"
                   ? "bg-green-600 text-white"
                   : filter === "draft"
                   ? "bg-yellow-600 text-white"
                   : "bg-indigo-600 text-white"
                 : "text-gray-500 dark:text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400"
             }`}
           >
             {filter === "all"
               ? "All Courses"
               : `${filter.charAt(0).toUpperCase() + filter.slice(1)} Courses`}
           </button>
         ))}
       </div>
 
       {loading ? (
         <p className="text-gray-500 dark:text-gray-400 italic">Loading...</p>
       ) : filteredCourses.length === 0 ? (
         <p className="text-gray-500 dark:text-gray-400 italic">
           No courses to display.
         </p>
       ) : (
         <div className="space-y-5">
           {filteredCourses.map((course) => (
             <div
               key={course._id}
               className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow hover:shadow-md transition"
             >
               <div className="flex justify-between items-start gap-6">
                 {course.thumbnail ? (
                   <img
                     src={course.thumbnail}
                     alt={course.title}
                     className="w-32 h-20 object-cover rounded-md border"
                   />
                 ) : (
                   <div className="w-32 h-20 flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-xs text-gray-400 rounded-md border">
                     No Thumbnail
                   </div>
                 )}
 
                 <div className="flex-1">
                   <h3 className="text-xl font-semibold mb-1">{course.title}</h3>
                   <p className="text-sm text-gray-600 dark:text-gray-400">
                     {course.shortDesc}
                   </p>
                   <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-500 dark:text-gray-400">
                     <span>
                       📅 Created on{" "}
                       {new Date(course.createdAt).toLocaleDateString("en-US", {
                         year: "numeric",
                         month: "short",
                         day: "numeric",
                       })}
                     </span>
 
                     <button
                       onClick={() => toggleStatus(course._id, course.status.toLowerCase())}
                       className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full transition ${
                         course.status.toLowerCase() === "published"
                           ? "bg-green-100 dark:bg-green-600 text-green-800 dark:text-white"
                           : "bg-yellow-100 dark:bg-yellow-600 text-yellow-800 dark:text-white"
                       } ${togglingCourseId === course._id ? "opacity-50 pointer-events-none" : ""}`}
                       title="Click to toggle status"
                       disabled={togglingCourseId === course._id}
                     >
                       <RefreshCw size={12} className="shrink-0" />
                       {togglingCourseId === course._id ? "Updating..." : course.status.toLowerCase()}
                     </button>
                   </div>
                 </div>
 
                 <div className="flex gap-3 text-gray-500 dark:text-gray-300 mt-2 lg:mt-0">
                   <button
                     onClick={() => handleViewStudents(course._id)}
                     aria-label="View Students"
                     title="View Students"
                     className="hover:text-blue-600"
                   >
                     <Users size={20} />
                   </button>
                   <button
                     onClick={() => handleEdit(course._id)}
                     aria-label="Edit Course"
                     title="Edit Course"
                     className="hover:text-yellow-500"
                   >
                     <Edit size={20} />
                   </button>
                   <button
                     onClick={() => handleDelete(course._id)}
                     aria-label="Delete Course"
                     title="Delete Course"
                     className="hover:text-red-500"
                   >
                     <Trash2 size={20} />
                   </button>
                 </div>
               </div>
             </div>
           ))}
         </div>
       )}
    </div>
  );
}
