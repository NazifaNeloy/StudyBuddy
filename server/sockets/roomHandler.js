// In-memory store for active rooms
// In production, this would be Redis to support multi-instance scaling
const rooms = {};

const createRoomState = (roomId) => {
    return {
        id: roomId,
        users: [], // Array of { id, name, socketId }
        timer: {
            mode: 'focus', // 'focus' | 'break' | 'stopped'
            timeLeft: 25 * 60, // 25 minutes default focus
            isRunning: false,
            intervalId: null
        }
    };
};

module.exports = (io, socket) => {
    
    // --- Room Management ---
    
    socket.on('join_room', ({ roomId, user }) => {
        socket.join(roomId);
        
        // Initialize room if it doesn't exist
        if (!rooms[roomId]) {
            rooms[roomId] = createRoomState(roomId);
        }

        // Add user to room state (avoiding duplicates by socketId)
        const existingUser = rooms[roomId].users.find(u => u.socketId === socket.id);
        if (!existingUser) {
            rooms[roomId].users.push({ ...user, socketId: socket.id });
        }

        // Notify room that someone joined
        socket.to(roomId).emit('user_joined', { user, timestamp: new Date() });
        
        // Send current room state to the newly joined user
        socket.emit('room_state', {
            users: rooms[roomId].users,
            timer: {
                mode: rooms[roomId].timer.mode,
                timeLeft: rooms[roomId].timer.timeLeft,
                isRunning: rooms[roomId].timer.isRunning
            }
        });

        console.log(`User ${user.name} joined room ${roomId}`);
    });

    socket.on('leave_room', ({ roomId, user }) => {
        socket.leave(roomId);
        
        if (rooms[roomId]) {
            // Remove user from state
            rooms[roomId].users = rooms[roomId].users.filter(u => u.socketId !== socket.id);
            
            socket.to(roomId).emit('user_left', { user, timestamp: new Date() });
            
            // Clean up room if empty
            if (rooms[roomId].users.length === 0) {
                if (rooms[roomId].timer.intervalId) {
                    clearInterval(rooms[roomId].timer.intervalId);
                }
                delete rooms[roomId];
                console.log(`Room ${roomId} deleted (empty)`);
            }
        }
    });

    // Handle generic disconnect
    socket.on('disconnecting', () => {
        // Iterate through all rooms this socket was in
        for (const roomId of socket.rooms) {
            if (roomId !== socket.id && rooms[roomId]) {
                const user = rooms[roomId].users.find(u => u.socketId === socket.id);
                rooms[roomId].users = rooms[roomId].users.filter(u => u.socketId !== socket.id);
                
                if (user) {
                    socket.to(roomId).emit('user_left', { user, timestamp: new Date() });
                }

                if (rooms[roomId].users.length === 0) {
                    if (rooms[roomId].timer.intervalId) {
                        clearInterval(rooms[roomId].timer.intervalId);
                    }
                    delete rooms[roomId];
                }
            }
        }
    });

    // --- Messaging ---

    socket.on('send_message', (data) => {
        // data: { roomId, message, user }
        const { roomId, message, user } = data;
        
        const messageData = {
            id: Date.now().toString(),
            message,
            user,
            timestamp: new Date()
        };

        // Broadcast to everyone in the room EXCEPT sender
        socket.to(roomId).emit('receive_message', messageData);
        // Send back to sender so they can render it with verified server timestamp
        socket.emit('receive_message', messageData);
    });

    // --- Pomodoro Server Timer ---

    socket.on('start_timer', ({ roomId }) => {
        if (!rooms[roomId] || rooms[roomId].timer.isRunning) return;

        const roomTimer = rooms[roomId].timer;
        roomTimer.isRunning = true;

        io.to(roomId).emit('timer_started', { timeLeft: roomTimer.timeLeft, mode: roomTimer.mode });

        // Server is the single source of truth
        roomTimer.intervalId = setInterval(() => {
            roomTimer.timeLeft -= 1;

            if (roomTimer.timeLeft <= 0) {
                // Timer finished! Switch modes automatically
                clearInterval(roomTimer.intervalId);
                roomTimer.isRunning = false;
                
                if (roomTimer.mode === 'focus') {
                    roomTimer.mode = 'break';
                    roomTimer.timeLeft = 5 * 60; // 5 min break
                } else {
                    roomTimer.mode = 'focus';
                    roomTimer.timeLeft = 25 * 60; // 25 min focus
                }

                io.to(roomId).emit('timer_finished', { newMode: roomTimer.mode, nextTime: roomTimer.timeLeft });
            } else {
                // Every second, tell the room what time it is
                io.to(roomId).emit('timer_tick', { timeLeft: roomTimer.timeLeft, mode: roomTimer.mode });
            }
        }, 1000);
    });

    socket.on('pause_timer', ({ roomId }) => {
        if (!rooms[roomId] || !rooms[roomId].timer.isRunning) return;
        
        const roomTimer = rooms[roomId].timer;
        clearInterval(roomTimer.intervalId);
        roomTimer.intervalId = null;
        roomTimer.isRunning = false;

        io.to(roomId).emit('timer_paused', { timeLeft: roomTimer.timeLeft, mode: roomTimer.mode });
    });

    socket.on('reset_timer', ({ roomId }) => {
        if (!rooms[roomId]) return;
        
        const roomTimer = rooms[roomId].timer;
        if (roomTimer.intervalId) clearInterval(roomTimer.intervalId);
        
        roomTimer.intervalId = null;
        roomTimer.isRunning = false;
        roomTimer.mode = 'focus';
        roomTimer.timeLeft = 25 * 60;

        io.to(roomId).emit('timer_reset', { timeLeft: roomTimer.timeLeft, mode: roomTimer.mode });
    });
};
