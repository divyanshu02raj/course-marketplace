// controllers/noteController.js
const Note = require("../models/Note");

// Get or create a note for a lesson for the logged-in user
exports.getNoteForLesson = async (req, res) => {
    try {
        let note = await Note.findOne({
            user: req.user._id,
            lesson: req.params.lessonId,
        });

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

// Save a note's content
exports.saveNote = async (req, res) => {
    try {
        const { content, courseId } = req.body; // Get courseId from the request body
        
        // Find the note for the current user and lesson, and update its content.
        // The 'upsert: true' option will create the document if it doesn't exist.
        // We use $setOnInsert to make sure the required fields are set on creation.
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
