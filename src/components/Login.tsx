import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/sonner';
import { LogIn } from 'lucide-react';
import { LOGO_URL } from '@/data/mockData';


const Login: React.FC = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = login(username, password);
    if (!ok) toast.error('Invalid credentials. Please try again.');
    else toast.success('Welcome to Palmtrees Montessori CRM!');
  };

  const quickLogin = (u: string, p: string) => {
    setUsername(u);
    setPassword(p);
    setTimeout(() => login(u, p), 100);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, #f5e6d3 0%, #e8d5c4 50%, #d4b896 100%)' }}>
      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-8 bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden">
        {/* Left - branding */}
        <div className="hidden md:flex flex-col justify-between p-12 text-white relative" style={{ background: 'linear-gradient(135deg, #2D5016 0%, #4A7C2F 100%)' }}>
          <div>
            <div className="flex items-center gap-3 mb-12">
              <div className="bg-white rounded-2xl p-2 shadow-lg">
                <img src={LOGO_URL} alt="Palmtrees Montessori" className="w-12 h-12 object-contain" />
              </div>
              <div>
                <div className="font-bold text-xl leading-tight">Palmtrees</div>
                <div className="text-sm opacity-80">Montessori School</div>
              </div>
            </div>

            <h1 className="text-4xl font-bold leading-tight mb-4">Nurturing minds,<br/>growing futures.</h1>
            <p className="text-white/80 text-lg leading-relaxed">A comprehensive CRM system designed for our Montessori community — connecting families, teachers, and students in harmony with nature.</p>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-white/90"><div className="w-2 h-2 rounded-full bg-white/60"/> Student & Family Management</div>
            <div className="flex items-center gap-3 text-white/90"><div className="w-2 h-2 rounded-full bg-white/60"/> Montessori Progress Tracking</div>
            <div className="flex items-center gap-3 text-white/90"><div className="w-2 h-2 rounded-full bg-white/60"/> Lead & Communication Hub</div>
          </div>
        </div>

        {/* Right - login form */}
        <div className="p-8 md:p-12 flex flex-col justify-center">
          <div className="md:hidden flex items-center gap-3 mb-6">
            <div className="p-1.5 rounded-2xl bg-white shadow ring-1 ring-stone-200">
              <img src={LOGO_URL} alt="Palmtrees Montessori" className="w-9 h-9 object-contain" />
            </div>

            <div>
              <div className="font-bold text-lg" style={{ color: '#2D5016' }}>Palmtrees Montessori</div>
              <div className="text-xs text-stone-600">CRM System</div>
            </div>
          </div>
          <h2 className="text-3xl font-bold mb-2" style={{ color: '#2D5016' }}>Welcome back</h2>
          <p className="text-stone-600 mb-8">Sign in to access your dashboard</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Username or Email</label>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required
                className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:border-green-700 focus:ring-2 focus:ring-green-700/20 outline-none transition" placeholder="bzrich" />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:border-green-700 focus:ring-2 focus:ring-green-700/20 outline-none transition" placeholder="••••••••" />
            </div>
            <button type="submit" className="w-full py-3 rounded-xl text-white font-semibold flex items-center justify-center gap-2 transition hover:opacity-90 shadow-lg"
              style={{ background: 'linear-gradient(135deg, #2D5016 0%, #4A7C2F 100%)' }}>
              <LogIn className="w-5 h-5" /> Sign In
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-stone-200">
            <p className="text-xs text-stone-500 mb-3 font-medium">Quick Demo Login:</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button onClick={() => quickLogin('bzrich', 'CRM123#')} className="px-3 py-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-left transition">
                <div className="font-semibold text-stone-800">Admin</div>
                <div className="text-stone-500">Hendrik T.</div>
              </button>
              <button onClick={() => quickLogin('msjati', 'Guru123#')} className="px-3 py-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-left transition">
                <div className="font-semibold text-stone-800">Teacher</div>
                <div className="text-stone-500">Ms. Jati</div>
              </button>
              <button onClick={() => quickLogin('rini', 'Staff123#')} className="px-3 py-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-left transition">
                <div className="font-semibold text-stone-800">Office Staff</div>
                <div className="text-stone-500">Angelina R.</div>
              </button>
              <button onClick={() => quickLogin('johny', 'Ortu123#')} className="px-3 py-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-left transition">
                <div className="font-semibold text-stone-800">Parent</div>
                <div className="text-stone-500">Johny Patra</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
