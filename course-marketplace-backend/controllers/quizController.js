// controllers/quizController.js
const Quiz = require('../models/Quiz');
const QuizQuestion = require('../models/QuizQuestion');
const QuizAttempt = require('../models/QuizAttempt');
const Lesson = require('../models/Lesson');
const Course = require('../models/Course');

// --- Instructor Functions ---

// Get or create a quiz for a lesson, including its questions
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

// Add a question to a quiz
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

        // After adding a question, update the lesson to show it has a quiz
        const quiz = await Quiz.findById(quizId);
        if (quiz) {
            await Lesson.findByIdAndUpdate(quiz.lesson, { hasQuiz: true });
        }

        res.status(201).json(newQuestion);
    } catch (error) {
        res.status(400).json({ message: "Error adding question.", error: error.message });
    }
};

// Update a question
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

// Delete a question
exports.deleteQuestion = async (req, res) => {
    try {
        const { questionId } = req.params;
        const deleted = await QuizQuestion.findByIdAndDelete(questionId);
        if (!deleted) return res.status(404).json({ message: "Question not found" });

        // After deleting, check if it was the last question
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

// Get a quiz for a student to take (without correct answers)
exports.getQuizForStudent = async (req, res) => {
    try {
        const { lessonId } = req.params;
        const quiz = await Quiz.findOne({ lesson: lessonId });
        if (!quiz) return res.status(404).json({ message: "No quiz found for this lesson." });

        // Select all fields EXCEPT the correctAnswer
        const questions = await QuizQuestion.find({ quiz: quiz._id }).select('-correctAnswer');
        res.json({ quiz, questions });
    } catch (error) {
        res.status(500).json({ message: "Error fetching quiz.", error: error.message });
    }
};

// Submit a quiz attempt and get the score
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
