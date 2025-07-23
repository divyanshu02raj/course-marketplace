// controllers/questionController.js
const Question = require("../models/Question");
const Course = require("../models/Course");
const mongoose = require("mongoose");

// Get questions for a specific lesson
exports.getQuestionsForLesson = async (req, res) => {
    try {
        const { lessonId } = req.params;
        const { _id: userId, role } = req.user;

        let query = { lesson: lessonId };

        // If the user is a student, they only see their own questions.
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

// Ask a new question
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
        // Populate the user details before sending back
        await savedQuestion.populate("user", "name profileImage");
        res.status(201).json(savedQuestion);
    } catch (error) {
        console.error("Ask Question Error:", error);
        res.status(500).json({ message: "Error posting question." });
    }
};

// Answer a question
exports.answerQuestion = async (req, res) => {
    const { questionId } = req.params;
    const { text } = req.body;
    const userId = req.user._id;

    // 1. Add validation for the answer text
    if (!text || text.trim() === "") {
        return res.status(400).json({ message: "Answer text cannot be empty." });
    }

    try {
        const question = await Question.findById(questionId).populate('course');

        if (!question) {
            return res.status(404).json({ message: "Question not found." });
        }

        // 2. Security Check: Only the course instructor can answer.
        if (question.course.instructor.toString() !== userId.toString()) {
            return res.status(403).json({ message: "You are not authorized to answer this question." });
        }

        const newAnswer = {
            user: userId,
            text,
        };

        question.answers.push(newAnswer);
        const savedQuestion = await question.save();
        
        // 3. Populate user details in the newly added answer to send back to the client
        const populatedQuestion = await Question.findById(savedQuestion._id)
            .populate("user", "name profileImage")
            .populate("answers.user", "name profileImage");

        res.status(201).json(populatedQuestion);

    } catch (error) {
        console.error("Answer Question Error:", error);
        // Provide a more detailed error message for the developer
        res.status(500).json({ message: "An error occurred while posting the answer.", error: error.message });
    }
};

// NEW FILE: controllers/noteController.js
const Note = require("../models/Note");

// Get or create a note for a lesson
exports.getNoteForLesson = async (req, res) => {
    try {
        let note = await Note.findOne({
            user: req.user._id,
            lesson: req.params.lessonId,
        });
        if (!note) {
            // If no note exists, create one
            note = new Note({
                user: req.user._id,
                lesson: req.params.lessonId,
                course: req.query.courseId, // Pass courseId as a query param
                content: "",
            });
            await note.save();
        }
        res.json(note);
    } catch (error) {
        res.status(500).json({ message: "Error fetching note." });
    }
};

// Save a note's content
exports.saveNote = async (req, res) => {
    try {
        const { content } = req.body;
        const note = await Note.findOneAndUpdate(
            { user: req.user._id, lesson: req.params.lessonId },
            { content },
            { new: true, upsert: true } // upsert: true creates the doc if it doesn't exist
        );
        res.json(note);
    } catch (error) {
        res.status(500).json({ message: "Error saving note." });
    }
};
