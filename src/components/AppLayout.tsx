import React, { useState } from 'react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import Login from '@/components/Login';
import Sidebar, { ViewKey } from '@/components/Sidebar';
import Header from '@/components/Header';
import Dashboard from '@/components/views/Dashboard';
import Students from '@/components/views/Students';
import Parents from '@/components/views/Parents';
import Leads from '@/components/views/Leads';
import Communications from '@/components/views/Communications';
import CalendarView from '@/components/views/CalendarView';
import Progress from '@/components/views/Progress';
import Waitlist from '@/components/views/Waitlist';
import Volunteers from '@/components/views/Volunteers';
import Analytics from '@/components/views/Analytics';
import Settings from '@/components/views/Settings';

const TITLES: Record<ViewKey, { title: string; subtitle: string }> = {
  dashboard: { title: 'Dashboard', subtitle: 'Your overview at a glance' },
  students: { title: 'Students', subtitle: 'Profiles, attendance & milestones' },
  parents: { title: 'Family Directory', subtitle: 'All parent & guardian contacts' },
  leads: { title: 'Lead Management', subtitle: 'Track prospective families through enrollment' },
  communications: { title: 'Communication Hub', subtitle: 'Emails, SMS, WhatsApp & newsletters' },
  calendar: { title: 'Calendar & Events', subtitle: 'School-wide events and reminders' },
  progress: { title: 'Montessori Progress', subtitle: 'Developmental milestones & observations' },
  waitlist: { title: 'Waitlist', subtitle: 'Manage families waiting for placement' },
  volunteers: { title: 'Volunteers', subtitle: 'Parent volunteer tracking & engagement' },
  analytics: { title: 'Website Analytics', subtitle: 'Traffic, forms & campaign performance' },
  settings: { title: 'Settings', subtitle: 'System, integrations & data protection' },
};

const Shell: React.FC = () => {
  const { currentUser, loading } = useAuth();
  const [view, setView] = useState<ViewKey>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#faf7f2' }}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-4 border-green-800 border-t-transparent animate-spin" />
          <div className="text-stone-600 text-sm">Loading Palmtrees CRM…</div>
        </div>
      </div>
    );
  }

  if (!currentUser) return <Login />;

  const renderView = () => {
    switch (view) {
      case 'dashboard': return <Dashboard onNav={(v) => setView(v as ViewKey)} />;
      case 'students': return <Students />;
      case 'parents': return <Parents />;
      case 'leads': return <Leads />;
      case 'communications': return <Communications />;
      case 'calendar': return <CalendarView />;
      case 'progress': return <Progress />;
      case 'waitlist': return <Waitlist />;
      case 'volunteers': return <Volunteers />;
      case 'analytics': return <Analytics />;
      case 'settings': return <Settings />;
      default: return <Dashboard onNav={(v) => setView(v as ViewKey)} />;
    }
  };

  const meta = TITLES[view];

  return (
    <div className="min-h-screen flex" style={{ background: '#faf7f2' }}>
      <Sidebar current={view} onChange={setView} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 min-w-0 flex flex-col">
        <Header
          title={meta.title}
          subtitle={meta.subtitle}
          onMenuClick={() => setSidebarOpen(true)}
          user={currentUser}
        />
        <main className="flex-1 p-4 lg:p-8 max-w-[1400px] w-full mx-auto">
          {renderView()}
        </main>
      </div>
    </div>
  );
};

const AppLayout: React.FC = () => {
  return (
    <AuthProvider>
      <Shell />
    </AuthProvider>
  );
};

export default AppLayout;
