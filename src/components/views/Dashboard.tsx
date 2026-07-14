import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { analyticsData } from '@/data/mockData';
import { useStudents, useParents, useLeads, useEvents, useMessages, useWaitlist } from '@/hooks/useData';
import { Users, UserPlus, Calendar, MessageSquare, TrendingUp, Heart, Clock, ArrowUpRight, CheckCircle2 } from 'lucide-react';

interface Props { onNav: (v: string) => void }

const StatCard: React.FC<{ icon: React.ElementType; label: string; value: string | number; trend?: string; color: string; onClick?: () => void }> = ({ icon: Icon, label, value, trend, color, onClick }) => (
  <button onClick={onClick} className="bg-white p-5 rounded-2xl shadow-sm hover:shadow-md transition border border-stone-100 text-left w-full">
    <div className="flex items-start justify-between mb-3">
      <div className="p-2.5 rounded-xl" style={{ background: `${color}20` }}>
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
      {trend && <span className="text-xs text-green-700 bg-green-50 px-2 py-0.5 rounded-full font-medium flex items-center gap-0.5"><ArrowUpRight className="w-3 h-3"/>{trend}</span>}
    </div>
    <div className="text-2xl font-bold text-stone-800">{value}</div>
    <div className="text-sm text-stone-500 mt-0.5">{label}</div>
  </button>
);

