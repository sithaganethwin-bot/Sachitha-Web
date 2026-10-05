import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  BatchInfo,
  ClassSession,
  StudyMaterial,
  Ranker,
  EnrollmentItem,
  LiveTickerConfig,
  ClassOptionItem,
  ClassModeItem,
  RegisteredAccount,
  LiveAccessRequest,
  ClassRecording,
  RecordingPolicy,
  LessonUnit,
  PaperClassLiveConfig,
  MonthlyStudentApproval,
  StatCardItem
} from '../types';
import {
  MOCK_BATCHES,
  MOCK_SESSIONS,
  MOCK_STUDY_MATERIALS,
  MOCK_RANKERS,
  TEACHER_INFO
} from '../data/mockData';

interface DataContextType {
  batches: BatchInfo[];
  sessions: ClassSession[];
  materials: StudyMaterial[];
  rankers: Ranker[];
  teacherInfo: typeof TEACHER_INFO;
  enrollments: EnrollmentItem[];
  announcement: string;
  liveTickerConfig: LiveTickerConfig;

  // Live Ticker Banner Settings
  updateLiveTickerConfig: (config: Partial<LiveTickerConfig>) => void;

  // Batches CRUD
  addBatch: (batch: Omit<BatchInfo, 'id'>) => void;
  updateBatch: (id: string, batch: Partial<BatchInfo>) => void;
  deleteBatch: (id: string) => void;

  // Sessions CRUD
  addSession: (session: Omit<ClassSession, 'id'>) => void;
  updateSession: (id: string, session: Partial<ClassSession>) => void;
  deleteSession: (id: string) => void;

  // Materials CRUD
  addMaterial: (material: Omit<StudyMaterial, 'id'>) => void;
  updateMaterial: (id: string, material: Partial<StudyMaterial>) => void;
  deleteMaterial: (id: string) => void;

  // Rankers CRUD
  addRanker: (ranker: Omit<Ranker, 'id'>) => void;
  updateRanker: (id: string, ranker: Partial<Ranker>) => void;
  deleteRanker: (id: string) => void;

  // Teacher Info & Announcements
  updateTeacherInfo: (info: Partial<typeof TEACHER_INFO>) => void;
  setAnnouncement: (text: string) => void;

  // Enrollments
  addEnrollment: (enrollment: Omit<EnrollmentItem, 'id' | 'date' | 'status'>) => void;
  updateEnrollmentStatus: (id: string, status: EnrollmentItem['status']) => void;
  deleteEnrollment: (id: string) => void;

  // Class Options CRUD
  classOptions: ClassOptionItem[];
  addClassOption: (option: Omit<ClassOptionItem, 'id'>) => void;
  updateClassOption: (id: string, option: Partial<ClassOptionItem>) => void;
  deleteClassOption: (id: string) => void;

  // Class Modes CRUD
  classModes: ClassModeItem[];
  addClassMode: (mode: Omit<ClassModeItem, 'id'>) => void;
  updateClassMode: (id: string, mode: Partial<ClassModeItem>) => void;
  deleteClassMode: (id: string) => void;

  // Registered Students Management
  registeredStudents: RegisteredAccount[];
  updateStudentStatus: (id: string, status: 'active' | 'pending' | 'suspended') => void;
  deleteRegisteredStudent: (id: string) => void;
  refreshRegisteredStudents: () => void;

  // Class Recordings Vault
  recordings: ClassRecording[];
  addRecording: (rec: Omit<ClassRecording, 'id'>) => void;
  updateRecording: (id: string, rec: Partial<ClassRecording>) => void;
  deleteRecording: (id: string) => void;

  // Live Access & Replay Permission Requests
  accessRequests: LiveAccessRequest[];
  submitAccessRequest: (req: Omit<LiveAccessRequest, 'id' | 'status' | 'requestDate'>) => void;
  updateAccessRequestStatus: (
    id: string,
    status: 'approved' | 'rejected',
    approvedUntil?: string,
    notes?: string
  ) => void;
  deleteAccessRequest: (id: string) => void;
  grantDirectAccess: (access: {
    studentId: string;
    studentName: string;
    studentIndex: string;
    batch: string;
    type: 'live_zoom' | 'recording';
    targetDate: string;
    targetSessionTitle: string;
    recordingId?: string;
    durationHours?: number;
    adminNotes?: string;
  }) => void;
  extendAccessDuration: (id: string, additionalHours: number) => void;
  revokeAccess: (id: string, note?: string) => void;

  // Recording Policies
  recordingPolicy: RecordingPolicy;
  updateRecordingPolicy: (policy: Partial<RecordingPolicy>) => void;


  // Lesson Units CRUD
  lessonUnits: LessonUnit[];
  addLessonUnit: (unit: Omit<LessonUnit, 'id'>) => void;
  updateLessonUnit: (id: string, unit: Partial<LessonUnit>) => void;
  deleteLessonUnit: (id: string) => void;

  // Paper Class Live Stream & Exams
  paperClassLiveConfig: PaperClassLiveConfig;
  updatePaperClassLiveConfig: (config: Partial<PaperClassLiveConfig>) => void;

  // Monthly Student Class Approvals
  monthlyApprovals: MonthlyStudentApproval[];
  updateMonthlyApproval: (approval: MonthlyStudentApproval) => void;
  batchUpdateMonthlyApprovals: (month: string, studentIds: string[], updates: Partial<MonthlyStudentApproval>) => void;
  getStudentMonthlyApproval: (studentId: string, month: string) => MonthlyStudentApproval | undefined;

  // Highlight Stat Cards
  highlightStats: StatCardItem[];
  updateHighlightStat: (id: string, stat: Partial<StatCardItem>) => void;
  updateAllHighlightStats: (stats: StatCardItem[]) => void;
  addHighlightStat: (stat: StatCardItem) => void;
  deleteHighlightStat: (id: string) => void;
  resetHighlightStats: () => void;

