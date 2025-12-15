import React, { useState, useMemo } from 'react';
import { 
  Search, Monitor, Cpu, Zap, HardDrive, ChevronDown, Check, ZapIcon
} from 'lucide-react';
import { 
  BENCHMARK_GPUS, BENCHMARK_CPUS, BENCHMARK_PSUS, BENCHMARK_SSDS 
} from '../data/benchmarks';
import { 
  BenchmarkCategory, BenchmarkGPU, BenchmarkCPU, BenchmarkPSU, BenchmarkSSD, TierGroup, QualityTier, BenchmarkItem 
} from '../types';

const CATEGORIES: { id: BenchmarkCategory; icon: any; label: string }[] = [
    { id: 'GPU', icon: Monitor, label: 'Graphics' },
    { id: 'CPU', icon: Cpu, label: 'Processor' },
    { id: 'PSU', icon: Zap, label: 'Power Supply' },
    { id: 'SSD', icon: HardDrive, label: 'Storage' },
];

// --- Helpers ---

const getVendorColor = (brand: string) => {
    switch (brand) {
        case 'NVIDIA': return 'text-green-500 bg-green-500/10 border-green-500/20';
        case 'AMD': return 'text-red-500 bg-red-500/10 border-red-500/20';
        case 'Intel': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
        default: return 'text-gray-500 bg-gray-500/10';
    }
};

