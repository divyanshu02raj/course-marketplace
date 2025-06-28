// /InstructorDashboardComponents/EarningsView.jsx
import React from 'react';
import { DollarSign, ArrowUpRight } from 'lucide-react';

// Dummy data
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
    <div className="space-y-8">
      {/* Total Earnings */}
      <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
        <h2 className="text-xl font-semibold text-indigo-300 mb-4">Total Earnings</h2>
        <div className="flex items-center gap-4">
          <DollarSign className="text-indigo-400" size={32} />
          <div>
            <p className="text-3xl font-bold text-white">${totalEarnings}</p>
            <p className="text-sm text-gray-400">Total earnings for this period</p>
          </div>
        </div>
      </div>

      {/* Earnings Breakdown */}
      <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
        <h2 className="text-xl font-semibold text-indigo-300 mb-4">Earnings by Course</h2>
        <div className="space-y-4">
          {earningsData.map((course) => (
            <div key={course.courseName} className="flex justify-between items-center text-white">
              <div className="flex items-center gap-3">
                <ArrowUpRight className="text-indigo-400" />
                <span className="font-medium">{course.courseName}</span>
              </div>
              <span className="text-indigo-500 font-bold">${course.earnings}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
        <h2 className="text-xl font-semibold text-indigo-300 mb-4">Recent Transactions</h2>
        <table className="w-full text-sm text-left text-gray-400">
          <thead>
            <tr>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Amount</th>
              <th className="px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {recentTransactions.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-gray-700">
                <td className="px-4 py-2">{transaction.date}</td>
                <td className="px-4 py-2">${transaction.amount}</td>
                <td className="px-4 py-2">{transaction.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Optional: Earnings Trend (Chart) */}
      {/* You can add a line graph or bar chart here */}
      {/* Example using chart libraries like Chart.js or Recharts */}
    </div>
  );
};

export default EarningsView;
