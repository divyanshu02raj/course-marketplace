// course-marketplace-backend/controllers/assessmentController.js
const Assessment = require('../models/Assessment');
const AssessmentQuestion = require('../models/AssessmentQuestion');
const AssessmentAttempt = require('../models/AssessmentAttempt');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const Certificate = require('../models/Certificate');
const Lesson = require('../models/Lesson');
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

// --- INSTRUCTOR-FACING FUNCTIONS ---

exports.uploadMedia = (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded.' });
    }
    res.status(201).json({
        mediaType: req.file.mimetype.startsWith('image') ? 'image' : 'video',
        url: req.file.path
    });
};

// Finds an assessment for a course, or creates a new one if it doesn't exist.
exports.getOrCreateAssessmentForCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const instructorId = req.user._id;
        const course = await Course.findOne({ _id: courseId, instructor: instructorId });
        if (!course) {
            return res.status(403).json({ message: "You are not authorized to manage this course." });
        }
        let assessment = await Assessment.findOne({ course: courseId }).populate('questions');
        if (!assessment) {
            assessment = new Assessment({
                course: courseId,
                title: `${course.title} - Final Assessment`,
            });
            await assessment.save();
        }
        res.json(assessment);
    } catch (error) {
        console.error("Get/Create Assessment Error:", error);
        res.status(500).json({ message: "Server error while handling assessment." });
    }
};

exports.addQuestionToAssessment = async (req, res) => {
    try {
        const { assessmentId } = req.params;
        const { text, media, questionType, options, correctAnswer } = req.body;
        const assessment = await Assessment.findById(assessmentId).populate('course');
        if (!assessment || assessment.course.instructor.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Unauthorized." });
        }
        const newQuestion = new AssessmentQuestion({
            assessment: assessmentId, text, media, questionType, options, correctAnswer,
        });
        await newQuestion.save();
        assessment.questions.push(newQuestion._id);
        await assessment.save();
        res.status(201).json(newQuestion);
    } catch (error) {
        console.error("Add Question Error:", error);
        res.status(500).json({ message: "Error adding question." });
    }
};

exports.updateQuestion = async (req, res) => {
    try {
        const { questionId } = req.params;
        const updates = req.body;
        const question = await AssessmentQuestion.findById(questionId).populate({
            path: 'assessment', populate: { path: 'course' }
        });
        if (!question || !question.assessment || !question.assessment.course || question.assessment.course.instructor.toString() !== req.user._id.toString()) {
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
        if (!question || !question.assessment || !question.assessment.course || question.assessment.course.instructor.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Unauthorized." });
        }
        // First, pull the question reference from the assessment array to prevent orphaned data.
        await Assessment.updateOne({ _id: question.assessment._id }, { $pull: { questions: questionId } });
        // Then, delete the question document itself.
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
            path: 'questions',
            select: '-correctAnswer' // Critically, ensure correct answers are NOT sent to the student.
        });
        if (!assessment) return res.status(404).json({ message: "Assessment not found." });
        res.json(assessment);
    } catch (error) {
        console.error("Get Assessment for Student Error:", error);
        res.status(500).json({ message: "Server error." });
    }
};

// Processes a student's assessment submission: scores it, records the attempt, and issues a certificate on passing.
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
            const studentAnswerObj = answers.find(a => a.questionId === question._id.toString());
            if (studentAnswerObj && studentAnswerObj.answer && question.correctAnswer &&
                studentAnswerObj.answer.toLowerCase() === question.correctAnswer.toLowerCase()) {
                correctCount++;
            }
        });

        const score = totalQuestions > 0 ? (correctCount / totalQuestions) * 100 : 0;
        const passed = score >= assessment.passingScore;

        const attempt = new AssessmentAttempt({
            assessment: assessmentId, student: studentId, answers: answers.map(a => ({ question: a.questionId, answer: a.answer })), score, passed
        });
        await attempt.save();

        let certificateId = null;
        if (passed) {
            let certificate = await Certificate.findOne({ user: studentId, course: assessment.course });
            if (!certificate) {
                // Issue a new, unique certificate if one doesn't already exist for this user/course.
                certificate = new Certificate({
                    user: studentId,
                    course: assessment.course,
                    certificateId: uuidv4(),
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

// Gathers all data needed for the student's "Assessments" dashboard page.
exports.getAssessmentsForStudentDashboard = async (req, res) => {
    try {
        const studentId = req.user._id;
        const enrollments = await Enrollment.find({ user: studentId }).select('course completedLessons');
        const courseIds = enrollments.map(e => e.course);
        
        const assessments = await Assessment.find({ course: { $in: courseIds } })
            .populate({ path: 'course', select: 'title thumbnail' })
            .lean();
            
        const attempts = await AssessmentAttempt.find({ student: studentId }).lean();
        const certificates = await Certificate.find({ user: studentId, course: { $in: courseIds } }).lean();

        // For each assessment, determine its current status (Locked, Not Started, Completed, etc.)
        const assessmentsWithStatus = await Promise.all(assessments.map(async (assessment) => {
            if (!assessment.course) return null;

            // Perform a live lesson count to accurately check if the assessment is unlocked.
            const lessonsInCourse = await Lesson.countDocuments({ course: assessment.course._id });
            
            const enrollment = enrollments.find(e => e.course._id.toString() === assessment.course._id.toString());
            const lessonsCompleted = enrollment ? enrollment.completedLessons.length : 0;
            
            let status = "Locked";
            if (lessonsInCourse > 0 && lessonsCompleted >= lessonsInCourse) {
                 status = "Not Started";
            }

            let attempt = attempts.find(a => a.assessment.toString() === assessment._id.toString());
            if (attempt) {
                status = attempt.passed ? "Completed" : "Failed";
                if (attempt.passed) {
                    const certificate = certificates.find(c => c.course.toString() === assessment.course._id.toString());
                    if (certificate) attempt.certificateId = certificate.certificateId;
                }
            }
            return { ...assessment, status, attempt };
        }));

        res.json(assessmentsWithStatus.filter(Boolean)); // Filter out any nulls that may result from deleted courses.

    } catch (error) {
        console.error("Get Student Assessments Error:", error);
        res.status(500).json({ message: "Error fetching assessments." });
    }
};