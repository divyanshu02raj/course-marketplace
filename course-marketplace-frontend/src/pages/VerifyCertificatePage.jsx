import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle, XCircle, Award, User, BookOpen, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

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
            try {
                // ** THE FIX IS HERE **
                // Re-added the localhost fallback. This allows the code to work both
                // locally (where the env var is undefined) and when deployed (where it is defined).
                const baseApiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
                
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
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-8 flex flex-col items-center justify-center text-center font-sans">
            <Link to="/" className="mb-8">
                <img src="/full noBgBlack.png" alt="Logo" className="h-12 dark:hidden" />
                <img src="/full noBgColor.png" alt="Logo" className="h-12 hidden dark:block" />
            </Link>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                {loading && <VerificationSkeleton />}

                {error && (
                    <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 sm:p-12">
                        <XCircle className="mx-auto h-16 w-16 text-red-500 mb-4" />
                        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Verification Failed</h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">{error}</p>
                    </div>
                )}

                {verificationData && verificationData.isValid && (
                    <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 sm:p-12">
                        <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
                        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Certificate Verified</h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">This is a valid certificate issued by Course Marketplace.</p>
                        
                        <div className="mt-8 text-left bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl space-y-5 border dark:border-gray-700">
                            <InfoRow icon={<User />} label="Recipient" value={verificationData.studentName} />
                            <InfoRow icon={<BookOpen />} label="Course" value={verificationData.courseTitle} />
                            <InfoRow icon={<Calendar />} label="Date Issued" value={new Date(verificationData.issueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} />
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
}

// --- Helper component for displaying verified info ---
const InfoRow = ({ icon, label, value }) => (
    <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-indigo-100 dark:bg-indigo-900/50 rounded-full text-indigo-600 dark:text-indigo-400">
            {React.cloneElement(icon, { size: 18 })}
        </div>
        <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
            <p className="font-semibold text-lg text-gray-800 dark:text-gray-200">{value}</p>
        </div>
    </div>
);
