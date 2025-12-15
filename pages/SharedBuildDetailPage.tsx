import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    ArrowLeft, Calendar, Share2, Star, Zap, Monitor, Cpu, Box, 
    MemoryStick, HardDrive, Fan, AlertTriangle, CheckCircle2, 
    Copy, ExternalLink, Activity, Info
} from 'lucide-react';
import { SharedBuildsStore } from '../utils/sharedBuildsStore';
import { BuildPost, Currency, SavedBuild, BuildState } from '../types';
import { CURRENT_USER } from '../utils/communityStore';
import { formatPrice } from '../utils/currency';
import ReactionBar from '../components/ReactionBar';
import CommentSection from '../components/CommentSection';
import { checkCompatibility } from '../utils/compatibility';

interface SharedBuildDetailPageProps {
    currency: Currency;
    onFork: (parts: BuildState, originalName: string) => void;
    onView: (parts: BuildState) => void;
}

const SharedBuildDetailPage: React.FC<SharedBuildDetailPageProps> = ({ currency, onFork, onView }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState<BuildPost | undefined>();
    const [comments, setComments] = useState<any[]>([]);
    
    // Check Build Modal
    const [isCheckModalOpen, setIsCheckModalOpen] = useState(false);
    const [checkResults, setCheckResults] = useState<ReturnType<typeof checkCompatibility> | null>(null);
    
    // Toast
    const [toastMsg, setToastMsg] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            loadPost(id);
        }
    }, [id]);

    const showToast = (msg: string) => {
        setToastMsg(msg);
        setTimeout(() => setToastMsg(null), 3000);
    };

    const loadPost = (postId: string) => {
        const p = SharedBuildsStore.getPostById(postId);
        if (p) {
            setPost(p);
            setComments(SharedBuildsStore.getComments(p.id));
            SharedBuildsStore.incrementViews(p.id);
        } else {
            // Handle 404 - could redirect or show error
        }
    };

    const handleCheckBuild = () => {
        if (!post || !post.parts) return;
        
        const results = checkCompatibility(post.parts);
        setCheckResults(results);
        
        // Update post verification status
        const updated = SharedBuildsStore.updatePostVerification(post.id, results.compatible, results.warnings);
        if (updated) setPost(updated);
        
        setIsCheckModalOpen(true);
    };

    if (!post) return <div className="flex-1 flex items-center justify-center text-zinc-500">Loading build details...</div>;

    const isFavorited = post.favoritedBy.includes(CURRENT_USER.id);

    const handleReaction = (type: any) => {
        const updated = SharedBuildsStore.setReaction(post.id, type);
        if (updated) setPost(updated);
    };

    const handleFavorite = () => {
        const updated = SharedBuildsStore.toggleFavorite(post.id);
        if (updated) {
            setPost(updated);
            showToast(updated.favoritedBy.includes(CURRENT_USER.id) ? "Added to favorites" : "Removed from favorites");
        }
    };

    const handleShare = () => {
        const url = window.location.href;
        navigator.clipboard.writeText(url).then(() => {
            showToast("Link copied to clipboard");
        });
    };

    const handleRemix = () => {
        if (post.parts && Object.keys(post.parts).length > 0) {
            onFork(post.parts, post.title);
        } else {
            alert("This build has no parts data to remix.");
        }
    };

    const handleViewInBuilder = () => {
        if (post.parts && Object.keys(post.parts).length > 0) {
            onView(post.parts);
        } else {
            alert("This build has no parts data to view.");
        }
    };

    return (
        <div className="flex-1 h-full overflow-y-auto bg-gray-50 dark:bg-[#09090b] custom-scrollbar relative">
            
            {/* Toast */}
            {toastMsg && (
                <div className="fixed top-24 left-1/2 -translate-x-1/2 bg-zinc-900 text-white px-6 py-3 rounded-full shadow-2xl z-50 animate-in fade-in slide-in-from-top-4 flex items-center gap-2 font-bold text-sm">
                    <CheckCircle2 size={16} className="text-emerald-500" />
                    {toastMsg}
                </div>
            )}

            {/* Check Build Modal */}
            {isCheckModalOpen && checkResults && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in">
                    <div className="bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
                        <div className="p-6 border-b border-gray-200 dark:border-zinc-800 flex justify-between items-center bg-gray-50 dark:bg-zinc-900/50">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <Activity className={checkResults.compatible ? "text-emerald-500" : "text-red-500"} />
                                Compatibility Report
                            </h3>
                            <button onClick={() => setIsCheckModalOpen(false)} className="p-2 hover:bg-gray-200 dark:hover:bg-zinc-800 rounded-lg">
                                <ExternalLink size={20} className="hidden" /> {/* Placeholder icon to maintain layout if needed */}
                                <span className="text-2xl leading-none">&times;</span>
                            </button>
                        </div>
                        <div className="p-6">
                            <div className={`p-4 rounded-xl mb-6 flex items-center gap-4 ${checkResults.compatible ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-red-500/10 border border-red-500/20'}`}>
                                {checkResults.compatible ? <CheckCircle2 size={32} className="text-emerald-500" /> : <AlertTriangle size={32} className="text-red-500" />}
                                <div>
                                    <h4 className={`font-bold text-lg ${checkResults.compatible ? 'text-emerald-500' : 'text-red-500'}`}>
                                        {checkResults.compatible ? 'Fully Compatible' : 'Issues Found'}
                                    </h4>
                                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                                        {checkResults.compatible ? 'All parts fit together without known issues.' : 'Please review the warnings below.'}
                                    </p>
                                </div>
                            </div>

                            {checkResults.warnings.length > 0 ? (
                                <div className="space-y-3">
                                    <h5 className="font-bold text-gray-900 dark:text-white text-sm uppercase tracking-wide">Warnings</h5>
                                    {checkResults.warnings.map((w, i) => (
                                        <div key={i} className="flex gap-3 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/10 p-3 rounded-lg">
                                            <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                                            <span>{w}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="flex justify-between p-3 bg-zinc-50 dark:bg-zinc-900 rounded-lg text-sm">
                                        <span className="text-zinc-500">Estimated Power</span>
                                        <span className="font-bold dark:text-white">{checkResults.totalWattage}W</span>
                                    </div>
                                    <div className="flex justify-between p-3 bg-zinc-50 dark:bg-zinc-900 rounded-lg text-sm">
                                        <span className="text-zinc-500">Socket Match</span>
                                        <span className="font-bold text-emerald-500 flex items-center gap-1"><CheckCircle2 size={12}/> Verified</span>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="p-4 bg-gray-50 dark:bg-zinc-900/50 border-t border-gray-200 dark:border-zinc-800 text-center">
                            <button onClick={() => setIsCheckModalOpen(false)} className="px-6 py-2 bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white rounded-lg font-bold">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Hero Image */}
            <div className="h-64 md:h-96 w-full bg-zinc-900 relative">
                {post.thumbnail ? (
                    <img src={post.thumbnail} className="w-full h-full object-cover opacity-80" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-600">
                        <Monitor size={64} />
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] to-transparent"></div>
                
                <button 
                    onClick={() => navigate('/share')}
                    className="absolute top-6 left-6 flex items-center gap-2 bg-black/50 backdrop-blur-md text-white px-4 py-2 rounded-full hover:bg-black/70 transition-colors z-10 font-bold text-sm"
                >
                    <ArrowLeft size={16} /> Back to Feed
                </button>
            </div>

            <div className="max-w-7xl mx-auto px-6 -mt-32 relative z-10 pb-20">
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Left Column: Details */}
                    <div className="lg:col-span-2 space-y-8">
                        
                        {/* Header Card */}
                        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl p-8 shadow-xl">
                            <div className="flex flex-wrap gap-2 mb-4">
                                {post.isFeatured && <span className="bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded">FEATURED</span>}
                                {post.tags.map(t => <span key={t} className="bg-indigo-500/10 text-indigo-500 text-xs font-bold px-2 py-1 rounded">#{t}</span>)}
                            </div>
                            
                            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">{post.title}</h1>
                            
                            <div className="flex flex-col md:flex-row md:items-center justify-between border-t border-gray-100 dark:border-zinc-800 pt-6 mt-6 gap-4">
                                <div className="flex items-center gap-3">
                                    <img src={post.authorAvatar} className="w-10 h-10 rounded-full" />
                                    <div>
                                        <p className="font-bold text-gray-900 dark:text-white">{post.authorName}</p>
                                        <p className="text-xs text-zinc-500">{new Date(post.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <ReactionBar reactions={post.reactions} currentUserId={CURRENT_USER.id} onReact={handleReaction} />
                                    <div className="w-px h-8 bg-zinc-200 dark:bg-zinc-800 hidden md:block"></div>
                                    
                                    <button onClick={handleFavorite} className={`p-2 rounded-lg transition-colors ${isFavorited ? 'text-amber-500 bg-amber-500/10' : 'text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'}`} title="Favorite">
                                        <Star size={20} className={isFavorited ? 'fill-current' : ''} />
                                    </button>
                                    
                                    <button onClick={handleShare} className="p-2 rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-indigo-500 transition-colors" title="Share Link">
                                        <Share2 size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Specs & Description */}
                        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl p-8">
                             <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Build Specifications</h2>
                             
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                                <div className="p-4 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-gray-200 dark:border-zinc-800 flex items-center gap-4">
                                    <div className="p-3 bg-zinc-200 dark:bg-zinc-800 rounded-lg text-zinc-500"><Cpu size={20}/></div>
                                    <div className="min-w-0"><p className="text-xs text-zinc-500 font-bold uppercase">CPU</p><p className="font-bold text-gray-900 dark:text-white truncate">{post.partsSummary.cpu}</p></div>
                                </div>
                                <div className="p-4 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-gray-200 dark:border-zinc-800 flex items-center gap-4">
                                    <div className="p-3 bg-zinc-200 dark:bg-zinc-800 rounded-lg text-zinc-500"><Monitor size={20}/></div>
                                    <div className="min-w-0"><p className="text-xs text-zinc-500 font-bold uppercase">GPU</p><p className="font-bold text-gray-900 dark:text-white truncate">{post.partsSummary.gpu}</p></div>
                                </div>
                                <div className="p-4 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-gray-200 dark:border-zinc-800 flex items-center gap-4">
                                    <div className="p-3 bg-zinc-200 dark:bg-zinc-800 rounded-lg text-zinc-500"><MemoryStick size={20}/></div>
                                    <div className="min-w-0"><p className="text-xs text-zinc-500 font-bold uppercase">RAM</p><p className="font-bold text-gray-900 dark:text-white truncate">{post.partsSummary.ram}</p></div>
                                </div>
                                <div className="p-4 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-gray-200 dark:border-zinc-800 flex items-center gap-4">
                                    <div className="p-3 bg-zinc-200 dark:bg-zinc-800 rounded-lg text-zinc-500"><Box size={20}/></div>
                                    <div className="min-w-0"><p className="text-xs text-zinc-500 font-bold uppercase">Case</p><p className="font-bold text-gray-900 dark:text-white truncate">{post.partsSummary.case}</p></div>
                                </div>
                             </div>

                             <h3 className="font-bold text-gray-900 dark:text-white mb-2">About this Build</h3>
                             <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-zinc-300">
                                 <p className="whitespace-pre-wrap">{post.description}</p>
                             </div>
                        </div>

                        {/* Comments */}
                        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl overflow-hidden flex flex-col min-h-[400px]">
                            <CommentSection 
                                postId={post.id} 
                                comments={comments} 
                                onUpdate={() => setComments(SharedBuildsStore.getComments(post.id))} 
                            />
                        </div>

                    </div>

                    {/* Right Column: Stats & Actions */}
                    <div className="space-y-6">
                        
                        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl p-6 sticky top-24">
                            <div className="text-center mb-6">
                                <p className="text-sm text-zinc-500 uppercase font-bold tracking-widest mb-1">Total Price</p>
                                <p className="text-4xl font-extrabold text-emerald-500">{formatPrice(post.totalPrice, currency)}</p>
                            </div>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-zinc-500">Estimated Power</span>
                                    <span className="font-bold text-gray-900 dark:text-white flex items-center gap-1"><Zap size={14} className="text-amber-500"/> {post.totalWattage}W</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-zinc-500">Compatibility</span>
                                    {post.isVerified ? (
                                        <span className="font-bold text-emerald-500 flex items-center gap-1"><CheckCircle2 size={14}/> Verified</span>
                                    ) : (
                                        <span className="font-bold text-zinc-400 flex items-center gap-1">Unverified</span>
                                    )}
                                </div>
                                {post.checkedAt && (
                                    <div className="text-center pt-1">
                                        <p className="text-[10px] text-zinc-500">Last checked: {new Date(post.checkedAt).toLocaleDateString()}</p>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-3">
                                <button 
                                    onClick={handleCheckBuild}
                                    className="w-full py-3 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-gray-900 dark:text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors border border-gray-200 dark:border-zinc-700"
                                >
                                    <Activity size={18} /> Check Build
                                </button>

                                <button 
                                    onClick={handleRemix}
                                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 active:scale-95 transition-all"
                                >
                                    <Copy size={18} /> Remix / Fork Build
                                </button>
                                
                                <button 
                                    onClick={handleViewInBuilder}
                                    className="w-full py-3 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-gray-900 dark:text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
                                >
                                    <ExternalLink size={18} /> View in Builder
                                </button>
                            </div>

                        </div>

                    </div>

                </div>

            </div>
        </div>
    );
};

export default SharedBuildDetailPage;