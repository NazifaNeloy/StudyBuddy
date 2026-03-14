const User = require('../models/User');

// Global mapping of Database User ID -> Active Socket ID
// This is critical for sending private, targeted real-time alerts
const activeUsers = new Map();

module.exports = (io, socket) => {
    
    // 1. User registers their socket connection
    socket.on('register_user', (userId) => {
        if (userId) {
            activeUsers.set(userId, socket.id);
            console.log(`User ${userId} registered for notifications on socket ${socket.id}`);
        }
    });

    // Handle generic disconnect to clean up the map
    socket.on('disconnect', () => {
        for (const [userId, socketId] of activeUsers.entries()) {
            if (socketId === socket.id) {
                activeUsers.delete(userId);
                break;
            }
        }
    });

    // 2. Mock handle sending a friend request
    // In a real app, this would also write to the relationships/friendships table
    socket.on('send_friend_request', async ({ senderId, receiverId, senderName }) => {
        try {
            // Write alert to DB first
             const notif = await User.createNotification(
                receiverId, 
                'friend_request', 
                `${senderName} sent you a friend request!`
            );

            // If user is online, emit exact notification directly to them
            const receiverSocketId = activeUsers.get(receiverId);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit('new_notification', notif);
            }
        } catch (error) {
            console.error('Error sending friend request notification:', error);
        }
    });

};

// Export the activeUsers map so other handlers (like roomHandler) can push notifications
module.exports.activeUsers = activeUsers;
