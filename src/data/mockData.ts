import { ClassSession, BatchInfo, StudyMaterial, Ranker, Testimonial, StudentProfile } from '../types';

export const TEACHER_INFO = {
  name: "Sachitha Sankalpa",
  honorific: "Sachitha Sankalpa",
  title: "B.Sc. Business Administration (Special) USJ | Reading for M.Sc. HRM (UOC) | A/L Business Studies Specialist",
  subject: "G.C.E. Advanced Level Business Studies (English & Sinhala Medium)",
  tagline: "Beyond the Theory • Visual Mind Mapping & Real Corporate Acumen",
  experienceYears: 8,
  studentsTrained: "8,500+",
  islandRanksCount: "28+ Island Top Ranks & Top University Entrants",
  passRate: "99.2%",
  contact: {
    hotline: "+94 77 123 4567",
    whatsapp: "+94 77 123 4567",
    email: "sachithasankalpasl@gmail.com",
    telegram: "https://t.me/bswithsachitha",
    youtube: "https://youtube.com/@businessstudieswithsachitha",
    instagram: "https://www.instagram.com/business_studies_with_sachitha/",
    instagramHandle: "@business_studies_with_sachitha",
    facebook: "https://www.facebook.com/sachithasankalpaSL/",
    facebookHandle: "@sachithasankalpaSL",
    halls: [
      { name: "Sasip Institute", city: "Nugegoda", address: "Stanley Thilakaratne Mawatha, Nugegoda" },
      { name: "Rotary Institute", city: "Nugegoda", address: "High Level Road, Nugegoda" },
      { name: "Texas Higher Education Institute", city: "Battaramulla", address: "Main Street, Battaramulla" },
      { name: "Global Zoom Live Online", city: "Islandwide & Overseas", address: "Synchronized 1080p HD Video Portal" }
    ]
  },
  bio: "B.Sc. in Business Administration (Special) graduate from the University of Sri Jayewardenepura (USJ) and currently reading for an M.Sc. in Human Resource Management at the University of Colombo (UOC). Renowned across Sri Lanka for his signature 'Beyond the Theory' methodology, Sachitha Sankalpa transforms A/L Business Studies into engaging visual mind maps, real-world corporate case studies, and precision exam techniques that consistently produce island rankers and top commerce faculty entrants."
};

export const MOCK_SESSIONS: ClassSession[] = [
  {
    id: "session-1",
    batchName: "2027 A/L Theory (Comprehensive)",
    subject: "Unit 01: Foundations of Business & Economic Environment",
    dayOfWeek: "Every Saturday",
    time: "08:00 AM - 01:30 PM",
    mode: "hybrid",
    location: "Sasip Institute, Nugegoda & Zoom HD",
    hallNumber: "Hall 01 (Air Conditioned)",
    nextSessionDate: "Upcoming this Saturday",
    targetAudience: "2027 A/L Commerce Students",
    zoomMeetingId: "945 8820 1194",
    passcode: "BS2027",
    status: "upcoming"
  },
  {
    id: "session-2",
    batchName: "2026 A/L Theory & Intensive Revision",
    subject: "Unit 04: Marketing Management & Consumer Dynamics",
    dayOfWeek: "Every Sunday",
    time: "08:00 AM - 01:00 PM",
    mode: "hybrid",
    location: "Rotary Institute, Nugegoda & Zoom HD",
    hallNumber: "Grand Auditorium",
    nextSessionDate: "Upcoming this Sunday",
    targetAudience: "2026 A/L Students",
    zoomMeetingId: "912 3345 8821",
    passcode: "BS2026",
    status: "upcoming"
  },
  {
    id: "session-3",
    batchName: "2025 Speed Paper & Detailed Marking Discussion",
    subject: "Model Paper 08 Analysis & Marking Scheme Derivation",
    dayOfWeek: "Every Wednesday",
    time: "06:00 PM - 09:30 PM",
    mode: "hybrid",
    location: "Texas Institute, Battaramulla & Zoom Live",
    hallNumber: "Lecture Hall B",
    nextSessionDate: "Upcoming this Wednesday",
    targetAudience: "2025 & Repeat Commerce Candidates",
    zoomMeetingId: "772 1094 3302",
    passcode: "PAPER25",
    status: "upcoming"
  },
  {
    id: "session-4",
    batchName: "2027 English Medium Theory",
    subject: "Unit 02: Principles of Management & Organizational Structures",
    dayOfWeek: "Every Friday",
    time: "03:30 PM - 07:00 PM",
    mode: "online",
    location: "Global Zoom Live Stream",
    hallNumber: "Interactive Portal",
    nextSessionDate: "Upcoming this Friday",
    targetAudience: "English Medium Commerce Batch",
    zoomMeetingId: "654 9912 0019",
    passcode: "BSENG27",
    status: "upcoming"
  }
];

