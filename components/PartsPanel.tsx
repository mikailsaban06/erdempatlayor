import React, { useState } from 'react';
import { Part, PartCategory, BuildState, Currency } from '../types';
import { formatPrice } from '../utils/currency';
import { ChevronDown, Trash2, Cpu, Monitor, Box, Disc, MemoryStick, Fan, Zap, Thermometer, ShoppingCart, Plus } from 'lucide-react';

interface PartsPanelProps {
  currentBuild: BuildState;
  onOpenQuickAdd: (category: PartCategory) => void;
  onRemovePart: (category: PartCategory) => void;
  currency: Currency;
  className?: string;
}

const CategoryIcon = ({ category }: { category: PartCategory }) => {
    switch(category) {
        case PartCategory.CPU: return <Cpu size={20} />;
        case PartCategory.CASE: return <Box size={20} />;
        case PartCategory.GPU: return <Monitor size={20} />;
        case PartCategory.MOTHERBOARD: return <Disc size={20} />;
        case PartCategory.RAM: return <MemoryStick size={20} />;
        case PartCategory.COOLER: return <Thermometer size={20} />;
        case PartCategory.PSU: return <Zap size={20} />;
        case PartCategory.FAN: return <Fan size={20} />;
        default: return <div className="w-4 h-4 rounded-full bg-zinc-700" />;
    }
}

// Helper to generate a consistent gradient "Image" based on name
const ProductImagePlaceholder = ({ name }: { name: string }) => {
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const hues = ['from-blue-600 to-indigo-900', 'from-purple-600 to-pink-900', 'from-emerald-600 to-teal-900', 'from-orange-600 to-red-900'];
  const bgClass = hues[hash % hues.length];

  return (
    <div className={`w-16 h-16 rounded-lg bg-gradient-to-br ${bgClass} flex items-center justify-center shadow-inner flex-shrink-0`}>
       <span className="text-white/20 font-bold text-xs uppercase tracking-widest">{name.substring(0, 3)}</span>
    </div>
  );
};

const PartsPanel: React.FC<PartsPanelProps> = ({ currentBuild, onOpenQuickAdd, onRemovePart, currency, className = '' }) => {
  const [expandedCategory, setExpandedCategory] = useState<PartCategory | null>(PartCategory.CASE);
  const categories = Object.values(PartCategory);

  const toggleCategory = (cat: PartCategory) => {
    setExpandedCategory(expandedCategory === cat ? null : cat);
  };

  return (
    <div className={`flex flex-col h-full bg-white/90 dark:bg-zinc-950/90 backdrop-blur-xl ${className}`}>
      
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-zinc-800 flex-shrink-0 bg-gray-50/50 dark:bg-zinc-900/50">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">System Builder</h2>
        <p className="text-gray-500 dark:text-zinc-500 text-xs mt-1 font-medium">Configure your custom PC components</p>
      </div>

      {/* Categories List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {categories.map((category) => {
          const selectedPart = currentBuild[category];
          const isExpanded = expandedCategory === category;

          return (
            <div key={category} className={`rounded-2xl transition-all duration-300 ${isExpanded ? 'bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700/50 shadow-xl' : 'bg-white dark:bg-zinc-900/40 border border-gray-100 dark:border-zinc-800/50 hover:border-gray-300 dark:hover:border-zinc-700'}`}>
              
              {/* Category Header */}
              <button 
                onClick={() => toggleCategory(category)}
                className="w-full flex items-center justify-between p-4 text-left"
              >
                <div className="flex items-center gap-4">
                    <div className={`p-2.5 rounded-xl transition-colors duration-300 ${selectedPart ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-zinc-400'}`}>
                        <CategoryIcon category={category} />
                    </div>
                    <div>
                        <h3 className={`text-sm font-bold tracking-wide uppercase ${selectedPart ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-700 dark:text-zinc-300'}`}>{category}</h3>
                        {selectedPart ? (
                            <p className="text-xs text-gray-900 dark:text-white mt-0.5 font-medium truncate w-40">{selectedPart.name}</p>
                        ) : (
                            <p className="text-xs text-gray-500 dark:text-zinc-500 mt-0.5">Select a component</p>
                        )}
                    </div>
                </div>
                <div className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                   <ChevronDown size={16} className="text-gray-400 dark:text-zinc-500"/>
                </div>
              </button>

              {/* Selection Area (Cards) */}
              {isExpanded && (
                <div className="border-t border-gray-200 dark:border-zinc-800 p-3 bg-gray-50/50 dark:bg-zinc-950/30">
                    
                    {/* Selected Item Card */}
                    {selectedPart ? (
                         <div className="bg-white dark:bg-zinc-800/40 border border-gray-200 dark:border-zinc-700/50 rounded-xl p-3 flex gap-4 items-center group">
                             <ProductImagePlaceholder name={selectedPart.name} />
                             <div className="flex-1 min-w-0">
                                <p className="text-gray-900 dark:text-white text-sm font-bold leading-tight mb-1">{selectedPart.name}</p>
                                <p className="text-emerald-600 dark:text-emerald-400 text-xs font-bold">{formatPrice(selectedPart.price, currency)}</p>
                             </div>
                             <button 
                                onClick={(e) => { e.stopPropagation(); onRemovePart(category); }}
                                className="p-2 bg-gray-100 dark:bg-zinc-800 hover:bg-red-50 dark:hover:bg-red-500/20 rounded-lg text-gray-400 dark:text-zinc-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                            >
                                <Trash2 size={16} />
                            </button>
                         </div>
                    ) : (
                        /* "Add Part" Button triggering Quick Add Modal */
                        <button
                            onClick={() => onOpenQuickAdd(category)}
                            className="w-full py-4 border-2 border-dashed border-gray-300 dark:border-zinc-700 rounded-xl flex items-center justify-center gap-2 text-gray-500 dark:text-zinc-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-500/50 hover:bg-indigo-50 dark:hover:bg-indigo-500/5 transition-all group"
                        >
                            <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-zinc-800 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-500/20 flex items-center justify-center transition-colors">
                                <Plus size={16} />
                            </div>
                            <span className="font-bold text-sm">Add {category}</span>
                        </button>
                    )}
                    
                    {selectedPart && (
                         <div className="mt-2 text-center">
                            <button 
                                onClick={() => onOpenQuickAdd(category)}
                                className="text-xs text-gray-500 dark:text-zinc-500 hover:text-gray-900 dark:hover:text-white transition-colors underline decoration-gray-400 dark:decoration-zinc-700 underline-offset-4"
                            >
                                Change Selection
                            </button>
                         </div>
                    )}

                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950 text-center">
         <button className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-900/20 active:scale-95">
            <ShoppingCart size={18} />
            Checkout System
         </button>
      </div>

    </div>
  );
};

export default PartsPanel;