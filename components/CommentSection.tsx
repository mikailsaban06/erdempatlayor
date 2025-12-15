import React, { useState } from 'react';
import { MessageSquare, Send, ThumbsUp, Trash2, Reply } from 'lucide-react';
import { Comment } from '../types';
import { SharedBuildsStore } from '../utils/sharedBuildsStore';
import { CURRENT_USER } from '../utils/communityStore';

interface CommentSectionProps {
    postId: string;
    comments: Comment[];
    onUpdate: () => void;
}

const CommentSection: React.FC<CommentSectionProps> = ({ postId, comments, onUpdate }) => {
    const [newComment, setNewComment] = useState('');
    const [replyTo, setReplyTo] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent, parentId: string | null = null) => {
        e.preventDefault();
        const content = parentId ? (document.getElementById(`reply-${parentId}`) as HTMLInputElement)?.value : newComment;
        
        if (!content?.trim()) return;

        SharedBuildsStore.addComment(postId, content, parentId);
        if (parentId) setReplyTo(null);
        else setNewComment('');
        
        onUpdate();
    };

    const handleLike = (id: string) => {
        SharedBuildsStore.toggleCommentLike(id);
        onUpdate();
    };

    const handleDelete = (id: string) => {
        if(confirm("Delete this comment?")) {
            SharedBuildsStore.deleteComment(id);
            onUpdate();
        }
    };

    const rootComments = comments.filter(c => !c.parentId);

    const CommentItem = ({ comment, isReply = false }: { comment: Comment, isReply?: boolean }) => {
        const isLiked = comment.likes.includes(CURRENT_USER.id);
        const isMe = comment.userId === CURRENT_USER.id;
        const replies = comments.filter(c => c.parentId === comment.id);

        return (
            <div className={`flex gap-3 ${isReply ? 'mt-3 pl-4 border-l-2 border-zinc-200 dark:border-zinc-800' : 'mt-4'}`}>
                <img 
                    src={comment.avatar} 
                    alt={comment.username}
                    className={`${isReply ? 'w-6 h-6' : 'w-8 h-8'} rounded-full bg-zinc-200 dark:bg-zinc-800 flex-shrink-0 object-cover`} 
                />
                <div className="flex-1 min-w-0">
                    <div className="bg-gray-100 dark:bg-zinc-900 p-3 rounded-2xl rounded-tl-none relative group">
                        <div className="flex justify-between items-start mb-1">
                            <span className="font-bold text-sm text-gray-900 dark:text-white">{comment.username}</span>
                            <span className="text-[10px] text-gray-400">{new Date(comment.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className={`text-sm text-gray-700 dark:text-zinc-300 whitespace-pre-wrap ${comment.isDeleted ? 'italic opacity-50' : ''}`}>{comment.content}</p>
                        
                        {isMe && !comment.isDeleted && (
                            <button 
                                onClick={() => handleDelete(comment.id)}
                                className="absolute top-2 right-2 text-zinc-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <Trash2 size={12} />
                            </button>
                        )}
                    </div>
                    
                    <div className="flex items-center gap-4 mt-1 px-2">
                        <button 
                            onClick={() => handleLike(comment.id)}
                            className={`text-xs font-bold flex items-center gap-1 transition-colors ${isLiked ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300'}`}
                            disabled={comment.isDeleted}
                        >
                            <ThumbsUp size={12} /> {comment.likes.length || 'Like'}
                        </button>
                        {!isReply && !comment.isDeleted && (
                            <button 
                                onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
                                className="text-xs font-bold text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300 flex items-center gap-1"
                            >
                                <Reply size={12} /> Reply
                            </button>
                        )}
                    </div>

                    {/* Reply Input */}
                    {replyTo === comment.id && (
                        <form onSubmit={(e) => handleSubmit(e, comment.id)} className="mt-2 flex gap-2">
                            <input 
                                id={`reply-${comment.id}`}
                                type="text"
                                autoFocus
                                placeholder={`Reply to ${comment.username}...`}
                                className="flex-1 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 dark:text-white"
                            />
                            <button type="submit" className="text-indigo-600 dark:text-indigo-400 p-2 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded">
                                <Send size={14} />
                            </button>
                        </form>
                    )}

                    {/* Nested Replies */}
                    {replies.map(reply => (
                        <CommentItem key={reply.id} comment={reply} isReply={true} />
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 dark:border-zinc-800 flex items-center gap-2 bg-gray-50 dark:bg-zinc-900/50">
                <MessageSquare size={18} className="text-indigo-500" />
                <h3 className="font-bold text-gray-900 dark:text-white">{comments.length} Comments</h3>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                {rootComments.length === 0 ? (
                    <div className="text-center py-10 text-gray-500 dark:text-zinc-600">
                        No comments yet. Be the first to start the discussion!
                    </div>
                ) : (
                    rootComments.map(comment => (
                        <CommentItem key={comment.id} comment={comment} />
                    ))
                )}
            </div>

            {/* Main Input */}
            <form onSubmit={(e) => handleSubmit(e)} className="p-4 border-t border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
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
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-indigo-600 text-white rounded-lg disabled:opacity-50 disabled:bg-gray-400 transition-colors"
                    >
                        <Send size={16} />
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CommentSection;