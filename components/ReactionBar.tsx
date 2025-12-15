import React from 'react';
import { ThumbsUp, Flame, Gem, Zap } from 'lucide-react';
import { ReactionType } from '../types';

interface ReactionBarProps {
    reactions: Record<string, ReactionType>;
    currentUserId: string;
    onReact: (type: ReactionType | null) => void;
    size?: 'sm' | 'md' | 'lg';
}

const ReactionBar: React.FC<ReactionBarProps> = ({ reactions, currentUserId, onReact, size = 'md' }) => {
    // Calculate counts
    const counts = {
        like: 0,
        fire: 0,
        diamond: 0,
        mindblown: 0
    };
    
    Object.values(reactions).forEach(r => {
        if (counts[r] !== undefined) counts[r]++;
    });

    const myReaction = reactions[currentUserId];
    
    const icons = {
        like: <ThumbsUp size={size === 'sm' ? 14 : 18} className={myReaction === 'like' ? 'fill-current' : ''} />,
        fire: <Flame size={size === 'sm' ? 14 : 18} className={myReaction === 'fire' ? 'fill-current' : ''} />,
        diamond: <Gem size={size === 'sm' ? 14 : 18} className={myReaction === 'diamond' ? 'fill-current' : ''} />,
        mindblown: <Zap size={size === 'sm' ? 14 : 18} className={myReaction === 'mindblown' ? 'fill-current' : ''} />
    };

    const handleToggle = (type: ReactionType) => {
        if (myReaction === type) {
            onReact(null);
        } else {
            onReact(type);
        }
    };

    const btnClass = (active: boolean, colorClass: string) => `
        flex items-center gap-1.5 px-2 py-1 rounded-full transition-all duration-200 border
        ${active 
            ? `${colorClass} bg-opacity-10 border-opacity-20` 
            : 'text-zinc-500 border-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800'
        }
        ${size === 'sm' ? 'text-xs' : 'text-sm'}
    `;

    return (
        <div className="flex items-center gap-1">
            <button 
                onClick={(e) => { e.stopPropagation(); handleToggle('like'); }}
                className={btnClass(myReaction === 'like', 'text-blue-500 bg-blue-500 border-blue-500')}
                title="Like"
            >
                {icons.like} {counts.like > 0 && <span className="font-bold">{counts.like}</span>}
            </button>
            
            <button 
                onClick={(e) => { e.stopPropagation(); handleToggle('fire'); }}
                className={btnClass(myReaction === 'fire', 'text-orange-500 bg-orange-500 border-orange-500')}
                title="Fire"
            >
                {icons.fire} {counts.fire > 0 && <span className="font-bold">{counts.fire}</span>}
            </button>

            <button 
                onClick={(e) => { e.stopPropagation(); handleToggle('diamond'); }}
                className={btnClass(myReaction === 'diamond', 'text-cyan-500 bg-cyan-500 border-cyan-500')}
                title="Diamond"
            >
                {icons.diamond} {counts.diamond > 0 && <span className="font-bold">{counts.diamond}</span>}
            </button>
            
            <button 
                onClick={(e) => { e.stopPropagation(); handleToggle('mindblown'); }}
                className={btnClass(myReaction === 'mindblown', 'text-purple-500 bg-purple-500 border-purple-500')}
                title="Mindblown"
            >
                {icons.mindblown} {counts.mindblown > 0 && <span className="font-bold">{counts.mindblown}</span>}
            </button>
        </div>
    );
};

export default ReactionBar;