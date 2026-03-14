import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  BookOpen, 
  Users, 
  Clock, 
  Loader2, 
  Trophy, 
  ArrowRight,
  Zap,
  TrendingUp,
  Activity,
  UserPlus
} from 'lucide-react';
import { motion } from 'framer-motion';

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
          <div className="flex h-screen items-center justify-center bg-[#F9F9F9] dark:bg-slate-950">
              <div className="relative">
                <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
                <div className="absolute inset-0 blur-xl bg-indigo-500/20 animate-pulse rounded-full" />
              </div>
          </div>
      );
  }

  if (error || !data) {
      return (
          <div className="flex flex-col h-screen items-center justify-center text-center px-6 bg-[#F9F9F9] dark:bg-slate-950">
              <div className="w-20 h-20 bg-red-100 dark:bg-red-500/10 text-red-500 rounded-[2rem] flex items-center justify-center mb-6 shadow-xl">
                  <span className="font-black text-3xl">!</span>
              </div>
              <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Connection Lost</h2>
              <p className="text-slate-500 mt-3 font-medium max-w-sm">{error || 'Unable to sync with the study network.'}</p>
              <button 
                onClick={() => window.location.reload()}
                className="mt-8 px-8 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full font-black shadow-lg"
              >
                Retry Sync
              </button>
          </div>
      );
  }

  return (
    <div className="bg-[#F9F9F9] dark:bg-slate-950 min-h-screen pt-8 pb-20 transition-colors">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
            <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
            >
                <h1 className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                    Hey, <span className="text-indigo-600">{user?.name}</span>! 👋
                </h1>
                <p className="text-lg text-slate-500 dark:text-slate-400 font-medium mt-2">
                    Your study hub is primed and ready for productivity.
                </p>
            </motion.div>
            
            <button 
                onClick={() => navigate('/find-friends')}
                className="flex items-center gap-3 px-8 py-4 bg-white dark:bg-white/5 text-slate-900 dark:text-white border-2 border-slate-100 dark:border-white/10 rounded-2xl font-black shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group"
            >
                <UserPlus className="w-5 h-5 text-indigo-600" />
                Find Squad Members
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
        </div>

        {/* Stats Grid - Bubbly Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {[
                { label: `Rank #${data.stats.rank}`, value: `${data.stats.points.toLocaleString()} pts`, icon: Trophy, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-500/10" },
                { label: "Focus Goal", value: `${data.stats.studyHours} hrs`, icon: Clock, color: "text-indigo-500", bg: "bg-indigo-50 dark:bg-indigo-500/10" },
                { label: "Network Activity", value: `${data.friendActivity.length} Events`, icon: Activity, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-500/10" }
            ].map((stat, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="p-8 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 shadow-sm relative overflow-hidden group hover:shadow-2xl transition-all duration-500"
                >
                    <div className="relative z-10 flex flex-col">
                        <div className={`w-14 h-14 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center mb-6 shadow-inner`}>
                            <stat.icon className="w-7 h-7" />
                        </div>
                        <p className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">{stat.label}</p>
                        <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{stat.value}</h3>
                    </div>
                </motion.div>
            ))}
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
            
            {/* Feed Section - Bento Box Wide */}
            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="lg:col-span-3 p-10 rounded-[3rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 shadow-sm"
            >
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600">
                        <Zap className="w-5 h-5" />
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Network Activity</h2>
                </div>

                <div className="space-y-6">
                    {data.friendActivity && data.friendActivity.length > 0 ? (
                        data.friendActivity.map((activity, idx) => (
                            <div key={idx} className="flex items-center gap-5 group cursor-default">
                                <div className="w-3 h-3 rounded-full bg-emerald-500 group-hover:scale-150 transition-transform shadow-lg shadow-emerald-500/30" />
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-slate-700 dark:text-slate-300 truncate leading-tight group-hover:text-indigo-600 transition-colors">
                                        {activity.message}
                                    </p>
                                    <p className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5">
                                        Active {activity.time}
                                    </p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="py-20 text-center bg-slate-50 dark:bg-white/5 rounded-[2rem] border-2 border-dashed border-slate-200 dark:border-white/10">
                            <p className="font-bold text-slate-500">Silence is golden. Invite friends!</p>
                        </div>
                    )}
                </div>
            </motion.div>

            {/* Trending Section - Bento Box Sidebar */}
            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="lg:col-span-2 p-10 rounded-[3rem] bg-slate-900 border border-white/5 shadow-2xl relative overflow-hidden"
            >
                {/* Accent Blob */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/20 blur-3xl pointer-events-none" />

                <div className="flex items-center justify-between mb-8 relative z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-white">
                            <TrendingUp className="w-5 h-5" />
                        </div>
                        <h2 className="text-2xl font-black text-white tracking-tight">Active Rooms</h2>
                    </div>
                </div>

                <div className="space-y-4 relative z-10">
                    {data.activeRooms && data.activeRooms.length > 0 ? (
                        data.activeRooms.map((room) => (
                            <div key={room.id} className="p-5 rounded-[2rem] bg-white/5 border border-white/5 hover:border-indigo-500/30 transition-all group flex items-center justify-between gap-4">
                                <div className="flex items-center gap-4 min-w-0">
                                    <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                        <BookOpen className="w-6 h-6" />
                                    </div>
                                    <div className="min-w-0">
                                        <h4 className="font-bold text-white truncate">{room.name}</h4>
                                        <p className="text-xs font-bold text-slate-500 flex items-center gap-1.5 uppercase tracking-tight mt-1">
                                            <Users className="w-3 h-3 text-indigo-400" />
                                            {room.students} Live
                                        </p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => navigate(`/room/${room.id}`)}
                                    className="px-6 py-2 bg-white text-slate-900 rounded-xl font-black text-xs hover:bg-indigo-600 hover:text-white transition-all shadow-xl shadow-white/5"
                                >
                                    Join
                                </button>
                            </div>
                        ))
                    ) : (
                        <p className="text-sm font-bold text-slate-500 text-center py-10">All rooms are currently quiet.</p>
                    )}
                </div>

                <div className="mt-8 pt-8 border-t border-white/5 relative z-10">
                   <button 
                    onClick={() => navigate('/my-groups')}
                    className="w-full flex items-center justify-center gap-2 text-indigo-400 font-black text-sm uppercase tracking-widest hover:text-white transition-colors"
                   >
                     Manage Your Groups <ChevronRight className="w-4 h-4" />
                   </button>
                </div>
            </motion.div>

        </div>
      </div>
    </div>
  );
}

// Minimal icons
function ChevronRight(props) {
    return <ArrowRight {...props} />
}

export default Dashboard;
