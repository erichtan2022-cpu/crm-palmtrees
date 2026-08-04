import React, { useEffect, useState, useMemo } from 'react';
import { History, Search, Loader, Plus, Pencil, Trash2, UserPlus, Mail, Calendar, TrendingUp, HandHeart, Clock, GitBranch, LogIn } from 'lucide-react';
import { fetchActivityLogs, type ActivityLogEntry } from '@/hooks/useData';

const ROLE_COLORS: Record<string, string> = {
  admin: '#2D5016',
  teacher: '#4A7C2F',
  staff: '#D2A679',
  parent: '#8B4513',
};

const ACTION_CONFIG: Record<string, { icon: React.ElementType; color: string; label: string }> = {
  create: { icon: Plus, color: '#4A7C2F', label: 'Created' },
  update: { icon: Pencil, color: '#D2A679', label: 'Updated' },
  delete: { icon: Trash2, color: '#B91C1C', label: 'Deleted' },
  enroll: { icon: UserPlus, color: '#2D5016', label: 'Enrolled' },
  publish_version: { icon: GitBranch, color: '#2563EB', label: 'Published' },
};

const ENTITY_ICONS: Record<string, React.ElementType> = {
  student: UserPlus,
  parent: UserPlus,
  lead: TrendingUp,
  event: Calendar,
  volunteer: HandHeart,
  waitlist: Clock,
  message: Mail,
  crm_version: GitBranch,
};

const ENTITY_LABELS: Record<string, string> = {
  student: 'Student',
  parent: 'Parent',
  lead: 'Lead',
  event: 'Event',
  volunteer: 'Volunteer',
  waitlist: 'Waitlist',
  message: 'Message',
  crm_version: 'CRM Version',
};

const ActivityLog: React.FC = () => {
  const [logs, setLogs] = useState<ActivityLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [entityFilter, setEntityFilter] = useState('all');

  useEffect(() => {
    (async () => {
      setLoading(true);
      const data = await fetchActivityLogs(300);
      setLogs(data);
      setLoading(false);
    })();
  }, []);

  const filtered = useMemo(() => {
    return logs.filter(l => {
      if (actionFilter !== 'all' && l.action !== actionFilter) return false;
      if (entityFilter !== 'all' && l.entity_type !== entityFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          l.description?.toLowerCase().includes(q) ||
          l.user_name?.toLowerCase().includes(q) ||
          l.entity_type?.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [logs, search, actionFilter, entityFilter]);

  const formatTime = (ts: string) => {
    try {
      const d = new Date(ts);
      const now = new Date();
      const diff = (now.getTime() - d.getTime()) / 1000;
      if (diff < 60) return 'just now';
      if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
      if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
      if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch { return ts; }
    }

  const formatFullTime = (ts: string) => {
    try { return new Date(ts).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }); }
    catch { return ts; }
  };

  const entityTypes = ['all', ...Array.from(new Set(logs.map(l => l.entity_type)))];
  const actionTypes = ['all', ...Array.from(new Set(logs.map(l => l.action)))];

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, description, or entity…"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 focus:border-green-700 focus:ring-2 focus:ring-green-700/20 outline-none transition text-sm"
            />
          </div>
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="px-3 py-2.5 rounded-xl border border-stone-300 focus:border-green-700 focus:ring-2 focus:ring-green-700/20 outline-none transition text-sm bg-white"
          >
            {actionTypes.map(a => (
              <option key={a} value={a}>{a === 'all' ? 'All Actions' : ACTION_CONFIG[a]?.label || a}</option>
            ))}
          </select>
          <select
            value={entityFilter}
            onChange={(e) => setEntityFilter(e.target.value)}
            className="px-3 py-2.5 rounded-xl border border-stone-300 focus:border-green-700 focus:ring-2 focus:ring-green-700/20 outline-none transition text-sm bg-white"
          >
            {entityTypes.map(e => (
              <option key={e} value={e}>{e === 'all' ? 'All Types' : ENTITY_LABELS[e] || e}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Log entries */}
      <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-5">
        <div className="flex items-center gap-2 mb-4">
          <History className="w-5 h-5 text-green-800" />
          <h3 className="font-bold text-stone-800">Activity History</h3>
          <span className="text-xs text-stone-400 ml-1">({filtered.length} {filtered.length === 1 ? 'entry' : 'entries'})</span>
        </div>

        {loading ? (
          <div className="flex items-center gap-2 text-sm text-stone-400 py-8 justify-center">
            <Loader className="w-5 h-5 animate-spin"/>Loading activity log…
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-stone-400">
            <History className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p className="text-sm">No activity logged yet. Changes made in the CRM will appear here.</p>
          </div>
        ) : (
          <div className="space-y-0">
            {filtered.map((log, idx) => {
              const actCfg = ACTION_CONFIG[log.action] || { icon: LogIn, color: '#78716c', label: log.action };
              const EntityIcon = ENTITY_ICONS[log.entity_type] || LogIn;
              const ActIcon = actCfg.icon;
              const roleColor = ROLE_COLORS[log.user_role || ''] || '#78716c';

              return (
                <div key={log.id} className="relative pl-10 pb-4">
                  {/* Timeline line */}
                  {idx < filtered.length - 1 && (
                    <div className="absolute left-[15px] top-5 bottom-0 w-0.5 bg-stone-100" />
                  )}
                  {/* Action dot */}
                  <div
                    className="absolute left-1 top-1 w-8 h-8 rounded-full flex items-center justify-center ring-4 ring-white"
                    style={{ background: actCfg.color + '20' }}
                  >
                    <ActIcon className="w-4 h-4" style={{ color: actCfg.color }} />
                  </div>

                  <div className="pt-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-stone-800">
                          <span className="font-medium">{log.user_name || 'System'}</span>
                          <span className="text-stone-500"> {actCfg.label.toLowerCase()} </span>
                          <span className="inline-flex items-center gap-1 text-xs font-medium px-1.5 py-0.5 rounded-full bg-stone-100 text-stone-600">
                            <EntityIcon className="w-3 h-3" />
                            {ENTITY_LABELS[log.entity_type] || log.entity_type}
                          </span>
                        </p>
                        <p className="text-sm text-stone-600 mt-0.5">{log.description}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <span className="text-xs text-stone-400 whitespace-nowrap" title={formatFullTime(log.created_at)}>
                          {formatTime(log.created_at)}
                        </span>
                        {log.user_role && (
                          <span
                            className="text-xs px-1.5 py-0.5 rounded-full text-white font-medium capitalize"
                            style={{ background: roleColor }}
                          >
                            {log.user_role}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityLog;
