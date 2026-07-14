// Type definitions and static-only data (users, email templates, analytics samples)
// Entity data (students/parents/leads/events/messages/waitlist/volunteers) lives in
// the database — see src/hooks/useData.ts

export const LOGO_URL = 'https://i.imgur.com/0XvBpZ6.png';

export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  password: string;
  role: 'admin' | 'teacher' | 'staff' | 'parent';
  avatar?: string;
  childIds?: string[];
}

export const users: User[] = [
  { id: 'u1', name: 'Hendrik Tanuwidjaja', email: 'fxrich01@gmail.com', username: 'bzrich', password: 'CRM123#', role: 'admin', avatar: 'https://i.pravatar.cc/150?img=12' },
  { id: 'u2', name: 'Ms. Jati', email: 'msjati@gmail.com', username: 'msjati', password: 'Guru123#', role: 'teacher', avatar: 'https://i.pravatar.cc/150?img=47' },
  { id: 'u3', name: 'Angelina Rini', email: 'kiddymontessori@gmail.com', username: 'rini', password: 'Staff123#', role: 'staff', avatar: 'https://i.imgur.com/8XpQSC6.jpeg' },
  { id: 'u4', name: 'Johny Patra', email: 'johny01@gmail.com', username: 'johny', password: 'Ortu123#', role: 'parent', avatar: 'https://i.pravatar.cc/150?img=33', childIds: ['s1', 's2'] },
];

// ---------- Entity types ----------
export interface Student {
  id: string;
  name: string;
  photo: string;
  age: number;
  dob: string;
  enrollmentDate: string;
  classroom: 'Toddler' | 'Primary' | 'Lower Elementary' | 'Upper Elementary';
  medicalInfo: string;
  allergies: string[];
  emergencyContact: string;
  emergencyPhone: string;
  parentIds: string[];
  status: 'active' | 'inactive';
  attendance: { date: string; checkIn?: string | null; checkOut?: string | null; status: 'present' | 'absent' | 'late' }[];
  milestones: { area: string; skill: string; status: 'introduced' | 'practicing' | 'mastered' }[];
  observations: { date: string; teacher: string; note: string; area: string }[];
}

export interface Parent {
  id: string;
  name: string;
  email: string;
  phone: string;
  relation: string;
  childIds: string[];
  preferredChannel: 'email' | 'sms' | 'whatsapp';
  privacyConsent: boolean;
  avatar: string;
}

export interface Lead {
  id: string;
  parentName: string;
  childName: string;
  childAge: number;
  email: string;
  phone: string;
  source: 'Website' | 'Referral' | 'Instagram' | 'Google Ads' | 'Walk-in';
  status: 'Inquiry' | 'Tour Scheduled' | 'Tour Completed' | 'Applied' | 'Enrolled';
  inquiryDate: string;
  tourDate?: string;
  notes: string;
  followUpDate?: string;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  type: 'school' | 'class' | 'conference' | 'holiday';
  classroom?: string;
  description: string;
}

export interface Message {
  id: string;
  to: string;
  subject: string;
  channel: 'email' | 'sms' | 'whatsapp';
  date: string;
  status: 'sent' | 'delivered' | 'read';
  preview: string;
}

export interface Volunteer {
  id: string;
  name: string;
  parent: string;
  skills: string[];
  hours: number;
  upcomingEvent?: string;
}

export interface Waitlist {
  id: string;
  childName: string;
  parentName: string;
  age: number;
  desiredClass: string;
  joinDate: string;
  priority: 'high' | 'medium' | 'low';
  notes: string;
}

// ---------- Static reference data ----------
export const emailTemplates = [
  { id: 't1', name: 'Welcome New Family', subject: 'Welcome to Palmtrees Montessori', body: 'Dear {parent_name},\n\nWe are delighted to welcome {child_name} to our Palmtrees Montessori family...' },
  { id: 't2', name: 'Tour Confirmation', subject: 'Your School Tour is Confirmed', body: 'Dear {parent_name},\n\nYour tour is confirmed for {tour_date} at {tour_time}...' },
  { id: 't3', name: 'Progress Report Ready', subject: '{child_name}\'s Progress Report', body: 'Dear {parent_name},\n\n{child_name}\'s latest progress report is ready...' },
  { id: 't4', name: 'Event Reminder', subject: 'Reminder: {event_name}', body: 'Dear {parent_name},\n\nThis is a friendly reminder about {event_name} on {event_date}...' },
  { id: 't5', name: 'Absence Follow-up', subject: 'We missed {child_name} today', body: 'Dear {parent_name},\n\nWe noticed {child_name} was absent today. We hope all is well...' },
  { id: 't6', name: 'Payment Reminder', subject: 'Friendly Payment Reminder', body: 'Dear {parent_name},\n\nThis is a gentle reminder about the upcoming tuition payment...' },
  { id: 't7', name: 'Newsletter Template', subject: 'Palmtrees Weekly News', body: 'Dear Palmtrees Family,\n\nHere\'s what happened this week...' },
  { id: 't8', name: 'Volunteer Thank You', subject: 'Thank you for volunteering!', body: 'Dear {parent_name},\n\nThank you for your time supporting our community...' },
];

export const analyticsData = {
  visitors: [
    { day: 'Mon', value: 142 },
    { day: 'Tue', value: 198 },
    { day: 'Wed', value: 167 },
    { day: 'Thu', value: 234 },
    { day: 'Fri', value: 289 },
    { day: 'Sat', value: 312 },
    { day: 'Sun', value: 178 },
  ],
  sources: [
    { name: 'Organic Search', value: 42, color: '#4A7C2F' },
    { name: 'Instagram', value: 28, color: '#8B4513' },
    { name: 'Direct', value: 18, color: '#D2A679' },
    { name: 'Referral', value: 12, color: '#6B8E23' },
  ],
  formSubmissions: 47,
  pageViews: 1520,
  conversionRate: 8.4,
};
