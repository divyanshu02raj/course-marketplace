import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "../api/axios";
import toast from "react-hot-toast";
import { MessageSquare, HelpCircle, Send, Plus, ArrowLeft } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import { motion, AnimatePresence } from 'framer-motion';
import NewMessageModal from "../StudentDashboardComponents/NewMessageModal";

// --- Skeleton Loader Components ---
const QnaSkeleton = () => (
    <div className="space-y-6 animate-pulse">
        {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border dark:border-gray-700">
                <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-700 mt-1 shrink-0"></div>
                    <div className="w-full space-y-2">
                        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/4"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-1/2"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-full mt-1"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-3/4"></div>
                    </div>
                </div>
            </div>
        ))}
    </div>
);

const DirectMessagesSkeleton = () => (
    <div className="flex h-[calc(100vh-16rem)] relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-lg overflow-hidden animate-pulse">
        <aside className="w-1/3 border-r border-gray-200 dark:border-gray-800 flex flex-col">
            <div className="p-4 border-b border-gray-200 dark:border-gray-800">
                <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/3"></div>
            </div>
            <div className="overflow-y-auto flex-grow p-2 space-y-2">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-start gap-3 p-2">
                        <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-700 shrink-0"></div>
                        <div className="flex-grow space-y-2">
                            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                            <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-full"></div>
                        </div>
                    </div>
                ))}
            </div>
        </aside>
        <main className="w-2/3 flex-col hidden md:flex items-center justify-center text-gray-400">
             <div className="w-12 h-12 bg-gray-300 dark:bg-gray-700 rounded-full mb-4"></div>
             <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
             <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-3/4"></div>
        </main>
    </div>
);


// --- Helper function to format timestamps ---
const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = (now - date) / 1000;

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

