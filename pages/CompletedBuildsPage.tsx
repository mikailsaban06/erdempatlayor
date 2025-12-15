import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Filter, PlusCircle, CheckCircle2, AlertTriangle, 
  Trash2, Copy, Edit, Link as LinkIcon, Monitor, Cpu, Zap, HardDrive, Share2
} from 'lucide-react';
import { SavedBuild, Currency, BuildStats, PartCategory, BuildState, Part } from '../types';
import { formatPrice } from '../utils/currency';
import ShareBuildModal from '../components/ShareBuildModal';

interface CompletedBuildsPageProps {
  savedBuilds: SavedBuild[];
  onLoad: (build: SavedBuild) => void;
  onDelete: (id: string) => void;
  onClone: (build: SavedBuild) => void;
  currency: Currency;
}

// Calculate basic stats for a build locally
const getBuildStats = (build: SavedBuild): BuildStats => {
    const parts = Object.values(build.parts).filter(p => p !== null);
    const totalPrice = parts.reduce((acc, p) => acc + (Number(p?.price) || 0), 0);
    const totalWattage = parts.reduce((acc, p) => acc + (Number(p?.wattage) || 0), 0);
    
    let compatible = true;
    const warnings: string[] = [];
    return { totalPrice, totalWattage, compatible, warnings };
};

