// course-marketplace-backend\controllers\questionController.js
const Question = require("../models/Question");
const Course = require("../models/Course");
const mongoose = require("mongoose");

// Fetches a list of all unanswered questions for an instructor's dashboard.
exports.getUnansweredQuestionsForInstructor = async (req, res) => {
    try {
        // First, find all courses taught by the logged-in instructor.
        const instructorCourses = await Course.find({ instructor: req.user._id }).select('_id');
        const courseIds = instructorCourses.map(c => c._id);

        // Then, find all questions in those courses that have no answers yet.
        const questions = await Question.find({
            course: { $in: courseIds },
            answers: { $size: 0 } // Finds documents where the 'answers' array is empty.
        })
        .populate("user", "name profileImage")
        .populate("course", "title")
        .populate("lesson", "title")
        .sort({ createdAt: 'asc' });

        res.json(questions);
    } catch (error) {
        console.error("Get Unanswered Questions Error:", error);
        res.status(500).json({ message: "Error fetching questions." });
    }
};

// Gets the Q&A thread for a lesson. Students can only see their own questions.
exports.getQuestionsForLesson = async (req, res) => {
    try {
        const { lessonId } = req.params;
        const { _id: userId, role } = req.user;

        let query = { lesson: lessonId };

        // An instructor sees all questions, but a student will only see their own.
        if (role === 'student') {
            query.user = userId;
        }

        const questions = await Question.find(query)
            .populate("user", "name profileImage")
            .populate("answers.user", "name profileImage")
            .sort({ createdAt: -1 });
            
        res.json(questions);
    } catch (error) {
        console.error("Get Questions Error:", error);
        res.status(500).json({ message: "Error fetching questions." });
    }
};

exports.askQuestion = async (req, res) => {
    try {
        const { lessonId } = req.params;
        const { title, text, courseId } = req.body;
        
        const newQuestion = new Question({
            course: courseId,
            lesson: lessonId,
            user: req.user._id,
            title,
            text,
        });

        const savedQuestion = await newQuestion.save();
        await savedQuestion.populate("user", "name profileImage");
        res.status(201).json(savedQuestion);
    } catch (error) {
        console.error("Ask Question Error:", error);
        res.status(500).json({ message: "Error posting question." });
    }
};

exports.answerQuestion = async (req, res) => {
    try {
        const { questionId } = req.params;
        const { text } = req.body;
        const userId = req.user._id;

        const question = await Question.findById(questionId).populate('course');
        if (!question) {
            return res.status(404).json({ message: "Question not found." });
        }

        // Only the course instructor is authorized to post an answer.
        if (question.course.instructor.toString() !== userId.toString()) {
            return res.status(403).json({ message: "You are not authorized to answer this question." });
        }

        const answer = {
            user: userId,
            text,
        };

        question.answers.push(answer);
        await question.save();
        
        await question.populate("user", "name profileImage");
        await question.populate("answers.user", "name profileImage");

        res.status(201).json(question);
    } catch (error) {
        console.error("Answer Question Error:", error);
        res.status(500).json({ message: "Error posting answer." });
    }
};