import React, { useState } from 'react';
import { X, Upload, CheckCircle2, ChevronRight } from 'lucide-react';
import { SavedBuild } from '../types';
import { SharedBuildsStore } from '../utils/sharedBuildsStore';

interface PublishBuildModalProps {
    savedBuilds: SavedBuild[];
    onClose: () => void;
    onPublishSuccess: () => void;
}

const PublishBuildModal: React.FC<PublishBuildModalProps> = ({ savedBuilds, onClose, onPublishSuccess }) => {
    const [selectedBuildId, setSelectedBuildId] = useState<string | null>(null);
    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handlePublish = () => {
        if (!selectedBuildId) return;
        const build = savedBuilds.find(b => b.id === selectedBuildId);
        if (build) {
            setIsSubmitting(true);
            setTimeout(() => {
                // Use createPost with defaults for simplified modal
                SharedBuildsStore.createPost(build, build.name, description, [], 'public');
                setIsSubmitting(false);
                onPublishSuccess();
                onClose();
            }, 800);
        }
    };

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-lg bg-white dark:bg-zinc-950 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
                
                <div className="p-6 border-b border-gray-200 dark:border-zinc-800 flex justify-between items-center bg-gray-50 dark:bg-zinc-900/50">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Upload size={20} className="text-indigo-500" /> Share Your Build
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 dark:hover:bg-zinc-800 rounded-lg">
                        <X size={20} className="text-gray-500 dark:text-zinc-400" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                    
                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-zinc-300 mb-2">
                            1. Select a Saved Build
                        </label>
                        {savedBuilds.length === 0 ? (
                            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-center text-sm text-red-600 dark:text-red-400">
                                You don't have any saved builds to share.
                            </div>
                        ) : (
                            <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar pr-2">
                                {savedBuilds.map(build => (
                                    <div 
                                        key={build.id}
                                        onClick={() => setSelectedBuildId(build.id)}
                                        className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                                            selectedBuildId === build.id 
                                            ? 'bg-indigo-50 dark:bg-indigo-600/20 border-indigo-500 ring-1 ring-indigo-500' 
                                            : 'bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 hover:border-gray-300 dark:hover:border-zinc-700'
                                        }`}
                                    >
                                        <div>
                                            <p className="font-bold text-gray-900 dark:text-white text-sm">{build.name}</p>
                                            <p className="text-xs text-gray-500 dark:text-zinc-500">{new Date(build.updatedAt).toLocaleDateString()}</p>
                                        </div>
                                        {selectedBuildId === build.id && <CheckCircle2 size={18} className="text-indigo-500" />}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-zinc-300 mb-2">
                            2. Add a Description
                        </label>
                        <textarea 
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            className="w-full bg-gray-50 dark:bg-zinc-900 border border-gray-300 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white resize-none"
                            placeholder="Tell the community about your build..."
                        />
                    </div>
                </div>

                <div className="p-6 border-t border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900/50 flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-bold text-gray-600 dark:text-zinc-400 hover:bg-gray-200 dark:hover:bg-zinc-800 rounded-lg transition-colors">
                        Cancel
                    </button>
                    <button 
                        onClick={handlePublish}
                        disabled={!selectedBuildId || isSubmitting}
                        className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold rounded-lg shadow-lg shadow-indigo-500/20 flex items-center gap-2"
                    >
                        {isSubmitting ? 'Publishing...' : 'Publish Build'} <ChevronRight size={16} />
                    </button>
                </div>

            </div>
        </div>
    );
};

export default PublishBuildModal;