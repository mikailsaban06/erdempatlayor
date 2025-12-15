import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Users, Shield, Trash2, Ban, VolumeX, Plus, Pin, X, Megaphone } from 'lucide-react';
import { CommunityStore, CURRENT_USER, hasPermission } from '../utils/communityStore';
import { Group, GroupRole, Announcement } from '../types';

const GroupSettingsPage = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [group, setGroup] = useState<Group | undefined>(undefined);
    
    // Profile Fields
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [rules, setRules] = useState('');
    
    // Announcement Fields
    const [announcementTitle, setAnnouncementTitle] = useState('');
    const [announcementContent, setAnnouncementContent] = useState('');
    const [showAnnounceForm, setShowAnnounceForm] = useState(false);

    useEffect(() => {
        if (!slug) return;
        const found = CommunityStore.getGroup(slug);
        if (found) {
            const member = found.members.find(m => m.userId === CURRENT_USER.id);
            if (!member || !hasPermission(member.role, 'edit_profile')) {
                // If strictly checking edit_profile for entering page, use that. 
                // But since this page has multiple tabs (mod, announce), we might allow Mods too.
                // Assuming PERMISSIONS allow mods to manage roles/announcements.
                if (member?.role !== 'OWNER' && member?.role !== 'MODERATOR') {
                    navigate(`/g/${slug}`);
                    return;
                }
            }
            setGroup(found);
            setName(found.name);
            setDescription(found.description);
            setRules(found.rules || '');
        } else {
            navigate('/community');
        }
    }, [slug, navigate]);

    const handleSaveProfile = () => {
        if (group) {
            CommunityStore.updateGroup(group.id, { name, description, rules });
            alert("Profile updated!");
            navigate(`/g/${group.slug}`); // Or stay
        }
    };

    const handleRoleChange = (userId: string, newRole: GroupRole) => {
        if (group) {
            // Only Owner can change to Moderator/Helper generally
            // Simplified check: Owner can do all. Mod can set Helper.
            const currentUserRole = group.members.find(m => m.userId === CURRENT_USER.id)?.role;
            if (currentUserRole === 'OWNER') {
                CommunityStore.updateMemberRole(group.id, userId, newRole);
            } else if (currentUserRole === 'MODERATOR' && newRole === 'HELPER') {
                CommunityStore.updateMemberRole(group.id, userId, newRole);
            } else {
                alert("You don't have permission to assign this role.");
                return;
            }
            setGroup(CommunityStore.getGroup(group.slug));
        }
    };

    const handleMute = (userId: string, minutes: number) => {
        if (group) {
            CommunityStore.muteMember(group.id, userId, minutes);
            setGroup(CommunityStore.getGroup(group.slug));
        }
    };

    const handleUnmute = (userId: string) => {
        if (group) {
            CommunityStore.unmuteMember(group.id, userId);
            setGroup(CommunityStore.getGroup(group.slug));
        }
    };

    const handleKick = (userId: string) => {
        if (group && confirm("Are you sure you want to kick this user?")) {
            CommunityStore.kickMember(group.id, userId);
            setGroup(CommunityStore.getGroup(group.slug));
        }
    };

    const handleCreateAnnouncement = (e: React.FormEvent) => {
        e.preventDefault();
        if (group && announcementTitle && announcementContent) {
            CommunityStore.addAnnouncement(group.id, announcementTitle, announcementContent);
            setGroup(CommunityStore.getGroup(group.slug));
            setAnnouncementTitle('');
            setAnnouncementContent('');
            setShowAnnounceForm(false);
        }
    };

    const handleDeleteAnnouncement = (id: string) => {
        if (group && confirm("Delete this announcement?")) {
            CommunityStore.deleteAnnouncement(group.id, id);
            setGroup(CommunityStore.getGroup(group.slug));
        }
    };

    const handlePinAnnouncement = (id: string) => {
        if (group) {
            CommunityStore.togglePinAnnouncement(group.id, id);
            setGroup(CommunityStore.getGroup(group.slug));
        }
    };

    if (!group) return null;

    const myRole = group.members.find(m => m.userId === CURRENT_USER.id)?.role || 'MEMBER';
    const canManageRoles = hasPermission(myRole, 'manage_roles');
    const canMute = hasPermission(myRole, 'mute_member');
    const canAnnounce = hasPermission(myRole, 'post_announcement');

    return (
        <div className="flex-1 h-full overflow-y-auto bg-gray-50 dark:bg-[#09090b] custom-scrollbar">
            <div className="max-w-5xl mx-auto px-6 py-12">
                
                <div className="flex items-center justify-between mb-8">
                    <button 
                        onClick={() => navigate(`/g/${group.slug}`)}
                        className="flex items-center gap-2 text-zinc-500 hover:text-zinc-300 transition-colors"
                    >
                        <ArrowLeft size={20} /> Back to Group
                    </button>
                    <h1 className="text-2xl font-bold text-white">Group Settings</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* LEFT COLUMN: Profile Settings */}
                    <div className="lg:col-span-2 space-y-8">
                        
                        {/* Profile Edit */}
                        <section className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-8">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">General Profile</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-zinc-500 mb-1">Group Name</label>
                                    <input 
                                        type="text" 
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full bg-gray-50 dark:bg-zinc-950 border border-gray-300 dark:border-zinc-800 rounded-lg px-4 py-2 text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-zinc-500 mb-1">Description</label>
                                    <textarea 
                                        rows={3}
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="w-full bg-gray-50 dark:bg-zinc-950 border border-gray-300 dark:border-zinc-800 rounded-lg px-4 py-2 text-white resize-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-zinc-500 mb-1">Community Rules</label>
                                    <textarea 
                                        rows={5}
                                        value={rules}
                                        onChange={(e) => setRules(e.target.value)}
                                        className="w-full bg-gray-50 dark:bg-zinc-950 border border-gray-300 dark:border-zinc-800 rounded-lg px-4 py-2 text-white resize-none font-mono text-sm"
                                        placeholder="1. Be nice..."
                                    />
                                </div>
                                <button 
                                    onClick={handleSaveProfile}
                                    className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 shadow-lg shadow-emerald-500/20 mt-4"
                                >
                                    <Save size={18} /> Save Profile
                                </button>
                            </div>
                        </section>

                        {/* Announcements Management */}
                        {canAnnounce && (
                            <section className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-8">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                        <Megaphone size={20} /> Announcements
                                    </h2>
                                    <button 
                                        onClick={() => setShowAnnounceForm(!showAnnounceForm)}
                                        className="text-sm bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg flex items-center gap-1"
                                    >
                                        <Plus size={14} /> New
                                    </button>
                                </div>

                                {showAnnounceForm && (
                                    <form onSubmit={handleCreateAnnouncement} className="mb-6 bg-zinc-950 p-4 rounded-xl border border-zinc-800 animate-in fade-in">
                                        <input 
                                            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white mb-2 text-sm font-bold" 
                                            placeholder="Title"
                                            value={announcementTitle}
                                            onChange={e => setAnnouncementTitle(e.target.value)}
                                            required
                                        />
                                        <textarea 
                                            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm resize-none mb-3" 
                                            rows={3}
                                            placeholder="Content..."
                                            value={announcementContent}
                                            onChange={e => setAnnouncementContent(e.target.value)}
                                            required
                                        />
                                        <div className="flex justify-end gap-2">
                                            <button type="button" onClick={() => setShowAnnounceForm(false)} className="text-zinc-400 hover:text-white text-xs px-3">Cancel</button>
                                            <button type="submit" className="bg-indigo-600 text-white text-xs px-4 py-2 rounded-lg font-bold">Post</button>
                                        </div>
                                    </form>
                                )}

                                <div className="space-y-3">
                                    {group.announcements?.map(ann => (
                                        <div key={ann.id} className="flex justify-between items-start p-4 bg-zinc-950 border border-zinc-800 rounded-lg group">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    {ann.isPinned && <Pin size={12} className="text-indigo-500" fill="currentColor"/>}
                                                    <span className="font-bold text-white text-sm">{ann.title}</span>
                                                </div>
                                                <p className="text-xs text-zinc-500 mt-1 truncate max-w-md">{ann.content}</p>
                                            </div>
                                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => handlePinAnnouncement(ann.id)} className={`p-1.5 rounded hover:bg-zinc-800 ${ann.isPinned ? 'text-indigo-500' : 'text-zinc-500'}`} title="Pin">
                                                    <Pin size={14} />
                                                </button>
                                                <button onClick={() => handleDeleteAnnouncement(ann.id)} className="p-1.5 rounded hover:bg-zinc-800 text-red-500" title="Delete">
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    {!group.announcements?.length && <p className="text-zinc-500 text-sm">No announcements.</p>}
                                </div>
                            </section>
                        )}

                        {/* Member Management */}
                        <section className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-8">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                                <Users size={20} /> Member Management
                            </h2>
                            
                            <div className="space-y-3">
                                {group.members.map(member => {
                                    const user = CommunityStore.getUser(member.userId);
                                    if (!user) return null;
                                    const isMe = member.userId === CURRENT_USER.id;
                                    const isMuted = member.mutedUntil && member.mutedUntil > Date.now();

                                    return (
                                        <div key={member.userId} className="flex flex-col md:flex-row md:items-center justify-between p-3 bg-zinc-950 border border-zinc-800 rounded-lg gap-4">
                                            <div className="flex items-center gap-3">
                                                <img src={user.avatar} className="w-10 h-10 rounded-full" />
                                                <div>
                                                    <p className="font-bold text-white flex items-center gap-2">
                                                        {user.username}
                                                        {member.role === 'OWNER' && <Shield size={12} className="text-amber-500" fill="currentColor"/>}
                                                    </p>
                                                    <div className="flex gap-2 text-xs">
                                                        <span className="text-zinc-500">{member.role}</span>
                                                        {isMuted && <span className="text-red-500 font-bold">MUTED</span>}
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            {!isMe && (
                                                <div className="flex items-center gap-3">
                                                    {canManageRoles && (
                                                        <select 
                                                            value={member.role}
                                                            onChange={(e) => handleRoleChange(member.userId, e.target.value as GroupRole)}
                                                            className="bg-zinc-900 border border-zinc-700 text-xs rounded px-2 py-1 text-zinc-300 outline-none"
                                                            disabled={member.role === 'OWNER'} 
                                                        >
                                                            <option value="MEMBER">Member</option>
                                                            <option value="HELPER">Helper</option>
                                                            <option value="MODERATOR">Moderator</option>
                                                        </select>
                                                    )}

                                                    {canMute && (
                                                        <div className="flex items-center gap-1">
                                                            {isMuted ? (
                                                                <button onClick={() => handleUnmute(member.userId)} className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 rounded text-xs">Unmute</button>
                                                            ) : (
                                                                <select 
                                                                    onChange={(e) => {
                                                                        if(e.target.value) handleMute(member.userId, parseInt(e.target.value));
                                                                        e.target.value = "";
                                                                    }}
                                                                    className="bg-zinc-900 border border-zinc-700 text-xs rounded px-2 py-1 text-zinc-300 w-20"
                                                                >
                                                                    <option value="">Mute...</option>
                                                                    <option value="5">5m</option>
                                                                    <option value="60">1h</option>
                                                                    <option value="1440">24h</option>
                                                                </select>
                                                            )}
                                                        </div>
                                                    )}

                                                    {hasPermission(myRole, 'ban_member') && (
                                                        <button 
                                                            onClick={() => handleKick(member.userId)}
                                                            className="p-1.5 hover:bg-red-500/20 text-red-500 rounded transition-colors"
                                                            title="Kick/Ban User"
                                                        >
                                                            <Ban size={16} />
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        </section>
                    </div>

                    {/* RIGHT COLUMN: Danger Zone */}
                    <div className="space-y-8">
                         <section className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6">
                            <h3 className="text-red-500 font-bold mb-4 flex items-center gap-2">
                                <Shield size={18} /> Danger Zone
                            </h3>
                            <p className="text-xs text-red-400/70 mb-4">
                                Irreversible actions. Proceed with caution.
                            </p>
                            
                            {myRole === 'OWNER' ? (
                                <button className="w-full py-2 bg-transparent border border-red-500/30 text-red-500 hover:bg-red-500/10 rounded-lg font-bold text-sm transition-colors">
                                    Delete Group
                                </button>
                            ) : (
                                <p className="text-xs text-zinc-600">Only the Owner can delete the group.</p>
                            )}
                         </section>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default GroupSettingsPage;