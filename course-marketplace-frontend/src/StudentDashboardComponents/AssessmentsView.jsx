import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../api/axios';
import toast from 'react-hot-toast';
import { ClipboardCheck, Play, Check, RotateCw, Eye, Lock } from 'lucide-react';

// --- Skeleton Loader Component ---
const AssessmentCardSkeleton = () => (
    <div className="rounded-3xl p-7 bg-gray-100 dark:bg-gray-800/50 animate-pulse">
        <div className="mb-4">
            <div className="flex justify-between items-start mb-3">
                <div className="h-7 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded-full w-20"></div>
            </div>
            <div className="space-y-2 mt-4">
                <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-full"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-5/6"></div>
            </div>
        </div>
        <div className="mt-auto h-12 bg-gray-300 dark:bg-gray-700 rounded-xl"></div>
    </div>
);


const AssessmentsView = () => {
    const [assessments, setAssessments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAssessments = async () => {
            try {
                const res = await axios.get('/assessments/my-assessments');
                setAssessments(res.data);
            } catch (error) {
                toast.error("Could not fetch your assessments.");
                console.error("Fetch assessments error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAssessments();
    }, []);

    const getStatusInfo = (status) => {
        switch (status) {
            case 'Completed':
                return {
                    label: 'Completed',
                    color: 'from-green-500 to-green-300 dark:from-green-600 dark:to-green-400',
                    bgColor: 'bg-green-100 dark:bg-green-900/40',
                    shadowColor: 'hover:shadow-green-300 dark:hover:shadow-green-600',
                    button: {
                        label: 'View Results',
                        icon: <Eye size={18} />,
                        actionColor: 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400 font-semibold',
                        disabled: false,
                    },
                };
            case 'Failed':
                 return {
                    label: 'Failed',
                    color: 'from-red-500 to-red-300 dark:from-red-600 dark:to-red-400',
                    bgColor: 'bg-red-100 dark:bg-red-900/40',
                    shadowColor: 'hover:shadow-red-300 dark:hover:shadow-red-600',
                    button: {
                        label: 'Retake Test',
                        icon: <RotateCw size={18} />,
                        actionColor: 'bg-red-600 hover:bg-red-700 text-white',
                        disabled: false,
                    },
                };
            case 'Locked':
                 return {
                    label: 'Locked',
                    color: 'from-gray-400 to-gray-300 dark:from-gray-600 dark:to-gray-500',
                    bgColor: 'bg-gray-100 dark:bg-gray-800/40',
                    shadowColor: 'hover:shadow-gray-300 dark:hover:shadow-gray-600',
                    button: {
                        label: 'Locked',
                        icon: <Lock size={18} />,
                        actionColor: 'bg-gray-300 text-gray-500 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed',
                        disabled: true,
                    },
                };
            default: // Not Started
                return {
                    label: 'Not Started',
                    color: 'from-indigo-500 to-indigo-300 dark:from-indigo-600 dark:to-indigo-400',
                    bgColor: 'bg-indigo-100 dark:bg-indigo-900/40',
                    shadowColor: 'hover:shadow-indigo-300 dark:hover:shadow-indigo-600',
                    button: {
                        label: 'Start Test',
                        icon: <Play size={18} />,
                        actionColor: 'bg-indigo-600 hover:bg-indigo-700 text-white',
                        disabled: false,
                    },
                };
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-8 bg-white dark:bg-gray-900 rounded-3xl shadow-xl text-gray-900 dark:text-white space-y-14 transition-colors">
            <header className="flex items-center gap-4 mb-10">
                <ClipboardCheck className="h-12 w-12 text-indigo-600 dark:text-indigo-400" />
                <h2 className="text-4xl font-extrabold tracking-tight text-indigo-700 dark:text-indigo-400">My Assessments</h2>
            </header>

            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {loading ? (
                    <>
                        <AssessmentCardSkeleton />
                        <AssessmentCardSkeleton />
                        <AssessmentCardSkeleton />
                    </>
                ) : assessments.length === 0 ? (
                    <p className="col-span-full text-center text-gray-500 dark:text-gray-400">You have no final assessments available yet.</p>
                ) : (
                    assessments.map((assessment) => {
                        const info = getStatusInfo(assessment.status);
                        const buttonContent = (
                            <div
                                title={info.button.disabled ? "Complete all course lessons to unlock" : ""}
                                className={`mt-auto flex items-center justify-center gap-3 w-full rounded-xl py-3 font-semibold transition-transform active:scale-95 ${info.button.actionColor}`}
                            >
                                {info.button.label}
                                {info.button.icon}
                            </div>
                        );

                        return (
                            <article
                                key={assessment._id}
                                className={`rounded-3xl p-7 shadow-lg transform transition-all hover:-translate-y-1 flex flex-col justify-between ${info.bgColor} ${info.shadowColor}`}
                            >
                                <div>
                                    <div className="flex justify-between items-start mb-3">
                                        <h3 className="text-2xl font-bold leading-snug">{assessment.course.title}</h3>
                                        <span className={`inline-block rounded-full bg-gradient-to-tr ${info.color} px-3 py-1 text-xs font-semibold tracking-wide text-white`}>
                                            {info.label}
                                        </span>
                                    </div>
                                    <p className="text-gray-700 dark:text-gray-300 mb-5 leading-relaxed">
                                        Final assessment for this course.
                                    </p>
                                </div>
                                {info.button.disabled ? (
                                    buttonContent
                                ) : (
                                    <Link
                                        to={`/assessment/${assessment._id}`}
                                        state={assessment.status === 'Completed' ? { attempt: assessment.attempt } : null}
                                    >
                                        {buttonContent}
                                    </Link>
                                )}
                            </article>
                        );
                    })
                )}
            </section>
        </div>
    );
};

export default AssessmentsView;
