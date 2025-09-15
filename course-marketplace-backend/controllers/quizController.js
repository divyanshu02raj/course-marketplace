// course-marketplace-backend\controllers\quizController.js
const Quiz = require('../models/Quiz');
const QuizQuestion = require('../models/QuizQuestion');
const QuizAttempt = require('../models/QuizAttempt');
const Lesson = require('../models/Lesson');
const Course = require('../models/Course');

// --- Instructor Functions ---

// For an instructor, finds the quiz for a lesson or creates a new one if it doesn't exist.
exports.getQuizForLesson = async (req, res) => {
    try {
        const { lessonId } = req.params;
        let quiz = await Quiz.findOne({ lesson: lessonId });

        if (!quiz) {
            const lesson = await Lesson.findById(lessonId);
            if (!lesson) return res.status(404).json({ message: "Lesson not found" });

            quiz = new Quiz({
                lesson: lessonId,
                course: lesson.course,
                title: `${lesson.title} Quiz`
            });
            await quiz.save();
        }

        const questions = await QuizQuestion.find({ quiz: quiz._id });
        res.json({ quiz, questions });
    } catch (error) {
        res.status(500).json({ message: "Error fetching quiz data.", error: error.message });
    }
};

exports.addQuestionToQuiz = async (req, res) => {
    try {
        const { quizId } = req.params;
        const { questionText, options, correctAnswer } = req.body;

        const newQuestion = new QuizQuestion({
            quiz: quizId,
            questionText,
            options,
            correctAnswer
        });
        await newQuestion.save();

        // After adding the first question, mark the parent lesson as having a quiz.
        const quiz = await Quiz.findById(quizId);
        if (quiz) {
            await Lesson.findByIdAndUpdate(quiz.lesson, { hasQuiz: true });
        }

        res.status(201).json(newQuestion);
    } catch (error) {
        res.status(400).json({ message: "Error adding question.", error: error.message });
    }
};

exports.updateQuestion = async (req, res) => {
    try {
        const { questionId } = req.params;
        const updatedQuestion = await QuizQuestion.findByIdAndUpdate(questionId, req.body, { new: true });
        if (!updatedQuestion) return res.status(404).json({ message: "Question not found" });
        res.json(updatedQuestion);
    } catch (error) {
        res.status(400).json({ message: "Error updating question.", error: error.message });
    }
};

exports.deleteQuestion = async (req, res) => {
    try {
        const { questionId } = req.params;
        const deleted = await QuizQuestion.findByIdAndDelete(questionId);
        if (!deleted) return res.status(404).json({ message: "Question not found" });

        // If that was the last question in the quiz, update the parent lesson.
        const remainingQuestions = await QuizQuestion.countDocuments({ quiz: deleted.quiz });
        if (remainingQuestions === 0) {
            const quiz = await Quiz.findById(deleted.quiz);
            if (quiz) {
                await Lesson.findByIdAndUpdate(quiz.lesson, { hasQuiz: false });
            }
        }

        res.json({ message: "Question deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting question.", error: error.message });
    }
};

// --- Student Functions ---

// Fetches a quiz for a student to take, ensuring correct answers are not included.
exports.getQuizForStudent = async (req, res) => {
    try {
        const { lessonId } = req.params;
        const quiz = await Quiz.findOne({ lesson: lessonId });
        if (!quiz) return res.status(404).json({ message: "No quiz found for this lesson." });

        // Crucially, select all fields EXCEPT the correctAnswer to prevent cheating.
        const questions = await QuizQuestion.find({ quiz: quiz._id }).select('-correctAnswer');
        res.json({ quiz, questions });
    } catch (error) {
        res.status(500).json({ message: "Error fetching quiz.", error: error.message });
    }
};

// Processes a student's quiz submission, calculates the score, and records the attempt.
exports.submitQuizAttempt = async (req, res) => {
    try {
        const { quizId } = req.params;
        const { answers } = req.body; // Expects an object like { questionId: "selectedOption", ... }
        const userId = req.user._id;

        const questions = await QuizQuestion.find({ quiz: quizId });
        if (questions.length === 0) {
            return res.status(404).json({ message: "Quiz has no questions." });
        }

        let score = 0;
        const attemptAnswers = [];

        // Compare student's answers against the correct answers safely on the server.
        for (const question of questions) {
            const selectedAnswer = answers[question._id];
            const isCorrect = selectedAnswer === question.correctAnswer;
            if (isCorrect) {
                score++;
            }
            attemptAnswers.push({
                question: question._id,
                selectedAnswer,
                isCorrect
            });
        }

        const newAttempt = new QuizAttempt({
            quiz: quizId,
            user: userId,
            score,
            totalQuestions: questions.length,
            answers: attemptAnswers
        });

        await newAttempt.save();
        res.status(201).json({
            message: "Quiz submitted successfully!",
            score,
            totalQuestions: questions.length,
            attemptId: newAttempt._id
        });
    } catch (error) {
        res.status(500).json({ message: "Error submitting quiz.", error: error.message });
    }
};