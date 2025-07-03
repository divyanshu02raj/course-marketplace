// StudentDashboardComponents/CertificatesView.jsx
import React, { useState } from "react";
import { Download, Eye, BadgeCheck, AlertCircle } from "lucide-react";

const CertificatesView = ({
  certificates,
  certificateFilter,
  setCertificateFilter,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCertificates = certificates.filter((cert) => {
    const matchesSearch = cert.name.toLowerCase().includes(searchQuery.toLowerCase());
    const expiryDate = new Date(cert.expiryDate);
    const currentDate = new Date();

    const matchesFilter =
      certificateFilter === "all"
        ? true
        : certificateFilter === "active"
        ? expiryDate >= currentDate
        : expiryDate < currentDate;

    return matchesSearch && matchesFilter;
  });

  const filters = [
    { label: "All", value: "all" },
    { label: "Active", value: "active" },
    { label: "Expired", value: "expired" },
  ];

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-3xl font-bold text-indigo-700 dark:text-indigo-400">
          Certificates
        </h2>

        {/* Search Input */}
        <input
          type="text"
          placeholder="Search certificates..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full sm:max-w-xs p-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 outline-none"
        />
      </div>

      {/* Filter Chips */}
      <div className="flex flex-wrap gap-3">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setCertificateFilter(f.value)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
              certificateFilter === f.value
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-indigo-500 hover:text-white"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Certificate Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredCertificates.length > 0 ? (
          filteredCertificates.map((certificate, idx) => {
            const isCompleted = certificate.status === "completed";
            const isExpired = new Date(certificate.expiryDate) < new Date();

            return (
              <div
                key={idx}
                className="relative group bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all"
              >
                {/* Image with overlay */}
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={certificate.thumbnail || "https://via.placeholder.com/300x150?text=Course+Image"}
                    alt={certificate.name}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform"
                  />
                  {isExpired && (
                    <span className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                      Expired
                    </span>
                  )}
                </div>

                {/* Card Body */}
                <div className="p-5 space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {certificate.name}
                  </h3>

                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 gap-1">
                    {isCompleted ? <BadgeCheck className="w-4 h-4 text-green-500" /> : <AlertCircle className="w-4 h-4 text-yellow-400" />}
                    <span>{isCompleted ? "Completed" : "In Progress"}</span>
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Completed on:{" "}
                    <span className="italic">
                      {new Date(certificate.completionDate).toLocaleDateString()}
                    </span>
                  </p>

                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Expires:{" "}
                    <span className="font-medium">
                      {new Date(certificate.expiryDate).toLocaleDateString()}
                    </span>
                  </p>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4">
                    <a
                      href={certificate.viewLink || "#"}
                      className="flex-1 inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </a>
                    <a
                      href={certificate.downloadLink || "#"}
                      className="flex-1 inline-flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-3 rounded-lg text-sm font-medium transition"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </a>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full text-center text-gray-600 dark:text-gray-400 py-10">
            <p className="text-lg font-medium">No certificates found.</p>
            <p className="text-sm">Try adjusting your filters or search query.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CertificatesView;
