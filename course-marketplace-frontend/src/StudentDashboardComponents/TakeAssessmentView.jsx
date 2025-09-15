// course-marketplace-frontend\src\StudentDashboardComponents\TakeAssessmentView.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import axios from '../api/axios';
import toast from 'react-hot-toast';
import { CheckCircle, XCircle, Send, Award, Home, ChevronLeft, ChevronRight, AlertTriangle, Circle, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

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
                        certificateId: attemptData.certificateId,
                        totalQuestions: res.data.questions.length,
                        passingScore: res.data.passingScore,
                        correctCount: Math.round((res.data.questions.length * attemptData.score) / 100),
                    });
                } else {
                    const initialAnswers = {};
                    res.data.questions.forEach(q => { initialAnswers[q._id] = ''; });
                    setAnswers(initialAnswers);
                }
            } catch (error) {
                toast.error("Failed to load the assessment.");
                navigate('/dashboard/assessments');
            } finally {
                setLoading(false);
            }
        };
        
        if (location.state?.retake) {
            setResults(null);
            fetchAssessment();
        } else if (attemptData) {
             if (!assessment) fetchAssessment();
             else setLoading(false);
        } else {
            fetchAssessment();
        }

    }, [assessmentId, navigate, location.state]);

    const handleAnswerChange = (questionId, answer) => {
        setAnswers(prev => ({ ...prev, [questionId]: answer }));
    };
    
    const handleNext = () => {
        if (assessment && currentQuestionIndex < assessment.questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        }
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
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
                answers: Object.entries(answers).map(([questionId, answer]) => ({ questionId, answer }))
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
        return <div className="text-center p-8 text-gray-500 dark:text-gray-400">Loading Assessment...</div>;
    }

    if (results) {
        return <ResultsView results={results} assessmentId={assessmentId} />;
    }

    if (!assessment) {
        return <div className="text-center p-8 text-red-500">Could not load assessment.</div>;
    }

    const currentQuestion = assessment.questions[currentQuestionIndex];

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-950 p-4 sm:p-8">
            <div className="max-w-7xl mx-auto">
                <header className="mb-8">
                    <Link to="/dashboard/assessments" className="flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400 hover:underline mb-4 font-semibold">
                        <ArrowLeft size={16} />
                        Back to Assessments
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{assessment.title}</h1>
                </header>
                
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
                    {/* Left Navigation Panel */}
                    <aside className="lg:col-span-1 lg:sticky lg:top-8">
                        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6">
                            <h3 className="font-bold text-lg mb-4">Questions</h3>
                            <div className="space-y-2">
                                {assessment.questions.map((q, index) => (
                                    <button 
                                        key={q._id}
                                        onClick={() => setCurrentQuestionIndex(index)}
                                        className={`w-full text-left flex items-center gap-3 p-3 rounded-lg transition-colors text-sm ${
                                            currentQuestionIndex === index 
                                            ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 font-bold' 
                                            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                                        }`}
                                    >
                                        {answers[q._id] ? <CheckCircle size={16} className="text-green-500" /> : <Circle size={16} className="text-gray-400" />}
                                        <span className="flex-grow">Question {index + 1}</span>
                                    </button>
                                ))}
                            </div>
                            <button onClick={handleSubmit} disabled={submitting} className="mt-6 w-full flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors shadow-lg">
                                <Send size={18} /> {submitting ? 'Submitting...' : 'Submit Assessment'}
                            </button>
                        </div>
                    </aside>
                    
                    {/* Right Question Panel */}
                    <main className="lg:col-span-3">
                         <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 min-h-[60vh] flex flex-col">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentQuestion._id}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -30 }}
                                    transition={{ duration: 0.3 }}
                                    className="flex-grow"
                                >
                                    <QuestionDisplay
                                        question={currentQuestion}
                                        answer={answers[currentQuestion._id]}
                                        onAnswerChange={handleAnswerChange}
                                        questionNumber={currentQuestionIndex + 1}
                                    />
                                </motion.div>
                            </AnimatePresence>
                            
                            {/* ** THE FIX IS HERE: Added Navigation Buttons ** */}
                            <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                                <button onClick={handlePrevious} disabled={currentQuestionIndex === 0} className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 transition-colors">
                                    <ChevronLeft size={18} /> Previous
                                </button>
                                {currentQuestionIndex < assessment.questions.length - 1 && (
                                    <button onClick={handleNext} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow">
                                        Next <ChevronRight size={18} />
                                    </button>
                                )}
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}

