import React, { useState, useRef } from 'react';
import { useVolunteers, addVolunteer, updateVolunteer, deleteVolunteer, uploadPhoto } from '@/hooks/useData';
import { Volunteer } from '@/data/mockData';
import { Award, Clock, Calendar, Plus, X, Pencil, Trash2, Camera } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

const emptyForm = { name: '', parent: '', skills: '', hours: 0, upcomingEvent: '', avatar: '' };

const Volunteers: React.FC = () => {
  const { data: volunteers, loading, refresh } = useVolunteers();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Volunteer | null>(null);
  const [form, setForm] = useState(emptyForm);

  const openAdd = () => { setEditing(null); setForm(emptyForm); setShowForm(true); };
  const openEdit = (v: Volunteer) => {
    setEditing(v);
    setForm({ name: v.name, parent: v.parent, skills: v.skills.join(', '), hours: v.hours, upcomingEvent: v.upcomingEvent || '', avatar: v.avatar || '' });
    setShowForm(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete volunteer ${name}?`)) return;
    const ok = await deleteVolunteer(id);
    if (ok) { toast.success('Volunteer removed'); refresh(); }
    else toast.error('Could not delete volunteer');
  };

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

      <div className="flex justify-end">
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium" style={{background:'#4A7C2F'}}>
          <Plus className="w-4 h-4"/>Add Volunteer
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {volunteers.map(v => (
          <div key={v.id} className="bg-white rounded-2xl shadow-sm border border-stone-100 p-5">
            <div className="flex items-start gap-3 mb-3">
              <img src={v.avatar || `https://i.pravatar.cc/150?u=${v.id}`} className="w-12 h-12 rounded-xl object-cover ring-2 ring-stone-100" />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-stone-800 truncate">{v.name}</div>
                    <div className="text-xs text-stone-500">{v.parent}</div>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={()=>openEdit(v)} className="p-1.5 rounded-lg hover:bg-stone-100" title="Edit"><Pencil className="w-3.5 h-3.5 text-stone-500"/></button>
                    <button onClick={()=>handleDelete(v.id, v.name)} className="p-1.5 rounded-lg hover:bg-red-50" title="Delete"><Trash2 className="w-3.5 h-3.5 text-red-600"/></button>
                  </div>
                </div>
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

      {showForm && <VolunteerFormModal editing={editing} form={form} setForm={setForm} onClose={()=>setShowForm(false)} onSaved={refresh} />}
    </div>
  );
};

const VolunteerFormModal: React.FC<{
  editing: Volunteer | null;
  form: typeof emptyForm;
  setForm: React.Dispatch<React.SetStateAction<typeof emptyForm>>;
  onClose: () => void;
  onSaved: () => void;
}> = ({ editing, form, setForm, onClose, onSaved }) => {
  const [saving, setSaving] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState(form.avatar);
  const fileRef = useRef<HTMLInputElement>(null);

  const pickPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    let avatar = photoPreview;
    if (photoFile) {
      const uploaded = await uploadPhoto(photoFile, 'volunteers');
      if (uploaded) avatar = uploaded;
    }
    if (!avatar) avatar = `https://i.pravatar.cc/150?u=${encodeURIComponent(form.name)}`;

    const payload = {
      name: form.name, parent: form.parent,
      skills: form.skills.split(',').map(s=>s.trim()).filter(Boolean),
      hours: form.hours, upcomingEvent: form.upcomingEvent || undefined, avatar,
    };

    if (editing) {
      const ok = await updateVolunteer(editing.id, payload);
      setSaving(false);
      if (ok) { toast.success('Volunteer updated!'); onSaved(); onClose(); }
      else toast.error('Could not update volunteer');
    } else {
      const id = await addVolunteer(payload);
      setSaving(false);
      if (id) { toast.success('Volunteer added!'); onSaved(); onClose(); }
      else toast.error('Could not save volunteer');
    }
  };

  const inp = "w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm outline-none focus:border-green-700";

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto" onClick={onClose}>
      <div className="bg-white rounded-2xl p-6 max-w-md w-full my-8" onClick={(e)=>e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold" style={{color:'#2D5016'}}>{editing ? 'Edit Volunteer' : 'Add Volunteer'}</h3>
          <button onClick={onClose}><X className="w-5 h-5"/></button>
        </div>
        <form onSubmit={submit} className="space-y-3">
          <div className="flex items-center gap-3 mb-2">
            <div className="relative">
              <img src={photoPreview || `https://i.pravatar.cc/150?u=placeholder`} alt="Preview" className="w-16 h-16 rounded-2xl object-cover ring-2 ring-stone-100" />
              <button type="button" onClick={()=>fileRef.current?.click()} className="absolute -bottom-1 -right-1 bg-green-800 text-white p-1.5 rounded-full shadow-md" title="Upload photo">
                <Camera className="w-3.5 h-3.5" />
              </button>
              <input ref={fileRef} type="file" accept="image/*" onChange={pickPhoto} className="hidden" />
            </div>
            <div className="text-xs text-stone-500">Click the camera icon to upload a photo.</div>
          </div>
          <input required value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})} placeholder="Volunteer name" className={inp}/>
          <input value={form.parent} onChange={(e)=>setForm({...form,parent:e.target.value})} placeholder="Parent / Guardian name" className={inp}/>
          <input value={form.skills} onChange={(e)=>setForm({...form,skills:e.target.value})} placeholder="Skills (comma separated)" className={inp}/>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-stone-500 mb-1">Total hours</label>
              <input type="number" value={form.hours} onChange={(e)=>setForm({...form,hours:parseInt(e.target.value)||0})} className={inp}/>
            </div>
            <input value={form.upcomingEvent} onChange={(e)=>setForm({...form,upcomingEvent:e.target.value})} placeholder="Upcoming event (optional)" className={inp}/>
          </div>
          <button disabled={saving} type="submit" className="w-full py-2.5 rounded-xl text-white font-medium disabled:opacity-60" style={{background:'#4A7C2F'}}>
            {saving ? 'Saving…' : editing ? 'Save Changes' : 'Add Volunteer'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Volunteers;
