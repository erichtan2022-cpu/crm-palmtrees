import React from 'react';
import { Shield, Database, Globe, CreditCard, Mail, Calendar as Cal, Download } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

const Settings: React.FC = () => {
  const integrations = [
    { icon: Globe, name: 'Website Form Sync', desc: 'palmtreesmontessori.com inquiry forms', status: 'Connected', color: '#4A7C2F' },
    { icon: CreditCard, name: 'Finpay Payment Gateway', desc: 'Process tuition & enrollment fees', status: 'Connected', color: '#4A7C2F' },
    { icon: Mail, name: 'Sender.net Bulk Email', desc: 'Newsletters and announcements', status: 'Connected', color: '#4A7C2F' },
    { icon: Cal, name: 'Google Calendar Sync', desc: 'Two-way calendar synchronization', status: 'Connected', color: '#4A7C2F' },
  ];

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
            <div className="text-stone-800 mt-0.5">v1.0.0</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
