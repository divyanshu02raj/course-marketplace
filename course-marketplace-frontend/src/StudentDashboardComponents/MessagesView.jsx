// course-marketplace-frontend\src\StudentDashboardComponents\MessagesView.jsx
import React, { useState } from "react";
import { MessageSquare, Paperclip, Send, X } from "lucide-react";

const InboxItem = ({ msg, isSelected, onSelect }) => (
  <button
    onClick={onSelect}
    className={`w-full text-left p-4 rounded-xl transition-all border ${
      isSelected
        ? "bg-indigo-100 dark:bg-indigo-700 border-indigo-500"
        : "bg-gray-50 dark:bg-gray-800 border-transparent"
    } hover:bg-gray-200 dark:hover:bg-gray-700`}
  >
    <div className="font-medium text-gray-900 dark:text-white truncate">{msg.subject}</div>
    <div className="text-sm text-gray-600 dark:text-gray-400 truncate">{msg.sender}</div>
    <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">{msg.timestamp}</div>
  </button>
);

const ChatBubble = ({ msg }) => (
  <div className={`flex ${msg.fromMe ? "justify-end" : "justify-start"}`}>
    <div
      className={`max-w-[75%] px-4 py-3 text-sm rounded-2xl shadow ${
        msg.fromMe
          ? "bg-indigo-600 text-white rounded-br-none"
          : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-none"
      }`}
    >
      <p>{msg.text}</p>
      <div className="mt-1 text-xs text-right text-white/70 dark:text-gray-400">
        {msg.timestamp}
      </div>
    </div>
  </div>
);

const MessagesView = ({ messages = [], selectedMessage, setSelectedMessage }) => {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    // Normally, update logic goes here
    setInput("");
  };

  return (
    <div className="relative h-full">
      <div className="mb-6 flex items-center gap-2 text-2xl font-semibold text-gray-900 dark:text-indigo-300">
        <MessageSquare className="text-indigo-600 dark:text-indigo-400" />
        Messages
      </div>

      <div className="flex flex-col lg:flex-row gap-6 h-[80vh]">
        {/* Inbox Column */}
        <div className="w-full lg:w-1/3 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-y-auto p-4 space-y-3 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Inbox</h3>
          {messages.length ? (
            messages.map((msg) => (
              <InboxItem
                key={msg.id}
                msg={msg}
                isSelected={selectedMessage?.id === msg.id}
                onSelect={() => setSelectedMessage(msg)}
              />
            ))
          ) : (
            <p className="italic text-gray-500 dark:text-gray-400 text-sm">No messages yet.</p>
          )}
        </div>

        {/* Chat Column */}
        <div className="w-full lg:w-2/3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-md flex flex-col">
          {selectedMessage ? (
            <>
              {/* Chat Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 rounded-t-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold uppercase">
                    {selectedMessage.sender?.charAt(0) || "?"}
                  </div>
                  <div>
                    <div className="text-base font-semibold text-gray-900 dark:text-white">
                      {selectedMessage.subject}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedMessage.sender}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                >
                  <X />
                </button>
              </div>

              {/* Chat Body */}
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 bg-gray-50 dark:bg-gray-800">
                {selectedMessage.thread?.length ? (
                  selectedMessage.thread.map((msg, idx) => <ChatBubble key={idx} msg={msg} />)
                ) : (
                  <p className="text-center italic text-gray-500 dark:text-gray-400">
                    No conversation yet.
                  </p>
                )}
              </div>

              {/* Chat Footer */}
              <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-b-2xl flex items-center gap-3">
                <button className="text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-white">
                  <Paperclip />
                </button>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Type a message..."
                  className="flex-1 p-3 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none"
                />
                <button
                  onClick={handleSend}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center text-gray-400 italic">
              Select a message to start chatting
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagesView;
