import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import axios from '../api/axios';
import toast from 'react-hot-toast';
import { CheckCircle, XCircle, Send, Award, Home } from 'lucide-react';
import { motion } from 'framer-motion';

// --- Main Component to Take an Assessment ---
export default function TakeAssessmentView() {
    const { assessmentId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [assessment, setAssessment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [answers, setAnswers] = useState({});
    const [results, setResults] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const attemptData = location.state?.attempt;

        const fetchAssessment = async () => {
            try {
                const res = await axios.get(`/assessments/${assessmentId}/take`);
                setAssessment(res.data);

                if (attemptData) {
                    setResults({
                        score: attemptData.score,
                        passed: attemptData.passed,
                        certificateId: attemptData.certificateId, // Pass the certificateId
                        totalQuestions: res.data.questions.length,
                        passingScore: res.data.passingScore,
                        correctCount: Math.round((res.data.questions.length * attemptData.score) / 100),
                    });
                } else {
                    const initialAnswers = {};
                    res.data.questions.forEach(q => {
                        initialAnswers[q._id] = '';
                    });
                    setAnswers(initialAnswers);
                }
            } catch (error) {
                toast.error("Failed to load the assessment.");
                navigate('/dashboard');
            } finally {
                setLoading(false);
            }
        };

        if (attemptData && !assessment) {
             // If we have attempt data but no assessment data yet, fetch it.
            fetchAssessment();
        } else if (!attemptData) {
            // If it's a new attempt, fetch the assessment.
            fetchAssessment();
        }

    }, [assessmentId, navigate, location.state]);

    const handleAnswerChange = (questionId, answer) => {
        setAnswers(prev => ({ ...prev, [questionId]: answer }));
    };

    const handleSubmit = async () => {
        const unansweredQuestions = Object.values(answers).filter(ans => ans === '').length;
        if (unansweredQuestions > 0) {
            if (!window.confirm(`You have ${unansweredQuestions} unanswered questions. Are you sure you want to submit?`)) {
                return;
            }
        }

        setSubmitting(true);
        const toastId = toast.loading("Submitting your answers...");
        try {
            const submissionData = {
                answers: Object.entries(answers).map(([questionId, answer]) => ({
                    questionId,
                    answer
                }))
            };
            const res = await axios.post(`/assessments/${assessmentId}/submit`, submissionData);
            setResults(res.data);
            toast.success("Assessment submitted!", { id: toastId });
        } catch (error) {
            toast.error("Failed to submit assessment.", { id: toastId });
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <div className="text-center p-8">Loading Assessment...</div>;
    }

    if (results) {
        return <ResultsView results={results} />;
    }

    if (!assessment) {
        return <div className="text-center p-8 text-red-500">Could not load assessment.</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-8 flex items-center justify-center">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-3xl bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8"
            >
                <h1 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">{assessment.title}</h1>
                <p className="text-gray-500 dark:text-gray-400 mb-6">Complete all {assessment.questions.length} questions to finish the assessment.</p>
                
                <div className="space-y-8">
                    {assessment.questions.map((question, index) => (
                        <div key={question._id} className="py-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                            <p className="font-semibold mb-2">Question {index + 1}</p>
                            <QuestionDisplay
                                question={question}
                                answer={answers[question._id]}
                                onAnswerChange={handleAnswerChange}
                            />
                        </div>
                    ))}
                </div>

                <div className="flex justify-end items-center mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <button onClick={handleSubmit} disabled={submitting} className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:opacity-50">
                        <Send size={18} /> {submitting ? 'Submitting...' : 'Submit Assessment'}
                    </button>
                </div>
            </motion.div>
        </div>
    );
}

// --- Component to Display a Single Question ---
const QuestionDisplay = ({ question, answer, onAnswerChange }) => {
    const renderOptions = () => {
        switch (question.questionType) {
            case 'multiple-choice':
                return question.options.map((option, index) => (
                    <label key={index} className={`block p-4 border rounded-lg cursor-pointer transition-colors ${answer === String(index) ? 'bg-indigo-100 dark:bg-indigo-900/50 border-indigo-500' : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'}`}>
                        <input
                            type="radio"
                            name={question._id}
                            value={String(index)}
                            checked={answer === String(index)}
                            onChange={(e) => onAnswerChange(question._id, e.target.value)}
                            className="mr-3"
                        />
                        {option}
                    </label>
                ));
            case 'true-false':
                return (
                    <>
                        <label className={`block p-4 border rounded-lg cursor-pointer transition-colors ${answer === 'true' ? 'bg-indigo-100 dark:bg-indigo-900/50 border-indigo-500' : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'}`}>
                            <input type="radio" name={question._id} value="true" checked={answer === 'true'} onChange={(e) => onAnswerChange(question._id, e.target.value)} className="mr-3" />
                            True
                        </label>
                        <label className={`block p-4 border rounded-lg cursor-pointer transition-colors ${answer === 'false' ? 'bg-indigo-100 dark:bg-indigo-900/50 border-indigo-500' : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'}`}>
                            <input type="radio" name={question._id} value="false" checked={answer === 'false'} onChange={(e) => onAnswerChange(question._id, e.target.value)} className="mr-3" />
                            False
                        </label>
                    </>
                );
            case 'fill-in-the-blank':
                return (
                    <input
                        type="text"
                        value={answer}
                        onChange={(e) => onAnswerChange(question._id, e.target.value)}
                        placeholder="Type your answer here..."
                        className="w-full p-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                );
            default:
                return <p>Unsupported question type.</p>;
        }
    };

    return (
        <div>
            <p className="text-xl font-semibold mb-4">{question.text}</p>
            {question.media?.url && (
                <div className="mb-4">
                    {question.media.mediaType === 'image' ? (
                        <img src={question.media.url} alt="Question media" className="max-w-full h-auto rounded-lg mx-auto" />
                    ) : (
                        <video src={question.media.url} controls className="w-full rounded-lg"></video>
                    )}
                </div>
            )}
            <div className="space-y-3">{renderOptions()}</div>
        </div>
    );
};

// --- Component to Display Assessment Results ---
const ResultsView = ({ results }) => {
    const { score, passed, correctCount, totalQuestions, passingScore, certificateId } = results;
    const scoreColor = passed ? 'text-green-500' : 'text-red-500';

    if (typeof score === 'undefined') {
        return <div className="text-center p-8">Loading results...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-8 flex items-center justify-center">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center"
            >
                {passed ? (
                    <CheckCircle className="mx-auto h-20 w-20 text-green-500 mb-4" />
                ) : (
                    <XCircle className="mx-auto h-20 w-20 text-red-500 mb-4" />
                )}
                <h2 className="text-3xl font-bold mb-2">Assessment Complete!</h2>
                <p className={`text-6xl font-bold my-4 ${scoreColor}`}>{score.toFixed(1)}%</p>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                    You answered {correctCount} out of {totalQuestions} questions correctly.
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">(Passing score: {passingScore}%)</p>

                <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
                    <Link to="/dashboard/my-courses" className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 font-semibold">
                        <Home size={18} /> Go to My Courses
                    </Link>
                    {passed && certificateId ? (
                        <Link to={`/certificate/${certificateId}`} className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700">
                            <Award size={18} /> View Certificate
                        </Link>
                    ) : !passed ? (
                        <button onClick={() => window.location.reload()} className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700">
                            Try Again
                        </button>
                    ) : null}
                </div>
            </motion.div>
        </div>
    );
};
