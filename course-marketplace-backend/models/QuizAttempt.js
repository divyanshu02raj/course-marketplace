// NEW FILE: models/QuizAttempt.js
const mongoose = require("mongoose");

const QuizAttemptSchema = new mongoose.Schema({
    quiz: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Quiz", 
        required: true 
    },
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
    score: {
        type: Number,
        required: true
    },
    totalQuestions: {
        type: Number,
        required: true
    },
    answers: [{
        question: { type: mongoose.Schema.Types.ObjectId, ref: 'QuizQuestion' },
        selectedAnswer: String,
        isCorrect: Boolean
    }]
}, { timestamps: true });

// A user can attempt a quiz multiple times, so no unique index here.

module.exports = mongoose.model("QuizAttempt", QuizAttemptSchema);