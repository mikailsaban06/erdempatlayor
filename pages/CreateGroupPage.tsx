import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, Users, Hash, Type, AlignLeft } from 'lucide-react';
import { CommunityStore } from '../utils/communityStore';

const CreateGroupPage = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [tags, setTags] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const tagList = tags.split(',').map(t => t.trim()).filter(t => t.length > 0);
        
        setTimeout(() => {
            const newGroup = CommunityStore.createGroup(name, description, tagList);
            setIsSubmitting(false);
            navigate(`/g/${newGroup.slug}`);
        }, 1000);
    };

    return (
        <div className="flex-1 h-full overflow-y-auto bg-gray-50 dark:bg-[#09090b] custom-scrollbar">
            <div className="max-w-3xl mx-auto px-6 py-12">
                
                <button 
                    onClick={() => navigate('/community')}
                    className="flex items-center gap-2 text-zinc-500 hover:text-zinc-300 mb-8 transition-colors"
                >
                    <ArrowLeft size={20} /> Back to Community
                </button>

                <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">Create a New Group</h1>
                <p className="text-gray-500 dark:text-zinc-400 mb-8">Establish a new community for discussions, sharing builds, and more.</p>

                <form onSubmit={handleSubmit} className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-8 shadow-sm space-y-6">
                    
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-zinc-300 mb-2">
                            Group Name
                        </label>
                        <div className="relative">
                            <Type className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                            <input 
                                type="text" 
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-gray-50 dark:bg-zinc-950 border border-gray-300 dark:border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                placeholder="e.g. Extreme Overclockers"
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-zinc-300 mb-2">
                            Description
                        </label>
                        <div className="relative">
                            <AlignLeft className="absolute left-3 top-3 text-zinc-500" size={18} />
                            <textarea 
                                required
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={4}
                                className="w-full bg-gray-50 dark:bg-zinc-950 border border-gray-300 dark:border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none"
                                placeholder="What is this group about?"
                            />
                        </div>
                    </div>

                    {/* Tags */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-zinc-300 mb-2">
                            Tags (comma separated)
                        </label>
                        <div className="relative">
                            <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                            <input 
                                type="text" 
                                value={tags}
                                onChange={(e) => setTags(e.target.value)}
                                className="w-full bg-gray-50 dark:bg-zinc-950 border border-gray-300 dark:border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                placeholder="gaming, hardware, overclocking"
                            />
                        </div>
                    </div>

                    {/* Mock Image Uploads */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="border-2 border-dashed border-gray-300 dark:border-zinc-800 rounded-xl p-6 text-center hover:bg-gray-50 dark:hover:bg-zinc-950/50 transition-colors cursor-pointer group">
                            <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-3 text-indigo-500">
                                <Users size={24} />
                            </div>
                            <p className="font-bold text-sm text-gray-900 dark:text-white mb-1">Upload Avatar</p>
                            <p className="text-xs text-zinc-500">Optional (Auto-generated if empty)</p>
                        </div>
                        <div className="border-2 border-dashed border-gray-300 dark:border-zinc-800 rounded-xl p-6 text-center hover:bg-gray-50 dark:hover:bg-zinc-950/50 transition-colors cursor-pointer group">
                            <div className="w-12 h-12 bg-purple-50 dark:bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-3 text-purple-500">
                                <Upload size={24} />
                            </div>
                            <p className="font-bold text-sm text-gray-900 dark:text-white mb-1">Upload Banner</p>
                            <p className="text-xs text-zinc-500">Optional (Default if empty)</p>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-gray-200 dark:border-zinc-800 flex justify-end">
                        <button 
                            type="submit" 
                            disabled={isSubmitting}
                            className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-70 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/20 active:scale-95 flex items-center gap-2"
                        >
                            {isSubmitting ? 'Creating...' : 'Create Group'}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default CreateGroupPage;