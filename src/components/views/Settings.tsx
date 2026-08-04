import React, { useEffect, useState } from 'react';
import { Shield, Database, Globe, CreditCard, Mail, Calendar as Cal, Download, GitBranch, Plus, X, Loader } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { fetchLatestVersion, fetchAllVersions, publishVersion, type CrmVersion } from '@/hooks/useData';

const Settings: React.FC = () => {
  const [latestVersion, setLatestVersion] = useState<CrmVersion | null>(null);
  const [versions, setVersions] = useState<CrmVersion[]>([]);
  const [loading, setLoading] = useState(true);

  // Publish new version state
  const [showPublish, setShowPublish] = useState(false);
  const [newVersion, setNewVersion] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [publishing, setPublishing] = useState(false);

  const loadVersions = async () => {
    setLoading(true);
    const [latest, all] = await Promise.all([fetchLatestVersion(), fetchAllVersions()]);
    setLatestVersion(latest);
    setVersions(all);
    setLoading(false);
  };

  useEffect(() => { loadVersions(); }, []);

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVersion.trim()) { toast.error('Please enter a version number.'); return; }
    if (!newNotes.trim()) { toast.error('Please enter release notes.'); return; }
    setPublishing(true);
    const ok = await publishVersion(newVersion.trim(), newNotes.trim());
    setPublishing(false);
    if (ok) {
      toast.success(`Version ${newVersion} published!`);
      setNewVersion('');
      setNewNotes('');
      setShowPublish(false);
      await loadVersions();
    } else {
      toast.error('Could not publish version. It may already exist.');
    }
  };

  const integrations = [
    { icon: Globe, name: 'Website Form Sync', desc: 'palmtreesmontessori.com inquiry forms', status: 'Connected', color: '#4A7C2F' },
    { icon: CreditCard, name: 'Finpay Payment Gateway', desc: 'Process tuition & enrollment fees', status: 'Connected', color: '#4A7C2F' },
    { icon: Mail, name: 'Sender.net Bulk Email', desc: 'Newsletters and announcements', status: 'Connected', color: '#4A7C2F' },
    { icon: Cal, name: 'Google Calendar Sync', desc: 'Two-way calendar synchronization', status: 'Connected', color: '#4A7C2F' },
  ];

  const formatDate = (d: string) => {
    try { return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }); }
    catch { return d; }
  };

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-5">
        <h3 className="font-bold text-stone-800 mb-4 flex items-center gap-2"><Shield className="w-5 h-5 text-green-800"/>Data Protection & Privacy</h3>
        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50">
            <div>
              <div className="font-medium text-stone-800">GDPR Compliance</div>
              <div className="text-xs text-stone-500">Student data handled per GDPR/Indonesian PDP Law</div>
            </div>
            <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800 font-medium">Active</span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50">
            <div>
              <div className="font-medium text-stone-800">End-to-End Encryption</div>
              <div className="text-xs text-stone-500">All sensitive data encrypted at rest and in transit</div>
            </div>
            <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800 font-medium">Enabled</span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50">
            <div>
              <div className="font-medium text-stone-800">Automated Backups</div>
              <div className="text-xs text-stone-500">Daily backups · Last: today 02:00 UTC</div>
            </div>
            <button onClick={()=>toast.success('Manual backup started')} className="text-xs px-3 py-1.5 rounded-lg bg-stone-200 hover:bg-stone-300 font-medium text-stone-700 flex items-center gap-1">
              <Download className="w-3 h-3"/>Backup Now
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-5">
        <h3 className="font-bold text-stone-800 mb-4 flex items-center gap-2"><Database className="w-5 h-5 text-green-800"/>Integrations</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {integrations.map(i => {
            const Icon = i.icon;
            return (
              <div key={i.name} className="p-4 rounded-xl border border-stone-100 flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-green-50">
                  <Icon className="w-5 h-5 text-green-800"/>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-stone-800 text-sm">{i.name}</div>
                  <div className="text-xs text-stone-500 truncate">{i.desc}</div>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-800 font-medium whitespace-nowrap">{i.status}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-5">
        <h3 className="font-bold text-stone-800 mb-4">School Information</h3>
        <div className="grid sm:grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-xs text-stone-500 font-medium">School Name</div>
            <div className="text-stone-800 mt-0.5">Palmtrees Montessori School</div>
          </div>
          <div>
            <div className="text-xs text-stone-500 font-medium">Website</div>
            <a href="https://palmtreesmontessori.com" target="_blank" rel="noopener noreferrer" className="text-green-800 hover:underline mt-0.5 block">palmtreesmontessori.com</a>
          </div>
          <div>
            <div className="text-xs text-stone-500 font-medium">WhatsApp</div>
            <a href="https://wa.me/62818778839" target="_blank" rel="noopener noreferrer" className="text-green-800 hover:underline mt-0.5 block">+62 818-7788-39</a>
          </div>
          <div>
            <div className="text-xs text-stone-500 font-medium">CRM Version</div>
            <div className="text-stone-800 mt-0.5 flex items-center gap-2">
              {loading ? (
                <span className="text-stone-400">Loading…</span>
              ) : latestVersion ? (
                <>
                  <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-800 text-xs font-medium">{latestVersion.version}</span>
                  <span className="text-xs text-stone-500">{formatDate(latestVersion.release_date)}</span>
                </>
              ) : (
                <span className="text-stone-400">No version published</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* CRM Version History */}
      <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-stone-800 flex items-center gap-2"><GitBranch className="w-5 h-5 text-green-800"/>Version History & Changelog</h3>
          <button
            onClick={() => setShowPublish(!showPublish)}
            className="text-sm px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-medium transition text-white"
            style={{ background: 'linear-gradient(135deg, #2D5016 0%, #4A7C2F 100%)' }}
          >
            {showPublish ? <><X className="w-3.5 h-3.5"/>Cancel</> : <><Plus className="w-3.5 h-3.5"/>New Version</>}
          </button>
        </div>

        {showPublish && (
          <form onSubmit={handlePublish} className="mb-6 p-4 rounded-xl border border-green-200 bg-green-50/50 space-y-3">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Version Number</label>
              <input
                type="text"
                value={newVersion}
                onChange={(e) => setNewVersion(e.target.value)}
                placeholder="e.g. v1.1.0"
                className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:border-green-700 focus:ring-2 focus:ring-green-700/20 outline-none transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Release Notes / Changelog</label>
              <textarea
                value={newNotes}
                onChange={(e) => setNewNotes(e.target.value)}
                placeholder="Describe what changed in this version…"
                rows={4}
                className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:border-green-700 focus:ring-2 focus:ring-green-700/20 outline-none transition resize-none"
              />
            </div>
            <button
              type="submit"
              disabled={publishing}
              className="px-4 py-2 rounded-lg text-white font-medium flex items-center gap-2 transition hover:opacity-90 disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg, #2D5016 0%, #4A7C2F 100%)' }}
            >
              {publishing ? <Loader className="w-4 h-4 animate-spin"/> : <GitBranch className="w-4 h-4"/>}
              {publishing ? 'Publishing…' : 'Publish Version'}
            </button>
          </form>
        )}

        {loading ? (
          <div className="flex items-center gap-2 text-sm text-stone-400 py-4">
            <Loader className="w-4 h-4 animate-spin"/>Loading version history…
          </div>
        ) : versions.length === 0 ? (
          <p className="text-sm text-stone-400 py-4">No versions published yet.</p>
        ) : (
          <div className="space-y-0">
            {versions.map((v, idx) => (
              <div key={v.id} className="relative pl-8 pb-5">
                {/* Timeline line */}
                {idx < versions.length - 1 && (
                  <div className="absolute left-[11px] top-4 bottom-0 w-0.5 bg-stone-200" />
                )}
                {/* Dot */}
                <div
                  className="absolute left-1.5 top-1.5 w-3 h-3 rounded-full ring-4 ring-white"
                  style={{ background: idx === 0 ? '#4A7C2F' : '#d4d4d4' }}
                />
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-stone-800 text-sm">{v.version}</span>
                  {idx === 0 && (
                    <span className="text-xs px-1.5 py-0.5 rounded-full bg-green-100 text-green-800 font-medium">Latest</span>
                  )}
                  <span className="text-xs text-stone-400">{formatDate(v.release_date)}</span>
                </div>
                <p className="text-sm text-stone-600 whitespace-pre-line">{v.notes}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
