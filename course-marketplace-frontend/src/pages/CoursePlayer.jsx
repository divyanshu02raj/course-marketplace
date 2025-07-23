// src/pages/CoursePlayer.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from '../api/axios';
import toast from 'react-hot-toast';
import { PlayCircle, CheckCircle, ArrowLeft, ChevronRight, Sparkles, BookOpen, MessageSquare, Paperclip, Edit, Download, Users, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// A simple debounce hook for auto-saving notes
function useDebounce(value, delay) {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);
    return debouncedValue;
}

// Helper components for tabs
const TabButton = ({ id, activeTab, setActiveTab, icon: Icon, children }) => (
    <button
        onClick={() => setActiveTab(id)}
        className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
        activeTab === id
            ? "border-indigo-500 text-indigo-600 dark:text-indigo-400"
            : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
        }`}
    >
        <Icon size={16} />
        <span>{children}</span>
    </button>
);

const LessonContent = ({ lesson, onGetSummary, isSummaryLoading, summary }) => (
    <div>
        <h3 className="text-xl font-bold text-gray-800 dark:text-white">Lesson Content</h3>
        <div className="prose dark:prose-invert max-w-none mt-4 text-gray-700 dark:text-gray-300">
            <p>{lesson?.notes || "No additional content for this lesson."}</p>
        </div>
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button onClick={onGetSummary} disabled={isSummaryLoading} className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold hover:text-indigo-800 dark:hover:text-indigo-300 transition disabled:opacity-50">
                <Sparkles size={18} />
                {isSummaryLoading ? 'Generating...' : 'Get Key Takeaways'}
            </button>
            {summary && (
                <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-4 p-4 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-800 rounded-lg"
                >
                <div className="prose prose-sm dark:prose-invert max-w-none text-indigo-800 dark:text-indigo-200 whitespace-pre-wrap">
                    {summary}
                </div>
                </motion.div>
            )}
        </div>
    </div>
);

const QnaSection = () => (
    <div>
        <h3 className="text-xl font-bold text-gray-800 dark:text-white">Questions & Answers</h3>
        <div className="mt-4 text-center text-gray-500 dark:text-gray-400 py-10 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <p>Q&A feature coming soon!</p>
        </div>
    </div>
);

const ResourcesSection = ({ resources }) => (
    <div>
        <h3 className="text-xl font-bold text-gray-800 dark:text-white">Resources & Downloads</h3>
        {resources && resources.length > 0 ? (
            <div className="mt-4 space-y-3">
                {resources.map((resource, index) => (
                    <a
                        key={index}
                        href={resource.url}
                        download // ✅ This attribute forces the browser to download the file
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 transition"
                    >
                        <div className="flex items-center gap-3">
                            <Paperclip size={18} className="text-indigo-500" />
                            <span className="font-medium text-gray-800 dark:text-gray-200">{resource.name}</span>
                        </div>
                        <Download size={18} className="text-gray-400" />
                    </a>
                ))}
            </div>
        ) : (
            <div className="mt-4 text-center text-gray-500 dark:text-gray-400 py-10 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <p>No resources available for this lesson.</p>
            </div>
        )}
    </div>
);

const NotesSection = ({ note, setNote }) => (
    <div>
        <h3 className="text-xl font-bold text-gray-800 dark:text-white">My Personal Notes</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Your notes are automatically saved.</p>
        <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Start typing your notes for this lesson here..."
            className="w-full h-64 mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none transition"
        />
    </div>
);


export default function CoursePlayer() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [completedLessons, setCompletedLessons] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('content');

  const [summary, setSummary] = useState("");
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  const [myNote, setMyNote] = useState("");
  const debouncedNote = useDebounce(myNote, 1000);

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
      } finally {
        setLoading(false);
      }
    };
    fetchCourseData();
  }, [courseId]);
  
  useEffect(() => {
    setSummary("");
    setMyNote("");
  }, [currentLesson]);

  const handleSetCurrentLesson = (lesson) => {
    setCurrentLesson(lesson);
    window.scrollTo(0, 0);
  };

  const handleMarkAsComplete = () => {
    if (!currentLesson) return;
    const newCompleted = new Set(completedLessons);
    newCompleted.add(currentLesson._id);
    setCompletedLessons(newCompleted);

    const currentIndex = lessons.findIndex(l => l._id === currentLesson._id);
    const nextLesson = lessons[currentIndex + 1];

    if (nextLesson) {
      handleSetCurrentLesson(nextLesson);
    } else {
      toast.success("Congratulations! You've completed the course!");
    }
  };

  const handleGetSummary = async () => {
    if (!currentLesson?.notes) {
      return toast.error("No content available to summarize for this lesson.");
    }
    setIsSummaryLoading(true);
    setSummary("");
    const toastId = toast.loading("Generating key takeaways...");

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const mockSummary = `
        - This is the first key takeaway from the lesson content.
        - Here is another crucial point that students should remember.
        - Finally, this summarizes the main conclusion of the lesson.
      `;
      setSummary(mockSummary);
      toast.success("Summary generated!", { id: toastId });
    } catch (error) {
      toast.error("Could not generate summary.", { id: toastId });
    } finally {
      setIsSummaryLoading(false);
    }
  };

  const completionPercentage = lessons.length > 0 ? (completedLessons.size / lessons.length) * 100 : 0;
  const currentIndex = currentLesson ? lessons.findIndex(l => l._id === currentLesson._id) : -1;
  const nextLesson = lessons[currentIndex + 1];

  if (loading) {
    return <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-950 text-gray-500">Loading course player...</div>;
  }

  if (!course) {
    return <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-950 text-red-500">Course not found.</div>;
  }

  return (
    <div className="bg-gray-100 dark:bg-gray-950 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <Link to="/dashboard" className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 mb-4 font-semibold">
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm p-5">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white truncate">{course.title}</h1>
                    <div className="flex items-center gap-2 mt-2 text-sm text-gray-500 dark:text-gray-400">
                        <img src={`https://i.pravatar.cc/40?u=${course.instructor.name}`} alt={course.instructor.name} className="w-6 h-6 rounded-full" />
                        <span>by {course.instructor.name}</span>
                    </div>
                </div>
                <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-2"><BookOpen size={16}/><span>{lessons.length} Lessons</span></div>
                    <div className="flex items-center gap-2"><Clock size={16}/><span>{lessons.reduce((acc, l) => acc + (l.duration || 0), 0)} Mins</span></div>
                </div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                <span>Progress</span>
                <span>{Math.round(completionPercentage)}% Complete</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <motion.div 
                    className="bg-indigo-600 h-2 rounded-full" 
                    initial={{ width: 0 }}
                    animate={{ width: `${completionPercentage}%` }}
                    transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <main className="lg:col-span-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentLesson?._id || 'no-lesson'}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
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
                    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
                      <div className="border-b border-gray-200 dark:border-gray-700">
                          <nav className="flex gap-6 px-6">
                              <TabButton id="content" activeTab={activeTab} setActiveTab={setActiveTab} icon={BookOpen}>Content</TabButton>
                              <TabButton id="qna" activeTab={activeTab} setActiveTab={setActiveTab} icon={MessageSquare}>Q&A</TabButton>
                              <TabButton id="resources" activeTab={activeTab} setActiveTab={setActiveTab} icon={Paperclip}>Resources</TabButton>
                              <TabButton id="notes" activeTab={activeTab} setActiveTab={setActiveTab} icon={Edit}>My Notes</TabButton>
                          </nav>
                      </div>
                      <div className="p-6 min-h-[300px]">
                          <AnimatePresence mode="wait">
                              <motion.div
                                  key={activeTab}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -10 }}
                              >
                                  {activeTab === 'content' && <LessonContent lesson={currentLesson} onGetSummary={handleGetSummary} isSummaryLoading={isSummaryLoading} summary={summary} />}
                                  {activeTab === 'qna' && <QnaSection />}
                                  {activeTab === 'resources' && <ResourcesSection resources={currentLesson?.resources || []} />}
                                  {activeTab === 'notes' && <NotesSection note={myNote} setNote={setMyNote} />}
                              </motion.div>
                          </AnimatePresence>
                      </div>
                    </div>
                    {nextLesson && (
                        <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm flex justify-between items-center">
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Next up</p>
                                <h3 className="font-semibold text-gray-800 dark:text-gray-200">{nextLesson.title}</h3>
                            </div>
                            <button onClick={() => handleSetCurrentLesson(nextLesson)} className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold text-sm rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition">
                                Next Lesson <ChevronRight size={16} />
                            </button>
                        </div>
                    )}
                  </div>
                ) : (
                  <div className="flex-1 flex items-center justify-center bg-white dark:bg-gray-900 rounded-2xl h-full min-h-[60vh]">
                    <p className="text-gray-500">Select a lesson to begin your learning journey.</p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </main>
          <aside className="lg:col-span-1">
            <div className="sticky top-8 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-lg flex flex-col h-[calc(100vh-4rem)]">
              <div className="p-5 border-b border-gray-200 dark:border-gray-800">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white">Course Content</h3>
              </div>
              <nav className="flex-1 overflow-y-auto">
                <ul className="p-2 space-y-1">
                  {lessons.map((lesson, index) => (
                    <li key={lesson._id} className="relative">
                      {currentLesson?._id === lesson._id && (
                        <motion.div
                          layoutId="activeLesson"
                          className="absolute inset-0 bg-indigo-50 dark:bg-indigo-900/50 rounded-lg"
                          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        />
                      )}
                      <button
                        onClick={() => handleSetCurrentLesson(lesson)}
                        className="relative w-full text-left flex items-start gap-4 p-3 rounded-lg transition-colors"
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
