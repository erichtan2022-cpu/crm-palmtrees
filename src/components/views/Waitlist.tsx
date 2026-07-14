import React, { useState } from 'react';
import { useWaitlist, updateWaitlist } from '@/hooks/useData';
import { Waitlist as WaitlistType } from '@/data/mockData';
import { ArrowUp, Mail, Check, Plus, X, Pencil, Info } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

const emptyForm = { childName: '', parentName: '', age: '', desiredClass: 'Toddler', priority: 'medium' as 'high'|'medium'|'low', notes: '' };

const Waitlist: React.FC = () => {
  const { data, loading, reorder, removeFromWaitlist, addToWaitlist, refresh } = useWaitlist();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<WaitlistType | null>(null);
  const [form, setForm] = useState(emptyForm);

  const openAdd = () => { setEditing(null); setForm(emptyForm); setShowForm(true); };
  const openEdit = (w: WaitlistType) => {
    setEditing(w);
    setForm({ childName: w.childName, parentName: w.parentName, age: String(w.age), desiredClass: w.desiredClass, priority: w.priority, notes: w.notes });
    setShowForm(true);
  };

  const moveUp = async (idx: number) => {
    if (idx === 0) return;
    const newList = [...data];
    [newList[idx-1], newList[idx]] = [newList[idx], newList[idx-1]];
    await reorder(newList);
    toast.success('Position updated');
  };

  const enroll = async (id: string) => {
    await removeFromWaitlist(id);
    toast.success('Family moved off the waitlist (offer accepted)!');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      childName: form.childName,
      parentName: form.parentName,
      age: parseInt(form.age) || 3,
      desiredClass: form.desiredClass,
      priority: form.priority,
      notes: form.notes,
    };
    if (editing) {
      await updateWaitlist(editing.id, payload);
      await refresh();
      toast.success('Waitlist entry updated!');
    } else {
      await addToWaitlist({ ...payload, joinDate: new Date().toISOString().split('T')[0] });
      toast.success('Added to waitlist!');
    }
    setShowForm(false);
    setEditing(null);
    setForm(emptyForm);
  };

  const inp = "w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm outline-none focus:border-green-700";

  if (loading) return <div className="text-center py-12 text-stone-500">Loading waitlist…</div>;

  return (
    <div className="space-y-5">
      <div className="bg-green-50 border border-green-100 rounded-xl p-4 flex gap-3 text-sm text-green-900">
        <Info className="w-5 h-5 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold">What is the Waitlist?</span> When a classroom is full, families who want a spot are placed in this priority queue.
          You can reorder by position, edit each entry's details, notify families, and when a spot opens, click the check icon to move them off the list.
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-5">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div>
            <h3 className="font-bold text-stone-800">Waitlist Queue</h3>
            <p className="text-sm text-stone-500">{data.length} families waiting for placement</p>
          </div>
          <div className="flex gap-2">
            <button onClick={()=>toast.success('Waitlist update email sent to all families')} className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-sm font-medium text-stone-700">Notify All</button>
            <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium" style={{background:'#4A7C2F'}}>
              <Plus className="w-4 h-4"/>Add Family
            </button>
          </div>
        </div>

        <div className="space-y-2">
          {data.map((w, idx) => (
            <div key={w.id} className="flex items-center gap-3 p-4 rounded-xl border border-stone-100 hover:bg-stone-50">
              <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0" style={{background:'#f5e6d3', color:'#2D5016'}}>#{idx+1}</div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-stone-800">{w.childName}</div>
                <div className="text-xs text-stone-500">{w.parentName} · Age {w.age} · {w.desiredClass}</div>
                {w.notes && <div className="text-xs text-stone-600 mt-0.5">{w.notes}</div>}
              </div>
              <span className={`text-xs px-2 py-1 rounded-full font-medium hidden sm:inline ${w.priority==='high'?'bg-red-100 text-red-800':w.priority==='medium'?'bg-amber-100 text-amber-800':'bg-stone-100 text-stone-700'}`}>{w.priority}</span>
              <div className="text-xs text-stone-500 hidden md:block">Joined {w.joinDate}</div>
              <div className="flex gap-1">
                <button onClick={()=>moveUp(idx)} className="p-2 rounded-lg hover:bg-stone-100" title="Move up"><ArrowUp className="w-4 h-4 text-stone-600"/></button>
                <button onClick={()=>openEdit(w)} className="p-2 rounded-lg hover:bg-stone-100" title="Edit"><Pencil className="w-4 h-4 text-stone-600"/></button>
                <button onClick={()=>toast.success(`Email sent to ${w.parentName}`)} className="p-2 rounded-lg hover:bg-stone-100" title="Email"><Mail className="w-4 h-4 text-stone-600"/></button>
                <button onClick={()=>enroll(w.id)} className="p-2 rounded-lg text-white" style={{background:'#4A7C2F'}} title="Offer spot / remove"><Check className="w-4 h-4"/></button>
              </div>
            </div>
          ))}
          {data.length === 0 && <div className="text-center py-8 text-stone-500 text-sm">No families on the waitlist</div>}
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={()=>setShowForm(false)}>
          <div className="bg-white rounded-2xl p-6 max-w-md w-full" onClick={(e)=>e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold" style={{color:'#2D5016'}}>{editing ? 'Edit Waitlist Entry' : 'Add to Waitlist'}</h3>
              <button onClick={()=>setShowForm(false)}><X className="w-5 h-5"/></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input required value={form.childName} onChange={(e)=>setForm({...form,childName:e.target.value})} placeholder="Child name" className={inp}/>
              <input required value={form.parentName} onChange={(e)=>setForm({...form,parentName:e.target.value})} placeholder="Parent name" className={inp}/>
              <div className="grid grid-cols-2 gap-3">
                <input required type="number" value={form.age} onChange={(e)=>setForm({...form,age:e.target.value})} placeholder="Age" className={inp}/>
                <select value={form.desiredClass} onChange={(e)=>setForm({...form,desiredClass:e.target.value})} className={inp}>
                  <option>Toddler</option><option>Primary</option><option>Lower Elementary</option><option>Upper Elementary</option>
                </select>
              </div>
              <select value={form.priority} onChange={(e)=>setForm({...form,priority:e.target.value as any})} className={inp}>
                <option value="high">High priority</option><option value="medium">Medium priority</option><option value="low">Low priority</option>
              </select>
              <textarea value={form.notes} onChange={(e)=>setForm({...form,notes:e.target.value})} placeholder="Notes (e.g. sibling already enrolled, preferred start date)" rows={2} className={inp}/>
              <button type="submit" className="w-full py-2.5 rounded-xl text-white font-medium" style={{background:'#4A7C2F'}}>{editing ? 'Save Changes' : 'Add to Waitlist'}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Waitlist;
