import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Users, Shield, MessageSquare, LogOut, UserPlus, Settings, ArrowLeft, Calendar, Pin, Bell } from 'lucide-react';
import { CommunityStore, CURRENT_USER } from '../utils/communityStore';
import { Group, GroupRole } from '../types';
import ChatInterface from '../components/ChatInterface';

type TabType = 'home' | 'chat' | 'members';

const GroupProfilePage = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [group, setGroup] = useState<Group | undefined>(undefined);
    const [activeTab, setActiveTab] = useState<TabType>('home');
    const [isMember, setIsMember] = useState(false);
    const [userRole, setUserRole] = useState<GroupRole | undefined>(undefined);

    useEffect(() => {
        if (!slug) return;
        const foundGroup = CommunityStore.getGroup(slug);
        if (foundGroup) {
            setGroup(foundGroup);
            // Safety check for members array
            const member = foundGroup.members?.find(m => m.userId === CURRENT_USER.id);
            setIsMember(!!member);
            setUserRole(member?.role);
        } else {
            navigate('/community');
        }
    }, [slug, navigate]);

    const handleJoinToggle = () => {
        if (!group) return;

        if (isMember) {
            if (window.confirm("Are you sure you want to leave this group?")) {
                const success = CommunityStore.leaveGroup(group.id);
                if (success) {
                    setIsMember(false);
                    setUserRole(undefined);
                } else {
                    alert("You cannot leave this group because you are the Owner. Please transfer ownership first in Settings.");
                }
            }
        } else {
            CommunityStore.joinGroup(group.id);
            setIsMember(true);
            setUserRole('MEMBER');
            setActiveTab('chat');
        }
        setGroup(CommunityStore.getGroup(slug!));
    };

    if (!group) return <div className="flex-1 flex items-center justify-center text-white">Loading...</div>;

    // Safe date handling to prevent invalid date crashes
    const safeDate = group.createdAt ? new Date(group.createdAt) : new Date();
    const formattedDate = !isNaN(safeDate.getTime()) 
        ? safeDate.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) 
        : 'Unknown Date';

    const admins = group.members?.filter(m => m.role === 'OWNER' || m.role === 'MODERATOR') || [];
    const announcements = group.announcements || [];
    const pinnedAnnouncements = announcements.filter(a => a.isPinned);
    const otherAnnouncements = announcements.filter(a => !a.isPinned);

    return (
        <div className="flex-1 h-full overflow-y-auto bg-gray-50 dark:bg-[#09090b] custom-scrollbar relative">
            
            {/* Back Button */}
            <div className="absolute top-6 left-6 z-30">
                <button 
                    onClick={() => navigate('/community')}
                    className="flex items-center gap-2 bg-black/50 backdrop-blur-md text-white px-4 py-2 rounded-full hover:bg-black/70 transition-colors"
                >
                    <ArrowLeft size={16} /> Back
                </button>
            </div>

            {/* Banner */}
            <div className="h-48 md:h-64 w-full bg-zinc-800 relative">
                <img src={group.banner} alt="Banner" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent opacity-80"></div>
            </div>

            {/* Profile Header */}
            <div className="max-w-7xl mx-auto px-6 relative -mt-16 mb-8">
                <div className="flex flex-col md:flex-row items-end md:items-center gap-6">
                    {/* Avatar */}
                    <div className="w-32 h-32 rounded-3xl border-4 border-gray-50 dark:border-zinc-950 bg-zinc-800 shadow-2xl overflow-hidden flex-shrink-0">
                        <img src={group.avatar} alt={group.name} className="w-full h-full object-cover" />
                    </div>

                    {/* Info */}
                    <div className="flex-1 pb-2">
                        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
                            {group.name}
                            {userRole === 'OWNER' && <span title="Owner"><Shield size={20} className="text-amber-500" /></span>}
                        </h1>
                        <p className="text-gray-500 dark:text-zinc-400 text-sm font-mono mb-4">@{group.slug}</p>
                        
                        <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 dark:text-zinc-400">
                             <div className="flex items-center gap-2">
                                <Users size={16} />
                                <span className="font-bold text-gray-900 dark:text-white">{group.members?.length || 0}</span> members
                             </div>
                             <div className="flex items-center gap-2 text-zinc-500">
                                <Calendar size={16} /> Created: {formattedDate}
                             </div>
                        </div>
                    </div>

                    {/* Action Button */}
                    <div className="flex items-center gap-3 pb-2">
                        {isMember ? (
                            <>
                                <button 
                                    onClick={() => setActiveTab('chat')}
                                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/20 flex items-center gap-2"
                                >
                                    <MessageSquare size={18} /> Open Chat
                                </button>
                                <button 
                                    onClick={handleJoinToggle}
                                    className="p-2.5 bg-zinc-800 hover:bg-red-500/20 text-zinc-400 hover:text-red-500 rounded-xl transition-colors border border-zinc-700"
                                    title="Leave Group"
                                >
                                    <LogOut size={20} />
                                </button>
                            </>
                        ) : (
                            <button 
                                onClick={handleJoinToggle}
                                className="px-8 py-3 bg-white text-black hover:bg-gray-200 font-bold rounded-xl transition-colors flex items-center gap-2"
                            >
                                <UserPlus size={18} /> Join Group
                            </button>
                        )}
                        {(userRole === 'OWNER' || userRole === 'MODERATOR') && (
                             <button 
                                onClick={() => navigate(`/g/${group.slug}/settings`)}
                                className="p-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white rounded-xl transition-colors border border-zinc-700"
                             >
                                <Settings size={20} />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="border-b border-gray-200 dark:border-zinc-800 mb-8 sticky top-0 bg-gray-50/90 dark:bg-[#09090b]/90 backdrop-blur-md z-20 px-6">
                <div className="max-w-7xl mx-auto flex gap-8">
                    {[
                        { id: 'home', label: 'Home' },
                        { id: 'chat', label: 'Chat' },
                        { id: 'members', label: 'Members' }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as TabType)}
                            className={`py-4 text-sm font-bold uppercase tracking-wider border-b-2 transition-all ${
                                activeTab === tab.id 
                                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' 
                                : 'border-transparent text-gray-500 dark:text-zinc-500 hover:text-gray-900 dark:hover:text-zinc-300'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab Content */}
            <div className="max-w-7xl mx-auto px-6 pb-20">
                
                {activeTab === 'home' && (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-8">
                            
                            {/* Announcements Section */}
                            <section>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                        <Bell size={20} className="text-indigo-500" /> Announcements
                                    </h3>
                                    {(userRole === 'OWNER' || userRole === 'MODERATOR') && (
                                        <button 
                                            onClick={() => navigate(`/g/${group.slug}/settings`)}
                                            className="text-xs text-indigo-400 hover:underline"
                                        >
                                            Manage
                                        </button>
                                    )}
                                </div>

                                <div className="space-y-4">
                                    {pinnedAnnouncements.map(ann => (
                                        <div key={ann.id} className="bg-indigo-500/5 border border-indigo-500/20 rounded-xl p-6 relative">
                                            <div className="absolute top-4 right-4 text-indigo-500">
                                                <Pin size={16} fill="currentColor" />
                                            </div>
                                            <h4 className="font-bold text-indigo-400 text-lg mb-2">{ann.title}</h4>
                                            <p className="text-zinc-300 text-sm whitespace-pre-wrap">{ann.content}</p>
                                            <p className="text-xs text-zinc-500 mt-4">{new Date(ann.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    ))}

                                    {otherAnnouncements.map(ann => (
                                        <div key={ann.id} className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-6">
                                            <h4 className="font-bold text-gray-900 dark:text-white text-lg mb-2">{ann.title}</h4>
                                            <p className="text-gray-600 dark:text-zinc-300 text-sm whitespace-pre-wrap">{ann.content}</p>
                                            <p className="text-xs text-zinc-500 mt-4">{new Date(ann.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    ))}

                                    {announcements.length === 0 && (
                                        <div className="text-center py-12 border border-dashed border-zinc-800 rounded-xl">
                                            <p className="text-zinc-500">No announcements yet.</p>
                                        </div>
                                    )}
                                </div>
                            </section>

                            <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-8">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">About {group.name}</h3>
                                <p className="text-gray-600 dark:text-zinc-300 leading-relaxed whitespace-pre-line mb-6">
                                    {group.description}
                                </p>
                                
                                <h4 className="font-bold text-gray-900 dark:text-white mb-3">Group Tags</h4>
                                <div className="flex gap-2 mb-8">
                                    {group.tags?.map(tag => (
                                        <span key={tag} className="px-3 py-1 bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400 rounded-lg text-sm font-medium">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>

                                {group.rules && (
                                    <>
                                        <h4 className="font-bold text-gray-900 dark:text-white mb-3">Community Rules</h4>
                                        <div className="text-gray-600 dark:text-zinc-400 text-sm whitespace-pre-wrap p-4 bg-zinc-950 rounded-xl border border-zinc-800">
                                            {group.rules}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Sidebar Info */}
                        <div className="space-y-6">
                            <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6">
                                <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                                    <Shield size={16} className="text-indigo-500" /> Admins & Moderators
                                </h3>
                                <div className="space-y-3">
                                    {admins.map(admin => {
                                         const user = CommunityStore.getUser(admin.userId);
                                         return (
                                             <div key={admin.userId} className="flex items-center gap-3">
                                                 <img src={user?.avatar} className="w-8 h-8 rounded-full" />
                                                 <div>
                                                     <p className="text-sm font-bold text-white">{user?.username}</p>
                                                     <p className="text-xs text-zinc-500">{admin.role}</p>
                                                 </div>
                                             </div>
                                         )
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'chat' && (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 h-full">
                        {isMember ? (
                            <ChatInterface group={group} currentUserRole={userRole} />
                        ) : (
                            <div className="text-center py-20 bg-zinc-900/50 rounded-2xl border border-zinc-800 border-dashed">
                                <MessageSquare size={48} className="mx-auto text-zinc-600 mb-4" />
                                <h3 className="text-xl font-bold text-white mb-2">Join to Chat</h3>
                                <p className="text-zinc-500 mb-6">You must be a member of this group to view and send messages.</p>
                                <button 
                                    onClick={handleJoinToggle}
                                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl"
                                >
                                    Join Group
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'members' && (
                     <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {group.members?.map(member => {
                                const user = CommunityStore.getUser(member.userId);
                                return (
                                    <div key={member.userId} className="flex items-center gap-4 p-4 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl relative">
                                        <div className="relative">
                                            <img src={user?.avatar} alt={user?.username} className="w-12 h-12 rounded-full bg-zinc-800 object-cover" />
                                            {member.role === 'OWNER' && <div className="absolute -bottom-1 -right-1 bg-amber-500 p-0.5 rounded-full border-2 border-zinc-900"><Shield size={10} className="text-white" fill="currentColor"/></div>}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900 dark:text-white">{user?.username}</p>
                                            <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                                                member.role === 'OWNER' ? 'bg-amber-500/10 text-amber-500' : 
                                                member.role === 'MODERATOR' ? 'bg-emerald-500/10 text-emerald-500' : 
                                                'bg-zinc-800 text-zinc-500'
                                            }`}>
                                                {member.role}
                                            </span>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                     </div>
                )}

            </div>
        </div>
    );
};

export default GroupProfilePage;