import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { BookOpen, Users, MessageSquare, Zap } from 'lucide-react';

const socket = io('http://localhost:5001');

function App() {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-indigo-500/30">
      {/* Navigation */}
      <nav className="border-b border-white/10 bg-slate-950/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <BookOpen className="w-8 h-8 text-indigo-500" />
              <span className="text-xl font-bold tracking-tight">StudyBuddy</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-white/5">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                <span className="text-xs font-medium text-slate-400">
                  {isConnected ? 'Live' : 'Disconnected'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium">
            <Zap className="w-4 h-4" />
            <span>Built with React + Vite + Tailwind 4</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
            Learn Together, <span className="text-indigo-500">Faster.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-slate-400">
            Real-time collaborative study platform featuring active rooms, live chat, and shared resources.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <button className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-semibold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-indigo-500/25">
              Get Started
            </button>
            <button className="px-8 py-3 bg-slate-900 hover:bg-slate-800 border border-white/10 rounded-xl font-semibold transition-all">
              Join a Room
            </button>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-32">
          {[
            { icon: Users, title: 'Study Rooms', desc: 'Create or join focus rooms with other students.' },
            { icon: MessageSquare, title: 'Real-time Chat', desc: 'Instant communication powered by Socket.io.' },
            { icon: Zap, title: 'Instant Sync', desc: 'Data persists across all devices in real-time.' }
          ].map((feature, idx) => (
            <div key={idx} className="p-8 rounded-3xl bg-slate-900/50 border border-white/5 hover:border-indigo-500/50 transition-colors group">
              <feature.icon className="w-12 h-12 text-indigo-500 mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;
