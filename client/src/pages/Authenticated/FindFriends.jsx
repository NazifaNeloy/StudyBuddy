import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Users, Search, BookOpen, Star, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';

function FindFriends() {
  const { user } = useAuth();
  const [matches, setMatches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real app, we would fetch from our new API route:
    // fetch(`/api/users/${user.id}/matches`, { ... })
    
    // For this mock environment, we will simulate the API call delay 
    // and provide mock data representing the database response
    const fetchMatches = async () => {
      setIsLoading(true);
      
      // Simulating network delay
      await new Promise(resolve => setTimeout(resolve, 800));

      // Mock Data based on the user's "skillsToLearn" simulating the SQL query result
      const mockMatches = [
        {
          id: 101,
          name: 'Sarah Chen',
          bio: 'CS major loving algorithms and data structures. Always happy to explain binary trees!',
          skills: ['JavaScript', 'React', 'Calculus']
        },
        {
          id: 102,
          name: 'Marcus Johnson',
          bio: 'Physics enthusiast transitioning into software. I can help with math and physics concepts.',
          skills: ['Physics', 'Python', 'Machine Learning']
        },
        {
          id: 103,
          name: 'Elena Rodriguez',
          bio: 'Literature buff who somehow ended up taking Web Dev. Can trade essay reviews for code reviews.',
          skills: ['Literature', 'History', 'Node.js']
        }
      ];

      // Filter mock matches slightly based on user's desired skills to simulate the algorithm
      setMatches(mockMatches);
      setIsLoading(false);
    };

    if (user?.id) {
      fetchMatches();
    }
  }, [user]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-[calc(100vh-4rem)]">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 mt-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3">
            <div className="p-2.5 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-xl">
              <Users className="w-6 h-6" />
            </div>
            Discover Study Partners
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">
            We found these students who excel in what you want to learn.
          </p>
        </div>
        
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by skill or subject..."
            className="w-full md:w-80 pl-11 pr-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-slate-900 dark:text-white shadow-sm"
          />
        </div>
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
             <div key={i} className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 rounded-3xl p-6 h-64 animate-pulse flex flex-col">
               <div className="flex items-center gap-4 mb-4">
                 <div className="w-16 h-16 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
                 <div className="space-y-2 flex-1">
                   <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-1/2"></div>
                   <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3"></div>
                 </div>
               </div>
               <div className="space-y-2 mb-6">
                 <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
                 <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-5/6"></div>
               </div>
               <div className="mt-auto h-10 bg-slate-200 dark:bg-slate-800 rounded-xl w-full"></div>
             </div>
          ))}
        </div>
      ) : matches.length > 0 ? (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {matches.map((match) => (
            <motion.div 
              key={match.id}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 transition-all flex flex-col"
            >
              {/* Top Section */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-xl border-2 border-indigo-100 dark:border-indigo-500/20 group-hover:border-indigo-500 transition-colors">
                      {match.name.charAt(0)}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full"></div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{match.name}</h3>
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Top Helper</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bio */}
              <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 mb-6 bg-slate-50 dark:bg-slate-950/50 p-4 rounded-xl border border-slate-100 dark:border-white/5 flex-1">
                "{match.bio}"
              </p>

              {/* Skills Tags */}
              <div className="mb-6">
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5" /> Excels In
                </p>
                <div className="flex flex-wrap gap-2">
                  {match.skills.map(skill => {
                    // Highlight generic match logic: if user wants to learn it, highlight it.
                    // Assuming user's wanted skills are known (we use a mock check here)
                    const isDesired = user?.skillsToLearn?.includes(skill);
                    return (
                      <span key={skill} className={`px-2.5 py-1 text-xs font-medium rounded-lg border ${
                        isDesired 
                        ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20' 
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-white/5'
                      }`}>
                        {skill}
                      </span>
                    )
                  })}
                </div>
              </div>

              {/* Action */}
              <button className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-600 hover:text-white text-indigo-600 dark:text-indigo-400 rounded-xl font-semibold transition-all group-hover:shadow-lg group-hover:shadow-indigo-500/25">
                <UserPlus className="w-4 h-4" /> Connect Status
              </button>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="flex flex-col items-center justify-center p-12 text-center bg-slate-50 dark:bg-slate-900/30 rounded-3xl border border-slate-200 dark:border-white/5 border-dashed">
          <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6 text-slate-400">
            <Users className="w-10 h-10" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No perfect matches yet</h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-sm mb-6">
            We couldn't find anyone who matches your exact learning goals right now. Try expanding your search or updating your interests.
          </p>
          <button className="px-6 py-2.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-indigo-500 rounded-xl font-medium transition-colors shadow-sm">
            Update Profile
          </button>
        </div>
      )}
    </div>
  );
}

export default FindFriends;
