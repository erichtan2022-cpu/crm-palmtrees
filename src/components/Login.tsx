import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/sonner';
import { LogIn, Loader, Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { LOGO_URL } from '@/data/mockData';
import { supabase } from '@/lib/supabase';

const Login: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Forgot password state
  const [showForgot, setShowForgot] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const ok = await login(email, password);
    setLoading(false);
    if (!ok) toast.error('Invalid credentials. Please try again.');
    else toast.success('Welcome to Palmtrees Montessori CRM!');
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
      redirectTo: window.location.origin,
    });
    setResetLoading(false);
    if (error) {
      toast.error('Could not send reset email. Please check the address and try again.');
    } else {
      setResetSent(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, #f5e6d3 0%, #e8d5c4 50%, #d4b896 100%)' }}>
      <div className="w-full max-w-5xl grid md:grid-cols-2 bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden">
        {/* Left — branding */}
        <div className="hidden md:flex flex-col justify-between p-12 text-white" style={{ background: 'linear-gradient(135deg, #2D5016 0%, #4A7C2F 100%)' }}>
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

        {/* Right — login / forgot password form */}
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

          {!showForgot ? (
            <>
              <h2 className="text-3xl font-bold mb-2" style={{ color: '#2D5016' }}>Welcome back</h2>
              <p className="text-stone-600 mb-8">Sign in to access your dashboard</p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:border-green-700 focus:ring-2 focus:ring-green-700/20 outline-none transition"
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:border-green-700 focus:ring-2 focus:ring-green-700/20 outline-none transition"
                    placeholder="••••••••"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl text-white font-semibold flex items-center justify-center gap-2 transition hover:opacity-90 shadow-lg disabled:opacity-60"
                  style={{ background: 'linear-gradient(135deg, #2D5016 0%, #4A7C2F 100%)' }}
                >
                  {loading ? <Loader className="w-5 h-5 animate-spin" /> : <LogIn className="w-5 h-5" />}
                  {loading ? 'Signing in…' : 'Sign In'}
                </button>
              </form>

              <button
                type="button"
                onClick={() => { setShowForgot(true); setResetSent(false); setResetEmail(email); }}
                className="mt-4 text-sm text-green-800 hover:underline font-medium"
              >
                Forgot password?
              </button>
            </>
          ) : resetSent ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
                <CheckCircle className="w-9 h-9 text-green-800" />
              </div>
              <h2 className="text-2xl font-bold mb-3" style={{ color: '#2D5016' }}>Check your email</h2>
              <p className="text-stone-600 mb-6 max-w-sm mx-auto">
                We've sent a password reset link to <span className="font-medium text-stone-800">{resetEmail}</span>.
                Click the link in the email to set a new password.
              </p>
              <button
                type="button"
                onClick={() => { setShowForgot(false); setResetSent(false); }}
                className="inline-flex items-center gap-2 text-sm text-green-800 hover:underline font-medium"
              >
                <ArrowLeft className="w-4 h-4" /> Back to sign in
              </button>
            </div>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setShowForgot(false)}
                className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-stone-700 mb-6"
              >
                <ArrowLeft className="w-4 h-4" /> Back to sign in
              </button>

              <h2 className="text-3xl font-bold mb-2" style={{ color: '#2D5016' }}>Reset password</h2>
              <p className="text-stone-600 mb-8">Enter your email and we'll send you a secure link to set a new password.</p>

              <form onSubmit={handleReset} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">Email</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      required
                      autoFocus
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-300 focus:border-green-700 focus:ring-2 focus:ring-green-700/20 outline-none transition"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={resetLoading}
                  className="w-full py-3 rounded-xl text-white font-semibold flex items-center justify-center gap-2 transition hover:opacity-90 shadow-lg disabled:opacity-60"
                  style={{ background: 'linear-gradient(135deg, #2D5016 0%, #4A7C2F 100%)' }}
                >
                  {resetLoading ? <Loader className="w-5 h-5 animate-spin" /> : <Mail className="w-5 h-5" />}
                  {resetLoading ? 'Sending…' : 'Send reset link'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
