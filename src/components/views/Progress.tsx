import React, { useState, useEffect } from 'react';
import { useStudents, addStudentObservation } from '@/hooks/useData';
import { useAuth } from '@/contexts/AuthContext';
import { Download, Camera, FileText } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

const AREAS = ['Practical Life', 'Sensorial', 'Language', 'Mathematics', 'Cultural', 'Social-Emotional'];

const Progress: React.FC = () => {
  const { currentUser } = useAuth();
  const { data: students, loading, refresh } = useStudents();
  let list = students;
  if (currentUser?.role === 'parent') {
    list = students.filter(s => currentUser.childIds?.includes(s.id));
  }
  const [selectedId, setSelectedId] = useState<string>('');
  const [obsText, setObsText] = useState('');
  const [obsArea, setObsArea] = useState('Practical Life');

  useEffect(() => {
    if (!selectedId && list.length > 0) setSelectedId(list[0].id);
  }, [list, selectedId]);

  if (loading) return <div className="text-center py-12 text-stone-500">Loading…</div>;
  const selected = list.find(s => s.id === selectedId);
  if (!selected) return <div className="text-stone-600">No students available.</div>;

  const stats = AREAS.map(area => {
    const inArea = selected.milestones.filter(m => m.area === area);
    const mastered = inArea.filter(m => m.status === 'mastered').length;
    const total = Math.max(inArea.length, 1);
    return { area, percent: Math.round((mastered/total)*100), mastered, total };
  });

  const saveObs = async () => {
    if (!obsText.trim()) return;
    await addStudentObservation(selected.id, {
      date: new Date().toISOString().split('T')[0],
      teacher: currentUser?.name || 'Teacher',
      note: obsText, area: obsArea,
    });
    toast.success('Observation saved!');
    setObsText('');
    refresh();
  };

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-4 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
          <span className="text-sm font-medium text-stone-700">Student:</span>
          <select value={selectedId} onChange={(e)=>setSelectedId(e.target.value)} className="px-3 py-2 rounded-xl border border-stone-200 text-sm flex-1">
            {list.map(s => <option key={s.id} value={s.id}>{s.name} ({s.classroom})</option>)}
          </select>
        </div>
        <button onClick={()=>toast.success('Progress report PDF generated')} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-sm font-medium text-stone-700">
          <Download className="w-4 h-4"/>Generate Report
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-5 flex items-center gap-4">
        <img src={selected.photo} className="w-16 h-16 rounded-2xl object-cover ring-2 ring-green-50"/>
        <div>
          <h2 className="text-xl font-bold" style={{color:'#2D5016'}}>{selected.name}</h2>
          <div className="text-sm text-stone-600">{selected.classroom} · Age {selected.age}</div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map(s => (
          <div key={s.area} className="bg-white rounded-2xl shadow-sm border border-stone-100 p-5">
            <div className="flex justify-between items-center mb-3">
              <div className="font-bold text-stone-800 text-sm">{s.area}</div>
              <div className="text-xs text-stone-500">{s.mastered}/{s.total}</div>
            </div>
            <div className="flex items-end gap-2 mb-2">
              <div className="text-3xl font-bold" style={{color:'#2D5016'}}>{s.percent}%</div>
            </div>
            <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all" style={{width:`${s.percent}%`, background:'linear-gradient(90deg, #4A7C2F, #2D5016)'}}/>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-5">
          <h3 className="font-bold text-stone-800 mb-4">Milestones</h3>
          <div className="space-y-2">
            {selected.milestones.map((m,i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-stone-50">
                <div>
                  <div className="text-xs text-stone-500">{m.area}</div>
                  <div className="text-sm font-medium text-stone-800">{m.skill}</div>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${m.status==='mastered'?'bg-green-100 text-green-800':m.status==='practicing'?'bg-amber-100 text-amber-800':'bg-stone-200 text-stone-700'}`}>{m.status}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-5">
          <h3 className="font-bold text-stone-800 mb-4">Observations</h3>
          <div className="space-y-3 mb-4">
            {selected.observations.map((o,i)=>(
              <div key={i} className="p-3 rounded-xl bg-stone-50">
                <div className="flex justify-between text-xs text-stone-500 mb-2">
                  <span className="font-medium">{o.teacher} · {o.area}</span>
                  <span>{o.date}</span>
                </div>
                <p className="text-sm text-stone-800 leading-relaxed">{o.note}</p>
              </div>
            ))}
            {selected.observations.length === 0 && <div className="text-sm text-stone-500">No observations yet</div>}
          </div>
          {(currentUser?.role === 'teacher' || currentUser?.role === 'admin') && (
            <div className="space-y-2 pt-3 border-t border-stone-100">
              <select value={obsArea} onChange={(e)=>setObsArea(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm">
                {AREAS.map(a => <option key={a}>{a}</option>)}
              </select>
              <textarea value={obsText} onChange={(e)=>setObsText(e.target.value)} rows={3} placeholder="Record your observation…" className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm outline-none focus:border-green-700"/>
              <div className="flex gap-2">
                <button onClick={()=>toast.success('Photo upload coming soon')} className="flex-1 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-sm font-medium text-stone-700 flex items-center justify-center gap-2">
                  <Camera className="w-4 h-4"/>Attach
                </button>
                <button onClick={saveObs} className="flex-1 py-2 rounded-xl text-white text-sm font-medium flex items-center justify-center gap-2" style={{background:'#4A7C2F'}}>
                  <FileText className="w-4 h-4"/>Save
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Progress;
