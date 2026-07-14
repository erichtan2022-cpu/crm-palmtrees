// Seed data used to populate the database on first load.
// Keep this file separate from mockData.ts so mockData can stay as types-only after seeding.

export const LOGO_URL = 'https://i.imgur.com/0XvBpZ6.png';

const classrooms = ['Toddler', 'Primary', 'Lower Elementary', 'Upper Elementary'] as const;
const firstNames = ['Aisha','Rafi','Nadia','Bima','Citra','Dimas','Elena','Farid','Gita','Hadi','Indah','Joko','Kirana','Luna','Maya','Nico','Olivia','Putri','Reza','Sari','Tomi','Umi','Vino','Wina','Xavi','Yana','Zara','Andi','Bella','Caca'];
const lastNames = ['Patra','Wijaya','Santoso','Pratama','Kusuma','Lestari','Hartono','Saputra','Cahyani','Nugroho'];

export const seedStudents = Array.from({ length: 28 }, (_, i) => {
  const age = 2 + (i % 10);
  const cr = age < 3 ? 'Toddler' : age < 6 ? 'Primary' : age < 9 ? 'Lower Elementary' : 'Upper Elementary';
  const name = i === 0 ? 'Aria Patra' : i === 1 ? 'Kenzo Patra' : `${firstNames[i % firstNames.length]} ${lastNames[i % lastNames.length]}`;
  return {
    id: `s${i + 1}`,
    name,
    photo: `https://i.pravatar.cc/300?img=${(i % 70) + 1}`,
    age,
    dob: `20${20 - age}-0${(i % 9) + 1}-15`,
    enrollment_date: `2023-0${(i % 9) + 1}-10`,
    classroom: cr,
    medical_info: i % 4 === 0 ? 'Asthma - inhaler available' : 'No known conditions',
    allergies: i % 3 === 0 ? ['Peanuts'] : i % 5 === 0 ? ['Dairy'] : [],
    emergency_contact: i < 2 ? 'Johny Patra' : `Parent of ${name.split(' ')[0]}`,
    emergency_phone: '+6281877883' + (i % 100).toString().padStart(2, '0'),
    parent_ids: i < 2 ? ['u4'] : [`p${i}`],
    status: 'active',
    attendance: Array.from({ length: 7 }, (_, d) => ({
      date: new Date(Date.now() - d * 86400000).toISOString().split('T')[0],
      checkIn: d % 6 === 0 ? null : '08:0' + (d % 9),
      checkOut: d % 6 === 0 ? null : '14:30',
      status: d % 6 === 0 ? 'absent' : d % 5 === 0 ? 'late' : 'present',
    })),
    milestones: [
      { area: 'Practical Life', skill: 'Pouring water', status: 'mastered' },
      { area: 'Practical Life', skill: 'Buttoning frame', status: 'practicing' },
      { area: 'Sensorial', skill: 'Pink tower', status: 'mastered' },
      { area: 'Language', skill: 'Sandpaper letters', status: i % 2 === 0 ? 'practicing' : 'mastered' },
      { area: 'Mathematics', skill: 'Number rods 1-10', status: 'introduced' },
      { area: 'Cultural', skill: 'Continents map', status: 'practicing' },
    ],
    observations: [
      { date: '2026-05-20', teacher: 'Ms. Jati', note: 'Showed deep concentration during the pink tower work for 25 minutes. Very focused.', area: 'Sensorial' },
      { date: '2026-05-18', teacher: 'Ms. Jati', note: 'Helped a younger friend with pouring exercise. Beautiful grace and courtesy.', area: 'Social-Emotional' },
    ],
  };
});

export const seedParents = [
  { id: 'u4', name: 'Johny Patra', email: 'johny01@gmail.com', phone: '+62818778839', relation: 'Father', child_ids: ['s1','s2'], preferred_channel: 'whatsapp', privacy_consent: true, avatar: 'https://i.pravatar.cc/150?img=33' },
  ...Array.from({ length: 18 }, (_, i) => ({
    id: `p${i + 2}`,
    name: `${['Sari','Budi','Linda','Made','Ratna','Yusuf','Dewi','Anton','Mira','Hendra'][i % 10]} ${lastNames[i % lastNames.length]}`,
    email: `parent${i + 2}@example.com`,
    phone: `+628178834${(i % 100).toString().padStart(2,'0')}`,
    relation: i % 2 === 0 ? 'Mother' : 'Father',
    child_ids: [`s${i + 3}`],
    preferred_channel: (['email','sms','whatsapp'] as const)[i % 3],
    privacy_consent: i % 5 !== 0,
    avatar: `https://i.pravatar.cc/150?img=${i + 20}`,
  })),
];

