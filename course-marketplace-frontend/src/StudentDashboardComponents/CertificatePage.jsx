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

            <div id="certificate-container" className="w-full max-w-5xl" style={{ fontSize: 'clamp(0.5px, 1.5vw, 16px)' }}>
                <div id="certificate" className="bg-white w-full aspect-[1.414/1] relative shadow-2xl print:shadow-none flex overflow-hidden rounded-lg border-[0.25em] border-gray-300">
                    {/* Left Panel */}
                    <div className="w-1/3 bg-gradient-to-br from-indigo-700 to-indigo-900 text-white flex flex-col justify-between p-[2em] print:bg-indigo-700">
                        <div>
                            <img src="/full noBgColor.png" alt="Logo" className="h-[4em] print:h-12 mb-[2.5em]" />
                            <h1 className="text-[2em] font-extrabold leading-tight tracking-wide">Certificate of Completion</h1>
                            <p className="text-[0.875em] mt-[1em] opacity-80">
                                Issued in recognition of comprehensive learning and achievement.
                            </p>
                        </div>
                        <div className="text-center space-y-[1em]">
                            {/* ** THE FIX IS HERE ** */}
                            <div className="mx-auto w-[8em] h-[8em] bg-white rounded-lg flex items-center justify-center p-2 shadow-inner">
                                <QRCodeSVG
                                    value={verificationUrl}
                                    size={'100%'}
                                    bgColor="#FFFFFF"
                                    fgColor="#000000"
                                    level="H"
                                    className="w-full h-full"
                                />
                            </div>
                            <p className="text-[0.75em] opacity-80">Scan to Verify</p>
                        </div>
                    </div>

                    {/* Right Panel */}
                    <div className="w-2/3 p-[3em] relative flex flex-col text-center text-gray-800">
                        <Award className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-1/2 w-1/2 text-gray-500 opacity-5 pointer-events-none" />

                        <div className="flex-grow flex flex-col justify-center">
                            <p className="text-[1.125em] font-medium text-gray-500">This is to certify that</p>
                            <h2 className="text-[4.5em] font-bold text-indigo-800 my-[0.25em] font-['Playfair_Display',serif]">
                                {certificate.user.name}
                            </h2>
                            <p className="text-[1em] font-medium text-gray-600 max-w-[40em] mx-auto">
                                in recognition of their dedication, effort, and successful mastery of the course material for
                            </p>
                            <h3 className="text-[2.5em] font-bold text-gray-900 mt-[0.5em]">
                                {certificate.course.title}
                            </h3>
                            {certificate.score && (
                                <p className="mt-[1em] text-[1.125em] font-semibold text-teal-600 flex items-center justify-center gap-[0.5em]">
                                   <Star className="w-[1.2em] h-[1.2em]" /> 
                                   <span>Achieved with a final score of {certificate.score.toFixed(1)}%</span>
                                </p>
                            )}
                        </div>

                        <div className="relative z-10 mt-auto">
                            <div className="flex justify-between items-end w-full text-[0.75em] text-gray-700">
                                <div className="text-center w-2/5">
                                    <p className="text-[1.5em] font-['Dancing_Script',cursive]">{certificate.course.instructor.name}</p>
                                    <p className="border-t-2 border-gray-400 pt-[0.5em] text-[0.75em] font-semibold tracking-wider mt-[0.25em]">COURSE INSTRUCTOR</p>
                                </div>
                                <div className="text-center w-2/5">
                                    <p className="text-[1.5em] font-['Dancing_Script',cursive]">{formattedDate}</p>
                                    <p className="border-t-2 border-gray-400 pt-[0.5em] text-[0.75em] font-semibold tracking-wider mt-[0.25em]">DATE ISSUED</p>
                                </div>
                            </div>
                            <div className="text-center mt-[2em]">
                                <p className="font-mono text-[0.65em] opacity-70 break-all">{certificate.certificateId}</p>
                                <p className="text-[0.75em] font-semibold tracking-wider text-gray-500">VERIFICATION ID</p>
                            </div>
                        </div>
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