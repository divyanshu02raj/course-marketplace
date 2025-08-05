const Assessment = require('../models/Assessment');
const AssessmentQuestion = require('../models/AssessmentQuestion');
const AssessmentAttempt = require('../models/AssessmentAttempt');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const Certificate = require('../models/Certificate');
const Lesson = require('../models/Lesson');
const mongoose = require('mongoose');

// --- INSTRUCTOR FUNCTIONS ---
// (No changes needed for instructor functions)
exports.uploadMedia = (req, res) => {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded.' });
    res.status(201).json({ mediaType: req.file.mimetype.startsWith('image') ? 'image' : 'video', url: req.file.path });
};
exports.getOrCreateAssessmentForCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const course = await Course.findOne({ _id: courseId, instructor: req.user._id });
        if (!course) return res.status(403).json({ message: "Unauthorized." });
        let assessment = await Assessment.findOne({ course: courseId }).populate('questions');
        if (!assessment) {
            assessment = new Assessment({ course: courseId, title: `${course.title} - Final Assessment` });
            await assessment.save();
        }
        res.json(assessment);
    } catch (error) { res.status(500).json({ message: "Server error." }); }
};
exports.addQuestionToAssessment = async (req, res) => {
    try {
        const { assessmentId } = req.params;
        const assessment = await Assessment.findById(assessmentId).populate('course');
        if (!assessment || assessment.course.instructor.toString() !== req.user._id.toString()) return res.status(403).json({ message: "Unauthorized." });
        const newQuestion = new AssessmentQuestion({ assessment: assessmentId, ...req.body });
        await newQuestion.save();
        assessment.questions.push(newQuestion._id);
        await assessment.save();
        res.status(201).json(newQuestion);
    } catch (error) { res.status(500).json({ message: "Error adding question." }); }
};

exports.updateQuestion = async (req, res) => {
    try {
        const { questionId } = req.params;
        const updates = req.body;
        const question = await AssessmentQuestion.findById(questionId).populate({
            path: 'assessment', populate: { path: 'course' }
        });
        if (!question || question.assessment.course.instructor.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Unauthorized." });
        }
        Object.assign(question, updates);
        await question.save();
        res.json(question);
    } catch (error) {
        console.error("Update Question Error:", error);
        res.status(500).json({ message: "Error updating question." });
    }
};

exports.deleteQuestion = async (req, res) => {
    try {
        const { questionId } = req.params;
        const question = await AssessmentQuestion.findById(questionId).populate({
            path: 'assessment', populate: { path: 'course' }
        });
        if (!question || question.assessment.course.instructor.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Unauthorized." });
        }
        await Assessment.updateOne({ _id: question.assessment._id }, { $pull: { questions: questionId } });
        await AssessmentQuestion.findByIdAndDelete(questionId);
        res.json({ message: "Question deleted successfully." });
    } catch (error) {
        console.error("Delete Question Error:", error);
        res.status(500).json({ message: "Error deleting question." });
    }
};


// --- STUDENT-FACING FUNCTIONS ---

exports.getAssessmentForStudent = async (req, res) => {
    try {
        const { assessmentId } = req.params;
        const assessment = await Assessment.findById(assessmentId).populate({
            path: 'questions', select: '-correctAnswer' 
        });
        if (!assessment) return res.status(404).json({ message: "Assessment not found." });
        res.json(assessment);
    } catch (error) {
        console.error("Get Assessment for Student Error:", error);
        res.status(500).json({ message: "Server error." });
    }
};

exports.submitAssessment = async (req, res) => {
    try {
        const { assessmentId } = req.params;
        const { answers } = req.body;
        const studentId = req.user._id;

        const assessment = await Assessment.findById(assessmentId).populate('questions');
        if (!assessment) return res.status(404).json({ message: "Assessment not found." });

        let correctCount = 0;
        const totalQuestions = assessment.questions.length;
        assessment.questions.forEach(question => {
            const studentAnswer = answers.find(a => a.questionId === question._id.toString());
            if (studentAnswer && studentAnswer.answer.toLowerCase() === question.correctAnswer.toLowerCase()) {
                correctCount++;
            }
        });

        const score = totalQuestions > 0 ? (correctCount / totalQuestions) * 100 : 0;
        const passed = score >= assessment.passingScore;

        const attempt = new AssessmentAttempt({
            assessment: assessmentId,
            student: studentId,
            answers: answers.map(a => ({ question: a.questionId, answer: a.answer })),
            score,
            passed
        });
        await attempt.save();

        let certificateId = null;
        if (passed) {
            let certificate = await Certificate.findOne({ user: studentId, course: assessment.course });
            if (!certificate) {
                certificate = new Certificate({
                    user: studentId,
                    course: assessment.course,
                });
                await certificate.save();
            }
            certificateId = certificate.certificateId;
        }

        res.status(200).json({
            score, passed, correctCount, totalQuestions, passingScore: assessment.passingScore, certificateId
        });
    } catch (error) {
        console.error("Submit Assessment Error:", error);
        res.status(500).json({ message: "Error submitting assessment." });
    }
};

exports.getAssessmentsForStudentDashboard = async (req, res) => {
    try {
        const studentId = req.user._id;
        const enrollments = await Enrollment.find({ user: studentId }).select('course progress').lean();
        const courseIds = enrollments.map(e => e.course);

        const assessments = await Assessment.find({ course: { $in: courseIds } })
            .populate('course', 'title thumbnail')
            .lean();
        
        const attempts = await AssessmentAttempt.find({ student: studentId }).lean();
        const certificates = await Certificate.find({ user: studentId, course: { $in: courseIds } }).lean();

        const assessmentsWithStatus = assessments.map(assessment => {
            const enrollment = enrollments.find(e => e.course.toString() === assessment.course._id.toString());
            const attempt = attempts.find(a => a.assessment.toString() === assessment._id.toString());
            
            let status = "Locked"; // Default status

            if (enrollment && enrollment.progress === 100) {
                status = "Not Started"; // Unlock if progress is 100%
                if (attempt) {
                    status = attempt.passed ? "Completed" : "Failed";
                }
            }
            
            if (status === "Completed") {
                const certificate = certificates.find(c => c.course.toString() === assessment.course._id.toString());
                if (certificate) {
                    // Attach certificateId to the attempt object for the frontend
                    if (attempt) attempt.certificateId = certificate.certificateId;
                }
            }
            
            return { ...assessment, status, attempt };
        });

        res.json(assessmentsWithStatus);
    } catch (error) {
        console.error("Get Student Assessments Error:", error);
        res.status(500).json({ message: "Error fetching assessments." });
    }
};
