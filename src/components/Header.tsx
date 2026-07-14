import React from 'react';
import { Menu, Bell } from 'lucide-react';
import { useAuth, AppUser } from '@/contexts/AuthContext';

interface Props {
  title: string;
  subtitle?: string;
  onMenuClick: () => void;
  user: AppUser;
}

const Header: React.FC<Props> = ({ title, subtitle, onMenuClick, user }) => {
  const { logout } = useAuth();

  return (
    <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-stone-200">
      <div className="flex items-center justify-between px-4 lg:px-8 py-3 gap-4">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <button onClick={onMenuClick} className="lg:hidden p-2 rounded-lg hover:bg-stone-100">
            <Menu className="w-5 h-5" />
          </button>
          <div className="min-w-0">
            <h1 className="text-lg sm:text-xl font-bold truncate" style={{ color: '#2D5016' }}>{title}</h1>
            {subtitle && <p className="text-xs sm:text-sm text-stone-500 truncate">{subtitle}</p>}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="relative p-2 rounded-lg hover:bg-stone-100">
            <Bell className="w-5 h-5 text-stone-600" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
          </button>
          <div className="flex items-center gap-2 pl-2 border-l border-stone-200">
            <img
              src={user.avatar || `https://i.pravatar.cc/150?u=${encodeURIComponent(user.email)}`}
              alt={user.name}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-stone-200"
            />
            <div className="hidden sm:block leading-tight">
              <div className="text-sm font-semibold text-stone-800 max-w-[120px] truncate">{user.name}</div>
              <div className="text-xs text-stone-500 capitalize">{user.role}</div>
            </div>
            <button
              onClick={logout}
              className="ml-1 text-xs text-stone-500 hover:text-red-600 transition px-2 py-1 rounded-lg hover:bg-red-50"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
