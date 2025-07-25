// src/StudentDashboardComponents/CourseDetailsPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import toast from 'react-hot-toast';
import { ArrowLeft, Clock, BarChart, Video, CheckCircle, Lock, Bookmark, Target } from 'lucide-react'; // ✅ Corrected: Added Target icon
import { useAuth } from '../context/AuthContext';

// Accordion Item Component
const AccordionItem = ({ lesson, index }) => {
  return (
    <div className="border-b border-gray-200 dark:border-gray-700 last:border-b-0">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-4">
          <div className="text-gray-400">
            {lesson.isPreview ? <CheckCircle size={20} className="text-indigo-500"/> : <Lock size={20} />}
          </div>
          <p className="font-medium text-gray-800 dark:text-gray-200">{index + 1}. {lesson.title}</p>
        </div>
        <div className="flex items-center gap-4">
          {lesson.isPreview && <button className="text-sm font-semibold text-indigo-600 hover:underline">Preview</button>}
          <span className="text-sm text-gray-500">{lesson.duration || 0} mins</span>
        </div>
      </div>
    </div>
  );
};

export default function CourseDetailsPage() {
  const { courseId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);

  useEffect(() => {
    const fetchCourseData = async () => {
      setLoading(true);
      try {
        const [courseRes, lessonsRes, enrolledRes] = await Promise.all([
          axios.get(`/courses/${courseId}`),
          axios.get(`/lessons/${courseId}`),
          user ? axios.get('/courses/enrolled') : Promise.resolve({ data: [] })
        ]);

        setCourse(courseRes.data);
        setLessons(lessonsRes.data);

        const enrolledIds = enrolledRes.data.map(c => c._id);
        if (enrolledIds.includes(courseId)) {
          setIsEnrolled(true);
        }

      } catch (error) {
        toast.error('Failed to load course content.');
        console.error("Fetch course content error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourseData();
  }, [courseId, user]);

  const handleEnroll = async () => {
    if (!user) {
        toast.error("Please log in to enroll in a course.");
        return navigate('/login');
    }
    const toastId = toast.loading("Enrolling...");
    try {
        await axios.post(`/courses/${courseId}/enroll`);
        toast.success("Successfully enrolled!", { id: toastId });
        setIsEnrolled(true);
    } catch (error) {
        toast.error(error.response?.data?.message || "Enrollment failed.", { id: toastId });
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900 text-gray-500">Loading course...</div>;
  }

  if (!course) {
    return <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900 text-red-500">Course not found or failed to load.</div>;
  }

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <Link to="/dashboard" className="flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400 hover:underline mb-6 font-semibold">
          <ArrowLeft size={16} />
          Back to Courses
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 dark:text-white mb-3">{course.title}</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">{course.shortDesc}</p>
            
            <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 mb-8">
              <h2 className="text-2xl font-bold mb-4">What you'll learn</h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                {course.whatYouWillLearn?.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle size={18} className="text-green-500 mt-1 flex-shrink-0"/> <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">Course Curriculum</h2>
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg">
                {lessons.map((lesson, index) => <AccordionItem key={lesson._id} lesson={lesson} index={index} />)}
              </div>
            </div>

            <div className="mt-12 space-y-8">
                <div>
                    <h3 className="text-2xl font-bold mb-4">Requirements</h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                        {course.requirements?.map((req, i) => <li key={i}>{req}</li>)}
                    </ul>
                </div>
                <div>
                    <h3 className="text-2xl font-bold mb-4">Description</h3>
                    <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
                        <p>{course.description}</p>
                    </div>
                </div>
            </div>
          </div>

          {/* Sticky Sidebar Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl">
                <img src={course.thumbnail} alt={course.title} className="w-full rounded-t-2xl aspect-video object-cover" />
                <div className="p-6">
                  <p className="text-4xl font-bold text-gray-800 dark:text-white mb-4">${course.price}</p>
                  
                  {isEnrolled ? (
                    <Link to={`/learn/${course._id}`} className="w-full block text-center py-3 px-4 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition">
                      Go to Course
                    </Link>
                  ) : (
                    <button onClick={handleEnroll} className="w-full py-3 px-4 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition">
                      Enroll Now
                    </button>
                  )}
                  <button className="w-full mt-3 py-3 px-4 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-lg font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition flex items-center justify-center gap-2">
                    <Bookmark size={16} /> Add to Wishlist
                  </button>

                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-3 mt-6">
                    <li className="flex items-center gap-3"><Video size={16} /> <span>{lessons.length} Lessons</span></li>
                    <li className="flex items-center gap-3"><Clock size={16} /> <span>{lessons.reduce((acc, l) => acc + (l.duration || 0), 0)} Mins of Video</span></li>
                    <li className="flex items-center gap-3"><Target size={16} /> <span>For {course.targetAudience || 'All Levels'}</span></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
