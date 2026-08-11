import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { Student, Parent, Lead, Event, Message, Volunteer, Waitlist } from '@/data/mockData';
import {
  seedStudents, seedParents, seedLeads, seedEvents, seedMessages, seedWaitlist, seedVolunteers
} from '@/data/seedData';

// ---------- Activity logging ----------
export interface ActivityActor {
  id: string;
  name: string;
  role: string;
}

let currentActor: ActivityActor | null = null;

export function setActivityActor(actor: ActivityActor | null) {
  currentActor = actor;
}

export async function logActivity(
  action: string,
  entityType: string,
  description: string,
  entityId?: string,
) {
  if (!currentActor) return;
  try {
    await supabase.from('activity_log').insert({
      user_id: currentActor.id,
      user_name: currentActor.name,
      user_role: currentActor.role,
      action,
      entity_type: entityType,
      entity_id: entityId || null,
      description,
    });
  } catch (e) {
    console.error('Failed to log activity:', e);
  }
}

// ---------- CRM version helpers ----------
export interface CrmVersion {
  id: string;
  version: string;
  release_date: string;
  notes: string;
  created_at: string;
}

export async function fetchLatestVersion(): Promise<CrmVersion | null> {
  const { data, error } = await supabase
    .from('crm_versions')
    .select('*')
    .order('release_date', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error || !data) return null;
  return data as CrmVersion;
}

export async function fetchAllVersions(): Promise<CrmVersion[]> {
  const { data, error } = await supabase
    .from('crm_versions')
    .select('*')
    .order('release_date', { ascending: false });
  if (error || !data) return [];
  return data as CrmVersion[];
}

export async function publishVersion(version: string, notes: string): Promise<boolean> {
  const { error } = await supabase.from('crm_versions').insert({
    version,
    release_date: new Date().toISOString().split('T')[0],
    notes,
    published_by: currentActor?.id || null,
  });
  if (error) { console.error(error); return false; }
  await logActivity('publish_version', 'crm_version', `Published new CRM version ${version}`, undefined);
  return true;
}

// ---------- Activity log fetching ----------
export interface ActivityLogEntry {
  id: string;
  user_id: string | null;
  user_name: string | null;
  user_role: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  description: string;
  created_at: string;
}

export async function fetchActivityLogs(limit = 200): Promise<ActivityLogEntry[]> {
  const { data, error } = await supabase
    .from('activity_log')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error || !data) return [];
  return data as ActivityLogEntry[];
}

// ---------- Mappers (DB row → app type) ----------
const mapStudent = (r: any): Student => ({
  id: r.id, name: r.name, photo: r.photo, age: r.age, dob: r.dob,
  enrollmentDate: r.enrollment_date, classroom: r.classroom,
  medicalInfo: r.medical_info, allergies: r.allergies || [],
  emergencyContact: r.emergency_contact, emergencyPhone: r.emergency_phone,
  parentIds: r.parent_ids || [], status: r.status,
  attendance: r.attendance || [], milestones: r.milestones || [], observations: r.observations || [],
});

const mapParent = (r: any): Parent => ({
  id: r.id, name: r.name, email: r.email, phone: r.phone, relation: r.relation,
  childIds: r.child_ids || [], preferredChannel: r.preferred_channel,
  privacyConsent: r.privacy_consent, avatar: r.avatar,
});

const mapLead = (r: any): Lead => ({
  id: r.id, parentName: r.parent_name, childName: r.child_name, childAge: r.child_age,
  email: r.email, phone: r.phone, source: r.source, status: r.status,
  inquiryDate: r.inquiry_date, tourDate: r.tour_date, notes: r.notes || '',
  followUpDate: r.follow_up_date,
});

const mapEvent = (r: any): Event => ({
  id: r.id, title: r.title, date: r.date, time: r.time, type: r.type,
  classroom: r.classroom, description: r.description || '',
});

const mapMessage = (r: any): Message => ({
  id: r.id, to: r.to_recipient, subject: r.subject, channel: r.channel,
  date: r.date, status: r.status, preview: r.preview,
});

