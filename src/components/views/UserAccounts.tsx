import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useStudents } from '@/hooks/useData';
import { UserPlus, X, Pencil, KeyRound, Ban, CircleCheck as CheckCircle2, Trash2, Shield, Mail } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  childIds: string[];
  banned: boolean;
  createdAt: string;
}

const ROLE_COLORS: Record<string, string> = {
  admin: '#2D5016',
  teacher: '#4A7C2F',
  staff: '#D2A679',
  parent: '#8B4513',
};

const emptyForm = {
  name: '', email: '', password: '', role: 'teacher' as string,
  childIds: [] as string[],
};

const UserAccounts: React.FC = () => {
  const { data: students } = useStudents();
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<UserAccount | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [resetTarget, setResetTarget] = useState<UserAccount | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/manage-users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token || import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ action: 'list' }),
      });
      if (!res.ok) throw new Error('Failed to fetch users');
      const data = await res.json();
      setUsers(data.users || []);
    } catch (err) {
      toast.error('Could not load user accounts');
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const openAdd = () => { setEditing(null); setForm(emptyForm); setShowForm(true); };
  const openEdit = (u: UserAccount) => {
    setEditing(u);
    setForm({ name: u.name, email: u.email, password: '', role: u.role, childIds: u.childIds });
    setShowForm(true);
  };

  const toggleChild = (id: string) => {
    setForm(f => ({ ...f, childIds: f.childIds.includes(id) ? f.childIds.filter(c=>c!==id) : [...f.childIds, id] }));
  };

  const callEdgeFn = async (payload: Record<string, unknown>) => {
    const { data: { session } } = await supabase.auth.getSession();
    const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/manage-users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session?.access_token || import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Request failed');
    return data;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await callEdgeFn({
          action: 'update',
          userId: editing.id,
          name: form.name,
          role: form.role,
          childIds: form.childIds,
        });
        toast.success('Account updated!');
      } else {
        await callEdgeFn({
          action: 'create',
          email: form.email,
          password: form.password,
          name: form.name,
          role: form.role,
          childIds: form.childIds,
        });
        toast.success('Account created! Share the credentials with the user manually.');
      }
      setShowForm(false);
      setForm(emptyForm);
      setEditing(null);
      fetchUsers();
    } catch (err: any) {
      toast.error(err.message || 'Could not save account');
    }
    setSaving(false);
  };

  const handleResetPassword = async () => {
    if (!resetTarget || !newPassword) return;
    setSaving(true);
    try {
      await callEdgeFn({ action: 'reset_password', userId: resetTarget.id, newPassword });
      toast.success(`Password reset for ${resetTarget.name}. Share the new password manually.`);
      setResetTarget(null);
      setNewPassword('');
    } catch (err: any) {
      toast.error(err.message || 'Could not reset password');
    }
    setSaving(false);
  };

  const handleBan = async (u: UserAccount) => {
    const newState = !u.banned;
    if (!confirm(`${newState ? 'Disable' : 'Enable'} account for ${u.name}?`)) return;
    try {
      await callEdgeFn({ action: 'ban', userId: u.id, ban: newState });
      toast.success(newState ? 'Account disabled' : 'Account enabled');
      fetchUsers();
    } catch (err: any) {
      toast.error(err.message || 'Could not update account');
    }
  };

  const handleDelete = async (u: UserAccount) => {
    if (!confirm(`Permanently delete the account for ${u.name}? This cannot be undone.`)) return;
    try {
      await callEdgeFn({ action: 'delete', userId: u.id });
      toast.success('Account deleted');
      fetchUsers();
    } catch (err: any) {
      toast.error(err.message || 'Could not delete account');
    }
  };

  const inp = "w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm outline-none focus:border-green-700";

  if (loading) return <div className="text-center py-12 text-stone-500">Loading user accounts…</div>;

  return (
    <div className="space-y-5">
      <div className="bg-green-50 border border-green-100 rounded-xl p-4 flex gap-3 text-sm text-green-900">
        <Shield className="w-5 h-5 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold">Super Admin only.</span> Create and manage login accounts for Teachers, Staff, and Parents.
          After creating an account or resetting a password, share the credentials with the user manually — no automatic email is sent.
        </div>
      </div>

      <div className="flex justify-end">
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium" style={{background:'#4A7C2F'}}>
          <UserPlus className="w-4 h-4"/>Create Account
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-stone-50 border-b border-stone-100">
              <tr>
                <th className="text-left text-xs font-semibold text-stone-600 px-4 py-3">Name</th>
                <th className="text-left text-xs font-semibold text-stone-600 px-4 py-3">Email</th>
                <th className="text-left text-xs font-semibold text-stone-600 px-4 py-3">Role</th>
                <th className="text-left text-xs font-semibold text-stone-600 px-4 py-3">Status</th>
                <th className="text-right text-xs font-semibold text-stone-600 px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-stone-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <img src={u.avatar || `https://i.pravatar.cc/150?u=${u.id}`} className="w-8 h-8 rounded-lg object-cover" />
                      <span className="font-medium text-stone-800 text-sm">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-stone-600">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2 py-1 rounded-full font-medium text-white capitalize" style={{background: ROLE_COLORS[u.role] || '#78716c'}}>{u.role}</span>
                  </td>
                  <td className="px-4 py-3">
                    {u.banned
                      ? <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-800 font-medium">Disabled</span>
                      : <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800 font-medium">Active</span>}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={()=>openEdit(u)} className="p-1.5 rounded-lg hover:bg-stone-100" title="Edit"><Pencil className="w-4 h-4 text-stone-600"/></button>
                      <button onClick={()=>setResetTarget(u)} className="p-1.5 rounded-lg hover:bg-stone-100" title="Reset password"><KeyRound className="w-4 h-4 text-stone-600"/></button>
                      <button onClick={()=>handleBan(u)} className="p-1.5 rounded-lg hover:bg-stone-100" title={u.banned ? 'Enable' : 'Disable'}>
                        {u.banned ? <CheckCircle2 className="w-4 h-4 text-green-700"/> : <Ban className="w-4 h-4 text-amber-700"/>}
                      </button>
                      <button onClick={()=>handleDelete(u)} className="p-1.5 rounded-lg hover:bg-red-50" title="Delete"><Trash2 className="w-4 h-4 text-red-600"/></button>
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr><td colSpan={5} className="text-center py-8 text-stone-500 text-sm">No user accounts found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto" onClick={()=>setShowForm(false)}>
          <div className="bg-white rounded-2xl p-6 max-w-md w-full my-8" onClick={(e)=>e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold" style={{color:'#2D5016'}}>{editing ? 'Edit Account' : 'Create Account'}</h3>
              <button onClick={()=>setShowForm(false)}><X className="w-5 h-5"/></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input required value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})} placeholder="Full name" className={inp}/>
              <input required type="email" value={form.email} onChange={(e)=>setForm({...form,email:e.target.value})} placeholder="Email address" className={inp} disabled={!!editing}/>
              {editing && <div className="text-xs text-stone-500 -mt-1">Email cannot be changed after creation.</div>}
              {!editing && (
                <input required type="password" value={form.password} onChange={(e)=>setForm({...form,password:e.target.value})} placeholder="Password" className={inp}/>
              )}
              <select value={form.role} onChange={(e)=>setForm({...form,role:e.target.value})} className={inp}>
                <option value="teacher">Teacher</option>
                <option value="parent">Parent</option>
                <option value="staff">Staff</option>
                <option value="admin">Admin</option>
              </select>
              {form.role === 'parent' && (
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
              )}
              <button disabled={saving} type="submit" className="w-full py-2.5 rounded-xl text-white font-medium disabled:opacity-60" style={{background:'#4A7C2F'}}>
                {saving ? 'Saving…' : editing ? 'Save Changes' : 'Create Account'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Reset password modal */}
      {resetTarget && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={()=>setResetTarget(null)}>
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full" onClick={(e)=>e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold" style={{color:'#2D5016'}}>Reset Password</h3>
              <button onClick={()=>setResetTarget(null)}><X className="w-5 h-5"/></button>
            </div>
            <div className="text-sm text-stone-600 mb-3 flex items-center gap-2">
              <Mail className="w-4 h-4"/> {resetTarget.email}
            </div>
            <input required type="password" value={newPassword} onChange={(e)=>setNewPassword(e.target.value)} placeholder="New password" className={inp}/>
            <button disabled={saving} onClick={handleResetPassword} className="w-full mt-3 py-2.5 rounded-xl text-white font-medium disabled:opacity-60" style={{background:'#4A7C2F'}}>
              {saving ? 'Resetting…' : 'Reset Password'}
            </button>
            <div className="text-xs text-stone-500 mt-2">Share the new password with the user manually.</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserAccounts;
