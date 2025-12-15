import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Settings, Heart, Star, HardDrive, MessageSquare, Trophy, Calendar } from 'lucide-react';
import { CURRENT_USER } from '../utils/communityStore';
import { SharedBuildsStore } from '../utils/sharedBuildsStore';
import { Currency } from '../types';
import BuildFeedCard from '../components/BuildFeedCard';

interface ProfilePageProps {
    currency: Currency;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ currency }) => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'posts' | 'favorites'>('posts');

    const myPosts = SharedBuildsStore.getPosts().filter(p => p.authorId === CURRENT_USER.id);
    const myFavorites = SharedBuildsStore.getPosts().filter(p => p.favoritedBy.includes(CURRENT_USER.id));

    const totalLikesReceived = myPosts.reduce((acc, p) => acc + Object.values(p.reactions).filter(r => r === 'like').length, 0);
    const totalFavoritesReceived = myPosts.reduce((acc, p) => acc + p.favorites, 0);

    return (
        <div className="flex-1 h-full overflow-y-auto bg-gray-50 dark:bg-[#09090b] custom-scrollbar">
            
            <div className="bg-zinc-900 border-b border-zinc-800 pt-20 pb-10 px-6">
                <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-end gap-8">
                    <div className="w-32 h-32 rounded-full border-4 border-white dark:border-zinc-800 bg-zinc-800 overflow-hidden shadow-xl -mb-16 z-10">
                        <img src={CURRENT_USER.avatar} alt="Profile" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 pb-2">
                         <h1 className="text-3xl font-bold text-white mb-2">{CURRENT_USER.username}</h1>
                         <div className="flex gap-4 text-zinc-400 text-sm">
                            <span className="flex items-center gap-1"><Calendar size={14}/> Joined Oct 2023</span>
                            <span className="flex items-center gap-1"><Trophy size={14} className="text-amber-500"/> Top Builder</span>
                         </div>
                    </div>
                    <div className="flex gap-3 pb-2">
                        <button className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg font-bold flex items-center gap-2 border border-zinc-700">
                            <Settings size={16} /> Edit Profile
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-6 pt-20 pb-20">
                
                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                    <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 p-4 rounded-xl">
                        <p className="text-zinc-500 text-xs font-bold uppercase mb-1">Shared Builds</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <HardDrive size={20} className="text-indigo-500" /> {myPosts.length}
                        </p>
                    </div>
                    <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 p-4 rounded-xl">
                        <p className="text-zinc-500 text-xs font-bold uppercase mb-1">Likes Received</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Heart size={20} className="text-red-500" /> {totalLikesReceived}
                        </p>
                    </div>
                    <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 p-4 rounded-xl">
                        <p className="text-zinc-500 text-xs font-bold uppercase mb-1">Favorites Received</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Star size={20} className="text-amber-500" /> {totalFavoritesReceived}
                        </p>
                    </div>
                    <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 p-4 rounded-xl">
                        <p className="text-zinc-500 text-xs font-bold uppercase mb-1">Community Level</p>
                        <p className="text-2xl font-bold text-emerald-500 flex items-center gap-2">
                            <Trophy size={20} /> Lvl 5
                        </p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200 dark:border-zinc-800 mb-8 flex gap-8">
                    <button 
                        onClick={() => setActiveTab('posts')}
                        className={`pb-4 text-sm font-bold uppercase tracking-wider border-b-2 transition-all ${
                            activeTab === 'posts' ? 'border-indigo-500 text-indigo-500' : 'border-transparent text-zinc-500 hover:text-zinc-300'
                        }`}
                    >
                        My Posts
                    </button>
                    <button 
                         onClick={() => setActiveTab('favorites')}
                         className={`pb-4 text-sm font-bold uppercase tracking-wider border-b-2 transition-all ${
                            activeTab === 'favorites' ? 'border-indigo-500 text-indigo-500' : 'border-transparent text-zinc-500 hover:text-zinc-300'
                        }`}
                    >
                        Favorites
                    </button>
                </div>

                {/* List */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {activeTab === 'posts' && myPosts.map(post => (
                        <BuildFeedCard 
                            key={post.id} 
                            build={post} 
                            currency={currency} 
                            onOpen={(p) => navigate(`/share/${p.id}`)}
                            onUpdate={() => {}} 
                        />
                    ))}
                    {activeTab === 'favorites' && myFavorites.map(post => (
                        <BuildFeedCard 
                            key={post.id} 
                            build={post} 
                            currency={currency} 
                            onOpen={(p) => navigate(`/share/${p.id}`)}
                            onUpdate={() => {}} 
                        />
                    ))}
                    
                    {(activeTab === 'posts' && myPosts.length === 0) && (
                        <div className="col-span-full py-12 text-center text-zinc-500">You haven't shared any builds yet.</div>
                    )}
                     {(activeTab === 'favorites' && myFavorites.length === 0) && (
                        <div className="col-span-full py-12 text-center text-zinc-500">You haven't favorited any builds yet.</div>
                    )}
                </div>

            </div>

        </div>
    );
};

export default ProfilePage;