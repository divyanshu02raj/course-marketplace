import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "../api/axios";
import toast from "react-hot-toast";
import { MessageSquare, Send, Search } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from 'framer-motion';

export default function MessagesView({ openChatId }) {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

  const filteredConversations = conversations.filter(c => {
    const otherParticipant = c.participants.find(p => p._id !== user.id);
    return otherParticipant?.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return <div className="text-center p-8 text-gray-500 dark:text-gray-400">Loading messages...</div>;
  }

  return (
    <div className="w-full max-w-7xl mx-auto">
      <h2 className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 mb-8 flex items-center gap-3">
        <MessageSquare className="opacity-80"/>
        Direct Messages
      </h2>
      <div className="h-[calc(100vh-18rem)] flex bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl shadow-xl overflow-hidden">
        
        {/* Conversations Panel */}
        <aside className="w-1/3 border-r border-gray-200 dark:border-gray-800 flex flex-col">
          <div className="p-5 border-b border-gray-200 dark:border-gray-800">
            <div className="relative text-gray-400 focus-within:text-indigo-600 dark:focus-within:text-indigo-400">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" size={18} />
              <input 
                type="search"
                placeholder="Search conversations..."
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                aria-label="Search conversations"
              />
            </div>
          </div>

          <div className="overflow-y-auto flex-grow divide-y divide-gray-100 dark:divide-gray-800">
            {filteredConversations.length === 0 && (
              <p className="p-6 text-center text-gray-500 dark:text-gray-400 text-sm">No conversations found</p>
            )}
            {filteredConversations.map(convo => {
              const otherParticipant = convo.participants.find(p => p._id !== user.id);
              if (!otherParticipant) return null;

              return (
                <button
                  key={convo._id}
                  onClick={() => selectConversation(convo)}
                  className={`w-full text-left p-4 flex items-center gap-4 bg-white dark:bg-gray-900 hover:bg-indigo-50 dark:hover:bg-indigo-900/40 transition-shadow rounded-xl shadow-sm 
                    ${selectedConversation?._id === convo._id ? 'shadow-indigo-400 dark:shadow-indigo-600 bg-indigo-50 dark:bg-indigo-900/70' : ''}`}
                  aria-current={selectedConversation?._id === convo._id ? "true" : undefined}
                >
                  <div className="relative flex-shrink-0">
                    <img 
                      src={otherParticipant.profileImage || `https://i.pravatar.cc/48?u=${otherParticipant._id}`} 
                      alt={`${otherParticipant.name} avatar`} 
                      className="w-12 h-12 rounded-full object-cover border-2 border-indigo-500 dark:border-indigo-400" 
                      loading="lazy"
                    />
                    <span className="absolute bottom-0 right-0 block w-3 h-3 bg-green-400 border-2 border-white rounded-full"></span>
                  </div>
                  <div className="flex flex-col flex-grow min-w-0">
                    <div className="flex justify-between items-center">
                      <p className="font-semibold text-gray-900 dark:text-gray-100 truncate">{otherParticipant.name}</p>
                      <time className="text-xs text-gray-400 dark:text-gray-500 ml-2 whitespace-nowrap" dateTime={convo.lastMessage?.createdAt}>
                        {convo.lastMessage ? formatTime(convo.lastMessage.createdAt) : ''}
                      </time>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate mt-1">{convo.lastMessage?.text || "No messages yet"}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Messages Panel */}
        <main className="w-2/3 flex flex-col bg-gray-50 dark:bg-gray-800">
          <AnimatePresence mode="wait" initial={false}>
            {selectedConversation ? (
              <motion.div 
                key={selectedConversation._id} 
                initial={{ opacity: 0, x: 20 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: -20 }} 
                className="flex flex-col h-full"
              >
                <div className="p-6 border-b border-gray-300 dark:border-gray-700 flex items-center gap-4 bg-white dark:bg-gray-900 shadow-sm">
                  <img
                    src={selectedConversation.participants.find(p => p._id !== user.id)?.profileImage || `https://i.pravatar.cc/48?u=${selectedConversation.participants.find(p => p._id !== user.id)?._id}`}
                    alt="avatar" 
                    className="w-12 h-12 rounded-full object-cover border-2 border-indigo-600 dark:border-indigo-400"
                  />
                  <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 truncate">
                    {selectedConversation.participants.find(p => p._id !== user.id)?.name}
                  </h3>
                </div>

                <div className="flex-grow overflow-y-auto p-6 space-y-3 scrollbar-thin scrollbar-thumb-indigo-300 dark:scrollbar-thumb-indigo-700 scrollbar-thumb-rounded-md scrollbar-track-gray-100 dark:scrollbar-track-gray-900">
                  {messages.length === 0 && (
                    <p className="text-center text-gray-400 dark:text-gray-500 mt-6 select-none">No messages yet. Say hello!</p>
                  )}
                  {messages.map((msg, i) => {
                    const isCurrentUser = msg.sender?._id === user.id;
                    return (
                      <div 
                        key={msg._id} 
                        className={`flex items-end gap-3 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                      >
                        {/* Avatar on left for received, right for sent */}
                        {!isCurrentUser && (
                          <img
                            src={msg.sender.profileImage || `https://i.pravatar.cc/32?u=${msg.sender._id}`}
                            alt={msg.sender.name}
                            className="w-8 h-8 rounded-full object-cover shadow"
                            loading="lazy"
                          />
                        )}
                        <div>
                          <div
                            className={`
                              max-w-xs sm:max-w-md px-4 py-2 rounded-2xl shadow-sm 
                              ${isCurrentUser
                                ? 'bg-indigo-600 text-white rounded-br-none'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-none'}
                              whitespace-pre-wrap break-words
                            `}
                            title={new Date(msg.createdAt).toLocaleString()}
                          >
                            {msg.text}
                          </div>
                          <time 
                            className={`block text-[10px] mt-0.5 ${isCurrentUser ? 'text-indigo-200' : 'text-gray-400 dark:text-gray-500'}`} 
                            dateTime={msg.createdAt}
                          >
                            {formatTime(msg.createdAt)}
                          </time>
                        </div>
                        {isCurrentUser && (
                          <img
                            src={user.profileImage || `https://i.pravatar.cc/32?u=${user.id}`}
                            alt={user.name}
                            className="w-8 h-8 rounded-full object-cover shadow"
                            loading="lazy"
                          />
                        )}
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                <form onSubmit={handleSendMessage} className="p-5 border-t border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 flex items-center gap-4 rounded-b-3xl shadow-sm">
                  <textarea
                    rows={1}
                    maxLength={1000}
                    value={newMessage}
                    placeholder="Type a message..."
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-grow resize-none rounded-full border border-gray-300 dark:border-gray-700 px-4 py-3 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition h-12"
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(e); }}}
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    aria-label="Send message"
                    className={`p-3 rounded-full flex items-center justify-center bg-indigo-600 text-white hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg`}
                  >
                    <Send size={20} />
                  </button>
                </form>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="flex-grow flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 select-none"
              >
                <MessageSquare size={56} className="mb-6 opacity-40" />
                <h3 className="text-2xl font-semibold mb-1">Select a conversation</h3>
                <p className="max-w-xs text-center">Manage your direct messages with students here.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
