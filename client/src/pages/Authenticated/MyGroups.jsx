import { BookOpen } from 'lucide-react';

function MyGroups() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center text-center">
      <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-500/10 rounded-full flex items-center justify-center mb-6 text-emerald-600 dark:text-emerald-400">
        <BookOpen className="w-10 h-10" />
      </div>
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">My Groups</h1>
      <p className="text-slate-600 dark:text-slate-400 max-w-md">
        Manage your study groups, assignments, and shared resources here.
      </p>
    </div>
  );
}

export default MyGroups;