// --- Component to Display a Single Question ---
const QuestionDisplay = ({ question, answer, onAnswerChange, questionNumber }) => {
    const renderOptions = () => {
        switch (question.questionType) {
            case 'multiple-choice':
                return question.options.map((option, index) => (
                    <label key={index} className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${answer === String(index) ? 'bg-indigo-50 dark:bg-indigo-900/50 border-indigo-500 ring-2 ring-indigo-500' : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
                        <input type="radio" name={question._id} value={String(index)} checked={answer === String(index)} onChange={(e) => onAnswerChange(question._id, e.target.value)} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"/>
                        <span className="ml-3">{option}</span>
                    </label>
                ));
            case 'true-false':
                return (
                    <>
                        <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${answer === 'true' ? 'bg-indigo-50 dark:bg-indigo-900/50 border-indigo-500 ring-2 ring-indigo-500' : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
                            <input type="radio" name={question._id} value="true" checked={answer === 'true'} onChange={(e) => onAnswerChange(question._id, e.target.value)} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300" />
                            <span className="ml-3">True</span>
                        </label>
                        <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${answer === 'false' ? 'bg-indigo-50 dark:bg-indigo-900/50 border-indigo-500 ring-2 ring-indigo-500' : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
                            <input type="radio" name={question._id} value="false" checked={answer === 'false'} onChange={(e) => onAnswerChange(question._id, e.target.value)} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300" />
                            <span className="ml-3">False</span>
                        </label>
                    </>
                );
            case 'fill-in-the-blank':
                return (
                    <input
                        type="text"
                        value={answer || ''}
                        onChange={(e) => onAnswerChange(question._id, e.target.value)}
                        placeholder="Type your answer here..."
                        className="w-full p-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                );
            default:
                return <p>Unsupported question type.</p>;
        }
    };

    return (
        <div>
            <p className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">Question {questionNumber}</p>
            <p className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">{question.text}</p>
            {question.media?.url && (
                <div className="mb-6 max-h-96 overflow-hidden flex justify-center items-center bg-gray-100 dark:bg-gray-800 rounded-lg">
                    {question.media.mediaType === 'image' ? (
                        <img src={question.media.url} alt="Question media" className="max-w-full max-h-96 h-auto rounded-lg" />
                    ) : (
                        <video src={question.media.url} controls className="w-full rounded-lg"></video>
                    )}
                </div>
            )}
            <div className="space-y-4">{renderOptions()}</div>
        </div>
    );
};

// --- Component to Display Assessment Results ---
const ResultsView = ({ results, assessmentId }) => {
    const navigate = useNavigate();
    const { score, passed, correctCount, totalQuestions, passingScore, certificateId } = results;

    const handleRetake = () => {
        navigate(`/assessment/${assessmentId}`, { state: { retake: true }, replace: true });
    };

    if (typeof score === 'undefined') {
        return <div className="text-center p-8 text-gray-500 dark:text-gray-400">Loading results...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-950 p-4 sm:p-8 flex items-center justify-center">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 text-center"
            >
                {passed ? (
                    <div className="flex flex-col items-center">
                        <CheckCircle className="mx-auto h-20 w-20 text-green-500 mb-4" />
                        <h2 className="text-3xl font-bold text-green-500">Congratulations! You Passed!</h2>
                    </div>
                ) : (
                    <div className="flex flex-col items-center">
                        <AlertTriangle className="mx-auto h-20 w-20 text-yellow-500 mb-4" />
                        <h2 className="text-3xl font-bold text-yellow-500">Keep Studying!</h2>
                    </div>
                )}
                
                <div className="relative my-8 w-48 h-48 mx-auto">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                        <circle className="text-gray-200 dark:text-gray-700" strokeWidth="10" stroke="currentColor" fill="transparent" r="45" cx="50" cy="50" />
                        <motion.circle
                            className={passed ? "text-green-500" : "text-yellow-500"}
                            strokeWidth="10"
                            strokeDasharray="283"
                            strokeDashoffset={283}
                            strokeLinecap="round"
                            stroke="currentColor"
                            fill="transparent"
                            r="45"
                            cx="50"
                            cy="50"
                            style={{ rotate: -90, transformOrigin: 'center' }}
                            animate={{ strokeDashoffset: 283 - (283 * score) / 100 }}
                            transition={{ duration: 1, ease: "circOut" }}
                        />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className={`text-4xl font-bold ${passed ? 'text-green-500' : 'text-yellow-500'}`}>{score.toFixed(1)}%</span>
                    </div>
                </div>

                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                    <p className="text-lg text-gray-700 dark:text-gray-300">
                        You answered <span className="font-bold text-indigo-500">{correctCount}</span> out of <span className="font-bold text-indigo-500">{totalQuestions}</span> questions correctly.
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">(Passing score: {passingScore}%)</p>
                </div>

                <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
                    <Link to="/dashboard/assessments" className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 font-semibold text-gray-800 dark:text-gray-100 transition-colors">
                        <Home size={18} /> Back to Assessments
                    </Link>
                    {passed && certificateId ? (
                        <Link to={`/certificate/${certificateId}`} className="flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors shadow-lg">
                            <Award size={18} /> View Certificate
                        </Link>
                    ) : !passed ? (
                        <button onClick={handleRetake} className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors shadow-lg">
                            Try Again
                        </button>
                    ) : null}
                </div>
            </motion.div>
        </div>
    );
};

