import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { LayoutDashboard, Users, Heart, UserPlus, MessageSquare, Calendar, TrendingUp, Clock, HandHeart, BarChart3, LogOut, X, Settings } from 'lucide-react';
import { LOGO_URL } from '@/data/mockData';


export type ViewKey = 'dashboard' | 'students' | 'parents' | 'leads' | 'communications' | 'calendar' | 'progress' | 'waitlist' | 'volunteers' | 'analytics' | 'settings';

interface Props {
  current: ViewKey;
  onChange: (v: ViewKey) => void;
  open: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<Props> = ({ current, onChange, open, onClose }) => {
  const { currentUser, logout } = useAuth();

  const allItems: { key: ViewKey; label: string; icon: React.ElementType; roles: string[] }[] = [
    { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin', 'teacher', 'staff', 'parent'] },
    { key: 'students', label: 'Students', icon: Users, roles: ['admin', 'teacher', 'staff'] },
    { key: 'parents', label: 'Family Directory', icon: Heart, roles: ['admin', 'staff'] },
    { key: 'leads', label: 'Lead Management', icon: UserPlus, roles: ['admin', 'staff'] },
    { key: 'communications', label: 'Communications', icon: MessageSquare, roles: ['admin', 'staff', 'teacher'] },
    { key: 'calendar', label: 'Calendar & Events', icon: Calendar, roles: ['admin', 'teacher', 'staff', 'parent'] },
    { key: 'progress', label: 'Progress Tracking', icon: TrendingUp, roles: ['admin', 'teacher', 'parent'] },
    { key: 'waitlist', label: 'Waitlist', icon: Clock, roles: ['admin', 'staff'] },
    { key: 'volunteers', label: 'Volunteers', icon: HandHeart, roles: ['admin', 'staff'] },
    { key: 'analytics', label: 'Analytics', icon: BarChart3, roles: ['admin'] },
    { key: 'settings', label: 'Settings', icon: Settings, roles: ['admin'] },
  ];

  const items = allItems.filter((i) => currentUser && i.roles.includes(currentUser.role));

  return (
    <>
      {open && <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={onClose} />}
      <aside className={`fixed lg:sticky top-0 left-0 h-screen w-64 z-40 flex flex-col transition-transform ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
        style={{ background: 'linear-gradient(180deg, #2D5016 0%, #1a3009 100%)' }}>
        <div className="p-5 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="bg-white p-1.5 rounded-xl shadow">
              <img src={LOGO_URL} alt="Palmtrees Montessori" className="w-8 h-8 object-contain" />
            </div>

            <div>
              <div className="font-bold text-white text-sm leading-tight">Palmtrees</div>
              <div className="text-xs text-white/70">Montessori CRM</div>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden text-white/70 hover:text-white"><X className="w-5 h-5" /></button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {items.map((item) => {
            const Icon = item.icon;
            const active = current === item.key;
            return (
              <button key={item.key} onClick={() => { onChange(item.key); onClose(); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${active ? 'bg-white/15 text-white shadow-lg' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}>
                <Icon className="w-4.5 h-4.5" style={{ width: 18, height: 18 }} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="p-3 border-t border-white/10">
          <div className="flex items-center gap-3 p-2 mb-2">
            <img src={currentUser?.avatar} alt="" className="w-9 h-9 rounded-full object-cover ring-2 ring-white/20" />
            <div className="flex-1 min-w-0">
              <div className="text-white text-sm font-medium truncate">{currentUser?.name}</div>
              <div className="text-white/60 text-xs capitalize">{currentUser?.role}</div>
            </div>
          </div>
          <button onClick={logout} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-white/70 hover:bg-white/10 hover:text-white text-sm transition">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