  // Aliases for compatibility
  statMetrics: StatCardItem[];
  updateStatMetric: (id: string, stat: Partial<StatCardItem>) => void;
  addStatMetric: (stat: StatCardItem) => void;
  deleteStatMetric: (id: string) => void;
  resetStatMetrics: () => void;

  // Reset
  resetAllData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const loadFromStorage = <T,>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const DEFAULT_LIVE_TICKER: LiveTickerConfig = {
  isEnabled: true,
  batchBadge: "2026/2027 A/L Theory & Paper Batch",
  subject: "A/L Business Studies – Unit 04 Production & Operations Masterclass + Speed Paper #08",
  timeSlot: "08:00 AM – 01:30 PM",
  venue: "Rotary Institute, Nugegoda & Zoom HD Broadcast",
  countdownMinutes: 15,
  isStreamingNow: true,
  zoomMeetingId: "987 6543 2100",
  zoomPasscode: "BS2027",
  scheduledDateTime: "Every Saturday at 8:00 AM",
  todayTuteTitle: "Unit 04: Production & Operations Management Full Theory & Speed Paper Drill Tute",
  todayTuteUrl: "https://example.com/materials/Unit_04_Production_Operations_Masterclass.pdf",
  todayTuteSize: "4.2 MB PDF",
  todayTuteDescription: "Includes complete chapter derivations, flowcharts, 2026 model case study, and paper question booklet.",
  isContinuousSession: true,
  theoryPartTitle: "Part 1: Operations Management Core Concepts & Mind Mapping",
  theoryPartTime: "08:00 AM – 10:30 AM",
  paperPartTitle: "Part 2: Model Paper #08 Speed Test & Marking Step Discussion",
  paperPartTime: "10:45 AM – 01:30 PM",
  attachedMaterials: [
    { title: 'Unit 04: Production & Operations Management Full Tute.pdf', fileUrl: '#', fileSize: '4.2 MB' },
    { title: 'Speed Paper #08 Question Booklet.pdf', fileUrl: '#', fileSize: '2.8 MB' },
    { title: 'Step-by-Step Marking Scheme Matrix.pdf', fileUrl: '#', fileSize: '1.5 MB' }
  ]
};

const DEFAULT_CLASS_OPTIONS: ClassOptionItem[] = [
  {
    id: 'copt-1',
    batch: '2028 Batch',
    title: '2028 BS Theory (Comprehensive Foundation)',
    badge: 'Theory Foundation',
    fee: 'LKR 4,500 / Month',
    description: 'Complete elementary syllabus coverage, case study fundamentals and glossary mastery.',
    isActive: true
  },
  {
    id: 'copt-2',
    batch: '2028 Batch',
    title: '2028 BS Beginner + Unit Assessments',
    badge: 'Recommended',
    fee: 'LKR 5,000 / Month',
    description: 'Weekly evaluation model quizzes with printed tutorials and monthly progress review.',
    isActive: true
  },
  {
    id: 'copt-3',
    batch: '2027 Batch',
    title: '2027 BS Theory (Comprehensive)',
    badge: 'Most Popular',
    fee: 'LKR 4,800 / Month',
    description: 'Full syllabus depth with all sub-theories, chapter workbooks and 24/7 HD Replays.',
    isActive: true
  },
  {
    id: 'copt-4',
    batch: '2027 Batch',
    title: '2027 BS Revision & Speed Recall',
    badge: 'Fast Track',
    fee: 'LKR 4,800 / Month',
    description: 'Rapid recall drills, formula mind-maps, and structured essay question writing techniques.',
    isActive: true
  },
  {
    id: 'copt-5',
    batch: '2027 Batch',
    title: '2027 BS Paper Class & Unit Assessments',
    badge: 'Exam Focused',
    fee: 'LKR 5,200 / Month',
    description: 'Weekly timed model papers with individual grading, marking schemes and personal feedback.',
    isActive: true
  },
  {
    id: 'copt-6',
    batch: '2026 Batch',
    title: '2026 BS Final Booster & Paper Marathon',
    badge: 'Final Lap',
    fee: 'LKR 5,500 / Month',
    description: '100% exam targeting, 20-year past paper analysis and predicted question predictions.',
    isActive: true
  },
  {
    id: 'copt-7',
    batch: '2026 Batch',
    title: '2026 BS Rapid Revision (Full Syllabus)',
    badge: 'Revision',
    fee: 'LKR 5,000 / Month',
    description: 'Concentrated theory summary packs covering all 12 units in 16 intensive sessions.',
    isActive: true
  }
];

const DEFAULT_CLASS_MODES: ClassModeItem[] = [
  {
    id: 'cmode-1',
    name: 'Online (with Zoom)',
    type: 'online',
    description: 'Full live HD streaming via Zoom with live Q&A chat and 24/7 video replays.',
    isActive: true
  },
  {
    id: 'cmode-2',
    name: 'Online (Videos Only)',
    type: 'online',
    description: 'Self-paced video replays with printed monthly lesson modules delivered to your home.',
    isActive: true
  },
  {
    id: 'cmode-3',
    name: 'Sasip Institute, Nugegoda',
    type: 'physical',
    description: 'State-of-the-art air-conditioned lecture hall with direct in-person coaching.',
    isActive: true
  },
  {
    id: 'cmode-4',
    name: 'Rotary Institute, Nugegoda',
    type: 'physical',
    description: 'Flagship weekend classes with printed tute packs and personal mentor sessions.',
    isActive: true
  },
  {
    id: 'cmode-5',
    name: 'Syzygy Institute, Gampaha',
    type: 'physical',
    description: 'Prime weekday evening physical batch with weekly supervised paper evaluations.',
    isActive: true
  }
];

export const DEFAULT_REGISTERED_STUDENTS: RegisteredAccount[] = [
  {
    id: 'std-sample-1',
    indexNo: 'BS-2027-1842',
    firstName: 'Kavindu',
    lastName: 'Senaratne',
    email: 'kavindu@gmail.com',
    whatsapp: '077 123 4567',
    parentPhone: '071 987 6543',
    school: 'Royal College, Colombo',
    district: 'Colombo',
    batch: '2027 Batch',
    classOption: '2027 BS Theory (Comprehensive)',
    classMode: 'Sasip Institute, Nugegoda',
    nicNumber: '200812345678',
    password: '',
    address: {
      street: '14/B, Station Road',
      area: 'Nugegoda',
      city: 'Colombo'
    },
    createdAt: '2026-09-15T08:30:00Z',
    status: 'active'
  },
  {
    id: 'std-sample-2',
    indexNo: 'BS-2027-3914',
    firstName: 'Nimna',
    lastName: 'Jayakody',
    email: 'nimna@gmail.com',
    whatsapp: '076 554 4332',
    parentPhone: '077 332 2110',
    school: 'Visakha Vidyalaya, Colombo',
    district: 'Colombo',
    batch: '2027 Batch',
    classOption: '2027 BS Theory + Paper Combo',
    classMode: 'Rotary Institute, Nugegoda',
    nicNumber: '200887654321',
    password: '',
    address: {
      street: '52, High Level Road',
      area: 'Maharagama',
      city: 'Colombo'
    },
    createdAt: '2026-09-18T10:00:00Z',
    status: 'active'
  },
  {
    id: 'std-sample-3',
    indexNo: 'BS-2027-4819',
    firstName: 'Kasun',
    lastName: 'Perera',
    email: 'kasun.student@gmail.com',
    whatsapp: '071 889 2314',
    parentPhone: '077 665 5443',
    school: 'Ananda College, Colombo',
    district: 'Colombo',
    batch: '2027 Batch',
    classOption: '2027 BS Theory (Comprehensive)',
    classMode: 'Online (with Zoom)',
    nicNumber: '200723456789',
    password: '',
    address: {
      street: '88, Galle Road',
      area: 'Dehiwala',
      city: 'Colombo'
    },
    createdAt: '2026-09-20T11:45:00Z',
    status: 'active'
  },
  {
    id: 'std-sample-4',
    indexNo: 'BS-2026-0921',
    firstName: 'Dulani',
    lastName: 'Samaranayake',
    email: 'dulani.sam@gmail.com',
    whatsapp: '078 998 8776',
    parentPhone: '072 112 2334',
    school: 'Rathnavali Balika Vidyalaya, Gampaha',
    district: 'Gampaha',
    batch: '2026 Batch',
    classOption: '2026 BS Final Booster & Paper Marathon',
    classMode: 'Syzygy Institute, Gampaha',
    nicNumber: '200634567890',
    password: '',
    address: {
      street: '23, Kandy Road',
      area: 'Miriswatta',
      city: 'Gampaha'
    },
    createdAt: '2026-09-22T09:15:00Z',
    status: 'active'
  }
];

const DEFAULT_RECORDINGS: ClassRecording[] = [
  {
    id: 'rec-1',
    batch: '2027 Batch',
    title: 'Unit 1: The Concept of Business & Economic Foundations',
    unitName: 'Unit 1: Foundations of Business',
    date: '2026-09-28',
    duration: '2 hrs 35 mins',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnailUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80',
    availableForDays: 14,
    isLockedForPhysical: true,
    status: 'published',
    attachedMaterials: [
      { title: 'Unit 1 Theory Full Summary Handout.pdf', fileUrl: '#', fileSize: '3.8 MB' },
      { title: 'Unit 1 Speed Drill Model Questions.pdf', fileUrl: '#', fileSize: '1.4 MB' }
    ]
  },
  {
    id: 'rec-2',
    batch: '2027 Batch',
    title: 'Unit 2: Business Ethics, Corporate Responsibility & Stakeholders',
    unitName: 'Unit 2: Social Environment of Business',
    date: '2026-10-01',
    duration: '2 hrs 40 mins',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnailUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&q=80',
    availableForDays: 14,
    isLockedForPhysical: true,
    status: 'published',
    attachedMaterials: [
      { title: 'Unit 2 Case Studies & Model Paper.pdf', fileUrl: '#', fileSize: '2.1 MB' },
      { title: 'Stakeholder Impact Diagram & Summary.pdf', fileUrl: '#', fileSize: '950 KB' }
    ]
  },
  {
    id: 'rec-3',
    batch: '2026 Batch',
    title: 'Unit 5: Financial Management, Capital Budgeting & Ratio Analysis',
    unitName: 'Unit 5: Business Finance',
    date: '2026-09-25',
    duration: '3 hrs 10 mins',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnailUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80',
    availableForDays: 14,
    isLockedForPhysical: true,
    status: 'published',
    attachedMaterials: [
      { title: 'Financial Ratio Formulas & Cheat Sheet.pdf', fileUrl: '#', fileSize: '1.8 MB' },
      { title: '2024 Past Paper Structured Questions.pdf', fileUrl: '#', fileSize: '4.2 MB' }
    ]
  },
  {
    id: 'rec-4',
    batch: '2027 Batch',
    title: 'Unit 3: Government Policies, Fiscal Budget & Inflation Impact',
    unitName: 'Unit 3: Economic Environment',
    date: '2026-10-03',
    duration: '2 hrs 50 mins',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnailUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80',
    availableForDays: 14,
    isLockedForPhysical: true,
    status: 'published',
    attachedMaterials: [
      { title: 'Unit 3 Comprehensive Macroeconomics Pack.pdf', fileUrl: '#', fileSize: '3.1 MB' },
      { title: 'Unit 3 Weekly Homework Worksheet.pdf', fileUrl: '#', fileSize: '1.2 MB' }
    ]
  }
];

const DEFAULT_ACCESS_REQUESTS: LiveAccessRequest[] = [
  {
    id: 'req-1',
    studentId: 'std-sample-1',
    studentName: 'Kavindu Senaratne',
    studentIndex: 'BS-2027-1842',
    batch: '2027 Batch',
    type: 'live_zoom',
    targetDate: '2026-10-04',
    targetSessionTitle: '2027 Theory Masterclass (Unit 3)',
    reason: 'School Inter-house athletics meet - cannot travel to Sasip Nugegoda hall.',
    requestDate: '2026-10-02T14:30:00Z',
    status: 'pending'
  },
  {
    id: 'req-2',
    studentId: 'std-sample-2',
    studentName: 'Nimna Jayakody',
    studentIndex: 'BS-2027-3914',
    batch: '2027 Batch',
    type: 'recording',
    targetDate: '2026-09-28',
    targetSessionTitle: 'Unit 1: The Concept of Business',
    recordingId: 'rec-1',
    reason: 'Fell sick with fever on Saturday, missed the physical class.',
    requestDate: '2026-09-30T10:15:00Z',
    status: 'approved',
    approvedUntil: '2026-10-08T23:59:59Z',
    adminNotes: 'Approved for catch-up replay.'
  }
];

const DEFAULT_RECORDING_POLICY: RecordingPolicy = {
  onlineStudentDays: 14,
  defaultPhysicalApprovedHours: 48
};


const DEFAULT_LESSON_UNITS: LessonUnit[] = [
  {
    id: 'unit-1',
    unitNumber: 1,
    title: 'Unit 01: ව්‍යාපාර පරිසරය හා හැඳින්වීම (Introduction to Business & Environment)',
    batch: 'All Batches',
    description: 'ව්‍යාපාර සංකල්පය, ආර්ථික පදනම, පාර්ශ්වකරුවන් සහ ව්‍යාපාරික පරිසර සාධක.',
    order: 1,
    isActive: true
  },
  {
    id: 'unit-2',
    unitNumber: 2,
    title: 'Unit 02: කළමනාකරණය හා සංවිධාන ව්‍යුහය (Management & Organizing)',
    batch: 'All Batches',
    description: 'කළමනාකරණ මූලධර්ම, සංවිධාන ව්‍යුහ, නායකත්වය, අභිප්‍රේරණය සහ සන්නිවේදනය.',
    order: 2,
    isActive: true
  },
  {
    id: 'unit-3',
    unitNumber: 3,
    title: 'Unit 03: මෙහෙයුම් කළමනාකරණය (Operations & Quality Management)',
    batch: 'All Batches',
    description: 'නිෂ්පාදන සැලසුම්කරණය, තත්ත්ව කළමනාකරණය, ඵලදායිතාව සහ තොග පාලනය.',
    order: 3,
    isActive: true
  },
  {
    id: 'unit-4',
    unitNumber: 4,
    title: 'Unit 04: අලෙවිකරණ කළමනාකරණය (Marketing Management)',
    batch: 'All Batches',
    description: 'අලෙවිකරණ මිශ්‍රය (4Ps), වෙළෙඳපොළ පර්යේෂණ සහ පාරිභෝගික හැසිරීම.',
    order: 4,
    isActive: true
  },
  {
    id: 'unit-5',
    unitNumber: 5,
    title: 'Unit 05: මූල්‍ය කළමනාකරණය හා ගිණුම්කරණය (Financial Management)',
    batch: 'All Batches',
    description: 'මූල්‍ය මූලාශ්‍ර, අයවැයකරණය, මූල්‍ය අනුපාත විශ්ලේෂණය සහ ව්‍යාපෘති ඇගයීම.',
    order: 5,
    isActive: true
  },
  {
    id: 'unit-6',
    unitNumber: 6,
    title: 'Unit 06: මානව සම්පත් කළමනාකරණය (Human Resource Management)',
    batch: 'All Batches',
    description: 'මානව සම්පත් සැලසුම්කරණය, බඳවා ගැනීම්, කාර්යසාධන ඇගයීම සහ සේවක සබඳතා.',
    order: 6,
    isActive: true
  }
];

const DEFAULT_PAPER_LIVE_CONFIG: PaperClassLiveConfig = {
  isEnabled: true,
  title: '2027 A/L Business Studies Speed Paper & Detailed Discussion',
  paperNumber: 'Model Paper #08 (Full Timed Test + Marking Scheme)',
  timeSlot: 'Wednesday 06:30 PM – 09:30 PM',
  zoomMeetingId: '945 8820 1194',
  zoomPasscode: 'PAPER2027',
  durationMinutes: 180,
  isLiveNow: true,
  scheduledDateTime: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
  venue: 'Zoom Live Cloud HD & Rotary Hall',
  attachedPaperPdf: 'https://example.com/papers/2027-Model-Paper-08.pdf',
  attachedMarkingPdf: 'https://example.com/papers/2027-Model-Paper-08-Marking.pdf'
};

const DEFAULT_MONTHLY_APPROVALS: MonthlyStudentApproval[] = [
  {
    id: 'appr-1',
    studentId: 'std-sample-1',
    studentIndex: 'BS-2027-1842',
    studentName: 'Kavindu Senaratne',
    studentEmail: 'kavindu@gmail.com',
    batch: '2027 Batch',
    month: '2026-10',
    theoryApproved: true,
    paperApproved: false,
    revisionApproved: false,
    feeStatus: 'paid',
    notes: 'Paid for Theory (Sasip physical).',
    approvedAt: '2026-10-01T08:00:00Z'
  },
  {
    id: 'appr-2',
    studentId: 'std-sample-2',
    studentIndex: 'BS-2027-3914',
    studentName: 'Nimna Jayakody',
    studentEmail: 'nimna@gmail.com',
    batch: '2027 Batch',
    month: '2026-10',
    theoryApproved: true,
    paperApproved: true,
    revisionApproved: false,
    feeStatus: 'paid',
    notes: 'Theory + Paper Class Combo enrolled.',
    approvedAt: '2026-10-01T09:30:00Z'
  }
];

const DEFAULT_HIGHLIGHT_STATS: StatCardItem[] = [
  {
    id: 'stat-exp',
    value: '8+ Years',
    label: 'Years of Experience',
    subtext: 'Specialist coaching beyond the theory with 28+ Island Top Ranks',
    badge: 'Senior Lecturer',
    glowColor: 'indigo',
    iconType: 'Award'
  },
  {
    id: 'stat-students',
    value: '8,500+',
    label: 'Active Students',
    subtext: 'Enrolled across Sasip, Rotary, Texas & Zoom Live HD Islandwide',
    badge: 'Islandwide Community',
    glowColor: 'emerald',
    iconType: 'Users'
  },
  {
    id: 'stat-pass',
    value: '99.2%',
    label: 'Pass Percentage',
    subtext: 'Distinction rate conditioned with timed speed paper mastery',
    badge: 'Islandwide Excellence',
    glowColor: 'purple',
    iconType: 'TrendingUp'
  }
];

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [highlightStats, setHighlightStats] = useState<StatCardItem[]>(() =>
    loadFromStorage('sachii_highlight_stats', DEFAULT_HIGHLIGHT_STATS)
  );

