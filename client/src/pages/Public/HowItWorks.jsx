import { useNavigate } from 'react-router-dom';
import { 
  UserPlus, 
  Users, 
  Timer, 
  Trophy,
  ArrowRight,
  Sparkles,
  Star,
  CheckCircle2
} from 'lucide-react';
import { motion } from 'framer-motion';

function HowItWorks() {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const steps = [
    {
      title: "Smart Onboarding",
      desc: "Tell us about your courses, skills, and learning goals through our signature skill survey. We help you set the right targets from day one.",
      icon: UserPlus,
      color: "bg-blue-50 text-blue-600",
      gridClass: "lg:col-span-1 lg:row-span-1"
    },
    {
      title: "Buddy Matching",
      desc: "Our active matching algorithm pairs you with students who share your intensity. Join squads that match your vibe and course schedule perfectly.",
      icon: Users,
      color: "bg-emerald-50 text-emerald-600",
      gridClass: "lg:col-span-1 lg:row-span-2"
    },
    {
      title: "Real-Time Rooms",
      desc: "Enter live collaborative rooms featuring low-latency chat, shared file hubs, and synchronized Pomodoro timers for maximum focus.",
      icon: Timer,
      color: "bg-purple-50 text-purple-600",
      gridClass: "lg:col-span-1 lg:row-span-1"
    },
    {
      title: "Earn Rewards",
      desc: "Climb the global leaderboard as you study. Earn points for every hour of deep focus and unlock rank badges that show off your dedication.",
      icon: Trophy,
      color: "bg-orange-50 text-orange-600",
      gridClass: "lg:col-span-1 lg:row-span-2"
    }
  ];

  return (
    <div className="relative bg-[#F9F9F9] dark:bg-slate-950 min-h-screen pt-24 pb-32 transition-colors overflow-hidden">
      
      {/* Background Blobs for Depth */}
      <div className="absolute top-[10%] left-[-10%] w-[40rem] h-[40rem] bg-yellow-100/40 dark:bg-yellow-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-5%] w-[35rem] h-[35rem] bg-indigo-100/40 dark:bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Hero Section Card */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-4xl mx-auto mb-20 p-12 lg:p-20 rounded-[3rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 shadow-sm relative overflow-hidden group"
        >
          {/* Sparkle Decoration */}
          <motion.div 
            animate={{ rotate: 360, scale: [1, 1.2, 1] }} 
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute top-8 right-12 text-yellow-400 opacity-60 hidden md:block"
          >
            <Sparkles className="w-8 h-8" />
          </motion.div>
          <motion.div 
            animate={{ y: [0, -10, 0] }} 
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute bottom-12 left-12 text-indigo-300 opacity-60 hidden md:block"
          >
            <Star className="w-6 h-6 fill-current" />
          </motion.div>

          <h1 className="text-5xl lg:text-7xl font-black text-slate-900 dark:text-white leading-[1.1] tracking-tight mb-6">
            Everything you need to <br />
            <span className="text-indigo-600">study smarter.</span>
          </h1>
          <p className="text-xl text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto mb-10 leading-relaxed">
            Stop studying in isolation. Connect with course mates in real-time rooms, sync your timers, and turn deep work into a team sport.
          </p>
          <div className="flex justify-center">
            <button 
              onClick={() => navigate("/auth")}
              className="px-12 py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-black text-xl shadow-2xl shadow-indigo-500/30 transition-all hover:scale-[1.05] active:scale-[0.98] flex items-center gap-3"
            >
              Start Inspired
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        </motion.div>

        {/* Bento Grid Section */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {steps.map((s, idx) => (
            <motion.div
              key={s.title}
              variants={itemVariants}
              whileHover={{ y: -10 }}
              className={`p-10 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 flex flex-col items-center text-center shadow-sm group transition-all duration-300 ${s.gridClass}`}
            >
              <div className={`w-20 h-20 rounded-full ${s.color} flex items-center justify-center mb-8 relative mb-8 group-hover:scale-110 transition-transform duration-500`}>
                <s.icon className="w-10 h-10" />
                {/* Accent Sparkle */}
                {idx % 2 === 0 && (
                  <div className="absolute -top-1 -right-1 text-yellow-500">
                    <Sparkles className="w-5 h-5" />
                  </div>
                )}
              </div>
              
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">{s.title}</h3>
              <p className="text-slate-500 dark:text-slate-400 font-medium leading-[1.8] text-base">
                {s.desc}
              </p>

              {/* Step indicator tag at the bottom */}
              <div className="mt-8 px-4 py-1.5 rounded-full bg-slate-50 dark:bg-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-indigo-500 transition-colors">
                Step {idx + 1}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Closing CTA Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-24 text-center"
        >
          <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold mb-8">
            <CheckCircle2 className="w-5 h-5" />
            <span>Academic Excellence Guaranteed</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">
            Level up your design class today.
          </h2>
          <button 
            onClick={() => navigate("/auth")}
            className="group flex items-center gap-3 mx-auto px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full font-black text-lg transition-all hover:bg-indigo-600 dark:hover:bg-indigo-500 dark:hover:text-white"
          >
            Join StudyBuddy 
            <motion.span whileHover={{ x: 5 }} className="transition-transform">
              <ArrowRight className="w-5 h-5" />
            </motion.span>
          </button>
        </motion.div>
      </div>
    </div>
  );
}

export default HowItWorks;
