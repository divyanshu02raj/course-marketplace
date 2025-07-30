// src/InstructorDashboardComponents/ManageCourseView.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import toast from 'react-hot-toast';
import { ArrowLeft, Search, User, Users,MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ManageCourseView() {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [enrollments, setEnrollments] = useState([]);
    const [courseTitle, setCourseTitle] = useState('');
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [courseRes, enrollmentsRes] = await Promise.all([
                    axios.get(`/courses/${courseId}`),
                    axios.get(`/enrollments/${courseId}/students`)
                ]);
                setCourseTitle(courseRes.data.title);
                setEnrollments(enrollmentsRes.data);
            } catch (error) {
                toast.error("Failed to load course data.");
                console.error("Fetch data error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [courseId]);

        const handleStartConversation = async (studentId) => {
        const toastId = toast.loading("Starting conversation...");
        try {
            const res = await axios.post('/messages/conversation', {
                recipientId: studentId
            });
            toast.dismiss(toastId);
            navigate('/dashboard', { state: { openChatId: res.data._id } });
        } catch (error) {
            toast.error("Could not start conversation.", { id: toastId });
        }
    };

    const filteredEnrollments = enrollments.filter(enrollment =>
        enrollment.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        enrollment.user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Loading student data...</div>;
    }

    return (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-lg p-6 sm:p-8">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-1 flex items-center gap-3">
                        <Users className="text-indigo-500" />
                        Manage Students
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        Viewing enrollments for: <span className="font-semibold text-indigo-600 dark:text-indigo-400">{courseTitle}</span>
                    </p>
                </div>
                <button
                    onClick={() => navigate("/dashboard")}
                    className="flex-shrink-0 flex items-center gap-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 px-4 py-2 rounded-lg font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors shadow-sm"
                >
                    <ArrowLeft size={16} />
                    Back to My Courses
                </button>
            </header>

            {/* Search Bar */}
            <div className="mb-6">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                        <Search size={18} />
                    </div>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by student name or email..."
                        className="w-full max-w-md p-3 pl-12 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
                    />
                </div>
            </div>

            {/* Student List */}
            <div className="space-y-4">
                <AnimatePresence>
                    {filteredEnrollments.length > 0 ? filteredEnrollments.map(({ user, progress, createdAt }) => (
                        <motion.div
                            key={user._id}
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border dark:border-gray-700 flex flex-col sm:flex-row items-start sm:items-center gap-4"
                        >
                            <div className="flex items-center gap-4 flex-grow">
                                <img src={user.profileImage || `https://i.pravatar.cc/48?u=${user.email}`} alt={user.name} className="w-12 h-12 rounded-full"/>
                                <div>
                                    <div className="font-bold text-gray-800 dark:text-white">{user.name}</div>
                                    <div className="text-xs text-gray-500">{user.email}</div>
                                </div>
                            </div>
                            <div className="w-full sm:w-auto text-sm text-gray-600 dark:text-gray-400">
                                Enrolled: {new Date(createdAt).toLocaleDateString()}
                            </div>
                            <div className="w-full sm:w-56">
                                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                                    <span>Progress</span>
                                    <span className="font-medium">{Math.round(progress || 0)}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                                    <div className="bg-indigo-600 h-2 rounded-full" style={{width: `${progress || 0}%`}}></div>
                                </div>
                            </div>
                            <div className="w-full sm:w-auto flex-shrink-0">
                                <button onClick={() => handleStartConversation(user._id)} className="flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:underline">
                                    <MessageCircle size={16} /> Message
                                </button>
                            </div>
                        </motion.div>
                    )) : (
                        <div className="text-center py-16 text-gray-500 dark:text-gray-400">
                            <User className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-lg font-medium">No Students Enrolled</h3>
                            <p className="mt-1 text-sm">Students who enroll in this course will appear here.</p>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
