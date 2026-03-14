import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { BookOpen, Plus, Loader2, Users, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function MyGroups() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    
    // Modal Form State
    const [title, setTitle] = useState('');
    const [courseCode, setCourseCode] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    
    const fetchGroups = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/groups/me`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            const data = await res.json();
            if (res.ok) {
                setGroups(data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) fetchGroups();
    }, [user]);

    const handleCreateGroup = async (e) => {
        e.preventDefault();
        setIsCreating(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/groups`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ title, courseCode, isPrivate: false })
            });

            const newGroup = await res.json();
            if (res.ok) {
                setGroups([newGroup, ...groups]);
                setIsCreateModalOpen(false);
                setTitle('');
                setCourseCode('');
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsCreating(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
                <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-[calc(100vh-4rem)]">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">My Study Groups</h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-2">Manage your active course sessions and cohorts.</p>
                </div>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-sm transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Create Group
                </button>
            </div>

            {groups.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center border-2 border-dashed border-slate-200 dark:border-white/10 rounded-2xl">
                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                        <BookOpen className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No Groups Yet</h3>
                    <p className="text-slate-500 max-w-sm mb-6">Create a group for your course or head over to the dashboard to discover active sessions.</p>
                    <button
                         onClick={() => navigate('/dashboard')}
                         className="px-6 py-2.5 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-white font-semibold rounded-xl transition-colors"
                    >
                        Browse Dashboard
                    </button>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {groups.map((group) => (
                        <div key={group.id} className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 shadow-sm group hover:border-indigo-500/50 transition-colors">
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold border border-indigo-100 dark:border-indigo-500/20">
                                    {group.course_code.substring(0, 4)}
                                </div>
                                <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold rounded-full">
                                    Active
                                </span>
                            </div>
                            
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1 truncate">{group.title}</h3>
                            <p className="text-sm font-medium text-slate-500 mb-6">{group.course_code}</p>
                            
                            <div className="flex items-center gap-4 pt-4 border-t border-slate-100 dark:border-white/5 mb-6">
                                <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                                    <Users className="w-4 h-4" />
                                    Members
                                </div>
                                <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                                    <Calendar className="w-4 h-4" />
                                    Created {new Date(group.created_at).toLocaleDateString()}
                                </div>
                            </div>
                            
                            <button
                                onClick={() => navigate(`/room/${group.id}`)}
                                className="w-full py-3 bg-slate-900 dark:bg-white hover:bg-indigo-600 dark:hover:bg-indigo-500 text-white dark:text-slate-900 dark:hover:text-white font-bold rounded-xl transition-colors"
                            >
                                Enter Study Room
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Create Group Modal */}
            <AnimatePresence>
                {isCreateModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
                        onClick={() => setIsCreateModalOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-lg overflow-hidden bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10"
                        >
                            <div className="p-6 sm:p-8">
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Create Study Group</h2>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Launch a new real-time collaborative room for your course.</p>
                                
                                <form onSubmit={handleCreateGroup} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                            Group Title
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white transition-all"
                                            placeholder="e.g. Finals Prep: Algorithms"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                            Course Code
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={courseCode}
                                            onChange={(e) => setCourseCode(e.target.value)}
                                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white uppercase transition-all"
                                            placeholder="e.g. CS101"
                                            maxLength={8}
                                        />
                                    </div>
                                    
                                    <div className="flex gap-3 pt-4">
                                        <button
                                            type="button"
                                            onClick={() => setIsCreateModalOpen(false)}
                                            className="flex-1 py-3 px-4 font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isCreating}
                                            className="flex-1 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors"
                                        >
                                            {isCreating ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Launch Room'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default MyGroups;
