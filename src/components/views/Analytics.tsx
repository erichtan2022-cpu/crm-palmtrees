import React from 'react';
import { analyticsData } from '@/data/mockData';
import { useLeads, useStudents, useParents, useWaitlist } from '@/hooks/useData';
import { TrendingUp, Globe, FolderInput as FormInput, Target, Users, Heart, UserPlus, Clock } from 'lucide-react';

const Analytics: React.FC = () => {
  const { data: leads } = useLeads();
  const { data: students } = useStudents();
  const { data: parents } = useParents();
  const { data: waitlist } = useWaitlist();

  const sourceStats = ['Website', 'Instagram', 'Google Ads', 'Referral', 'Walk-in'].map(s => ({
    name: s,
    count: leads.filter(l => l.source === s).length,
  }));

  const enrolledLeads = leads.filter(l => l.status === 'Enrolled').length;
  const conversionRate = leads.length > 0 ? ((enrolledLeads / leads.length) * 100).toFixed(1) : '0.0';

  const classroomBreakdown = ['Toddler', 'Primary', 'Lower Elementary', 'Upper Elementary'].map(c => ({
    name: c,
    count: students.filter(s => s.classroom === c).length,
  }));

  const leadStatusBreakdown = ['Inquiry', 'Tour Scheduled', 'Tour Completed', 'Applied', 'Enrolled'].map(s => ({
    name: s,
    count: leads.filter(l => l.status === s).length,
  }));

  return (
    <div className="space-y-5">
      {/* Live DB stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-5">
          <div className="p-2 rounded-xl bg-green-50 w-fit"><Users className="w-4 h-4 text-green-800" /></div>
          <div className="text-2xl font-bold text-stone-800 mt-3">{students.length}</div>
          <div className="text-xs text-stone-500">Active Students</div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-5">
          <div className="p-2 rounded-xl bg-amber-50 w-fit"><Heart className="w-4 h-4 text-amber-700" /></div>
          <div className="text-2xl font-bold text-stone-800 mt-3">{parents.length}</div>
          <div className="text-xs text-stone-500">Families Enrolled</div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-5">
          <div className="p-2 rounded-xl bg-blue-50 w-fit"><UserPlus className="w-4 h-4 text-blue-700" /></div>
          <div className="text-2xl font-bold text-stone-800 mt-3">{leads.length}</div>
          <div className="text-xs text-stone-500">Total Leads</div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-5">
          <div className="p-2 rounded-xl bg-stone-100 w-fit"><Clock className="w-4 h-4 text-stone-700" /></div>
          <div className="text-2xl font-bold text-stone-800 mt-3">{waitlist.length}</div>
          <div className="text-xs text-stone-500">On Waitlist</div>
        </div>
      </div>

      {/* Website analytics (static) + Lead pipeline */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-5">
          <div className="p-2 rounded-xl bg-green-50 w-fit"><Globe className="w-4 h-4 text-green-800" /></div>
          <div className="text-2xl font-bold text-stone-800 mt-3">{analyticsData.pageViews}</div>
          <div className="text-xs text-stone-500">Page Views (7d)</div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-5">
          <div className="p-2 rounded-xl bg-amber-50 w-fit"><FormInput className="w-4 h-4 text-amber-700" /></div>
          <div className="text-2xl font-bold text-stone-800 mt-3">{analyticsData.formSubmissions}</div>
          <div className="text-xs text-stone-500">Form Submissions</div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-5">
          <div className="p-2 rounded-xl bg-blue-50 w-fit"><Target className="w-4 h-4 text-blue-700" /></div>
          <div className="text-2xl font-bold text-stone-800 mt-3">{conversionRate}%</div>
          <div className="text-xs text-stone-500">Lead Conversion</div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-5">
          <div className="p-2 rounded-xl bg-stone-100 w-fit"><TrendingUp className="w-4 h-4 text-stone-700" /></div>
          <div className="text-2xl font-bold text-stone-800 mt-3">+18%</div>
          <div className="text-xs text-stone-500">Growth (MoM)</div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Visitors bar chart */}
        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-5">
          <h3 className="font-bold text-stone-800 mb-4">Daily Website Visitors</h3>
          <div className="flex items-end gap-2 h-48">
            {analyticsData.visitors.map(d => (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                <div className="text-xs text-stone-600 font-medium">{d.value}</div>
                <div className="w-full rounded-t-lg" style={{ height: `${(d.value / 350) * 100}%`, background: 'linear-gradient(180deg, #4A7C2F, #2D5016)', minHeight: '8px' }} />
                <div className="text-xs text-stone-500">{d.day}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Lead sources — live */}
        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-5">
          <h3 className="font-bold text-stone-800 mb-4">Lead Sources <span className="text-xs font-normal text-green-700 bg-green-50 px-2 py-0.5 rounded-full ml-1">Live</span></h3>
          <div className="space-y-3">
            {sourceStats.map(s => {
              const max = Math.max(...sourceStats.map(x => x.count), 1);
              return (
                <div key={s.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-stone-700">{s.name}</span>
                    <span className="font-medium text-stone-800">{s.count}</span>
                  </div>
                  <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${(s.count / max) * 100}%`, background: '#4A7C2F' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Classroom breakdown — live */}
        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-5">
          <h3 className="font-bold text-stone-800 mb-4">Students by Classroom <span className="text-xs font-normal text-green-700 bg-green-50 px-2 py-0.5 rounded-full ml-1">Live</span></h3>
          <div className="space-y-3">
            {classroomBreakdown.map(c => {
              const max = Math.max(...classroomBreakdown.map(x => x.count), 1);
              const colors: Record<string, string> = { Toddler: '#D2A679', Primary: '#4A7C2F', 'Lower Elementary': '#8B4513', 'Upper Elementary': '#2D5016' };
              return (
                <div key={c.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-stone-700">{c.name}</span>
                    <span className="font-medium text-stone-800">{c.count} students</span>
                  </div>
                  <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${(c.count / max) * 100}%`, background: colors[c.name] }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Lead pipeline — live */}
        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-5">
          <h3 className="font-bold text-stone-800 mb-4">Lead Pipeline <span className="text-xs font-normal text-green-700 bg-green-50 px-2 py-0.5 rounded-full ml-1">Live</span></h3>
          <div className="space-y-2">
            {leadStatusBreakdown.map(s => (
              <div key={s.name} className="flex items-center justify-between p-3 rounded-xl bg-stone-50">
                <span className="text-sm text-stone-700">{s.name}</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-1.5 bg-stone-200 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${leads.length > 0 ? (s.count / leads.length) * 100 : 0}%`, background: '#4A7C2F' }} />
                  </div>
                  <span className="text-sm font-bold text-stone-800 w-6 text-right">{s.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Marketing campaigns — static reference data */}
      <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-5">
        <h3 className="font-bold text-stone-800 mb-4">Marketing Campaigns</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-stone-500 border-b border-stone-100">
                <th className="py-2 pr-4">Campaign</th>
                <th className="py-2 pr-4">Channel</th>
                <th className="py-2 pr-4">Impressions</th>
                <th className="py-2 pr-4">Clicks</th>
                <th className="py-2 pr-4">Leads</th>
                <th className="py-2">ROI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {[
                { c: 'Open House May', ch: 'Instagram', i: 4200, cl: 312, l: 18, roi: '4.2x' },
                { c: 'Toddler Program', ch: 'Google Ads', i: 6800, cl: 245, l: 12, roi: '2.8x' },
                { c: 'Referral Bonus', ch: 'Email', i: 186, cl: 92, l: 8, roi: '6.1x' },
                { c: 'Spring Tours', ch: 'Website', i: 1520, cl: 478, l: 24, roi: '5.4x' },
              ].map((r, i) => (
                <tr key={i} className="text-stone-700">
                  <td className="py-3 pr-4 font-medium text-stone-800">{r.c}</td>
                  <td className="py-3 pr-4">{r.ch}</td>
                  <td className="py-3 pr-4">{r.i.toLocaleString()}</td>
                  <td className="py-3 pr-4">{r.cl}</td>
                  <td className="py-3 pr-4 font-semibold" style={{ color: '#2D5016' }}>{r.l}</td>
                  <td className="py-3 text-green-700 font-bold">{r.roi}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
