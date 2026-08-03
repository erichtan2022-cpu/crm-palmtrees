import React, { useState, useRef } from 'react';
import { useParents, useStudents, addParent, updateParent, deleteParent, uploadPhoto } from '@/hooks/useData';
import { Parent } from '@/data/mockData';
import { Search, Mail, Phone, MessageCircle, Shield, ShieldOff, Info, Plus, X, Pencil, Trash2, Camera } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

const emptyForm = {
  name: '', email: '', phone: '', relation: 'Parent',
  preferredChannel: 'email' as Parent['preferredChannel'],
  privacyConsent: false, avatar: '', childIds: [] as string[],
};

const Parents: React.FC = () => {
  const { data: parents, loading, refresh } = useParents();
  const { data: students } = useStudents();
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Parent | null>(null);
  const [form, setForm] = useState(emptyForm);

  const filtered = parents.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  const openAdd = () => { setEditing(null); setForm(emptyForm); setShowForm(true); };
  const openEdit = (p: Parent) => {
    setEditing(p);
    setForm({ name: p.name, email: p.email, phone: p.phone, relation: p.relation, preferredChannel: p.preferredChannel, privacyConsent: p.privacyConsent, avatar: p.avatar, childIds: p.childIds });
    setShowForm(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete ${name} from the Family Directory?`)) return;
    const ok = await deleteParent(id);
    if (ok) { toast.success(`${name} removed from Family Directory`); refresh(); }
    else toast.error('Could not delete record');
  };

  if (loading) return <div className="text-center py-12 text-stone-500">Loading families…</div>;

  return (
    <div className="space-y-5">
      <div className="bg-green-50 border border-green-100 rounded-xl p-4 flex gap-3 text-sm text-green-900">
        <Info className="w-5 h-5 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold">Where does this data come from?</span> The Family Directory is built from the
          <span className="font-semibold"> Parents/Guardians database</span>. Records are created automatically when you
          <span className="font-semibold"> Input</span> an enrolled lead from <span className="font-semibold">Lead Management</span> (which creates both a student and a linked parent), or when families are seeded by the school office. Each card links a guardian to their child(ren) in the Student database.
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-4 flex flex-wrap gap-3 items-center">
        <div className="flex-1 min-w-[200px] flex items-center gap-2 bg-stone-50 rounded-xl px-3 py-2">
          <Search className="w-4 h-4 text-stone-400" />
          <input value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="Search families..." className="bg-transparent outline-none text-sm flex-1" />
        </div>
        <span className="text-sm text-stone-500">{parents.length} families</span>
        <button onClick={()=>toast.success('Bulk message composer opened')} className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-sm font-medium text-stone-700">Message All</button>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium" style={{background:'#4A7C2F'}}>
          <Plus className="w-4 h-4"/>Add Parent
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(p => {
          const kids = students.filter(s => p.childIds.includes(s.id));
          return (
            <div key={p.id} className="bg-white rounded-2xl shadow-sm border border-stone-100 p-5">
              <div className="flex items-center gap-3 mb-4">
                <img src={p.avatar || `https://i.pravatar.cc/150?u=${p.id}`} className="w-14 h-14 rounded-2xl object-cover ring-2 ring-stone-100" />
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-stone-800 truncate">{p.name}</div>
                  <div className="text-xs text-stone-500">{p.relation}</div>
                </div>
                {p.privacyConsent ? <Shield className="w-4 h-4 text-green-700" /> : <ShieldOff className="w-4 h-4 text-stone-400" />}
              </div>

              <div className="space-y-1.5 text-sm text-stone-700 mb-4">
                <div className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-stone-400"/><span className="truncate">{p.email}</span></div>
                <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-stone-400"/><span>{p.phone}</span></div>
                <div className="flex items-center gap-2"><MessageCircle className="w-3.5 h-3.5 text-stone-400"/><span className="capitalize">Prefers {p.preferredChannel}</span></div>
              </div>

              {kids.length > 0 && (
                <div className="pt-3 border-t border-stone-100">
                  <div className="text-xs text-stone-500 mb-2 font-medium uppercase">Children ({kids.length})</div>
                  <div className="flex -space-x-2">
                    {kids.map(k => (
                      <img key={k.id} src={k.photo} title={k.name} className="w-9 h-9 rounded-xl ring-2 ring-white object-cover"/>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2 mt-4">
                <button onClick={()=>toast.success(`Email to ${p.name}`)} className="flex-1 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-xs font-medium text-stone-700">Email</button>
                <button onClick={()=>window.open(`https://wa.me/${p.phone.replace(/\D/g,'')}`)} className="flex-1 py-2 rounded-xl text-xs font-medium text-white" style={{background:'#4A7C2F'}}>WhatsApp</button>
                <button onClick={()=>openEdit(p)} className="py-2 px-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-xs font-medium text-stone-700" title="Edit"><Pencil className="w-3.5 h-3.5"/></button>
                <button onClick={()=>handleDelete(p.id, p.name)} className="py-2 px-2 rounded-xl bg-red-50 hover:bg-red-100 text-xs font-medium text-red-700" title="Delete"><Trash2 className="w-3.5 h-3.5"/></button>
              </div>
            </div>
          );
        })}
      </div>

      {showForm && (
        <ParentFormModal
          editing={editing}
          form={form}
          setForm={setForm}
          students={students}
          onClose={()=>setShowForm(false)}
          onSaved={refresh}
        />
      )}
    </div>
  );
};

const ParentFormModal: React.FC<{
  editing: Parent | null;
  form: typeof emptyForm;
  setForm: React.Dispatch<React.SetStateAction<typeof emptyForm>>;
  students: { id: string; name: string; classroom: string }[];
  onClose: () => void;
  onSaved: () => void;
}> = ({ editing, form, setForm, students, onClose, onSaved }) => {
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

  const toggleChild = (id: string) => {
    setForm(f => ({ ...f, childIds: f.childIds.includes(id) ? f.childIds.filter(c=>c!==id) : [...f.childIds, id] }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    let avatar = photoPreview;
    if (photoFile) {
      const uploaded = await uploadPhoto(photoFile, 'parents');
      if (uploaded) avatar = uploaded;
    }
    if (!avatar) avatar = `https://i.pravatar.cc/150?u=${encodeURIComponent(form.name)}`;

    if (editing) {
      const ok = await updateParent(editing.id, { ...form, avatar });
      setSaving(false);
      if (ok) { toast.success(`${form.name} updated!`); onSaved(); onClose(); }
      else toast.error('Could not update record');
    } else {
      const id = await addParent({ ...form, avatar });
      setSaving(false);
      if (id) { toast.success(`${form.name} added to Family Directory!`); onSaved(); onClose(); }
      else toast.error('Could not save record');
    }
  };

  const inp = "w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm outline-none focus:border-green-700";

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto" onClick={onClose}>
      <div className="bg-white rounded-2xl p-6 max-w-lg w-full my-8 max-h-[90vh] overflow-y-auto" onClick={(e)=>e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold" style={{color:'#2D5016'}}>{editing ? 'Edit Parent' : 'Add Parent'}</h3>
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
          <input required value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})} placeholder="Parent / Guardian name" className={inp}/>
          <input required type="email" value={form.email} onChange={(e)=>setForm({...form,email:e.target.value})} placeholder="Email" className={inp}/>
          <input required value={form.phone} onChange={(e)=>setForm({...form,phone:e.target.value})} placeholder="Phone" className={inp}/>
          <div className="grid grid-cols-2 gap-3">
            <select value={form.relation} onChange={(e)=>setForm({...form,relation:e.target.value})} className={inp}>
              <option>Parent</option><option>Father</option><option>Mother</option><option>Guardian</option><option>Grandparent</option>
            </select>
            <select value={form.preferredChannel} onChange={(e)=>setForm({...form,preferredChannel:e.target.value as Parent['preferredChannel']})} className={inp}>
              <option value="email">Email</option><option value="sms">SMS</option><option value="whatsapp">WhatsApp</option>
            </select>
          </div>
          <label className="flex items-center gap-2 text-sm text-stone-700">
            <input type="checkbox" checked={form.privacyConsent} onChange={(e)=>setForm({...form,privacyConsent:e.target.checked})} className="rounded"/>
            Privacy consent given
          </label>
          <div>
            <label className="block text-xs text-stone-500 mb-1">Linked Children</label>
            <div className="max-h-32 overflow-y-auto border border-stone-200 rounded-xl p-2 space-y-1">
              {students.length === 0 && <div className="text-xs text-stone-400 p-2">No students enrolled yet</div>}
              {students.map(s => (
                <label key={s.id} className="flex items-center gap-2 text-sm p-1.5 rounded-lg hover:bg-stone-50">
                  <input type="checkbox" checked={form.childIds.includes(s.id)} onChange={()=>toggleChild(s.id)} className="rounded"/>
                  <span className="text-stone-700">{s.name}</span>
                  <span className="text-xs text-stone-400">{s.classroom}</span>
                </label>
              ))}
            </div>
          </div>
          <button disabled={saving} type="submit" className="w-full py-2.5 rounded-xl text-white font-medium disabled:opacity-60" style={{background:'#4A7C2F'}}>
            {saving ? 'Saving…' : editing ? 'Save Changes' : 'Add Parent'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Parents;
