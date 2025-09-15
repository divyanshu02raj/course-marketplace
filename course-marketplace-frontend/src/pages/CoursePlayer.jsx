//course-marketplace-frontend\src\pages\CoursePlayer.jsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from '../api/axios';
import toast from 'react-hot-toast';
import { PlayCircle, CheckCircle, ArrowLeft, ChevronRight, Sparkles, BookOpen, MessageSquare, Paperclip, Edit, Download, Users, Clock, Send, Save, Play, Pause, RotateCcw, RotateCw, Fullscreen, Minimize, FileQuestion, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import QuizPlayerModal from '../StudentDashboardComponents/QuizPlayerModal';
import ReviewModal from '../StudentDashboardComponents/ReviewModal';

// --- ENHANCED VIDEO PLAYER COMPONENT ---
const VideoPlayer = ({ src, onComplete }) => {
    const playerContainerRef = useRef(null);
    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(true);
    const [playbackRate, setPlaybackRate] = useState(1);
    const [showControls, setShowControls] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);
    let controlTimeout;

    const handlePlayPause = () => {
        if (videoRef.current) {
            if (videoRef.current.paused) {
                videoRef.current.play();
            } else {
                videoRef.current.pause();
            }
        }
    };

    const handleSkip = (amount) => {
        if (videoRef.current) {
            videoRef.current.currentTime += amount;
        }
    };

    const handlePlaybackRateChange = (rate) => {
        if (videoRef.current) {
            videoRef.current.playbackRate = rate;
            setPlaybackRate(rate);
        }
    };

    const handleFullscreen = () => {
        if (!document.fullscreenElement) {
            playerContainerRef.current?.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    };

    useEffect(() => {
        const video = videoRef.current;
        const handleKeyDown = (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.closest('.ql-editor')) return;
            if (e.code === 'Space') { e.preventDefault(); handlePlayPause(); }
            if (e.code === 'ArrowRight') handleSkip(10);
            if (e.code === 'ArrowLeft') handleSkip(-10);
        };
        
        const handleFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        window.addEventListener('keydown', handleKeyDown);
        video?.addEventListener('play', () => setIsPlaying(true));
        video?.addEventListener('pause', () => setIsPlaying(false));
        video?.addEventListener('ended', onComplete);

        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
            window.removeEventListener('keydown', handleKeyDown);
            video?.removeEventListener('play', () => setIsPlaying(true));
            video?.removeEventListener('pause', () => setIsPlaying(false));
            video?.removeEventListener('ended', onComplete);
        };
    }, [onComplete]);

    const handleMouseMove = () => {
        setShowControls(true);
        clearTimeout(controlTimeout);
        controlTimeout = setTimeout(() => setShowControls(false), 3000);
    };

    return (
        <div 
            ref={playerContainerRef}
            className="relative bg-black aspect-video rounded-2xl overflow-hidden shadow-2xl"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => clearTimeout(controlTimeout)}
        >
            {src ? (
                <video ref={videoRef} key={src} autoPlay className="w-full h-full" onClick={handlePlayPause}>
                    <source src={src} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-800 text-gray-400">
                    <p>No video available for this lesson.</p>
                </div>
            )}
            <AnimatePresence>
                {showControls && src && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent"
                    >
                        <div className="flex items-center justify-center gap-6 text-white">
                            <button onClick={() => handleSkip(-10)} className="hover:scale-110 transition"><RotateCcw size={24} /></button>
                            <button onClick={handlePlayPause} className="p-2 bg-white/20 rounded-full hover:scale-110 transition">
                                {isPlaying ? <Pause size={28} /> : <Play size={28} />}
                            </button>
                            <button onClick={() => handleSkip(10)} className="hover:scale-110 transition"><RotateCw size={24} /></button>
                            <div className="absolute right-4 bottom-4 flex items-center gap-4">
                                <select 
                                    value={playbackRate} 
                                    onChange={(e) => handlePlaybackRateChange(parseFloat(e.target.value))}
                                    className="bg-black/50 text-white text-xs font-bold rounded px-2 py-1 focus:outline-none appearance-none"
                                >
                                    <option value="1">1x</option>
                                    <option value="1.25">1.25x</option>
                                    <option value="1.5">1.5x</option>
                                    <option value="2">2x</option>
                                </select>
                                <button onClick={handleFullscreen} className="hover:scale-110 transition">
                                    {isFullscreen ? <Minimize size={20} /> : <Fullscreen size={20} />}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

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
        <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">Lesson Content</h3>
            <button 
                onClick={onGetSummary} 
                disabled={isSummaryLoading} 
                className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold text-sm hover:text-indigo-800 dark:hover:text-indigo-300 transition disabled:opacity-50"
            >
                <Sparkles size={18} />
                {isSummaryLoading ? 'Generating...' : 'Get Key Takeaways'}
            </button>
        </div>
        <div className="prose dark:prose-invert max-w-none mt-4 text-gray-700 dark:text-gray-300">
            <p>{lesson?.content || lesson?.notes || "No additional content for this lesson."}</p>
        </div>
        {summary && (
            <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700"
            >
            <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Key Takeaways:</h4>
            <div className="p-4 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-800 rounded-lg">
                <div className="prose prose-sm dark:prose-invert max-w-none text-indigo-800 dark:text-indigo-200 whitespace-pre-wrap">
                    {summary}
                </div>
            </div>
            </motion.div>
        )}
    </div>
);

