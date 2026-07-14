import React, { useState } from 'react';
import { useEvents, addEvent } from '@/hooks/useData';
import { Event } from '@/data/mockData';
import { ChevronLeft, ChevronRight, Plus, Bell, X } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

const TYPE_COLORS: Record<string, string> = {
  school: '#4A7C2F',
  class: '#D2A679',
  conference: '#8B4513',
  holiday: '#dc2626',
};

const CalendarView: React.FC = () => {
  const { data: events, loading, refresh } = useEvents();
  const [month, setMonth] = useState(new Date(2026, 4, 1));
  const [view, setView] = useState<'month'|'list'>('month');
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ title: '', date: '', time: '', type: 'school' as Event['type'], classroom: '', description: '' });

  const year = month.getFullYear();
  const m = month.getMonth();
  const firstDay = new Date(year, m, 1).getDay();
  const daysInMonth = new Date(year, m + 1, 0).getDate();
  const monthName = month.toLocaleDateString('en', { month: 'long', year: 'numeric' });

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const eventsByDay = (d: number) => events.filter(e => {
    const ed = new Date(e.date);
    return ed.getFullYear() === year && ed.getMonth() === m && ed.getDate() === d;
  });

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await addEvent({
      title: form.title, date: form.date, time: form.time, type: form.type,
      classroom: form.classroom || undefined, description: form.description,
    });
    toast.success('Event saved to database!');
    setShowAdd(false);
    setForm({ title: '', date: '', time: '', type: 'school', classroom: '', description: '' });
    refresh();
  };

  if (loading) return <div className="text-center py-12 text-stone-500">Loading calendar…</div>;

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button onClick={()=>setMonth(new Date(year, m-1, 1))} className="p-2 rounded-lg hover:bg-stone-100"><ChevronLeft className="w-4 h-4"/></button>
          <div className="font-bold text-lg" style={{color:'#2D5016'}}>{monthName}</div>
          <button onClick={()=>setMonth(new Date(year, m+1, 1))} className="p-2 rounded-lg hover:bg-stone-100"><ChevronRight className="w-4 h-4"/></button>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-stone-100 rounded-xl p-1 flex">
            <button onClick={()=>setView('month')} className={`px-3 py-1.5 text-sm rounded-lg font-medium ${view==='month'?'bg-white shadow':'text-stone-600'}`}>Month</button>
            <button onClick={()=>setView('list')} className={`px-3 py-1.5 text-sm rounded-lg font-medium ${view==='list'?'bg-white shadow':'text-stone-600'}`}>List</button>
          </div>
          <button onClick={()=>toast.success('Google Calendar sync started')} className="px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-sm font-medium text-stone-700">Sync Google</button>
          <button onClick={()=>setShowAdd(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium" style={{background:'#4A7C2F'}}>
            <Plus className="w-4 h-4"/>Event
          </button>
        </div>
      </div>

      {view === 'month' ? (
        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
          <div className="grid grid-cols-7 bg-stone-50 border-b border-stone-100">
            {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
              <div key={d} className="p-3 text-xs font-bold text-stone-600 text-center">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {cells.map((d, i) => {
              const dayEvents = d ? eventsByDay(d) : [];
              const isToday = d === new Date().getDate() && m === new Date().getMonth() && year === new Date().getFullYear();
              return (
                <div key={i} className={`min-h-[80px] sm:min-h-[100px] p-2 border-b border-r border-stone-100 ${!d?'bg-stone-50/50':''}`}>
                  {d && (
                    <>
                      <div className={`text-xs font-semibold mb-1 ${isToday?'bg-green-800 text-white w-6 h-6 rounded-full flex items-center justify-center':'text-stone-600'}`}>{d}</div>
                      <div className="space-y-1">
                        {dayEvents.slice(0,2).map(e => (
                          <div key={e.id} className="text-[10px] sm:text-xs px-1.5 py-0.5 rounded truncate font-medium text-white" style={{background: TYPE_COLORS[e.type]}}>{e.title}</div>
                        ))}
                        {dayEvents.length>2 && <div className="text-[10px] text-stone-500">+{dayEvents.length-2} more</div>}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {events.map(e => (
            <div key={e.id} className="bg-white rounded-2xl shadow-sm border border-stone-100 p-4 flex items-center gap-4">
              <div className="text-center bg-stone-50 rounded-xl p-3 min-w-[60px]">
                <div className="text-xs text-stone-500 uppercase">{new Date(e.date).toLocaleDateString('en',{month:'short'})}</div>
                <div className="text-xl font-bold" style={{color:'#2D5016'}}>{new Date(e.date).getDate()}</div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-medium text-white uppercase" style={{background: TYPE_COLORS[e.type]}}>{e.type}</span>
                  {e.classroom && <span className="text-xs text-stone-500">{e.classroom}</span>}
                </div>
                <div className="font-bold text-stone-800">{e.title}</div>
                <div className="text-sm text-stone-600">{e.time} · {e.description}</div>
              </div>
              <button onClick={()=>toast.success('Reminder set!')} className="p-2 rounded-xl hover:bg-stone-100"><Bell className="w-4 h-4 text-stone-600"/></button>
            </div>
          ))}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-4">
        <div className="text-xs font-medium text-stone-600 mb-2">Event Types</div>
        <div className="flex flex-wrap gap-3">
          {Object.entries(TYPE_COLORS).map(([k,v]) => (
            <div key={k} className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 rounded" style={{background:v}}/>
              <span className="capitalize text-stone-700">{k}</span>
            </div>
          ))}
        </div>
      </div>

      {showAdd && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={()=>setShowAdd(false)}>
          <div className="bg-white rounded-2xl p-6 max-w-md w-full" onClick={(e)=>e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold" style={{color:'#2D5016'}}>New Event</h3>
              <button onClick={()=>setShowAdd(false)}><X className="w-5 h-5"/></button>
            </div>
            <form onSubmit={handleAdd} className="space-y-3">
              <input required value={form.title} onChange={(e)=>setForm({...form,title:e.target.value})} placeholder="Title" className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm"/>
              <div className="grid grid-cols-2 gap-3">
                <input required type="date" value={form.date} onChange={(e)=>setForm({...form,date:e.target.value})} className="px-4 py-2.5 rounded-xl border border-stone-200 text-sm"/>
                <input required type="time" value={form.time} onChange={(e)=>setForm({...form,time:e.target.value})} className="px-4 py-2.5 rounded-xl border border-stone-200 text-sm"/>
              </div>
              <select value={form.type} onChange={(e)=>setForm({...form,type:e.target.value as Event['type']})} className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm">
                <option value="school">School-wide</option><option value="class">Class</option><option value="conference">Conference</option><option value="holiday">Holiday</option>
              </select>
              <textarea value={form.description} onChange={(e)=>setForm({...form,description:e.target.value})} placeholder="Description" rows={2} className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm"/>
              <button type="submit" className="w-full py-2.5 rounded-xl text-white font-medium" style={{background:'#4A7C2F'}}>Create Event</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarView;
