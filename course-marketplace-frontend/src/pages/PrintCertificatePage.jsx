import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { Award, Star } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export default function PrintCertificatePage() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');

    if (!token) {
        return <div className="font-sans text-center p-8">Error: No certificate token provided.</div>;
    }

    try {
        const certificate = jwtDecode(token);
        const logoSrc = '/full noBgColor.png'; // Use light logo for dark indigo panel
        const verificationUrl = `${window.location.origin}/verify-certificate/${certificate.certificateId}`;
        const formattedDate = new Date(certificate.issueDate).toLocaleDateString('en-GB', {
            day: 'numeric', month: 'long', year: 'numeric'
        });

        return (
            // The root element is the certificate itself for perfect PDF rendering
            <div className="light w-screen h-screen font-['Inter',sans-serif]">
                <div id="certificate" className="bg-white w-full h-full relative flex overflow-hidden border-[0.25em] border-gray-300">
                    {/* Left Panel */}
                    <div className="w-1/3 bg-gradient-to-br from-indigo-700 to-indigo-900 text-white flex flex-col justify-between p-[2em]">
                        <div>
                            <img src="/full noBgColor.png" alt="Logo" className="h-[4em] mb-[2.5em]" />
                            <h1 className="text-[2em] font-extrabold leading-tight tracking-wide">Certificate of Completion</h1>
                            <p className="text-[0.875em] mt-[1em] opacity-80">
                                Issued in recognition of comprehensive learning and achievement.
                            </p>
                        </div>
                        <div className="text-center space-y-[1em]">
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
                                {certificate.studentName}
                            </h2>
                            <p className="text-[1em] font-medium text-gray-600 max-w-[40em] mx-auto">
                                in recognition of their dedication, effort, and successful mastery of the course material for
                            </p>
                            <h3 className="text-[2.5em] font-bold text-gray-900 mt-[0.5em]">
                                {certificate.courseTitle}
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
                                    <p className="text-[1.5em] font-['Dancing_Script',cursive]">{certificate.instructorName}</p>
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
                {/* We need to embed the styles directly for Puppeteer */}
                <style>
                {`
                    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;800&family=Playfair+Display:wght@700&family=Dancing+Script:wght@700&display=swap');
                    body {
                        font-size: clamp(0.5px, 1.5vw, 16px);
                    }
                `}
                </style>
            </div>
        );
    } catch (error) {
        console.error("Invalid certificate token:", error);
        return <div className="font-sans text-center p-8">Error: The certificate link is invalid or has expired.</div>;
    }
}
