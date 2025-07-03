// course-marketplace-frontend\src\StudentDashboardComponents\AssessmentsView.jsx
import React from "react";

const assessments = [
  {
    title: "Math Test",
    status: "Upcoming",
    statusColor: "from-indigo-500 to-indigo-300 dark:from-indigo-600 dark:to-indigo-400",
    bgColor: "bg-indigo-100 dark:bg-indigo-900/40",
    shadowColor: "hover:shadow-indigo-300 dark:hover:shadow-indigo-600",
    description: "A comprehensive algebra and geometry test. Duration: 30 minutes.",
    date: "2025-06-30",
    button: {
      label: "Start Test",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-6.516-3.758A1 1 0 007 8.256v7.488a1 1 0 001.236.97l6.516-1.879a1 1 0 000-1.84z" />
        </svg>
      ),
      actionColor: "bg-indigo-600 hover:bg-indigo-700 text-white",
      disabled: false,
    },
  },
  {
    title: "Science Quiz",
    status: "Completed",
    statusColor: "from-green-500 to-green-300 dark:from-green-600 dark:to-green-400",
    bgColor: "bg-green-100 dark:bg-green-900/40",
    shadowColor: "hover:shadow-green-300 dark:hover:shadow-green-600",
    description: "Quick quiz covering biology and chemistry basics.",
    date: "2025-07-05",
    button: {
      label: "Completed",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      ),
      actionColor: "bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400",
      disabled: true,
    },
  },
  {
    title: "History Assignment",
    status: "In Progress",
    statusColor: "from-yellow-400 to-yellow-300 dark:from-yellow-500 dark:to-yellow-400",
    bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
    shadowColor: "hover:shadow-yellow-300 dark:hover:shadow-yellow-500",
    description: "Essay and multiple choice questions about World War II.",
    date: "2025-07-12",
    progress: 65,
    button: {
      label: "Continue",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      ),
      actionColor: "bg-yellow-400 hover:bg-yellow-500 text-gray-900",
      disabled: false,
    },
  },
];

const AssessmentsView = () => {
  return (
    <div className="max-w-6xl mx-auto p-8 bg-white dark:bg-gray-900 rounded-3xl shadow-xl text-gray-900 dark:text-white space-y-14 transition-colors">
      <header className="flex items-center gap-4 mb-10">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 4H7a2 2 0 01-2-2V7a2 2 0 012-2h5l5 5v8a2 2 0 01-2 2z" />
        </svg>
        <h2 className="text-4xl font-extrabold tracking-tight text-indigo-700 dark:text-indigo-400">Assessments</h2>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {assessments.map((a, index) => (
          <article
            key={index}
            className={`rounded-3xl p-7 shadow-lg transform transition-all hover:-translate-y-1 flex flex-col justify-between ${a.bgColor} ${a.shadowColor}`}
          >
            <div className="mb-4">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-2xl font-bold leading-snug">{a.title}</h3>
                <span className={`inline-block rounded-full bg-gradient-to-tr ${a.statusColor} px-3 py-1 text-xs font-semibold tracking-wide text-white`}>
                  {a.status}
                </span>
              </div>

              <p className="text-gray-700 dark:text-gray-300 mb-5 leading-relaxed">{a.description}</p>

              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                <strong>Date:</strong>{" "}
                <time dateTime={a.date} className="italic">
                  {new Date(a.date).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}
                </time>
              </p>

              {a.progress !== undefined && (
                <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-3 overflow-hidden mb-2">
                  <div
                    className="bg-yellow-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${a.progress}%` }}
                    role="progressbar"
                    aria-valuenow={a.progress}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`${a.title} progress`}
                  />
                </div>
              )}
            </div>

            <button
              disabled={a.button.disabled}
              className={`mt-auto flex items-center justify-center gap-3 w-full rounded-xl py-3 font-semibold transition-transform active:scale-95 ${
                a.button.disabled ? "cursor-not-allowed select-none" : ""
              } ${a.button.actionColor}`}
              aria-label={a.button.label}
              title={a.button.disabled ? `${a.title} is completed` : a.button.label}
            >
              {a.button.label}
              {a.button.icon}
            </button>
          </article>
        ))}
      </section>
    </div>
  );
};

export default AssessmentsView;