export const seedLeads = [
  { id: 'l1', parent_name: 'Devi Anggraini', child_name: 'Arya', child_age: 3, email: 'devi@example.com', phone: '+62812345601', source: 'Website', status: 'Inquiry', inquiry_date: '2026-05-22', notes: 'Interested in Primary class' },
  { id: 'l2', parent_name: 'Rudi Hartono', child_name: 'Mila', child_age: 4, email: 'rudi@example.com', phone: '+62812345602', source: 'Instagram', status: 'Tour Scheduled', inquiry_date: '2026-05-20', tour_date: '2026-05-28', notes: 'Tour booked for Saturday' },
  { id: 'l3', parent_name: 'Lisa Permata', child_name: 'Kai', child_age: 2, email: 'lisa@example.com', phone: '+62812345603', source: 'Referral', status: 'Tour Completed', inquiry_date: '2026-05-15', tour_date: '2026-05-21', notes: 'Loved the environment, considering' },
  { id: 'l4', parent_name: 'Bagus Setiawan', child_name: 'Naya', child_age: 5, email: 'bagus@example.com', phone: '+62812345604', source: 'Google Ads', status: 'Applied', inquiry_date: '2026-05-10', notes: 'Application submitted, awaiting docs' },
  { id: 'l5', parent_name: 'Tika Maharani', child_name: 'Sena', child_age: 3, email: 'tika@example.com', phone: '+62812345605', source: 'Website', status: 'Enrolled', inquiry_date: '2026-04-28', notes: 'Welcome to Palmtrees!' },
  { id: 'l6', parent_name: 'Erwin Kusuma', child_name: 'Bella', child_age: 4, email: 'erwin@example.com', phone: '+62812345606', source: 'Walk-in', status: 'Inquiry', inquiry_date: '2026-05-23', notes: 'Walked in for info' },
  { id: 'l7', parent_name: 'Nina Pratiwi', child_name: 'Dito', child_age: 2, email: 'nina@example.com', phone: '+62812345607', source: 'Instagram', status: 'Tour Scheduled', inquiry_date: '2026-05-19', tour_date: '2026-05-30', notes: 'Following IG for months' },
  { id: 'l8', parent_name: 'Hadi Wibowo', child_name: 'Cinta', child_age: 5, email: 'hadi@example.com', phone: '+62812345608', source: 'Referral', status: 'Tour Completed', inquiry_date: '2026-05-12', tour_date: '2026-05-18', notes: 'Referred by Patra family' },
  { id: 'l9', parent_name: 'Rina Sutanto', child_name: 'Galang', child_age: 3, email: 'rina@example.com', phone: '+62812345609', source: 'Website', status: 'Applied', inquiry_date: '2026-05-05', notes: 'Documents in review' },
  { id: 'l10', parent_name: 'Yoga Mahendra', child_name: 'Pina', child_age: 4, email: 'yoga@example.com', phone: '+62812345610', source: 'Google Ads', status: 'Inquiry', inquiry_date: '2026-05-24', notes: 'New inquiry today' },
  { id: 'l11', parent_name: 'Sinta Dewi', child_name: 'Raka', child_age: 6, email: 'sinta@example.com', phone: '+62812345611', source: 'Referral', status: 'Enrolled', inquiry_date: '2026-04-15', notes: 'Started May 1st' },
  { id: 'l12', parent_name: 'Fajar Nugraha', child_name: 'Lila', child_age: 3, email: 'fajar@example.com', phone: '+62812345612', source: 'Instagram', status: 'Tour Completed', inquiry_date: '2026-05-14', tour_date: '2026-05-22', notes: 'Very engaged during tour' },
];

