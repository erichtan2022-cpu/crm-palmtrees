import React, { useState } from 'react';
import { emailTemplates } from '@/data/mockData';
import { useMessages, logMessage } from '@/hooks/useData';
import { Mail, MessageSquare, Smartphone, Send, FileText, Users } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

const Communications: React.FC = () => {
  const { data: messages, refresh, loading } = useMessages();
  const [tab, setTab] = useState<'compose'|'templates'|'history'>('compose');
  const [channel, setChannel] = useState<'email'|'sms'|'whatsapp'>('email');
  const [recipient, setRecipient] = useState('All Parents');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    await logMessage({
      to: recipient,
      subject: subject || `${channel.toUpperCase()} message`,
      channel,
      date: new Date().toISOString().split('T')[0],
      status: 'sent',
      preview: body.slice(0, 80),
    });
    toast.success(`${channel.toUpperCase()} sent to ${recipient}! Logged in history.`);
    setSubject(''); setBody('');
    refresh();
  };

  const useTemplate = (t: typeof emailTemplates[0]) => {
    setSubject(t.subject);
    setBody(t.body);
    setTab('compose');
    toast.success('Template loaded');
  };

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-1.5 inline-flex">
        {(['compose','templates','history'] as const).map(t => (
          <button key={t} onClick={()=>setTab(t)} className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition ${tab===t?'text-white shadow':'text-stone-600 hover:text-stone-800'}`}
            style={tab===t?{background:'#4A7C2F'}:{}}>{t}</button>
        ))}
      </div>

      {tab==='compose' && (
        <div className="grid lg:grid-cols-3 gap-4">
          <form onSubmit={send} className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-stone-100 p-5 space-y-4">
            <div className="flex gap-2">
              {[
                {key:'email',label:'Email',icon:Mail},
                {key:'sms',label:'SMS',icon:Smartphone},
                {key:'whatsapp',label:'WhatsApp',icon:MessageSquare},
              ].map(c => {
                const Icon = c.icon;
                return (
                  <button type="button" key={c.key} onClick={()=>setChannel(c.key as any)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition ${channel===c.key?'text-white shadow':'bg-stone-100 text-stone-700 hover:bg-stone-200'}`}
                    style={channel===c.key?{background:'#4A7C2F'}:{}}>
                    <Icon className="w-4 h-4"/>{c.label}
                  </button>
                );
              })}
            </div>
            <div>
              <label className="text-xs font-medium text-stone-600 block mb-1">Recipients</label>
              <select value={recipient} onChange={(e)=>setRecipient(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm">
                <option>All Parents</option>
                <option>Toddler Class Parents</option>
                <option>Primary Class Parents</option>
                <option>Lower Elementary Parents</option>
                <option>Upper Elementary Parents</option>
                <option>Active Leads</option>
                <option>Waitlist Families</option>
              </select>
            </div>
            {channel==='email' && (
              <div>
                <label className="text-xs font-medium text-stone-600 block mb-1">Subject</label>
                <input value={subject} onChange={(e)=>setSubject(e.target.value)} required className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm outline-none focus:border-green-700"/>
              </div>
            )}
            <div>
              <label className="text-xs font-medium text-stone-600 block mb-1">Message</label>
              <textarea value={body} onChange={(e)=>setBody(e.target.value)} required rows={8} className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm outline-none focus:border-green-700"/>
            </div>
            <button type="submit" className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-medium" style={{background:'#4A7C2F'}}>
              <Send className="w-4 h-4"/>Send {channel === 'email' ? 'Email' : channel === 'sms' ? 'SMS' : 'WhatsApp'}
            </button>
          </form>

          <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-5">
            <h3 className="font-bold text-stone-800 mb-3 flex items-center gap-2"><Users className="w-4 h-4"/>Quick Stats</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-stone-600">Messages logged</span><span className="font-bold">{messages.length}</span></div>
              <div className="flex justify-between"><span className="text-stone-600">Open rate (email)</span><span className="font-bold text-green-700">68%</span></div>
              <div className="flex justify-between"><span className="text-stone-600">Active templates</span><span className="font-bold">{emailTemplates.length}</span></div>
              <div className="flex justify-between"><span className="text-stone-600">Newsletter subs</span><span className="font-bold">186</span></div>
            </div>
            <div className="mt-4 pt-4 border-t border-stone-100 text-xs text-stone-500">
              Integrated with <span className="font-medium text-stone-700">sender.net</span> for bulk email delivery
            </div>
          </div>
        </div>
      )}

      {tab==='templates' && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {emailTemplates.map(t => (
            <div key={t.id} className="bg-white rounded-2xl shadow-sm border border-stone-100 p-5 hover:shadow-md transition">
              <div className="flex items-start gap-3 mb-3">
                <div className="p-2 rounded-xl bg-green-50"><FileText className="w-4 h-4 text-green-800"/></div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-stone-800 text-sm">{t.name}</div>
                  <div className="text-xs text-stone-500 mt-0.5">{t.subject}</div>
                </div>
              </div>
              <p className="text-xs text-stone-600 line-clamp-3 mb-3">{t.body}</p>
              <button onClick={()=>useTemplate(t)} className="w-full py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-xs font-medium text-stone-700">Use Template</button>
            </div>
          ))}
        </div>
      )}

      {tab==='history' && (
        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
          {loading ? <div className="p-8 text-center text-stone-500">Loading…</div> : (
            <div className="divide-y divide-stone-100">
              {messages.map(m => (
                <div key={m.id} className="p-4 flex items-start gap-4 hover:bg-stone-50">
                  <div className="p-2 rounded-xl bg-green-50">
                    {m.channel === 'email' ? <Mail className="w-4 h-4 text-green-800"/> : m.channel === 'sms' ? <Smartphone className="w-4 h-4 text-green-800"/> : <MessageSquare className="w-4 h-4 text-green-800"/>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2 mb-1">
                      <div className="font-semibold text-stone-800 text-sm">{m.subject}</div>
                      <span className="text-xs text-stone-500 whitespace-nowrap">{m.date}</span>
                    </div>
                    <div className="text-xs text-stone-500 mb-1">To: {m.to}</div>
                    <div className="text-sm text-stone-600">{m.preview}</div>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-800 font-medium capitalize">{m.status}</span>
                </div>
              ))}
              {messages.length === 0 && <div className="p-8 text-center text-stone-500 text-sm">No messages yet</div>}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Communications;
