import { User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

function Profile() {
  const { user, logout } = useAuth();

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 min-h-[calc(100vh-4rem)] flex flex-col items-center pt-20">
      <div className="w-32 h-32 bg-indigo-100 dark:bg-indigo-500/20 rounded-full flex items-center justify-center mb-6 text-indigo-600 dark:text-indigo-400 border-4 border-white dark:border-slate-800 shadow-xl">
        <User className="w-16 h-16" />
      </div>
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{user?.name}</h1>
      <p className="text-slate-600 dark:text-slate-400 mb-8">{user?.email}</p>
      
      <button 
        onClick={logout}
        className="px-6 py-2 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 rounded-lg font-medium transition-colors border border-red-200 dark:border-red-500/20"
      >
        Sign Out
      </button>
    </div>
  );
}

export default Profile;
