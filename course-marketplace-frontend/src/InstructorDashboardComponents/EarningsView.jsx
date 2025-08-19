import React, { useState, useEffect } from "react";
import axios from "../api/axios";
import toast from "react-hot-toast";
import { DollarSign, Users } from "lucide-react";

export default function EarningsView() {
  const [earningsData, setEarningsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        const res = await axios.get("/earnings");
        setEarningsData(res.data);
      } catch (error) {
        toast.error("Could not load earnings data.");
        console.error("Fetch earnings error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEarnings();
  }, []);

  if (loading) {
    return (
      <div className="text-center p-8 text-gray-500 dark:text-gray-400">
        Loading earnings data...
      </div>
    );
  }

  if (!earningsData) {
    return (
      <div className="text-center p-8 text-red-500 dark:text-red-400">
        Could not display earnings data.
      </div>
    );
  }

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);

  const stats = [
    {
      label: "Net Earnings",
      value: formatCurrency(earningsData.netEarnings),
      icon: <DollarSign className="w-6 h-6" />,
      color: "text-indigo-500",
    },
    {
      label: "Total Enrollments",
      value: earningsData.totalEnrollments,
      icon: <Users className="w-6 h-6" />,
      color: "text-blue-500",
    },
  ];

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
          Earnings Overview
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Track your course sales and net revenue.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-800 hover:shadow-lg hover:-translate-y-1 transition-all"
          >
            <div className="flex items-center gap-4">
              <div
                className={`p-3 bg-gray-100 dark:bg-gray-800 rounded-full ${stat.color}`}
              >
                {stat.icon}
              </div>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {stat.label}
              </span>
            </div>
            <p className="text-4xl font-bold text-gray-800 dark:text-white mt-4">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Recent Transactions */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-800">
        <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-5">
          Recent Transactions
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">Course</th>
                <th scope="col" className="px-6 py-3">Student</th>
                <th scope="col" className="px-6 py-3">Date</th>
                <th scope="col" className="px-6 py-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {earningsData.transactions.map((t) => (
                <tr
                  key={t._id}
                  className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {t.course?.title || (
                      <span className="text-gray-400 italic">
                        Course not available
                      </span>
                    )}
                  </th>
                  <td className="px-6 py-4">
                    {t.student?.name || (
                      <span className="text-gray-400 italic">
                        Student not available
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {new Date(t.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right font-semibold text-green-600 dark:text-green-400">
                    {formatCurrency(t.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
