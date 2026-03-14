import { useEffect, useState, useCallback } from 'react';
import { io } from 'socket.io-client';

export const useSocket = (url, roomId, user) => {
    const [socket, setSocket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [roomUsers, setRoomUsers] = useState([]);
    const [timer, setTimer] = useState({
        mode: 'focus',
        timeLeft: 25 * 60,
        isRunning: false
    });

    useEffect(() => {
        if (!user || !user.id || !roomId) return;

        // Initialize socket connection
        const newSocket = io(url, {
            autoConnect: true,
            reconnection: true
        });

        // 1. Connection Event
        newSocket.on('connect', () => {
            console.log('Connected to socket server');
            newSocket.emit('join_room', { roomId, user });
        });

        // 2. Room State sync upon joining
        newSocket.on('room_state', (state) => {
            setRoomUsers(state.users);
            setTimer(state.timer);
        });

        // 3. User Joined / Left
        newSocket.on('user_joined', ({ user: joinedUser }) => {
            setRoomUsers((prev) => {
                if (prev.find(u => u.id === joinedUser.id)) return prev;
                return [...prev, joinedUser];
            });
            // Optional: add a system message to chat
            setMessages(prev => [...prev, { id: Date.now().toString(), type: 'system', text: `${joinedUser.name} joined the room.` }]);
        });

        newSocket.on('user_left', ({ user: leftUser }) => {
            setRoomUsers((prev) => prev.filter(u => u.id !== leftUser.id));
            setMessages(prev => [...prev, { id: Date.now().toString(), type: 'system', text: `${leftUser.name} left the room.` }]);
        });

        // 4. Messaging
        newSocket.on('receive_message', (messageData) => {
            setMessages((prev) => [...prev, messageData]);
        });

        // 5. Timer Events
        newSocket.on('timer_tick', (timerState) => {
            setTimer(prev => ({ ...prev, ...timerState, isRunning: true }));
        });

        newSocket.on('timer_started', (timerState) => {
            setTimer(prev => ({ ...prev, ...timerState, isRunning: true }));
        });

        newSocket.on('timer_paused', (timerState) => {
            setTimer(prev => ({ ...prev, ...timerState, isRunning: false }));
        });

        newSocket.on('timer_reset', (timerState) => {
            setTimer(prev => ({ ...prev, ...timerState, isRunning: false }));
        });

        newSocket.on('timer_finished', (timerState) => {
             // timerState has { newMode, nextTime }
             setTimer({
                 mode: timerState.newMode,
                 timeLeft: timerState.nextTime,
                 isRunning: false
             });
             // Add system message
             const modeText = timerState.newMode === 'break' ? 'Focus time over! Time for a break.' : 'Break over! Back to focus.';
             setMessages(prev => [...prev, { id: Date.now().toString(), type: 'system', text: modeText }]);
        });

        setSocket(newSocket);

        // Cleanup on unmount
        return () => {
            newSocket.emit('leave_room', { roomId, user });
            newSocket.disconnect();
        };
    }, [url, roomId, user]);

    // Expose functions to interact with the server
    const sendMessage = useCallback((messageText) => {
        if (socket && messageText.trim()) {
            socket.emit('send_message', { roomId, message: messageText, user });
        }
    }, [socket, roomId, user]);

    const startTimer = useCallback(() => {
        if (socket) socket.emit('start_timer', { roomId });
    }, [socket, roomId]);

    const pauseTimer = useCallback(() => {
        if (socket) socket.emit('pause_timer', { roomId });
    }, [socket, roomId]);

    const resetTimer = useCallback(() => {
        if (socket) socket.emit('reset_timer', { roomId });
    }, [socket, roomId]);

    return {
        socket,
        messages,
        roomUsers,
        timer,
        sendMessage,
        startTimer,
        pauseTimer,
        resetTimer
    };
};
