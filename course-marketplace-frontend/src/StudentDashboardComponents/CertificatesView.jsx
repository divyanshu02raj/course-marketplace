// course-marketplace-frontend\src\StudentDashboardComponents\CertificatesView.jsx
import React, { useState } from "react";
import { Download, Eye, Award, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import axios from '../api/axios'; // Use your custom axios instance
import toast from 'react-hot-toast';

export default function CertificatesView({ certificates }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [downloadingId, setDownloadingId] = useState(null);

  // This function now calls the backend Puppeteer service to generate and download the PDF.
  const handleDownload = async (certificate) => {
    setDownloadingId(certificate.certificateId);
    const toastId = toast.loading("Preparing your high-quality PDF...");
    try {
        // Use axios to make an authenticated request to the backend PDF generation endpoint.
        // The `responseType: 'blob'` is crucial for handling the file data correctly.
        const response = await axios.get(`/certificates/${certificate.certificateId}/download`, {
            responseType: 'blob',
            withCredentials: true, // Ensure the authentication cookie is sent
        });

        // Create a temporary URL from the received file data
        const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `Certificate-${certificate.course.title.replace(/ /g, '_')}.pdf`);
        
        document.body.appendChild(link);
        link.click();
        
        // Clean up the temporary URL
        link.parentNode.removeChild(link);
        window.URL.revokeObjectURL(url);

        toast.success("Download started!", { id: toastId });
    } catch (error) {
        console.error("PDF Download Error:", error);
        toast.error("Could not download certificate.", { id: toastId });
    } finally {
        setDownloadingId(null);
    }
  };

  const filteredCertificates = certificates.filter((cert) => {
    if (!cert || !cert.course) {
      return false;
    }
    return cert.course.title.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
                <Award className="text-indigo-500" />
                My Certificates
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
                Congratulations on your achievements! View and download your certificates here.
            </p>
        </div>
        <div className="relative w-full sm:w-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Search size={18} />
            </div>
            <input
                type="text"
                placeholder="Search certificates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:max-w-xs p-3 pl-10 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
        </div>
      </div>

      {/* Certificate Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence>
          {filteredCertificates.length > 0 ? (
            filteredCertificates.map((certificate, idx) => (
              <motion.div
                key={certificate._id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="relative group bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all"
              >
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={certificate.course.thumbnail || "https://placehold.co/300x150?text=Course+Image"}
                    alt={certificate.course.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4">
                    <h3 className="text-lg font-bold text-white shadow-lg">
                      {certificate.course.title}
                    </h3>
                  </div>
                </div>
                <div className="p-5 space-y-3">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Issued on:{" "}
                    <span className="font-semibold text-gray-800 dark:text-gray-200">
                      {new Date(certificate.issueDate).toLocaleDateString('en-US', {
                          year: 'numeric', month: 'long', day: 'numeric'
                      })}
                    </span>
                  </p>
                  <p className="text-xs text-gray-500">
                    ID: {certificate.certificateId.slice(0, 13)}...
                  </p>
                  <div className="flex gap-3 pt-3">
                    <Link
                      to={`/certificate/${certificate.certificateId}`}
                      className="flex-1 inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </Link>
                    <button 
                        onClick={() => handleDownload(certificate)}
                        disabled={downloadingId === certificate.certificateId}
                        className="flex-1 inline-flex items-center justify-center gap-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 py-2 px-3 rounded-lg text-sm font-medium transition disabled:opacity-50"
                    >
                      <Download className="w-4 h-4" />
                      {downloadingId === certificate.certificateId ? '...' : 'Download'}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-600 dark:text-gray-400 py-16">
              <Award className="mx-auto h-12 w-12 text-gray-400" />
              <p className="text-lg font-medium mt-2">No certificates found.</p>
              <p className="text-sm">Complete a course to earn your first certificate!</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
