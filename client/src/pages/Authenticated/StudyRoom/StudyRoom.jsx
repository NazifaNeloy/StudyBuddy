import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useSocket } from '../../../hooks/useSocket';
import { Send, Play, Pause, RotateCcw, Users, LogOut, Clock, MessageSquare, Coffee } from 'lucide-react';
import { motion } from 'framer-motion';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

function StudyRoom() {
    const { roomId } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);

    // Initializing our custom hook
    const {
        socket,
        messages,
        roomUsers,
        timer,
        sendMessage,
        startTimer,
        pauseTimer,
        resetTimer
    } = useSocket(SOCKET_URL, roomId, user);

    // Auto-scroll chat
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (newMessage.trim()) {
            sendMessage(newMessage);
            setNewMessage('');
        }
    };

    // Helper to format MM:SS
    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    if (!user) return null; // Let ProtectedRoute handle it

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-[calc(100vh-4rem)] flex flex-col">
            
            {/* Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200 dark:border-white/10">
                <div className="flex items-center gap-4">
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        Study Room <span className="text-indigo-500">#{roomId}</span>
                    </h1>
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-sm font-medium text-slate-600 dark:text-slate-300">
                        <Users className="w-4 h-4" />
                        {roomUsers.length} Online
                    </div>
                </div>
                <button 
                    onClick={() => navigate('/dashboard')}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 rounded-xl transition-colors"
                >
                    <LogOut className="w-4 h-4" />
                    Leave Room
                </button>
            </div>

            {/* Main Layout */}
            <div className="flex-1 grid lg:grid-cols-3 gap-6 min-h-0">
                
                {/* Left Column: Timer & Users */}
                <div className="lg:col-span-1 space-y-6 flex flex-col">
                    
                    {/* Pomodoro Timer */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl p-6 shadow-sm flex-shrink-0 flex flex-col items-center">
                        <div className="flex items-center gap-2 mb-8 text-slate-500 dark:text-slate-400 font-medium">
                            {timer.mode === 'focus' ? <Clock className="w-5 h-5 text-indigo-500" /> : <Coffee className="w-5 h-5 text-amber-500" />}
                            {timer.mode === 'focus' ? 'Focus Session' : 'Break Time'}
                        </div>
                        
                        <div className="relative mb-8">
                            <svg className="w-48 h-48 transform -rotate-90">
                                <circle 
                                    cx="96" cy="96" r="88" 
                                    className="stroke-current text-slate-100 dark:text-slate-800" 
                                    strokeWidth="12" fill="transparent" 
                                />
                                <circle 
                                    cx="96" cy="96" r="88" 
                                    className={`stroke-current transition-all duration-1000 ease-linear ${timer.mode === 'focus' ? 'text-indigo-500' : 'text-amber-500'}`} 
                                    strokeWidth="12" fill="transparent"
                                    strokeDasharray={2 * Math.PI * 88}
                                    strokeDashoffset={(2 * Math.PI * 88) * (1 - timer.timeLeft / (timer.mode === 'focus' ? 25 * 60 : 5 * 60))}
                                    strokeLinecap="round"
                                />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-5xl font-bold font-mono text-slate-900 dark:text-white tabular-nums tracking-tighter">
                                    {formatTime(timer.timeLeft)}
                                </span>
                            </div>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center gap-3">
                            {!timer.isRunning ? (
                                <button 
                                    onClick={startTimer}
                                    className="p-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg shadow-indigo-500/25 transition-transform active:scale-95"
                                >
                                    <Play className="w-6 h-6 fill-current" />
                                </button>
                            ) : (
                                <button 
                                    onClick={pauseTimer}
                                    className="p-4 bg-amber-500 hover:bg-amber-600 text-white rounded-full shadow-lg shadow-amber-500/25 transition-transform active:scale-95"
                                >
                                    <Pause className="w-6 h-6 fill-current" />
                                </button>
                            )}
                            <button 
                                onClick={resetTimer}
                                className="p-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full transition-transform active:scale-95"
                            >
                                <RotateCcw className="w-6 h-6" />
                            </button>
                        </div>
                    </div>

                    {/* Active Users */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl p-6 shadow-sm flex-1 overflow-hidden flex flex-col">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Study Members</h3>
                        <div className="overflow-y-auto pr-2 space-y-3 flex-1 min-h-0">
                            {roomUsers.map(u => (
                                <div key={u.id} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-950 rounded-xl">
                                    <div className="relative">
                                        <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center font-bold">
                                            {u.name.charAt(0)}
                                        </div>
                                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-slate-950 rounded-full"></div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                                            {u.name} {u.id === user.id && '(You)'}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Real-time Chat */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl flex flex-col shadow-sm overflow-hidden h-[calc(100vh-12rem)]">
                    {/* Chat Header */}
                    <div className="p-4 border-b border-slate-200 dark:border-white/10 flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-indigo-500" />
                        <h2 className="font-bold text-slate-900 dark:text-white">Discussion</h2>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-slate-400">
                                <MessageSquare className="w-12 h-12 mb-4 opacity-20" />
                                <p>No messages yet. Start the conversation!</p>
                            </div>
                        ) : (
                            messages.map((msg, idx) => {
                                if (msg.type === 'system') {
                                    return (
                                        <motion.div 
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            key={msg.id || idx} 
                                            className="flex justify-center my-2"
                                        >
                                            <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs rounded-full">
                                                {msg.text}
                                            </span>
                                        </motion.div>
                                    );
                                }

                                const isMe = msg.user.id === user.id;
                                return (
                                    <motion.div 
                                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        key={msg.id || idx} 
                                        className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                                    >
                                        <div className="flex items-end gap-2 max-w-[80%]">
                                            {!isMe && (
                                                <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-400 flex-shrink-0">
                                                    {msg.user.name.charAt(0)}
                                                </div>
                                            )}
                                            <div className={`p-4 rounded-2xl ${
                                                isMe 
                                                    ? 'bg-indigo-600 text-white rounded-br-sm' 
                                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-sm'
                                            }`}>
                                                {!isMe && <p className="text-xs font-semibold mb-1 opacity-75">{msg.user.name}</p>}
                                                <p className="text-sm">{msg.message}</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-4 border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900/50">
                        <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                            <input 
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Send a message..."
                                className="flex-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-slate-900 dark:text-white"
                            />
                            <button 
                                type="submit"
                                disabled={!newMessage.trim()}
                                className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 transition-colors shadow-sm"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StudyRoom;
