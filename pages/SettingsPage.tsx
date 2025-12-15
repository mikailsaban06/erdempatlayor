import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Bell, Shield, Palette } from 'lucide-react';

const SettingsPage = () => {
    const navigate = useNavigate();

    return (
        <div className="flex-1 h-full overflow-y-auto bg-gray-50 dark:bg-[#09090b] custom-scrollbar">
            <div className="max-w-3xl mx-auto px-6 py-12">
                
                <button 
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-zinc-500 hover:text-zinc-300 mb-8 transition-colors"
                >
                    <ArrowLeft size={20} /> Back
                </button>

                <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-8">User Settings</h1>

                <div className="space-y-6">
                    
                    {/* Account */}
                    <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <User size={20} className="text-indigo-500" /> Account
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-zinc-500 mb-1">Username</label>
                                <input type="text" value="DemoUser" disabled className="w-full bg-zinc-100 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-lg px-4 py-2 text-zinc-500 cursor-not-allowed" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-zinc-500 mb-1">Email</label>
                                <input type="email" value="demo@rigbuilder.com" disabled className="w-full bg-zinc-100 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-lg px-4 py-2 text-zinc-500 cursor-not-allowed" />
                            </div>
                        </div>
                    </div>

                    {/* Appearance */}
                    <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <Palette size={20} className="text-purple-500" /> Appearance
                        </h2>
                        <div className="flex items-center justify-between">
                            <span className="text-zinc-700 dark:text-zinc-300">Dark Mode</span>
                            <span className="text-xs text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded">Controlled via Header</span>
                        </div>
                    </div>

                    {/* Notifications */}
                    <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <Bell size={20} className="text-amber-500" /> Notifications
                        </h2>
                        <div className="space-y-3">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input type="checkbox" defaultChecked className="w-4 h-4 accent-indigo-500" />
                                <span className="text-zinc-700 dark:text-zinc-300">Email updates for replies</span>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input type="checkbox" defaultChecked className="w-4 h-4 accent-indigo-500" />
                                <span className="text-zinc-700 dark:text-zinc-300">New feature announcements</span>
                            </label>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default SettingsPage;