import React, { useState } from 'react';
import { Student } from '@/data/mockData';
import { useStudents, addStudentObservation, recordAttendance, deleteStudent, addStudent } from '@/hooks/useData';
import { useAuth } from '@/contexts/AuthContext';
import { Search, Download, Plus, X, AlertCircle, Phone, Calendar, CheckCircle2, Clock, XCircle, Trash2 } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

const Students: React.FC = () => {
  const { currentUser } = useAuth();
  const { data: allStudents, loading, refresh } = useStudents();
  const [search, setSearch] = useState('');
  const [classFilter, setClassFilter] = useState<string>('all');
  const [selected, setSelected] = useState<Student | null>(null);
  const [showAdd, setShowAdd] = useState(false);


  let list = allStudents;
  if (currentUser?.role === 'parent') {
    list = allStudents.filter(s => currentUser.childIds?.includes(s.id));
  }

  const filtered = list.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) &&
    (classFilter === 'all' || s.classroom === classFilter)
  );

  const handleExport = () => {
    const csv = ['Name,Age,Classroom,Enrollment Date,Status', ...filtered.map(s => `${s.name},${s.age},${s.classroom},${s.enrollmentDate},${s.status}`)].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'students.csv'; a.click();
    toast.success('Student data exported!');
  };

  if (loading) return <div className="text-center py-12 text-stone-500">Loading students…</div>;

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-4 flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-[200px] flex items-center gap-2 bg-stone-50 rounded-xl px-3 py-2">
          <Search className="w-4 h-4 text-stone-400" />
          <input value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="Search students..." className="bg-transparent outline-none text-sm flex-1" />
        </div>
        <select value={classFilter} onChange={(e)=>setClassFilter(e.target.value)} className="px-3 py-2 rounded-xl border border-stone-200 text-sm bg-white">
          <option value="all">All Classes</option>
          <option value="Toddler">Toddler</option>
          <option value="Primary">Primary</option>
          <option value="Lower Elementary">Lower Elementary</option>
          <option value="Upper Elementary">Upper Elementary</option>
        </select>
        <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-sm font-medium text-stone-700"><Download className="w-4 h-4"/>Export</button>
        {currentUser?.role !== 'parent' && (
          <button onClick={()=>setShowAdd(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium" style={{background:'#4A7C2F'}}>
            <Plus className="w-4 h-4"/>Add Student
          </button>
        )}

      </div>

      <div className="text-sm text-stone-600">Showing <span className="font-semibold text-stone-800">{filtered.length}</span> of {list.length} students</div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map(s => {
          const today = s.attendance[0];
          return (
            <button key={s.id} onClick={()=>setSelected(s)} className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden hover:shadow-md transition text-left">
              <div className="relative h-32" style={{ background: 'linear-gradient(135deg, #f5e6d3 0%, #d4b896 100%)' }}>
                <img src={s.photo} alt={s.name} className="absolute -bottom-6 left-4 w-16 h-16 rounded-2xl object-cover ring-4 ring-white shadow-md" />
                {s.allergies.length > 0 && (
                  <div className="absolute top-3 right-3 bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3 h-3"/>Allergy
                  </div>
                )}
              </div>
              <div className="p-4 pt-8">
                <div className="font-bold text-stone-800">{s.name}</div>
                <div className="text-xs text-stone-500 mt-0.5">{s.classroom} · Age {s.age}</div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-stone-100">
                  <span className="text-xs text-stone-600">Today</span>
                  <span className={`text-xs font-medium flex items-center gap-1 ${today?.status==='present'?'text-green-700':today?.status==='late'?'text-amber-700':'text-red-700'}`}>
                    {today?.status==='present'?<CheckCircle2 className="w-3 h-3"/>:today?.status==='late'?<Clock className="w-3 h-3"/>:<XCircle className="w-3 h-3"/>}
                    {today?.status || 'unmarked'}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {selected && <StudentDetail student={selected} onClose={()=>setSelected(null)} onChanged={refresh} canEdit={currentUser?.role !== 'parent'} />}
      {showAdd && <AddStudentModal onClose={()=>setShowAdd(false)} onSaved={refresh} />}
    </div>
  );
};

const AddStudentModal: React.FC<{ onClose: () => void; onSaved: () => void }> = ({ onClose, onSaved }) => {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: '', age: '', dob: '', classroom: 'Toddler' as Student['classroom'],
    enrollmentDate: new Date().toISOString().split('T')[0], medicalInfo: 'None on file',
    allergies: '', emergencyContact: '', emergencyPhone: '',
  });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const id = await addStudent({
      name: form.name,
      photo: `https://i.pravatar.cc/200?u=${encodeURIComponent(form.name)}`,
      age: parseInt(form.age) || 3,
      dob: form.dob,
      enrollmentDate: form.enrollmentDate,
      classroom: form.classroom,
      medicalInfo: form.medicalInfo,
      allergies: form.allergies.split(',').map(a=>a.trim()).filter(Boolean),
      emergencyContact: form.emergencyContact,
      emergencyPhone: form.emergencyPhone,
      parentIds: [],
      status: 'active',
      attendance: [],
      milestones: [],
      observations: [],
    });
    setSaving(false);
    if (id) {
      toast.success(`${form.name} enrolled & saved to database!`);
      onSaved();
      onClose();
    } else {
      toast.error('Could not save student. Please try again.');
    }
  };

  const inp = "w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm outline-none focus:border-green-700";

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto" onClick={onClose}>
      <div className="bg-white rounded-2xl p-6 max-w-lg w-full my-8 max-h-[90vh] overflow-y-auto" onClick={(e)=>e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold" style={{color:'#2D5016'}}>Enroll New Student</h3>
          <button onClick={onClose}><X className="w-5 h-5"/></button>
        </div>
        <form onSubmit={submit} className="space-y-3">
          <input required value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})} placeholder="Child full name" className={inp}/>
          <div className="grid grid-cols-2 gap-3">
            <input required type="number" value={form.age} onChange={(e)=>setForm({...form,age:e.target.value})} placeholder="Age" className={inp}/>
            <select value={form.classroom} onChange={(e)=>setForm({...form,classroom:e.target.value as Student['classroom']})} className={inp}>
              <option>Toddler</option><option>Primary</option><option>Lower Elementary</option><option>Upper Elementary</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-stone-500 mb-1">Date of birth</label>
              <input type="date" value={form.dob} onChange={(e)=>setForm({...form,dob:e.target.value})} className={inp}/>
            </div>
            <div>
              <label className="block text-xs text-stone-500 mb-1">Enrollment date</label>
              <input type="date" value={form.enrollmentDate} onChange={(e)=>setForm({...form,enrollmentDate:e.target.value})} className={inp}/>
            </div>
          </div>
          <input value={form.medicalInfo} onChange={(e)=>setForm({...form,medicalInfo:e.target.value})} placeholder="Medical info" className={inp}/>
          <input value={form.allergies} onChange={(e)=>setForm({...form,allergies:e.target.value})} placeholder="Allergies (comma separated)" className={inp}/>
          <div className="grid grid-cols-2 gap-3">
            <input required value={form.emergencyContact} onChange={(e)=>setForm({...form,emergencyContact:e.target.value})} placeholder="Emergency contact name" className={inp}/>
            <input required value={form.emergencyPhone} onChange={(e)=>setForm({...form,emergencyPhone:e.target.value})} placeholder="Emergency phone" className={inp}/>
          </div>
          <button disabled={saving} type="submit" className="w-full py-2.5 rounded-xl text-white font-medium disabled:opacity-60" style={{background:'#4A7C2F'}}>
            {saving ? 'Saving…' : 'Enroll Student'}
          </button>
        </form>
      </div>
    </div>
  );
};


