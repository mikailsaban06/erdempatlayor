import { BuildPost, Comment, SavedBuild, PartCategory, ReactionType } from '../types';
import { CURRENT_USER } from './communityStore';
import { sanitizeText } from './moderation';
import { MOCK_PARTS } from '../constants';

// Helper to recreate parts from summary for mocks
const getMockPart = (name: string, cat: PartCategory) => {
    return MOCK_PARTS.find(p => p.name.includes(name) || name.includes(p.name)) || null;
};

// --- MOCK DATA ---
const MOCK_POSTS: BuildPost[] = [
    {
        id: 'bp_1',
        originalBuildId: 'ob_1',
        title: 'White Aesthetic Dream',
        description: 'Finally finished my all-white build. The airflow in this case is amazing! Check out the cable management.',
        authorId: 'user_da',
        authorName: 'Abdullah H.',
        authorAvatar: 'https://ui-avatars.com/api/?name=Abdullah+H&background=c0392b&color=fff',
        thumbnail: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=600&auto=format&fit=crop',
        images: [],
        parts: {
            [PartCategory.CPU]: getMockPart('14900K', PartCategory.CPU),
            [PartCategory.GPU]: getMockPart('4080', PartCategory.GPU),
            [PartCategory.CASE]: getMockPart('H9', PartCategory.CASE),
            [PartCategory.RAM]: getMockPart('Trident', PartCategory.RAM),
            [PartCategory.MOTHERBOARD]: getMockPart('Z790', PartCategory.MOTHERBOARD),
            [PartCategory.PSU]: getMockPart('1000', PartCategory.PSU)
        },
        partsSummary: {
            cpu: 'Intel Core i9-14900K',
            gpu: 'NVIDIA RTX 4080 Super',
            case: 'NZXT H9 Flow',
            ram: '32GB DDR5'
        },
        totalPrice: 2450.99,
        totalWattage: 750,
        isCompatible: true,
        tags: ['Gaming', 'White', 'RGB', 'High-End'],
        visibility: 'public',
        views: 1205,
        favorites: 45,
        commentsCount: 2,
        reactions: {
            'user_current': 'like',
            'user_pcmr': 'fire'
        },
        favoritedBy: [],
        createdAt: Date.now() - 86400000 * 2, // 2 days ago
        updatedAt: Date.now() - 86400000 * 2,
        isVerified: true,
        isFeatured: true
    },
    {
        id: 'bp_2',
        originalBuildId: 'ob_2',
        title: 'Budget 1080p Beast',
        description: 'Best bang for buck performance you can get right now. Runs Cyberpunk at 60fps Ultra without RT.',
        authorId: 'user_pcmr',
        authorName: 'GabeN',
        authorAvatar: 'https://ui-avatars.com/api/?name=Gabe+N&background=2c3e50&color=fff',
        thumbnail: undefined,
        images: [],
        parts: {
            [PartCategory.CPU]: getMockPart('5600X', PartCategory.CPU),
            [PartCategory.GPU]: getMockPart('7600', PartCategory.GPU),
            [PartCategory.CASE]: getMockPart('4000D', PartCategory.CASE),
            [PartCategory.RAM]: getMockPart('LPX', PartCategory.RAM),
            [PartCategory.MOTHERBOARD]: getMockPart('B550', PartCategory.MOTHERBOARD),
            [PartCategory.PSU]: getMockPart('650', PartCategory.PSU)
        },
        partsSummary: {
            cpu: 'AMD Ryzen 5 5600X',
            gpu: 'AMD Radeon RX 7600',
            case: 'Corsair 4000D',
            ram: '16GB DDR4'
        },
        totalPrice: 850.00,
        totalWattage: 450,
        isCompatible: true,
        tags: ['Budget', '1080p', 'Value'],
        visibility: 'public',
        views: 890,
        favorites: 210,
        commentsCount: 0,
        reactions: {
            'user_current': 'mindblown'
        },
        favoritedBy: ['user_current'],
        createdAt: Date.now() - 3600000 * 5, // 5 hours ago
        updatedAt: Date.now() - 3600000 * 5,
        isVerified: true
    }
];

