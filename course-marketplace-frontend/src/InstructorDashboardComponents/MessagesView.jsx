// course-marketplace-frontend\src\InstructorDashboardComponents\MessagesView.jsx
import React, { useState } from "react";
import { MessageSquare } from "lucide-react";

const dummyMessages = [
  {
    id: 1,
    sender: "John Doe",
    subject: "Question about Course 101",
    timestamp: "2025-06-28 10:30 AM",
    read: false,
    thread: [
      { fromMe: false, text: "Hello, I have a question regarding Course 101. Could you clarify the assignment?" },
      { fromMe: true, text: "Sure, John! The assignment is to review chapter 3 and submit your responses by next Friday." }
    ]
  },
  {
    id: 2,
    sender: "Jane Smith",
    subject: "Feedback on the latest course update",
    timestamp: "2025-06-28 12:00 PM",
    read: true,
    thread: [
      { fromMe: false, text: "I just reviewed the latest course update. The new section is very helpful!" },
      { fromMe: true, text: "Thank you for the feedback, Jane! I'm glad you found it useful." }
    ]
  },
  {
    id: 3,
    sender: "Alice Johnson",
    subject: "Issue with Assignment 2",
    timestamp: "2025-06-27 4:15 PM",
    read: false,
    thread: [
      { fromMe: false, text: "I'm having trouble with Assignment 2. Could you provide some guidance?" },
      { fromMe: true, text: "Hi Alice! Sure, I will be available after 2 PM today to help you. Let me know when works for you." }
    ]
  }
];

export default function InstructorMessagesView() {
  const [selectedMessage, setSelectedMessage] = useState(null);

  return (
    <div className="w-full px-4 sm:px-6 lg:px-12 py-8">
      <h2 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-8 flex items-center gap-2">
        <MessageSquare className="w-6 h-6" /> Student Messages
      </h2>

      <div className="flex flex-col lg:flex-row gap-6 h-[80vh]">
        {/* Inbox */}
        <div className="w-full lg:w-1/3 overflow-y-auto bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 shadow">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Inbox</h3>
          <div className="space-y-3">
            {dummyMessages.map((msg) => (
              <div
                key={msg.id}
                onClick={() => setSelectedMessage(msg)}
                className={`cursor-pointer p-4 rounded-lg transition border ${
                  selectedMessage?.id === msg.id
                    ? "bg-indigo-100 dark:bg-indigo-700 border-indigo-500"
                    : msg.read
                    ? "bg-gray-50 dark:bg-gray-800 border-transparent"
                    : "bg-gray-100 dark:bg-gray-800 border-indigo-300"
                } hover:bg-gray-200 dark:hover:bg-gray-700`}
              >
                <h4 className="font-medium text-gray-900 dark:text-white truncate">{msg.subject}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{msg.sender}</p>
                <p className="text-xs text-gray-500 mt-1">{msg.timestamp}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Message View */}
        <div className="w-full lg:w-2/3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow flex flex-col">
          {selectedMessage ? (
            <>
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold">
                    {selectedMessage.sender[0]}
                  </div>
                  <div>
                    <h4 className="text-base font-semibold text-gray-900 dark:text-white">{selectedMessage.subject}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">From: {selectedMessage.sender}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedMessage(null)} className="text-gray-500 hover:text-red-500 text-sm">
                  ✕
                </button>
              </div>

              {/* Message Thread */}
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                {selectedMessage.thread.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.fromMe ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[75%] px-4 py-3 text-sm rounded-2xl shadow leading-relaxed ${
                        msg.fromMe
                          ? "bg-indigo-600 text-white rounded-br-none"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-none"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Reply Bar */}
              <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center gap-3">
                <button className="text-gray-400 dark:text-gray-300 hover:text-indigo-500">📎</button>
                <input
                  type="text"
                  placeholder="Reply to student..."
                  className="flex-grow p-3 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl">
                  Send
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400 italic">
              Select a message to view
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
