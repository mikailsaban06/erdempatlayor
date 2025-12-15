import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Moon, Sun, Monitor, User, ChevronDown, 
  FolderOpen, PlusCircle, Pencil, LogOut, Settings,
  Zap, DollarSign, CheckCircle2, AlertTriangle, Copy, Link as LinkIcon, Share2
} from 'lucide-react';
import { Theme, BuildStats, Currency } from '../types';
import { CURRENCIES, formatPrice, getFlagEmoji } from '../utils/currency';
import PortalDropdown from './PortalDropdown';

interface HeaderProps {
  theme: Theme;
  toggleTheme: () => void;
  currency: Currency;
  setCurrency: (c: Currency) => void;
  buildName: string;
  setBuildName: (name: string) => void;
  onOpenBuilds: () => void;
  onCreateNew: () => void;
  onShareBuild: () => void;
  username?: string;
  stats: BuildStats;
}

const Header: React.FC<HeaderProps> = ({ 
  theme, toggleTheme, currency, setCurrency, 
  buildName, setBuildName, 
  onOpenBuilds, onCreateNew, onShareBuild,
  username = "Demo User",
  stats
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isBuilder = location.pathname === '/builder';

  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);

  // Formatting helpers using selected currency
  const price = formatPrice(stats.totalPrice, currency);
  const power = stats.totalWattage;
  const isCompatible = stats.compatible;

  const getPageTitle = () => {
      switch(location.pathname) {
          case '/': return 'Home';
          case '/updates': return 'Updates & News';
          case '/products': return 'Product Catalog';
          case '/tools': return 'Tools';
          case '/sales': return 'Sales & Deals';
          case '/compare': return 'Compare Parts';
          case '/gallery': return '3D Gallery';
          case '/benchmarks': return 'Performance Benchmarks';
          case '/community': return 'Community Forums';
          case '/completed-builds': return 'Completed Builds';
          case '/profile': return 'My Profile';
          case '/settings': return 'Settings';
          default: 
            if (location.pathname.startsWith('/share')) return 'Community Build';
            if (location.pathname.startsWith('/g/')) return 'Group';
            return 'RigBuilder 3D';
      }
  };

  const handleNameKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
          setIsEditingName(false);
      }
  };

  const handleSignOut = () => {
      // MVP Sign out logic
      localStorage.removeItem('rb_user_token'); // Mock token removal
      setIsProfileOpen(false);
      navigate('/');
      window.location.reload(); // Refresh to reset any auth state if needed
  };

  return (
    <header className="h-auto min-h-[5rem] bg-white dark:bg-zinc-950 border-b border-gray-200 dark:border-zinc-800 flex flex-col xl:flex-row items-center justify-between px-4 lg:px-6 py-3 transition-colors duration-300 z-40 relative shadow-sm gap-4">
      
      {/* LEFT: Context Aware Content */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6 w-full xl:w-auto">
        
        {isBuilder ? (
            <>
                {/* Build Identity */}
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30 text-white shrink-0">
                        <Monitor size={24} />
                    </div>
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2 text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest">
                            <span>Build</span>
                            <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-zinc-700"></span>
                            <span>{username}</span>
                        </div>
                        
                        {isEditingName ? (
                            <input 
                                type="text" 
                                value={buildName} 
                                onChange={(e) => setBuildName(e.target.value)}
                                onBlur={() => setIsEditingName(false)}
                                onKeyDown={handleNameKeyDown}
                                autoFocus
                                className="bg-transparent border-b-2 border-indigo-500 text-xl font-bold text-gray-900 dark:text-white focus:outline-none w-64 mt-0.5"
                            />
                        ) : (
                            <div className="flex items-center gap-2 group cursor-pointer mt-0.5" onClick={() => setIsEditingName(true)}>
                                <h1 className="text-xl font-bold text-gray-900 dark:text-white leading-none truncate max-w-[200px] md:max-w-xs">{buildName}</h1>
                                <Pencil size={14} className="text-gray-400 dark:text-zinc-600 opacity-0 group-hover:opacity-100 transition-all" />
                            </div>
                        )}
                    </div>
                </div>

                {/* Vertical Divider */}
                <div className="hidden md:block w-px h-10 bg-gray-200 dark:bg-zinc-800 mx-2"></div>

                {/* Stats Badges */}
                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20">
                        <DollarSign size={14} className="text-emerald-600 dark:text-emerald-400" />
                        <div className="flex flex-col leading-none">
                            <span className="text-[10px] text-emerald-600/70 dark:text-emerald-400/70 font-bold uppercase">Total</span>
                            <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400">{price}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20">
                        <Zap size={14} className="text-amber-600 dark:text-amber-400 fill-current" />
                        <div className="flex flex-col leading-none">
                            <span className="text-[10px] text-amber-600/70 dark:text-amber-400/70 font-bold uppercase">Power</span>
                            <span className="text-sm font-bold text-amber-700 dark:text-amber-400">{power}W</span>
                        </div>
                    </div>

                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${isCompatible ? 'bg-blue-50 dark:bg-blue-500/10 border-blue-100 dark:border-blue-500/20' : 'bg-red-50 dark:bg-red-500/10 border-red-100 dark:border-red-500/20'}`}>
                        {isCompatible ? <CheckCircle2 size={14} className="text-blue-600 dark:text-blue-400" /> : <AlertTriangle size={14} className="text-red-600 dark:text-red-400" />}
                        <div className="flex flex-col leading-none">
                            <span className={`text-[10px] font-bold uppercase ${isCompatible ? 'text-blue-600/70 dark:text-blue-400/70' : 'text-red-600/70 dark:text-red-400/70'}`}>Status</span>
                            <span className={`text-sm font-bold ${isCompatible ? 'text-blue-700 dark:text-blue-400' : 'text-red-700 dark:text-red-400'}`}>{isCompatible ? 'Compatible' : 'Issues'}</span>
                        </div>
                    </div>
                </div>
            </>
        ) : (
            <div className="flex items-center gap-4">
                 <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">{getPageTitle()}</h1>
            </div>
        )}
      </div>

      {/* RIGHT: Actions & Controls Cluster */}
      <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto justify-end">
        
        {/* Currency Selector */}
        <PortalDropdown
            isOpen={isCurrencyOpen}
            onClose={() => setIsCurrencyOpen(false)}
            align="right"
            trigger={
                <button 
                    onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-600 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-900 border border-transparent hover:border-gray-200 dark:hover:border-zinc-800 transition-all text-xs font-bold"
                >
                    <span className="text-base">{getFlagEmoji(currency.countryCode)}</span>
                    <span>{currency.code}</span>
                    <ChevronDown size={14} className="opacity-50" />
                </button>
            }
        >
            <div className="max-h-64 overflow-y-auto custom-scrollbar py-1">
                {CURRENCIES.map(c => (
                    <button 
                        key={c.code}
                        onClick={() => { setCurrency(c); setIsCurrencyOpen(false); }} 
                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-700 dark:text-zinc-300 flex items-center justify-between"
                    >
                        <span className="flex items-center gap-2">
                             <span className="text-lg">{getFlagEmoji(c.countryCode)}</span> 
                             <span className="font-medium">{c.name}</span>
                        </span>
                        {currency.code === c.code && <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>}
                    </button>
                ))}
            </div>
        </PortalDropdown>

        {/* Theme Toggle */}
        <button 
            onClick={toggleTheme}
            className="p-2 rounded-lg text-gray-500 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-900 border border-transparent hover:border-gray-200 dark:hover:border-zinc-800 transition-all"
        >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Profile */}
        <PortalDropdown
             isOpen={isProfileOpen}
             onClose={() => setIsProfileOpen(false)}
             align="right"
             trigger={
                <button 
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 px-1"
                >
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold ring-2 ring-white dark:ring-zinc-900 shadow-md">
                        {username.substring(0,2).toUpperCase()}
                    </div>
                </button>
             }
        >
            <div className="px-4 py-3 border-b border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/50">
                <p className="text-sm font-bold text-gray-900 dark:text-white">{username}</p>
                <p className="text-xs text-gray-500 dark:text-zinc-500">Pro Member</p>
            </div>
            <button 
                onClick={() => { navigate('/profile'); setIsProfileOpen(false); }}
                className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-700 dark:text-zinc-300 flex items-center gap-3"
            >
                <User size={16} className="text-gray-400" /> Profile
            </button>
            <button 
                onClick={() => { navigate('/settings'); setIsProfileOpen(false); }}
                className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-700 dark:text-zinc-300 flex items-center gap-3"
            >
                <Settings size={16} className="text-gray-400" /> Settings
            </button>
            <div className="border-t border-gray-100 dark:border-zinc-800 my-1"></div>
            <button 
                onClick={handleSignOut}
                className="w-full text-left px-4 py-2.5 text-sm hover:bg-red-50 dark:hover:bg-red-900/10 text-red-600 flex items-center gap-3"
            >
                <LogOut size={16} /> Sign Out
            </button>
        </PortalDropdown>
        
        {isBuilder && (
            <>
                <div className="w-px h-6 bg-gray-200 dark:bg-zinc-800 mx-1 hidden sm:block"></div>

                {/* Main Action Buttons */}
                <button 
                    onClick={onOpenBuilds}
                    className="hidden sm:flex items-center gap-2 px-3 py-2 text-xs font-bold text-gray-600 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-900 rounded-lg transition-colors border border-transparent hover:border-gray-200 dark:hover:border-zinc-800"
                >
                    <FolderOpen size={16} className="text-indigo-500" />
                    My Builds
                </button>
                
                <button 
                    onClick={onCreateNew}
                    className="hidden sm:flex items-center gap-2 px-3 py-2 text-xs font-bold text-gray-600 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-900 rounded-lg transition-colors border border-transparent hover:border-gray-200 dark:hover:border-zinc-800"
                >
                    <PlusCircle size={16} className="text-emerald-500" />
                    Create New
                </button>

                <button 
                    onClick={onShareBuild}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
                >
                    <LinkIcon size={14} />
                    Link
                </button>

                {/* Tools Group */}
                <div className="flex items-center gap-1 bg-gray-100 dark:bg-zinc-900 p-1 rounded-lg border border-gray-200 dark:border-zinc-800 ml-2">
                    <button className="p-1.5 text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white hover:bg-white dark:hover:bg-zinc-800 rounded-md transition-all" title="View 3D">
                        <Monitor size={16} />
                    </button>
                    <button className="p-1.5 text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white hover:bg-white dark:hover:bg-zinc-800 rounded-md transition-all" title="Clone Build">
                        <Copy size={16} />
                    </button>
                    <button className="p-1.5 text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white hover:bg-white dark:hover:bg-zinc-800 rounded-md transition-all" title="Build Settings">
                        <Settings size={16} />
                    </button>
                </div>
            </>
        )}

      </div>
    </header>
  );
};

export default Header;