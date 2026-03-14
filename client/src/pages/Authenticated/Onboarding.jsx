import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { 
  BookOpen, 
  Target, 
  Sparkles, 
  Brain, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle2,
  Rocket,
  Star
} from 'lucide-react';

const SKILL_OPTIONS = [
  'JavaScript', 'Python', 'React', 'Node.js', 'Machine Learning', 
  'Calculus', 'Physics', 'Biology', 'History', 'Literature'
];

function Onboarding() {
  const [step, setStep] = useState(1);
  const [bio, setBio] = useState('');
  const [possessedSkills, setPossessedSkills] = useState([]);
  const [skillsToLearn, setSkillsToLearn] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const handleNext = () => setStep(prev => Math.min(prev + 1, 3));
  const handleBack = () => setStep(prev => Math.max(prev - 1, 1));

  const toggleSkill = (skill, list, setList) => {
    if (list.includes(skill)) {
      setList(list.filter(s => s !== skill));
    } else {
      if (list.length < 5) setList([...list, skill]);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const updatedUser = { 
        ...user, 
        bio, 
        onboarding_complete: true,
        possessedSkills,
        skillsToLearn
      };
      
      login(updatedUser);
      navigate('/dashboard');
    } catch (error) {
      console.error('Onboarding error', error);
      setIsSubmitting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    },
    exit: { 
      opacity: 0, 
      scale: 0.95, 
      y: -20,
      transition: { duration: 0.3 }
    }
  };

  const skillVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.05 }
    })
  };

  return (
    <div className="min-h-screen bg-[#F9F9F9] dark:bg-slate-950 flex flex-col items-center justify-center p-6 transition-colors overflow-hidden">
      
      {/* Background Depth */}
      <div className="absolute top-[10%] left-[-10%] w-[40rem] h-[40rem] bg-indigo-100/40 dark:bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-10%] w-[35rem] h-[35rem] bg-emerald-100/40 dark:bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-3xl relative z-10">
        
        {/* Playful Header */}
        <div className="text-center mb-12">
            <motion.div 
              initial={{ rotate: -10, scale: 0.5 }}
              animate={{ rotate: 0, scale: 1 }}
              className="inline-flex p-4 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-white/5 shadow-xl mb-8 relative"
            >
                <Rocket className="w-10 h-10 text-indigo-600" />
                <motion.div 
                  animate={{ scale: [1, 1.5, 1], opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -top-1 -right-1 text-yellow-400"
                >
                    <Sparkles className="w-6 h-6" />
                </motion.div>
            </motion.div>
            <h1 className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                Let's customize your <br />
                <span className="text-indigo-600">Study Experience.</span>
            </h1>
        </div>

        {/* Progress Bar Premium */}
        <div className="flex items-center justify-center gap-4 mb-16">
          {[1, 2, 3].map((num) => (
            <div key={num} className="flex items-center group">
              <motion.div 
                animate={{ 
                    scale: step === num ? 1.2 : 1,
                    backgroundColor: step >= num ? "#4F46E5" : "transparent"
                }}
                className={`w-12 h-12 rounded-full flex items-center justify-center border-4 transition-all duration-300 ${
                  step >= num 
                    ? 'border-indigo-600 shadow-xl shadow-indigo-500/30' 
                    : 'border-slate-200 dark:border-white/10'
                }`}
              >
                {step > num ? (
                   <CheckCircle2 className="w-6 h-6 text-white" />
                ) : (
                   <span className={`font-black text-lg ${step === num ? 'text-white' : 'text-slate-400'}`}>0{num}</span>
                )}
              </motion.div>
              {num !== 3 && (
                <div className={`w-20 md:w-32 h-2 mx-2 rounded-full overflow-hidden bg-slate-200 dark:bg-white/10`}>
                    <motion.div 
                      initial={{ width: "0%" }}
                      animate={{ width: step > num ? "100%" : "0%" }}
                      className="h-full bg-indigo-600"
                    />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl px-8 py-12 md:p-16 rounded-[4rem] border border-white dark:border-white/10 shadow-2xl min-h-[500px] flex flex-col">
          
          <AnimatePresence mode="wait">
            {/* Step 1: Human touch */}
            {step === 1 && (
              <motion.div
                key="step1"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="grow flex flex-col items-center text-center"
              >
                <div className="w-16 h-16 rounded-3xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 mb-8">
                    <User className="w-8 h-8" />
                </div>
                <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">Tell us your story</h2>
                <p className="text-lg text-slate-500 dark:text-slate-400 font-medium mb-10 max-w-md">
                    Help other students know who they're studying with. A good bio increases your squad requests!
                </p>
                <div className="w-full max-w-xl relative group">
                    <textarea 
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="I'm a sophomore majoring in CS, looking for groups to conquer algorithms..."
                      className="w-full h-48 px-8 py-6 rounded-[2.5rem] bg-slate-50 dark:bg-slate-950/50 border-2 border-slate-100 dark:border-white/5 focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-950 outline-none transition-all text-slate-900 dark:text-white font-medium resize-none leading-relaxed"
                    />
                </div>
              </motion.div>
            )}

            {/* Step 2: Strengths */}
            {step === 2 && (
              <motion.div
                key="step2"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="grow flex flex-col items-center text-center"
              >
                <div className="w-16 h-16 rounded-3xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 mb-8">
                    <Brain className="w-8 h-8" />
                </div>
                <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">What are your strengths?</h2>
                <p className="text-lg text-slate-500 dark:text-slate-400 font-medium mb-12 max-w-md">
                   Select up to 5 subjects you're confident in. This helps us match you with students needing help.
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                    {SKILL_OPTIONS.map((skill, i) => {
                      const isSelected = possessedSkills.includes(skill);
                      return (
                        <motion.button
                          key={skill}
                          custom={i}
                          variants={skillVariants}
                          onClick={() => toggleSkill(skill, possessedSkills, setPossessedSkills)}
                          className={`px-8 py-4 rounded-2xl font-black text-sm transition-all border-2 shadow-sm ${
                            isSelected 
                              ? 'bg-emerald-600 text-white border-emerald-600 scale-105 shadow-emerald-500/20' 
                              : 'bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-slate-100 dark:border-white/5 hover:border-emerald-500/50'
                          }`}
                        >
                          {skill}
                        </motion.button>
                      );
                    })}
                </div>
              </motion.div>
            )}

            {/* Step 3: Mastery */}
            {step === 3 && (
              <motion.div
                key="step3"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="grow flex flex-col items-center text-center"
              >
                <div className="w-16 h-16 rounded-3xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 mb-8">
                    <Target className="w-8 h-8" />
                </div>
                <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">What do you want to master?</h2>
                <p className="text-lg text-slate-500 dark:text-slate-400 font-medium mb-12 max-w-md">
                   Choose 5 subjects you want to focus on. We'll find rooms and partners active in these fields.
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                    {SKILL_OPTIONS.map((skill, i) => {
                      const isSelected = skillsToLearn.includes(skill);
                      return (
                        <motion.button
                          key={skill}
                          custom={i}
                          variants={skillVariants}
                          onClick={() => toggleSkill(skill, skillsToLearn, setSkillsToLearn)}
                          className={`px-8 py-4 rounded-2xl font-black text-sm transition-all border-2 shadow-sm ${
                            isSelected 
                              ? 'bg-indigo-600 text-white border-indigo-600 scale-105 shadow-indigo-500/20' 
                              : 'bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-slate-100 dark:border-white/5 hover:border-indigo-500/50'
                          }`}
                        >
                          {skill}
                        </motion.button>
                      );
                    })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Nav Footer Internal */}
          <div className="mt-16 flex items-center justify-between pt-10 border-t border-slate-100 dark:border-white/5">
            <button
              onClick={handleBack}
              disabled={step === 1}
              className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-black transition-all ${
                step === 1 ? 'opacity-0 pointer-events-none' : 'text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5'
              }`}
            >
              <ArrowLeft className="w-5 h-5" /> Back
            </button>
            
            <div className="flex items-center gap-6">
                <span className="hidden md:block text-xs font-black text-slate-300 uppercase tracking-widest">
                    Step {step} of 3
                </span>
                {step < 3 ? (
                  <button
                    onClick={handleNext}
                    className="flex items-center gap-3 px-10 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black hover:bg-indigo-600 dark:hover:bg-indigo-500 dark:hover:text-white transition-all shadow-xl active:scale-95"
                  >
                    Continue <ArrowRight className="w-5 h-5" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="flex items-center gap-3 px-12 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black transition-all shadow-2xl shadow-indigo-500/30 active:scale-95 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Saving Profile...' : 'Launch Dashboard'}
                    <Rocket className="w-6 h-6" />
                  </button>
                )}
            </div>
          </div>
        </div>
        
        {/* Playful Accent Sparkle */}
        <motion.div 
            animate={{ rotate: [0, 15, 0], y: [0, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity }}
            className="absolute top-0 right-[-5%] text-indigo-200 hidden lg:block"
        >
            <Star className="w-24 h-24 fill-current opacity-20" />
        </motion.div>
      </div>
    </div>
  );
}

// Minimal placeholder for User icon
function User(props) {
    return <BookOpen {...props} />
}

export default Onboarding;
