// course-marketplace-backend\socket\socket.js
const { Server } = require("socket.io");

// An in-memory map to track online users.
// Maps a userId to their unique socket.id.
const onlineUsers = new Map();

const initializeSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: process.env.ALLOWED_ORIGINS?.split(","),
            methods: ["GET", "POST"],
        },
    });

    io.on("connection", (socket) => {
        console.log("A user connected:", socket.id);

        // Event for a client to register their presence after connecting.
        socket.on("addUser", (userId) => {
            onlineUsers.set(userId, socket.id);
            console.log(`User ${userId} is online with socket ${socket.id}.`);
        });

        // Event for joining a room (conversation)
        // This allows us to broadcast messages to everyone in a specific chat.
        socket.on("joinConversation", (conversationId) => {
            socket.join(conversationId);
            console.log(`Socket ${socket.id} joined conversation ${conversationId}`);
        });

        // Listen for typing events and broadcast them to the recipient.
        socket.on('startTyping', ({ conversationId, recipientId }) => {
            const recipientSocketId = onlineUsers.get(recipientId);
            if (recipientSocketId) {
                // Emit only to the specific recipient, not everyone.
                io.to(recipientSocketId).emit('typing', { conversationId });
            }
        });

        socket.on('stopTyping', ({ conversationId, recipientId }) => {
            const recipientSocketId = onlineUsers.get(recipientId);
            if (recipientSocketId) {
                io.to(recipientSocketId).emit('stopTyping', { conversationId });
            }
        });

        // The built-in disconnect event fires when a user closes the connection.
        socket.on("disconnect", () => {
            console.log("A user disconnected:", socket.id);
            // Clean up by removing the user from the online list.
            for (let [userId, socketId] of onlineUsers.entries()) {
                if (socketId === socket.id) {
                    onlineUsers.delete(userId);
                    break;
                }
            }
        });
    });

    // Return the io instance so it can be attached to the app and used in controllers.
    return { io, onlineUsers };
};

module.exports = initializeSocket;