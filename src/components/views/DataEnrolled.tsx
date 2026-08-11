import React, { useState } from 'react';
import { Lead } from '@/data/mockData';
import { useLeads } from '@/hooks/useData';
import { Pencil, X, Trash2, CircleCheck as CheckCircle2 } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

const SOURCES: Lead['source'][] = ['Website', 'Referral', 'Instagram', 'Google Ads', 'Walk-in'];

const emptyForm = {
  parentName: '', childName: '', childAge: '', email: '', phone: '',
  source: 'Website' as Lead['source'], status: 'Enrolled' as Lead['status'],
  notes: '', tuitionFee: '', paymentMethod: 'Full' as Lead['paymentMethod'],
};

const DataEnrolled: React.FC = () => {
  const { data: leads, loading, updateLead, deleteLead } = useLeads();
  const [editing, setEditing] = useState<Lead | null>(null);
  const [form, setForm] = useState(emptyForm);

  const importedLeads = leads.filter((l) => l.status === 'Enrolled' && l.imported);

  const openEdit = (l: Lead) => {
    setEditing(l);
    setForm({
      parentName: l.parentName, childName: l.childName, childAge: String(l.childAge),
      email: l.email, phone: l.phone, source: l.source, status: 'Enrolled',
      notes: l.notes, tuitionFee: String(l.tuitionFee || ''), paymentMethod: l.paymentMethod || 'Full',
    });
  };

  const closeEdit = () => { setEditing(null); setForm(emptyForm); };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    await updateLead(editing.id, {
      parentName: form.parentName, childName: form.childName, childAge: parseInt(form.childAge) || 3,
      email: form.email, phone: form.phone, source: form.source, status: 'Enrolled',
      notes: form.notes, tuitionFee: Number(form.tuitionFee) || 0, paymentMethod: form.paymentMethod,
    });
    toast.success('Data updated');
    closeEdit();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this enrolled record?')) return;
    await deleteLead(id);
    toast.success('Record deleted');
  };

  const fmtIDR = (n: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);

  const inp = 'w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm outline-none focus:border-green-700';

  if (loading) return <div className="text-center py-12 text-stone-500">Loading enrolled data…</div>;

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-4 flex items-center justify-between">
        <div>
          <div className="text-sm font-bold text-stone-900">Data Enrolled</div>
          <div className="text-xs text-stone-500">Leads that have been imported into the database</div>
        </div>
        <div className="text-xs text-stone-500">{importedLeads.length} records</div>
      </div>

      {importedLeads.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-8 text-center text-stone-500 text-sm">
          No enrolled data yet. Import a lead from <span className="font-semibold">Lead Management</span> to see it here.
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-stone-50 text-stone-600 text-xs uppercase tracking-wide">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold">Parent</th>
                  <th className="text-left px-4 py-3 font-semibold">Child</th>
                  <th className="text-left px-4 py-3 font-semibold">Age</th>
                  <th className="text-left px-4 py-3 font-semibold">Contact</th>
                  <th className="text-left px-4 py-3 font-semibold">Source</th>
                  <th className="text-right px-4 py-3 font-semibold">Tuition Fee</th>
                  <th className="text-left px-4 py-3 font-semibold">Payment</th>
                  <th className="text-center px-4 py-3 font-semibold">Status</th>
                  <th className="text-right px-4 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {importedLeads.map((l) => (
                  <tr key={l.id} className="hover:bg-stone-50/60">
                    <td className="px-4 py-3 font-medium text-stone-800">{l.parentName}</td>
                    <td className="px-4 py-3 text-stone-700">{l.childName}</td>
                    <td className="px-4 py-3 text-stone-600">{l.childAge}</td>
                    <td className="px-4 py-3 text-stone-600">
                      <div className="flex flex-col gap-0.5">
                        <a href={`mailto:${l.email}`} className="hover:text-green-700 truncate max-w-[180px]">{l.email}</a>
                        <a href={`https://wa.me/${l.phone.replace(/\D/g, '')}`} className="hover:text-green-700 truncate max-w-[180px]">{l.phone}</a>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-stone-600">{l.source}</td>
                    <td className="px-4 py-3 text-right font-medium text-stone-800">{fmtIDR(l.tuitionFee)}</td>
                    <td className="px-4 py-3 text-stone-600">{l.paymentMethod}</td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex items-center gap-1 text-xs text-green-700 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" /> In DB
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit(l)} className="p-1.5 rounded-lg hover:bg-stone-100" title="Edit"><Pencil className="w-4 h-4 text-stone-500" /></button>
                        <button onClick={() => handleDelete(l.id)} className="p-1.5 rounded-lg hover:bg-red-50" title="Delete"><Trash2 className="w-4 h-4 text-red-600" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={closeEdit}>
          <div className="bg-white rounded-2xl p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold" style={{ color: '#2D5016' }}>Edit Enrolled Record</h3>
              <button onClick={closeEdit}><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-3">
              <input required value={form.parentName} onChange={(e) => setForm({ ...form, parentName: e.target.value })} placeholder="Parent name" className={inp} />
              <div className="grid grid-cols-2 gap-3">
                <input required value={form.childName} onChange={(e) => setForm({ ...form, childName: e.target.value })} placeholder="Child name" className={inp} />
                <input required type="number" value={form.childAge} onChange={(e) => setForm({ ...form, childAge: e.target.value })} placeholder="Age" className={inp} />
              </div>
              <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" className={inp} />
              <input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Phone" className={inp} />
              <select value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value as Lead['source'] })} className={inp}>
                {SOURCES.map((s) => <option key={s}>{s}</option>)}
              </select>
              <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Notes" rows={2} className={inp} />
              <div className="rounded-xl border-2 border-amber-200 bg-amber-50 p-3 space-y-2">
                <div className="text-sm font-bold text-amber-950">Biaya Uang Sekolah</div>
                <input min="0" type="number" value={form.tuitionFee} onChange={(e) => setForm({ ...form, tuitionFee: e.target.value })} placeholder="Biaya dalam Rupiah" className={`${inp} bg-white`} />
                <select value={form.paymentMethod} onChange={(e) => setForm({ ...form, paymentMethod: e.target.value as Lead['paymentMethod'] })} className={`${inp} bg-white`}>
                  <option value="Full">Cara Bayar: Full</option>
                  <option value="Bertahap">Cara Bayar: Bertahap</option>
                </select>
              </div>
              <button type="submit" className="w-full py-2.5 rounded-xl text-white font-medium" style={{ background: '#4A7C2F' }}>Save Changes</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataEnrolled;
