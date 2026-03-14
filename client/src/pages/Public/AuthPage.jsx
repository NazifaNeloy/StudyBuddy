import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  BookOpen, 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  Sparkles, 
  Star,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mock authentication logic preserved
    login({ 
      id: Date.now().toString(),
      name: isLogin ? (email.split('@')[0] || 'User') : name,
      email,
      onboarding_complete: false 
    });
    navigate('/dashboard'); 
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-6 bg-[#F9F9F9] dark:bg-slate-950 transition-colors overflow-hidden">
      
      {/* Background Orbs for Depth */}
      <div className="absolute top-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-indigo-100/50 dark:bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[35rem] h-[35rem] bg-purple-100/50 dark:bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-xl"
      >
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl p-10 md:p-16 rounded-[3.5rem] border border-white dark:border-white/10 shadow-2xl relative overflow-hidden">
          
          {/* Playful Decorations */}
          <motion.div 
            animate={{ rotate: 360 }} 
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -top-6 -right-6 text-yellow-400 opacity-40"
          >
            <Sparkles className="w-20 h-20" />
          </motion.div>
          <motion.div 
            animate={{ scale: [1, 1.2, 1] }} 
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute -bottom-4 -left-4 text-indigo-400 opacity-40 shrink-0"
          >
            <Star className="w-16 h-16 fill-current" />
          </motion.div>

          <div className="relative z-10">
            {/* Logo & Header */}
            <div className="flex flex-col items-center mb-10 text-center">
              <motion.div 
                whileHover={{ rotate: 10, scale: 1.1 }}
                className="w-16 h-16 bg-indigo-600 rounded-3xl flex items-center justify-center text-white mb-6 shadow-xl shadow-indigo-500/20"
              >
                <BookOpen className="w-8 h-8" />
              </motion.div>
              <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
                {isLogin ? 'Welcome Back!' : 'Create Account'}
              </h1>
              <p className="text-slate-500 dark:text-slate-400 font-medium">
                {isLogin 
                  ? 'Ready to get back to the grind?' 
                  : 'Join the world\'s most energetic study tribe.'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <AnimatePresence mode="wait">
                {!isLogin && (
                  <motion.div
                    key="name-field"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-2"
                  >
                    <label className="text-sm font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest ml-1">Full Name</label>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                      <input 
                        type="text" 
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-white/5 focus:bg-white dark:focus:bg-slate-950 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-medium text-slate-900 dark:text-white"
                        placeholder="Nazifa Neloy"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <div className="space-y-2">
                <label className="text-sm font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest ml-1">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-white/5 focus:bg-white dark:focus:bg-slate-950 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-medium text-slate-900 dark:text-white"
                    placeholder="hello@studybuddy.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest ml-1">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                  <input 
                    type="password" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-white/5 focus:bg-white dark:focus:bg-slate-950 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-medium text-slate-900 dark:text-white"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full group relative py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-3xl font-black text-lg transition-all shadow-xl shadow-indigo-500/30 active:scale-[0.98] overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  {isLogin ? 'Sign In' : 'Start Studying'}
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </span>
                <motion.div 
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.8 }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
                />
              </button>
            </form>

            <div className="mt-12 text-center">
              <p className="text-slate-500 dark:text-slate-400 font-bold mb-4">
                {isLogin ? "Don't have an account yet?" : "Already a member?"}
              </p>
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="inline-flex items-center gap-2 px-8 py-3 bg-white dark:bg-white/5 text-slate-900 dark:text-white border-2 border-slate-100 dark:border-white/10 rounded-2xl font-black transition-all hover:bg-slate-50 dark:hover:bg-white/10 active:scale-95 shadow-sm"
              >
                {isLogin ? 'Join StudyBuddy' : 'Log Into Account'}
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer Meta */}
        <div className="mt-8 flex justify-center gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
          <a href="#" className="hover:text-indigo-600 transition-colors">Privacy Policy</a>
          <span>•</span>
          <a href="#" className="hover:text-indigo-600 transition-colors">Terms of Service</a>
        </div>
      </motion.div>
    </div>
  );
}

export default AuthPage;
