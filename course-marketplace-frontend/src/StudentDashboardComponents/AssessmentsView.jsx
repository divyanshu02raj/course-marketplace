import React from "react";

const AssessmentsView = () => {
  return (
    <div className="max-w-6xl mx-auto p-8 bg-gray-900 rounded-3xl shadow-xl text-white space-y-14">
      <header className="flex items-center gap-4 mb-10">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 text-indigo-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12h6m-6 4h6m2 4H7a2 2 0 01-2-2V7a2 2 0 012-2h5l5 5v8a2 2 0 01-2 2z"
          />
        </svg>
        <h2 className="text-4xl font-extrabold tracking-tight text-indigo-400">Assessments</h2>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {/* Assessment Card Template */}
        <article className="bg-gray-800 rounded-3xl p-7 shadow-lg hover:shadow-indigo-600 transition-shadow transform hover:-translate-y-1">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-2xl font-bold leading-snug text-white">Math Test</h3>
            <span className="inline-block rounded-full bg-gradient-to-tr from-indigo-600 to-indigo-400 px-3 py-1 text-xs font-semibold tracking-wide text-white select-none">
              Upcoming
            </span>
          </div>
          <p className="text-gray-400 mb-5 leading-relaxed">
            A comprehensive algebra and geometry test. Duration: 30 minutes.
          </p>
          <p className="text-sm text-gray-500 mb-5">
            <strong>Date:</strong>{" "}
            <time dateTime="2025-06-30" className="italic">
              June 30, 2025
            </time>
          </p>

          <button
            className="flex items-center justify-center gap-3 w-full rounded-xl bg-indigo-600 py-3 font-semibold text-white hover:bg-indigo-700 active:scale-95 transition-transform"
            aria-label="Start Math Test"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.752 11.168l-6.516-3.758A1 1 0 007 8.256v7.488a1 1 0 001.236.97l6.516-1.879a1 1 0 000-1.84z"
              />
            </svg>
            Start Test
          </button>
        </article>

        <article className="bg-gray-800 rounded-3xl p-7 shadow-lg hover:shadow-green-600 transition-shadow transform hover:-translate-y-1">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-2xl font-bold leading-snug text-white">Science Quiz</h3>
            <span className="inline-block rounded-full bg-gradient-to-tr from-green-600 to-green-400 px-3 py-1 text-xs font-semibold tracking-wide text-white select-none">
              Completed
            </span>
          </div>
          <p className="text-gray-400 mb-5 leading-relaxed">
            Quick quiz covering biology and chemistry basics.
          </p>
          <p className="text-sm text-gray-500 mb-5">
            <strong>Date:</strong>{" "}
            <time dateTime="2025-07-05" className="italic">
              July 5, 2025
            </time>
          </p>

          <button
            disabled
            className="flex items-center justify-center gap-3 w-full rounded-xl bg-gray-700 py-3 font-semibold text-gray-400 cursor-not-allowed select-none"
            aria-label="Science Quiz Completed"
            title="You have completed this quiz"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            Completed
          </button>
        </article>

        <article className="bg-gray-800 rounded-3xl p-7 shadow-lg hover:shadow-yellow-500 transition-shadow transform hover:-translate-y-1 flex flex-col justify-between">
          <div className="mb-4">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-2xl font-bold leading-snug text-white">History Assignment</h3>
              <span className="inline-block rounded-full bg-gradient-to-tr from-yellow-500 to-yellow-400 px-3 py-1 text-xs font-semibold tracking-wide text-gray-900 select-none">
                In Progress
              </span>
            </div>
            <p className="text-gray-400 mb-5 leading-relaxed">
              Essay and multiple choice questions about World War II.
            </p>
            <p className="text-sm text-gray-500 mb-4">
              <strong>Date:</strong>{" "}
              <time dateTime="2025-07-12" className="italic">
                July 12, 2025
              </time>
            </p>
            {/* Progress bar */}
            <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
              <div
                className="bg-yellow-400 h-3 rounded-full transition-all duration-500"
                style={{ width: "65%" }}
                aria-valuenow={65}
                aria-valuemin={0}
                aria-valuemax={100}
                role="progressbar"
                aria-label="History Assignment progress"
              />
            </div>
          </div>

          <button
            className="mt-auto flex items-center justify-center gap-3 w-full rounded-xl bg-yellow-500 text-gray-900 py-3 font-semibold hover:bg-yellow-600 active:scale-95 transition-transform"
            aria-label="Continue History Assignment"
          >
            Continue
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </article>
      </section>
    </div>
  );
};

export default AssessmentsView;
