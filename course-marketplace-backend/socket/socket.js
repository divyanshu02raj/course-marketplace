// socket/socket.js
const { Server } = require("socket.io");

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

        socket.on("addUser", (userId) => {
            onlineUsers.set(userId, socket.id);
            console.log(`User ${userId} is online.`);
        });

        // ✅ NEW: Listen for typing events
        socket.on('startTyping', ({ conversationId, recipientId }) => {
            const recipientSocketId = onlineUsers.get(recipientId);
            if (recipientSocketId) {
                io.to(recipientSocketId).emit('typing', { conversationId });
            }
        });

        socket.on('stopTyping', ({ conversationId, recipientId }) => {
            const recipientSocketId = onlineUsers.get(recipientId);
            if (recipientSocketId) {
                io.to(recipientSocketId).emit('stopTyping', { conversationId });
            }
        });

        socket.on("disconnect", () => {
            console.log("A user disconnected:", socket.id);
            for (let [userId, socketId] of onlineUsers.entries()) {
                if (socketId === socket.id) {
                    onlineUsers.delete(userId);
                    break;
                }
            }
        });
    });

    return { io, onlineUsers };
};

module.exports = initializeSocket;