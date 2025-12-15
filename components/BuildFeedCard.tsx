import React from 'react';
import { MessageSquare, Star, Cpu, Monitor, Box, Eye, CheckCircle2 } from 'lucide-react';
import { BuildPost, Currency } from '../types';
import { formatPrice } from '../utils/currency';
import { SharedBuildsStore } from '../utils/sharedBuildsStore';
import { CURRENT_USER } from '../utils/communityStore';
import ReactionBar from './ReactionBar';

interface BuildFeedCardProps {
    build: BuildPost;
    currency: Currency;
    onOpen: (build: BuildPost) => void;
    onUpdate: (updatedBuild: BuildPost) => void;
}

const BuildFeedCard: React.FC<BuildFeedCardProps> = ({ build, currency, onOpen, onUpdate }) => {
    const isFavorited = build.favoritedBy.includes(CURRENT_USER.id);

    const handleReaction = (type: any) => {
        const updated = SharedBuildsStore.setReaction(build.id, type);
        if (updated) onUpdate(updated);
    };

    const handleFavorite = (e: React.MouseEvent) => {
        e.stopPropagation();
        const updated = SharedBuildsStore.toggleFavorite(build.id);
        if (updated) onUpdate(updated);
    };

    return (
        <div 
            onClick={() => onOpen(build)}
            className="group bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl overflow-hidden hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 cursor-pointer flex flex-col h-full"
        >
            {/* Header / Thumbnail */}
            <div className="relative aspect-video bg-zinc-950 overflow-hidden">
                {build.thumbnail ? (
                    <img src={build.thumbnail} alt={build.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-zinc-800">
                        <Monitor className="text-zinc-600 w-16 h-16" />
                    </div>
                )}
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80"></div>
                
                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1">
                    {build.isFeatured && (
                         <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-lg">FEATURED</span>
                    )}
                    {build.isVerified && (
                         <span className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-lg flex items-center gap-1"><CheckCircle2 size={10}/> VERIFIED</span>
                    )}
                </div>

                {/* Overlay Info */}
                <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-white font-bold text-lg leading-tight line-clamp-1 group-hover:text-indigo-400 transition-colors mb-1">{build.title}</h3>
                    <div className="flex justify-between items-end">
                         <div className="flex items-center gap-2">
                            <img src={build.authorAvatar} alt={build.authorName} className="w-5 h-5 rounded-full border border-white/20" />
                            <span className="text-zinc-300 text-xs">{build.authorName}</span>
                        </div>
                        <span className="text-emerald-400 font-bold text-sm bg-zinc-900/50 px-2 py-0.5 rounded border border-emerald-500/30 backdrop-blur-md">
                            {formatPrice(build.totalPrice, currency)}
                        </span>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-4 flex-1 flex flex-col">
                {/* Parts Summary Pills - Condensed */}
                <div className="flex gap-2 mb-3 text-xs text-zinc-500">
                    <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded truncate flex-1 justify-center">
                        <Cpu size={12} /> <span className="truncate">{build.partsSummary.cpu}</span>
                    </div>
                    <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded truncate flex-1 justify-center">
                        <Monitor size={12} /> <span className="truncate">{build.partsSummary.gpu}</span>
                    </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                    {build.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="text-[10px] font-medium px-2 py-0.5 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-300 rounded border border-indigo-100 dark:border-indigo-500/20">
                            {tag}
                        </span>
                    ))}
                    {build.tags.length > 3 && <span className="text-[10px] text-zinc-500">+{build.tags.length - 3}</span>}
                </div>

                {/* Footer Actions */}
                <div className="mt-auto pt-3 border-t border-gray-100 dark:border-zinc-800 flex items-center justify-between">
                    <ReactionBar 
                        reactions={build.reactions} 
                        currentUserId={CURRENT_USER.id} 
                        onReact={handleReaction}
                        size="sm"
                    />
                    
                    <div className="flex items-center gap-2">
                         <div className="flex items-center gap-1 text-xs text-zinc-400" title="Comments">
                            <MessageSquare size={14} /> {build.commentsCount}
                        </div>
                         <button 
                            onClick={handleFavorite}
                            className={`p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors ${isFavorited ? 'text-amber-500' : 'text-zinc-400'}`}
                        >
                            <Star size={16} className={isFavorited ? 'fill-current' : ''} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BuildFeedCard;