const mapVolunteer = (r: any): Volunteer => ({
  id: r.id, name: r.name, parent: r.parent, skills: r.skills || [],
  hours: r.hours, upcomingEvent: r.upcoming_event, avatar: r.avatar || '',
});

const mapWaitlist = (r: any): Waitlist => ({
  id: r.id, childName: r.child_name, parentName: r.parent_name, age: r.age,
  desiredClass: r.desired_class, joinDate: r.join_date, priority: r.priority, notes: r.notes,
});

// ---------- One-time seeding ----------
let seeded = false;
let seedingPromise: Promise<void> | null = null;

async function seedIfEmpty() {
  if (seeded) return;
  if (seedingPromise) return seedingPromise;

  seedingPromise = (async () => {
    const { data, error } = await supabase.from('students').select('id').limit(1);
    if (error) { console.error('Seed check failed:', error); return; }
    if (data && data.length > 0) { seeded = true; return; }

    console.log('Seeding database...');
    await supabase.from('students').insert(seedStudents);
    await supabase.from('parents').insert(seedParents);
    await supabase.from('leads').insert(seedLeads);
    await supabase.from('events').insert(seedEvents);
    await supabase.from('messages').insert(seedMessages);
    await supabase.from('waitlist').insert(seedWaitlist);
    await supabase.from('volunteers').insert(seedVolunteers);
    seeded = true;
    console.log('Seeding complete.');
  })();
  return seedingPromise;
}

// ---------- Generic table hook factory ----------
function createTableHook<T>(table: string, mapper: (r: any) => T, orderCol = 'created_at') {
  return function useTable() {
    const [data, setData] = useState<T[]>([]);
    const [loading, setLoading] = useState(true);

    const refresh = useCallback(async () => {
      setLoading(true);
      await seedIfEmpty();
      const { data: rows, error } = await supabase.from(table).select('*').order(orderCol, { ascending: true });
      if (error) console.error(`Load ${table} failed:`, error);
      setData((rows || []).map(mapper));
      setLoading(false);
    }, []);

    useEffect(() => { refresh(); }, [refresh]);

    return { data, loading, refresh, setData };
  };
}

// ---------- Hooks ----------
export const useStudents = createTableHook<Student>('students', mapStudent);
export const useParents = createTableHook<Parent>('parents', mapParent);
export const useEvents = createTableHook<Event>('events', mapEvent, 'date');
export const useMessages = createTableHook<Message>('messages', mapMessage, 'date');
export const useVolunteers = createTableHook<Volunteer>('volunteers', mapVolunteer);

// ---------- CRUD-rich hooks ----------
export function useLeads() {
  const [data, setData] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    await seedIfEmpty();
    const { data: rows, error } = await supabase.from('leads').select('*').order('inquiry_date', { ascending: false });
    if (error) console.error(error);
    setData((rows || []).map(mapLead));
    setLoading(false);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const addLead = async (lead: Omit<Lead, 'id'>) => {
    const id = crypto.randomUUID();
    const { error } = await supabase.from('leads').insert({
      id, parent_name: lead.parentName, child_name: lead.childName, child_age: lead.childAge,
      email: lead.email, phone: lead.phone, source: lead.source, status: lead.status,
      inquiry_date: lead.inquiryDate, tour_date: lead.tourDate, notes: lead.notes,
    });
    if (error) { console.error(error); return null; }
    await logActivity('create', 'lead', `Added lead: ${lead.parentName} (${lead.childName})`, id);
    await refresh();
    return id;
  };

  const updateLeadStatus = async (id: string, status: Lead['status']) => {
    const { error } = await supabase.from('leads').update({ status }).eq('id', id);
    if (error) { console.error(error); return; }
    await logActivity('update', 'lead', `Updated lead status to "${status}"`, id);
    setData(prev => prev.map(l => l.id === id ? { ...l, status } : l));
  };

  const updateLead = async (id: string, lead: Partial<Lead>) => {
    const { error } = await supabase.from('leads').update({
      parent_name: lead.parentName, child_name: lead.childName, child_age: lead.childAge,
      email: lead.email, phone: lead.phone, source: lead.source, status: lead.status,
      tour_date: lead.tourDate, notes: lead.notes, follow_up_date: lead.followUpDate,
    }).eq('id', id);
    if (error) { console.error(error); return; }
    await logActivity('update', 'lead', `Updated lead: ${lead.parentName || ''}`, id);
    setData(prev => prev.map(l => l.id === id ? { ...l, ...lead } : l));
  };

  const deleteLead = async (id: string) => {
    const { error } = await supabase.from('leads').delete().eq('id', id);
    if (error) { console.error(error); return; }
    await logActivity('delete', 'lead', 'Deleted a lead', id);
    setData(prev => prev.filter(l => l.id !== id));
  };

  return { data, loading, refresh, addLead, updateLeadStatus, updateLead, deleteLead };
}


