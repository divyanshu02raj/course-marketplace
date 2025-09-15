// course-marketplace-frontend\src\StudentDashboardComponents\QuizPlayerModal.jsx
import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import toast from 'react-hot-toast';
import { X, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function QuizPlayerModal({ isOpen, onClose, lesson, onQuizComplete }) {
    const [quiz, setQuiz] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [userAnswers, setUserAnswers] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen && lesson) {
            const fetchQuiz = async () => {
                setIsLoading(true);
                try {
                    const res = await axios.get(`/quizzes/${lesson._id}/take`);
                    setQuiz(res.data.quiz);
                    setQuestions(res.data.questions);
                    setUserAnswers({}); // Reset answers each time the modal opens
                } catch (error) {
                    toast.error("No quiz found for this lesson.");
                    onClose(); // Close modal if there's no quiz
                } finally {
                    setIsLoading(false);
                }
            };
            fetchQuiz();
        }
    }, [isOpen, lesson, onClose]);

    const handleAnswerSelect = (questionId, option) => {
        setUserAnswers(prev => ({
            ...prev,
            [questionId]: option
        }));
    };

    const handleSubmit = async () => {
        if (Object.keys(userAnswers).length !== questions.length) {
            return toast.error("Please answer all questions before submitting.");
        }
        setIsSubmitting(true);
        const toastId = toast.loading("Submitting your answers...");
        try {
            const res = await axios.post(`/quizzes/${quiz._id}/submit`, { answers: userAnswers });
            toast.success("Quiz submitted successfully!", { id: toastId });
            onQuizComplete(res.data); // Pass results back to the parent
        } catch (error) {
            toast.error("Failed to submit quiz.", { id: toastId });
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
                className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-3xl transform transition-all max-h-[90vh] flex flex-col"
            >
                <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{quiz?.title || 'Loading Quiz...'}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-white"><X size={24} /></button>
                </div>

                <div className="overflow-y-auto p-8 space-y-8">
                    {isLoading ? <p className="text-center text-gray-500">Loading questions...</p> : questions.map((q, index) => (
                        <div key={q._id}>
                            <p className="font-semibold text-gray-800 dark:text-gray-200">{index + 1}. {q.questionText}</p>
                            <div className="mt-4 space-y-3">
                                {q.options.map((option, i) => (
                                    <label key={i} className={`flex items-center gap-3 p-3 rounded-lg border-2 transition cursor-pointer ${userAnswers[q._id] === option ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/50' : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300'}`}>
                                        <input
                                            type="radio"
                                            name={q._id}
                                            value={option}
                                            checked={userAnswers[q._id] === option}
                                            onChange={() => handleAnswerSelect(q._id, option)}
                                            className="form-radio h-5 w-5 text-indigo-600 focus:ring-indigo-500"
                                        />
                                        <span className="flex-grow text-gray-700 dark:text-gray-300">{option}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex justify-end gap-4 p-6 border-t border-gray-200 dark:border-gray-700">
                    <button onClick={onClose} className="px-6 py-2 text-sm font-semibold rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600">Cancel</button>
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting || isLoading}
                        className="flex items-center gap-2 px-6 py-2 text-sm font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50"
                    >
                        {isSubmitting ? "Submitting..." : "Submit Quiz"} <ChevronRight size={16}/>
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
