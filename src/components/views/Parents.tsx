import React, { useState } from 'react';
import { useParents, useStudents } from '@/hooks/useData';
import { Search, Mail, Phone, MessageCircle, Shield, ShieldOff, Info } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

const Parents: React.FC = () => {
  const { data: parents, loading } = useParents();
  const { data: students } = useStudents();
  const [search, setSearch] = useState('');
  const filtered = parents.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

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
        <button onClick={()=>toast.success('Bulk message composer opened')} className="px-4 py-2 rounded-xl text-white text-sm font-medium" style={{background:'#4A7C2F'}}>Message All</button>
      </div>


      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(p => {
          const kids = students.filter(s => p.childIds.includes(s.id));
          return (
            <div key={p.id} className="bg-white rounded-2xl shadow-sm border border-stone-100 p-5">
              <div className="flex items-center gap-3 mb-4">
                <img src={p.avatar} className="w-14 h-14 rounded-2xl object-cover ring-2 ring-stone-100" />
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
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Parents;
