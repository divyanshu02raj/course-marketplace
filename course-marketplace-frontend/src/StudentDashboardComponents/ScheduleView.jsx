// StudentDashboardComponents/ScheduleView.jsx
import React from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import CalendarWidget from "react-calendar"; // Make sure you're importing the right Calendar
import "react-calendar/dist/Calendar.css";
import "../styles/CustomCalendar.css";



const ScheduleView = ({
  selectedDate,
  setSelectedDate,
  sessions,
  filteredSessions,
  sessionDates,
}) => {
  return (
    <div>
      <h2 className="text-2xl font-semibold text-indigo-300 mb-6 flex items-center gap-2">
        <CalendarIcon className="text-indigo-400" /> Schedule Overview
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-8 items-start">
        {/* Calendar */}
        <div className="w-full max-w-xl bg-white text-gray-900 p-8 rounded-3xl shadow-lg border border-gray-100">
          <CalendarWidget
            value={selectedDate}
            onChange={setSelectedDate}
            showNeighboringMonth={false}
            tileClassName={({ date }) => {
              const iso = date.toISOString().split("T")[0];
              const isToday = iso === new Date().toISOString().split("T")[0];
              const hasSession = sessionDates.includes(iso);

              return [
                isToday ? "custom-tile-today" : "",
                hasSession ? "custom-tile-session" : "",
              ].join(" ");
            }}
            tileContent={({ date }) => {
              const iso = date.toISOString().split("T")[0];
              const sessionCount = sessions.filter((s) => s.date === iso).length;

              return sessionCount > 0 ? <div className="custom-tile-dot" /> : null;
            }}
            next2Label={null}
            prev2Label={null}
          />
        </div>

        {/* Sessions */}
        <div className="space-y-4">
          {filteredSessions.length > 0 ? (
            filteredSessions.map((session, idx) => (
              <div
                key={idx}
                className="bg-gray-800 p-5 rounded-2xl border border-gray-700 shadow hover:shadow-lg transition-all"
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold text-white">
                    {session.course}
                  </h3>
                  <span className="text-xs px-2 py-1 border rounded-full text-indigo-400 border-indigo-500">
                    {session.date}
                  </span>
                </div>
                <p className="text-sm text-gray-400">⏰ {session.time}</p>
                <p className="text-sm text-gray-400">👨‍🏫 {session.instructor}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 italic">No sessions on this day.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScheduleView;
