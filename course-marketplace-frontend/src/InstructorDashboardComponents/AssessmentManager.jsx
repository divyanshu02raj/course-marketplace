// course-marketplace-frontend\src\InstructorDashboardComponents\AssessmentManager.jsx
import React, { useState, useEffect, useCallback } from 'react';
import axios from '../api/axios';
import toast from 'react-hot-toast';
import { Plus, Trash2, Edit, Save, X, Image as ImageIcon, Video, Type, UploadCloud, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Main Assessment Manager Component ---
export default function AssessmentManager({ courseId }) {
    const [assessment, setAssessment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingQuestion, setEditingQuestion] = useState(null);

    const fetchAssessment = useCallback(async () => {
        try {
            const res = await axios.get(`/assessments/course/${courseId}`);
            setAssessment(res.data);
        } catch (error) {
            toast.error("Failed to load assessment data.");
            console.error("Fetch Assessment Error:", error);
        } finally {
            setLoading(false);
        }
    }, [courseId]);

    useEffect(() => {
        fetchAssessment();
    }, [fetchAssessment]);

    const handleQuestionAdded = (newQuestion) => {
        setAssessment(prev => ({
            ...prev,
            questions: [...prev.questions, newQuestion]
        }));
    };

    const handleQuestionUpdated = (updatedQuestion) => {
        setAssessment(prev => ({
            ...prev,
            questions: prev.questions.map(q => q._id === updatedQuestion._id ? updatedQuestion : q)
        }));
    };

    const handleDeleteQuestion = async (questionId) => {
        if (!window.confirm("Are you sure you want to delete this question?")) return;
        
        const toastId = toast.loading("Deleting question...");
        try {
            await axios.delete(`/assessments/questions/${questionId}`);
            setAssessment(prev => ({
                ...prev,
                questions: prev.questions.filter(q => q._id !== questionId)
            }));
            toast.success("Question deleted.", { id: toastId });
        } catch (error) {
            toast.error("Failed to delete question.", { id: toastId });
        }
    };

    const openAddModal = () => {
        setEditingQuestion(null);
        setIsModalOpen(true);
    };

    const openEditModal = (question) => {
        setEditingQuestion(question);
        setIsModalOpen(true);
    };

    if (loading) {
        return <div className="text-center p-8">Loading assessment manager...</div>;
    }

    if (!assessment) {
        return <div className="text-center p-8 text-red-500">Could not load assessment for this course.</div>;
    }

    return (
        <div className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{assessment.title}</h3>
                <button onClick={openAddModal} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition">
                    <Plus size={16} /> Add Question
                </button>
            </div>

            <div className="space-y-4">
                {assessment.questions.length > 0 ? (
                    assessment.questions.map((q, index) => (
                        <QuestionCard 
                            key={q._id} 
                            question={q} 
                            index={index} 
                            onEdit={() => openEditModal(q)}
                            onDelete={() => handleDeleteQuestion(q._id)}
                        />
                    ))
                ) : (
                    <p className="text-center text-gray-500 dark:text-gray-400 py-8">No questions have been added to this assessment yet.</p>
                )}
            </div>

            <AnimatePresence>
                {isModalOpen && (
                    <QuestionModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        assessmentId={assessment._id}
                        existingQuestion={editingQuestion}
                        onQuestionAdded={handleQuestionAdded}
                        onQuestionUpdated={handleQuestionUpdated}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

// --- Question Card Component ---
const QuestionCard = ({ question, index, onEdit, onDelete }) => {
    return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-start">
                <div className="flex-1">
                    <p className="font-semibold text-gray-800 dark:text-gray-200">Q{index + 1}: {question.text}</p>
                    {question.media?.url && (
                        <div className="mt-2 text-sm text-indigo-500 flex items-center gap-2">
                            {question.media.mediaType === 'image' ? <ImageIcon size={16} /> : <Video size={16} />}
                            Media Attached
                        </div>
                    )}
                    <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 space-x-4">
                        <span>Type: <span className="font-medium text-gray-700 dark:text-gray-300">{question.questionType}</span></span>
                        <span>Correct Answer: <span className="font-medium text-green-600 dark:text-green-400">{question.correctAnswer}</span></span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={onEdit} className="p-2 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400"><Edit size={16} /></button>
                    <button onClick={onDelete} className="p-2 text-gray-500 hover:text-red-600 dark:hover:text-red-400"><Trash2 size={16} /></button>
                </div>
            </div>
        </div>
    );
};

// --- Add/Edit Question Modal ---
const QuestionModal = ({ isOpen, onClose, assessmentId, existingQuestion, onQuestionAdded, onQuestionUpdated }) => {
    const isEditMode = !!existingQuestion;
    const [questionData, setQuestionData] = useState({
        text: '',
        questionType: 'multiple-choice',
        media: { mediaType: 'image', url: '' },
        options: ['', '', '', ''],
        correctAnswer: '0',
    });
    const [mediaFile, setMediaFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (isEditMode) {
            setQuestionData({
                text: existingQuestion.text || '',
                questionType: existingQuestion.questionType || 'multiple-choice',
                media: existingQuestion.media || { mediaType: 'image', url: '' },
                options: existingQuestion.options || ['', '', '', ''],
                correctAnswer: existingQuestion.correctAnswer || '0',
            });
        }
    }, [isEditMode, existingQuestion]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setQuestionData(prev => ({ ...prev, [name]: value }));
    };

    const handleOptionChange = (index, value) => {
        const newOptions = [...questionData.options];
        newOptions[index] = value;
        setQuestionData(prev => ({ ...prev, options: newOptions }));
    };
    
    const handleMediaChange = (e) => {
        const { name, value } = e.target;
        setQuestionData(prev => ({ ...prev, media: { ...prev.media, [name]: value } }));
    };

    const handleFileChange = (e) => {
        setMediaFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const toastId = toast.loading(isEditMode ? "Updating question..." : "Adding question...");
        
        let mediaPayload = questionData.media;

        // 1. If a new file is selected, upload it first
        if (mediaFile) {
            setUploading(true);
            toast.loading("Uploading media...", { id: 'upload-toast' });
            const formData = new FormData();
            formData.append('media', mediaFile);

            try {
                const res = await axios.post('/assessments/upload-media', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                mediaPayload = res.data; // The backend will return { mediaType, url }
                toast.success("Media uploaded!", { id: 'upload-toast' });
            } catch (error) {
                toast.error("Media upload failed.", { id: 'upload-toast' });
                setUploading(false);
                return;
            } finally {
                setUploading(false);
            }
        }

        const finalPayload = { ...questionData, media: mediaPayload };
        if (finalPayload.questionType !== 'multiple-choice') {
            delete finalPayload.options;
        }
        if (!finalPayload.media?.url) {
            delete finalPayload.media;
        }

        try {
            if (isEditMode) {
                const res = await axios.patch(`/assessments/questions/${existingQuestion._id}`, finalPayload);
                onQuestionUpdated(res.data);
                toast.success("Question updated!", { id: toastId });
            } else {
                const res = await axios.post(`/assessments/${assessmentId}/questions`, finalPayload);
                onQuestionAdded(res.data);
                toast.success("Question added!", { id: toastId });
            }
            onClose();
        } catch (error) {
            toast.error("An error occurred.", { id: toastId });
            console.error("Save Question Error:", error);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4">
            <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 50, opacity: 0 }}
                className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-2xl transform transition-all max-h-[90vh] flex flex-col"
            >
                <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{isEditMode ? 'Edit Question' : 'Add New Question'}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-white"><X size={24} /></button>
                </div>
                
                <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-4">
                    <FormField icon={<Type size={18} />} label="Question Text" name="text" value={questionData.text} onChange={handleChange} textarea required />
                    
                    {/* Media Upload */}
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">Media (Optional)</label>
                        <div className="flex items-center gap-4 p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                            <UploadCloud className="text-gray-400" />
                            <input type="file" onChange={handleFileChange} accept="image/*,video/*" className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
                        </div>
                        {mediaFile && <p className="text-xs mt-1 text-gray-500">Selected: {mediaFile.name}</p>}
                        {questionData.media?.url && !mediaFile && <p className="text-xs mt-1 text-green-600">Current media: {questionData.media.url}</p>}
                    </div>

                    <FormField icon={<HelpCircle size={18} />} label="Question Type" name="questionType" value={questionData.questionType} onChange={handleChange} as="select">
                        <option value="multiple-choice">Multiple Choice</option>
                        <option value="true-false">True/False</option>
                        <option value="fill-in-the-blank">Fill in the Blank</option>
                    </FormField>

                    {questionData.questionType === 'multiple-choice' && (
                        <div>
                            <label className="block text-sm font-medium mb-2">Options</label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {questionData.options.map((opt, i) => (
                                    <input key={i} type="text" value={opt} onChange={e => handleOptionChange(i, e.target.value)} placeholder={`Option ${i + 1}`} className="w-full p-2 bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 rounded-md" required />
                                ))}
                            </div>
                            <FormField label="Correct Answer" name="correctAnswer" value={questionData.correctAnswer} onChange={handleChange} as="select" className="mt-4">
                                {questionData.options.map((_, i) => <option key={i} value={i}>Option {i + 1}</option>)}
                            </FormField>
                        </div>
                    )}
                    {questionData.questionType === 'true-false' && (
                        <FormField label="Correct Answer" name="correctAnswer" value={questionData.correctAnswer} onChange={handleChange} as="select">
                            <option value="true">True</option>
                            <option value="false">False</option>
                        </FormField>
                    )}
                    {questionData.questionType === 'fill-in-the-blank' && (
                        <FormField label="Correct Answer" name="correctAnswer" value={questionData.correctAnswer} onChange={handleChange} placeholder="Enter the exact correct answer" required />
                    )}

                    <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
                        <button type="submit" disabled={uploading} className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition disabled:opacity-50">
                            <Save size={16} /> {uploading ? 'Uploading...' : (isEditMode ? 'Save Changes' : 'Add Question')}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

// Generic FormField component for the modal
const FormField = ({ icon, label, name, value, onChange, placeholder, type = "text", textarea = false, as = "input", children, ...props }) => {
    const InputComponent = as === 'select' ? 'select' : textarea ? 'textarea' : 'input';
    return (
        <div>
            <label htmlFor={name} className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">{label}</label>
            <div className="relative">
                {icon && <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">{icon}</div>}
                <InputComponent
                    id={name}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    type={type}
                    rows={textarea ? 4 : undefined}
                    className={`w-full p-2 ${icon ? 'pl-10' : ''} bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition`}
                    {...props}
                >
                    {children}
                </InputComponent>
            </div>
        </div>
    );
};
