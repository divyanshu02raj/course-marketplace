// course-marketplace-frontend\src\InstructorDashboardComponents\QuizEditorModal.jsx
import React, { useState, useEffect, useCallback } from 'react';
import axios from '../api/axios';
import toast from 'react-hot-toast';
import { X, Plus, Trash2, Check } from 'lucide-react';

const initialQuestionState = {
    questionText: "",
    options: ["", "", "", ""],
    correctAnswer: ""
};

export default function QuizEditorModal({ isOpen, onClose, lesson }) {
    const [quiz, setQuiz] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [newQuestion, setNewQuestion] = useState(initialQuestionState);

    const fetchQuizData = useCallback(async () => {
        if (!isOpen || !lesson) return;
        setIsLoading(true);
        try {
            const res = await axios.get(`/quizzes/${lesson._id}`);
            setQuiz(res.data.quiz);
            setQuestions(res.data.questions);
        } catch (error) {
            toast.error("Failed to load quiz data.");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, [isOpen, lesson]);

    useEffect(() => {
        fetchQuizData();
    }, [fetchQuizData]);

    const handleNewQuestionChange = (e) => {
        const { name, value } = e.target;
        setNewQuestion(prev => ({ ...prev, [name]: value }));
    };

    const handleOptionChange = (index, value) => {
        const updatedOptions = [...newQuestion.options];
        updatedOptions[index] = value;
        setNewQuestion(prev => ({ ...prev, options: updatedOptions }));
    };

    const handleAddQuestion = async (e) => {
        e.preventDefault();
        
        // ✅ More robust validation logic
        const filteredOptions = newQuestion.options.map(opt => opt.trim()).filter(Boolean);

        if (!newQuestion.questionText.trim()) {
            return toast.error("Please provide text for the question.");
        }
        if (filteredOptions.length < 2) {
            return toast.error("Please provide at least two non-empty options.");
        }
        if (!newQuestion.correctAnswer) {
            return toast.error("Please select a correct answer.");
        }
        if (!filteredOptions.includes(newQuestion.correctAnswer)) {
            return toast.error("The correct answer must be one of the provided options.");
        }

        const payload = {
            questionText: newQuestion.questionText.trim(),
            options: filteredOptions,
            correctAnswer: newQuestion.correctAnswer
        };

        const toastId = toast.loading("Adding question...");
        try {
            const res = await axios.post(`/quizzes/${quiz._id}/questions`, payload);
            setQuestions(prev => [...prev, res.data]);
            setNewQuestion(initialQuestionState); // Reset form
            toast.success("Question added!", { id: toastId });
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to add question.", { id: toastId });
        }
    };

    const handleDeleteQuestion = async (questionId) => {
        const toastId = toast.loading("Deleting question...");
        try {
            await axios.delete(`/quizzes/questions/${questionId}`);
            setQuestions(prev => prev.filter(q => q._id !== questionId));
            toast.success("Question deleted!", { id: toastId });
        } catch (error) {
            toast.error("Failed to delete question.", { id: toastId });
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={onClose}>
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-3xl mx-4 transform transition-all max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">Quiz Editor</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-white"><X size={24} /></button>
                </div>

                <div className="overflow-y-auto p-8 space-y-8">
                    {/* Existing Questions */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Questions for: {lesson.title}</h3>
                        {isLoading ? <p>Loading...</p> : questions.length > 0 ? (
                            <div className="space-y-4">
                                {questions.map((q, index) => (
                                    <div key={q._id} className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border dark:border-gray-700">
                                        <div className="flex justify-between items-start">
                                            <p className="font-semibold">{index + 1}. {q.questionText}</p>
                                            <button onClick={() => handleDeleteQuestion(q._id)} className="text-red-500 hover:text-red-700"><Trash2 size={16}/></button>
                                        </div>
                                        <ul className="mt-2 space-y-1 text-sm pl-4">
                                            {q.options.map((opt, i) => (
                                                <li key={i} className={`flex items-center gap-2 ${q.correctAnswer === opt ? 'text-green-600 dark:text-green-400 font-semibold' : 'text-gray-600 dark:text-gray-300'}`}>
                                                    {q.correctAnswer === opt && <Check size={14}/>} {opt}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        ) : <p className="text-sm text-gray-500">No questions added yet.</p>}
                    </div>

                    {/* Add New Question Form */}
                    <form onSubmit={handleAddQuestion} className="space-y-4 pt-8 border-t border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-semibold">Add New Question</h3>
                        <div>
                            <label className="block text-sm font-medium mb-1">Question Text</label>
                            <input type="text" name="questionText" value={newQuestion.questionText} onChange={handleNewQuestionChange} className="w-full p-2 bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 rounded-md"/>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {newQuestion.options.map((opt, index) => (
                                <div key={index}>
                                    <label className="block text-sm font-medium mb-1">Option {index + 1}</label>
                                    <input type="text" value={opt} onChange={(e) => handleOptionChange(index, e.target.value)} className="w-full p-2 bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 rounded-md"/>
                                </div>
                            ))}
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Correct Answer</label>
                            <select name="correctAnswer" value={newQuestion.correctAnswer} onChange={handleNewQuestionChange} className="w-full p-2 bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 rounded-md">
                                <option value="">Select the correct answer</option>
                                {newQuestion.options.map((opt, index) => (
                                    opt.trim() && <option key={index} value={opt}>{opt}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex justify-end">
                            <button type="submit" className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition">
                                <Plus size={16}/> Add Question
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
