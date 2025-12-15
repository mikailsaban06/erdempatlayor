import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { 
  Box, 
  ShoppingBag, 
  Tag, 
  Images, 
  BarChart2, 
  Users, 
  CheckCircle, 
  Bell, 
  Cpu,
  Share2,
  LifeBuoy,
  UserCircle
} from 'lucide-react';

interface NavItemProps {
  icon: any;
  label: string;
  to: string;
  badge?: string;
  badgeCount?: number;
}

const NavItem: React.FC<NavItemProps> = ({ icon: Icon, label, to, badge, badgeCount }) => (
  <NavLink 
    to={to}
    className={({ isActive }) => `w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 group
      ${isActive 
        ? 'bg-indigo-50 dark:bg-indigo-600/10 text-indigo-600 dark:text-indigo-400' 
        : 'text-gray-500 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800/50 hover:text-gray-900 dark:hover:text-zinc-200'
      }`}
  >
    {({ isActive }) => (
      <>
        <div className="flex items-center gap-3">
          <Icon size={18} className={isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400 dark:text-zinc-500 group-hover:text-gray-600 dark:group-hover:text-zinc-300'} />
          <span>{label}</span>
        </div>
        <div className="flex items-center gap-2">
          {badge && (
            <span className="text-[10px] font-bold uppercase tracking-wider bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 px-2 py-0.5 rounded-full">
              {badge}
            </span>
          )}
          {badgeCount !== undefined && badgeCount > 0 && (
             <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[10px] font-bold bg-indigo-600 text-white rounded-full">
                {badgeCount}
             </span>
          )}
        </div>
      </>
    )}
  </NavLink>
);

const Sidebar = ({ updatesCount = 0 }: { updatesCount?: number }) => {
  return (
    <div className="flex flex-col h-full w-64 bg-white dark:bg-zinc-950 border-r border-gray-200 dark:border-zinc-800 flex-shrink-0 transition-colors duration-300">
      {/* Logo Area */}
      <Link to="/" className="p-6 flex items-center gap-2 border-b border-gray-100 dark:border-zinc-800/50 h-16 hover:bg-gray-50 dark:hover:bg-zinc-900/50 transition-colors">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Cpu className="text-white" size={20} />
        </div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">RigBuilder<span className="text-indigo-500">3D</span></h1>
      </Link>

      {/* Navigation Scroll Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-6">
        
        {/* Main Section */}
        <div className="space-y-1">
          <NavItem icon={Box} label="3D Builder" to="/builder" />
          <NavItem icon={ShoppingBag} label="Products" to="/products" />
        </div>

        {/* Discovery Section */}
        <div className="space-y-1">
          <div className="px-4 pb-2 text-xs font-semibold text-gray-400 dark:text-zinc-600 uppercase tracking-wider">Discover</div>
          <NavItem icon={Tag} label="Sales" to="/sales" badge="Holiday" />
          <NavItem icon={Images} label="3D Part Gallery" to="/gallery" />
        </div>

        {/* Community Section */}
        <div className="space-y-1">
          <div className="px-4 pb-2 text-xs font-semibold text-gray-400 dark:text-zinc-600 uppercase tracking-wider">Community</div>
          <NavItem icon={BarChart2} label="Benchmarks" to="/benchmarks" />
          <NavItem icon={Users} label="Groups" to="/community" />
          <NavItem icon={Share2} label="Share your build" to="/share" />
          <NavItem icon={CheckCircle} label="Completed Builds" to="/completed-builds" />
          <NavItem icon={Bell} label="Updates" to="/updates" badgeCount={updatesCount} />
          <NavItem icon={LifeBuoy} label="Support" to="/support" />
        </div>

        {/* Personal Section (Optional but good for navigation) */}
        <div className="space-y-1">
             <div className="px-4 pb-2 text-xs font-semibold text-gray-400 dark:text-zinc-600 uppercase tracking-wider">Me</div>
             <NavItem icon={UserCircle} label="My Profile" to="/profile" />
        </div>

      </div>

    </div>
  );
};

export default Sidebar;