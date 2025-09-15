//course-marketplace-frontend\src\pages\VerifyCertificatePage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle, XCircle, Award, User, BookOpen, Calendar, Star } from 'lucide-react';
import { motion } from 'framer-motion';

// --- Skeleton Loader ---
const VerificationSkeleton = () => (
    <div className="w-full max-w-5xl aspect-[1.414/1] bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 animate-pulse">
        <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded w-1/3 mx-auto mb-12"></div>
        <div className="h-8 bg-gray-200 dark:bg-gray-600 rounded w-1/2 mx-auto mb-4"></div>
        <div className="h-16 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mx-auto mb-4"></div>
        <div className="h-8 bg-gray-200 dark:bg-gray-600 rounded w-2/3 mx-auto"></div>
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
            const baseApiUrl = process.env.REACT_APP_API_BASE_URL;
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

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-950 p-4 sm:p-8 flex flex-col items-center justify-center text-center font-['Inter',sans-serif]">


            {loading && <VerificationSkeleton />}

            {error && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 sm:p-12">
                    <XCircle className="mx-auto h-16 w-16 text-red-500 mb-4" />
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Verification Failed</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">{error}</p>
                </motion.div>
            )}

            {verificationData && verificationData.isValid && (
                <div id="certificate-container" className="w-full max-w-5xl" style={{ fontSize: 'clamp(0.5px, 1.5vw, 16px)' }}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        id="certificate" 
                        className="bg-gray-800 w-full aspect-[1.414/1] relative shadow-2xl flex overflow-hidden rounded-lg border-[0.25em] border-gray-300 dark:border-gray-700"
                    >
                        {/* Left Side */}
                        <div className="w-1/3 bg-indigo-700 text-white flex flex-col justify-between p-[2em]">
                            <div>
                                <img src="/full noBgColor.png" alt="Logo" className="h-[3em] mb-[2.5em]" />
                                <h1 className="text-[2em] font-bold leading-tight">Certificate Verified</h1>
                            </div>
                            <div className="text-center">
                                 <CheckCircle className="mx-auto h-[4em] w-[4em] text-green-300 mb-[0.5em]" />
                                 <p className="text-[0.75em] opacity-80">Authenticity Confirmed</p>
                            </div>
                        </div>

                        {/* Right Side */}
                        <div className="w-2/3 bg-white dark:bg-gray-900 p-[3em] flex flex-col justify-center text-center relative">
                            <Award className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-1/2 w-1/2 text-gray-500 opacity-5 pointer-events-none" />
                            <div className="flex-grow flex flex-col justify-center">
                                <p className="text-[1.125em] font-medium text-gray-500 dark:text-gray-400">This certifies that</p>
                                <h2 className="text-[4.5em] font-bold text-indigo-800 dark:text-indigo-300 my-[0.25em] font-['Playfair_Display',serif]">
                                    {verificationData.studentName}
                                </h2>
                                <p className="text-[1em] font-medium text-gray-600 dark:text-gray-300 max-w-[40em] mx-auto">
                                    successfully completed the course
                                </p>
                                <h3 className="text-[2.5em] font-bold text-gray-900 dark:text-white mt-[0.5em]">
                                    {verificationData.courseTitle}
                                </h3>
                                {verificationData.score && (
                                    <p className="mt-[1em] text-[1.125em] font-semibold text-green-600 dark:text-green-400 flex items-center justify-center gap-[0.5em]">
                                        <Star className="w-[1.2em] h-[1.2em]" />
                                        Achieved with a final score of {verificationData.score.toFixed(1)}%
                                    </p>
                                )}
                            </div>
                            <div className="relative z-10 mt-auto pt-[2em] flex justify-between items-end w-full text-[0.75em] text-gray-700 dark:text-gray-300">
                                <div className="text-center w-2/5">
                                    <p className="text-[1.5em] font-['Dancing_Script',cursive]">{verificationData.instructorName}</p>
                                    <p className="border-t-2 border-gray-400 pt-[0.5em] text-[0.75em] font-semibold tracking-wider mt-[0.25em]">COURSE INSTRUCTOR</p>
                                </div>
                                <div className="text-center w-2/5">
                                    <p className="text-[1.5em] font-['Dancing_Script',cursive]">{new Date(verificationData.issueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                    <p className="border-t-2 border-gray-400 pt-[0.5em] text-[0.75em] font-semibold tracking-wider mt-[0.25em]">DATE ISSUED</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
            <style>
                {`
                    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;800&family=Playfair+Display:wght@700&family=Dancing+Script:wght@700&display=swap');
                `}
            </style>
        </div>
    );
}
