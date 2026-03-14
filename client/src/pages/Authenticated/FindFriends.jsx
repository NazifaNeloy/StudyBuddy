import { Users } from 'lucide-react';

function FindFriends() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center text-center">
      <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-500/10 rounded-full flex items-center justify-center mb-6 text-indigo-600 dark:text-indigo-400">
        <Users className="w-10 h-10" />
      </div>
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Find Friends</h1>
      <p className="text-slate-600 dark:text-slate-400 max-w-md">
        Connect with classmates and other students studying similar subjects. This feature is coming soon!
      </p>
    </div>
  );
}

export default FindFriends;
