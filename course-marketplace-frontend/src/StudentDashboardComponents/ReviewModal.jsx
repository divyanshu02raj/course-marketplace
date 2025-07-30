// src/StudentDashboardComponents/ReviewModal.jsx
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import axios from '../api/axios';
import { X, Star } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ReviewModal({ isOpen, onClose, course, onReviewSubmitted }) {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0) {
            return toast.error("Please select a star rating.");
        }
        if (!comment.trim()) {
            return toast.error("Please write a review to help other students.");
        }

        setIsSubmitting(true);
        const toastId = toast.loading("Submitting your review...");

        try {
            await axios.post(`/reviews/${course._id}`, {
                rating,
                comment,
            });
            toast.success("Thank you for your feedback!", { id: toastId });
            onReviewSubmitted(); // Notify parent to close or update UI
            onClose();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to submit review.", { id: toastId });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-lg transform transition-all"
            >
                <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">Leave a Review</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-white"><X size={24} /></button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div>
                        <p className="text-center text-lg font-medium text-gray-800 dark:text-gray-200">How would you rate "{course.title}"?</p>
                        <div className="flex justify-center items-center gap-2 mt-4">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    size={36}
                                    className={`cursor-pointer transition-colors ${
                                        (hoverRating || rating) >= star 
                                        ? 'text-yellow-400' 
                                        : 'text-gray-300 dark:text-gray-600'
                                    }`}
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                />
                            ))}
                        </div>
                    </div>

                    <div>
                        <label htmlFor="comment" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">Your Review</label>
                        <textarea
                            id="comment"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            rows="5"
                            placeholder="Tell us about your experience with this course..."
                            className="w-full p-3 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
                        />
                    </div>
                    
                    <div className="flex justify-end pt-2">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow transition disabled:opacity-50"
                        >
                            {isSubmitting ? "Submitting..." : "Submit Review"}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
