//course-marketplace-frontend\src\InstructorDashboardComponents\ManageCourseView.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import toast from 'react-hot-toast';
import { ArrowLeft, Search, Users, MessageCircle } from 'lucide-react';
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
            navigate('/dashboard/messages', { state: { openChatId: res.data._id } });
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
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <header className="mb-8">
                    <button
                        onClick={() => navigate("/dashboard/courses")}
                        className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 mb-4 font-semibold"
                    >
                        <ArrowLeft size={16} />
                        Back to My Courses
                    </button>
                    <div>
                        <h2 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
                            <Users className="text-indigo-500" />
                            Manage Students
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Viewing enrollments for: <span className="font-semibold text-indigo-600 dark:text-indigo-400">{courseTitle}</span>
                        </p>
                    </div>
                </header>

                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800">
                    {/* Redesigned Header with Search and Stats */}
                    <div className="p-6 flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-gray-200 dark:border-gray-800">
                        <div className="relative w-full sm:w-auto">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                <Search size={18} />
                            </div>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search students..."
                                className="w-full sm:w-64 p-3 pl-12 bg-gray-100 dark:bg-gray-800 border-transparent rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
                            />
                        </div>
                        <div className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                            Total Students: <span className="text-indigo-600 dark:text-indigo-400">{enrollments.length}</span>
                        </div>
                    </div>
                    
                    {/* Redesigned Student Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-800">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Student</th>
                                    <th scope="col" className="px-6 py-3">Enrolled On</th>
                                    <th scope="col" className="px-6 py-3">Progress</th>
                                    <th scope="col" className="px-6 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <AnimatePresence>
                                {filteredEnrollments.length > 0 ? filteredEnrollments.map(({ user, progress, createdAt }) => (
                                    <motion.tr
                                        key={user._id}
                                        layout
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="bg-white dark:bg-gray-900 border-b dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                                    >
                                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            <div className="flex items-center gap-3">
                                                <img src={user.profileImage || `https://i.pravatar.cc/40?u=${user.email}`} alt={user.name} className="w-10 h-10 rounded-full"/>
                                                <div>
                                                    <div className="font-bold">{user.name}</div>
                                                    <div className="text-xs text-gray-500">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {new Date(createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                                                <div className="bg-indigo-600 h-2.5 rounded-full" style={{width: `${progress || 0}%`}}></div>
                                            </div>
                                            <div className="text-xs text-right mt-1">{Math.round(progress || 0)}%</div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button onClick={() => handleStartConversation(user._id)} className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 ml-auto">
                                                <MessageCircle size={14} /> Message
                                            </button>
                                        </td>
                                    </motion.tr>
                                )) : (
                                    <tr>
                                        <td colSpan="4" className="text-center py-16 text-gray-500 dark:text-gray-400">
                                            <Users className="mx-auto h-12 w-12 text-gray-400" />
                                            <h3 className="mt-2 text-lg font-medium">No Students Found</h3>
                                            <p className="mt-1 text-sm">{searchQuery ? "Try adjusting your search." : "Students who enroll will appear here."}</p>
                                        </td>
                                    </tr>
                                )}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}