const MOCK_COMMENTS: Comment[] = [
    {
        id: 'c_1',
        postId: 'bp_1',
        parentId: null,
        userId: 'user_pcmr',
        username: 'GabeN',
        avatar: 'https://ui-avatars.com/api/?name=Gabe+N&background=2c3e50&color=fff',
        content: 'Clean cable management! What cables did you use?',
        createdAt: Date.now() - 86400000,
        isDeleted: false,
        likes: ['user_da']
    },
    {
        id: 'c_2',
        postId: 'bp_1',
        parentId: null,
        userId: 'user_current',
        username: 'DemoUser',
        avatar: CURRENT_USER.avatar,
        content: 'Looks incredible. I might steal this config.',
        createdAt: Date.now() - 43200000,
        isDeleted: false,
        likes: []
    }
];

// --- STORAGE HELPERS ---
const safeGet = <T>(key: string, fallback: T): T => {
    try {
        const stored = localStorage.getItem(key);
        return stored ? JSON.parse(stored) : fallback;
    } catch { return fallback; }
};

const safeSet = (key: string, value: any) => {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { console.error(e); }
};

// --- STORE ---
export const SharedBuildsStore = {
    // --- POSTS ---
    getPosts: (): BuildPost[] => {
        // Migration logic: if old data format exists, we might need to map it. 
        // For simplicity, we assume we start fresh or compatible.
        return safeGet<BuildPost[]>('rb_posts', MOCK_POSTS);
    },

    savePosts: (posts: BuildPost[]) => {
        safeSet('rb_posts', posts);
    },

    createPost: (savedBuild: SavedBuild, title: string, description: string, tags: string[], visibility: 'public' | 'unlisted'): BuildPost => {
        const posts = SharedBuildsStore.getPosts();
        
        // Calculate totals
        const parts = Object.values(savedBuild.parts).filter(p => p !== null);
        const totalPrice = parts.reduce((acc, p) => acc + (p?.price || 0), 0);
        const totalWattage = parts.reduce((acc, p) => acc + (p?.wattage || 0), 0);
        
        // Simplified Verification Logic (Initial)
        const isCompatible = true; // Can be updated by "Check Build" later

        const newPost: BuildPost = {
            id: `bp_${crypto.randomUUID()}`,
            originalBuildId: savedBuild.id,
            title: sanitizeText(title),
            description: sanitizeText(description),
            authorId: CURRENT_USER.id,
            authorName: CURRENT_USER.username,
            authorAvatar: CURRENT_USER.avatar,
            thumbnail: savedBuild.thumbnail,
            images: [],
            parts: savedBuild.parts, // STORE FULL PARTS
            partsSummary: {
                cpu: savedBuild.parts[PartCategory.CPU]?.name || 'Unknown CPU',
                gpu: savedBuild.parts[PartCategory.GPU]?.name || 'Unknown GPU',
                case: savedBuild.parts[PartCategory.CASE]?.name || 'Unknown Case',
                ram: savedBuild.parts[PartCategory.RAM]?.name || 'Unknown RAM',
            },
            totalPrice,
            totalWattage,
            isCompatible,
            tags,
            visibility,
            views: 0,
            favorites: 0,
            commentsCount: 0,
            reactions: {},
            favoritedBy: [],
            createdAt: Date.now(),
            updatedAt: Date.now(),
            isVerified: false,
            isFeatured: false
        };

        const updated = [newPost, ...posts];
        SharedBuildsStore.savePosts(updated);
        return newPost;
    },

    getPostById: (id: string): BuildPost | undefined => {
        const posts = SharedBuildsStore.getPosts();
        return posts.find(p => p.id === id);
    },

    updatePostVerification: (postId: string, verified: boolean, warnings: string[]) => {
        const posts = SharedBuildsStore.getPosts();
        const post = posts.find(p => p.id === postId);
        if (post) {
            post.isVerified = verified;
            post.verificationWarnings = warnings;
            post.checkedAt = Date.now();
            post.isCompatible = verified; // Sync compatible flag
            SharedBuildsStore.savePosts(posts);
            return post;
        }
        return null;
    },

    incrementViews: (postId: string) => {
        const posts = SharedBuildsStore.getPosts();
        const post = posts.find(p => p.id === postId);
        if (post) {
            post.views++;
            SharedBuildsStore.savePosts(posts);
        }
    },

    // --- INTERACTIONS ---

    setReaction: (postId: string, type: ReactionType | null) => {
        const posts = SharedBuildsStore.getPosts();
        const post = posts.find(p => p.id === postId);
        if (post) {
            if (type === null) {
                delete post.reactions[CURRENT_USER.id];
            } else {
                post.reactions[CURRENT_USER.id] = type;
            }
            SharedBuildsStore.savePosts(posts);
            return post;
        }
    },

    toggleFavorite: (postId: string) => {
        const posts = SharedBuildsStore.getPosts();
        const post = posts.find(p => p.id === postId);
        if (post) {
            if (post.favoritedBy.includes(CURRENT_USER.id)) {
                post.favoritedBy = post.favoritedBy.filter(id => id !== CURRENT_USER.id);
                post.favorites--;
            } else {
                post.favoritedBy.push(CURRENT_USER.id);
                post.favorites++;
            }
            SharedBuildsStore.savePosts(posts);
            return post;
        }
    },

    // --- COMMENTS ---

    getComments: (postId: string): Comment[] => {
        const allComments = safeGet<Comment[]>('rb_comments', MOCK_COMMENTS);
        return allComments.filter(c => c.postId === postId && !c.isDeleted).sort((a, b) => b.createdAt - a.createdAt);
    },

    addComment: (postId: string, content: string, parentId: string | null = null): Comment => {
        const allComments = safeGet<Comment[]>('rb_comments', MOCK_COMMENTS);
        const newComment: Comment = {
            id: `c_${crypto.randomUUID()}`,
            postId,
            parentId,
            userId: CURRENT_USER.id,
            username: CURRENT_USER.username,
            avatar: CURRENT_USER.avatar,
            content: sanitizeText(content),
            createdAt: Date.now(),
            isDeleted: false,
            likes: []
        };
        
        safeSet('rb_comments', [newComment, ...allComments]);

        // Update comment count on post
        const posts = SharedBuildsStore.getPosts();
        const post = posts.find(p => p.id === postId);
        if (post) {
            post.commentsCount++;
            SharedBuildsStore.savePosts(posts);
        }

        return newComment;
    },

    toggleCommentLike: (commentId: string) => {
        const allComments = safeGet<Comment[]>('rb_comments', MOCK_COMMENTS);
        const comment = allComments.find(c => c.id === commentId);
        if (comment) {
            if (comment.likes.includes(CURRENT_USER.id)) {
                comment.likes = comment.likes.filter(id => id !== CURRENT_USER.id);
            } else {
                comment.likes.push(CURRENT_USER.id);
            }
            safeSet('rb_comments', allComments);
        }
    },

    deleteComment: (commentId: string) => {
        const allComments = safeGet<Comment[]>('rb_comments', MOCK_COMMENTS);
        const comment = allComments.find(c => c.id === commentId);
        if (comment) {
            comment.isDeleted = true;
            comment.content = "[Comment Removed]";
            safeSet('rb_comments', allComments);
            
            // Decrement count
            const posts = SharedBuildsStore.getPosts();
            const post = posts.find(p => p.id === comment.postId);
            if (post) {
                post.commentsCount = Math.max(0, post.commentsCount - 1);
                SharedBuildsStore.savePosts(posts);
            }
        }
    },

    // --- SORTING ALGORITHMS ---
    
    getSortedPosts: (
        posts: BuildPost[], 
        sortBy: 'top' | 'trending' | 'newest' | 'favorites'
    ): BuildPost[] => {
        return [...posts].sort((a, b) => {
            if (sortBy === 'newest') return b.createdAt - a.createdAt;
            
            if (sortBy === 'favorites') return b.favorites - a.favorites;

            if (sortBy === 'top') {
                const scoreA = Object.keys(a.reactions).length + (a.favorites * 2) + (a.commentsCount * 1.5);
                const scoreB = Object.keys(b.reactions).length + (b.favorites * 2) + (b.commentsCount * 1.5);
                return scoreB - scoreA;
            }

            if (sortBy === 'trending') {
                const hoursA = (Date.now() - a.createdAt) / 3600000;
                const hoursB = (Date.now() - b.createdAt) / 3600000;
                
                const scoreA = (Object.keys(a.reactions).length + a.favorites + a.commentsCount) / Math.pow(hoursA + 2, 1.5);
                const scoreB = (Object.keys(b.reactions).length + b.favorites + b.commentsCount) / Math.pow(hoursB + 2, 1.5);
                
                return scoreB - scoreA;
            }
            
            return 0;
        });
    }
};