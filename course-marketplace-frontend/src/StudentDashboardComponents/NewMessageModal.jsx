import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import toast from 'react-hot-toast';
import { X, Search } from 'lucide-react';
import { motion } from 'framer-motion';

export default function NewMessageModal({ isOpen, onClose, onConversationReady }) {
    const [contacts, setContacts] = useState([]);
    const [filteredContacts, setFilteredContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (isOpen) {
            const fetchContacts = async () => {
                setLoading(true);
                try {
                    const res = await axios.get('/users/message-contacts');
                    setContacts(res.data);
                    setFilteredContacts(res.data);
                } catch (error) {
                    toast.error("Failed to load contacts.");
                } finally {
                    setLoading(false);
                }
            };
            fetchContacts();
        }
    }, [isOpen]);

    useEffect(() => {
        const filtered = contacts.filter(contact =>
            contact.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredContacts(filtered);
    }, [searchQuery, contacts]);

    const handleSelectContact = async (contact) => {
        const toastId = toast.loading("Starting conversation...");
        try {
            const res = await axios.post('/messages/conversation', { recipientId: contact._id });
            toast.dismiss(toastId);
            
            // Pass the newly created conversation object back to the parent
            if (onConversationReady) {
                onConversationReady(res.data);
            }
            
            onClose(); // Close the modal
        } catch (error) {
            toast.error("Could not start conversation.", { id: toastId });
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-md transform transition-all max-h-[70vh] flex flex-col"
            >
                <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">New Message</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-white"><X size={24} /></button>
                </div>

                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                            <Search size={18} />
                        </div>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search for a user..."
                            className="w-full p-2 pl-10 bg-gray-100 dark:bg-gray-800 border-transparent rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
                        />
                    </div>
                </div>

                <div className="overflow-y-auto flex-grow p-2">
                    {loading ? <p className="text-center p-4 text-gray-500">Loading contacts...</p> : (
                        filteredContacts.map(contact => (
                            <button 
                                key={contact._id} 
                                onClick={() => handleSelectContact(contact)}
                                className="w-full text-left p-3 flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                            >
                                <img src={contact.profileImage || `https://i.pravatar.cc/40?u=${contact._id}`} alt={contact.name} className="w-10 h-10 rounded-full"/>
                                <div>
                                    <p className="font-semibold text-gray-800 dark:text-gray-200">{contact.name}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{contact.email}</p>
                                </div>
                            </button>
                        ))
                    )}
                </div>
            </motion.div>
        </div>
    );
}
