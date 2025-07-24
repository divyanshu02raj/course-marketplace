// src/InstructorDashboardComponents/MessagesView.jsx
import React, { useState, useEffect, useCallback } from "react";
import axios from "../api/axios";
import toast from "react-hot-toast";
import { MessageSquare, HelpCircle, Send } from "lucide-react";
import { useAuth } from "../context/AuthContext";

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
            // Refetch questions to remove the answered one from the list
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

// --- Main MessagesView Component ---
export default function MessagesView() {
  const [activeTab, setActiveTab] = useState("qna");

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
        {activeTab === 'messages' && (
          <div className="text-center py-16 text-gray-500 dark:text-gray-400">
            <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium">Direct Messages</h3>
            <p className="mt-1 text-sm">This feature is coming soon.</p>
          </div>
        )}
      </div>
    </div>
  );
}
