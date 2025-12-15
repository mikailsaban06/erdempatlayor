import React, { useState, useEffect } from 'react';
import { Search, PlusCircle, Filter, Trophy, Clock, Star, Flame } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SharedBuildsStore } from '../utils/sharedBuildsStore';
import { BuildPost, SavedBuild, Currency } from '../types';
import BuildFeedCard from '../components/BuildFeedCard';
import ShareBuildModal from '../components/ShareBuildModal';

interface ShareBuildsPageProps {
    savedBuilds: SavedBuild[];
    currency: Currency;
}

const ShareBuildsPage: React.FC<ShareBuildsPageProps> = ({ savedBuilds, currency }) => {
    const navigate = useNavigate();
    const [builds, setBuilds] = useState<BuildPost[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<'top' | 'trending' | 'newest' | 'favorites'>('top');
    
    // Modals
    const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);

    useEffect(() => {
        refreshBuilds();
    }, [sortBy]); // Re-fetch when sort changes

    const refreshBuilds = () => {
        const allPosts = SharedBuildsStore.getPosts();
        setBuilds(SharedBuildsStore.getSortedPosts(allPosts, sortBy));
    };

    const sortedAndFilteredBuilds = builds.filter(b => 
        b.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        b.authorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="flex-1 h-full overflow-y-auto bg-gray-50 dark:bg-[#09090b] custom-scrollbar">
            
            {/* Hero Section */}
            <div className="bg-zinc-900 border-b border-zinc-800 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                <div className="absolute top-0 right-0 p-20 bg-indigo-600/20 blur-[100px] rounded-full"></div>
                
                <div className="relative max-w-7xl mx-auto px-6 py-12 md:py-16 z-10">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                            <h1 className="text-4xl font-extrabold text-white mb-2">Community Builds</h1>
                            <p className="text-zinc-400 text-lg max-w-xl">
                                Discover, like, and discuss PC configurations shared by the community.
                            </p>
                        </div>
                        <button 
                            onClick={() => setIsPublishModalOpen(true)}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-indigo-600/20 flex items-center gap-2 transition-transform active:scale-95"
                        >
                            <PlusCircle size={20} /> Share Your Build
                        </button>
                    </div>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="sticky top-0 z-20 bg-white/80 dark:bg-[#09090b]/80 backdrop-blur-md border-b border-gray-200 dark:border-zinc-800 px-6 py-4">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 justify-between">
                    
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search builds or authors..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-gray-100 dark:bg-zinc-900 border border-transparent focus:border-indigo-500 rounded-xl pl-10 pr-4 py-2.5 text-sm dark:text-white focus:outline-none transition-all"
                        />
                    </div>

                    <div className="flex gap-2 p-1 bg-gray-100 dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 overflow-x-auto">
                        <button 
                            onClick={() => setSortBy('top')}
                            className={`px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${sortBy === 'top' ? 'bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                        >
                            <Trophy size={14} /> Top
                        </button>
                        <button 
                            onClick={() => setSortBy('trending')}
                            className={`px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${sortBy === 'trending' ? 'bg-white dark:bg-zinc-800 text-orange-500 shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                        >
                            <Flame size={14} /> Trending
                        </button>
                        <button 
                            onClick={() => setSortBy('newest')}
                            className={`px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${sortBy === 'newest' ? 'bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                        >
                            <Clock size={14} /> Newest
                        </button>
                        <button 
                            onClick={() => setSortBy('favorites')}
                            className={`px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${sortBy === 'favorites' ? 'bg-white dark:bg-zinc-800 text-amber-500 shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                        >
                            <Star size={14} /> Favorites
                        </button>
                    </div>

                </div>
            </div>

            {/* Feed Grid */}
            <div className="max-w-7xl mx-auto px-6 py-8">
                {sortedAndFilteredBuilds.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {sortedAndFilteredBuilds.map(build => (
                            <BuildFeedCard 
                                key={build.id} 
                                build={build} 
                                currency={currency}
                                onOpen={(b) => navigate(`/share/${b.id}`)}
                                onUpdate={refreshBuilds}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 text-zinc-500">
                        No builds found matching your criteria.
                    </div>
                )}
            </div>

            {/* Modals */}
            {isPublishModalOpen && (
                <ShareBuildModal 
                    savedBuilds={savedBuilds}
                    onClose={() => setIsPublishModalOpen(false)}
                    onPublishSuccess={refreshBuilds}
                />
            )}

        </div>
    );
};

export default ShareBuildsPage;