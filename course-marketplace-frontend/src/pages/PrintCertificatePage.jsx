import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // You may need to run: npm install jwt-decode
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
        const logoSrc = '/full noBgColor.png';
        const verificationUrl = `${window.location.origin}/verify-certificate/${certificate.certificateId}`;
        const formattedDate = new Date(certificate.issueDate).toLocaleDateString('en-GB', {
            day: 'numeric', month: 'long', year: 'numeric'
        });

        return (
            <div className="light bg-white min-h-screen font-['Inter',sans-serif]">
                <div id="certificate" className="w-screen h-screen relative flex overflow-hidden">
                    <div className="w-1/3 bg-gradient-to-br from-indigo-700 to-indigo-900 text-white flex flex-col justify-between p-8">
                        <div>
                            <img src={logoSrc} alt="Logo" className="h-16 mb-10" />
                            <h1 className="text-3xl font-extrabold leading-tight tracking-wide">Certificate of Completion</h1>
                        </div>
                        <div className="text-center space-y-4">
                            <div className="mx-auto w-28 h-28 bg-white/10 rounded-full flex items-center justify-center border-4 border-white/20 p-1">
                                <QRCodeSVG value={verificationUrl} size={'100%'} bgColor="transparent" fgColor="#FFFFFF" level="H" />
                            </div>
                            <p className="font-mono text-[10px] opacity-70 break-all">{certificate.certificateId}</p>
                        </div>
                    </div>
                    <div className="w-2/3 p-12 relative flex flex-col justify-center text-center">
                        <Award className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-80 w-80 text-gray-500 opacity-5" />
                        <div className="relative z-10">
                            <p className="text-lg font-medium text-gray-500">This is to certify that</p>
                            <h2 className="text-7xl font-bold text-indigo-800 my-4 font-['Playfair_Display',serif]">{certificate.studentName}</h2>
                            <p className="text-md font-medium text-gray-600 max-w-xl mx-auto">in recognition of their dedication, effort, and successful mastery of the course material for</p>
                            <h3 className="text-5xl font-bold text-gray-900 mt-2">{certificate.courseTitle}</h3>
                            {certificate.score && (
                                <p className="mt-4 text-lg font-semibold text-teal-600 flex items-center justify-center gap-2">
                                   <Star size={18} /> Achieved with a final score of {certificate.score.toFixed(1)}%
                                </p>
                            )}
                        </div>
                        <div className="relative z-10 mt-auto pt-12 flex justify-between items-end w-full text-sm text-gray-700">
                            <div className="text-center w-2/5">
                                <p className="font-['Dancing_Script',cursive] text-2xl">{certificate.instructorName}</p>
                                <p className="border-t-2 border-gray-400 pt-1 text-xs font-semibold tracking-wider mt-1">COURSE INSTRUCTOR</p>
                            </div>
                            <div className="text-center w-2/5">
                                <p className="font-['Dancing_Script',cursive] text-2xl">{formattedDate}</p>
                                <p className="border-t-2 border-gray-400 pt-1 text-xs font-semibold tracking-wider mt-1">DATE ISSUED</p>
                            </div>
                        </div>
                    </div>
                </div>
                <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;800&family=Playfair+Display:wght@700&family=Dancing+Script:wght@700&display=swap');`}</style>
            </div>
        );
    } catch (error) {
        console.error("Invalid certificate token:", error);
        return <div className="font-sans text-center p-8">Error: The certificate link is invalid or has expired.</div>;
    }
}
