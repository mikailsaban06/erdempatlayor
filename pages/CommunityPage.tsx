import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Users, PlusCircle, ArrowRight, Star, LogOut, CheckCircle2 } from 'lucide-react';
import { CommunityStore } from '../utils/communityStore';
import { Group } from '../types';

const CommunityPage = () => {
    const navigate = useNavigate();
    const [groups, setGroups] = useState<Group[]>([]);
    const [myGroups, setMyGroups] = useState<Group[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        // Load data on mount
        refreshData();
    }, []);

    const refreshData = () => {
        setGroups(CommunityStore.getPopularGroups());
        setMyGroups(CommunityStore.getMyGroups());
    };

    const handleLeaveGroup = (e: React.MouseEvent, groupId: string) => {
        e.stopPropagation();
        if (confirm('Are you sure you want to leave this group?')) {
            CommunityStore.leaveGroup(groupId);
            refreshData();
        }
    };

    const filteredGroups = groups.filter(g => 
        g.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        g.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="flex-1 h-full overflow-y-auto bg-gray-50 dark:bg-[#09090b] custom-scrollbar">
            
            {/* Header Banner */}
            <div className="relative bg-zinc-900 border-b border-zinc-800 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/40 to-purple-900/40 z-0"></div>
                <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 md:py-16">
                    <h1 className="text-4xl font-extrabold text-white mb-4">Community Forums</h1>
                    <p className="text-xl text-zinc-300 max-w-2xl mb-8">
                        Join clans, share your builds, and chat with hardware enthusiasts from around the world.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1 max-w-lg">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
                            <input 
                                type="text"
                                placeholder="Search groups, clans, topics..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-xl pl-12 pr-4 py-4 text-white placeholder:text-zinc-400 focus:outline-none focus:border-indigo-500 focus:bg-zinc-900/80 transition-all"
                            />
                        </div>
                        <button 
                            onClick={() => navigate('/community/create')}
                            className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-xl font-bold transition-transform active:scale-95 shadow-lg shadow-indigo-600/20"
                        >
                            <PlusCircle size={20} />
                            Create Group
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
                
                {/* --- MY GROUPS SECTION --- */}
                <section>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                        <CheckCircle2 className="text-emerald-500" /> My Groups
                    </h2>
                    
                    {myGroups.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {myGroups.map(group => (
                                <div 
                                    key={group.id} 
                                    className="group bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl overflow-hidden hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 flex flex-col cursor-pointer"
                                    onClick={() => navigate(`/g/${group.slug}`)}
                                >
                                    <div className="h-24 w-full bg-zinc-800 relative">
                                        <img src={group.banner} alt={group.name} className="w-full h-full object-cover opacity-80" />
                                        <div className="absolute top-4 left-4">
                                            <img src={group.avatar} alt={group.name} className="w-12 h-12 rounded-lg border-2 border-white dark:border-zinc-900 shadow-md object-cover bg-zinc-800" />
                                        </div>
                                    </div>
                                    <div className="p-5 flex-1 flex flex-col">
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-indigo-500 transition-colors">
                                            {group.name}
                                        </h3>
                                        <p className="text-xs text-emerald-500 font-bold mb-3 flex items-center gap-1">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Active Now
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-zinc-400 line-clamp-2 mb-4 flex-1">
                                            {group.description}
                                        </p>
                                        
                                        <div className="flex items-center gap-2 mt-auto">
                                            <button 
                                                className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm rounded-lg font-bold transition-colors"
                                            >
                                                Open Chat
                                            </button>
                                            <button 
                                                onClick={(e) => handleLeaveGroup(e, group.id)}
                                                className="p-2 bg-gray-100 dark:bg-zinc-800 hover:bg-red-100 dark:hover:bg-red-900/20 text-gray-500 dark:text-zinc-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg transition-colors"
                                                title="Leave Group"
                                            >
                                                <LogOut size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-zinc-900 border border-dashed border-gray-300 dark:border-zinc-700 rounded-2xl p-8 text-center">
                            <Users size={32} className="mx-auto text-gray-400 dark:text-zinc-600 mb-3" />
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">You haven't joined any groups yet</h3>
                            <p className="text-gray-500 dark:text-zinc-500 mb-4 text-sm">Join a community to start chatting and sharing your builds.</p>
                        </div>
                    )}
                </section>

                {/* --- TRENDING GROUPS SECTION --- */}
                <section>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                        <Star className="text-amber-500" fill="currentColor" /> Trending & Popular
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredGroups.map(group => (
                            <div 
                                key={group.id} 
                                className="group bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl overflow-hidden hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 flex flex-col"
                            >
                                {/* Card Banner */}
                                <div className="h-32 w-full bg-zinc-800 relative">
                                    <img src={group.banner} alt={group.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                                    <div className="absolute -bottom-8 left-6">
                                        <img src={group.avatar} alt={group.name} className="w-16 h-16 rounded-xl border-4 border-white dark:border-zinc-900 shadow-lg object-cover bg-zinc-800" />
                                    </div>
                                </div>

                                <div className="pt-10 px-6 pb-6 flex-1 flex flex-col">
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1 group-hover:text-indigo-500 transition-colors">
                                            {group.name}
                                        </h3>
                                        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-zinc-400 mb-3">
                                            <span className="flex items-center gap-1">
                                                <Users size={14} /> {group.members.length} members
                                            </span>
                                            <span>•</span>
                                            <span className="text-emerald-500 font-medium">Active now</span>
                                        </div>
                                        <p className="text-sm text-gray-600 dark:text-zinc-400 line-clamp-2 mb-4">
                                            {group.description}
                                        </p>
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {group.tags.map(tag => (
                                                <span key={tag} className="px-2 py-1 bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400 text-xs rounded-md font-medium">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => navigate(`/g/${group.slug}`)}
                                        className="w-full flex items-center justify-center gap-2 py-2.5 bg-gray-50 dark:bg-zinc-800 hover:bg-indigo-600 dark:hover:bg-indigo-600 text-gray-700 dark:text-zinc-300 hover:text-white rounded-lg font-bold transition-all"
                                    >
                                        View Group <ArrowRight size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredGroups.length === 0 && (
                         <div className="text-center py-20">
                            <p className="text-zinc-500">No groups found matching your search.</p>
                         </div>
                    )}
                </section>

            </div>
        </div>
    );
};

export default CommunityPage;