// src/StudentDashboardComponents/MessagesView.jsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from '../api/axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { Send, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MessagesView() {
    const { user } = useAuth();
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

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const res = await axios.get('/messages');
                setConversations(res.data);
            } catch (error) {
                toast.error("Failed to load conversations.");
            } finally {
                setLoading(false);
            }
        };
        fetchConversations();
    }, []);

    const fetchMessages = useCallback(async (conversationId) => {
        try {
            const res = await axios.get(`/messages/${conversationId}`);
            setMessages(res.data);
            setSelectedConversation(conversations.find(c => c._id === conversationId));
        } catch (error) {
            toast.error("Failed to load messages.");
        }
    }, [conversations]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedConversation) return;

        const recipient = selectedConversation.participants.find(p => p._id !== user._id);
        if (!recipient) return toast.error("Recipient not found.");

        const tempMessageId = Date.now();
        const sentMessage = {
            _id: tempMessageId,
            sender: user,
            text: newMessage,
            createdAt: new Date().toISOString(),
        };
        setMessages(prev => [...prev, sentMessage]);
        setNewMessage('');

        try {
            const res = await axios.post('/messages', {
                recipientId: recipient._id,
                text: newMessage,
            });
            // Replace temporary message with the real one from the server
            setMessages(prev => prev.map(m => m._id === tempMessageId ? res.data : m));
        } catch (error) {
            toast.error("Failed to send message.");
            // Optional: remove the optimistic message on failure
            setMessages(prev => prev.filter(m => m._id !== tempMessageId));
        }
    };
    
    if (loading) {
        return <div className="text-center p-8 text-gray-500 dark:text-gray-400">Loading messages...</div>;
    }

    return (
        <div className="h-[calc(100vh-10rem)] flex bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-lg overflow-hidden">
            {/* Conversation List */}
            <aside className="w-1/3 border-r border-gray-200 dark:border-gray-800 flex flex-col">
                <div className="p-4 border-b border-gray-200 dark:border-gray-800">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">Chats</h2>
                </div>
                <div className="overflow-y-auto flex-grow">
                    {conversations.map(convo => {
                        const otherParticipant = convo.participants.find(p => p._id !== user._id);
                        return (
                            <button key={convo._id} onClick={() => fetchMessages(convo._id)} className={`w-full text-left p-4 flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${selectedConversation?._id === convo._id ? 'bg-indigo-50 dark:bg-indigo-900/50' : ''}`}>
                                <img src={otherParticipant?.profileImage || `https://i.pravatar.cc/40?u=${otherParticipant?._id}`} alt="avatar" className="w-10 h-10 rounded-full"/>
                                <div className="flex-grow truncate">
                                    <p className="font-semibold text-gray-800 dark:text-gray-200">{otherParticipant?.name || 'User'}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{convo.lastMessage?.text}</p>
                                </div>
                            </button>
                        )
                    })}
                </div>
            </aside>

            {/* Message Area */}
            <main className="w-2/3 flex flex-col">
                <AnimatePresence mode="wait">
                    {selectedConversation ? (
                        <motion.div key={selectedConversation._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col h-full">
                            <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center gap-3">
                                <img src={selectedConversation.participants.find(p => p._id !== user._id)?.profileImage || `https://i.pravatar.cc/40?u=${selectedConversation.participants.find(p => p._id !== user._id)?._id}`} alt="avatar" className="w-10 h-10 rounded-full"/>
                                <h3 className="font-bold text-gray-800 dark:text-white">{selectedConversation.participants.find(p => p._id !== user._id)?.name}</h3>
                            </div>
                            <div className="flex-grow overflow-y-auto p-6 space-y-4">
                                {messages.map(msg => (
                                    <div key={msg._id} className={`flex gap-3 ${msg.sender._id === user._id ? 'justify-end' : 'justify-start'}`}>
                                        {msg.sender._id !== user._id && <img src={msg.sender.profileImage || `https://i.pravatar.cc/40?u=${msg.sender._id}`} alt="sender" className="w-8 h-8 rounded-full"/>}
                                        <div className={`max-w-xs lg:max-w-md p-3 rounded-2xl ${msg.sender._id === user._id ? 'bg-indigo-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>
                                            <p>{msg.text}</p>
                                            <p className={`text-xs mt-1 ${msg.sender._id === user._id ? 'text-indigo-200' : 'text-gray-500'}`}>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                        </div>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>
                            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 dark:border-gray-800 flex items-center gap-2">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type a message..."
                                    className="flex-grow p-3 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-full focus:ring-2 focus:ring-indigo-500 outline-none transition"
                                />
                                <button type="submit" className="p-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition">
                                    <Send size={20} />
                                </button>
                            </form>
                        </motion.div>
                    ) : (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-grow flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                            <MessageSquare size={48} className="mb-4"/>
                            <h3 className="text-xl font-semibold">Select a conversation</h3>
                            <p>Start chatting with your students and instructors.</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}