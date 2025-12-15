import React, { useState, useMemo, useEffect } from 'react';
import { Search, Filter, ArrowUp, ArrowDown, ChevronDown, ChevronUp, Bell, CheckCircle2 } from 'lucide-react';
import { UpdateItem, UpdateType } from '../types';
import { UPDATES_DATA } from '../data/updates';

const UpdatesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<UpdateType | 'all'>('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [readUpdates, setReadUpdates] = useState<string[]>(() => {
      try {
          return JSON.parse(localStorage.getItem('rigbuilder_read_updates') || '[]');
      } catch { return []; }
  });

  // Mark all currently visible as read on mount (simple "seen" logic)
  useEffect(() => {
      const ids = UPDATES_DATA.map(u => u.id);
      const uniqueRead = Array.from(new Set([...readUpdates, ...ids]));
      localStorage.setItem('rigbuilder_read_updates', JSON.stringify(uniqueRead));
      
      // Dispatch event to update sidebar badge
      window.dispatchEvent(new Event('updates-read'));
  }, []);

  const filteredUpdates = useMemo(() => {
    let data = [...UPDATES_DATA];

    if (filterType !== 'all') {
        data = data.filter(u => u.type === filterType);
    }

    if (searchQuery) {
        const q = searchQuery.toLowerCase();
        data = data.filter(u => 
            u.title.toLowerCase().includes(q) || 
            u.summary.toLowerCase().includes(q)
        );
    }

    data.sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

    return data;
  }, [searchQuery, filterType, sortOrder]);

  const toggleExpand = (id: string) => {
      setExpandedId(expandedId === id ? null : id);
  };

  const getTypeColor = (type: UpdateType) => {
      switch(type) {
          case 'feature': return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
          case 'fix': return 'bg-red-500/10 text-red-400 border-red-500/20';
          case 'performance': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
          case 'content': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
          case 'ui': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
          default: return 'bg-zinc-800 text-zinc-400';
      }
  };

  const formatDate = (dateStr: string) => {
      return new Date(dateStr).toLocaleDateString('en-US', {
          month: 'short', day: 'numeric', year: 'numeric'
      });
  };

  return (
    <div className="flex-1 h-full overflow-y-auto bg-gray-50 dark:bg-[#09090b] custom-scrollbar">
       
       <div className="max-w-4xl mx-auto px-6 py-12">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                        <Bell className="text-indigo-500" />
                        Updates & Changelog
                    </h1>
                    <p className="text-gray-500 dark:text-zinc-400 mt-2">
                        Stay up to date with the latest features, improvements, and content drops.
                    </p>
                </div>
            </div>

            {/* Controls */}
            <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-4 mb-8 flex flex-col lg:flex-row gap-4 shadow-sm">
                
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                        type="text"
                        placeholder="Search updates..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-1 focus:ring-indigo-500 outline-none text-gray-900 dark:text-white"
                    />
                </div>

                <div className="flex gap-4 overflow-x-auto pb-1 lg:pb-0">
                    <select 
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value as any)}
                        className="bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-lg px-4 py-2 text-sm text-gray-700 dark:text-zinc-300 outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                    >
                        <option value="all">All Types</option>
                        <option value="feature">New Features</option>
                        <option value="content">Content</option>
                        <option value="performance">Performance</option>
                        <option value="ui">UI / UX</option>
                        <option value="fix">Bug Fixes</option>
                    </select>

                    <button 
                        onClick={() => setSortOrder(prev => prev === 'newest' ? 'oldest' : 'newest')}
                        className="flex items-center gap-2 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-lg px-4 py-2 text-sm text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                    >
                        {sortOrder === 'newest' ? <ArrowDown size={14} /> : <ArrowUp size={14} />}
                        {sortOrder === 'newest' ? 'Newest' : 'Oldest'}
                    </button>
                </div>
            </div>

            {/* Feed */}
            <div className="space-y-6">
                {filteredUpdates.map((update, index) => (
                    <div 
                        key={update.id}
                        className="group bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl overflow-hidden hover:border-indigo-500/30 transition-all duration-300 shadow-sm hover:shadow-lg hover:shadow-indigo-500/5"
                    >
                        <div 
                            className="p-6 cursor-pointer"
                            onClick={() => toggleExpand(update.id)}
                        >
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${getTypeColor(update.type)}`}>
                                            {update.type}
                                        </span>
                                        <span className="text-xs text-gray-400 dark:text-zinc-500 font-mono">
                                            {formatDate(update.date)}
                                        </span>
                                        {update.version && (
                                            <span className="text-xs text-indigo-600 dark:text-indigo-400 font-mono bg-indigo-50 dark:bg-indigo-900/20 px-1.5 py-0.5 rounded">
                                                {update.version}
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                        {update.title}
                                    </h3>
                                    <p className="text-gray-600 dark:text-zinc-400 text-sm leading-relaxed">
                                        {update.summary}
                                    </p>
                                </div>
                                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 dark:bg-zinc-800 text-gray-400 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/20 group-hover:text-indigo-500 transition-colors shrink-0">
                                    {expandedId === update.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                </div>
                            </div>
                        </div>

                        {/* Expanded Content */}
                        {expandedId === update.id && (
                            <div className="px-6 pb-6 pt-0 animate-in slide-in-from-top-2 fade-in duration-200">
                                <div className="border-t border-gray-100 dark:border-zinc-800 pt-4">
                                    <div 
                                        className="prose prose-sm dark:prose-invert max-w-none text-gray-600 dark:text-zinc-300"
                                        dangerouslySetInnerHTML={{ __html: update.description }}
                                    />
                                    <div className="mt-6 flex justify-end">
                                        <button className="text-xs text-emerald-600 dark:text-emerald-500 flex items-center gap-1 font-medium bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1.5 rounded-full">
                                            <CheckCircle2 size={12} /> Read
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}

                {filteredUpdates.length === 0 && (
                    <div className="text-center py-12">
                         <div className="w-16 h-16 bg-gray-100 dark:bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Filter className="text-gray-400" />
                         </div>
                         <h3 className="text-gray-900 dark:text-white font-bold">No updates found</h3>
                         <p className="text-gray-500 dark:text-zinc-500 text-sm">Try adjusting your search or filters.</p>
                    </div>
                )}
            </div>
       </div>

    </div>
  );
};

export default UpdatesPage;