export function useWaitlist() {
  const [data, setData] = useState<Waitlist[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    await seedIfEmpty();
    const { data: rows, error } = await supabase.from('waitlist').select('*').order('position', { ascending: true });
    if (error) console.error(error);
    setData((rows || []).map(mapWaitlist));
    setLoading(false);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const reorder = async (newOrder: Waitlist[]) => {
    setData(newOrder);
    // Persist new positions
    await Promise.all(newOrder.map((w, idx) =>
      supabase.from('waitlist').update({ position: idx + 1 }).eq('id', w.id)
    ));
  };

  const removeFromWaitlist = async (id: string) => {
    const { error } = await supabase.from('waitlist').delete().eq('id', id);
    if (error) { console.error(error); return; }
    await logActivity('delete', 'waitlist', 'Removed entry from waitlist', id);
    setData(prev => prev.filter(w => w.id !== id));
  };

  const addToWaitlist = async (w: Omit<Waitlist, 'id'>) => {
    const id = crypto.randomUUID();
    const { error } = await supabase.from('waitlist').insert({
      id, child_name: w.childName, parent_name: w.parentName, age: w.age,
      desired_class: w.desiredClass, join_date: w.joinDate, priority: w.priority,
      notes: w.notes, position: data.length + 1,
    });
    if (error) { console.error(error); return null; }
    await logActivity('create', 'waitlist', `Added to waitlist: ${w.childName}`, id);
    await refresh();
    return id;
  };

  return { data, loading, refresh, reorder, removeFromWaitlist, addToWaitlist };
}

// ---------- Student CRUD helpers (used by Students view) ----------
export async function addStudentObservation(studentId: string, observation: Student['observations'][0]) {
  const { data: row } = await supabase.from('students').select('observations').eq('id', studentId).single();
  const obs = [...(row?.observations || []), observation];
  const res = await supabase.from('students').update({ observations: obs }).eq('id', studentId);
  if (!res.error) await logActivity('update', 'student', `Added observation for student`, studentId);
  return res;
}

export async function recordAttendance(studentId: string, entry: Student['attendance'][0]) {
  const { data: row } = await supabase.from('students').select('attendance').eq('id', studentId).single();
  const att = row?.attendance || [];
  // Replace today's entry if it exists, else prepend
  const filtered = att.filter((a: any) => a.date !== entry.date);
  const next = [entry, ...filtered].slice(0, 30);
  const res = await supabase.from('students').update({ attendance: next }).eq('id', studentId);
  if (!res.error) await logActivity('update', 'student', `Recorded attendance (${entry.status})`, studentId);
  return res;
}

export async function deleteStudent(id: string) {
  const res = await supabase.from('students').delete().eq('id', id);
  if (!res.error) await logActivity('delete', 'student', 'Deleted a student', id);
  return res;
}

export async function addEvent(e: Omit<Event, 'id'>) {
  const id = crypto.randomUUID();
  const res = await supabase.from('events').insert({
    id, title: e.title, date: e.date, time: e.time, type: e.type, classroom: e.classroom, description: e.description,
  });
  if (!res.error) await logActivity('create', 'event', `Created event: ${e.title}`, id);
  return res;
}

export async function logMessage(m: Omit<Message, 'id'>) {
  const id = crypto.randomUUID();
  const res = await supabase.from('messages').insert({
    id, to_recipient: m.to, subject: m.subject, channel: m.channel, date: m.date, status: m.status, preview: m.preview,
  });
  if (!res.error) await logActivity('create', 'message', `Sent ${m.channel}: "${m.subject}"`, id);
  return res;
}

// ---------- Student / Parent creation (real signup) ----------
export async function addStudent(s: Omit<Student, 'id'>) {
  const id = crypto.randomUUID();
  const { error } = await supabase.from('students').insert({
    id, name: s.name, photo: s.photo, age: s.age, dob: s.dob,
    enrollment_date: s.enrollmentDate, classroom: s.classroom,
    medical_info: s.medicalInfo, allergies: s.allergies,
    emergency_contact: s.emergencyContact, emergency_phone: s.emergencyPhone,
    parent_ids: s.parentIds, status: s.status,
    attendance: s.attendance, milestones: s.milestones, observations: s.observations,
  });
  if (error) { console.error(error); return null; }
  await logActivity('create', 'student', `Added student: ${s.name}`, id);
  return id;
}

export async function addParent(p: Omit<Parent, 'id'>) {
  const id = crypto.randomUUID();
  const { error } = await supabase.from('parents').insert({
    id, name: p.name, email: p.email, phone: p.phone, relation: p.relation,
    child_ids: p.childIds, preferred_channel: p.preferredChannel,
    privacy_consent: p.privacyConsent, avatar: p.avatar,
  });
  if (error) { console.error(error); return null; }
  await logActivity('create', 'parent', `Added parent: ${p.name}`, id);
  return id;
}

export async function updateParent(id: string, p: Partial<Parent>) {
  const { error } = await supabase.from('parents').update({
    name: p.name, email: p.email, phone: p.phone, relation: p.relation,
    child_ids: p.childIds, preferred_channel: p.preferredChannel,
    privacy_consent: p.privacyConsent, avatar: p.avatar,
  }).eq('id', id);
  if (error) { console.error(error); return false; }
  await logActivity('update', 'parent', `Updated parent: ${p.name || ''}`, id);
  return true;
}

export async function deleteParent(id: string) {
  const { error } = await supabase.from('parents').delete().eq('id', id);
  if (error) { console.error(error); return false; }
  await logActivity('delete', 'parent', 'Deleted a parent', id);
  return true;
}

export async function updateStudent(id: string, s: Partial<Student>) {
  const { error } = await supabase.from('students').update({
    name: s.name, photo: s.photo, age: s.age, dob: s.dob,
    classroom: s.classroom, medical_info: s.medicalInfo,
    allergies: s.allergies, emergency_contact: s.emergencyContact,
    emergency_phone: s.emergencyPhone, status: s.status,
  }).eq('id', id);
  if (error) { console.error(error); return false; }
  await logActivity('update', 'student', `Updated student: ${s.name || ''}`, id);
  return true;
}

export async function updateEvent(id: string, e: Partial<Event>) {
  const { error } = await supabase.from('events').update({
    title: e.title, date: e.date, time: e.time, type: e.type,
    classroom: e.classroom, description: e.description,
  }).eq('id', id);
  if (error) { console.error(error); return false; }
  await logActivity('update', 'event', `Updated event: ${e.title || ''}`, id);
  return true;
}

export async function deleteEvent(id: string) {
  const { error } = await supabase.from('events').delete().eq('id', id);
  if (error) { console.error(error); return false; }
  await logActivity('delete', 'event', 'Deleted an event', id);
  return true;
}

export async function deleteMessage(id: string) {
  const { error } = await supabase.from('messages').delete().eq('id', id);
  if (error) { console.error(error); return false; }
  await logActivity('delete', 'message', 'Deleted a message', id);
  return true;
}

export async function addVolunteer(v: Omit<Volunteer, 'id'>) {
  const id = crypto.randomUUID();
  const { error } = await supabase.from('volunteers').insert({
    id, name: v.name, parent: v.parent, skills: v.skills,
    hours: v.hours, upcoming_event: v.upcomingEvent, avatar: v.avatar || '',
  });
  if (error) { console.error(error); return null; }
  await logActivity('create', 'volunteer', `Added volunteer: ${v.name}`, id);
  return id;
}

export async function updateVolunteer(id: string, v: Partial<Volunteer>) {
  const { error } = await supabase.from('volunteers').update({
    name: v.name, parent: v.parent, skills: v.skills,
    hours: v.hours, upcoming_event: v.upcomingEvent, avatar: v.avatar,
  }).eq('id', id);
  if (error) { console.error(error); return false; }
  await logActivity('update', 'volunteer', `Updated volunteer: ${v.name || ''}`, id);
  return true;
}

export async function deleteVolunteer(id: string) {
  const { error } = await supabase.from('volunteers').delete().eq('id', id);
  if (error) { console.error(error); return false; }
  await logActivity('delete', 'volunteer', 'Deleted a volunteer', id);
  return true;
}

export async function uploadPhoto(file: File, folder: string): Promise<string | null> {
  const ext = file.name.split('.').pop() || 'jpg';
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from('photos').upload(path, file, { cacheControl: '3600', upsert: false });
  if (error) { console.error('Upload failed:', error); return null; }
  const { data } = supabase.storage.from('photos').getPublicUrl(path);
  return data.publicUrl;
}

export async function updateWaitlist(id: string, w: Partial<Waitlist>) {
  const res = await supabase.from('waitlist').update({
    child_name: w.childName, parent_name: w.parentName, age: w.age,
    desired_class: w.desiredClass, priority: w.priority, notes: w.notes,
  }).eq('id', id);
  if (!res.error) await logActivity('update', 'waitlist', `Updated waitlist entry: ${w.childName || ''}`, id);
  return res;
}

// Promote an enrolled lead into the Student + Family (Parent) databases.
// Returns { studentId, parentId } so callers can confirm/link.
export async function enrollLead(lead: Lead) {
  const parentId = crypto.randomUUID();
  const studentId = crypto.randomUUID();
  const classroom = lead.childAge <= 3 ? 'Toddler' : lead.childAge <= 6 ? 'Primary' : lead.childAge <= 9 ? 'Lower Elementary' : 'Upper Elementary';

  const { error: pErr } = await supabase.from('parents').insert({
    id: parentId, name: lead.parentName, email: lead.email, phone: lead.phone,
    relation: 'Parent', child_ids: [studentId], preferred_channel: 'whatsapp',
    privacy_consent: true, avatar: `https://i.pravatar.cc/150?u=${encodeURIComponent(lead.email)}`,
  });
  if (pErr) { console.error(pErr); return null; }

  const { error: sErr } = await supabase.from('students').insert({
    id: studentId, name: lead.childName, photo: `https://i.pravatar.cc/200?u=${encodeURIComponent(lead.childName)}`,
    age: lead.childAge, dob: '', enrollment_date: new Date().toISOString().split('T')[0],
    classroom, medical_info: 'None on file', allergies: [],
    emergency_contact: lead.parentName, emergency_phone: lead.phone,
    parent_ids: [parentId], status: 'active', attendance: [], milestones: [], observations: [],
  });
  if (sErr) { console.error(sErr); return null; }

  // Mark the lead as enrolled (so it isn't re-imported)
  await supabase.from('leads').update({ status: 'Enrolled', imported: true }).eq('id', lead.id);

  await logActivity('enroll', 'lead', `Enrolled lead: ${lead.childName} (parent: ${lead.parentName})`, lead.id);
  await logActivity('create', 'student', `Enrolled new student: ${lead.childName}`, studentId);
  await logActivity('create', 'parent', `Enrolled new parent: ${lead.parentName}`, parentId);

  return { studentId, parentId };
}

// ---------- Profile avatar update (self-service, any role) ----------
export async function updateProfileAvatar(userId: string, file: File): Promise<string | null> {
  const ext = file.name.split('.').pop() || 'jpg';
  const path = `profiles/${userId}.${ext}`;
  const { error: upErr } = await supabase.storage.from('photos').upload(path, file, { cacheControl: '3600', upsert: true });
  if (upErr) { console.error('Avatar upload failed:', upErr); return null; }
  const { data } = supabase.storage.from('photos').getPublicUrl(path);
  const publicUrl = data.publicUrl;
  const { error: dbErr } = await supabase.from('profiles').update({ avatar: publicUrl }).eq('id', userId);
  if (dbErr) { console.error('Avatar DB update failed:', dbErr); return null; }
  return publicUrl;
}
