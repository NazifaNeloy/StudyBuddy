import { Bell } from 'lucide-react';

function Notifications() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center text-center">
      <div className="w-20 h-20 bg-amber-50 dark:bg-amber-500/10 rounded-full flex items-center justify-center mb-6 text-amber-600 dark:text-amber-400">
        <Bell className="w-10 h-10" />
      </div>
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Notifications</h1>
      <p className="text-slate-600 dark:text-slate-400 max-w-md">
        You have no new notifications. Activity from your study groups will appear here.
      </p>
    </div>
  );
}

export default Notifications;
