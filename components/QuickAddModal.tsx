import React, { useState, useMemo } from 'react';
import { Part, PartCategory, BuildState, Currency } from '../types';
import { MOCK_PARTS, CATEGORY_FILTERS } from '../constants';
import { formatPrice } from '../utils/currency';
import { X, Search, Check, Box, ChevronDown, SlidersHorizontal, AlertCircle } from 'lucide-react';

interface QuickAddModalProps {
  category: PartCategory;
  onClose: () => void;
  onAddPart: (part: Part) => void;
  currentPartId?: string;
  currentBuild: BuildState; 
  currency: Currency;
}

const ProductImagePlaceholder = ({ name }: { name: string }) => {
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const hues = ['from-blue-600 to-indigo-900', 'from-purple-600 to-pink-900', 'from-emerald-600 to-teal-900', 'from-orange-600 to-red-900'];
  const bgClass = hues[hash % hues.length];

  return (
    <div className={`w-full aspect-[4/3] rounded-t-xl bg-gradient-to-br ${bgClass} flex items-center justify-center p-4 relative overflow-hidden group-hover:scale-105 transition-transform duration-500`}>
       <div className="absolute inset-0 bg-black/10"></div>
       <span className="text-white/30 font-bold text-2xl uppercase tracking-widest z-10 select-none">{name.substring(0, 3)}</span>
    </div>
  );
};

interface FilterSectionProps {
    title: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
}

