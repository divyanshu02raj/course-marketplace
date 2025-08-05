import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from '../api/axios';
import toast from 'react-hot-toast';
import { Printer, ArrowLeft, Award } from 'lucide-react';
import useTheme from '../hooks/useTheme';
import { QRCodeSVG } from 'qrcode.react'; // ** THE FIX IS HERE **

// --- Main Certificate Page Component ---
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

    return (
        <div className="bg-gray-100 dark:bg-gray-950 min-h-screen p-4 sm:p-8 flex flex-col items-center font-['Montserrat',sans-serif]">
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

            <div id="certificate" className="bg-gray-800 w-full max-w-5xl aspect-[1.414/1] relative shadow-2xl print:shadow-none flex overflow-hidden rounded-lg">
                {/* Left Side */}
                <div className="w-1/3 bg-indigo-700 text-white flex flex-col justify-between p-8">
                    <div>
                        <img src={logoSrc} alt="Logo" className="h-12 print:h-10 mb-8" />
                        <h1 className="text-3xl font-bold leading-tight">Certificate of Completion</h1>
                    </div>
                    <div className="text-center">
                        {/* ** THE FIX IS HERE ** */}
                        <QRCodeSVG
                            value={verificationUrl}
                            size={80}
                            bgColor="#ffffff"
                            fgColor="#1e3a8a" // A dark blue color
                            level="H"
                            includeMargin={true}
                            className="rounded-md"
                        />
                        <p className="text-xs opacity-70 mt-2">Scan to Verify</p>
                    </div>
                </div>

                {/* Right Side */}
                <div className="w-2/3 bg-white dark:bg-gray-900 p-12 flex flex-col justify-center text-left relative">
                    <Award className="absolute top-8 right-8 h-20 w-20 text-yellow-400 opacity-20" />
                    
                    <p className="text-lg font-medium text-gray-500 dark:text-gray-400">
                        This certificate is awarded to
                    </p>
                    <h2 className="text-5xl sm:text-6xl font-extrabold text-gray-800 dark:text-white my-4">
                        {certificate.user.name}
                    </h2>
                    <p className="text-lg font-medium text-gray-500 dark:text-gray-400">
                        for successfully completing the course
                    </p>
                    <h3 className="text-3xl sm:text-4xl font-bold text-indigo-700 dark:text-indigo-400 mt-2">
                        {certificate.course.title}
                    </h3>

                    <div className="mt-auto pt-12 flex justify-between items-end text-sm text-gray-600 dark:text-gray-300">
                        <div>
                            <p className="font-bold text-gray-800 dark:text-white border-b-2 border-gray-300 dark:border-gray-600 pb-1">
                                {certificate.course.instructor.name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 pt-1">Course Instructor</p>
                        </div>
                        <div>
                            <p className="font-bold text-gray-800 dark:text-white border-b-2 border-gray-300 dark:border-gray-600 pb-1">
                                {new Date(certificate.issueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 pt-1">Date Issued</p>
                        </div>
                    </div>
                </div>
            </div>
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700;800&display=swap');
            </style>
        </div>
    );
}



/*
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from '../api/axios';
import toast from 'react-hot-toast';
import { Printer, ArrowLeft, Award } from 'lucide-react';
import useTheme from '../hooks/useTheme'; // Import useTheme hook

// --- Main Certificate Page Component ---
export default function CertificatePage() {
    const { certificateId } = useParams();
    const [certificate, setCertificate] = useState(null);
    const [loading, setLoading] = useState(true);
    const { theme } = useTheme(); // Get the current theme

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

    // Choose logo based on theme for better visibility when printing
    const logoSrc = theme === 'dark' ? '/full noBgColor.png' : '/full noBgBlack.png';

    return (
        <div className="bg-gray-100 dark:bg-gray-950 min-h-screen p-4 sm:p-8 flex flex-col items-center font-sans">
 
            <div className="w-full max-w-5xl mb-6 flex justify-between items-center print:hidden">
                <Link to="/dashboard/certificates" className="flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400 hover:underline font-semibold">
                    <ArrowLeft size={16} />
                    Back to My Certificates
                </Link>
                <button 
                    onClick={handlePrint}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow transition"
                >
                    <Printer size={18} />
                    Print or Save
                </button>
            </div>

           
            <div id="certificate" className="bg-white dark:bg-gray-900 p-8 border-8 border-indigo-800 dark:border-indigo-500 w-full max-w-5xl aspect-[1.414/1] relative shadow-2xl print:shadow-none print:border-4">

                <div 
                    className="absolute inset-0 bg-repeat opacity-5 dark:opacity-10" 
                    style={{backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`}}>
                </div>
                
                <div className="relative h-full flex flex-col items-center justify-between text-center px-4 sm:px-8 py-4">
       
                    <div className="flex items-center gap-4">
                        <img src={logoSrc} alt="Logo" className="h-16 print:h-14" />
                    </div>

          
                    <div className="flex flex-col items-center">
                        <p className="text-xl sm:text-2xl uppercase tracking-widest text-gray-500 dark:text-gray-400 font-light">
                            Certificate of Completion
                        </p>
                        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 mt-8 mb-2">
                            This certificate is proudly presented to
                        </p>
                        <h2 className="text-4xl sm:text-6xl font-bold text-indigo-700 dark:text-indigo-400 font-['Great_Vibes',cursive] px-4 py-2 border-b-2 border-indigo-200 dark:border-indigo-800">
                            {certificate.user.name}
                        </h2>
                        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 mt-4 max-w-2xl">
                            for successfully completing the course
                        </p>
                        <h3 className="text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-white mt-2">
                            {certificate.course.title}
                        </h3>
                    </div>

                    <div className="w-full flex justify-between items-end text-sm text-gray-600 dark:text-gray-400">
                        <div className="text-left">
                            <p className="font-semibold text-gray-800 dark:text-gray-200">Date Issued</p>
                            <p>{new Date(certificate.issueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        </div>
                        
                        <div className="flex flex-col items-center">
                            <Award className="h-16 w-16 text-yellow-500" />
                            <p className="text-xs mt-1">Seal of Authenticity</p>
                        </div>

                        <div className="text-right">
                            <p className="font-semibold text-gray-800 dark:text-gray-200">Course Instructor</p>
                            <p className="font-['Dancing_Script',cursive] text-lg">{certificate.course.instructor.name}</p>
                        </div>
                    </div>
                </div>
            </div>
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&family=Dancing+Script&display=swap');
            </style>
        </div>
    );
}

*/