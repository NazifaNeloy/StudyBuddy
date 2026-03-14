const roomHandler = require('./roomHandler');
const notificationHandler = require('./notificationHandler');

module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log(`User connected: ${socket.id}`);

        // Register event handlers
        roomHandler(io, socket);
        notificationHandler(io, socket);

        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.id}`);
        });
    });
};
