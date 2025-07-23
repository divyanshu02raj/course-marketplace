// NEW FILE: controllers/questionController.js
const Question = require("../models/Question");
const mongoose = require("mongoose");

// Get all questions for a specific lesson
exports.getQuestionsForLesson = async (req, res) => {
    try {
        const questions = await Question.find({ lesson: req.params.lessonId })
            .populate("user", "name profileImage")
            .populate("answers.user", "name profileImage")
            .sort({ createdAt: -1 });
        res.json(questions);
    } catch (error) {
        res.status(500).json({ message: "Error fetching questions." });
    }
};

// Post a new question
exports.askQuestion = async (req, res) => {
    try {
        const { title, text, courseId } = req.body;
        const newQuestion = new Question({
            course: courseId,
            lesson: req.params.lessonId,
            user: req.user._id,
            title,
            text,
        });
        const savedQuestion = await newQuestion.save();
        await savedQuestion.populate("user", "name profileImage");
        res.status(201).json(savedQuestion);
    } catch (error) {
        res.status(500).json({ message: "Error posting question." });
    }
};

// Post an answer to a question
exports.answerQuestion = async (req, res) => {
    try {
        const { text } = req.body;
        const question = await Question.findById(req.params.questionId);
        if (!question) {
            return res.status(404).json({ message: "Question not found." });
        }
        const answer = {
            user: req.user._id,
            text,
        };
        question.answers.push(answer);
        await question.save();
        await question.populate("answers.user", "name profileImage");
        res.status(201).json(question);
    } catch (error) {
        res.status(500).json({ message: "Error posting answer." });
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
