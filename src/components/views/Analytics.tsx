import React from 'react';
import { analyticsData } from '@/data/mockData';
import { useLeads } from '@/hooks/useData';
import { TrendingUp, Globe, FormInput, Target } from 'lucide-react';

const Analytics: React.FC = () => {
  const { data: leads } = useLeads();
  const sourceStats = ['Website','Instagram','Google Ads','Referral','Walk-in'].map(s => ({
    name: s, count: leads.filter(l => l.source === s).length
  }));

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-5">
          <div className="p-2 rounded-xl bg-green-50 w-fit"><Globe className="w-4 h-4 text-green-800"/></div>
          <div className="text-2xl font-bold text-stone-800 mt-3">{analyticsData.pageViews}</div>
          <div className="text-xs text-stone-500">Page Views (7d)</div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-5">
          <div className="p-2 rounded-xl bg-amber-50 w-fit"><FormInput className="w-4 h-4 text-amber-700"/></div>
          <div className="text-2xl font-bold text-stone-800 mt-3">{analyticsData.formSubmissions}</div>
          <div className="text-xs text-stone-500">Form Submissions</div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-5">
          <div className="p-2 rounded-xl bg-blue-50 w-fit"><Target className="w-4 h-4 text-blue-700"/></div>
          <div className="text-2xl font-bold text-stone-800 mt-3">{analyticsData.conversionRate}%</div>
          <div className="text-xs text-stone-500">Conversion Rate</div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-5">
          <div className="p-2 rounded-xl bg-stone-100 w-fit"><TrendingUp className="w-4 h-4 text-stone-700"/></div>
          <div className="text-2xl font-bold text-stone-800 mt-3">+18%</div>
          <div className="text-xs text-stone-500">Growth (MoM)</div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-5">
          <h3 className="font-bold text-stone-800 mb-4">Daily Visitors</h3>
          <div className="flex items-end gap-2 h-48">
            {analyticsData.visitors.map(d => (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                <div className="text-xs text-stone-600 font-medium">{d.value}</div>
                <div className="w-full rounded-t-lg" style={{height:`${(d.value/350)*100}%`, background:'linear-gradient(180deg, #4A7C2F, #2D5016)', minHeight:'8px'}}/>
                <div className="text-xs text-stone-500">{d.day}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-5">
          <h3 className="font-bold text-stone-800 mb-4">Lead Sources (Live from DB)</h3>
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
                    <div className="h-full rounded-full" style={{width:`${(s.count/max)*100}%`, background:'#4A7C2F'}}/>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

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
              ].map((r,i) => (
                <tr key={i} className="text-stone-700">
                  <td className="py-3 pr-4 font-medium text-stone-800">{r.c}</td>
                  <td className="py-3 pr-4">{r.ch}</td>
                  <td className="py-3 pr-4">{r.i.toLocaleString()}</td>
                  <td className="py-3 pr-4">{r.cl}</td>
                  <td className="py-3 pr-4 font-semibold" style={{color:'#2D5016'}}>{r.l}</td>
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