const QualityBadge = ({ tier }: { tier: QualityTier }) => {
    let colors = "";
    if (tier === 'S') colors = "bg-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)] border-purple-400";
    if (tier === 'A') colors = "bg-emerald-500 text-white shadow-[0_0_10px_rgba(16,185,129,0.3)] border-emerald-400";
    if (tier === 'B') colors = "bg-blue-500 text-white border-blue-400";
    if (tier === 'C') colors = "bg-zinc-600 text-zinc-200 border-zinc-500";
    if (tier === 'D') colors = "bg-red-500 text-white border-red-400";

    return (
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg border-b-4 ${colors}`}>
            {tier}
        </div>
    );
};

// --- Tier Section Component (GPU/CPU) ---

interface TierGroupSectionProps {
    group: TierGroup;
    label: string;
    items: (BenchmarkGPU | BenchmarkCPU)[];
    isOpen: boolean;
    onToggle: () => void;
}

const TierGroupSection: React.FC<TierGroupSectionProps> = ({ 
    group, 
    label, 
    items, 
    isOpen, 
    onToggle 
}) => {
    if (items.length === 0) return null;

    return (
        <div className="mb-4 rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
            {/* Header */}
            <button 
                onClick={onToggle}
                className={`w-full flex items-center justify-between p-4 transition-colors ${isOpen ? 'bg-zinc-800/50' : 'hover:bg-zinc-800/30'}`}
            >
                <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-xl font-bold bg-zinc-950 border border-zinc-800 ${group === 'T1' ? 'text-amber-400 shadow-amber-900/20' : 'text-zinc-400'}`}>
                        {group}
                    </div>
                    <div className="text-left">
                        <h3 className="font-bold text-lg text-white">{label}</h3>
                        <p className="text-xs text-zinc-500">{items.length} Models</p>
                    </div>
                </div>
                <ChevronDown className={`text-zinc-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* List */}
            {isOpen && (
                <div className="divide-y divide-zinc-800/50">
                    {items.map((item) => (
                        <div key={item.id} className="p-4 flex flex-col md:flex-row md:items-center gap-4 hover:bg-zinc-800/30 transition-colors">
                            
                            {/* Identity */}
                            <div className="flex items-center gap-4 md:w-1/3">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${getVendorColor(item.brand)}`}>
                                    {item.brand}
                                </span>
                                <div>
                                    <p className="font-bold text-zinc-200">{item.name}</p>
                                    <p className="text-xs text-zinc-500">
                                        {item.type === 'GPU' ? `${(item as BenchmarkGPU).vram}GB ${(item as BenchmarkGPU).vramType}` : ''}
                                        {item.type === 'CPU' ? `${(item as BenchmarkCPU).cores} Cores / ${(item as BenchmarkCPU).threads} Threads` : ''}
                                    </p>
                                </div>
                            </div>

                            {/* Bar Chart Area */}
                            <div className="flex-1">
                                <div className="flex justify-between items-end mb-1">
                                    <span className="text-xs font-bold text-zinc-500 uppercase">Performance Index</span>
                                    <span className="text-sm font-bold text-indigo-400">{item.percentile}%</span>
                                </div>
                                <div className="h-2.5 w-full bg-zinc-950 rounded-full overflow-hidden">
                                    <div 
                                        className={`h-full rounded-full ${group === 'T1' ? 'bg-gradient-to-r from-indigo-600 to-purple-500' : 'bg-zinc-600'}`}
                                        style={{ width: `${item.percentile}%` }}
                                    ></div>
                                </div>
                            </div>

                            {/* Price */}
                            <div className="md:w-24 text-right">
                                <p className="font-medium text-zinc-300">${item.price}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// --- Ranking Row Component (PSU/SSD) ---

interface RankingRowProps {
    item: BenchmarkPSU | BenchmarkSSD;
    maxScore: number;
}

const RankingRow: React.FC<RankingRowProps> = ({ item, maxScore }) => {
    return (
        <div className="grid grid-cols-12 gap-4 items-center p-4 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-zinc-700 transition-all group">
            
            {/* Rank */}
            <div className="col-span-2 md:col-span-1 flex justify-center">
                <QualityBadge tier={item.qualityTier} />
            </div>

            {/* Identity */}
            <div className="col-span-10 md:col-span-5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-zinc-950 flex items-center justify-center text-[10px] font-bold text-zinc-500 border border-zinc-800 uppercase shrink-0">
                    {item.brand.substring(0,2)}
                </div>
                <div>
                    <h4 className="font-bold text-zinc-200 group-hover:text-white">{item.name}</h4>
                    <p className="text-xs text-zinc-500">${item.price}</p>
                </div>
            </div>

            {/* Key Spec */}
            <div className="col-span-6 md:col-span-2 mt-2 md:mt-0">
                {item.type === 'PSU' && (
                    <div className="flex flex-col">
                        <span className="text-zinc-300 font-medium text-sm">{(item as BenchmarkPSU).wattage}W</span>
                        <span className="text-xs text-zinc-500">{(item as BenchmarkPSU).efficiency}</span>
                    </div>
                )}
                {item.type === 'SSD' && (
                    <div className="flex flex-col">
                         <span className="text-zinc-300 font-medium text-sm">{(item as BenchmarkSSD).interface}</span>
                         <span className="text-xs text-zinc-500">{(item as BenchmarkSSD).readSpeed / 1000} GB/s Read</span>
                    </div>
                )}
            </div>

            {/* Score */}
            <div className="col-span-6 md:col-span-4 mt-2 md:mt-0 flex items-center gap-3">
                <div className="flex-1 h-1.5 bg-zinc-950 rounded-full overflow-hidden">
                    <div 
                        className={`h-full rounded-full ${item.score > 90 ? 'bg-emerald-500' : item.score > 75 ? 'bg-blue-500' : 'bg-zinc-500'}`}
                        style={{ width: `${item.score}%` }}
                    ></div>
                </div>
                <span className="text-sm font-bold text-zinc-400 w-8 text-right">{item.score}</span>
            </div>

        </div>
    );
};


const BenchmarksPage = () => {
  const [activeTab, setActiveTab] = useState<BenchmarkCategory>('GPU');
  const [searchQuery, setSearchQuery] = useState('');
  
  // -- Tier Collapsed State --
  const [openTiers, setOpenTiers] = useState<Record<string, boolean>>({
      'T1': true, 'T2': true, 'T3': true, 'T4': true
  });

  const toggleTier = (t: string) => setOpenTiers(prev => ({ ...prev, [t]: !prev[t] }));

  // -- Filters --
  const [selectedBrand, setSelectedBrand] = useState<string>('All');
  
  // GPU Filters
  const [gpuVramType, setGpuVramType] = useState<string>('All');
  
  // CPU Filters
  const [cpuMemory, setCpuMemory] = useState<string>('All');

  // PSU Filters
  const [psuAtx3, setPsuAtx3] = useState(false);

  // -- Data Processing --
  const processedData = useMemo<BenchmarkItem[]>(() => {
      let data: BenchmarkItem[] = [];
      
      switch(activeTab) {
          case 'GPU': data = [...BENCHMARK_GPUS]; break;
          case 'CPU': data = [...BENCHMARK_CPUS]; break;
          case 'PSU': data = [...BENCHMARK_PSUS]; break;
          case 'SSD': data = [...BENCHMARK_SSDS]; break;
      }

      // Search
      if (searchQuery) {
          data = data.filter(d => d.name.toLowerCase().includes(searchQuery.toLowerCase()));
      }

      // Brand Filter
      if (selectedBrand !== 'All') {
          data = data.filter(d => d.brand === selectedBrand) as BenchmarkItem[];
      }

      // Category Specific Logic
      if (activeTab === 'GPU') {
          if (gpuVramType !== 'All') {
              data = (data as BenchmarkGPU[]).filter(d => d.vramType === gpuVramType);
          }
          // Sort by Percentile Descending
          data.sort((a, b) => (b as BenchmarkGPU).percentile - (a as BenchmarkGPU).percentile);
      } 
      else if (activeTab === 'CPU') {
          if (cpuMemory !== 'All') {
             // Logic: 'DDR5' filter matches 'DDR5' or 'DDR4+DDR5'
             data = (data as BenchmarkCPU[]).filter(d => d.memorySupport.includes(cpuMemory));
          }
           data.sort((a, b) => (b as BenchmarkCPU).percentile - (a as BenchmarkCPU).percentile);
      }
      else if (activeTab === 'PSU') {
          if (psuAtx3) {
              data = (data as BenchmarkPSU[]).filter(d => d.atx3);
          }
          data.sort((a, b) => (b as BenchmarkPSU).score - (a as BenchmarkPSU).score);
      }
      else if (activeTab === 'SSD') {
          data.sort((a, b) => (b as BenchmarkSSD).score - (a as BenchmarkSSD).score);
      }

      return data;
  }, [activeTab, searchQuery, selectedBrand, gpuVramType, cpuMemory, psuAtx3]);


  // -- Grouping for Tier Views --
  const tiers = useMemo(() => {
      if (activeTab !== 'GPU' && activeTab !== 'CPU') return null;
      
      const groups: Record<string, (BenchmarkGPU | BenchmarkCPU)[]> = { T1: [], T2: [], T3: [], T4: [] };
      const labels: Record<string, string> = { T1: '', T2: '', T3: '', T4: '' }; // capture labels from first item

      processedData.forEach((item) => {
          // Double check type safety although processedData logic should ensure it
          if (item.type !== 'GPU' && item.type !== 'CPU') return;
          const tItem = item as BenchmarkGPU | BenchmarkCPU;

          if (groups[tItem.tierGroup]) {
              groups[tItem.tierGroup].push(tItem);
              if (!labels[tItem.tierGroup]) labels[tItem.tierGroup] = tItem.tierLabel;
          }
      });

      return { groups, labels };
  }, [processedData, activeTab]);


  return (
    <div className="flex-1 h-full overflow-y-auto bg-[#09090b] custom-scrollbar text-zinc-100 font-sans">
        
        {/* --- Header --- */}
        <div className="border-b border-zinc-800 bg-zinc-950 px-6 py-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-2">Benchmarks & Rankings</h1>
                <p className="text-zinc-400 mb-8 max-w-2xl">
                    Compare performance across thousands of components. Data aggregated from real-world gaming tests and synthetic benchmarks.
                </p>

                {/* Tabs */}
                <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => {
                                setActiveTab(cat.id);
                                setSelectedBrand('All');
                            }}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all duration-200 ${
                                activeTab === cat.id
                                ? 'bg-indigo-600 text-white shadow-[0_0_20px_rgba(79,70,229,0.3)]'
                                : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white'
                            }`}
                        >
                            <cat.icon size={18} />
                            {cat.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>

        {/* --- Filters Toolbar --- */}
        <div className="sticky top-0 z-30 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800 px-6 py-4">
            <div className="max-w-7xl mx-auto flex flex-col xl:flex-row gap-4 justify-between">
                
                {/* Search */}
                <div className="relative w-full xl:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                    <input 
                        type="text" 
                        placeholder={`Search ${activeTab}s...`}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 focus:border-indigo-500 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none transition-colors"
                    />
                </div>

                {/* Dynamic Filters */}
                <div className="flex flex-wrap gap-3 items-center">
                    
                    {/* Brand Filter */}
                    <div className="flex bg-zinc-900 rounded-lg p-1 border border-zinc-800">
                        {['All', ...(activeTab === 'GPU' ? ['NVIDIA', 'AMD', 'Intel'] : activeTab === 'CPU' ? ['Intel', 'AMD'] : [])].map(b => (
                             (activeTab === 'GPU' || activeTab === 'CPU') && (
                                <button
                                    key={b}
                                    onClick={() => setSelectedBrand(b)}
                                    className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors ${selectedBrand === b ? 'bg-zinc-700 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                                >
                                    {b}
                                </button>
                             )
                        ))}
                    </div>

                    {/* GPU Specific */}
                    {activeTab === 'GPU' && (
                        <select 
                            value={gpuVramType}
                            onChange={(e) => setGpuVramType(e.target.value)}
                            className="bg-zinc-900 border border-zinc-800 text-zinc-300 text-sm rounded-lg px-3 py-2 outline-none"
                        >
                            <option value="All">All VRAM Types</option>
                            <option value="GDDR6X">GDDR6X</option>
                            <option value="GDDR6">GDDR6</option>
                            <option value="GDDR7">GDDR7</option>
                        </select>
                    )}

                    {/* CPU Specific */}
                    {activeTab === 'CPU' && (
                        <select 
                            value={cpuMemory}
                            onChange={(e) => setCpuMemory(e.target.value)}
                            className="bg-zinc-900 border border-zinc-800 text-zinc-300 text-sm rounded-lg px-3 py-2 outline-none"
                        >
                            <option value="All">All Platforms</option>
                            <option value="DDR5">DDR5 Support</option>
                            <option value="DDR4">DDR4 Support</option>
                        </select>
                    )}

                    {/* PSU Specific */}
                    {activeTab === 'PSU' && (
                        <button 
                            onClick={() => setPsuAtx3(!psuAtx3)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-bold transition-all ${psuAtx3 ? 'bg-indigo-500/10 border-indigo-500 text-indigo-400' : 'bg-zinc-900 border-zinc-800 text-zinc-400'}`}
                        >
                            {psuAtx3 && <Check size={14} />} ATX 3.0 Only
                        </button>
                    )}

                </div>
            </div>
        </div>

        {/* --- Content Area --- */}
        <div className="max-w-7xl mx-auto px-6 py-8 pb-24">
            
            {/* VIEW MODE 1: TIER LIST (GPU / CPU) */}
            {(activeTab === 'GPU' || activeTab === 'CPU') && tiers && (
                <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                    {['T1', 'T2', 'T3', 'T4'].map((tierKey) => (
                        <TierGroupSection 
                            key={tierKey}
                            group={tierKey as TierGroup}
                            label={tiers.labels[tierKey] || 'Other'}
                            items={tiers.groups[tierKey]}
                            isOpen={openTiers[tierKey]}
                            onToggle={() => toggleTier(tierKey)}
                        />
                    ))}
                    
                    {Object.values(tiers.groups).every((g: any) => g.length === 0) && (
                         <div className="text-center py-20 text-zinc-500">
                            No benchmarks match your filters.
                         </div>
                    )}
                </div>
            )}

            {/* VIEW MODE 2: RANKING TABLE (PSU / SSD) */}
            {(activeTab === 'PSU' || activeTab === 'SSD') && (
                <div className="space-y-3 animate-in slide-in-from-bottom-4 duration-500">
                    
                    {/* Table Header */}
                    <div className="grid grid-cols-12 gap-4 px-4 pb-2 text-xs font-bold text-zinc-500 uppercase tracking-wider">
                        <div className="col-span-2 md:col-span-1 text-center">Rank</div>
                        <div className="col-span-10 md:col-span-5">Model</div>
                        <div className="col-span-6 md:col-span-2 hidden md:block">Specs</div>
                        <div className="col-span-6 md:col-span-4 hidden md:block text-right">Quality Score</div>
                    </div>

                    {processedData.map((item) => (
                        <RankingRow key={item.id} item={item as BenchmarkPSU | BenchmarkSSD} maxScore={100} />
                    ))}

                    {processedData.length === 0 && (
                        <div className="text-center py-20 text-zinc-500">
                           No benchmarks match your filters.
                        </div>
                    )}
                </div>
            )}

        </div>

    </div>
  );
};

export default BenchmarksPage;