import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  MessageSquare, 
  Clock, 
  Trophy, 
  ArrowRight, 
  Users, 
  Sparkles,
  Zap,
  CheckCircle2,
  Rocket
} from 'lucide-react';
import { motion } from 'framer-motion';

function Home() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const features = [
    {
      title: 'Real-time Messaging',
      desc: 'Connect instantly with your study squad through low-latency group chats.',
      icon: MessageSquare,
      color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400',
      delay: 0.1
    },
    {
      title: 'Shared Pomodoro',
      desc: 'Synchronized focus sessions that keep the whole group on track.',
      icon: Clock,
      color: 'bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400',
      delay: 0.2
    },
    {
      title: 'Gamification',
      desc: 'Climb the global leaderboard and earn points for every focus hour.',
      icon: Trophy,
      color: 'bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400',
      delay: 0.3
    }
  ];

  const steps = [
    { title: 'Create Profile', desc: 'Sign up and tell us about your courses and goals.', icon: UserIcon },
    { title: 'Find Your Squad', desc: 'Join active rooms or get matched with study buddies.', icon: Users },
    { title: 'Study & Win', desc: 'Collaborate in real-time and climb the ranks.', icon: Rocket }
  ];

  return (
    <div className="bg-[#F9F9F9] dark:bg-slate-950 min-h-screen transition-colors overflow-x-hidden">
      
      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-6 py-20 lg:py-32 grid lg:grid-cols-2 gap-16 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8 z-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-sm font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>The Ultimate Study Squad Hub</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black text-slate-900 dark:text-white leading-[1.1] tracking-tight">
            Learn Better, <br />
            <span className="text-indigo-600">Together.</span>
          </h1>
          
          <p className="max-w-xl text-xl text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
            Stop studying in isolation. Connect with course mates in real-time rooms, sync your timers, and turn deep work into a team sport.
          </p>
          
          <div className="flex flex-wrap gap-4 pt-4">
            <button 
              onClick={() => navigate(isAuthenticated ? "/dashboard" : "/auth")}
              className="px-10 py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-black text-lg shadow-2xl shadow-indigo-500/40 hover:-translate-y-1 transition-all flex items-center gap-3 active:scale-95"
            >
              Get Started Free
              <ArrowRight className="w-6 h-6" />
            </button>
            <button 
              onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-10 py-5 bg-white dark:bg-white/5 text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 rounded-full font-black text-lg hover:bg-slate-50 dark:hover:bg-white/10 transition-all active:scale-95"
            >
              How it Works
            </button>
          </div>
        </motion.div>

        {/* Bubbly Avatar Cluster */}
        <div className="relative h-[500px] w-full hidden lg:block">
            {/* Center Main Bubble */}
            <motion.div 
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-white dark:bg-slate-900 border-[12px] border-indigo-50 shadow-2xl overflow-hidden z-20"
            >
                <img src="https://i.pravatar.cc/400?u=study1" alt="Student" className="w-full h-full object-cover" />
                <div className="absolute top-8 right-8 bg-white dark:bg-slate-800 p-3 rounded-2xl shadow-xl flex items-center gap-2 border border-slate-100 transform rotate-12">
                    <span className="text-lg">🔥</span>
                    <span className="font-bold text-xs text-slate-900 dark:text-white">Focused!</span>
                </div>
            </motion.div>

            {/* Orbiting Bubbles */}
            <motion.div 
                animate={{ y: [0, 15, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute top-10 left-20 w-44 h-44 rounded-full bg-emerald-50 dark:bg-emerald-500/20 border-8 border-white dark:border-slate-800 shadow-xl overflow-hidden z-10"
            >
                <img src="https://i.pravatar.cc/300?u=study2" alt="Student" className="w-full h-full object-cover grayscale" />
                <div className="absolute -bottom-2 -right-2 bg-yellow-400 p-2 rounded-full shadow-lg border-4 border-white">
                    <Zap className="w-4 h-4 text-white fill-white" />
                </div>
            </motion.div>

            <motion.div 
                animate={{ x: [0, 20, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-10 left-0 w-36 h-36 rounded-full bg-purple-50 dark:bg-purple-500/20 border-8 border-white dark:border-slate-800 shadow-xl overflow-hidden z-30"
            >
                <img src="https://i.pravatar.cc/200?u=study3" alt="Student" className="w-full h-full object-cover" />
            </motion.div>

            <motion.div 
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-20 right-0 w-52 h-52 rounded-full bg-blue-50 dark:bg-blue-500/20 border-8 border-white dark:border-slate-800 shadow-xl overflow-hidden z-10"
            >
                <img src="https://i.pravatar.cc/350?u=study4" alt="Student" className="w-full h-full object-cover" />
                <div className="absolute top-4 left-0 bg-white dark:bg-slate-800 px-4 py-2 rounded-full shadow-lg border border-slate-100 -rotate-6">
                    <span className="font-black text-indigo-600 text-xs tracking-tighter italic">LOL! 🤣</span>
                </div>
            </motion.div>

            <motion.div 
                className="absolute bottom-20 right-20 w-28 h-28 rounded-full bg-orange-50 dark:bg-orange-500/20 border-8 border-white dark:border-slate-800 shadow-xl overflow-hidden z-10"
            >
                <img src="https://i.pravatar.cc/150?u=study5" alt="Student" className="w-full h-full object-cover grayscale" />
            </motion.div>
        </div>
      </section>

      {/* Bento Grid Features */}
      <section className="max-w-7xl mx-auto px-6 py-20 lg:py-32">
        <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">Built for Super-Students</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 font-medium max-w-2xl mx-auto">Everything you need to stay motivated, organized, and connected.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: f.delay }}
              className={`p-10 rounded-[3rem] ${f.color} border border-black/5 dark:border-white/5 relative overflow-hidden group hover:-translate-y-2 transition-transform duration-500 cursor-default shadow-sm hover:shadow-xl`}
            >
                <div className="relative z-10">
                    <div className="w-16 h-16 rounded-3xl bg-white dark:bg-slate-900 flex items-center justify-center mb-8 shadow-inner">
                        <f.icon className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-black mb-4 tracking-tight">{f.title}</h3>
                    <p className="font-medium leading-relaxed opacity-80">{f.desc}</p>
                </div>
                {/* Decorative Pattern */}
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/20 dark:bg-white/5 rounded-full blur-2xl" />
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-6 py-20 lg:py-32">
        <div className="bg-slate-900 dark:bg-indigo-600/10 rounded-[4rem] p-12 lg:p-24 text-center border border-white/10 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                <div className="grid grid-cols-10 h-full">
                    {[...Array(100)].map((_, i) => (
                        <div key={i} className="border-r border-b border-white/20" />
                    ))}
                </div>
            </div>

            <h2 className="text-white text-4xl lg:text-6xl font-black mb-16 relative z-10">Ready to level up?</h2>
            
            <div className="grid lg:grid-cols-3 gap-12 relative z-10">
                {steps.map((s, i) => (
                    <div key={s.title} className="space-y-6">
                        <div className="w-16 h-16 rounded-full bg-white dark:bg-indigo-600 text-slate-900 dark:text-white mx-auto flex items-center justify-center text-2xl font-black shadow-xl">
                            {i + 1}
                        </div>
                        <h3 className="text-xl font-black text-white">{s.title}</h3>
                        <p className="text-slate-400 dark:text-slate-300 font-medium px-4">{s.desc}</p>
                    </div>
                ))}
            </div>

            <div className="mt-20 relative z-10">
                <button 
                  onClick={() => navigate("/auth")}
                  className="px-12 py-5 bg-white text-slate-900 hover:bg-indigo-50 rounded-full font-black text-xl transition-all shadow-2xl active:scale-95"
                >
                    Create Your Account
                </button>
            </div>
        </div>
      </section>

      {/* Footer Minimal */}
      <footer className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center gap-8 border-t border-slate-200 dark:border-white/5">
        <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white">
                <BookOpen className="w-4 h-4" />
            </div>
            <span className="font-bold text-slate-900 dark:text-white">StudyBuddy</span>
        </div>
        <div className="flex gap-8 text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Github</a>
        </div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">© 2026 NAZIFA NELOY</p>
      </footer>
    </div>
  );
}

// Minimal placeholder because I forgot to import it
function UserIcon(props) {
    return <Users {...props} />
}

export default Home;