  const [batches, setBatches] = useState<BatchInfo[]>(() =>
    loadFromStorage('sachii_batches', MOCK_BATCHES)
  );

  const [sessions, setSessions] = useState<ClassSession[]>(() =>
    loadFromStorage('sachii_sessions', MOCK_SESSIONS)
  );

  const [materials, setMaterials] = useState<StudyMaterial[]>(() =>
    loadFromStorage('sachii_materials', MOCK_STUDY_MATERIALS)
  );

  const [rankers, setRankers] = useState<Ranker[]>(() =>
    loadFromStorage('sachii_rankers', MOCK_RANKERS)
  );

  const [teacherInfo, setTeacherInfo] = useState<typeof TEACHER_INFO>(() =>
    loadFromStorage('sachii_teacher', TEACHER_INFO)
  );

  const [announcement, setAnnouncementState] = useState<string>(() =>
    loadFromStorage('sachii_announcement', '2025/2026/2027 A/L Business Studies Batch Enrollments are now actively open!')
  );

  const [liveTickerConfig, setLiveTickerConfig] = useState<LiveTickerConfig>(() =>
    loadFromStorage('sachii_live_ticker', DEFAULT_LIVE_TICKER)
  );

  const [classOptions, setClassOptions] = useState<ClassOptionItem[]>(() =>
    loadFromStorage('sachii_class_options', DEFAULT_CLASS_OPTIONS)
  );

