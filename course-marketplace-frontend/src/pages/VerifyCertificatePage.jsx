import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle, XCircle, Award, User, BookOpen, Calendar, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';

// --- Skeleton Loader ---
const VerificationSkeleton = () => (
    <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 sm:p-12 animate-pulse">
        <div className="h-16 w-16 bg-gray-300 dark:bg-gray-700 rounded-full mx-auto mb-6"></div>
        <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mx-auto mb-4"></div>
        <div className="h-5 bg-gray-200 dark:bg-gray-600 rounded w-3/4 mx-auto mb-8"></div>
        <div className="space-y-4 bg-gray-50 dark:bg-gray-700/50 p-6 rounded-lg">
            <div className="h-6 bg-gray-200 dark:bg-gray-600 rounded w-full"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-600 rounded w-full"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-600 rounded w-full"></div>
        </div>
    </div>
);

// --- Main Verification Page Component ---
export default function VerifyCertificatePage() {
    const { certificateId } = useParams();
    const [verificationData, setVerificationData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const verify = async () => {
            // ** THE FIX IS HERE **
            // The localhost fallback has been removed.
            // This code now relies entirely on the REACT_APP_API_BASE_URL environment variable.
            const baseApiUrl = process.env.REACT_APP_API_BASE_URL;

            if (!baseApiUrl) {
                console.error("CRITICAL: REACT_APP_API_BASE_URL is not defined. The application cannot connect to the backend.");
                setError("Application is not configured correctly. Please contact support.");
                setLoading(false);
                return;
            }

            try {
                const apiUrl = `${baseApiUrl}/api/certificates/verify/${certificateId}`;
                const res = await axios.get(apiUrl);
                setVerificationData(res.data);
            } catch (err) {
                setError("This certificate could not be found or is invalid.");
            } finally {
                setLoading(false);
            }
        };
        verify();
    }, [certificateId]);

    const verificationUrl = window.location.href;

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-950 p-4 sm:p-8 flex flex-col items-center justify-center text-center font-['Montserrat',sans-serif]">
            <Link to="/" className="mb-8 print:hidden">
                <img src="/full noBgBlack.png" alt="Logo" className="h-12 dark:hidden" />
                <img src="/full noBgColor.png" alt="Logo" className="h-12 hidden dark:block" />
            </Link>

            {loading && <VerificationSkeleton />}

            {error && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 sm:p-12">
                    <XCircle className="mx-auto h-16 w-16 text-red-500 mb-4" />
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Verification Failed</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">{error}</p>
                </motion.div>
            )}

            {verificationData && verificationData.isValid && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    id="certificate" 
                    className="bg-gray-800 w-full max-w-5xl aspect-[1.414/1] relative shadow-2xl flex overflow-hidden rounded-lg"
                >
                    {/* Left Side */}
                    <div className="w-1/3 bg-indigo-700 text-white flex flex-col justify-between p-8">
                        <div>
                            <img src="/full noBgColor.png" alt="Logo" className="h-12 mb-8" />
                            <h1 className="text-3xl font-bold leading-tight">Certificate Verified</h1>
                        </div>
                        <div className="text-center">
                             <CheckCircle className="mx-auto h-16 w-16 text-green-300 mb-2" />
                             <p className="text-xs opacity-80">Authenticity Confirmed</p>
                        </div>
                    </div>

                    {/* Right Side */}
                    <div className="w-2/3 bg-white dark:bg-gray-900 p-12 flex flex-col justify-center text-left relative">
                        <Award className="absolute top-8 right-8 h-20 w-20 text-yellow-400 opacity-20" />
                        <p className="text-lg font-medium text-gray-500 dark:text-gray-400">
                            This certifies that
                        </p>
                        <h2 className="text-5xl sm:text-6xl font-extrabold text-gray-800 dark:text-white my-4">
                            {verificationData.studentName}
                        </h2>
                        <p className="text-md font-medium text-gray-500 dark:text-gray-400 max-w-xl">
                            in recognition of their dedication, effort, and successful mastery of the course material for
                        </p>
                        <h3 className="text-3xl sm:text-4xl font-bold text-indigo-700 dark:text-indigo-400 mt-2">
                            {verificationData.courseTitle}
                        </h3>
                        {verificationData.score && (
                            <p className="mt-4 text-lg font-semibold text-green-600 dark:text-green-400 flex items-center gap-2">
                                <Star size={18} />
                                Achieved with a final score of {verificationData.score.toFixed(1)}%
                            </p>
                        )}
                        <div className="mt-auto pt-12 flex justify-between items-end text-sm text-gray-600 dark:text-gray-300">
                            <div>
                                <p className="font-bold text-gray-800 dark:text-white border-b-2 border-gray-300 dark:border-gray-600 pb-1">
                                    {verificationData.instructorName}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 pt-1">Course Instructor</p>
                            </div>
                            <div>
                                <p className="font-bold text-gray-800 dark:text-white border-b-2 border-gray-300 dark:border-gray-600 pb-1">
                                    {new Date(verificationData.issueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 pt-1">Date Issued</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
             <style>
                @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700;800&display=swap');
            </style>
        </div>
    );
}
