import React from 'react';
import { Zap, DollarSign, CheckCircle2, AlertTriangle } from 'lucide-react';
import { BuildStats } from '../types';

interface StatsBarProps {
  stats: BuildStats;
}

const StatsBar: React.FC<StatsBarProps> = ({ stats }) => {
  return (
    <div className="absolute top-0 left-0 right-0 z-10 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/90 dark:bg-zinc-900/80 backdrop-blur-md border border-gray-200 dark:border-zinc-800 rounded-xl shadow-lg p-4 grid grid-cols-1 md:grid-cols-3 gap-4 items-center transition-colors duration-300">
          
          {/* Price */}
          <div className="flex items-center space-x-3 border-b md:border-b-0 md:border-r border-gray-200 dark:border-zinc-700 pb-2 md:pb-0">
            <div className="p-2 bg-green-100 dark:bg-green-500/20 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-zinc-400 uppercase tracking-wider font-semibold">Total Price</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">${stats.totalPrice.toFixed(2)}</p>
            </div>
          </div>

          {/* Wattage */}
          <div className="flex items-center space-x-3 border-b md:border-b-0 md:border-r border-gray-200 dark:border-zinc-700 pb-2 md:pb-0">
            <div className="p-2 bg-blue-100 dark:bg-blue-500/20 rounded-lg">
              <Zap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-zinc-400 uppercase tracking-wider font-semibold">Est. Power</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.totalWattage}W</p>
            </div>
          </div>

          {/* Compatibility */}
          <div className="flex items-center space-x-3">
             <div className={`p-2 rounded-lg ${stats.compatible ? 'bg-emerald-100 dark:bg-emerald-500/20' : 'bg-red-100 dark:bg-red-500/20'}`}>
              {stats.compatible ? (
                 <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              ) : (
                 <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
              )}
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-zinc-400 uppercase tracking-wider font-semibold">Compatibility</p>
              <p className={`text-md font-bold ${stats.compatible ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                {stats.compatible ? 'Compatible' : 'Issues Found'}
              </p>
            </div>
          </div>

        </div>
        
        {/* Warning messages dropdown or inline */}
        {stats.warnings.length > 0 && (
          <div className="mt-2 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/50 rounded-lg p-3">
             {stats.warnings.map((warn, idx) => (
               <p key={idx} className="text-red-600 dark:text-red-400 text-sm flex items-center gap-2">
                 <AlertTriangle size={14} /> {warn}
               </p>
             ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default StatsBar;