// StudentDashboardComponents/CertificatesView.jsx
import React, { useState } from "react";

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

  return (
    <div className="space-y-8">
      {/* Filters */}
      <div className="flex gap-6 mb-6">
        {/* Search input */}
        <div className="flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search by course name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Filter dropdown */}
        <select
          value={certificateFilter}
          onChange={(e) => setCertificateFilter(e.target.value)}
          className="p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">All Certificates</option>
          <option value="active">Active Certificates</option>
          <option value="expired">Expired Certificates</option>
        </select>
      </div>

      {/* Certificate Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredCertificates.length > 0 ? (
          filteredCertificates.map((certificate, idx) => {
            const isCompleted = certificate.status === "completed";

            return (
              <div
                key={idx}
                className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-lg hover:shadow-xl transition-all"
              >
                {/* Certificate Thumbnail */}
                <img
                  src={
                    certificate.thumbnail ||
                    "https://via.placeholder.com/150?text=Course+Name"
                  }
                  alt={certificate.name}
                  className="w-full h-32 object-cover rounded-xl mb-4"
                />

                {/* Course Name */}
                <h3 className="text-lg font-semibold text-white mb-2">
                  {certificate.name}
                </h3>

                {/* Completion Date */}
                <p className="text-sm text-gray-400 mb-2">
                  Completed on:{" "}
                  {new Date(certificate.completionDate).toLocaleDateString()}
                </p>

                {/* Certificate Status */}
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    isCompleted
                      ? "text-green-400 bg-green-900"
                      : "text-yellow-400 bg-yellow-900"
                  } mb-4 block`}
                >
                  {isCompleted ? "Completed" : "In Progress"}
                </span>

                {/* Download/View Certificate */}
                <div className="flex gap-4 mt-4">
                  <a
                    href={certificate.viewLink || "#"}
                    className="block py-2 px-4 bg-indigo-600 text-white rounded-full text-center hover:bg-indigo-500 transition-colors w-full"
                  >
                    View Certificate
                  </a>
                  <a
                    href={certificate.downloadLink || "#"}
                    className="block py-2 px-4 bg-indigo-500 text-white rounded-full text-center hover:bg-indigo-400 transition-colors w-full"
                  >
                    Download
                  </a>
                </div>

                {/* Expiry Date */}
                <p className="text-xs text-gray-400 mt-4">
                  Expires on:{" "}
                  {new Date(certificate.expiryDate).toLocaleDateString()}
                </p>
              </div>
            );
          })
        ) : (
          <p className="text-gray-400 italic">No certificates found.</p>
        )}
      </div>
    </div>
  );
};

export default CertificatesView;
