import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from '../api/axios';
import toast from 'react-hot-toast';
import { Printer, ArrowLeft, Award, Star } from 'lucide-react';
import useTheme from '../hooks/useTheme';
import { QRCodeSVG } from 'qrcode.react';

export default function CertificatePage() {
    const { certificateId } = useParams();
    const [certificate, setCertificate] = useState(null);
    const [loading, setLoading] = useState(true);
    const { theme } = useTheme();

    useEffect(() => {
        const fetchCertificate = async () => {
            try {
                const res = await axios.get(`/certificates/${certificateId}`);
                setCertificate(res.data);
            } catch (error) {
                toast.error("Could not load certificate.");
            } finally {
                setLoading(false);
            }
        };
        fetchCertificate();
    }, [certificateId]);

    const handlePrint = () => window.print();

    if (loading) {
        return <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">Loading Certificate...</div>;
    }

    if (!certificate) {
        return <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900 text-red-500">Certificate not found.</div>;
    }

    const logoSrc = '/full noBgColor.png';
    const verificationUrl = `${window.location.origin}/verify-certificate/${certificate.certificateId}`;
    
    const formattedDate = new Date(certificate.issueDate).toLocaleDateString('en-GB', {
        day: 'numeric', month: 'long', year: 'numeric'
    });

    return (
        <div className="bg-gray-100 dark:bg-gray-950 min-h-screen p-4 sm:p-8 flex flex-col items-center font-['Inter',sans-serif]">
            <div className="w-full max-w-5xl mb-6 flex justify-between items-center print:hidden">
                <Link to="/dashboard/certificates" className="flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400 hover:underline font-semibold">
                    <ArrowLeft size={16} />
                    Back to My Certificates
                </Link>
                <button onClick={handlePrint} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow transition">
                    <Printer size={18} />
                    Print or Save
                </button>
            </div>

            <div id="certificate" className="bg-white dark:bg-gray-900 w-full max-w-5xl aspect-[1.414/1] relative shadow-2xl print:shadow-none flex overflow-hidden rounded-lg border-4 border-gray-300 dark:border-gray-700">
                {/* Left Panel */}
                <div className="w-1/3 bg-gradient-to-br from-indigo-700 to-indigo-900 text-white flex flex-col justify-between p-8 print:bg-indigo-700">
                    <div>
                        <img src={logoSrc} alt="Logo" className="h-16 print:h-12 mb-10" />
                        <h1 className="text-3xl font-extrabold leading-tight tracking-wide">Certificate of Completion</h1>
                        <p className="text-sm mt-4 opacity-80">
                            Issued in recognition of comprehensive learning and achievement.
                        </p>
                    </div>
                    <div className="text-center space-y-4">
                        <div className="mx-auto w-28 h-28 bg-white/10 rounded-full flex items-center justify-center border-4 border-white/20">
                            <QRCodeSVG
                                value={verificationUrl}
                                size={88}
                                bgColor="transparent"
                                fgColor="#FFFFFF"
                                level="H"
                            />
                        </div>
                        <p className="text-xs opacity-80">Scan to Verify</p>
                    </div>
                </div>

                {/* Right Panel */}
                <div className="w-2/3 p-12 relative flex flex-col">
                    <Award className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-80 w-80 text-gray-500 opacity-5 pointer-events-none" />

                    <div className="flex-grow flex flex-col justify-center text-center">
                        <p className="text-lg font-medium text-gray-500 dark:text-gray-400">This is to certify that</p>
                        <h2 className="text-6xl sm:text-7xl font-bold text-indigo-800 dark:text-indigo-300 my-4 font-['Playfair_Display',serif]">
                            {certificate.user.name}
                        </h2>
                        <p className="text-md font-medium text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
                            in recognition of their dedication, effort, and successful mastery of the course material for
                        </p>
                        <h3 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mt-2">
                            {certificate.course.title}
                        </h3>
                        {certificate.score && (
                            <p className="mt-4 text-lg font-semibold text-teal-600 dark:text-teal-400 flex items-center justify-center gap-2">
                               <Star size={18} /> Achieved with a final score of {certificate.score.toFixed(1)}%
                            </p>
                        )}
                    </div>

                    <div className="pt-12 flex justify-between items-end w-full text-sm text-gray-700 dark:text-gray-300">
                        <div className="text-center w-2/5">
                            <p className="font-['Dancing_Script',cursive] text-2xl">{certificate.course.instructor.name}</p>
                            <p className="border-t-2 border-gray-400 pt-1 text-xs font-semibold tracking-wider mt-1">COURSE INSTRUCTOR</p>
                        </div>
                        <div className="text-center w-2/5">
                            <p className="font-['Dancing_Script',cursive] text-2xl">{formattedDate}</p>
                            <p className="border-t-2 border-gray-400 pt-1 text-xs font-semibold tracking-wider mt-1">DATE ISSUED</p>
                        </div>
                    </div>
                     <div className="text-center mt-8">
                        <p className="font-mono text-[10px] opacity-70 break-all">{certificate.certificateId}</p>
                        <p className="text-xs font-semibold tracking-wider text-gray-500">VERIFICATION ID</p>
                    </div>
                </div>
            </div>

            <style>
                {`
                    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;800&family=Playfair+Display:wght@700&family=Dancing+Script:wght@700&display=swap');
                    .print\\:bg-indigo-700 {
                        --tw-bg-opacity: 1 !important;
                        background-color: #4338ca !important;
                    }
                `}
            </style>
        </div>
    );
}
