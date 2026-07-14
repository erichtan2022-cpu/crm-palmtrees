import React, { useState } from 'react';
import { Lead } from '@/data/mockData';
import { useLeads, enrollLead } from '@/hooks/useData';
import { Plus, Phone, Mail, X, Trash2, Pencil, Database } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

const STATUSES: Lead['status'][] = ['Inquiry', 'Tour Scheduled', 'Tour Completed', 'Applied', 'Enrolled'];
const COLORS: Record<Lead['status'], string> = {
  'Inquiry': '#78716c',
  'Tour Scheduled': '#d2a679',
  'Tour Completed': '#f59e0b',
  'Applied': '#3b82f6',
  'Enrolled': '#4A7C2F',
};

const emptyForm = { parentName: '', childName: '', childAge: '', email: '', phone: '', source: 'Website' as Lead['source'], status: 'Inquiry' as Lead['status'], notes: '' };

const Leads: React.FC = () => {
  const { data: leads, loading, addLead, updateLeadStatus, updateLead, deleteLead, refresh } = useLeads();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Lead | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [importingId, setImportingId] = useState<string | null>(null);

  const openAdd = () => { setEditing(null); setForm(emptyForm); setShowForm(true); };
  const openEdit = (l: Lead) => {
    setEditing(l);
    setForm({ parentName: l.parentName, childName: l.childName, childAge: String(l.childAge), email: l.email, phone: l.phone, source: l.source, status: l.status, notes: l.notes });
    setShowForm(true);
  };

  const moveLead = async (id: string, direction: 1 | -1) => {
    const lead = leads.find(l => l.id === id);
    if (!lead) return;
    const idx = STATUSES.indexOf(lead.status);
    const newIdx = Math.max(0, Math.min(STATUSES.length - 1, idx + direction));
    if (newIdx === idx) return;
    await updateLeadStatus(id, STATUSES[newIdx]);
    toast.success('Lead status updated');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this lead?')) return;
    await deleteLead(id);
    toast.success('Lead deleted');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      parentName: form.parentName,
      childName: form.childName,
      childAge: parseInt(form.childAge) || 3,
      email: form.email,
      phone: form.phone,
      source: form.source,
      status: form.status,
      notes: form.notes,
    };

    if (editing) {
      await updateLead(editing.id, payload);
      toast.success('Lead updated!');
    } else {
      await addLead({ ...payload, inquiryDate: new Date().toISOString().split('T')[0] });
      try {
        await fetch('https://famous.ai/api/crm/6a1349aa4253944c7254413c/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: form.email, name: form.parentName, source: 'lead-form', tags: ['lead', form.source.toLowerCase()] }),
        });
      } catch {}
      toast.success('Lead saved to database & added to CRM!');
    }
    setShowForm(false);
    setEditing(null);
    setForm(emptyForm);
  };

  const handleImport = async (lead: Lead) => {
    if (lead.notes.includes('[Imported')) { toast.error('This lead has already been imported.'); return; }
    if (!confirm(`Input ${lead.childName} & ${lead.parentName} into the Student and Family databases?`)) return;
    setImportingId(lead.id);
    const res = await enrollLead(lead);
    setImportingId(null);
    if (res) {
      toast.success(`${lead.childName} added to Students & ${lead.parentName} added to Family Directory!`);
      await refresh();
    } else {
      toast.error('Import failed. Please try again.');
    }
  };

  const total = leads.length;
  const enrolled = leads.filter(l => l.status === 'Enrolled').length;
  const conversion = total > 0 ? Math.round((enrolled / total) * 100) : 0;
  const inp = "w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm outline-none focus:border-green-700";

  if (loading) return <div className="text-center py-12 text-stone-500">Loading leads…</div>;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {STATUSES.map(s => {
          const count = leads.filter(l => l.status === s).length;
          return (
            <div key={s} className="bg-white rounded-2xl shadow-sm border border-stone-100 p-4">
              <div className="text-xs text-stone-500 font-medium">{s}</div>
              <div className="text-2xl font-bold mt-1" style={{ color: COLORS[s] }}>{count}</div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm text-stone-700">
          <span className="font-bold text-stone-900">Conversion rate: {conversion}%</span> · {enrolled} enrolled of {total} leads
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium" style={{background:'#4A7C2F'}}>
          <Plus className="w-4 h-4"/>New Lead
        </button>
      </div>

      <div className="bg-green-50 border border-green-100 rounded-xl p-3 text-xs text-green-900">
        Tip: Click the pencil icon to edit any lead card. For cards in the <span className="font-semibold">Enrolled</span> column, click <span className="font-semibold">Input to DB</span> to add the child to the Student database and the parent to the Family Directory automatically.
      </div>

      <div className="overflow-x-auto pb-2">
        <div className="grid grid-cols-5 gap-3 min-w-[1000px]">
          {STATUSES.map(status => (
            <div key={status} className="bg-stone-100 rounded-2xl p-3">
              <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{background: COLORS[status]}}/>
                  <span className="font-semibold text-sm text-stone-800">{status}</span>
                </div>
                <span className="text-xs text-stone-500">{leads.filter(l=>l.status===status).length}</span>
              </div>
              <div className="space-y-2">
                {leads.filter(l=>l.status===status).map(l => {
                  const imported = l.notes.includes('[Imported');
                  return (
                    <div key={l.id} className="bg-white rounded-xl p-3 shadow-sm border border-stone-100">
                      <div className="flex items-start justify-between">
                        <div className="font-semibold text-sm text-stone-800">{l.parentName}</div>
                        <button onClick={()=>openEdit(l)} className="p-1 rounded-lg hover:bg-stone-100" title="Edit"><Pencil className="w-3.5 h-3.5 text-stone-500"/></button>
                      </div>
                      <div className="text-xs text-stone-500 mt-0.5">{l.childName} · Age {l.childAge}</div>
                      <div className="text-xs text-stone-600 mt-2 line-clamp-2">{l.notes}</div>
                      <div className="flex items-center gap-1 mt-2">
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{background: COLORS[status]+'20', color: COLORS[status]}}>{l.source}</span>
                      </div>

                      {status === 'Enrolled' && (
                        <button onClick={()=>handleImport(l)} disabled={imported || importingId===l.id}
                          className="w-full mt-2 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium text-white disabled:opacity-50"
                          style={{background: imported ? '#9ca3af' : '#2D5016'}}>
                          <Database className="w-3.5 h-3.5"/>
                          {imported ? 'Already in DB' : importingId===l.id ? 'Importing…' : 'Input to DB'}
                        </button>
                      )}

                      <div className="flex items-center gap-1 mt-2 pt-2 border-t border-stone-100">
                        <button onClick={()=>window.open(`mailto:${l.email}`)} className="p-1.5 rounded-lg hover:bg-stone-100" title="Email"><Mail className="w-3.5 h-3.5 text-stone-600"/></button>
                        <button onClick={()=>window.open(`https://wa.me/${l.phone.replace(/\D/g,'')}`)} className="p-1.5 rounded-lg hover:bg-stone-100" title="WhatsApp"><Phone className="w-3.5 h-3.5 text-stone-600"/></button>
                        <button onClick={()=>handleDelete(l.id)} className="p-1.5 rounded-lg hover:bg-red-50" title="Delete"><Trash2 className="w-3.5 h-3.5 text-red-600"/></button>
                        <div className="flex-1"/>
                        <button onClick={()=>moveLead(l.id,-1)} className="p-1 rounded text-stone-500 hover:bg-stone-100 text-xs">←</button>
                        <button onClick={()=>moveLead(l.id,1)} className="p-1 rounded text-stone-500 hover:bg-stone-100 text-xs">→</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={()=>setShowForm(false)}>
          <div className="bg-white rounded-2xl p-6 max-w-md w-full" onClick={(e)=>e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold" style={{color:'#2D5016'}}>{editing ? 'Edit Lead' : 'New Lead'}</h3>
              <button onClick={()=>setShowForm(false)}><X className="w-5 h-5"/></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input required value={form.parentName} onChange={(e)=>setForm({...form,parentName:e.target.value})} placeholder="Parent name" className={inp}/>
              <div className="grid grid-cols-2 gap-3">
                <input required value={form.childName} onChange={(e)=>setForm({...form,childName:e.target.value})} placeholder="Child name" className={inp}/>
                <input required type="number" value={form.childAge} onChange={(e)=>setForm({...form,childAge:e.target.value})} placeholder="Age" className={inp}/>
              </div>
              <input required type="email" value={form.email} onChange={(e)=>setForm({...form,email:e.target.value})} placeholder="Email" className={inp}/>
              <input required value={form.phone} onChange={(e)=>setForm({...form,phone:e.target.value})} placeholder="Phone" className={inp}/>
              <div className="grid grid-cols-2 gap-3">
                <select value={form.source} onChange={(e)=>setForm({...form,source:e.target.value as Lead['source']})} className={inp}>
                  <option>Website</option><option>Referral</option><option>Instagram</option><option>Google Ads</option><option>Walk-in</option>
                </select>
                <select value={form.status} onChange={(e)=>setForm({...form,status:e.target.value as Lead['status']})} className={inp}>
                  {STATUSES.map(s=><option key={s}>{s}</option>)}
                </select>
              </div>
              <textarea value={form.notes} onChange={(e)=>setForm({...form,notes:e.target.value})} placeholder="Notes" rows={2} className={inp}/>
              <button type="submit" className="w-full py-2.5 rounded-xl text-white font-medium" style={{background:'#4A7C2F'}}>{editing ? 'Save Changes' : 'Add Lead'}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leads;
