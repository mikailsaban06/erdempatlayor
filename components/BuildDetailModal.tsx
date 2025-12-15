import React, { useState, useEffect } from 'react';
import { X, Heart, Star, MessageSquare, Send, ThumbsUp, Calendar, Cpu, Monitor, Box, MemoryStick } from 'lucide-react';
import { SharedBuild, BuildComment, Currency } from '../types';
import { SharedBuildsStore } from '../utils/sharedBuildsStore';
import { CURRENT_USER } from '../utils/communityStore';
import { formatPrice } from '../utils/currency';

interface BuildDetailModalProps {
    build: SharedBuild;
    currency: Currency;
    onClose: () => void;
    onUpdate: (build: SharedBuild) => void;
}

const BuildDetailModal: React.FC<BuildDetailModalProps> = ({ build, currency, onClose, onUpdate }) => {
    const [comments, setComments] = useState<BuildComment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [localBuild, setLocalBuild] = useState(build);

    // Calculate derived state for likes based on reactions
    const isLiked = localBuild.reactions[CURRENT_USER.id] === 'like';
    const likeCount = Object.values(localBuild.reactions).filter(r => r === 'like').length;
    
    const isFavorited = localBuild.favoritedBy.includes(CURRENT_USER.id);

    useEffect(() => {
        setComments(SharedBuildsStore.getComments(build.id));
    }, [build.id]);

    const handleLike = () => {
        // Toggle like reaction
        const type = isLiked ? null : 'like';
        const updated = SharedBuildsStore.setReaction(localBuild.id, type);
        if (updated) {
            setLocalBuild(updated);
            onUpdate(updated);
        }
    };

    const handleFavorite = () => {
        const updated = SharedBuildsStore.toggleFavorite(localBuild.id);
        if (updated) {
            setLocalBuild(updated);
            onUpdate(updated);
        }
    };

    const handlePostComment = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        SharedBuildsStore.addComment(localBuild.id, newComment);
        setComments(SharedBuildsStore.getComments(localBuild.id));
        setNewComment('');
        
        // Update local comment count manually or refetch build
        const updatedBuild = { ...localBuild, commentsCount: localBuild.commentsCount + 1 };
        setLocalBuild(updatedBuild);
        onUpdate(updatedBuild);
    };

    const handleLikeComment = (commentId: string) => {
        SharedBuildsStore.toggleCommentLike(commentId);
        setComments(SharedBuildsStore.getComments(localBuild.id));
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-5xl h-[90vh] bg-white dark:bg-zinc-950 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-2xl flex flex-col md:flex-row overflow-hidden">
                
                {/* Left: Build Info & Image */}
                <div className="w-full md:w-2/3 flex flex-col bg-zinc-900 overflow-y-auto custom-scrollbar">
                    <div className="relative aspect-video bg-black flex-shrink-0">
                        {localBuild.thumbnail ? (
                            <img src={localBuild.thumbnail} alt={localBuild.title} className="w-full h-full object-contain" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-zinc-700">No Image Preview</div>
                        )}
                        <button 
                            onClick={onClose}
                            className="absolute top-4 left-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 md:hidden"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className="p-8">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-2">{localBuild.title}</h2>
                                <div className="flex items-center gap-3">
                                    <img src={localBuild.authorAvatar} className="w-8 h-8 rounded-full" />
                                    <div>
                                        <p className="text-sm font-bold text-white">{localBuild.authorName}</p>
                                        <p className="text-xs text-zinc-500 flex items-center gap-1">
                                            <Calendar size={10} /> {new Date(localBuild.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-3xl font-bold text-indigo-400">{formatPrice(localBuild.totalPrice, currency)}</p>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-4 mb-8">
                            <button 
                                onClick={handleLike}
                                className={`flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${isLiked ? 'bg-red-500/10 text-red-500 border border-red-500/50' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'}`}
                            >
                                <Heart size={20} className={isLiked ? 'fill-current' : ''} /> {likeCount} Likes
                            </button>
                            <button 
                                onClick={handleFavorite}
                                className={`flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${isFavorited ? 'bg-amber-500/10 text-amber-500 border border-amber-500/50' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'}`}
                            >
                                <Star size={20} className={isFavorited ? 'fill-current' : ''} /> {isFavorited ? 'Favorited' : 'Favorite'}
                            </button>
                        </div>

                        {/* Specs Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                            <div className="bg-zinc-800/50 p-4 rounded-xl border border-zinc-800">
                                <p className="text-xs text-zinc-500 font-bold uppercase mb-1 flex items-center gap-2"><Cpu size={14}/> CPU</p>
                                <p className="text-white font-medium truncate">{localBuild.partsSummary.cpu}</p>
                            </div>
                            <div className="bg-zinc-800/50 p-4 rounded-xl border border-zinc-800">
                                <p className="text-xs text-zinc-500 font-bold uppercase mb-1 flex items-center gap-2"><Monitor size={14}/> GPU</p>
                                <p className="text-white font-medium truncate">{localBuild.partsSummary.gpu}</p>
                            </div>
                            <div className="bg-zinc-800/50 p-4 rounded-xl border border-zinc-800">
                                <p className="text-xs text-zinc-500 font-bold uppercase mb-1 flex items-center gap-2"><MemoryStick size={14}/> RAM</p>
                                <p className="text-white font-medium truncate">{localBuild.partsSummary.ram}</p>
                            </div>
                            <div className="bg-zinc-800/50 p-4 rounded-xl border border-zinc-800">
                                <p className="text-xs text-zinc-500 font-bold uppercase mb-1 flex items-center gap-2"><Box size={14}/> Case</p>
                                <p className="text-white font-medium truncate">{localBuild.partsSummary.case}</p>
                            </div>
                        </div>

                        {localBuild.description && (
                            <div className="bg-zinc-800/30 p-6 rounded-xl border border-zinc-800 mb-8">
                                <h3 className="font-bold text-white mb-2">Description</h3>
                                <p className="text-zinc-400 leading-relaxed whitespace-pre-wrap">{localBuild.description}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: Comments */}
                <div className="w-full md:w-1/3 flex flex-col bg-white dark:bg-zinc-950 border-l border-gray-200 dark:border-zinc-800">
                    <div className="p-4 border-b border-gray-200 dark:border-zinc-800 flex justify-between items-center bg-gray-50 dark:bg-zinc-900/50">
                        <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <MessageSquare size={18} /> {comments.length} Comments
                        </h3>
                        <button onClick={onClose} className="p-2 hover:bg-gray-200 dark:hover:bg-zinc-800 rounded-lg hidden md:block">
                            <X size={20} className="text-gray-500" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                        {comments.length === 0 ? (
                            <div className="text-center py-10 text-gray-500 dark:text-zinc-600">
                                No comments yet. Be the first!
                            </div>
                        ) : (
                            comments.map(comment => {
                                const commentLiked = comment.likes.includes(CURRENT_USER.id);
                                return (
                                    <div key={comment.id} className="flex gap-3">
                                        <img src={comment.avatar} className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 flex-shrink-0" />
                                        <div className="flex-1">
                                            <div className="bg-gray-100 dark:bg-zinc-900 p-3 rounded-2xl rounded-tl-none">
                                                <div className="flex justify-between items-start mb-1">
                                                    <span className="font-bold text-sm text-gray-900 dark:text-white">{comment.username}</span>
                                                    <span className="text-[10px] text-gray-400">{new Date(comment.createdAt).toLocaleDateString()}</span>
                                                </div>
                                                <p className="text-sm text-gray-700 dark:text-zinc-300 whitespace-pre-wrap">{comment.content}</p>
                                            </div>
                                            <div className="flex items-center gap-4 mt-1 px-2">
                                                <button 
                                                    onClick={() => handleLikeComment(comment.id)}
                                                    className={`text-xs font-bold flex items-center gap-1 ${commentLiked ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300'}`}
                                                >
                                                    <ThumbsUp size={12} /> {comment.likes.length || ''}
                                                </button>
                                                <button className="text-xs font-bold text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300">Reply</button>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        )}
                    </div>

                    <form onSubmit={handlePostComment} className="p-4 border-t border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                        <div className="relative">
                            <input 
                                type="text"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Add a comment..."
                                className="w-full bg-gray-100 dark:bg-zinc-950 border border-transparent focus:border-indigo-500 rounded-xl pl-4 pr-12 py-3 text-sm focus:outline-none dark:text-white transition-all"
                            />
                            <button 
                                type="submit"
                                disabled={!newComment.trim()}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-indigo-600 text-white rounded-lg disabled:opacity-50 disabled:bg-gray-400"
                            >
                                <Send size={16} />
                            </button>
                        </div>
                    </form>
                </div>

            </div>
        </div>
    );
};

export default BuildDetailModal;