export const MOCK_BATCHES: BatchInfo[] = [
  {
    id: "batch-2027-theory",
    title: "2027 A/L Business Studies Theory",
    subtitle: "Complete syllabus coverage from scratch with visual mind mapping, corporate case studies & printed workbooks",
    tag: "Fresh Intake",
    grade: "2027 A/L",
    startDate: "Enrolling Now - Limited Seats",
    scheduleSummary: "Saturdays 8.00 AM - 1.30 PM",
    mode: "hybrid",
    venue: "Sasip Nugegoda & Zoom HD",
    fee: "LKR 4,500 / Month",
    popular: true,
    features: [
      "Visual mind mapping for every syllabus competency",
      "Real corporate case studies (Dialog, Hayleys, Brandix, MAS)",
      "Monthly printed theory booklets delivered islandwide",
      "24/7 unlimited access to HD video recordings archive"
    ]
  },
  {
    id: "batch-2026-theory",
    title: "2026 A/L Theory & Intensive Revision",
    subtitle: "Comprehensive unit revision, essay derivation drills, and speed recall techniques for high A grades",
    tag: "Most Popular",
    grade: "2026 A/L",
    startDate: "Unit 04 Commencing This Week",
    scheduleSummary: "Sundays 8.00 AM - 1.00 PM",
    mode: "hybrid",
    venue: "Rotary Nugegoda & Zoom HD",
    fee: "LKR 4,500 / Month",
    popular: false,
    features: [
      "Deep dive into Operations, Marketing & Financial Management",
      "Structured essay writing frameworks to secure 100/100 marks",
      "Weekly diagnostic spot quizzes with instant leaderboards",
      "Personal mentor assistance for student academic queries"
    ]
  },
  {
    id: "batch-paper-class",
    title: "Timed Speed Paper & Marking Scheme Class",
    subtitle: "Simulated exam conditions with strict 3-hour timer, individualized marking, and marking scheme breakdown",
    tag: "Score Booster",
    grade: "2025 & Repeaters",
    startDate: "Weekly Sessions Open",
    scheduleSummary: "Wednesdays 6.00 PM - 9.30 PM",
    mode: "online",
    venue: "Texas Battaramulla & Zoom Live",
    fee: "LKR 3,500 / Month",
    popular: true,
    features: [
      "Real exam environment with strict countdown timer",
      "Official marking scheme breakdown with examiners' insider tips",
      "Common student pitfalls and mark-losing trap alerts",
      "Islandwide rank sheet published for every mock paper"
    ]
  }
];

export const MOCK_STUDY_MATERIALS: StudyMaterial[] = [
  {
    id: "mat-1",
    title: "Unit 01: Foundations of Business & Economic Environment Master Summary",
    category: "theory_modules",
    batch: "2027 Theory",
    unitId: "unit-1",
    unitNumber: 1,
    unitTitle: "Unit 01: ව්‍යාපාර පරිසරය හා හැඳින්වීම",
    classType: "theory",
    fileSize: "4.8 MB",
    fileFormat: "PDF",
    downloadsCount: 1420,
    publishedDate: "October 2026",
    isLocked: false,
    downloadUrl: "#",
    description: "Complete visual mind map, economic systems comparison, stakeholder matrix, and 25 structured practice derivations."
  },
  {
    id: "mat-2",
    title: "2024 A/L Official Business Studies Marking Scheme & Evaluation Breakdown",
    category: "marking_schemes",
    batch: "All Batches",
    unitId: "unit-1",
    unitNumber: 1,
    unitTitle: "Unit 01: ව්‍යාපාර පරිසරය හා හැඳින්වීම",
    classType: "both",
    fileSize: "6.2 MB",
    fileFormat: "PDF",
    downloadsCount: 3890,
    publishedDate: "September 2026",
    isLocked: false,
    downloadUrl: "#",
    description: "Official mark distribution breakdown, alternative answer approaches, and common examiner remarks."
  },
  {
    id: "mat-3",
    title: "Unit 02: Management Theories & Motivational Models (Taylor, Fayol, Maslow) Pocket Sheet",
    category: "short_notes",
    batch: "2026 Revision",
    unitId: "unit-2",
    unitNumber: 2,
    unitTitle: "Unit 02: කළමනාකරණය හා සංවිධාන ව්‍යුහය",
    classType: "theory",
    fileSize: "2.1 MB",
    fileFormat: "PDF",
    downloadsCount: 2750,
    publishedDate: "September 2026",
    isLocked: false,
    downloadUrl: "#",
    description: "High-density color summary sheet with all leadership styles, motivational models, and organizational charts."
  },
  {
    id: "mat-4",
    title: "Sachitha Sir's 2027 All-Island Model Paper 01 (Part I & Part II)",
    category: "model_papers",
    batch: "Paper Class Exclusive",
    unitId: "unit-3",
    unitNumber: 3,
    unitTitle: "Unit 03: මෙහෙයුම් කළමනාකරණය",
    classType: "paper",
    fileSize: "5.5 MB",
    fileFormat: "PDF",
    downloadsCount: 1980,
    publishedDate: "October 2026",
    isLocked: true,
    downloadUrl: "#",
    description: "Curated model paper with predicted question frameworks for upcoming A/L Commerce examination."
  },
  {
    id: "mat-5",
    title: "Unit 05: Financial Management Ratios & Formulas Quick Recall Sheet",
    category: "short_notes",
    batch: "2026 & 2027",
    unitId: "unit-5",
    unitNumber: 5,
    unitTitle: "Unit 05: මූල්‍ය කළමනාකරණය හා ගිණුම්කරණය",
    classType: "both",
    fileSize: "1.9 MB",
    fileFormat: "PDF",
    downloadsCount: 3100,
    publishedDate: "August 2026",
    isLocked: false,
    downloadUrl: "#",
    description: "All profitability, liquidity, efficiency, and investment ratio calculations with solved exemplar questions."
  },
  {
    id: "mat-6",
    title: "Unit 04: Marketing Management (4Ps & Modern Digital Marketing Frameworks)",
    category: "theory_modules",
    batch: "2026 Batch",
    unitId: "unit-4",
    unitNumber: 4,
    unitTitle: "Unit 04: අලෙවිකරණ කළමනාකරණය",
    classType: "theory",
    fileSize: "4.2 MB",
    fileFormat: "PDF",
    downloadsCount: 2400,
    publishedDate: "July 2026",
    isLocked: false,
    downloadUrl: "#",
    description: "Comprehensive study booklet on product lifecycle, pricing strategies, market segmentation, and digital distribution."
  }
];

