import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { TrendingUp, DollarSign, Users, FileText, Star, HelpCircle, UserPlus, ChevronLeft, ChevronRight } from "lucide-react";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
  XAxis,
  YAxis,
  Legend,
} from "recharts";

// --- Skeleton Loader Component ---
const DashboardSkeleton = () => (
    <div className="animate-pulse">
        <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/3 mb-6"></div>
        <div className="h-6 bg-gray-200 dark:bg-gray-600 rounded w-2/3 mb-10"></div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-gray-200 dark:bg-gray-700 p-6 rounded-lg h-32"></div>
            ))}
        </div>

        {/* Skeleton for "What's New" and Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
                <div className="h-7 bg-gray-300 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
                <div className="h-72 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
                <div className="h-7 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mb-6"></div>
                <div className="space-y-4">
                    <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                    <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                    <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                </div>
            </div>
        </div>
    </div>
);


export default function DashboardView() {
    const [stats, setStats] = useState(null);
    const [summary, setSummary] = useState(null);
    const [performanceData, setPerformanceData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [chartDate, setChartDate] = useState(new Date()); // State for the chart's month

    // Fetch summary and stats only once on initial load
    useEffect(() => {
        const fetchInitialData = async () => {
            setLoading(true);
            try {
                const [statsRes, summaryRes] = await Promise.all([
                    axios.get('/earnings/instructor-stats'),
                    axios.get('/earnings/dashboard-summary')
                ]);
                
                setStats(statsRes.data);
                setSummary(summaryRes.data);

            } catch (error) {
                toast.error("Failed to load dashboard summary data.");
                console.error("Dashboard summary fetch error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchInitialData();
    }, []);

    // Fetch performance data whenever the chartDate changes
    useEffect(() => {
        const fetchPerformanceData = async () => {
            try {
                const year = chartDate.getFullYear();
                const month = chartDate.getMonth() + 1; // API expects 1-12
                const res = await axios.get(`/earnings/performance-chart?year=${year}&month=${month}`);
                setPerformanceData(res.data);
            } catch (error) {
                toast.error(`Failed to load performance data for ${chartDate.toLocaleString('default', { month: 'long' })}.`);
            }
        };
        
        fetchPerformanceData();
    }, [chartDate]);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', { 
            style: 'currency', 
            currency: 'INR',
            maximumFractionDigits: 0 
        }).format(amount);
    };

    const yAxisTickFormatter = (value) => {
        if (value >= 1000) {
            return `₹${(value / 1000).toFixed(1)}k`;
        }
        return `₹${value}`;
    };

    const handlePreviousMonth = () => {
        setChartDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setChartDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    };

    const isNextMonthDisabled = () => {
        const now = new Date();
        return chartDate.getFullYear() === now.getFullYear() && chartDate.getMonth() === now.getMonth();
    };


    if (loading) {
        return <DashboardSkeleton />;
    }

    if (!stats || !summary) {
        return <div className="text-center text-red-500">Could not load dashboard statistics.</div>;
    }

    const summaryItems = [
        {
            count: summary.unansweredQuestions,
            label: "Unanswered Questions",
            icon: <HelpCircle className="text-orange-500" />,
            link: "/dashboard/messages"
        },
        {
            count: summary.recentEnrollments,
            label: "New Enrollments (7d)",
            icon: <UserPlus className="text-green-500" />,
            link: "/dashboard/earnings"
        },
        {
            count: summary.newReviews,
            label: "New Reviews (7d)",
            icon: <Star className="text-yellow-500" />,
            link: "/dashboard/courses"
        }
    ];

    return (
        <div className="text-gray-800 dark:text-gray-300">
            <h2 className="text-3xl font-semibold mb-6 text-indigo-700 dark:text-indigo-400">
                Instructor Dashboard
            </h2>
            <p className="text-lg mb-10 text-gray-600 dark:text-gray-400">
                Welcome back! Here's a snapshot of your performance and earnings.
            </p>

            {/* Dashboard Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                <div className="bg-gradient-to-r from-indigo-500 to-indigo-700 dark:from-indigo-600 dark:to-indigo-800 p-6 rounded-lg shadow-md hover:shadow-xl transition-transform transform hover:scale-105">
                    <div className="flex justify-between items-center">
                        <div>
                            <h3 className="text-lg font-semibold text-white">Total Courses</h3>
                            <p className="text-4xl font-bold text-white">{stats.totalCourses || 0}</p>
                        </div>
                        <FileText size={32} className="text-indigo-200" />
                    </div>
                </div>

                <div className="bg-gradient-to-r from-green-500 to-green-700 dark:from-green-600 dark:to-green-800 p-6 rounded-lg shadow-md hover:shadow-xl transition-transform transform hover:scale-105">
                    <div className="flex justify-between items-center">
                        <div>
                            <h3 className="text-lg font-semibold text-white">Total Students</h3>
                            <p className="text-4xl font-bold text-white">{stats.totalEnrollments || 0}</p>
                        </div>
                        <Users size={32} className="text-green-200" />
                    </div>
                </div>

                <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 dark:from-yellow-500 dark:to-yellow-700 p-6 rounded-lg shadow-md hover:shadow-xl transition-transform transform hover:scale-105">
                    <div className="flex justify-between items-center">
                        <div>
                            <h3 className="text-lg font-semibold text-white">Net Earnings</h3>
                            <p className="text-4xl font-bold text-white">{formatCurrency(stats.netEarnings || 0)}</p>
                        </div>
                        <DollarSign size={32} className="text-yellow-200" />
                    </div>
                </div>
                
                <div className="bg-gradient-to-r from-blue-500 to-blue-700 dark:from-blue-600 dark:to-blue-800 p-6 rounded-lg shadow-md hover:shadow-xl transition-transform transform hover:scale-105">
                    <div className="flex justify-between items-center">
                        <div>
                            <h3 className="text-lg font-semibold text-white">Avg. Rating</h3>
                            <p className="text-4xl font-bold text-white">{stats.averageRating?.toFixed(1) || 'N/A'}</p>
                        </div>
                        <Star size={32} className="text-blue-200" />
                    </div>
                </div>
            </div>

            {/* Main Content Area with Chart and "What's New" */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Course Performance Section */}
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-2xl font-semibold text-indigo-700 dark:text-indigo-300">
                            Monthly Earnings
                        </h3>
                        <div className="flex items-center gap-2">
                            <button onClick={handlePreviousMonth} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition">
                                <ChevronLeft size={20} />
                            </button>
                            <span className="font-semibold w-32 text-center">
                                {chartDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                            </span>
                            <button onClick={handleNextMonth} disabled={isNextMonthDisabled()} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={performanceData}>
                            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                            <XAxis dataKey="name" stroke="#9ca3af" />
                            <YAxis stroke="#9ca3af" tickFormatter={yAxisTickFormatter} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "#1f2937",
                                    border: "none",
                                    borderRadius: "0.5rem",
                                    color: "#fff",
                                }}
                                labelStyle={{ color: "#ccc" }}
                                formatter={(value) => [formatCurrency(value), "Earnings"]}
                            />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="earnings"
                                stroke="#4f46e5"
                                strokeWidth={3}
                                dot={{ r: 4, fill: '#4f46e5' }}
                                activeDot={{ r: 8 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                
                {/* What's New Section */}
                <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
                    <h3 className="text-2xl font-semibold text-indigo-700 dark:text-indigo-300 mb-6">
                        What's New
                    </h3>
                    <div className="space-y-4">
                        {summaryItems.map((item, index) => (
                            <Link to={item.link} key={index} className="flex items-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-all">
                                <div className="p-2 bg-gray-200 dark:bg-gray-800 rounded-full mr-4">
                                    {item.icon}
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-800 dark:text-white">{item.count}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{item.label}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
