//course-marketplace-backend\routes\assessmentRoutes.js
const express = require('express');
const router = express.Router();
const { protect, instructorOnly } = require('../middleware/authMiddleware');
const upload = require('../config/cloudinary');

const {
    getOrCreateAssessmentForCourse,
    addQuestionToAssessment,
    updateQuestion,
    deleteQuestion,
    uploadMedia,
    getAssessmentForStudent,
    submitAssessment,
    getAssessmentsForStudentDashboard
} = require('../controllers/assessmentController');

// --- Instructor Routes ---
router.post('/upload-media', protect, instructorOnly, upload.single('media'), uploadMedia);
router.get('/course/:courseId', protect, instructorOnly, getOrCreateAssessmentForCourse);
router.post('/:assessmentId/questions', protect, instructorOnly, addQuestionToAssessment);
router.patch('/questions/:questionId', protect, instructorOnly, updateQuestion);
router.delete('/questions/:questionId', protect, instructorOnly, deleteQuestion);

// --- Student Routes ---
router.get('/my-assessments', protect, getAssessmentsForStudentDashboard);
router.get('/:assessmentId/take', protect, getAssessmentForStudent);
router.post('/:assessmentId/submit', protect, submitAssessment);

module.exports = router;