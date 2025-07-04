import React from 'react';
import { DollarSign, ArrowUpRight } from 'lucide-react';

const earningsData = [
  { courseName: 'React Basics', earnings: 450 },
  { courseName: 'Advanced JavaScript', earnings: 300 },
  { courseName: 'UI/UX Design for Developers', earnings: 200 },
  { courseName: 'Node.js Mastery', earnings: 500 },
];

const recentTransactions = [
  { id: 1, amount: 500, date: '2025-06-25', status: 'Completed' },
  { id: 2, amount: 300, date: '2025-06-20', status: 'Completed' },
  { id: 3, amount: 150, date: '2025-06-18', status: 'Pending' },
];

const EarningsView = () => {
  const totalEarnings = earningsData.reduce((total, course) => total + course.earnings, 0);

  return (
    <div className="w-full px-4 sm:px-6 lg:px-12 py-8 space-y-10 text-gray-900 dark:text-white">
      <div className="mb-8">
  <h2 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
    <DollarSign className="w-6 h-6" /> Instructor Earnings
  </h2>
  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
    Overview of your course earnings and recent transactions.
  </p>
</div>
      {/* Total Earnings */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-2xl shadow-sm">
        <h2 className="text-xl font-semibold text-indigo-600 dark:text-indigo-400 mb-4">Total Earnings</h2>
        <div className="flex items-center gap-4">
          <DollarSign className="text-indigo-500 dark:text-indigo-400" size={32} />
          <div>
            <p className="text-3xl font-bold">${totalEarnings}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total earnings for this period</p>
          </div>
        </div>
      </div>

      {/* Earnings by Course */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-2xl shadow-sm">
        <h2 className="text-xl font-semibold text-indigo-600 dark:text-indigo-400 mb-4">Earnings by Course</h2>
        <div className="space-y-4">
          {earningsData.map((course) => (
            <div
              key={course.courseName}
              className="flex justify-between items-center text-gray-800 dark:text-gray-100"
            >
              <div className="flex items-center gap-3">
                <ArrowUpRight className="text-indigo-500 dark:text-indigo-400" />
                <span className="font-medium">{course.courseName}</span>
              </div>
              <span className="text-indigo-600 dark:text-indigo-400 font-bold">${course.earnings}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-2xl shadow-sm">
        <h2 className="text-xl font-semibold text-indigo-600 dark:text-indigo-400 mb-4">Recent Transactions</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
              <tr>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Amount</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentTransactions.map((transaction, index) => (
                <tr
                  key={transaction.id}
                  className={`border-t border-gray-200 dark:border-gray-700 ${
                    index % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800'
                  } hover:bg-gray-100 dark:hover:bg-gray-700 transition`}
                >
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{transaction.date}</td>
                  <td className="px-4 py-3 text-gray-800 dark:text-white">${transaction.amount}</td>
                  <td
                    className={`px-4 py-3 font-medium ${
                      transaction.status === 'Completed'
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-yellow-600 dark:text-yellow-400'
                    }`}
                  >
                    {transaction.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Optional: Placeholder for a chart */}
      {/* You can integrate Chart.js, Recharts, or ApexCharts here */}
    </div>
  );
};

export default EarningsView;
