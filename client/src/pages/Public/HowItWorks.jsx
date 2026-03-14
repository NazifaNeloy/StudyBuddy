import { useNavigate } from 'react-router-dom';
import { 
  UserPlus, 
  Users, 
  Timer, 
  Trophy, 
  Sparkles,
  Star,
  ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';

function HowItWorks() {
  const navigate = useNavigate();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <div className="bg-white dark:bg-slate-950 min-h-screen pt-20 transition-colors relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-yellow-100/50 dark:bg-yellow-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-indigo-50/50 dark:bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 py-20">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-20">
            <motion.h1 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white leading-tight mb-6"
            >
                How To Ace Your Finals With <span className="text-indigo-600">StudyBuddy</span>
            </motion.h1>
            <motion.p 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-xl text-slate-500 dark:text-slate-400 font-medium leading-relaxed"
            >
                Stop the grind, start the flow. We've built a structured path to collaborative excellence.
            </motion.p>
        </div>

        {/* Bento Grid */}
        <motion.div 
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-6 h-auto md:h-[700px]"
        >
            {/* HERO CARD (Step 0) - Spans 2 cols, 2 rows */}
            <motion.div 
                variants={item}
                className="md:col-span-2 md:row-span-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-[2.5rem] p-12 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all group flex flex-col justify-between relative overflow-hidden"
            >
                <div className="relative z-10">
                    <div className="w-20 h-20 rounded-full bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                        <Star className="w-10 h-10 text-indigo-600 fill-indigo-600/10" />
                    </div>
                    <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-6">Built for high-energy <br/> collaboration.</h2>
                    <p className="text-lg text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-sm">
                        StudyBuddy isn't just a chat app. It's a synchronized engine designed to keep your focus locked and your motivation high.
                    </p>
                </div>

                <div className="relative z-10 pt-10">
                    <button 
                         onClick={() => navigate("/auth")}
                         className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-black group/btn"
                    >
                        Learn More About The Engine
                        <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                </div>

                {/* Decoration */}
                <Sparkles className="absolute bottom-10 right-10 w-24 h-24 text-indigo-100 dark:text-indigo-900 opacity-20" />
            </motion.div>

            {/* STEP 1: Smart Onboarding */}
            <motion.div 
                variants={item}
                className="md:col-span-1 bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-[2rem] p-8 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all group"
            >
                <div className="w-14 h-14 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <UserPlus className="w-7 h-7 text-emerald-600" />
                </div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">Smart Onboarding</h3>
                <p className="text-slate-500 dark:text-slate-400 font-medium text-sm leading-relaxed">
                    Take a quick survey so we can match you with the right peers.
                </p>
            </motion.div>

            {/* STEP 2: Buddy Matching */}
            <motion.div 
                variants={item}
                className="md:col-span-1 bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-[2rem] p-8 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all group"
            >
                <div className="w-14 h-14 rounded-full bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Users className="w-7 h-7 text-purple-600" />
                </div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">Buddy Matching</h3>
                <p className="text-slate-500 dark:text-slate-400 font-medium text-sm leading-relaxed">
                    Our algorithm finds students with the same course goals.
                </p>
            </motion.div>

            {/* STEP 3: Real-Time Rooms */}
            <motion.div 
                variants={item}
                className="md:col-span-1 bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-[2rem] p-8 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all group"
            >
                <div className="w-14 h-14 rounded-full bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Timer className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">Real-Time Rooms</h3>
                <p className="text-slate-500 dark:text-slate-400 font-medium text-sm leading-relaxed">
                    Jump into rooms with live chat and shared timers.
                </p>
            </motion.div>

            {/* STEP 4: Earn Rewards */}
            <motion.div 
                variants={item}
                className="md:col-span-1 bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-[2rem] p-8 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all group"
            >
                <div className="w-14 h-14 rounded-full bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Trophy className="w-7 h-7 text-orange-600" />
                </div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">Earn Rewards</h3>
                <p className="text-slate-500 dark:text-slate-400 font-medium text-sm leading-relaxed">
                    Rack up points for focus hours and climb the global ranks.
                </p>
            </motion.div>
        </motion.div>

        {/* CTA */}
        <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-20 flex justify-center"
        >
            <button 
              onClick={() => navigate("/auth")}
              className="px-12 py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-xl rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all"
            >
                Start Your First Session
            </button>
        </motion.div>
      </div>

      {/* Minimal Footer */}
      <footer className="max-w-7xl mx-auto px-6 py-12 flex justify-between items-center border-t border-slate-100 dark:border-white/5">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">© 2026 STUDYBUDDY</span>
        <div className="flex gap-6">
            <Sparkles className="w-4 h-4 text-slate-300" />
            <Sparkles className="w-4 h-4 text-slate-300" />
            <Sparkles className="w-4 h-4 text-slate-300" />
        </div>
      </footer>
    </div>
  );
}

export default HowItWorks;
