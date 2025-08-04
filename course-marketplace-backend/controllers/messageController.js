const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

// Find or create a direct conversation between two users
exports.findOrCreateConversation = async (req, res) => {
    const { recipientId } = req.body;
    const senderId = req.user._id;

    try {
        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, recipientId] },
            course: null // Ensure it's a direct message, not a course broadcast
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

// Get all conversations for the logged-in user
exports.getConversations = async (req, res) => {
    try {
        const conversations = await Conversation.find({ participants: req.user._id })
            .populate('participants', 'name profileImage')
            .populate('course', 'title')
            .sort({ 'lastMessage.timestamp': -1 });
        res.json(conversations);
    } catch (error) {
        console.error("Error in getConversations:", error);
        res.status(500).json({ message: "Error fetching conversations." });
    }
};

// Get all messages for a specific conversation
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

// Send a new direct message
exports.sendMessage = async (req, res) => {
    try {
        const { recipientId, text } = req.body;
        const senderId = req.user._id;

        // 1. Find or create the conversation
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

        // 2. Create the new message
        const newMessage = new Message({
            conversation: conversation._id,
            sender: senderId,
            text,
            readBy: [senderId]
        });
        
        // 3. Update the conversation's last message
        conversation.lastMessage = {
            text,
            sender: senderId,
            timestamp: new Date()
        };

        // 4. Save both the new message and the updated conversation
        await Promise.all([newMessage.save(), conversation.save()]);
        
        // 5. Populate the sender's details for the frontend
        const populatedMessage = await newMessage.populate('sender', 'name profileImage');

        // ** THIS IS THE CRITICAL FIX **
        // 6. Get the io instance and emit the message to the conversation room
        const io = req.app.get('socketio');
        io.to(conversation._id.toString()).emit("newMessage", populatedMessage);
        // -----------------------------

        res.status(201).json(populatedMessage);
    } catch (error) {
        console.error("Error in sendMessage:", error);
        res.status(500).json({ message: "Error sending message." });
    }
};

// Send a broadcast message to all students in a course
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

        // Emit broadcast to the new conversation room
        const io = req.app.get('socketio');
        io.to(conversation._id.toString()).emit("newMessage", populatedMessage);

        res.status(201).json({ message: "Broadcast message sent successfully." });
    } catch (error) {
        console.error("Error in sendBroadcastMessage:", error);
        res.status(500).json({ message: "Error sending broadcast message." });
    }
};
