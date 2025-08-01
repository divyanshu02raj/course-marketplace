// src/InstructorDashboardComponents/MessagesView.jsx
import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "../api/axios";
import toast from "react-hot-toast";
import { MessageSquare, HelpCircle, Send } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext"; // 1. Import the socket hook
import { motion, AnimatePresence } from 'framer-motion';

// --- Direct Messages Tab Component ---
const DirectMessagesView = ({ openChatId }) => {
    const { user } = useAuth();
    const socket = useSocket(); // 2. Get the socket instance
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // ✅ 3. This is the corrected real-time listener.
    const selectedConversationRef = useRef(selectedConversation);
    useEffect(() => {
        selectedConversationRef.current = selectedConversation;
    }, [selectedConversation]);

    useEffect(() => {
        if (socket) {
            const handleNewMessage = (message) => {
                const currentConvo = selectedConversationRef.current;
                if (currentConvo && message.conversation === currentConvo._id) {
                    setMessages(prev => [...prev, message]);
                }
                setConversations(prevConvos => {
                    return prevConvos.map(convo => {
                        if (convo._id === message.conversation) {
                            return { ...convo, lastMessage: { text: message.text, timestamp: message.createdAt } };
                        }
                        return convo;
                    }).sort((a, b) => new Date(b.lastMessage.timestamp) - new Date(a.lastMessage.timestamp));
                });
            };

            socket.on("newMessage", handleNewMessage);

            return () => {
                socket.off("newMessage", handleNewMessage);
            };
        }
    }, [socket]);

    const selectConversation = useCallback(async (conversation) => {
        if (!conversation || selectedConversation?._id === conversation._id) return;
        
        setSelectedConversation(conversation);
        try {
            const res = await axios.get(`/messages/${conversation._id}`);
            setMessages(res.data);
        } catch (error) {
            toast.error("Failed to load messages.");
        }
    }, [selectedConversation]);

    useEffect(() => {
        const fetchConversationsAndSelect = async () => {
            setLoading(true);
            try {
                const res = await axios.get('/messages');
                const convos = res.data;
                setConversations(convos);

                if (openChatId) {
                    const targetConvo = convos.find(c => c._id === openChatId);
                    if (targetConvo) {
                        selectConversation(targetConvo);
                    }
                }
            } catch (error) {
                toast.error("Failed to load conversations.");
            } finally {
                setLoading(false);
            }
        };
        fetchConversationsAndSelect();
    }, [openChatId, selectConversation]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedConversation) return;

        const recipient = selectedConversation.participants.find(p => p._id !== user.id);
        if (!recipient) return toast.error("Recipient not found.");
        
        const tempMessageId = Date.now();
        const sentMessage = { 
            _id: tempMessageId, 
            sender: { _id: user.id, name: user.name, profileImage: user.profileImage }, 
            text: newMessage, 
            createdAt: new Date().toISOString() 
        };
        setMessages(prev => [...prev, sentMessage]);
        setNewMessage('');

        try {
            const res = await axios.post('/messages', { recipientId: recipient._id, text: newMessage });
            setMessages(prev => prev.map(m => m._id === tempMessageId ? res.data : m));
        } catch (error) {
            toast.error("Failed to send message.");
            setMessages(prev => prev.filter(m => m._id !== tempMessageId));
        }
    };
    
    if (loading) {
        return <div className="text-center p-8 text-gray-500 dark:text-gray-400">Loading messages...</div>;
    }

    return (
        <div className="h-[calc(100vh-16rem)] flex bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-lg overflow-hidden">
            {/* Conversation List */}
            <aside className="w-1/3 border-r border-gray-200 dark:border-gray-800 flex flex-col">
                <div className="p-4 border-b border-gray-200 dark:border-gray-800">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">Chats</h2>
                </div>
                <div className="overflow-y-auto flex-grow">
                    {conversations.map(convo => {
                        const otherParticipant = convo.participants.find(p => p._id !== user.id);
                        if (!otherParticipant) return null;
                        return (
                            <button key={convo._id} onClick={() => selectConversation(convo)} className={`w-full text-left p-4 flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${selectedConversation?._id === convo._id ? 'bg-indigo-50 dark:bg-indigo-900/50' : ''}`}>
                                <img src={otherParticipant.profileImage || `https://i.pravatar.cc/40?u=${otherParticipant._id}`} alt="avatar" className="w-10 h-10 rounded-full"/>
                                <div className="flex-grow truncate">
                                    <p className="font-semibold text-gray-800 dark:text-gray-200">{otherParticipant.name}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{convo.lastMessage?.text}</p>
                                </div>
                            </button>
                        )
                    })}
                </div>
            </aside>

            {/* Message Area */}
            <main className="w-2/3 flex flex-col bg-gray-50 dark:bg-gray-800/50">
                <AnimatePresence mode="wait">
                    {selectedConversation ? (
                        <motion.div key={selectedConversation._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col h-full">
                            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center gap-3 bg-white dark:bg-gray-900">
                                <img src={selectedConversation.participants.find(p => p._id !== user.id)?.profileImage || `https://i.pravatar.cc/40?u=${selectedConversation.participants.find(p => p._id !== user.id)?._id}`} alt="avatar" className="w-10 h-10 rounded-full"/>
                                <h3 className="font-bold text-gray-800 dark:text-white">{selectedConversation.participants.find(p => p._id !== user.id)?.name}</h3>
                            </div>
                            <div className="flex-grow overflow-y-auto p-6 space-y-4">
                                {messages.map(msg => (
                                    <div key={msg._id} className={`flex items-end gap-2 ${msg.sender?._id === user.id ? 'justify-end' : 'justify-start'}`}>
                                        {msg.sender?._id !== user.id && <img src={msg.sender.profileImage || `https://i.pravatar.cc/40?u=${msg.sender._id}`} alt="sender" className="w-8 h-8 rounded-full"/>}
                                        <div className={`max-w-xs lg:max-w-md p-3 rounded-2xl ${msg.sender?._id === user.id ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none shadow-sm'}`}>
                                            <p>{msg.text}</p>
                                        </div>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>
                            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 dark:border-gray-700 flex items-center gap-2 bg-white dark:bg-gray-900">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type a message..."
                                    className="flex-grow p-3 bg-gray-100 dark:bg-gray-800 border border-transparent rounded-full focus:ring-2 focus:ring-indigo-500 outline-none transition"
                                />
                                <button type="submit" className="p-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition shadow-md">
                                    <Send size={20} />
                                </button>
                            </form>
                        </motion.div>
                    ) : (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-grow flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                            <MessageSquare size={48} className="mb-4"/>
                            <h3 className="text-xl font-semibold">Select a conversation</h3>
                            <p>Manage your student Q&A and direct messages here.</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};



// --- Q&A Tab Component ---
const QnaView = () => {
    const [questions, setQuestions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [answerText, setAnswerText] = useState({});

    const fetchUnansweredQuestions = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await axios.get("/questions/instructor");
            setQuestions(res.data);
        } catch (error) {
            toast.error("Failed to load questions.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUnansweredQuestions();
    }, [fetchUnansweredQuestions]);

    const handleAnswer = async (questionId) => {
        const text = answerText[questionId];
        if (!text || !text.trim()) return toast.error("Answer cannot be empty.");

        const toastId = toast.loading("Posting your answer...");
        try {
            await axios.post(`/questions/answer/${questionId}`, { text });
            toast.success("Answer posted!", { id: toastId });
            fetchUnansweredQuestions();
        } catch (error) {
            toast.error("Failed to post answer.", { id: toastId });
        }
    };

    return (
        <div>
            {isLoading ? (
                <p className="text-center text-gray-500 dark:text-gray-400">Loading questions...</p>
            ) : questions.length === 0 ? (
                <div className="text-center py-16 text-gray-500 dark:text-gray-400">
                    <HelpCircle className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-lg font-medium">All Caught Up!</h3>
                    <p className="mt-1 text-sm">There are no unanswered student questions right now.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {questions.map(q => (
                        <div key={q._id} className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border dark:border-gray-700">
                            <div className="flex items-start gap-3">
                                <img src={q.user.profileImage || `https://i.pravatar.cc/40?u=${q.user.name}`} alt={q.user.name} className="w-8 h-8 rounded-full mt-1"/>
                                <div>
                                    <p className="font-semibold text-gray-800 dark:text-gray-200">{q.user.name}</p>
                                    <p className="text-xs text-gray-500">
                                        In <span className="font-medium text-indigo-600">{q.course.title}</span> / <span className="font-medium">{q.lesson.title}</span>
                                    </p>
                                    <p className="text-gray-700 dark:text-gray-300 mt-2">{q.text}</p>
                                </div>
                            </div>
                            <div className="mt-3 flex gap-2 pl-11">
                                <input
                                    type="text"
                                    value={answerText[q._id] || ""}
                                    onChange={(e) => setAnswerText(prev => ({...prev, [q._id]: e.target.value}))}
                                    placeholder="Type your answer..."
                                    className="flex-grow p-2 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg"
                                />
                                <button onClick={() => handleAnswer(q._id)} className="px-3 py-1 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition">
                                    <Send size={16}/>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default function MessagesView({ openChatId }) {
  const [activeTab, setActiveTab] = useState("qna");

  useEffect(() => {
    if (openChatId) {
      setActiveTab('messages');
    }
  }, [openChatId]);

  return (
    <div className="w-full">
      <h2 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-6">
        Communication Center
      </h2>
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav className="flex gap-6" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('qna')}
            className={`py-3 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${activeTab === 'qna' ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            <HelpCircle size={16} /> Course Q&A
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`py-3 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${activeTab === 'messages' ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            <MessageSquare size={16} /> Direct Messages
          </button>
        </nav>
      </div>

      <div>
        {activeTab === 'qna' && <QnaView />}
        {activeTab === 'messages' && <DirectMessagesView openChatId={openChatId} />}
      </div>
    </div>
  );
}
