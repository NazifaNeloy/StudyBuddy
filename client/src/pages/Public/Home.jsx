import { Users, MessageSquare, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 min-h-[calc(100vh-4rem)]">
      <div className="text-center space-y-8 mt-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-sm font-medium animate-fade-in">
          <Zap className="w-4 h-4" />
          <span>Built with React + Vite + Tailwind 4</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Learn Together, <span className="text-indigo-500">Faster.</span>
        </h1>
        <p className="max-w-2xl mx-auto text-xl text-slate-600 dark:text-slate-400">
          Real-time collaborative study platform featuring active rooms, live chat, and shared resources.
        </p>
        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <Link 
            to={isAuthenticated ? "/dashboard" : "/auth"}
            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold transition-all hover:-translate-y-1 shadow-lg shadow-indigo-500/25"
          >
            Get Started
          </Link>
          <Link 
            to="/how-it-works"
            className="px-8 py-3 bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl font-semibold transition-all"
          >
            How it Works
          </Link>
        </div>
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-8 mt-32">
        {[
          { icon: Users, title: 'Study Rooms', desc: 'Create or join focus rooms with other students.' },
          { icon: MessageSquare, title: 'Real-time Chat', desc: 'Instant communication powered by Socket.io.' },
          { icon: Zap, title: 'Instant Sync', desc: 'Data persists across all devices in real-time.' }
        ].map((feature, idx) => (
          <div key={idx} className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 hover:border-indigo-500/50 transition-colors group">
            <feature.icon className="w-12 h-12 text-indigo-500 mb-6 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">{feature.title}</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