  const [classModes, setClassModes] = useState<ClassModeItem[]>(() =>
    loadFromStorage('sachii_class_modes', DEFAULT_CLASS_MODES)
  );

  const [registeredStudents, setRegisteredStudents] = useState<RegisteredAccount[]>(() => {
    const loaded = loadFromStorage<RegisteredAccount[]>('sachii_registered_students', []);
    return loaded.length > 0 ? loaded : DEFAULT_REGISTERED_STUDENTS;
  });

  const [recordings, setRecordings] = useState<ClassRecording[]>(() =>
    loadFromStorage('sachii_recordings', DEFAULT_RECORDINGS)
  );

  const [accessRequests, setAccessRequests] = useState<LiveAccessRequest[]>(() =>
    loadFromStorage('sachii_access_requests', DEFAULT_ACCESS_REQUESTS)
  );

  const [recordingPolicy, setRecordingPolicy] = useState<RecordingPolicy>(() =>
    loadFromStorage('sachii_recording_policy', DEFAULT_RECORDING_POLICY)
  );

  const [lessonUnits, setLessonUnits] = useState<LessonUnit[]>(() =>
    loadFromStorage('sachii_lesson_units', DEFAULT_LESSON_UNITS)
  );

  const [paperClassLiveConfig, setPaperClassLiveConfig] = useState<PaperClassLiveConfig>(() =>
    loadFromStorage('sachii_paper_live_config', DEFAULT_PAPER_LIVE_CONFIG)
  );

