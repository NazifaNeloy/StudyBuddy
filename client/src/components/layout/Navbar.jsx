import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Moon, Sun, User, LogOut, Bell, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

function Navbar({ isConnected }) {
  const { isAuthenticated, logout, user } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  // Notification State
  const [isNotifDropdownOpen, setIsNotifDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const notifRef = useRef(null);
  const [globalSocket, setGlobalSocket] = useState(null);

  useEffect(() => {
    if (!isAuthenticated || !user?.id) return;

    const socket = io(SOCKET_URL);
    
    socket.on('connect', () => {
        socket.emit('register_user', user.id);
    });

    socket.on('new_notification', (notif) => {
        setNotifications(prev => [notif, ...prev]);
    });

    setGlobalSocket(socket);

    // Initial fetch (mocked for now, assumes API route exists)
    const fetchNotifs = async () => {
        try {
            const response = await fetch(`http://localhost:5001/api/users/${user.id}/notifications`);
            if (response.ok) {
                const data = await response.json();
                setNotifications(data);
            }
        } catch (err) {
            console.error('Failed to fetch notifications', err);
        }
    };
    fetchNotifs();

    return () => {
        socket.disconnect();
    };
  }, [isAuthenticated, user]);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const handleMarkAsRead = async (notifId, e) => {
      e.stopPropagation();
      setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, is_read: true } : n));
      try {
          await fetch(`http://localhost:5001/api/users/${user.id}/notifications/${notifId}/read`, { method: 'PUT' });
      } catch (err) {
          console.error(err);
      }
  };

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotifDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="border-b border-white/10 bg-slate-50/50 dark:bg-slate-950/50 backdrop-blur-xl transition-colors z-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center gap-2">
            <BookOpen className="w-8 h-8 text-indigo-500" />
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">StudyBuddy</span>
          </Link>

          {/* Center Links */}
          <div className="hidden md:flex items-center gap-8">
            {!isAuthenticated ? (
              <>
                <Link to="/" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors">Home</Link>
                <Link to="/how-it-works" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors">How it Works</Link>
              </>
            ) : (
              <>
                <Link to="/dashboard" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors">Dashboard</Link>
                <Link to="/find-friends" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors">Find Friends</Link>
                <Link to="/my-groups" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors">My Groups</Link>
                {/* Removed static Notifications link since we have the bell now */}
              </>
            )}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            
            {/* Live Indicator */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-200 dark:bg-slate-900 border border-black/5 dark:border-white/5">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
              <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                {isConnected ? 'Live' : 'Disconnected'}
              </span>
            </div>

            {/* Notification Bell */}
            {isAuthenticated && (
                <div className="relative" ref={notifRef}>
                  <button 
                    onClick={() => setIsNotifDropdownOpen(!isNotifDropdownOpen)}
                    className="relative p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1.5 w-2.5 h-2.5 bg-red-500 border-2 border-white dark:border-slate-950 rounded-full"></span>
                    )}
                  </button>

                  {/* Notification Dropdown */}
                  {isNotifDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl shadow-xl z-50 overflow-hidden transform origin-top-right transition-all">
                      <div className="px-4 py-3 border-b border-slate-100 dark:border-white/5 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
                        <span className="font-semibold text-slate-900 dark:text-white">Notifications</span>
                        {unreadCount > 0 && (
                          <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400 px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-500/10">
                            {unreadCount} New
                          </span>
                        )}
                      </div>
                      <div className="max-h-80 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-6 text-center text-slate-500 dark:text-slate-400 text-sm">
                                No notifications yet.
                            </div>
                        ) : (
                            notifications.map(notif => (
                                <div key={notif.id} className={`p-4 border-b border-slate-100 dark:border-white/5 transition-colors cursor-pointer ${notif.is_read ? 'bg-white dark:bg-slate-900 opacity-70' : 'bg-indigo-50/50 dark:bg-indigo-500/10'}`}>
                                    <div className="flex justify-between items-start gap-4">
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-slate-900 dark:text-white mb-1">{notif.message}</p>
                                            <p className="text-xs text-slate-500">{new Date(notif.created_at || Date.now()).toLocaleTimeString()}</p>
                                        </div>
                                        {!notif.is_read && (
                                            <button 
                                                onClick={(e) => handleMarkAsRead(notif.id, e)}
                                                className="shrink-0 p-1 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 mt-0.5"
                                                title="Mark as read"
                                            >
                                                <CheckCircle2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
            )}

            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-400"
              aria-label="Toggle theme"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Auth Buttons */}
            {!isAuthenticated ? (
              <Link to="/auth" className="px-5 py-2 text-sm font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md shadow-indigo-500/20">
                Sign In
              </Link>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/profile" className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-500">
                    <User className="w-4 h-4" />
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-slate-700 dark:text-slate-300">
                    {user?.name || 'Profile'}
                  </span>
                </Link>
                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-amber-500 bg-amber-50 dark:bg-amber-500/10 px-2 py-1 rounded-full border border-amber-200 dark:border-amber-500/20">
                        {user?.points || 0} pts
                    </span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