const BuildCard: React.FC<{ 
    build: SavedBuild;
    onLoad: (b: SavedBuild) => void;
    onDelete: (id: string) => void;
    onClone: (b: SavedBuild) => void;
    onShare: (b: SavedBuild) => void;
    currency: Currency;
}> = ({ 
    build, 
    onLoad, 
    onDelete, 
    onClone, 
    onShare,
    currency 
}) => {
    const stats = getBuildStats(build);
    const cpu = build.parts[PartCategory.CPU];
    const gpu = build.parts[PartCategory.GPU];
    const date = new Date(build.updatedAt).toLocaleDateString();

    return (
        <div className="group bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 flex flex-col">
            
            {/* Thumbnail */}
            <div className="relative aspect-video bg-gray-100 dark:bg-zinc-950 overflow-hidden border-b border-gray-200 dark:border-zinc-800">
                {build.thumbnail ? (
                    <img src={build.thumbnail} alt={build.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 dark:text-zinc-600">
                        <Monitor size={48} className="mb-2 opacity-50" />
                        <span className="text-xs font-bold uppercase tracking-wider">No Preview</span>
                    </div>
                )}
                
                {/* Overlay Actions */}
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
                    <button 
                        onClick={() => onLoad(build)}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all duration-300"
                    >
                        Open Build
                    </button>
                </div>
                
                {/* Badge */}
                <div className="absolute top-3 left-3 flex gap-2">
                     <div className="bg-black/70 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1">
                        <CheckCircle2 size={10} className="text-emerald-400" /> Compatible
                     </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-1" title={build.name}>{build.name}</h3>
                    <span className="text-xs text-gray-500 dark:text-zinc-500 whitespace-nowrap">{date}</span>
                </div>

                {/* Specs Summary */}
                <div className="space-y-2 mb-4 flex-1">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-zinc-400">
                        <Cpu size={14} className="text-gray-400" />
                        <span className="truncate">{cpu ? cpu.name : 'No CPU'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-zinc-400">
                        <Monitor size={14} className="text-gray-400" />
                        <span className="truncate">{gpu ? gpu.name : 'No GPU'}</span>
                    </div>
                </div>

                {/* Footer Stats */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-zinc-800">
                    <div>
                        <p className="text-xs text-gray-500 uppercase font-bold">Total</p>
                        <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{formatPrice(stats.totalPrice, currency)}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-gray-500 uppercase font-bold">Power</p>
                        <div className="flex items-center gap-1 text-gray-700 dark:text-zinc-300 font-medium">
                            <Zap size={14} className="text-amber-500" /> {stats.totalWattage}W
                        </div>
                    </div>
                </div>
            </div>

            {/* Card Actions Footer */}
            <div className="px-5 py-3 bg-gray-50 dark:bg-zinc-950/50 border-t border-gray-200 dark:border-zinc-800 flex items-center justify-between">
                <button onClick={() => onClone(build)} className="text-gray-500 hover:text-indigo-500 transition-colors p-1" title="Clone">
                    <Copy size={16} />
                </button>
                <button onClick={() => onShare(build)} className="text-gray-500 hover:text-indigo-500 transition-colors p-1" title="Share to Community">
                    <Share2 size={16} />
                </button>
                <div className="h-4 w-px bg-gray-300 dark:bg-zinc-700 mx-2"></div>
                <button onClick={() => onDelete(build.id)} className="text-gray-500 hover:text-red-500 transition-colors p-1" title="Delete">
                    <Trash2 size={16} />
                </button>
            </div>

        </div>
    );
};

const CompletedBuildsPage: React.FC<CompletedBuildsPageProps> = ({ 
    savedBuilds, onLoad, onDelete, onClone, currency 
}) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'newest' | 'price_high' | 'price_low'>('newest');
  
  // Modal State
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [selectedShareId, setSelectedShareId] = useState<string | null>(null);

  const filteredBuilds = useMemo(() => {
    let builds = [...savedBuilds];
    
    if (searchQuery) {
        const q = searchQuery.toLowerCase();
        builds = builds.filter((b: SavedBuild) => 
            b.name.toLowerCase().includes(q) ||
            Object.values(b.parts).some((p) => p?.name.toLowerCase().includes(q))
        );
    }

    builds.sort((a, b) => {
        if (sortOrder === 'newest') {
            const dateA = Number(a.updatedAt) || 0;
            const dateB = Number(b.updatedAt) || 0;
            return dateB - dateA;
        }
        
        const getPrice = (parts: BuildState): number => {
            return Object.values(parts).reduce((acc: number, p: Part | null) => {
                if (!p) return acc;
                return acc + (p.price || 0);
            }, 0);
        };

        const priceA = getPrice(a.parts);
        const priceB = getPrice(b.parts);
        
        if (sortOrder === 'price_high') return priceB - priceA;
        if (sortOrder === 'price_low') return priceA - priceB;
        return 0;
    });

    return builds;
  }, [savedBuilds, searchQuery, sortOrder]);

  const handleLoad = (build: SavedBuild) => {
      onLoad(build);
      navigate('/');
  };

  const handleShareClick = (build: SavedBuild) => {
      setSelectedShareId(build.id);
      setShareModalOpen(true);
  };

  return (
    <div className="flex-1 h-full overflow-y-auto bg-gray-50 dark:bg-[#09090b] custom-scrollbar">
        
        {/* Header */}
        <div className="px-6 py-12 border-b border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                            <HardDrive className="text-indigo-500" />
                            Completed Builds
                        </h1>
                        <p className="text-gray-500 dark:text-zinc-400 mt-2">
                            Manage your saved configurations and share them with the community.
                        </p>
                    </div>
                    <button 
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
                    >
                        <PlusCircle size={20} />
                        Create New Build
                    </button>
                </div>
            </div>
        </div>

        {/* Toolbar */}
        <div className="sticky top-0 z-30 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-gray-200 dark:border-zinc-800 px-6 py-4">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 justify-between md:items-center">
                
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                        type="text"
                        placeholder="Search your builds..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-gray-100 dark:bg-zinc-900 border border-transparent focus:border-indigo-500 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none dark:text-white"
                    />
                </div>

                <div className="flex gap-3">
                    <select 
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value as any)}
                        className="bg-gray-100 dark:bg-zinc-900 border border-transparent rounded-lg px-4 py-2 text-sm text-gray-700 dark:text-zinc-300 outline-none cursor-pointer hover:bg-gray-200 dark:hover:bg-zinc-800"
                    >
                        <option value="newest">Newest First</option>
                        <option value="price_high">Price: High to Low</option>
                        <option value="price_low">Price: Low to High</option>
                    </select>
                </div>
            </div>
        </div>

        {/* Gallery Grid */}
        <div className="max-w-7xl mx-auto px-6 py-8">
            {filteredBuilds.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredBuilds.map(build => (
                        <BuildCard 
                            key={build.id} 
                            build={build} 
                            onLoad={handleLoad} 
                            onDelete={onDelete} 
                            onClone={onClone}
                            onShare={handleShareClick}
                            currency={currency}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-24">
                    <div className="w-20 h-20 bg-gray-100 dark:bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-6">
                        <HardDrive size={32} className="text-gray-400 dark:text-zinc-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No builds found</h3>
                    <p className="text-gray-500 dark:text-zinc-500 mb-6 max-w-sm mx-auto">
                        {searchQuery ? 'Try adjusting your search terms.' : 'You haven\'t saved any builds yet. Start the builder to create your first rig.'}
                    </p>
                    {!searchQuery && (
                        <button 
                            onClick={() => navigate('/')}
                            className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
                        >
                            Go to Builder
                        </button>
                    )}
                </div>
            )}
        </div>

        {/* Share Modal */}
        {shareModalOpen && (
            <ShareBuildModal 
                savedBuilds={savedBuilds}
                onClose={() => setShareModalOpen(false)}
                onPublishSuccess={() => alert('Build shared successfully!')}
                preSelectedBuildId={selectedShareId}
            />
        )}

    </div>
  );
};

export default CompletedBuildsPage;