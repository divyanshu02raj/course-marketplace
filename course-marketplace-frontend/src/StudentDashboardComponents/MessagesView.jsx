import React from "react";
import { MessageSquare } from "lucide-react";

const MessagesView = ({ messages, selectedMessage, setSelectedMessage }) => {
  return (
    <div className="relative h-full">
      <h2 className="text-2xl font-semibold text-indigo-300 mb-6 flex items-center gap-2">
        <MessageSquare className="text-indigo-400" /> Messages
      </h2>

      <div className="flex flex-col lg:flex-row gap-6 h-[80vh]">
        {/* Inbox */}
        <div className="bg-gray-800 rounded-2xl p-4 shadow w-full lg:w-1/3 overflow-y-auto">
          <h3 className="text-white text-lg font-semibold mb-4">Inbox</h3>
          <div className="space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                onClick={() => setSelectedMessage(msg)}
                className={`cursor-pointer p-4 rounded-xl transition-all border ${
                  selectedMessage?.id === msg.id
                    ? "bg-indigo-700 border-indigo-500"
                    : msg.read
                    ? "bg-gray-700 border-transparent"
                    : "bg-gray-700 border-indigo-300"
                } hover:bg-gray-600`}
              >
                <h4 className="text-white font-medium truncate">{msg.subject}</h4>
                <p className="text-gray-400 text-sm truncate">{msg.sender}</p>
                <p className="text-xs text-gray-500 mt-1">{msg.timestamp}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="bg-gray-900 rounded-2xl shadow-md flex flex-col w-full lg:w-2/3">
          {selectedMessage ? (
            <>
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 bg-gray-800 rounded-t-2xl shadow-lg border border-gray-700">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">
                    {selectedMessage.sender[0]}
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white">{selectedMessage.subject}</h4>
                    <p className="text-sm text-gray-400">{selectedMessage.sender}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="text-gray-400 hover:text-white text-sm"
                >
                  ✕
                </button>
              </div>

              {/* Message Thread */}
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 bg-gray-800 rounded-b-2xl">
                {selectedMessage.thread.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.fromMe ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow ${
                        msg.fromMe
                          ? "bg-indigo-600 text-white rounded-br-none"
                          : "bg-gray-700 text-gray-100 rounded-bl-none"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Reply Bar */}
              <div className="border-t border-gray-700 px-4 py-3 bg-gray-800 rounded-b-2xl shadow-lg flex items-center gap-3">
                <button className="text-gray-400 hover:text-white flex-shrink-0">📎</button>
                <input
                  type="text"
                  placeholder="Type your message..."
                  className="flex-grow bg-gray-700 text-white p-3 rounded-xl focus:outline-none min-w-0"
                />
                <button className="bg-indigo-600 text-white px-5 py-2 rounded-xl hover:bg-indigo-700 flex-shrink-0">
                  Send
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500 italic">
              Select a message to view
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagesView;
