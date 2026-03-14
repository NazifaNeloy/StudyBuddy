import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { BookOpen, Target, Sparkles, Brain, ArrowRight, ArrowLeft } from 'lucide-react';

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
      // In a real app, this hits the backend POST /users/:id/onboarding
      // For now, we mock the successful response and update context
      
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

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 100 : -100,
      opacity: 0
    })
  };

  // Keep track of animation direction
  const [[page, direction], setPage] = useState([1, 0]);
  
  const paginate = (newDirection) => {
    setPage([page + newDirection, newDirection]);
    if (newDirection > 0) handleNext();
    else handleBack();
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4 overflow-hidden selection:bg-indigo-500/30">
      
      {/* Background decoration */}
      <div className="absolute top-0 inset-x-0 flex justify-center overflow-hidden pointer-events-none">
        <div className="w-[108rem] flex-none flex justify-end">
          <picture>
            <div className="w-[71.75rem] flex-none max-w-none dark:hidden" />
          </picture>
        </div>
      </div>

      <div className="w-full max-w-2xl">
        {/* Progress header */}
        <div className="mb-12">
          <div className="flex justify-center mb-8">
            <div className="p-3 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl border border-indigo-100 dark:border-indigo-500/20 shadow-xl shadow-indigo-500/10">
              <Sparkles className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-2">
            {[1, 2, 3].map((num) => (
              <div key={num} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                  step >= num 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' 
                    : 'bg-white dark:bg-slate-900 text-slate-400 border border-slate-200 dark:border-white/10'
                }`}>
                  {num}
                </div>
                {num !== 3 && (
                  <div className={`w-16 h-1 mx-2 rounded-full transition-all duration-300 ${
                    step > num ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-white/10'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="relative bg-white dark:bg-slate-900 shadow-2xl shadow-indigo-500/5 border border-slate-200 dark:border-white/5 rounded-3xl overflow-hidden min-h-[450px]">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={page}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
              className="absolute inset-0 p-8 md:p-12 flex flex-col"
            >
              
              {/* Step 1: Bio */}
              {step === 1 && (
                <div className="h-full flex flex-col">
                  <div className="mb-8 text-center">
                    <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-3">Tell us about yourself</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-lg">Help others know who they are studying with.</p>
                  </div>
                  <div className="flex-1 max-w-lg mx-auto w-full">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Short Bio</label>
                    <textarea 
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="I'm a sophomore majoring in CS, looking for groups to conquer algorithms..."
                      className="w-full h-40 px-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-slate-900 dark:text-white resize-none"
                    />
                  </div>
                </div>
              )}

              {/* Step 2: What you know */}
              {step === 2 && (
                <div className="h-full flex flex-col">
                  <div className="mb-8 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mb-4">
                      <Brain className="w-6 h-6" />
                    </div>
                    <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-3">What are your strengths?</h2>
                    <p className="text-slate-500 dark:text-slate-400">Select up to 5 subjects you feel confident in.</p>
                  </div>
                  <div className="flex-1 flex flex-wrap gap-3 justify-center content-start">
                    {SKILL_OPTIONS.map(skill => {
                      const isSelected = possessedSkills.includes(skill);
                      return (
                        <button
                          key={skill}
                          onClick={() => toggleSkill(skill, possessedSkills, setPossessedSkills)}
                          className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all border ${
                            isSelected 
                              ? 'bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/25 scale-105' 
                              : 'bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/10 hover:border-emerald-500/50 hover:bg-emerald-50 dark:hover:bg-emerald-500/10'
                          }`}
                        >
                          {skill}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step 3: What you want to learn */}
              {step === 3 && (
                <div className="h-full flex flex-col">
                  <div className="mb-8 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 mb-4">
                      <Target className="w-6 h-6" />
                    </div>
                    <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-3">What do you want to master?</h2>
                    <p className="text-slate-500 dark:text-slate-400">Select up to 5 subjects you need help with.</p>
                  </div>
                  <div className="flex-1 flex flex-wrap gap-3 justify-center content-start">
                    {SKILL_OPTIONS.map(skill => {
                      const isSelected = skillsToLearn.includes(skill);
                      return (
                        <button
                          key={skill}
                          onClick={() => toggleSkill(skill, skillsToLearn, setSkillsToLearn)}
                          className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all border ${
                            isSelected 
                              ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-600/25 scale-105' 
                              : 'bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/10 hover:border-indigo-500/50 hover:bg-indigo-50 dark:hover:bg-indigo-500/10'
                          }`}
                        >
                          {skill}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>

          {/* Navigation Footer */}
          <div className="absolute bottom-0 inset-x-0 p-6 md:px-12 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-md border-t border-slate-200 dark:border-white/5 flex items-center justify-between z-10">
            <button
              onClick={() => paginate(-1)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-colors ${
                step === 1 ? 'opacity-0 pointer-events-none' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10'
              }`}
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            
            {step < 3 ? (
              <button
                onClick={() => paginate(1)}
                className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-semibold hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors shadow-lg"
              >
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-8 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/25 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
              >
                {isSubmitting ? 'Saving...' : 'Complete Profile'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Onboarding;
