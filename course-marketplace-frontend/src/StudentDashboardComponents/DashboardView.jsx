import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { BookOpen, CheckCircle, Award, MessageSquare } from "lucide-react";
import { useAuth } from "../context/AuthContext";

// --- Skeleton Loader ---
const DashboardSkeleton = () => (
    <div className="animate-pulse space-y-10">
        <div>
            <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
            <div className="h-5 bg-gray-200 dark:bg-gray-600 rounded w-3/4 mt-2"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => <div key={i} className="bg-gray-200 dark:bg-gray-700 rounded-2xl h-28"></div>)}
        </div>
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl">
            <div className="h-7 bg-gray-300 dark:bg-gray-700 rounded w-1/3 mb-5"></div>
            <div className="space-y-4">
                <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            </div>
        </div>
    </div>
);


export default function DashboardView() {
    const { user } = useAuth();
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const res = await axios.get('/dashboard/student-summary');
                setSummary(res.data);
            } catch (error) {
                toast.error("Could not load dashboard summary.");
                console.error("Fetch dashboard summary error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSummary();
    }, []);

    if (loading) {
        return <DashboardSkeleton />;
    }

    if (!summary) {
        return <div className="text-center text-red-500">Failed to load dashboard data.</div>;
    }

    const stats = [
        { label: "Courses in Progress", value: summary.coursesInProgress, icon: <BookOpen className="text-indigo-500 dark:text-indigo-400" /> },
        { label: "Completed Courses", value: summary.completedCourses, icon: <CheckCircle className="text-green-500 dark:text-green-400" /> },
        { label: "Certificates Earned", value: summary.certificatesEarned, icon: <Award className="text-yellow-500 dark:text-yellow-400" /> },
        { label: "Unread Messages", value: 0, icon: <MessageSquare className="text-pink-500 dark:text-pink-400" /> }, // Placeholder
    ];

    return (
        <div className="space-y-10 text-gray-900 dark:text-white">
            {/* Welcome Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
                        Welcome back, {user?.name || "Student"}!
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Here’s a quick snapshot of your progress and updates.
                    </p>
                </div>
                <Link to="/dashboard/my-courses" className="mt-4 sm:mt-0 px-5 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition shadow-md hover:shadow-lg">
                    Continue Learning
                </Link>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map(({ label, value, icon }, idx) => (
                    <div
                        key={idx}
                        className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-800 hover:shadow-lg hover:-translate-y-1 transition-all"
                    >
                        <div className="flex items-center gap-4 mb-3">
                            <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full">
                                {icon}
                            </div>
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{label}</span>
                        </div>
                        <p className="text-4xl font-bold text-gray-800 dark:text-white">{value}</p>
                    </div>
                ))}
            </div>

            {/* Recent Certificates */}
            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-800">
                <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-5">Recent Achievements</h3>
                {summary.recentCertificates.length > 0 ? (
                    <ul className="space-y-4">
                        {summary.recentCertificates.map((cert) => (
                            <li key={cert._id} className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                                <div className="w-10 h-10 rounded-lg flex-shrink-0 bg-yellow-100 dark:bg-yellow-900/50 text-yellow-600 dark:text-yellow-400 flex items-center justify-center">
                                    <Award size={20} />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                                        Certificate Earned: <span className="font-bold">{cert.course.title}</span>
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        Issued on {new Date(cert.issueDate).toLocaleDateString()}
                                    </p>
                                </div>
                                <Link to="/dashboard/certificates" className="ml-auto text-sm font-semibold text-indigo-600 hover:underline">
                                    View
                                </Link>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-center text-gray-500 dark:text-gray-400 py-4">You haven't earned any certificates yet. Keep learning!</p>
                )}
            </div>
        </div>
    );
};
