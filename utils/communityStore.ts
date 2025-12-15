import { Group, GroupRole, ChatMessage, User, GroupMember, Announcement } from '../types';

// --- MOCK CURRENT USER ---
export const CURRENT_USER: User = {
    id: 'user_current',
    username: 'DemoUser',
    avatar: 'https://ui-avatars.com/api/?name=Demo+User&background=6366f1&color=fff',
    isOnline: true
};

// --- PERMISSIONS CONFIG ---
export const PERMISSIONS: Record<string, string[]> = {
    OWNER: ['edit_profile', 'manage_roles', 'mute_member', 'ban_member', 'kick_member', 'post_announcement', 'delete_msg', 'upload_image'],
    MODERATOR: ['mute_member', 'ban_member', 'kick_member', 'post_announcement', 'delete_msg', 'upload_image'],
    HELPER: ['mute_member', 'delete_msg', 'upload_image'], 
    MEMBER: ['chat']
};

export const hasPermission = (role: GroupRole | string, permission: string): boolean => {
    const perms = PERMISSIONS[role] || [];
    return perms.includes(permission) || role === 'OWNER';
};

// --- PROFANITY FILTER ---
const BANNED_WORDS = [
    'badword', 'stupid', 'idiot', 'scam', 'spam', 'fake', 
    'aptal', 'salak', 'dolandırıcı', 'fuck', 'shit', 'bitch', 'asshole'
];

const sanitizeText = (text: string): string => {
    let sanitized = text;
    BANNED_WORDS.forEach(word => {
        const regex = new RegExp(`\\b${word}\\b`, 'gi');
        sanitized = sanitized.replace(regex, '*'.repeat(word.length));
    });
    return sanitized;
};

// --- INITIAL SEED DATA ---
const INITIAL_GROUPS: Group[] = [
    {
        id: 'g1',
        name: 'Donanım Arşivi',
        slug: 'donanim-arsivi',
        description: 'Turkey\'s largest hardware community. Discuss new GPU releases, build guides, and tech deals.',
        avatar: 'https://yt3.googleusercontent.com/ytc/AIdro_n4tO32D4vE4_N_5Nq6u8Gk8g0a0_Fk8p6_0_8=s176-c-k-c0x00ffffff-no-rj',
        banner: 'https://images.unsplash.com/photo-1591405351990-4726e331f141?q=80&w=2070&auto=format&fit=crop',
        ownerId: 'user_da',
        createdAt: Date.now() - 100000000,
        members: [
            { userId: 'user_da', role: 'OWNER', joinedAt: Date.now() },
            { userId: 'user_current', role: 'MEMBER', joinedAt: Date.now() },
            { userId: 'user_pcmr', role: 'MODERATOR', joinedAt: Date.now() }
        ],
        tags: ['Hardware', 'News', 'Turkey'],
        popularityScore: 95,
        rules: "1. Be respectful.\n2. No spam.\n3. Keep it hardware related.",
        announcements: [
            { id: 'a1', groupId: 'g1', authorId: 'user_da', title: 'Welcome to the Community!', content: 'We are happy to have you here. Please read the rules.', createdAt: Date.now() - 1000000, isPinned: true }
        ]
    },
    {
        id: 'g2',
        name: 'PC Master Race',
        slug: 'pcmr',
        description: 'May your framerates be high and your temperatures low. The official unofficial group.',
        avatar: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=200&h=200',
        banner: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?q=80&w=2070&auto=format&fit=crop',
        ownerId: 'user_pcmr',
        createdAt: Date.now() - 50000000,
        members: [
            { userId: 'user_pcmr', role: 'OWNER', joinedAt: Date.now() }
        ],
        tags: ['Gaming', 'Builds', 'Memes'],
        popularityScore: 88,
        announcements: []
    }
];

// --- HELPER FOR SAFE STORAGE ---
const safeSetItem = (key: string, value: string) => {
    try {
        localStorage.setItem(key, value);
    } catch (e: any) {
        if (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
            console.warn("LocalStorage Quota Exceeded. Attempting to cleanup old chats...");
            // Simple cleanup strategy: Remove oldest chat keys or just fail gracefully
            alert("Storage full! Some data could not be saved. Please clear cache or delete old messages.");
        } else {
            console.error("Storage Error", e);
        }
    }
};

// --- STORE LOGIC ---