export const seedEvents = [
  { id: 'e1', title: 'Parent-Teacher Conference', date: '2026-05-27', time: '14:00', type: 'conference', description: 'Spring progress meetings' },
  { id: 'e2', title: 'Spring Nature Walk', date: '2026-05-28', time: '09:00', type: 'class', classroom: 'Primary', description: 'Outdoor exploration with the Primary class' },
  { id: 'e3', title: 'School Open House', date: '2026-05-30', time: '10:00', type: 'school', description: 'Tours for prospective families' },
  { id: 'e4', title: 'Cultural Celebration Day', date: '2026-06-05', time: '09:00', type: 'school', description: 'Celebrating cultures from around the world' },
  { id: 'e5', title: 'Toddler Music & Movement', date: '2026-06-02', time: '10:30', type: 'class', classroom: 'Toddler', description: 'Weekly music session' },
  { id: 'e6', title: 'School Holiday - Idul Adha', date: '2026-06-17', time: 'All day', type: 'holiday', description: 'School closed' },
  { id: 'e7', title: 'Elementary Field Trip - Botanical Garden', date: '2026-06-10', time: '08:00', type: 'class', classroom: 'Lower Elementary', description: 'Bring water bottle and hat' },
  { id: 'e8', title: 'Parent Workshop: Montessori at Home', date: '2026-06-08', time: '18:00', type: 'school', description: 'Practical tips for home environment' },
  { id: 'e9', title: 'End of Year Celebration', date: '2026-06-20', time: '16:00', type: 'school', description: 'Family picnic & student showcase' },
  { id: 'e10', title: 'Volunteer Garden Day', date: '2026-06-01', time: '08:00', type: 'school', description: 'Help maintain our school garden' },
];

export const seedMessages = [
  { id: 'm1', to_recipient: 'All Parents', subject: 'Weekly Newsletter - May Week 4', channel: 'email', date: '2026-05-23', status: 'delivered', preview: 'This week our children explored...' },
  { id: 'm2', to_recipient: 'Primary Class Parents', subject: 'Nature Walk Reminder', channel: 'whatsapp', date: '2026-05-22', status: 'read', preview: 'Don\'t forget tomorrow\'s nature walk!' },
  { id: 'm3', to_recipient: 'Johny Patra', subject: 'Aria\'s Progress Update', channel: 'email', date: '2026-05-20', status: 'read', preview: 'Aria has mastered the pink tower...' },
  { id: 'm4', to_recipient: 'All Parents', subject: 'School Open House Invitation', channel: 'email', date: '2026-05-18', status: 'delivered', preview: 'Invite friends to our Open House' },
  { id: 'm5', to_recipient: 'Toddler Parents', subject: 'Music Class Tomorrow', channel: 'sms', date: '2026-05-17', status: 'delivered', preview: 'Reminder: Music & Movement at 10:30' },
];

export const seedWaitlist = [
  { id: 'w1', child_name: 'Aldo Susanto', parent_name: 'Pak Susanto', age: 2, desired_class: 'Toddler', join_date: '2026-03-15', priority: 'high', notes: 'Sibling of current student', position: 1 },
  { id: 'w2', child_name: 'Mira Halim', parent_name: 'Bu Halim', age: 3, desired_class: 'Primary', join_date: '2026-04-02', priority: 'medium', notes: 'Referred by Patra family', position: 2 },
  { id: 'w3', child_name: 'Reno Sutrisno', parent_name: 'Pak Sutrisno', age: 4, desired_class: 'Primary', join_date: '2026-04-20', priority: 'medium', notes: 'Tour completed, applied', position: 3 },
  { id: 'w4', child_name: 'Tania Halilintar', parent_name: 'Bu Halilintar', age: 2, desired_class: 'Toddler', join_date: '2026-05-01', priority: 'low', notes: 'Just inquired', position: 4 },
  { id: 'w5', child_name: 'Bayu Wirawan', parent_name: 'Pak Wirawan', age: 5, desired_class: 'Lower Elementary', join_date: '2026-05-10', priority: 'high', notes: 'Sibling discount applies', position: 5 },
];

export const seedVolunteers = [
  { id: 'v1', name: 'Sari Wijaya', parent: 'Mother of Bima', skills: ['Cooking','Garden'], hours: 24, upcoming_event: 'Garden Day - Jun 1' },
  { id: 'v2', name: 'Budi Santoso', parent: 'Father of Citra', skills: ['Photography'], hours: 18, upcoming_event: 'Open House - May 30' },
  { id: 'v3', name: 'Linda Pratama', parent: 'Mother of Dimas', skills: ['Library','Reading'], hours: 32, upcoming_event: null },
  { id: 'v4', name: 'Made Kusuma', parent: 'Father of Elena', skills: ['Carpentry','Repair'], hours: 15, upcoming_event: 'Garden Day - Jun 1' },
  { id: 'v5', name: 'Ratna Lestari', parent: 'Mother of Farid', skills: ['Music','Crafts'], hours: 28, upcoming_event: null },
  { id: 'v6', name: 'Yusuf Hartono', parent: 'Father of Gita', skills: ['Driving','Field Trips'], hours: 12, upcoming_event: 'Botanical Trip - Jun 10' },
];