const StudentDetail: React.FC<{ student: Student; onClose: () => void; onChanged: () => void; canEdit: boolean }> = ({ student, onClose, onChanged, canEdit }) => {
  const [tab, setTab] = useState<'overview'|'attendance'|'progress'|'observations'>('overview');
  const [obsText, setObsText] = useState('');
  const [obsArea, setObsArea] = useState('Practical Life');

  const checkIn = async () => {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const time = now.toTimeString().slice(0, 5);
    await recordAttendance(student.id, { date: today, checkIn: time, checkOut: null, status: 'present' });
    toast.success(`${student.name} checked in at ${time}`);
    onChanged();
    onClose();
  };

  const checkOut = async () => {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const time = now.toTimeString().slice(0, 5);
    const existing = student.attendance.find(a => a.date === today);
    await recordAttendance(student.id, { date: today, checkIn: existing?.checkIn || null, checkOut: time, status: 'present' });
    toast.success(`${student.name} checked out at ${time}`);
    onChanged();
    onClose();
  };

  const submitObs = async () => {
    if (!obsText.trim()) return;
    await addStudentObservation(student.id, {
      date: new Date().toISOString().split('T')[0],
      teacher: 'Ms. Jati',
      note: obsText,
      area: obsArea,
    });
    toast.success('Observation saved!');
    setObsText('');
    onChanged();
    onClose();
  };

  const handleDelete = async () => {
    if (!confirm(`Delete ${student.name}? This cannot be undone.`)) return;
    await deleteStudent(student.id);
    toast.success('Student removed');
    onChanged();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto" onClick={onClose}>
      <div className="bg-stone-50 rounded-3xl shadow-2xl max-w-3xl w-full my-8 max-h-[90vh] overflow-y-auto" onClick={(e)=>e.stopPropagation()}>
        <div className="relative h-40" style={{ background: 'linear-gradient(135deg, #4A7C2F 0%, #2D5016 100%)' }}>
          <button onClick={onClose} className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 p-2 rounded-full text-white"><X className="w-5 h-5"/></button>
          <img src={student.photo} className="absolute -bottom-12 left-8 w-24 h-24 rounded-3xl object-cover ring-4 ring-white shadow-xl" />
        </div>
        <div className="px-8 pt-16 pb-8">
          <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
            <div>
              <h2 className="text-2xl font-bold" style={{color:'#2D5016'}}>{student.name}</h2>
              <div className="text-stone-600 text-sm">{student.classroom} Class · Age {student.age} · Enrolled {student.enrollmentDate}</div>
            </div>
            {canEdit && (
              <div className="flex gap-2 flex-wrap">
                <button onClick={checkIn} className="px-4 py-2 rounded-xl text-sm font-medium text-white" style={{background:'#4A7C2F'}}>Check In</button>
                <button onClick={checkOut} className="px-4 py-2 rounded-xl text-sm font-medium bg-stone-200 text-stone-800">Check Out</button>
                <button onClick={handleDelete} className="px-3 py-2 rounded-xl text-sm font-medium bg-red-50 text-red-700 hover:bg-red-100 flex items-center gap-1"><Trash2 className="w-4 h-4"/></button>
              </div>
            )}
          </div>

          <div className="flex gap-1 mt-6 border-b border-stone-200 overflow-x-auto">
            {(['overview','attendance','progress','observations'] as const).map(t => (
              <button key={t} onClick={()=>setTab(t)} className={`px-4 py-2 text-sm font-medium border-b-2 transition whitespace-nowrap capitalize ${tab===t?'border-green-800 text-green-800':'border-transparent text-stone-500 hover:text-stone-700'}`}>{t}</button>
            ))}
          </div>

          <div className="mt-5">
            {tab==='overview' && (
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-white rounded-2xl p-4 border border-stone-100">
                  <div className="text-xs text-stone-500 mb-2 font-medium uppercase">Medical Info</div>
                  <div className="text-sm text-stone-800">{student.medicalInfo}</div>
                  {student.allergies.length>0 && <div className="mt-2 flex flex-wrap gap-1">{student.allergies.map(a=><span key={a} className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full">{a}</span>)}</div>}
                </div>
                <div className="bg-white rounded-2xl p-4 border border-stone-100">
                  <div className="text-xs text-stone-500 mb-2 font-medium uppercase">Emergency Contact</div>
                  <div className="text-sm font-medium text-stone-800">{student.emergencyContact}</div>
                  <div className="text-sm text-stone-600 flex items-center gap-1 mt-1"><Phone className="w-3.5 h-3.5"/>{student.emergencyPhone}</div>
                </div>
                <div className="bg-white rounded-2xl p-4 border border-stone-100 sm:col-span-2">
                  <div className="text-xs text-stone-500 mb-2 font-medium uppercase">Date of Birth</div>
                  <div className="text-sm text-stone-800 flex items-center gap-2"><Calendar className="w-4 h-4 text-green-800"/>{student.dob}</div>
                </div>
              </div>
            )}
            {tab==='attendance' && (
              <div className="bg-white rounded-2xl p-4 border border-stone-100">
                <div className="space-y-2">
                  {student.attendance.map((a,i)=>(
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-stone-50">
                      <div className="text-sm font-medium text-stone-800">{a.date}</div>
                      <div className="flex items-center gap-3 text-xs text-stone-600">
                        {a.checkIn && <span>In: {a.checkIn}</span>}
                        {a.checkOut && <span>Out: {a.checkOut}</span>}
                        <span className={`px-2 py-0.5 rounded-full font-medium ${a.status==='present'?'bg-green-100 text-green-800':a.status==='late'?'bg-amber-100 text-amber-800':'bg-red-100 text-red-800'}`}>{a.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {tab==='progress' && (
              <div className="space-y-3">
                {student.milestones.map((m,i)=>(
                  <div key={i} className="bg-white rounded-2xl p-4 border border-stone-100 flex items-center justify-between">
                    <div>
                      <div className="text-xs text-stone-500 uppercase font-medium">{m.area}</div>
                      <div className="font-medium text-stone-800 mt-0.5">{m.skill}</div>
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${m.status==='mastered'?'bg-green-100 text-green-800':m.status==='practicing'?'bg-amber-100 text-amber-800':'bg-stone-100 text-stone-700'}`}>{m.status}</span>
                  </div>
                ))}
              </div>
            )}
            {tab==='observations' && (
              <div className="space-y-3">
                {student.observations.map((o,i)=>(
                  <div key={i} className="bg-white rounded-2xl p-4 border border-stone-100">
                    <div className="flex justify-between text-xs text-stone-500 mb-2">
                      <span className="font-medium">{o.teacher} · {o.area}</span>
                      <span>{o.date}</span>
                    </div>
                    <p className="text-sm text-stone-800 leading-relaxed">{o.note}</p>
                  </div>
                ))}
                {canEdit && (
                  <div className="bg-white rounded-2xl p-4 border border-stone-100 space-y-2">
                    <select value={obsArea} onChange={(e)=>setObsArea(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm">
                      {['Practical Life','Sensorial','Language','Mathematics','Cultural','Social-Emotional'].map(a=><option key={a}>{a}</option>)}
                    </select>
                    <textarea value={obsText} onChange={(e)=>setObsText(e.target.value)} rows={3} placeholder="Record your observation…" className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm outline-none focus:border-green-700"/>
                    <button onClick={submitObs} className="w-full py-2 rounded-xl text-white text-sm font-medium" style={{background:'#4A7C2F'}}>Save Observation</button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Students;