const FilterSection: React.FC<FilterSectionProps> = ({ title, children, defaultOpen = true }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    return (
        <div className="border-b border-zinc-800 py-4 last:border-0">
            <button onClick={() => setIsOpen(!isOpen)} className="flex items-center justify-between w-full text-zinc-200 text-xs font-bold uppercase tracking-wider mb-2 hover:text-white transition-colors">
                {title}
                <ChevronDown size={14} className={`transition-transform duration-200 text-zinc-500 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && <div className="space-y-3 mt-3 animate-in slide-in-from-top-1 fade-in duration-200">{children}</div>}
        </div>
    );
};

const QuickAddModal: React.FC<QuickAddModalProps> = ({ category, onClose, onAddPart, currentPartId, currentBuild, currency }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({});
  const [compatibleOnly, setCompatibleOnly] = useState(true);

  // --- Handlers ---
  const updateFilter = (key: string, value: any) => {
    setActiveFilters(prev => {
        const current = prev[key];
        // Toggle logic for arrays (checkboxes)
        if (Array.isArray(current)) {
             if (current.includes(value)) {
                 const newVal = current.filter(v => v !== value);
                 return newVal.length > 0 ? { ...prev, [key]: newVal } : (() => { const { [key]: _, ...rest } = prev; return rest; })();
             } else {
                 return { ...prev, [key]: [...current, value] };
             }
        } else {
            // First selection
            return { ...prev, [key]: [value] };
        }
    });
  };

  const updateRangeFilter = (key: string, value: number) => {
      setActiveFilters(prev => ({ ...prev, [key]: value }));
  }

  // --- Filter & Compatibility Logic ---
  const filteredParts = useMemo(() => {
    let parts = MOCK_PARTS.filter(p => p.category === category);

    // 1. Text Search
    if (searchQuery) {
        const q = searchQuery.toLowerCase();
        parts = parts.filter(p => 
            p.name.toLowerCase().includes(q) || 
            p.manufacturer?.toLowerCase().includes(q)
        );
    }

    // 2. Compatibility Logic
    if (compatibleOnly) {
        // CPU <-> Motherboard (Socket)
        if (category === PartCategory.CPU && currentBuild[PartCategory.MOTHERBOARD]) {
             const socket = currentBuild[PartCategory.MOTHERBOARD]?.specs['Socket'];
             if (socket) parts = parts.filter(p => p.specs['Socket'] === socket);
        }
        if (category === PartCategory.MOTHERBOARD && currentBuild[PartCategory.CPU]) {
             const socket = currentBuild[PartCategory.CPU]?.specs['Socket'];
             if (socket) parts = parts.filter(p => p.specs['Socket'] === socket);
        }

        // RAM <-> Motherboard (Memory Type)
        if (category === PartCategory.RAM && currentBuild[PartCategory.MOTHERBOARD]) {
             const type = currentBuild[PartCategory.MOTHERBOARD]?.specs['Memory Type'];
             if (type) parts = parts.filter(p => p.specs['Memory Type'] === type);
        }

        // Case <-> GPU (Length)
        if (category === PartCategory.CASE && currentBuild[PartCategory.GPU]) {
             const gpuLen = Number(currentBuild[PartCategory.GPU]?.specs['Length'] || 0);
             parts = parts.filter(p => Number(p.specs['Max GPU Length'] || 999) >= gpuLen);
        }
         if (category === PartCategory.GPU && currentBuild[PartCategory.CASE]) {
             const maxLen = Number(currentBuild[PartCategory.CASE]?.specs['Max GPU Length'] || 999);
             parts = parts.filter(p => Number(p.specs['Length'] || 0) <= maxLen);
        }
    }

    // 3. Dynamic Side-Panel Filters
    Object.entries(activeFilters).forEach(([key, filterValue]) => {
        if (key === 'price') {
            parts = parts.filter(p => p.price <= (filterValue as number));
        } else if (Array.isArray(filterValue)) {
            parts = parts.filter(p => {
                const specVal = key === 'manufacturer' ? p.manufacturer : p.specs[key];
                return filterValue.includes(specVal);
            });
        } else if (typeof filterValue === 'number') {
            parts = parts.filter(p => {
                const specVal = Number(p.specs[key]);
                return !isNaN(specVal) && specVal <= filterValue;
            });
        }
    });

    return parts;
  }, [category, searchQuery, activeFilters, compatibleOnly, currentBuild]);

  const filterConfig = CATEGORY_FILTERS[category] || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 md:p-8 animate-in fade-in duration-200">
      <div className="w-full max-w-[90rem] h-full max-h-[90vh] bg-[#09090b] rounded-2xl border border-zinc-800 shadow-2xl overflow-hidden flex flex-col md:flex-row">
        
        {/* --- LEFT: DYNAMIC FILTER SIDEBAR --- */}
        <div className="w-full md:w-80 border-r border-zinc-800 flex flex-col bg-zinc-950/80 flex-shrink-0">
            <div className="p-6 border-b border-zinc-800">
                <div className="flex items-center gap-2 text-zinc-400 mb-1">
                    <SlidersHorizontal size={14} />
                    <span className="text-xs font-bold uppercase tracking-wider">Filters</span>
                </div>
                <h2 className="text-xl font-bold text-white">{filteredParts.length} Products</h2>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-2 custom-scrollbar">
                {filterConfig.map((filter) => (
                    <FilterSection key={filter.id} title={filter.label}>
                        {filter.type === 'range' ? (
                            <div className="space-y-3 px-1">
                                <div className="flex justify-between text-xs text-zinc-400">
                                    <span>{filter.min}{filter.unit}</span>
                                    <span className="text-white font-mono bg-zinc-800 px-1.5 py-0.5 rounded">
                                        {activeFilters[filter.id] || filter.max}{filter.unit}
                                    </span>
                                </div>
                                <input 
                                    type="range"
                                    min={filter.min}
                                    max={filter.max}
                                    step={filter.step}
                                    value={activeFilters[filter.id] || filter.max}
                                    onChange={(e) => updateRangeFilter(filter.id, Number(e.target.value))}
                                    className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-400"
                                />
                            </div>
                        ) : filter.type === 'checkbox' ? (
                            <div className="space-y-2">
                                {filter.options?.map(opt => {
                                    const isChecked = activeFilters[filter.id]?.includes(opt);
                                    return (
                                        <label key={opt} className="flex items-center gap-3 cursor-pointer group select-none">
                                            <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors duration-200 ${isChecked ? 'bg-indigo-600 border-indigo-600' : 'bg-zinc-900/50 border-zinc-700 group-hover:border-zinc-500'}`}>
                                                {isChecked && <Check size={10} className="text-white" />}
                                            </div>
                                            <span className={`text-sm transition-colors ${isChecked ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-300'}`}>{opt}</span>
                                        </label>
                                    );
                                })}
                            </div>
                        ) : null}
                    </FilterSection>
                ))}
            </div>
        </div>

        {/* --- RIGHT: MAIN CONTENT --- */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#0c0c0e]">
            
            {/* Top Toolbar */}
            <div className="p-6 border-b border-zinc-800 flex flex-col xl:flex-row gap-4 justify-between items-center bg-zinc-950/80 backdrop-blur-md sticky top-0 z-10">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                        {category} <span className="text-zinc-600 font-normal text-lg hidden sm:inline">Selection</span>
                    </h1>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto">
                    {/* Compatibility Toggle */}
                    <div 
                        onClick={() => setCompatibleOnly(!compatibleOnly)}
                        className={`flex items-center gap-3 px-4 py-2.5 rounded-lg border cursor-pointer transition-all duration-300 select-none ${compatibleOnly ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-zinc-900 border-zinc-700 opacity-70 hover:opacity-100'}`}
                    >
                         <div className={`w-4 h-4 rounded-full flex items-center justify-center border ${compatibleOnly ? 'bg-emerald-500 border-emerald-500' : 'border-zinc-500'}`}>
                             {compatibleOnly && <Check size={10} className="text-white" />}
                         </div>
                         <span className={`text-sm font-bold ${compatibleOnly ? 'text-emerald-400' : 'text-zinc-400'}`}>Compatible Only</span>
                    </div>

                    {/* Search */}
                    <div className="relative group flex-1 md:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
                        <input 
                            type="text" 
                            placeholder={`Search ${category}...`}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-zinc-600"
                        />
                    </div>

                    <button 
                        onClick={onClose}
                        className="p-2.5 bg-zinc-900 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors border border-zinc-800 hover:border-zinc-700"
                    >
                        <X size={20} />
                    </button>
                </div>
            </div>

            {/* Product Grid */}
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-opacity-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
                    {filteredParts.map((part) => (
                        <div key={part.id} className="group bg-zinc-900/60 backdrop-blur-sm border border-zinc-800/80 rounded-2xl overflow-hidden hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-900/10 hover:-translate-y-1 transition-all duration-300 flex flex-col">
                            
                            {/* Image Area */}
                            <div className="relative">
                                <ProductImagePlaceholder name={part.name} />
                                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md border border-white/10 px-2 py-1 rounded text-[10px] font-bold text-white flex items-center gap-1 shadow-lg">
                                    <Box size={10} className="text-indigo-400" /> 3D Ready
                                </div>
                                {currentPartId === part.id && (
                                    <div className="absolute top-3 right-3 bg-emerald-500 text-white p-1.5 rounded-full shadow-lg animate-in zoom-in">
                                        <Check size={14} strokeWidth={3} />
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="p-5 flex-1 flex flex-col">
                                <div className="flex-1">
                                    <div className="flex justify-between items-start gap-2 mb-3">
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 bg-zinc-950 px-2 py-1 rounded border border-zinc-800">{part.manufacturer}</span>
                                        {part.inStock ? (
                                            <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-1">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> In Stock
                                            </span>
                                        ) : (
                                            <span className="text-[10px] font-bold text-red-500 flex items-center gap-1">
                                                 <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div> Sold Out
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="text-white font-bold text-lg leading-tight mb-3 group-hover:text-indigo-300 transition-colors line-clamp-2">{part.name}</h3>
                                    
                                    {/* Key Specs Grid - Display only relevant specs for the card view */}
                                    <div className="grid grid-cols-2 gap-y-1 gap-x-2 my-2 bg-zinc-950/30 p-2 rounded-lg border border-zinc-800/30">
                                        {part.specs['Socket'] && (
                                            <div className="flex flex-col"><span className="text-[10px] text-zinc-500">Socket</span><span className="text-xs text-zinc-200 font-medium">{part.specs['Socket']}</span></div>
                                        )}
                                        {part.specs['VRAM'] && (
                                            <div className="flex flex-col"><span className="text-[10px] text-zinc-500">VRAM</span><span className="text-xs text-zinc-200 font-medium">{part.specs['VRAM']}GB</span></div>
                                        )}
                                        {part.specs['Speed'] && (
                                             <div className="flex flex-col"><span className="text-[10px] text-zinc-500">Speed</span><span className="text-xs text-zinc-200 font-medium">{part.specs['Speed']} MT/s</span></div>
                                        )}
                                         {part.specs['Wattage'] && (
                                             <div className="flex flex-col"><span className="text-[10px] text-zinc-500">Output</span><span className="text-xs text-zinc-200 font-medium">{part.specs['Wattage']}W</span></div>
                                        )}
                                         {part.specs['Capacity'] && (
                                             <div className="flex flex-col"><span className="text-[10px] text-zinc-500">Capacity</span><span className="text-xs text-zinc-200 font-medium">{part.specs['Capacity']}</span></div>
                                        )}
                                        <div className="flex flex-col">
                                            <span className="text-[10px] text-zinc-500">Power</span>
                                            <span className="text-xs text-zinc-200 font-medium">{part.wattage > 0 ? `${part.wattage}W` : '-'}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4 pt-4 border-t border-zinc-800 flex items-center justify-between">
                                    <span className="text-xl font-bold text-emerald-400 tracking-tight">{formatPrice(part.price, currency)}</span>
                                    <button 
                                        onClick={() => {
                                            onAddPart(part);
                                            onClose();
                                        }}
                                        className="bg-zinc-100 hover:bg-white text-black hover:text-indigo-900 px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-white/5 active:scale-95 flex items-center gap-2"
                                    >
                                        Add <span className="hidden sm:inline">to Build</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    
                    {filteredParts.length === 0 && (
                        <div className="col-span-full py-24 text-center">
                            <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-6 border border-zinc-800">
                                <Search size={32} className="text-zinc-600" />
                            </div>
                            <h3 className="text-zinc-200 font-bold text-xl mb-2">No matching components found</h3>
                            <p className="text-zinc-500 text-sm max-w-xs mx-auto">
                                {compatibleOnly ? 'Try turning off the "Compatible Only" filter to see more results.' : 'Try adjusting your filters or search query.'}
                            </p>
                        </div>
                    )}
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};

export default QuickAddModal;