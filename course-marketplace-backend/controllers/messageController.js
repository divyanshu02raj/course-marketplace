// course-marketplace-backend\controllers\messageController.js
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

// Finds a direct conversation between two users, or creates one if it doesn't exist.
exports.findOrCreateConversation = async (req, res) => {
    const { recipientId } = req.body;
    const senderId = req.user._id;

    try {
        // The $all operator finds documents where the participants array contains both users, regardless of order.
        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, recipientId] },
            course: null // Differentiates direct messages from course-specific conversations.
        });

        if (!conversation) {
            conversation = new Conversation({
                participants: [senderId, recipientId],
            });
            await conversation.save();
        }
        
        await conversation.populate('participants', 'name profileImage');
        res.status(200).json(conversation);

    } catch (error) {
        console.error("Error in findOrCreateConversation:", error);
        res.status(500).json({ message: "Error finding or creating conversation." });
    }
};

// Gets all conversations for the logged-in user, for displaying in a chat list.
exports.getConversations = async (req, res) => {
    try {
        const conversations = await Conversation.find({ participants: req.user._id })
            .populate('participants', 'name profileImage')
            .populate('course', 'title')
            // Sort by the most recent message to show active conversations first.
            .sort({ 'lastMessage.timestamp': -1 });
        res.json(conversations);
    } catch (error)
    {
        console.error("Error in getConversations:", error);
        res.status(500).json({ message: "Error fetching conversations." });
    }
};

exports.getMessagesForConversation = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const messages = await Message.find({ conversation: conversationId })
            .populate('sender', 'name profileImage')
            .sort({ createdAt: 'asc' });
        res.json(messages);
    } catch (error) {
        console.error("Error in getMessagesForConversation:", error);
        res.status(500).json({ message: "Error fetching messages." });
    }
};

// Persists a new message to the DB and broadcasts it via WebSockets for real-time delivery.
exports.sendMessage = async (req, res) => {
    try {
        const { recipientId, text } = req.body;
        const senderId = req.user._id;

        // Use findOneAndUpdate with upsert to efficiently find or create the conversation.
        let conversation = await Conversation.findOneAndUpdate(
            {
                participants: { $all: [senderId, recipientId] },
                course: null
            },
            { 
                $set: { participants: [senderId, recipientId] }
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        const newMessage = new Message({
            conversation: conversation._id,
            sender: senderId,
            text,
            readBy: [senderId]
        });
        
        // Update the conversation's last message for sorting and previewing in the UI.
        conversation.lastMessage = {
            text,
            sender: senderId,
            timestamp: new Date()
        };

        await Promise.all([newMessage.save(), conversation.save()]);
        
        const populatedMessage = await newMessage.populate('sender', 'name profileImage');

        // After saving, emit the message via Socket.IO to the recipient in real-time.
        const io = req.app.get('socketio');
        io.to(conversation._id.toString()).emit("newMessage", populatedMessage);

        res.status(201).json(populatedMessage);
    } catch (error) {
        console.error("Error in sendMessage:", error);
        res.status(500).json({ message: "Error sending message." });
    }
};

// Creates a new group conversation and sends an initial message to all students in a course.
exports.sendBroadcastMessage = async (req, res) => {
    const { courseId } = req.params;
    const { text } = req.body;
    const instructorId = req.user._id;

    try {
        const course = await Course.findById(courseId);
        if (!course || course.instructor.toString() !== instructorId.toString()) {
            return res.status(403).json({ message: "Unauthorized." });
        }

        const enrollments = await Enrollment.find({ course: courseId }).select('user');
        const studentIds = enrollments.map(e => e.user);

        const participants = [instructorId, ...studentIds];

        // This creates a new conversation every time, intended for one-off announcements.
        const conversation = new Conversation({
            participants,
            course: courseId,
        });

        const newMessage = new Message({
            conversation: conversation._id,
            sender: instructorId,
            text,
            readBy: [instructorId]
        });
        
        conversation.lastMessage = { text, sender: instructorId, timestamp: new Date() };

        await Promise.all([newMessage.save(), conversation.save()]);
        
        const populatedMessage = await newMessage.populate('sender', 'name profileImage');

        // Broadcast the message to all participants in the newly created conversation room.
        const io = req.app.get('socketio');
        io.to(conversation._id.toString()).emit("newMessage", populatedMessage);

        res.status(201).json({ message: "Broadcast message sent successfully." });
    } catch (error) {
        console.error("Error in sendBroadcastMessage:", error);
        res.status(500).json({ message: "Error sending broadcast message." });
    }
};