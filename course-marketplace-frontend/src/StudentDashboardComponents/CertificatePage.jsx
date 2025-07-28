// src/StudentDashboardComponents/CertificatePage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from '../api/axios';
import toast from 'react-hot-toast';
import { Printer, ArrowLeft } from 'lucide-react';

export default function CertificatePage() {
    const { certificateId } = useParams();
    const [certificate, setCertificate] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCertificate = async () => {
            try {
                const res = await axios.get(`/certificates/${certificateId}`);
                setCertificate(res.data);
            } catch (error) {
                toast.error("Could not load certificate.");
                console.error("Fetch certificate error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCertificate();
    }, [certificateId]);

    const handlePrint = () => {
        window.print();
    };

    if (loading) {
        return <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">Loading Certificate...</div>;
    }

    if (!certificate) {
        return <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900 text-red-500">Certificate not found.</div>;
    }

    return (
        <div className="bg-gray-100 dark:bg-gray-900 min-h-screen p-4 sm:p-8 flex flex-col items-center">
            {/* Back Button */}
            <div className="w-full max-w-4xl mb-4 print:hidden">
                <Link to="/dashboard" className="flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400 hover:underline font-semibold">
                    <ArrowLeft size={16} />
                    Back to Dashboard
                </Link>
            </div>

            {/* Certificate Container */}
            <div className="bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 
                p-8 sm:p-12 border-[6px] border-double border-indigo-300 dark:border-indigo-700 
                shadow-[0_10px_25px_rgba(0,0,0,0.15)] rounded-xl w-full max-w-4xl aspect-[1.414/1] relative print:bg-white">

                {/* Inner Border */}
                <div className="absolute inset-4 border-[1.5px] border-dashed border-indigo-200 dark:border-indigo-600 rounded-md pointer-events-none"></div>

                {/* Content */}
                <div className="relative h-full flex flex-col items-center justify-center text-center font-serif px-6 sm:px-12">

                    {/* Logo at top center */}
                    <img 
                      src="/full noBgBlack.png" 
                      alt="Your Brand Logo" 
                      className="h-16 sm:h-20 mx-auto mb-6" 
                    />

                   

                    {/* Title */}
                    <p className="text-xl sm:text-2xl uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">
                      Certificate of Completion
                    </p>

                    {/* Recipient */}
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-indigo-800 dark:text-indigo-300 my-3">
                      {certificate.user.name}
                    </h1>

                    {/* Description */}
                    <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 italic">
                      has successfully completed the course
                    </p>

                    {/* Course Title */}
                    <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-white mt-3 mb-6">
                      {certificate.course.title}
                    </h2>

                    {/* Signature & Info */}
                    <div className="flex justify-between items-end w-full mt-auto pt-6 text-sm sm:text-base text-gray-600 dark:text-gray-300">
                        {/* Date */}
                        <div className="text-left">
                            <p className="font-semibold mb-1">Date Issued</p>
                            <p>{new Date(certificate.issueDate).toLocaleDateString('en-US', {
                                year: 'numeric', month: 'long', day: 'numeric'
                            })}</p>
                        </div>

                        {/* Signature Placeholder */}
                        <div className="text-center">
                            <p className="font-semibold mb-1">Signature</p>
                            <div className="w-32 h-[2px] bg-gray-400 mx-auto mb-1" />
                            <p className="italic text-xs text-gray-500 dark:text-gray-400">Course Instructor</p>
                        </div>

                        {/* Certificate ID */}
                        <div className="text-right">
                            <p className="font-semibold mb-1">Verification ID</p>
                            <p className="font-mono text-xs">{certificate.certificateId}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Print Button */}
            <button 
                onClick={handlePrint}
                className="mt-10 flex items-center gap-3 px-6 py-3 bg-indigo-700 hover:bg-indigo-800 
                text-white font-medium rounded-md shadow-lg transition duration-300 ease-in-out print:hidden"
            >
                <Printer size={20} />
                Print or Save as PDF
            </button>
        </div>
    );
}
