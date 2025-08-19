// course-marketplace-frontend/src/StudentDashboardComponents/MessagesView.jsx
import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "../api/axios";
import toast from "react-hot-toast";
import { MessageSquare, Send, Plus, ArrowLeft, Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import NewMessageModal from "./NewMessageModal";

// --- Helper function to format timestamps ---
const formatTimestamp = (timestamp) => {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

// --- Avatar Component ---
const Avatar = ({ user }) => {
  if (user?.profileImage) {
    return (
      <img
        src={user.profileImage}
        alt={user.name}
        className="w-8 h-8 rounded-full"
      />
    );
  }
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "?";
  return (
    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-400 text-white text-sm font-bold">
      {initials}
    </div>
  );
};

// --- Direct Messages View ---
const DirectMessagesView = ({ openChatId }) => {
  const { user } = useAuth();
  const socket = useSocket();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Add user to socket session
  useEffect(() => {
    if (socket && user?._id) {
      socket.emit("addUser", user._id);
    }
  }, [socket, user]);

  // Handle new messages in real-time
  useEffect(() => {
    if (!socket) return;
    const handleNewMessage = (message) => {
      setConversations((prevConvos) => {
        const updatedList = prevConvos.map((convo) => {
          if (convo._id === message.conversation) {
            return {
              ...convo,
              lastMessage: {
                text: message.text,
                timestamp: message.createdAt,
              },
            };
          }
          return convo;
        });
        return updatedList.sort(
          (a, b) =>
            new Date(b.lastMessage?.timestamp) -
            new Date(a.lastMessage?.timestamp)
        );
      });

      if (message.conversation === selectedConversation?._id) {
        setMessages((prev) => [...prev, message]);
      }
    };
    socket.on("newMessage", handleNewMessage);
    return () => socket.off("newMessage", handleNewMessage);
  }, [socket, selectedConversation]);

  const selectConversation = useCallback(
    async (conversation) => {
      if (!conversation) {
        setSelectedConversation(null);
        setMessages([]);
        return;
      }
      if (selectedConversation?._id === conversation._id) return;

      setSelectedConversation(conversation);
      try {
        const res = await axios.get(`/messages/${conversation._id}`);
        setMessages(res.data);
      } catch {
        toast.error("Failed to load messages.");
      }
    },
    [selectedConversation]
  );

  useEffect(() => {
    const fetchConversations = async () => {
      setLoading(true);
      try {
        const res = await axios.get("/messages");
        const convos = res.data;
        setConversations(convos);
        if (socket && convos.length > 0) {
          convos.forEach((convo) =>
            socket.emit("joinConversation", { conversationId: convo._id })
          );
        }
        if (openChatId) {
          const targetConvo = convos.find((c) => c._id === openChatId);
          if (targetConvo) selectConversation(targetConvo);
        }
      } catch {
        toast.error("Failed to load conversations.");
      } finally {
        setLoading(false);
      }
    };
    fetchConversations();
  }, [openChatId, selectConversation, socket]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    const recipient = selectedConversation.participants.find(
      (p) => p._id !== user._id
    );
    const tempMessageId = Date.now();
    const sentMessage = {
      _id: tempMessageId,
      sender: { _id: user._id, name: user.name, profileImage: user.profileImage },
      text: newMessage,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, sentMessage]);
    setNewMessage("");
    setSending(true);

    try {
      const res = await axios.post("/messages", {
        recipientId: recipient._id,
        text: newMessage,
      });
      setMessages((prev) =>
        prev.map((m) => (m._id === tempMessageId ? res.data : m))
      );
    } catch {
      toast.error("Failed to send message.");
      setMessages((prev) => prev.filter((m) => m._id !== tempMessageId));
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-16rem)] bg-white dark:bg-gray-900 border rounded-2xl shadow-lg overflow-hidden">
      {/* Conversations list */}
      <aside className="hidden md:flex md:w-1/3 border-r border-gray-200 dark:border-gray-800 flex-col">
        <div className="p-4 border-b dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            Chats
          </h2>
        </div>
        <div className="overflow-y-auto flex-grow">
          {conversations.map((convo) => {
            const otherParticipant = convo.participants.find(
              (p) => p._id !== user._id
            );
            return (
              <button
                key={convo._id}
                onClick={() => selectConversation(convo)}
                className={`w-full text-left p-4 flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition ${
                  selectedConversation?._id === convo._id
                    ? "bg-indigo-50 dark:bg-indigo-900/50"
                    : ""
                }`}
              >
                <Avatar user={otherParticipant} />
                <div className="flex-grow truncate">
                  <p className="font-semibold text-gray-800 dark:text-gray-200">
                    {otherParticipant?.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {convo.lastMessage?.text}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </aside>

      {/* Chat area */}
      <main className="flex flex-col flex-grow">
        {selectedConversation ? (
          <>
            {/* Header */}
            <div className="p-4 border-b dark:border-gray-700 flex items-center gap-3 bg-gray-50 dark:bg-gray-800">
              <button
                onClick={() => setSelectedConversation(null)}
                className="md:hidden p-2 text-gray-500 hover:text-gray-800 dark:hover:text-white"
              >
                <ArrowLeft size={20} />
              </button>
              <Avatar
                user={selectedConversation.participants.find(
                  (p) => p._id !== user._id
                )}
              />
              <h3 className="font-semibold text-gray-800 dark:text-white">
                {
                  selectedConversation.participants.find(
                    (p) => p._id !== user._id
                  )?.name
                }
              </h3>
            </div>

            {/* Messages */}
            <div className="flex-grow overflow-y-auto p-6 space-y-4">
              {user?._id &&
                messages.map((msg) => {
                  const senderId =
                    typeof msg.sender === "object" ? msg.sender._id : msg.sender;
                  const isOwnMessage = senderId === user._id;
                  const sender =
                    typeof msg.sender === "object" ? msg.sender : null;

                  return (
                    <div
                      key={msg._id}
                      className={`flex items-end gap-2 ${
                        isOwnMessage ? "justify-end" : "justify-start"
                      }`}
                    >
                      {!isOwnMessage && <Avatar user={sender} />}
                      <div
                        className={`max-w-xs lg:max-w-md p-3 rounded-2xl shadow ${
                          isOwnMessage
                            ? "bg-indigo-600 text-white rounded-br-none"
                            : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-none"
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{msg.text}</p>
                        <p className="text-xs mt-1 opacity-70 text-right">
                          {formatTimestamp(msg.createdAt)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form
              onSubmit={handleSendMessage}
              className="p-4 border-t dark:border-gray-700 flex items-center gap-2 bg-white dark:bg-gray-900"
            >
              <textarea
                rows={1}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(e);
                  }
                }}
                placeholder="Type a message..."
                className="flex-grow p-3 bg-gray-100 dark:bg-gray-800 border border-transparent rounded-xl resize-none focus:ring-2 focus:ring-indigo-500 outline-none transition"
              />
              <button
                type="submit"
                disabled={!newMessage.trim() || sending}
                className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sending ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <Send size={20} />
                )}
              </button>
            </form>
          </>
        ) : (
          <div className="flex-grow flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
            <MessageSquare size={48} className="mb-4" />
            <h3 className="text-xl font-semibold">Select a conversation</h3>
            <p>Chat directly with your instructors.</p>
          </div>
        )}
      </main>
    </div>
  );
};

// --- Main MessagesView Component ---
export default function MessagesView({ openChatId: initialOpenChatId }) {
  const [isNewMessageModalOpen, setIsNewMessageModalOpen] = useState(false);
  const [newlyOpenedChatId, setNewlyOpenedChatId] = useState(null);
  const socket = useSocket();

  const handleConversationReady = (conversation) => {
    if (conversation && conversation._id) {
      if (socket) {
        socket.emit("joinConversation", { conversationId: conversation._id });
      }
      setNewlyOpenedChatId(conversation._id);
    }
    setIsNewMessageModalOpen(false);
  };

  const finalOpenChatId = newlyOpenedChatId || initialOpenChatId;

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
          Direct Messages
        </h2>
        <button
          onClick={() => setIsNewMessageModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-semibold text-sm rounded-lg hover:bg-indigo-700 transition"
        >
          <Plus size={16} /> New Message
        </button>
      </div>

      <DirectMessagesView openChatId={finalOpenChatId} />

      <NewMessageModal
        isOpen={isNewMessageModalOpen}
        onClose={() => setIsNewMessageModalOpen(false)}
        onConversationReady={handleConversationReady}
      />
    </div>
  );
}
