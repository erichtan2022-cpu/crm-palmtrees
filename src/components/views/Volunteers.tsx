import React from 'react';
import { useVolunteers } from '@/hooks/useData';
import { Award, Clock, Calendar } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

const Volunteers: React.FC = () => {
  const { data: volunteers, loading } = useVolunteers();
  if (loading) return <div className="text-center py-12 text-stone-500">Loading…</div>;

  const totalHours = volunteers.reduce((sum, v) => sum + v.hours, 0);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-4">
          <div className="text-xs text-stone-500 font-medium">Active Volunteers</div>
          <div className="text-2xl font-bold mt-1" style={{color:'#2D5016'}}>{volunteers.length}</div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-4">
          <div className="text-xs text-stone-500 font-medium">Total Hours</div>
          <div className="text-2xl font-bold mt-1" style={{color:'#2D5016'}}>{totalHours}</div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-4">
          <div className="text-xs text-stone-500 font-medium">This Month</div>
          <div className="text-2xl font-bold mt-1" style={{color:'#2D5016'}}>42</div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {volunteers.map(v => (
          <div key={v.id} className="bg-white rounded-2xl shadow-sm border border-stone-100 p-5">
            <div className="flex items-start gap-3 mb-3">
              <div className="p-2.5 rounded-xl bg-green-50">
                <Award className="w-5 h-5 text-green-800"/>
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-stone-800">{v.name}</div>
                <div className="text-xs text-stone-500">{v.parent}</div>
              </div>
            </div>
            <div className="flex flex-wrap gap-1 mb-3">
              {v.skills.map(s => <span key={s} className="text-xs bg-stone-100 text-stone-700 px-2 py-0.5 rounded-full">{s}</span>)}
            </div>
            <div className="flex items-center gap-2 text-xs text-stone-600 mb-2">
              <Clock className="w-3.5 h-3.5"/><span className="font-semibold text-stone-800">{v.hours} hours</span> contributed
            </div>
            {v.upcomingEvent && (
              <div className="flex items-center gap-2 text-xs text-green-800 bg-green-50 rounded-lg p-2">
                <Calendar className="w-3.5 h-3.5"/>{v.upcomingEvent}
              </div>
            )}
            <button onClick={()=>toast.success(`Thank you sent to ${v.name}`)} className="w-full mt-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-xs font-medium text-stone-700">Send Thanks</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Volunteers;
