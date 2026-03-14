import { BookOpen } from 'lucide-react';

function HowItWorks() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-20 min-h-[calc(100vh-4rem)]">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">How StudyBuddy Works</h1>
        <p className="text-xl text-slate-600 dark:text-slate-400">Your ultimate collaborative workspace</p>
      </div>
      
      <div className="space-y-12">
        {[
          { step: "1", title: "Create an Account", desc: "Join StudyBuddy to start tracking your progress and finding study partners." },
          { step: "2", title: "Join or Create a Room", desc: "Find a study room focused on a specific subject, or create your own invite-only room." },
          { step: "3", title: "Collaborate", desc: "Use real-time chat, shared whiteboards, and timers to maximize your productivity." }
        ].map((item, idx) => (
          <div key={idx} className="flex gap-6 items-start p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/30 border border-slate-200 dark:border-white/5">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-500/30">
              {item.step}
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{item.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 text-lg">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HowItWorks;
