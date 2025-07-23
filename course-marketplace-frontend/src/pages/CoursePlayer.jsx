// src/pages/CoursePlayer.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from '../api/axios';
import toast from 'react-hot-toast';
import { PlayCircle, CheckCircle, ArrowLeft, ChevronRight } from 'lucide-react';

export default function CoursePlayer() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [completedLessons, setCompletedLessons] = useState(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const [courseRes, lessonsRes] = await Promise.all([
          axios.get(`/courses/${courseId}`),
          axios.get(`/lessons/${courseId}`),
        ]);
        setCourse(courseRes.data);
        setLessons(lessonsRes.data);
        if (lessonsRes.data.length > 0) {
          setCurrentLesson(lessonsRes.data[0]);
        }
      } catch (error) {
        toast.error('Failed to load course content.');
        console.error("Fetch course content error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourseData();
  }, [courseId]);

  const handleMarkAsComplete = () => {
    if (!currentLesson) return;
    
    const newCompleted = new Set(completedLessons);
    newCompleted.add(currentLesson._id);
    setCompletedLessons(newCompleted);

    const currentIndex = lessons.findIndex(l => l._id === currentLesson._id);
    const nextLesson = lessons[currentIndex + 1];

    if (nextLesson) {
      setCurrentLesson(nextLesson);
    } else {
      toast.success("Congratulations! You've completed the course!");
    }
  };

  const completionPercentage = lessons.length > 0 ? (completedLessons.size / lessons.length) * 100 : 0;

  if (loading) {
    return <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-950 text-gray-500">Loading course player...</div>;
  }

  if (!course) {
    return <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-950 text-red-500">Course not found.</div>;
  }

  return (
    <div className="bg-gray-100 dark:bg-gray-950 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8">
          <Link to="/dashboard" className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 mb-4 font-semibold">
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm p-5">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white truncate">{course.title}</h1>
            <div className="mt-3">
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                <span>Progress</span>
                <span>{Math.round(completionPercentage)}% Complete</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-indigo-600 h-2 rounded-full transition-all duration-500" style={{ width: `${completionPercentage}%` }}></div>
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content (Video + Notes) */}
          <main className="lg:col-span-2">
            {currentLesson ? (
              <div className="space-y-8">
                <div className="bg-black aspect-video rounded-2xl overflow-hidden shadow-2xl">
                  {currentLesson.videoUrl ? (
                    <video key={currentLesson._id} controls autoPlay className="w-full h-full">
                      <source src={currentLesson.videoUrl} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-800 text-gray-400">
                      <p>No video available for this lesson.</p>
                    </div>
                  )}
                </div>
                <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{currentLesson.title}</h2>
                    <button 
                      onClick={handleMarkAsComplete}
                      className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-semibold text-sm rounded-lg shadow-md hover:bg-indigo-700 transition disabled:opacity-50 disabled:bg-green-600"
                      disabled={completedLessons.has(currentLesson._id)}
                    >
                      {completedLessons.has(currentLesson._id) ? 'Completed' : 'Mark as Complete'}
                      {!completedLessons.has(currentLesson._id) && <ChevronRight size={16} />}
                    </button>
                  </div>
                  <div className="prose dark:prose-invert max-w-none mt-6 text-gray-700 dark:text-gray-300">
                    <p>{currentLesson.notes || "No additional content for this lesson."}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center bg-white dark:bg-gray-900 rounded-2xl h-full min-h-[60vh]">
                <p className="text-gray-500">Select a lesson to begin your learning journey.</p>
              </div>
            )}
          </main>

          {/* Lesson Playlist Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-8 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-lg flex flex-col h-[calc(100vh-4rem)]">
              <div className="p-5 border-b border-gray-200 dark:border-gray-800">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white">Course Content</h3>
              </div>
              <nav className="flex-1 overflow-y-auto">
                <ul className="p-2 space-y-1">
                  {lessons.map((lesson, index) => (
                    <li key={lesson._id}>
                      <button
                        onClick={() => setCurrentLesson(lesson)}
                        className={`w-full text-left flex items-start gap-4 p-3 rounded-lg transition-colors ${
                          currentLesson?._id === lesson._id
                            ? 'bg-indigo-50 dark:bg-indigo-900/50'
                            : 'hover:bg-gray-100 dark:hover:bg-gray-800/50'
                        }`}
                      >
                        <div className={`mt-1 flex-shrink-0 ${
                            completedLessons.has(lesson._id) ? 'text-green-500' : 
                            currentLesson?._id === lesson._id ? 'text-indigo-500' : 'text-gray-400 dark:text-gray-600'
                        }`}>
                          {completedLessons.has(lesson._id) ? <CheckCircle size={20} /> : <PlayCircle size={20} />}
                        </div>
                        <div>
                          <p className={`font-semibold ${currentLesson?._id === lesson._id ? 'text-indigo-700 dark:text-indigo-300' : 'text-gray-800 dark:text-gray-200'}`}>
                            {index + 1}. {lesson.title}
                          </p>
                          <span className="text-xs text-gray-500">{lesson.duration || 0} mins</span>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