  const [monthlyApprovals, setMonthlyApprovals] = useState<MonthlyStudentApproval[]>(() =>
    loadFromStorage('sachii_monthly_approvals', DEFAULT_MONTHLY_APPROVALS)
  );


  const [enrollments, setEnrollments] = useState<EnrollmentItem[]>(() =>
    loadFromStorage('sachii_enrollments', [
      {
        id: 'enr-1',
        studentName: 'Charith Wickrama',
        phone: '077 892 3411',
        school: 'Ananda College',
        batchId: 'batch-2025-theory',
        batchTitle: '2025 A/L Theory Masterclass',
        mode: 'physical',
        location: 'Rotary Nugegoda',
        date: '2024-10-02',
        status: 'contacted'
      },
      {
        id: 'enr-2',
        studentName: 'Methmi Nethranjali',
        phone: '071 445 9920',
        school: 'Devi Balika Vidyalaya',
        batchId: 'batch-2026-theory',
        batchTitle: '2026 A/L Beginner to Pro Theory',
        mode: 'online',
        location: 'Global Zoom Online',
        date: '2024-10-02',
        status: 'pending'
      }
    ])
  );

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('sachii_batches', JSON.stringify(batches));
  }, [batches]);

  useEffect(() => {
    localStorage.setItem('sachii_sessions', JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem('sachii_materials', JSON.stringify(materials));
  }, [materials]);

  useEffect(() => {
    localStorage.setItem('sachii_rankers', JSON.stringify(rankers));
  }, [rankers]);

  useEffect(() => {
    localStorage.setItem('sachii_teacher', JSON.stringify(teacherInfo));
  }, [teacherInfo]);

  useEffect(() => {
    localStorage.setItem('sachii_announcement', JSON.stringify(announcement));
  }, [announcement]);

  useEffect(() => {
    localStorage.setItem('sachii_enrollments', JSON.stringify(enrollments));
  }, [enrollments]);

  useEffect(() => {
    localStorage.setItem('sachii_class_options', JSON.stringify(classOptions));
  }, [classOptions]);

  useEffect(() => {
    localStorage.setItem('sachii_class_modes', JSON.stringify(classModes));
  }, [classModes]);

  useEffect(() => {
    localStorage.setItem('sachii_recordings', JSON.stringify(recordings));
  }, [recordings]);

  useEffect(() => {
    localStorage.setItem('sachii_access_requests', JSON.stringify(accessRequests));
  }, [accessRequests]);

  useEffect(() => {
    localStorage.setItem('sachii_recording_policy', JSON.stringify(recordingPolicy));
  }, [recordingPolicy]);

  useEffect(() => {
    localStorage.setItem('sachii_lesson_units', JSON.stringify(lessonUnits));
  }, [lessonUnits]);

  useEffect(() => {
    localStorage.setItem('sachii_paper_live_config', JSON.stringify(paperClassLiveConfig));
  }, [paperClassLiveConfig]);

  useEffect(() => {
    localStorage.setItem('sachii_monthly_approvals', JSON.stringify(monthlyApprovals));
  }, [monthlyApprovals]);


  // Batches CRUD
  const addBatch = (batchData: Omit<BatchInfo, 'id'>) => {
    const newBatch: BatchInfo = {
      ...batchData,
      id: `batch-${Date.now()}`
    };
    setBatches(prev => [newBatch, ...prev]);
  };

  const updateBatch = (id: string, updatedData: Partial<BatchInfo>) => {
    setBatches(prev =>
      prev.map(b => (b.id === id ? { ...b, ...updatedData } : b))
    );
  };

  const deleteBatch = (id: string) => {
    setBatches(prev => prev.filter(b => b.id !== id));
  };

  // Sessions CRUD
  const addSession = (sessionData: Omit<ClassSession, 'id'>) => {
    const newSession: ClassSession = {
      ...sessionData,
      id: `session-${Date.now()}`
    };
    setSessions(prev => [newSession, ...prev]);
  };

  const updateSession = (id: string, updatedData: Partial<ClassSession>) => {
    setSessions(prev =>
      prev.map(s => (s.id === id ? { ...s, ...updatedData } : s))
    );
  };

  const deleteSession = (id: string) => {
    setSessions(prev => prev.filter(s => s.id !== id));
  };

  // Materials CRUD
  const addMaterial = (materialData: Omit<StudyMaterial, 'id'>) => {
    const newMaterial: StudyMaterial = {
      ...materialData,
      id: `mat-${Date.now()}`
    };
    setMaterials(prev => [newMaterial, ...prev]);
  };

  const updateMaterial = (id: string, updatedData: Partial<StudyMaterial>) => {
    setMaterials(prev =>
      prev.map(m => (m.id === id ? { ...m, ...updatedData } : m))
    );
  };

  const deleteMaterial = (id: string) => {
    setMaterials(prev => prev.filter(m => m.id !== id));
  };

  // Rankers CRUD
  const addRanker = (rankerData: Omit<Ranker, 'id'>) => {
    const newRanker: Ranker = {
      ...rankerData,
      id: `ranker-${Date.now()}`
    };
    setRankers(prev => [newRanker, ...prev]);
  };

  const updateRanker = (id: string, updatedData: Partial<Ranker>) => {
    setRankers(prev =>
      prev.map(r => (r.id === id ? { ...r, ...updatedData } : r))
    );
  };

  const deleteRanker = (id: string) => {
    setRankers(prev => prev.filter(r => r.id !== id));
  };

  // Teacher Info & Announcements
  const updateTeacherInfo = (info: Partial<typeof TEACHER_INFO>) => {
    setTeacherInfo(prev => ({ ...prev, ...info }));
  };

  const setAnnouncement = (text: string) => {
    setAnnouncementState(text);
  };

  // Live Ticker Banner Settings
  const updateLiveTickerConfig = (config: Partial<LiveTickerConfig>) => {
    const updated = { ...liveTickerConfig, ...config };
    setLiveTickerConfig(updated);
    localStorage.setItem('sachii_live_ticker', JSON.stringify(updated));
  };

  // Enrollments
  const addEnrollment = (enrollmentData: Omit<EnrollmentItem, 'id' | 'date' | 'status'>) => {
    const newEnrollment: EnrollmentItem = {
      ...enrollmentData,
      id: `enr-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      status: 'pending'
    };
    setEnrollments(prev => [newEnrollment, ...prev]);
  };

  const updateEnrollmentStatus = (id: string, status: EnrollmentItem['status']) => {
    setEnrollments(prev =>
      prev.map(e => (e.id === id ? { ...e, status } : e))
    );
  };

  const deleteEnrollment = (id: string) => {
    setEnrollments(prev => prev.filter(e => e.id !== id));
  };

  // Class Options CRUD
  const addClassOption = (optionData: Omit<ClassOptionItem, 'id'>) => {
    const newOption: ClassOptionItem = {
      ...optionData,
      id: `copt-${Date.now()}`
    };
    setClassOptions(prev => [...prev, newOption]);
  };

  const updateClassOption = (id: string, optionData: Partial<ClassOptionItem>) => {
    setClassOptions(prev =>
      prev.map(o => (o.id === id ? { ...o, ...optionData } : o))
    );
  };

  const deleteClassOption = (id: string) => {
    setClassOptions(prev => prev.filter(o => o.id !== id));
  };

  // Class Modes CRUD
  const addClassMode = (modeData: Omit<ClassModeItem, 'id'>) => {
    const newMode: ClassModeItem = {
      ...modeData,
      id: `cmode-${Date.now()}`
    };
    setClassModes(prev => [...prev, newMode]);
  };

  const updateClassMode = (id: string, modeData: Partial<ClassModeItem>) => {
    setClassModes(prev =>
      prev.map(m => (m.id === id ? { ...m, ...modeData } : m))
    );
  };

  const deleteClassMode = (id: string) => {
    setClassModes(prev => prev.filter(m => m.id !== id));
  };

  // Registered Students Management
  const refreshRegisteredStudents = () => {
    const saved = localStorage.getItem('sachii_registered_students');
    if (saved) {
      try {
        setRegisteredStudents(JSON.parse(saved));
      } catch (e) {
        console.error('Error refreshing registered students:', e);
      }
    }
  };

  const updateStudentStatus = (id: string, status: 'active' | 'pending' | 'suspended') => {
    setRegisteredStudents(prev => {
      const updated = prev.map(s => s.id === id ? { ...s, status } : s);
      localStorage.setItem('sachii_registered_students', JSON.stringify(updated));
      return updated;
    });
  };

  const deleteRegisteredStudent = (id: string) => {
    setRegisteredStudents(prev => {
      const updated = prev.filter(s => s.id !== id);
      localStorage.setItem('sachii_registered_students', JSON.stringify(updated));
      return updated;
    });
  };

  // Recordings CRUD
  const addRecording = (recData: Omit<ClassRecording, 'id'>) => {
    const newRec: ClassRecording = {
      ...recData,
      id: `rec-${Date.now()}`
    };
    setRecordings(prev => [newRec, ...prev]);
  };

  const updateRecording = (id: string, updated: Partial<ClassRecording>) => {
    setRecordings(prev => prev.map(r => r.id === id ? { ...r, ...updated } : r));
  };

  const deleteRecording = (id: string) => {
    setRecordings(prev => prev.filter(r => r.id !== id));
  };

  // Access Requests Management
  const submitAccessRequest = (reqData: Omit<LiveAccessRequest, 'id' | 'status' | 'requestDate'>) => {
    const newReq: LiveAccessRequest = {
      ...reqData,
      id: `req-${Date.now()}`,
      status: 'pending',
      requestDate: new Date().toISOString()
    };
    setAccessRequests(prev => [newReq, ...prev]);
  };

  const updateAccessRequestStatus = (
    id: string,
    status: 'approved' | 'rejected',
    approvedUntil?: string,
    notes?: string
  ) => {
    setAccessRequests(prev =>
      prev.map(r => {
        if (r.id === id) {
          const expiration = approvedUntil || (
            status === 'approved' 
              ? new Date(Date.now() + recordingPolicy.defaultPhysicalApprovedHours * 3600 * 1000).toISOString()
              : undefined
          );
          return {
            ...r,
            status,
            approvedUntil: expiration,
            adminNotes: notes !== undefined ? notes : r.adminNotes
          };
        }
        return r;
      })
    );
  };

  const deleteAccessRequest = (id: string) => {
    setAccessRequests(prev => prev.filter(r => r.id !== id));
  };

  const grantDirectAccess = (access: {
    studentId: string;
    studentName: string;
    studentIndex: string;
    batch: string;
    type: 'live_zoom' | 'recording';
    targetDate: string;
    targetSessionTitle: string;
    recordingId?: string;
    durationHours?: number;
    adminNotes?: string;
  }) => {
    const hours = access.durationHours ?? 48;
    const expiration = hours > 0 ? new Date(Date.now() + hours * 3600 * 1000).toISOString() : undefined;
    const newRequest: LiveAccessRequest = {
      id: `grant-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      studentId: access.studentId,
      studentName: access.studentName,
      studentIndex: access.studentIndex,
      batch: access.batch,
      type: access.type,
      targetDate: access.targetDate,
      targetSessionTitle: access.targetSessionTitle,
      recordingId: access.recordingId,
      reason: 'Direct permission granted by Sir via Admin Portal',
      requestDate: new Date().toISOString(),
      status: 'approved',
      approvedUntil: expiration,
      adminNotes: access.adminNotes || 'Direct Administrative Access Grant'
    };

    setAccessRequests(prev => {
      // Filter out any older pending/duplicate request for this specific target
      const filtered = prev.filter(r => 
        !(r.studentIndex === access.studentIndex && r.type === access.type && (r.recordingId === access.recordingId || r.targetDate === access.targetDate))
      );
      return [newRequest, ...filtered];
    });
  };

  const extendAccessDuration = (id: string, additionalHours: number) => {
    setAccessRequests(prev =>
      prev.map(r => {
        if (r.id === id) {
          const currentExpiry = r.approvedUntil ? new Date(r.approvedUntil).getTime() : Date.now();
          const base = Math.max(currentExpiry, Date.now());
          const newExpiry = new Date(base + additionalHours * 3600 * 1000).toISOString();
          return {
            ...r,
            status: 'approved' as const,
            approvedUntil: newExpiry,
            adminNotes: `${r.adminNotes || ''} (Extended +${additionalHours}h)`.trim()
          };
        }
        return r;
      })
    );
  };

  const revokeAccess = (id: string, note?: string) => {
    setAccessRequests(prev =>
      prev.map(r => {
        if (r.id === id) {
          return {
            ...r,
            status: 'rejected' as const,
            approvedUntil: undefined,
            adminNotes: note || 'Access revoked by Sir via Admin Portal'
          };
        }
        return r;
      })
    );
  };

  const updateRecordingPolicy = (policy: Partial<RecordingPolicy>) => {
    setRecordingPolicy(prev => ({ ...prev, ...policy }));
  };


  // Lesson Units CRUD
  const addLessonUnit = (unitData: Omit<LessonUnit, 'id'>) => {
    const newUnit: LessonUnit = {
      ...unitData,
      id: `unit-${Date.now()}`
    };
    setLessonUnits(prev => [...prev, newUnit]);
  };

  const updateLessonUnit = (id: string, updatedData: Partial<LessonUnit>) => {
    setLessonUnits(prev => prev.map(u => u.id === id ? { ...u, ...updatedData } : u));
  };

  const deleteLessonUnit = (id: string) => {
    setLessonUnits(prev => prev.filter(u => u.id !== id));
  };

  // Paper Class Live Config
  const updatePaperClassLiveConfig = (config: Partial<PaperClassLiveConfig>) => {
    const updated = { ...paperClassLiveConfig, ...config };
    setPaperClassLiveConfig(updated);
    localStorage.setItem('sachii_paper_live_config', JSON.stringify(updated));
  };

  // Monthly Student Approvals
  const updateMonthlyApproval = (approval: MonthlyStudentApproval) => {
    setMonthlyApprovals(prev => {
      const idx = prev.findIndex(a => a.studentId === approval.studentId && a.month === approval.month);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], ...approval, updatedAt: new Date().toISOString() };
        return copy;
      }
      return [...prev, { ...approval, id: approval.id || `appr-${Date.now()}-${Math.random().toString(36).substr(2, 4)}` }];
    });
  };

  const batchUpdateMonthlyApprovals = (
    month: string,
    studentIds: string[],
    updates: Partial<MonthlyStudentApproval>
  ) => {
    setMonthlyApprovals(prev => {
      return prev.map(a => {
        if (a.month === month && studentIds.includes(a.studentId)) {
          return { ...a, ...updates, updatedAt: new Date().toISOString() };
        }
        return a;
      });
    });
  };

  const getStudentMonthlyApproval = (studentId: string, month: string): MonthlyStudentApproval | undefined => {
    return monthlyApprovals.find(a => (a.studentId === studentId || a.studentIndex === studentId) && a.month === month);
  };

  // Highlight Stat Cards CRUD & Persistence
  const updateHighlightStat = (id: string, stat: Partial<StatCardItem>) => {
    setHighlightStats(prev => {
      const updated = prev.map(s => s.id === id ? { ...s, ...stat } : s);
      localStorage.setItem('sachii_highlight_stats', JSON.stringify(updated));
      return updated;
    });
  };

  const updateAllHighlightStats = (stats: StatCardItem[]) => {
    setHighlightStats(stats);
    localStorage.setItem('sachii_highlight_stats', JSON.stringify(stats));
  };

  const addHighlightStat = (stat: StatCardItem) => {
    setHighlightStats(prev => {
      const next = [...prev, stat];
      localStorage.setItem('sachii_highlight_stats', JSON.stringify(next));
      return next;
    });
  };

  const deleteHighlightStat = (id: string) => {
    setHighlightStats(prev => {
      const next = prev.filter(s => s.id !== id);
      localStorage.setItem('sachii_highlight_stats', JSON.stringify(next));
      return next;
    });
  };

  const resetHighlightStats = () => {
    setHighlightStats(DEFAULT_HIGHLIGHT_STATS);
    localStorage.setItem('sachii_highlight_stats', JSON.stringify(DEFAULT_HIGHLIGHT_STATS));
  };

  // Master Reset
  const resetAllData = () => {
    localStorage.removeItem('sachii_batches');
    localStorage.removeItem('sachii_sessions');
    localStorage.removeItem('sachii_materials');
    localStorage.removeItem('sachii_rankers');
    localStorage.removeItem('sachii_teacher');
    localStorage.removeItem('sachii_announcement');
    localStorage.removeItem('sachii_live_ticker');
    localStorage.removeItem('sachii_enrollments');
    localStorage.removeItem('sachii_class_options');
    localStorage.removeItem('sachii_class_modes');
    localStorage.removeItem('sachii_registered_students');
    localStorage.removeItem('sachii_recordings');
    localStorage.removeItem('sachii_access_requests');
    localStorage.removeItem('sachii_recording_policy');

    localStorage.removeItem('sachii_lesson_units');
    localStorage.removeItem('sachii_paper_live_config');
    localStorage.removeItem('sachii_monthly_approvals');
    localStorage.removeItem('sachii_highlight_stats');

    setLessonUnits(DEFAULT_LESSON_UNITS);
    setPaperClassLiveConfig(DEFAULT_PAPER_LIVE_CONFIG);
    setMonthlyApprovals(DEFAULT_MONTHLY_APPROVALS);
    setHighlightStats(DEFAULT_HIGHLIGHT_STATS);


    setBatches(MOCK_BATCHES);
    setSessions(MOCK_SESSIONS);
    setMaterials(MOCK_STUDY_MATERIALS);
    setRankers(MOCK_RANKERS);
    setTeacherInfo(TEACHER_INFO);
    setAnnouncementState('2025/2026/2027 A/L Business Studies Batch Enrollments are now actively open!');
    setLiveTickerConfig(DEFAULT_LIVE_TICKER);
    setClassOptions(DEFAULT_CLASS_OPTIONS);
    setClassModes(DEFAULT_CLASS_MODES);
    setRegisteredStudents([]);
    setRecordings(DEFAULT_RECORDINGS);
    setAccessRequests(DEFAULT_ACCESS_REQUESTS);
    setRecordingPolicy(DEFAULT_RECORDING_POLICY);
    setEnrollments([]);
  };

  return (
    <DataContext.Provider
      value={{
        batches,
        sessions,
        materials,
        rankers,
        teacherInfo,
        enrollments,
        announcement,
        liveTickerConfig,
        updateLiveTickerConfig,
        classOptions,
        addClassOption,
        updateClassOption,
        deleteClassOption,
        classModes,
        addClassMode,
        updateClassMode,
        deleteClassMode,
        registeredStudents,
        updateStudentStatus,
        deleteRegisteredStudent,
        refreshRegisteredStudents,
        recordings,
        addRecording,
        updateRecording,
        deleteRecording,
        accessRequests,
        submitAccessRequest,
        updateAccessRequestStatus,
        deleteAccessRequest,
        grantDirectAccess,
        extendAccessDuration,
        revokeAccess,
        recordingPolicy,
        updateRecordingPolicy,

        lessonUnits,
        addLessonUnit,
        updateLessonUnit,
        deleteLessonUnit,
        paperClassLiveConfig,
        updatePaperClassLiveConfig,
        monthlyApprovals,
        updateMonthlyApproval,
        batchUpdateMonthlyApprovals,
        getStudentMonthlyApproval,

        addBatch,
        updateBatch,
        deleteBatch,
        addSession,
        updateSession,
        deleteSession,
        addMaterial,
        updateMaterial,
        deleteMaterial,
        addRanker,
        updateRanker,
        deleteRanker,
        updateTeacherInfo,
        setAnnouncement,
        addEnrollment,
        updateEnrollmentStatus,
        deleteEnrollment,
        highlightStats,
        updateHighlightStat,
        updateAllHighlightStats,
        addHighlightStat,
        deleteHighlightStat,
        resetHighlightStats,

        // Aliases for compatibility
        statMetrics: highlightStats,
        updateStatMetric: updateHighlightStat,
        addStatMetric: addHighlightStat,
        deleteStatMetric: deleteHighlightStat,
        resetStatMetrics: resetHighlightStats,

        resetAllData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