export const CommunityStore = {
    getGroups: (): Group[] => {
        try {
            const stored = localStorage.getItem('rb_groups');
            if (!stored) {
                safeSetItem('rb_groups', JSON.stringify(INITIAL_GROUPS));
                return INITIAL_GROUPS;
            }
            const parsed = JSON.parse(stored);
            if (!Array.isArray(parsed)) {
                return INITIAL_GROUPS;
            }

            // SAFETY PATCH: Fix old data that might be missing new fields
            return parsed.map((g: any) => ({
                ...g,
                announcements: Array.isArray(g.announcements) ? g.announcements : [],
                members: Array.isArray(g.members) ? g.members : [],
                tags: Array.isArray(g.tags) ? g.tags : [],
                createdAt: g.createdAt || Date.now(),
                rules: g.rules || '',
                popularityScore: typeof g.popularityScore === 'number' ? g.popularityScore : 0
            }));
        } catch (e) {
            console.error("Failed to load groups, resetting", e);
            return INITIAL_GROUPS;
        }
    },

    saveGroups: (groups: Group[]) => {
        safeSetItem('rb_groups', JSON.stringify(groups));
    },

    getPopularGroups: (): Group[] => {
        const groups = CommunityStore.getGroups();
        return groups.sort((a, b) => (b.popularityScore || 0) - (a.popularityScore || 0));
    },

    getMyGroups: (): Group[] => {
        const groups = CommunityStore.getGroups();
        return groups.filter(g => g.members.some(m => m.userId === CURRENT_USER.id));
    },

    getGroup: (slug: string): Group | undefined => {
        const groups = CommunityStore.getGroups();
        return groups.find(g => g.slug === slug);
    },

    createGroup: (name: string, description: string, tags: string[], avatar?: string, banner?: string): Group => {
        const groups = CommunityStore.getGroups();
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        
        const newGroup: Group = {
            id: crypto.randomUUID(),
            name,
            slug: `${slug}-${Date.now().toString().slice(-4)}`,
            description,
            avatar: avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
            banner: banner || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=2070',
            ownerId: CURRENT_USER.id,
            members: [{ userId: CURRENT_USER.id, role: 'OWNER', joinedAt: Date.now() }],
            createdAt: Date.now(),
            tags: tags.length > 0 ? tags : ['Community'],
            popularityScore: 10,
            announcements: []
        };

        groups.push(newGroup);
        CommunityStore.saveGroups(groups);
        return newGroup;
    },

    updateGroup: (groupId: string, updates: Partial<Group>) => {
        const groups = CommunityStore.getGroups();
        const index = groups.findIndex(g => g.id === groupId);
        if (index !== -1) {
            groups[index] = { ...groups[index], ...updates };
            CommunityStore.saveGroups(groups);
        }
    },

    joinGroup: (groupId: string) => {
        const groups = CommunityStore.getGroups();
        const group = groups.find(g => g.id === groupId);
        if (group && !group.members.find(m => m.userId === CURRENT_USER.id)) {
            group.members.push({ userId: CURRENT_USER.id, role: 'MEMBER', joinedAt: Date.now() });
            group.popularityScore = (group.popularityScore || 0) + 5; 
            CommunityStore.saveGroups(groups);
            CommunityStore.sendSystemMessage(groupId, `${CURRENT_USER.username} joined the group.`);
        }
    },

    leaveGroup: (groupId: string): boolean => {
        const groups = CommunityStore.getGroups();
        const group = groups.find(g => g.id === groupId);
        if (group) {
            const member = group.members.find(m => m.userId === CURRENT_USER.id);
            if (member?.role === 'OWNER') {
                return false; // Cannot leave as owner
            }
            group.members = group.members.filter(m => m.userId !== CURRENT_USER.id);
            CommunityStore.saveGroups(groups);
            return true;
        }
        return false;
    },

    // --- MODERATION & ROLES ---

    updateMemberRole: (groupId: string, userId: string, newRole: GroupRole) => {
        const groups = CommunityStore.getGroups();
        const group = groups.find(g => g.id === groupId);
        if (group) {
            const member = group.members.find(m => m.userId === userId);
            if (member) {
                member.role = newRole;
                CommunityStore.saveGroups(groups);
            }
        }
    },

    muteMember: (groupId: string, userId: string, durationMinutes: number) => {
        const groups = CommunityStore.getGroups();
        const group = groups.find(g => g.id === groupId);
        if (group) {
            const member = group.members.find(m => m.userId === userId);
            if (member) {
                member.mutedUntil = Date.now() + (durationMinutes * 60 * 1000);
                CommunityStore.saveGroups(groups);
            }
        }
    },

    unmuteMember: (groupId: string, userId: string) => {
        const groups = CommunityStore.getGroups();
        const group = groups.find(g => g.id === groupId);
        if (group) {
            const member = group.members.find(m => m.userId === userId);
            if (member) {
                member.mutedUntil = undefined;
                CommunityStore.saveGroups(groups);
            }
        }
    },

    kickMember: (groupId: string, userId: string) => {
        const groups = CommunityStore.getGroups();
        const group = groups.find(g => g.id === groupId);
        if (group) {
            group.members = group.members.filter(m => m.userId !== userId);
            CommunityStore.saveGroups(groups);
        }
    },

    banMember: (groupId: string, userId: string) => {
        CommunityStore.kickMember(groupId, userId);
    },

    // --- ANNOUNCEMENTS ---

    addAnnouncement: (groupId: string, title: string, content: string) => {
        const groups = CommunityStore.getGroups();
        const group = groups.find(g => g.id === groupId);
        if (group) {
            if (!group.announcements) group.announcements = [];
            group.announcements.unshift({
                id: crypto.randomUUID(),
                groupId,
                authorId: CURRENT_USER.id,
                title,
                content,
                createdAt: Date.now(),
                isPinned: false
            });
            CommunityStore.saveGroups(groups);
        }
    },

    deleteAnnouncement: (groupId: string, announcementId: string) => {
        const groups = CommunityStore.getGroups();
        const group = groups.find(g => g.id === groupId);
        if (group && group.announcements) {
            group.announcements = group.announcements.filter(a => a.id !== announcementId);
            CommunityStore.saveGroups(groups);
        }
    },

    togglePinAnnouncement: (groupId: string, announcementId: string) => {
        const groups = CommunityStore.getGroups();
        const group = groups.find(g => g.id === groupId);
        if (group && group.announcements) {
            const ann = group.announcements.find(a => a.id === announcementId);
            if (ann) {
                ann.isPinned = !ann.isPinned;
                CommunityStore.saveGroups(groups);
            }
        }
    },

    // --- CHAT LOGIC ---

    getMessages: (groupId: string): ChatMessage[] => {
        try {
            const key = `rb_chat_${groupId}`;
            const stored = localStorage.getItem(key);
            const parsed = stored ? JSON.parse(stored) : [];
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    },

    sendMessage: (groupId: string, content: string, type: 'text' | 'image' = 'text', imageUrl?: string): ChatMessage | null => {
        const groups = CommunityStore.getGroups();
        const group = groups.find(g => g.id === groupId);
        const member = group?.members.find(m => m.userId === CURRENT_USER.id);
        
        if (member && member.mutedUntil && member.mutedUntil > Date.now()) {
            return null; // Muted
        }

        const messages = CommunityStore.getMessages(groupId);
        const finalContent = type === 'text' ? sanitizeText(content) : content;

        const newMsg: ChatMessage = {
            id: crypto.randomUUID(),
            groupId,
            userId: CURRENT_USER.id,
            content: finalContent,
            timestamp: Date.now(),
            type,
            imageUrl
        };
        messages.push(newMsg);
        
        // Truncate history to prevent unlimited storage growth
        if (messages.length > 100) messages.shift();
        
        safeSetItem(`rb_chat_${groupId}`, JSON.stringify(messages));
        return newMsg;
    },

    sendSystemMessage: (groupId: string, content: string) => {
        const messages = CommunityStore.getMessages(groupId);
        const newMsg: ChatMessage = {
            id: crypto.randomUUID(),
            groupId,
            userId: 'system',
            content,
            timestamp: Date.now(),
            type: 'system'
        };
        messages.push(newMsg);
        if (messages.length > 100) messages.shift();
        
        safeSetItem(`rb_chat_${groupId}`, JSON.stringify(messages));
    },

    deleteMessage: (groupId: string, messageId: string) => {
        const messages = CommunityStore.getMessages(groupId);
        const filtered = messages.filter(m => m.id !== messageId);
        safeSetItem(`rb_chat_${groupId}`, JSON.stringify(filtered));
    },

    // --- USER HELPERS ---
    getUser: (userId: string): User | undefined => {
        if (userId === CURRENT_USER.id) return CURRENT_USER;
        if (userId === 'user_da') return { id: 'user_da', username: 'Abdullah H.', avatar: 'https://ui-avatars.com/api/?name=Abdullah+H&background=c0392b&color=fff', isOnline: false };
        if (userId === 'user_pcmr') return { id: 'user_pcmr', username: 'GabeN', avatar: 'https://ui-avatars.com/api/?name=Gabe+N&background=2c3e50&color=fff', isOnline: true };
        if (userId === 'user_water') return { id: 'user_water', username: 'LiquidSnake', avatar: 'https://ui-avatars.com/api/?name=Liquid+S&background=2980b9&color=fff', isOnline: true };
        if (userId === 'system') return { id: 'system', username: 'System', avatar: '', isOnline: true };
        
        return { id: userId, username: 'Unknown User', avatar: `https://ui-avatars.com/api/?name=${userId}`, isOnline: false };
    }
};