// --- Direct Messages Tab Component ---
const DirectMessagesView = ({ openChatId }) => {
    const { user } = useAuth();
    const socket = useSocket();
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const typingTimeoutRef = useRef(null);

    const selectedConversationRef = useRef(selectedConversation);
    useEffect(() => {
        selectedConversationRef.current = selectedConversation;
    }, [selectedConversation]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Add user to socket session on connect
    useEffect(() => {
        if (socket && user?._id) {
            socket.emit('addUser', user._id);
        }
    }, [socket, user]);

    // Set up socket event listeners
    useEffect(() => {
        if (!socket) return;

        const handleNewMessage = (message) => {
            // Always update the conversation list for both users
            setConversations(prevConvos => {
                const updatedList = prevConvos.map(convo => {
                    if (convo._id === message.conversation) {
                        return { ...convo, lastMessage: { text: message.text, timestamp: message.createdAt } };
                    }
                    return convo;
                });
                return updatedList.sort((a, b) => new Date(b.lastMessage?.timestamp) - new Date(a.lastMessage?.timestamp));
            });

            // ** THE FIX IS HERE **
            // Only add the message to the chat window if the sender is NOT the current user.
            // The sender's message is already added optimistically in handleSendMessage.
            if (message.sender?._id !== user._id) {
                if (selectedConversationRef.current?._id === message.conversation) {
                    setMessages(prev => [...prev, message]);
                }
            }
        };

        const handleTypingEvent = ({ conversationId }) => {
            if (selectedConversationRef.current?._id === conversationId) setIsTyping(true);
        };

        const handleStopTypingEvent = ({ conversationId }) => {
            if (selectedConversationRef.current?._id === conversationId) setIsTyping(false);
        };

        socket.on("newMessage", handleNewMessage);
        socket.on("typing", handleTypingEvent);
        socket.on("stopTyping", handleStopTypingEvent);

        return () => {
            socket.off("newMessage", handleNewMessage);
            socket.off("typing", handleTypingEvent);
            socket.off("stopTyping", handleStopTypingEvent);
        };
    }, [socket, user?._id]); // Add user._id to dependency array

    const selectConversation = useCallback(async (conversation) => {
        if (!conversation) {
            setSelectedConversation(null);
            setMessages([]);
            return;
        }
        if (selectedConversation?._id === conversation._id) return;
        
        setSelectedConversation(conversation);
        setIsTyping(false);
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

                if (socket && convos.length > 0) {
                    convos.forEach(convo => {
                        socket.emit('joinConversation', { conversationId: convo._id });
                    });
                }

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
    }, [openChatId, selectConversation, socket]);

    const handleTyping = () => {
        if (!socket || !selectedConversation) return;
        const recipient = selectedConversation.participants.find(p => p._id !== user._id);
        socket.emit('startTyping', { conversationId: selectedConversation._id, recipientId: recipient._id });
        
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
            socket.emit('stopTyping', { conversationId: selectedConversation._id, recipientId: recipient._id });
        }, 2000);
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedConversation) return;

        const recipient = selectedConversation.participants.find(p => p._id !== user._id);
        if (!recipient) return toast.error("Recipient not found.");
        
        if(socket) socket.emit('stopTyping', { conversationId: selectedConversation._id, recipientId: recipient._id });

        const tempMessageId = Date.now();
        const sentMessage = { 
            _id: tempMessageId, 
            sender: { _id: user._id, name: user.name, profileImage: user.profileImage }, 
            text: newMessage, 
            createdAt: new Date().toISOString() 
        };
        setMessages(prev => [...prev, sentMessage]);
        setNewMessage('');

        try {
            const res = await axios.post('/messages', { recipientId: recipient._id, text: newMessage });
            // Now we update the temporary message with the real one from the server
            setMessages(prev => prev.map(m => m._id === tempMessageId ? res.data : m));
        } catch (error) {
            toast.error("Failed to send message.");
            // If sending fails, remove the optimistic message
            setMessages(prev => prev.filter(m => m._id !== tempMessageId));
        }
    };
    
    if (loading) {
        return <DirectMessagesSkeleton />;
    }

    return (
        <div className="flex h-[calc(100vh-16rem)] relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-lg overflow-hidden">
            <aside className={`absolute md:relative inset-0 md:w-1/3 border-r border-gray-200 dark:border-gray-800 flex flex-col transition-transform duration-300 ease-in-out ${selectedConversation ? '-translate-x-full md:translate-x-0' : 'translate-x-0'}`}>
                <div className="p-4 border-b border-gray-200 dark:border-gray-800">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">Chats</h2>
                </div>
                <div className="overflow-y-auto flex-grow">
                    {conversations.map(convo => {
                        const otherParticipant = convo.participants.find(p => p._id !== user._id);
                        if (!otherParticipant) return null;
                        return (
                            <button key={convo._id} onClick={() => selectConversation(convo)} className={`w-full text-left p-4 flex items-start gap-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${selectedConversation?._id === convo._id ? 'bg-indigo-50 dark:bg-indigo-900/50' : ''}`}>
                                <img src={otherParticipant.profileImage || `https://i.pravatar.cc/40?u=${otherParticipant._id}`} alt="avatar" className="w-10 h-10 rounded-full"/>
                                <div className="flex-grow truncate">
                                    <div className="flex justify-between items-center">
                                        <p className="font-semibold text-gray-800 dark:text-gray-200">{otherParticipant.name}</p>
                                        <p className="text-xs text-gray-400">{formatTimestamp(convo.lastMessage?.timestamp)}</p>
                                    </div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{convo.lastMessage?.text}</p>
                                </div>
                            </button>
                        )
                    })}
                </div>
            </aside>

            <main className={`absolute md:relative inset-0 md:w-2/3 flex flex-col bg-gray-50 dark:bg-gray-800/50 transition-transform duration-300 ease-in-out ${selectedConversation ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}`}>
                <AnimatePresence mode="wait">
                    {selectedConversation ? (
                        <motion.div key={selectedConversation._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col h-full">
                            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center gap-3 bg-white dark:bg-gray-900">
                                <button onClick={() => selectConversation(null)} className="md:hidden p-2 -ml-2 text-gray-500 hover:text-gray-800 dark:hover:text-white">
                                    <ArrowLeft size={20} />
                                </button>
                                <img src={selectedConversation.participants.find(p => p._id !== user._id)?.profileImage || `https://i.pravatar.cc/40?u=${selectedConversation.participants.find(p => p._id !== user._id)?._id}`} alt="avatar" className="w-10 h-10 rounded-full"/>
                                <div>
                                    <h3 className="font-bold text-gray-800 dark:text-white">{selectedConversation.participants.find(p => p._id !== user._id)?.name}</h3>
                                    {isTyping && <p className="text-xs text-indigo-500 animate-pulse">Typing...</p>}
                                </div>
                            </div>
                            <div className="flex-grow overflow-y-auto p-6 space-y-4">
                                {messages.map(msg => {
                                    const senderId = typeof msg.sender === 'object' && msg.sender !== null ? msg.sender._id : msg.sender;
                                    const isMyMessage = senderId === user._id;
                                    
                                    const otherParticipant = selectedConversation.participants.find(p => p._id !== user._id);

                                    return (
                                        <div key={msg._id} className={`flex items-end gap-2 ${isMyMessage ? 'justify-end' : 'justify-start'}`}>
                                            {!isMyMessage && otherParticipant && (
                                                <img 
                                                    src={otherParticipant.profileImage || `https://i.pravatar.cc/40?u=${otherParticipant._id}`} 
                                                    alt={otherParticipant.name}
                                                    className="w-8 h-8 rounded-full"
                                                />
                                            )}
                                            <div className={`max-w-xs lg:max-w-md p-3 rounded-2xl ${isMyMessage ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none shadow-sm'}`}>
                                                <p>{msg.text}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                                <div ref={messagesEndRef} />
                            </div>
                            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 dark:border-gray-700 flex items-center gap-2 bg-white dark:bg-gray-900">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => { setNewMessage(e.target.value); handleTyping(); }}
                                    placeholder="Type a message..."
                                    className="flex-grow p-3 bg-gray-100 dark:bg-gray-800 border border-transparent rounded-full focus:ring-2 focus:ring-indigo-500 outline-none transition"
                                />
                                <button type="submit" className="p-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition shadow-md">
                                    <Send size={20} />
                                </button>
                            </form>
                        </motion.div>
                    ) : (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hidden md:flex flex-grow flex-col items-center justify-center text-gray-500 dark:text-gray-400">
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
                <QnaSkeleton />
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
                                        In <span className="font-medium text-indigo-600">{q.course?.title || 'N/A'}</span> / <span className="font-medium">{q.lesson?.title || 'N/A'}</span>
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

// --- Main MessagesView Component ---
export default function MessagesView({ openChatId: initialOpenChatId }) {
    const [activeTab, setActiveTab] = useState("qna");
    const [isNewMessageModalOpen, setIsNewMessageModalOpen] = useState(false);
    const [newlyOpenedChatId, setNewlyOpenedChatId] = useState(null);
    const socket = useSocket();

    useEffect(() => {
        if (initialOpenChatId) {
            setActiveTab('messages');
        }
    }, [initialOpenChatId]);

    const handleConversationReady = (conversation) => {
        if (conversation && conversation._id) {
            if (socket) {
                socket.emit('joinConversation', { conversationId: conversation._id });
            }
            setNewlyOpenedChatId(conversation._id);
            setActiveTab('messages');
        }
        setIsNewMessageModalOpen(false);
    };

    const finalOpenChatId = newlyOpenedChatId || initialOpenChatId;

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                    Communication Center
                </h2>
                <button onClick={() => setIsNewMessageModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-semibold text-sm rounded-lg hover:bg-indigo-700 transition">
                    <Plus size={16}/> New Direct Message
                </button>
            </div>
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
                {activeTab === 'messages' && <DirectMessagesView openChatId={finalOpenChatId} />}
            </div>
            <NewMessageModal 
                isOpen={isNewMessageModalOpen} 
                onClose={() => setIsNewMessageModalOpen(false)}
                onConversationReady={handleConversationReady}
            />
        </div>
    );
}
