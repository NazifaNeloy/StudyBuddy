import { useAuth } from '../../context/AuthContext';
import { BookOpen, Users, Clock } from 'lucide-react';

function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-[calc(100vh-4rem)]">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Welcome back, {user?.name}!</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">Here's what's happening in your study network.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {/* Stats Cards */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl text-indigo-600 dark:text-indigo-400">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Study Time</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">12.5 hrs</h3>
            </div>
          </div>
        </div>
        
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl text-emerald-600 dark:text-emerald-400">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Active Friends</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">4 Online</h3>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-50 dark:bg-amber-500/10 rounded-xl text-amber-600 dark:text-amber-400">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Active Rooms</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">2 Joined</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-sm">
              <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
              <p className="text-slate-600 dark:text-slate-300">Joined <span className="font-semibold">Calculus 101</span> study room</p>
              <span className="text-slate-400 dark:text-slate-500 ml-auto">2h ago</span>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Trending Rooms</h2>
          <div className="space-y-4">
             <div className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-white/10 cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold">
                  CS
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white">Data Structures</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">12 students analyzing trees</p>
                </div>
              </div>
              <button className="px-3 py-1 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors">Join</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
