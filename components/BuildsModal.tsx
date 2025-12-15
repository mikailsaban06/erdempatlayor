import React from 'react';
import { SavedBuild, Language, Currency } from '../types';
import { formatPrice } from '../utils/currency';
import { X, HardDrive, Calendar, Trash2, Copy, Upload } from 'lucide-react';
import { t } from '../utils/i18n';

interface BuildsModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedBuilds: SavedBuild[];
  currentBuildId: string | null;
  onLoad: (build: SavedBuild) => void;
  onDelete: (id: string) => void;
  onClone: (build: SavedBuild) => void;
  lang: Language; // kept for generic labels if any
  currency: Currency;
}

const BuildsModal: React.FC<BuildsModalProps> = ({ 
  isOpen, onClose, savedBuilds, currentBuildId, 
  onLoad, onDelete, onClone, lang, currency 
}) => {
  if (!isOpen) return null;

  const formatDate = (ts: number) => {
    return new Intl.DateTimeFormat(lang === 'tr' ? 'tr-TR' : 'en-US', {
        dateStyle: 'medium',
        timeStyle: 'short'
    }).format(new Date(ts));
  };

  const getPrice = (build: SavedBuild) => {
    const total = Object.values(build.parts)
        .filter(p => p)
        .reduce((sum, p) => sum + (p?.price || 0), 0);
    return formatPrice(total, currency);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white dark:bg-zinc-950 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-gray-200 dark:border-zinc-800 flex justify-between items-center bg-gray-50 dark:bg-zinc-900/50">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <HardDrive size={20} className="text-indigo-500" />
                {t('savedBuilds', lang)}
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-200 dark:hover:bg-zinc-800 rounded-lg transition-colors">
                <X size={20} className="text-gray-500 dark:text-zinc-400" />
            </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {savedBuilds.length === 0 ? (
                <div className="text-center py-12 text-gray-400 dark:text-zinc-600">
                    <HardDrive size={48} className="mx-auto mb-4 opacity-50" />
                    <p>{t('noBuilds', lang)}</p>
                </div>
            ) : (
                savedBuilds.map(build => (
                    <div 
                        key={build.id}
                        className={`group p-4 rounded-xl border transition-all duration-200 flex items-center justify-between ${
                            currentBuildId === build.id 
                            ? 'bg-indigo-50 dark:bg-indigo-500/10 border-indigo-200 dark:border-indigo-500/30' 
                            : 'bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 hover:border-indigo-300 dark:hover:border-zinc-700'
                        }`}
                    >
                        <div>
                            <h3 className={`font-bold ${currentBuildId === build.id ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-900 dark:text-zinc-200'}`}>
                                {build.name}
                            </h3>
                            <div className="flex items-center gap-4 mt-1 text-xs text-gray-500 dark:text-zinc-500">
                                <span className="flex items-center gap-1">
                                    <Calendar size={12} /> {formatDate(build.updatedAt)}
                                </span>
                                <span className="font-medium text-emerald-600 dark:text-emerald-400">
                                    {getPrice(build)}
                                </span>
                                <span>
                                    {Object.values(build.parts).filter(p => p).length} parts
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                                onClick={() => onLoad(build)}
                                title={t('load', lang)}
                                className="p-2 bg-gray-100 dark:bg-zinc-800 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 text-gray-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-300 rounded-lg transition-colors"
                            >
                                <Upload size={16} />
                            </button>
                            <button 
                                onClick={() => onClone(build)}
                                title={t('clone', lang)}
                                className="p-2 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-600 dark:text-zinc-400 rounded-lg transition-colors"
                            >
                                <Copy size={16} />
                            </button>
                            <button 
                                onClick={() => onDelete(build.id)}
                                title={t('delete', lang)}
                                className="p-2 bg-gray-100 dark:bg-zinc-800 hover:bg-red-100 dark:hover:bg-red-500/20 text-gray-600 dark:text-zinc-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg transition-colors"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>
      </div>
    </div>
  );
};

export default BuildsModal;