const QnaSection = ({ user, currentLesson, courseId }) => {
    const [questions, setQuestions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [newQuestion, setNewQuestion] = useState("");
    const [answerText, setAnswerText] = useState({});

    const fetchQuestions = useCallback(async () => {
        if (!currentLesson) return;
        setIsLoading(true);
        try {
            const res = await axios.get(`/questions/${currentLesson._id}`);
            setQuestions(res.data);
        } catch (error) {
            toast.error("Failed to load Q&A.");
        } finally {
            setIsLoading(false);
        }
    }, [currentLesson]);

    useEffect(() => {
        fetchQuestions();
    }, [fetchQuestions]);

    const handleAskQuestion = async (e) => {
        e.preventDefault();
        if (!newQuestion.trim()) return;
        
        const toastId = toast.loading("Posting your question...");
        try {
            await axios.post(`/questions/${currentLesson._id}`, {
                title: newQuestion.slice(0, 50),
                text: newQuestion,
                courseId: courseId,
            });
            setNewQuestion("");
            toast.success("Question posted!", { id: toastId });
            await fetchQuestions(); 
        } catch (error) {
            toast.error("Failed to post question.", { id: toastId });
        }
    };

    const handleAnswer = async (questionId) => {
        const text = answerText[questionId];
        if (!text || !text.trim()) return;

        const toastId = toast.loading("Posting your answer...");
        try {
            const res = await axios.post(`/questions/answer/${questionId}`, { text });
            setQuestions(prev => prev.map(q => q._id === questionId ? res.data : q));
            setAnswerText(prev => ({...prev, [questionId]: ""}));
            toast.success("Answer posted!", { id: toastId });
        } catch (error) {
            toast.error("Failed to post answer.", { id: toastId });
        }
    };

    return (
        <div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">Questions & Answers</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {user?.role === 'student' ? "Your questions are private between you and the instructor." : "Answer questions from your students."}
            </p>
            
            {user?.role === 'student' && (
                <form onSubmit={handleAskQuestion} className="mt-4 flex gap-2">
                    <input
                        type="text"
                        value={newQuestion}
                        onChange={(e) => setNewQuestion(e.target.value)}
                        placeholder="Type your question here..."
                        className="flex-grow p-3 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
                    />
                    <button type="submit" className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition">
                        <Send size={20} />
                    </button>
                </form>
            )}

            <div className="mt-8 space-y-6">
                {isLoading ? <p>Loading questions...</p> : questions.map(q => (
                    <div key={q._id}>
                        <div className="flex items-start gap-3">
                            <img src={q.user.profileImage || `https://i.pravatar.cc/40?u=${q.user.name}`} alt={q.user.name} className="w-8 h-8 rounded-full mt-1"/>
                            <div>
                                <p className="font-semibold text-gray-800 dark:text-gray-200">{q.user.name}</p>
                                <p className="text-gray-700 dark:text-gray-300">{q.text}</p>
                                <p className="text-xs text-gray-500">Asked on {new Date(q.createdAt).toLocaleDateString()}</p>
                            </div>
                        </div>
                        {q.answers.map(a => (
                            <div key={a._id} className="ml-8 mt-3 flex items-start gap-3 border-l-2 border-indigo-200 dark:border-indigo-800 pl-4">
                                <img src={a.user.profileImage || `https://i.pravatar.cc/40?u=${a.user.name}`} alt={a.user.name} className="w-8 h-8 rounded-full mt-1"/>
                                <div>
                                    <p className="font-semibold text-indigo-700 dark:text-indigo-400">{a.user.name} (Instructor)</p>
                                    <p className="text-gray-700 dark:text-gray-300">{a.text}</p>
                                    <p className="text-xs text-gray-500">Answered on {new Date(a.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                        ))}
                        {user?.role === 'instructor' && q.answers.length === 0 && (
                            <div className="ml-8 mt-3 flex gap-2 border-l-2 border-gray-200 dark:border-gray-700 pl-4">
                                <input
                                    type="text"
                                    value={answerText[q._id] || ""}
                                    onChange={(e) => setAnswerText(prev => ({...prev, [q._id]: e.target.value}))}
                                    placeholder="Type your answer..."
                                    className="flex-grow p-2 text-sm bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg"
                                />
                                <button onClick={() => handleAnswer(q._id)} className="px-3 py-1 bg-indigo-600 text-white text-sm font-semibold rounded-lg">Reply</button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

const ResourcesSection = ({ resources }) => (
    <div>
        <h3 className="text-xl font-bold text-gray-800 dark:text-white">Resources & Downloads</h3>
        {resources && resources.length > 0 ? (
            <div className="mt-4 space-y-3">
                {resources.map((resource, index) => (
                    <a
                        key={index}
                        href={resource.url}
                        download
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

const NotesSection = ({ note, setNote, onSave, isSaving }) => (
    <div>
        <div className="flex justify-between items-center">
            <div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">My Personal Notes</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Jot down your thoughts and key points here.</p>
            </div>
            <button 
                onClick={onSave}
                disabled={isSaving}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-semibold text-sm rounded-lg shadow-md hover:bg-indigo-700 transition disabled:opacity-50"
            >
                <Save size={16} />
                {isSaving ? "Saving..." : "Save Note"}
            </button>
        </div>
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
    const { user } = useAuth();
    const [course, setCourse] = useState(null);
    const [lessons, setLessons] = useState([]);
    const [currentLesson, setCurrentLesson] = useState(null);
    const [completedLessons, setCompletedLessons] = useState(new Set());
    const [loading, setLoading] = useState(true);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('content');
    const [summary, setSummary] = useState("");
    const [isSummaryLoading, setIsSummaryLoading] = useState(false);
    const [myNote, setMyNote] = useState("");
    const [isNoteSaving, setIsNoteSaving] = useState(false);
    const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
    const [quizResults, setQuizResults] = useState(null);

    useEffect(() => {
        const fetchCourseData = async () => {
            try {
                const [courseRes, lessonsRes, progressRes] = await Promise.all([
                    axios.get(`/courses/${courseId}`),
                    axios.get(`/lessons/${courseId}`),
                    axios.get(`/enrollments/${courseId}/progress`)
                ]);
                
                setCourse(courseRes.data);
                setLessons(lessonsRes.data);
                setCompletedLessons(new Set(progressRes.data.completedLessons));

                if (lessonsRes.data.length > 0) {
                    setCurrentLesson(lessonsRes.data[0]);
                }
            } catch (error) {
                toast.error('Failed to load course content.');
            } finally {
                setLoading(false);
            }
        };
        if (user) {
            fetchCourseData();
        }
    }, [courseId, user]);
    
    useEffect(() => {
        setSummary("");
        const fetchNote = async () => {
            if (currentLesson && user) {
                try {
                    const res = await axios.get(`/notes/${currentLesson._id}?courseId=${courseId}`);
                    setMyNote(res.data.content || "");
                } catch (error) {
                    console.error("Failed to fetch note", error);
                    setMyNote("");
                }
            }
        };
        fetchNote();
    }, [currentLesson, user, courseId]);

    const handleSaveNote = async () => {
        if (!currentLesson || !user) return;
        setIsNoteSaving(true);
        const toastId = toast.loading("Saving your note...");
        try {
            await axios.post(`/notes/${currentLesson._id}`, { 
                content: myNote,
                courseId: courseId 
            });
            toast.success("Note saved successfully!", { id: toastId });
        } catch (error) {
            console.error("Failed to save note", error);
            toast.error("Could not save your note.", { id: toastId });
        } finally {
            setIsNoteSaving(false);
        }
    };

    const handleSetCurrentLesson = (lesson) => {
        setCurrentLesson(lesson);
        setQuizResults(null);
        window.scrollTo(0, 0);
    };

    const handleMarkAsComplete = async () => {
        if (!currentLesson || completedLessons.has(currentLesson._id)) return;

        const originalCompleted = new Set(completedLessons);
        const newCompleted = new Set(completedLessons);
        newCompleted.add(currentLesson._id);
        setCompletedLessons(newCompleted);

        try {
            await axios.post(`/enrollments/${courseId}/lessons/${currentLesson._id}/complete`);

            const currentIndex = lessons.findIndex(l => l._id === currentLesson._id);
            const nextLesson = lessons[currentIndex + 1];
            
            if (nextLesson) {
                setCurrentLesson(nextLesson);
            } else {
                toast.success("Congratulations! You've completed all the lessons!");
                setIsReviewModalOpen(true); // Open review modal on course completion
            }
        } catch (error) {
            toast.error("Couldn't save progress. Please try again.");
            setCompletedLessons(originalCompleted);
        }
    };

    const handleVideoEnd = () => {
        if (currentLesson && !currentLesson.hasQuiz) {
          handleMarkAsComplete();
        }
    };

    const handleGetSummary = async () => {
        const lessonContent = currentLesson?.content;
        if (!lessonContent || lessonContent.trim().length < 50) {
          return toast.error("This lesson doesn't have enough content to summarize.");
        }
        
        setIsSummaryLoading(true);
        setSummary("");
        const toastId = toast.loading("Generating AI summary...");
    
        try {
            const res = await axios.post('/ai/summarize', { content: lessonContent });
            setSummary(res.data.summary);
            toast.success("Summary generated!", { id: toastId });
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Could not generate summary.";
            toast.error(errorMessage, { id: toastId });
            console.error("AI Summary Error:", error);
        } finally {
            setIsSummaryLoading(false);
        }
    };

    const handleQuizComplete = (results) => {
        setQuizResults(results);
        setIsQuizModalOpen(false);
        handleMarkAsComplete();
    };

    const completionPercentage = lessons.length > 0 ? (completedLessons.size / lessons.length) * 100 : 0;
    const isCourseComplete = completionPercentage === 100;
    const nextLesson = currentLesson ? lessons[lessons.findIndex(l => l._id === currentLesson._id) + 1] : null;

    if (loading) {
        return <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-950 text-gray-500">Loading course player...</div>;
    }

    if (!course) {
        return <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-950 text-red-500">Course not found.</div>;
    }

    const isLessonComplete = currentLesson && completedLessons.has(currentLesson._id);
    const canMarkComplete = currentLesson && !currentLesson.hasQuiz;

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
                                    <img src={course.instructor?.profileImage || `https://i.pravatar.cc/40?u=${course.instructor.name}`} alt={course.instructor.name} className="w-6 h-6 rounded-full" />
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
                                        <VideoPlayer 
                                            src={currentLesson.videoUrl} 
                                            onComplete={handleVideoEnd}
                                        />
                                        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
                                            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                                                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{currentLesson.title}</h2>
                                                    <button 
                                                        onClick={handleMarkAsComplete}
                                                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-semibold text-sm rounded-lg shadow-md hover:bg-indigo-700 transition disabled:opacity-50 disabled:bg-green-600 disabled:cursor-not-allowed"
                                                        disabled={isLessonComplete || !canMarkComplete}
                                                        title={!canMarkComplete && !isLessonComplete ? "Complete the quiz to mark this lesson as done" : ""}
                                                    >
                                                        {isLessonComplete ? 'Completed' : (canMarkComplete ? 'Mark as Complete' : 'Complete Quiz First')}
                                                        {!isLessonComplete && canMarkComplete && <ChevronRight size={16} />}
                                                    </button>
                                                </div>
                                            </div>
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
                                                        {activeTab === 'qna' && <QnaSection user={user} currentLesson={currentLesson} courseId={courseId} />}
                                                        {activeTab === 'resources' && <ResourcesSection resources={currentLesson?.resources || []} />}
                                                        {activeTab === 'notes' && <NotesSection note={myNote} setNote={setMyNote} onSave={handleSaveNote} isSaving={isNoteSaving} />}
                                                    </motion.div>
                                                </AnimatePresence>
                                            </div>
                                        </div>
                                        
                                        {currentLesson && currentLesson.hasQuiz && (
                                            <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm flex justify-between items-center">
                                                <div>
                                                    <h3 className="font-semibold text-gray-800 dark:text-gray-200">Test Your Knowledge</h3>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">Take the quiz for: {currentLesson.title}</p>
                                                </div>
                                                {quizResults ? (
                                                    <div className="text-center">
                                                        <p className="text-sm text-gray-500">Your Score:</p>
                                                        <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                                                            {quizResults.score} / {quizResults.totalQuestions}
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <button onClick={() => setIsQuizModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-semibold text-sm rounded-lg hover:bg-indigo-700 transition">
                                                        <FileQuestion size={16} /> Take Quiz
                                                    </button>
                                                )}
                                            </div>
                                        )}

                                        {isCourseComplete && !nextLesson ? (
                                            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border-2 border-dashed border-indigo-400 dark:border-indigo-600 shadow-lg text-center">
                                               <h3 className="text-xl font-bold text-gray-800 dark:text-white">You've finished the lessons!</h3>
                                               {course.certificateId ? (
                                                    <>
                                                        <p className="text-gray-600 dark:text-gray-300 mt-2">You've already earned your certificate for this course.</p>
                                                        <Link to={`/certificate/${course.certificateId}`} className="mt-4 inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition">
                                                            <Award size={18} /> View Your Certificate
                                                        </Link>
                                                    </>
                                               ) : course.assessmentId ? (
                                                    <>
                                                        <p className="text-gray-600 dark:text-gray-300 mt-2">Now, head to the assessments page to earn your certificate.</p>
                                                        <Link to="/dashboard/assessments" className="mt-4 inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition">
                                                            <FileQuestion size={18} /> Go to Assessments
                                                        </Link>
                                                    </>
                                               ) : (
                                                    <p className="text-gray-600 dark:text-gray-300 mt-2">Congratulations on completing the course!</p>
                                               )}
                                            </div>
                                        ) : nextLesson ? (
                                            <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm flex justify-between items-center">
                                                <div>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">Next up</p>
                                                    <h3 className="font-semibold text-gray-800 dark:text-gray-200">{nextLesson.title}</h3>
                                                </div>
                                                <button onClick={() => handleSetCurrentLesson(nextLesson)} className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold text-sm rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition">
                                                    Next Lesson <ChevronRight size={16} />
                                                </button>
                                            </div>
                                        ) : null}
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
            <QuizPlayerModal 
                isOpen={isQuizModalOpen}
                onClose={() => setIsQuizModalOpen(false)}
                lesson={currentLesson}
                onQuizComplete={handleQuizComplete}
            />
            <ReviewModal
                isOpen={isReviewModalOpen}
                onClose={() => setIsReviewModalOpen(false)}
                course={course}
                onReviewSubmitted={() => {
                    console.log("Review submitted!");
                }}
            />
        </div>
    );
}