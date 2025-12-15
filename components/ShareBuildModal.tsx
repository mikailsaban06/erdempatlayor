import React, { useState } from 'react';
import { X, Upload, CheckCircle2, ChevronRight, Hash, Eye, EyeOff, Globe } from 'lucide-react';
import { SavedBuild, Visibility } from '../types';
import { SharedBuildsStore } from '../utils/sharedBuildsStore';

interface ShareBuildModalProps {
    savedBuilds: SavedBuild[];
    onClose: () => void;
    onPublishSuccess: () => void;
    preSelectedBuildId?: string | null;
}

const AVAILABLE_TAGS = [
    'Gaming', 'Workstation', 'Budget', '4K', '1440p', '1080p', 
    'RGB', 'Stealth', 'Mini-ITX', 'Liquid Cooled', 'Silent', 
    'White', 'Black', 'Future Proof'
];

const ShareBuildModal: React.FC<ShareBuildModalProps> = ({ savedBuilds, onClose, onPublishSuccess, preSelectedBuildId }) => {
    const [step, setStep] = useState(1);
    const [selectedBuildId, setSelectedBuildId] = useState<string | null>(preSelectedBuildId || null);
    
    // Form State
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [visibility, setVisibility] = useState<Visibility>('public');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleNext = () => {
        if (step === 1 && selectedBuildId) {
            const build = savedBuilds.find(b => b.id === selectedBuildId);
            if (build) {
                setTitle(build.name);
                setStep(2);
            }
        }
    };

    const toggleTag = (tag: string) => {
        if (selectedTags.includes(tag)) {
            setSelectedTags(prev => prev.filter(t => t !== tag));
        } else if (selectedTags.length < 5) {
            setSelectedTags(prev => [...prev, tag]);
        }
    };

    const handlePublish = () => {
        if (!selectedBuildId) return;
        const build = savedBuilds.find(b => b.id === selectedBuildId);
        if (build) {
            setIsSubmitting(true);
            setTimeout(() => {
                SharedBuildsStore.createPost(build, title, description, selectedTags, visibility === 'public' ? 'public' : 'unlisted');
                setIsSubmitting(false);
                onPublishSuccess();
                onClose();
            }, 800);
        }
    };

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-2xl bg-white dark:bg-zinc-950 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
                
                {/* Header */}
                <div className="p-6 border-b border-gray-200 dark:border-zinc-800 flex justify-between items-center bg-gray-50 dark:bg-zinc-900/50">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Upload size={20} className="text-indigo-500" /> Share Your Build
                        </h2>
                        <p className="text-xs text-gray-500 dark:text-zinc-500 mt-1">Step {step} of 2</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 dark:hover:bg-zinc-800 rounded-lg">
                        <X size={20} className="text-gray-500 dark:text-zinc-400" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                    
                    {step === 1 && (
                        <div className="space-y-4 animate-in slide-in-from-right-4">
                            <h3 className="text-sm font-bold text-gray-700 dark:text-zinc-300 uppercase tracking-wider mb-4">Select Build to Share</h3>
                            {savedBuilds.length === 0 ? (
                                <div className="p-8 bg-zinc-100 dark:bg-zinc-900 rounded-xl text-center border border-dashed border-zinc-300 dark:border-zinc-700">
                                    <p className="text-zinc-500">You don't have any saved builds yet.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-3">
                                    {savedBuilds.map(build => (
                                        <div 
                                            key={build.id}
                                            onClick={() => setSelectedBuildId(build.id)}
                                            className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                                                selectedBuildId === build.id 
                                                ? 'bg-indigo-50 dark:bg-indigo-500/10 border-indigo-500 ring-1 ring-indigo-500' 
                                                : 'bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 hover:border-indigo-300 dark:hover:border-zinc-600'
                                            }`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-16 h-10 bg-zinc-800 rounded overflow-hidden">
                                                    {build.thumbnail && <img src={build.thumbnail} className="w-full h-full object-cover" />}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900 dark:text-white">{build.name}</p>
                                                    <p className="text-xs text-gray-500 dark:text-zinc-500">{Object.keys(build.parts).length} parts • {new Date(build.updatedAt).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            {selectedBuildId === build.id && <CheckCircle2 size={24} className="text-indigo-500" />}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6 animate-in slide-in-from-right-4">
                            
                            {/* Title */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-zinc-300 mb-2">Post Title</label>
                                <input 
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full bg-gray-50 dark:bg-zinc-900 border border-gray-300 dark:border-zinc-800 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Give your build a catchy title..."
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-zinc-300 mb-2">Description (Markdown supported)</label>
                                <textarea 
                                    rows={5}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full bg-gray-50 dark:bg-zinc-900 border border-gray-300 dark:border-zinc-800 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                                    placeholder="Describe your component choices, use cases, and performance..."
                                />
                            </div>

                            {/* Tags */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-zinc-300 mb-2">
                                    Tags <span className="text-zinc-500 font-normal">(Max 5)</span>
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {AVAILABLE_TAGS.map(tag => (
                                        <button
                                            key={tag}
                                            onClick={() => toggleTag(tag)}
                                            className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                                                selectedTags.includes(tag)
                                                ? 'bg-indigo-600 border-indigo-600 text-white'
                                                : 'bg-white dark:bg-zinc-900 border-gray-300 dark:border-zinc-700 text-gray-600 dark:text-zinc-400 hover:border-indigo-400'
                                            }`}
                                        >
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Visibility */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-zinc-300 mb-2">Visibility</label>
                                <div className="grid grid-cols-2 gap-4">
                                    <button 
                                        onClick={() => setVisibility('public')}
                                        className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                                            visibility === 'public'
                                            ? 'bg-indigo-50 dark:bg-indigo-500/10 border-indigo-500 text-indigo-600 dark:text-indigo-400'
                                            : 'bg-white dark:bg-zinc-900 border-gray-300 dark:border-zinc-700 text-zinc-500'
                                        }`}
                                    >
                                        <Globe size={24} />
                                        <span className="font-bold">Public</span>
                                    </button>
                                    <button 
                                        onClick={() => setVisibility('unlisted')}
                                        className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                                            visibility === 'unlisted'
                                            ? 'bg-indigo-50 dark:bg-indigo-500/10 border-indigo-500 text-indigo-600 dark:text-indigo-400'
                                            : 'bg-white dark:bg-zinc-900 border-gray-300 dark:border-zinc-700 text-zinc-500'
                                        }`}
                                    >
                                        <EyeOff size={24} />
                                        <span className="font-bold">Unlisted</span>
                                    </button>
                                </div>
                            </div>

                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900/50 flex justify-between">
                    {step === 2 ? (
                        <button onClick={() => setStep(1)} className="px-4 py-2 text-sm font-bold text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300">
                            Back
                        </button>
                    ) : (
                        <div></div>
                    )}
                    
                    {step === 1 ? (
                        <button 
                            onClick={handleNext}
                            disabled={!selectedBuildId}
                            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold rounded-lg shadow-lg flex items-center gap-2"
                        >
                            Next Step <ChevronRight size={16} />
                        </button>
                    ) : (
                        <button 
                            onClick={handlePublish}
                            disabled={!title || isSubmitting}
                            className="px-8 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-bold rounded-lg shadow-lg flex items-center gap-2"
                        >
                            {isSubmitting ? 'Publishing...' : 'Publish Build'} <CheckCircle2 size={16} />
                        </button>
                    )}
                </div>

            </div>
        </div>
    );
};

export default ShareBuildModal;