const Dashboard: React.FC<Props> = ({ onNav }) => {
  const { currentUser } = useAuth();
  const role = currentUser?.role || 'parent';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  const { data: students, loading: sLoad } = useStudents();
  const { data: parents } = useParents();
  const { data: leads } = useLeads();
  const { data: events } = useEvents();
  const { data: messages } = useMessages();
  const { data: waitlist } = useWaitlist();

  if (sLoad) return <div className="flex items-center justify-center py-20 text-stone-500">Loading dashboard…</div>;

  // PARENT DASHBOARD
  if (role === 'parent') {
    const myKids = students.filter(s => currentUser?.childIds?.includes(s.id));
    return (
      <div className="space-y-6">
        <div className="rounded-3xl p-8 text-white" style={{ background: 'linear-gradient(135deg, #2D5016 0%, #4A7C2F 100%)' }}>
          <div className="text-sm opacity-80 mb-1">{greeting},</div>
          <h2 className="text-3xl font-bold mb-2">{currentUser?.name}</h2>
          <p className="opacity-90">Welcome to your family dashboard. Track {myKids.map(k=>k.name.split(' ')[0]).join(' & ')}'s journey at Palmtrees.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {myKids.map(child => (
            <div key={child.id} className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
              <div className="p-5 flex items-center gap-4">
                <img src={child.photo} alt={child.name} className="w-20 h-20 rounded-2xl object-cover ring-4 ring-green-50" />
                <div className="flex-1">
                  <div className="text-xs text-stone-500 mb-0.5">{child.classroom} Class</div>
                  <h3 className="font-bold text-lg" style={{color:'#2D5016'}}>{child.name}</h3>
                  <div className="text-sm text-stone-600">Age {child.age} · Enrolled {child.enrollmentDate}</div>
                </div>
              </div>
              <div className="px-5 pb-5 grid grid-cols-3 gap-2">
                <div className="bg-green-50 rounded-xl p-3 text-center">
                  <div className="text-xl font-bold text-green-800">{child.milestones.filter(m=>m.status==='mastered').length}</div>
                  <div className="text-xs text-green-700">Mastered</div>
                </div>
                <div className="bg-amber-50 rounded-xl p-3 text-center">
                  <div className="text-xl font-bold text-amber-800">{child.milestones.filter(m=>m.status==='practicing').length}</div>
                  <div className="text-xs text-amber-700">Practicing</div>
                </div>
                <div className="bg-stone-100 rounded-xl p-3 text-center">
                  <div className="text-xl font-bold text-stone-700">{child.attendance.filter(a=>a.status==='present').length}</div>
                  <div className="text-xs text-stone-600">Present (7d)</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-5">
            <h3 className="font-bold text-stone-800 mb-4 flex items-center gap-2"><Calendar className="w-5 h-5" style={{color:'#4A7C2F'}}/>Upcoming Events</h3>
            <div className="space-y-3">
              {events.slice(0,4).map(e => (
                <div key={e.id} className="flex items-center gap-3 p-3 rounded-xl bg-stone-50">
                  <div className="text-center bg-white rounded-lg p-2 min-w-[52px] shadow-sm">
                    <div className="text-xs text-stone-500">{new Date(e.date).toLocaleDateString('en',{month:'short'})}</div>
                    <div className="text-lg font-bold" style={{color:'#2D5016'}}>{new Date(e.date).getDate()}</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-stone-800 text-sm">{e.title}</div>
                    <div className="text-xs text-stone-500">{e.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-5">
            <h3 className="font-bold text-stone-800 mb-4 flex items-center gap-2"><MessageSquare className="w-5 h-5" style={{color:'#4A7C2F'}}/>Recent Messages</h3>
            <div className="space-y-3">
              {messages.slice(0,4).map(m => (
                <div key={m.id} className="p-3 rounded-xl bg-stone-50">
                  <div className="flex justify-between items-start mb-1">
                    <div className="font-medium text-stone-800 text-sm">{m.subject}</div>
                    <span className="text-xs text-stone-500">{m.date}</span>
                  </div>
                  <div className="text-xs text-stone-600 truncate">{m.preview}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ADMIN / STAFF / TEACHER
  const stats = [
    { icon: Users, label: 'Active Students', value: students.length, trend: '+3', color: '#4A7C2F', view: 'students' },
    { icon: Heart, label: 'Families', value: parents.length, trend: '+2', color: '#8B4513', view: 'parents' },
    { icon: UserPlus, label: 'Active Leads', value: leads.filter(l=>l.status!=='Enrolled').length, trend: '+5', color: '#D2A679', view: 'leads' },
    { icon: Clock, label: 'Waitlist', value: waitlist.length, color: '#6B8E23', view: 'waitlist' },
  ];

  const todayAttendance = students.map(s => s.attendance[0]);
  const presentToday = todayAttendance.filter(a => a?.status === 'present').length;
  const attendanceRate = students.length > 0 ? Math.round((presentToday / students.length) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="rounded-3xl p-6 md:p-8 text-white" style={{ background: 'linear-gradient(135deg, #2D5016 0%, #4A7C2F 100%)' }}>
        <div className="text-sm opacity-80 mb-1">{greeting},</div>
        <h2 className="text-2xl md:text-3xl font-bold mb-2">{currentUser?.name}</h2>
        <p className="opacity-90 capitalize">{role} Dashboard · {new Date().toLocaleDateString('en-US',{weekday:'long', month:'long', day:'numeric'})}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => <StatCard key={s.label} {...s} onClick={()=>onNav(s.view)} />)}
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-stone-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-stone-800 flex items-center gap-2"><TrendingUp className="w-5 h-5" style={{color:'#4A7C2F'}}/>Website Visitors (Last 7 Days)</h3>
            <span className="text-xs text-stone-500">{analyticsData.pageViews} page views</span>
          </div>
          <div className="flex items-end gap-2 h-40">
            {analyticsData.visitors.map(d => (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                <div className="text-xs text-stone-600 font-medium">{d.value}</div>
                <div className="w-full rounded-t-lg transition-all hover:opacity-80"
                  style={{ height: `${(d.value/350)*100}%`, background: 'linear-gradient(180deg, #4A7C2F 0%, #2D5016 100%)', minHeight: '8px' }}/>
                <div className="text-xs text-stone-500">{d.day}</div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-stone-100">
            <div><div className="text-xs text-stone-500">Form Submissions</div><div className="font-bold text-stone-800">{analyticsData.formSubmissions}</div></div>
            <div><div className="text-xs text-stone-500">Conversion Rate</div><div className="font-bold text-stone-800">{analyticsData.conversionRate}%</div></div>
            <div><div className="text-xs text-stone-500">Attendance Today</div><div className="font-bold text-stone-800">{attendanceRate}%</div></div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-5">
          <h3 className="font-bold text-stone-800 mb-4">Traffic Sources</h3>
          <div className="space-y-3">
            {analyticsData.sources.map(s => (
              <div key={s.name}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-stone-700">{s.name}</span>
                  <span className="font-medium text-stone-800">{s.value}%</span>
                </div>
                <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${s.value}%`, background: s.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-stone-800 flex items-center gap-2"><UserPlus className="w-5 h-5" style={{color:'#4A7C2F'}}/>Recent Leads</h3>
            <button onClick={()=>onNav('leads')} className="text-xs font-medium text-green-800 hover:underline">View all</button>
          </div>
          <div className="space-y-2">
            {leads.slice(0,5).map(l => (
              <div key={l.id} className="flex items-center justify-between p-3 rounded-xl bg-stone-50 hover:bg-stone-100 transition">
                <div>
                  <div className="font-medium text-stone-800 text-sm">{l.parentName}</div>
                  <div className="text-xs text-stone-500">{l.childName} · Age {l.childAge} · {l.source}</div>
                </div>
                <span className="text-xs px-2 py-1 rounded-full font-medium" style={{
                  background: l.status==='Enrolled'?'#dcfce7':l.status==='Applied'?'#dbeafe':l.status==='Tour Completed'?'#fef3c7':'#f5f5f4',
                  color: l.status==='Enrolled'?'#166534':l.status==='Applied'?'#1e40af':l.status==='Tour Completed'?'#92400e':'#57534e'
                }}>{l.status}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-stone-800 flex items-center gap-2"><Calendar className="w-5 h-5" style={{color:'#4A7C2F'}}/>Upcoming Events</h3>
            <button onClick={()=>onNav('calendar')} className="text-xs font-medium text-green-800 hover:underline">View all</button>
          </div>
          <div className="space-y-2">
            {events.slice(0,5).map(e => (
              <div key={e.id} className="flex items-center gap-3 p-3 rounded-xl bg-stone-50">
                <div className="text-center bg-white rounded-lg p-2 min-w-[48px] shadow-sm">
                  <div className="text-[10px] text-stone-500 uppercase">{new Date(e.date).toLocaleDateString('en',{month:'short'})}</div>
                  <div className="text-base font-bold" style={{color:'#2D5016'}}>{new Date(e.date).getDate()}</div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-stone-800 text-sm truncate">{e.title}</div>
                  <div className="text-xs text-stone-500">{e.time} · {e.type}</div>
                </div>
                <CheckCircle2 className="w-4 h-4 text-green-700"/>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
