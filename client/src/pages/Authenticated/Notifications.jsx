import { useState, useEffect } from 'react';
import { Bell, Check, X, Loader2, Users, Gift } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

function Notifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/users/${user.id}/notifications`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      if (res.ok) setNotifications(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) fetchNotifications();
  }, [user]);

  const handleAction = async (notif, action) => {
    setProcessingId(notif.id);
    try {
      // If it's a join request, we hit the groups approve endpoint
      if (notif.type === 'JOIN_REQUEST' && action === 'approve') {
          const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/groups/${notif.data.groupId}/approve`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ userId: notif.data.senderId })
          });
          if (!res.ok) throw new Error('Failed to approve');
      }

      // Mark notification as read
      await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/users/${user.id}/notifications/${notif.id}/read`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      // Update local state
      setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, is_read: true } : n));
    } catch (err) {
      console.error(err);
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
      </div>
    );
  }

  const unreadNotifications = notifications.filter(n => !n.is_read);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 min-h-[calc(100vh-4rem)]">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Notifications</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">Manage your activity and join requests.</p>
        </div>
        <div className="px-4 py-1.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-full text-sm font-bold">
           {unreadNotifications.length} New
        </div>
      </div>

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center border-2 border-dashed border-slate-200 dark:border-white/10 rounded-3xl">
            <Bell className="w-12 h-12 text-slate-300 mb-4" />
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">No notifications</h3>
            <p className="text-slate-500">Activity from your study groups will appear here.</p>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {notifications.map((notif) => (
              <motion.div
                key={notif.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-6 rounded-3xl border transition-all ${
                  notif.is_read 
                    ? 'bg-white/50 dark:bg-slate-900/50 border-slate-100 dark:border-white/5 opacity-60' 
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-white/10 shadow-sm'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                    notif.type === 'JOIN_REQUEST' 
                      ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400' 
                      : 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400'
                  }`}>
                    {notif.type === 'JOIN_REQUEST' ? <Users className="w-6 h-6" /> : <Gift className="w-6 h-6" />}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <p className="font-bold text-slate-900 dark:text-white">{notif.message}</p>
                      <span className="text-xs text-slate-400 font-medium">{new Date(notif.created_at).toLocaleDateString()}</span>
                    </div>
                    
                    {notif.type === 'JOIN_REQUEST' && !notif.is_read && (
                      <div className="mt-4 flex gap-3">
                        <button
                          onClick={() => handleAction(notif, 'approve')}
                          disabled={processingId === notif.id}
                          className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-all disabled:opacity-50"
                        >
                          {processingId === notif.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                          Approve
                        </button>
                        <button
                          onClick={() => handleAction(notif, 'deny')}
                          disabled={processingId === notif.id}
                          className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2 bg-slate-100 dark:bg-white/5 hover:bg-red-50 dark:hover:bg-red-500/10 text-slate-600 dark:text-slate-400 hover:text-red-500 rounded-xl transition-all disabled:opacity-50"
                        >
                          <X className="w-4 h-4" />
                          Ignore
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}

export default Notifications;
