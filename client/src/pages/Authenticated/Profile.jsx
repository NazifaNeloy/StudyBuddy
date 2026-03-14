import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User as UserIcon, Lock, Globe, Save, Loader2, Award } from 'lucide-react';
import { motion } from 'framer-motion';

function Profile() {
    const { user } = useAuth();
    const [bio, setBio] = useState(user?.bio || '');
    const [isPrivate, setIsPrivate] = useState(user?.is_private || false);
    
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Sync state if user context updates late
    useEffect(() => {
        if (user) {
            setBio(user.bio || '');
            setIsPrivate(user.is_private || false);
        }
    }, [user]);

    const handleSave = async (e) => {
        e.preventDefault();
        if (!user?.id) return;

        setIsSaving(true);
        setMessage({ type: '', text: '' });

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/users/${user.id}/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ bio, isPrivate })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Failed to update profile');
            
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
        } catch (err) {
            setMessage({ type: 'error', text: err.message });
        } finally {
            setIsSaving(false);
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-[calc(100vh-4rem)]">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Profile Settings</h1>
                <p className="text-slate-600 dark:text-slate-400 mt-2">Manage your personal information and privacy controls.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {/* Visual Identity Card */}
                <div className="md:col-span-1 space-y-6">
                    <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 shadow-sm text-center">
                        <div className="w-24 h-24 mx-auto rounded-full bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-4">
                            <UserIcon className="w-12 h-12" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">{user?.name}</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
                        
                        <div className="mt-6 pt-6 border-t border-slate-100 dark:border-white/5 flex items-center justify-center gap-2">
                            <Award className="w-5 h-5 text-amber-500" />
                            <span className="font-bold text-slate-900 dark:text-white">{user?.points || 0} Points</span>
                        </div>
                    </div>
                </div>

                {/* Edit Form */}
                <form onSubmit={handleSave} className="md:col-span-2 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 shadow-sm space-y-6">
                    
                    {message.text && (
                        <motion.div 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`p-4 rounded-xl text-sm font-medium ${
                                message.type === 'success' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' 
                                : 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400'
                            }`}
                        >
                            {message.text}
                        </motion.div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            About Me (Bio)
                        </label>
                        <textarea
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            rows={4}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                            placeholder="Tell your study buddies a little about yourself..."
                        />
                    </div>

                    <div className="pt-6 border-t border-slate-100 dark:border-white/5">
                        <label className="flex items-center justify-between cursor-pointer group">
                            <div>
                                <h3 className="text-sm font-medium text-slate-900 dark:text-white flex items-center gap-2">
                                    {isPrivate ? <Lock className="w-4 h-4 text-amber-500" /> : <Globe className="w-4 h-4 text-emerald-500" />}
                                    Profile Discovery Privacy
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                    {isPrivate 
                                        ? "Your profile is hidden from the Find Friends network." 
                                        : "You can be discovered by others with matching skills."}
                                </p>
                            </div>
                            
                            {/* Custom Toggle Switch */}
                            <div className="relative inline-flex items-center cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    className="sr-only peer"
                                    checked={isPrivate}
                                    onChange={() => setIsPrivate(!isPrivate)}
                                />
                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-amber-500"></div>
                            </div>
                        </label>
                    </div>

                    <div className="pt-6 flex justify-end">
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition-all shadow-sm"
                        >
                            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}

export default Profile;