export const MOCK_RANKERS: Ranker[] = [
  {
    id: "ranker-1",
    name: "Dineth Mendis",
    rank: "Island Rank 01",
    stream: "Commerce Stream (A/L)",
    year: "2023 A/L",
    district: "Colombo District",
    university: "University of Sri Jayewardenepura - Faculty of Management Studies & Commerce",
    photoUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80",
    quote: "Sachitha Sir's visual mind mapping transformed Business Studies from boring memorization into pure logic. His speed paper drills gave me the confidence to complete the 3-hour exam with time to spare."
  },
  {
    id: "ranker-2",
    name: "Senuri Jayathilaka",
    rank: "Island Rank 03",
    stream: "Commerce Stream (A/L)",
    year: "2023 A/L",
    district: "Gampaha District Rank 01",
    university: "University of Colombo - Faculty of Management & Finance",
    photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    quote: "The 'Beyond the Theory' approach and corporate case studies gave me unique insights that examiners loved. Sachitha Sir was always available to review our essay answers."
  },
  {
    id: "ranker-3",
    name: "Kavindu Wickramaratne",
    rank: "Island Rank 07",
    stream: "Commerce Stream (A/L)",
    year: "2022 A/L",
    district: "Kalutara District Rank 01",
    university: "University of Sri Jayewardenepura - Department of Business Administration",
    photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    quote: "Attending Sasip Nugegoda physical classes combined with Zoom recordings made revision effortless. The speed paper class was undoubtedly the game changer for my 3A result."
  }
];

export const MOCK_TESTIMONIALS: Testimonial[] = [
  {
    id: "test-1",
    studentName: "Ashan Wijesinghe",
    school: "Royal College, Colombo",
    results: "3A's (Z-Score: 2.3940)",
    comment: "Business Studies used to feel overwhelming with too much theory to remember. Sachitha Sir's mind maps organized every unit hierarchically. Learning became effortless!",
    rating: 5,
    batch: "2023 A/L Theory",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80"
  },
  {
    id: "test-2",
    studentName: "Thilini Wickramasinghe",
    school: "Visakha Vidyalaya, Colombo",
    results: "3A's (Z-Score: 2.3810)",
    comment: "The speed paper class at Sasip is unmatched! You get real exam pressure training, and the marking scheme breakdown pinpointed exactly where examiners deduct marks.",
    rating: 5,
    batch: "2023 A/L Paper Class",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80"
  },
  {
    id: "test-3",
    studentName: "Nuwan Jayasuriya",
    school: "Ananda College, Colombo",
    results: "3A's (Z-Score: 2.4120)",
    comment: "Sir's passion and energy in the hall are contagious. He explains every business concept using real examples from the Colombo Stock Exchange and multinational corporations.",
    rating: 5,
    batch: "2024 A/L Theory & Revision",
    avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&q=80"
  }
];

export const MOCK_STUDENT: StudentProfile = {
  id: "std-2027-089",
  name: "Kasun Malinda Perera",
  indexNo: "BS-2027-4819",
  email: "kasun.student@gmail.com",
  phone: "+94 71 889 2314",
  batch: "2027 A/L Business Studies Batch",
  hallLocation: "Sasip Institute, Nugegoda",
  attendanceRate: 98.5,
  enrolledBatches: [
    "2027 A/L Theory (Comprehensive)",
    "2027 Speed Paper Class"
  ],
  nextClassZoomLink: "https://zoom.us/j/94588201194?pwd=SACHII_STUDENT_DIRECT_ACCESS",
  avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
  classOption: "2027 BS Theory (Comprehensive)",
  classMode: "Online (with Zoom)",
  isPhysical: false
};
