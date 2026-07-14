import React from 'react';
import { Menu, Bell, Search } from 'lucide-react';

interface Props {
  title: string;
  subtitle?: string;
  onMenuClick: () => void;
}

const Header: React.FC<Props> = ({ title, subtitle, onMenuClick }) => {
  return (
    <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-stone-200">
      <div className="flex items-center justify-between px-4 lg:px-8 py-4 gap-4">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <button onClick={onMenuClick} className="lg:hidden p-2 rounded-lg hover:bg-stone-100">
            <Menu className="w-5 h-5" />
          </button>
          <div className="min-w-0">
            <h1 className="text-lg sm:text-xl font-bold truncate" style={{ color: '#2D5016' }}>{title}</h1>
            {subtitle && <p className="text-xs sm:text-sm text-stone-500 truncate">{subtitle}</p>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-2 bg-stone-100 rounded-xl px-3 py-2 w-64">
            <Search className="w-4 h-4 text-stone-400" />
            <input placeholder="Search..." className="bg-transparent outline-none text-sm flex-1" />
          </div>
          <button className="relative p-2 rounded-lg hover:bg-stone-100">
            <Bell className="w-5 h-5 text-stone-600" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
