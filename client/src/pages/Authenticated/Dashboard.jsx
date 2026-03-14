import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { BookOpen, Users, Clock, Loader2, Trophy } from 'lucide-react';

function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user?.id) return;

    const fetchDashboard = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/users/${user.id}/dashboard`);
        if (!response.ok) throw new Error('Failed to fetch dashboard data');
        
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [user]);

  if (loading) {
      return (
          <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
              <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
          </div>
      );
  }

  if (error || !data) {
      return (
          <div className="flex flex-col h-[calc(100vh-4rem)] items-center justify-center text-center px-4">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mb-4">
                  <span className="font-bold text-xl">!</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Dashboard Error</h2>
              <p className="text-slate-500 mt-2">{error || 'Unable to load dashboard data.'}</p>
          </div>
      );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-[calc(100vh-4rem)]">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Welcome back, {user?.name}!</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">Here's what's happening in your study network.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {/* Points & Rank Card */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-50 dark:bg-amber-500/10 rounded-xl text-amber-600 dark:text-amber-400">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Study Points (Rank #{data.stats.rank})
              </p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                {data.stats.points.toLocaleString()} pts
              </h3>
            </div>
          </div>
        </div>

        {/* Study Time Card */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl text-indigo-600 dark:text-indigo-400">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Daily Study Goal</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{data.stats.studyHours} hrs</h3>
            </div>
          </div>
        </div>
        
        {/* Active Friends Card */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl text-emerald-600 dark:text-emerald-400">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Network Activity</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{data.friendActivity.length} Events</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        
        {/* Network Feed */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Network Feed</h2>
          <div className="space-y-4">
            {data.friendActivity && data.friendActivity.length > 0 ? (
                data.friendActivity.map((activity, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-sm">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0"></div>
                        <p className="text-slate-600 dark:text-slate-300 truncate">{activity.message}</p>
                        <span className="text-xs font-medium text-slate-400 dark:text-slate-500 ml-auto flex-shrink-0 bg-slate-100 dark:bg-white/5 px-2 py-1 rounded-full">
                            {activity.time}
                        </span>
                    </div>
                ))
            ) : (
                <p className="text-sm text-slate-500">All quiet in your network.</p>
            )}
          </div>
        </div>

        {/* Trending Rooms */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            Trending Rooms
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          </h2>
          <div className="space-y-3">
             {data.activeRooms && data.activeRooms.length > 0 ? (
                 data.activeRooms.map((room) => (
                    <div key={room.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-white/10 cursor-pointer group">
                        <div className="flex items-center gap-4 min-w-0">
                            <div className="w-10 h-10 flex-shrink-0 rounded-xl bg-indigo-50 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold border border-indigo-100 dark:border-indigo-500/20 group-hover:scale-105 transition-transform">
                                <BookOpen className="w-5 h-5" />
                            </div>
                            <div className="min-w-0">
                                <h4 className="font-bold text-slate-900 dark:text-white truncate">{room.name}</h4>
                                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 truncate flex items-center gap-1">
                                    <Users className="w-3 h-3" />
                                    {room.students} students studying
                                </p>
                            </div>
                        </div>
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/room/${room.id}`);
                            }}
                            className="flex-shrink-0 px-4 py-1.5 text-xs font-bold bg-slate-900 dark:bg-white hover:bg-indigo-600 text-white dark:text-slate-900 dark:hover:text-white hover:-translate-y-0.5 shadow-sm rounded-lg transition-all"
                        >
                            Join
                        </button>
                    </div>
                 ))
             ) : (
                 <p className="text-sm text-slate-500">No active rooms found.</p>
             )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;
