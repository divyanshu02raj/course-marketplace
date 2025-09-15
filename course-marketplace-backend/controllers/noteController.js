// course-marketplace-backend\controllers\noteController.js
const Note = require("../models/Note");

// Fetches a student's note for a specific lesson. If one doesn't exist, it creates an empty one.
exports.getNoteForLesson = async (req, res) => {
    try {
        let note = await Note.findOne({
            user: req.user._id,
            lesson: req.params.lessonId,
        });

        // This ensures the frontend always receives a note object to work with.
        if (!note) {
            note = new Note({
                user: req.user._id,
                lesson: req.params.lessonId,
                course: req.query.courseId,
                content: "",
            });
            await note.save();
        }
        res.json(note);
    } catch (error) {
        console.error("Get Note Error:", error);
        res.status(500).json({ message: "Error fetching note." });
    }
};

// Saves or updates a student's note for a lesson.
exports.saveNote = async (req, res) => {
    try {
        const { content, courseId } = req.body;
        
        // Use an atomic 'upsert' operation to find and update a note, or create it if it doesn't exist.
        // - $set: updates the content on every save.
        // - $setOnInsert: sets the core fields only when the document is first created.
        const note = await Note.findOneAndUpdate(
            { user: req.user._id, lesson: req.params.lessonId },
            { 
                $set: { content: content },
                $setOnInsert: {
                    user: req.user._id,
                    lesson: req.params.lessonId,
                    course: courseId
                }
            },
            { new: true, upsert: true }
        );
        res.json(note);
    } catch (error) {
        console.error("Save Note Error:", error);
        res.status(500).json({ message: "Error saving note." });
    }
};