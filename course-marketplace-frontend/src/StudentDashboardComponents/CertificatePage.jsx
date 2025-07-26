// src/StudentDashboardComponents/CertificatePage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from '../api/axios';
import toast from 'react-hot-toast';
import { Award, Printer, ArrowLeft } from 'lucide-react';

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
            <div className="w-full max-w-4xl mb-4 print:hidden">
                <Link to="/dashboard" className="flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400 hover:underline font-semibold">
                    <ArrowLeft size={16} />
                    Back to Dashboard
                </Link>
            </div>

            {/* Certificate Container */}
            <div className="bg-white dark:bg-gray-800 p-8 sm:p-12 border-4 border-double border-indigo-200 dark:border-indigo-800 shadow-2xl w-full max-w-4xl aspect-[1.414/1] relative">
                <div className="absolute inset-2 border-2 border-indigo-300 dark:border-indigo-700"></div>
                <div className="relative h-full flex flex-col items-center justify-center text-center">
                    <div className="absolute top-8 right-8">
                        <Award size={64} className="text-yellow-500" />
                    </div>
                    
                    <p className="text-2xl font-serif text-gray-500 dark:text-gray-400">Certificate of Completion</p>
                    <h1 className="text-4xl sm:text-5xl font-bold text-indigo-700 dark:text-indigo-400 my-4">{certificate.user.name}</h1>
                    <p className="text-lg text-gray-600 dark:text-gray-300">has successfully completed the course</p>
                    <h2 className="text-3xl font-semibold text-gray-800 dark:text-white mt-2 mb-8">{certificate.course.title}</h2>
                    
                    <div className="w-full flex justify-between items-end mt-auto text-xs text-gray-500 dark:text-gray-400">
                        <div>
                            <p className="font-semibold">Date Issued</p>
                            <p>{new Date(certificate.issueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        </div>
                        <div>
                            <p className="font-semibold">Verification ID</p>
                            <p className="font-mono">{certificate.certificateId}</p>
                        </div>
                    </div>
                </div>
            </div>

            <button 
                onClick={handlePrint}
                className="mt-8 flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition print:hidden"
            >
                <Printer size={18} />
                Print or Save as PDF
            </button>
        </div>
    );
}
