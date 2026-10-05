export type PageId = 'home' | 'schedule' | 'about' | 'materials' | 'admin' | 'login' | 'dashboard';

export type DeliveryMode = 'physical' | 'online' | 'hybrid';

export interface ClassSession {
  id: string;
  batchName: string;
  subject: string;
  dayOfWeek: string; // e.g. "Every Saturday"
  time: string; // e.g. "8:00 AM - 1:30 PM"
  mode: DeliveryMode;
  location: string; // e.g. "Rotary Hall, Nugegoda" or "Zoom Live Stream"
  hallNumber?: string;
  nextSessionDate: string; // ISO date string or formatted date
  targetAudience: string; // e.g. "2025 A/L Batch"
  zoomMeetingId?: string;
  passcode?: string;
  status: 'upcoming' | 'live' | 'completed';
}

export interface BatchInfo {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  grade: string;
  startDate: string;
  scheduleSummary: string;
  features: string[];
  mode: DeliveryMode;
  venue: string;
  fee: string;
  popular?: boolean;
}

export interface StudyMaterial {
  id: string;
  title: string;
  category: 'past_papers' | 'model_papers' | 'short_notes' | 'theory_modules' | 'marking_schemes' | 'tutes';
  batch: string;
  fileSize: string;
  fileFormat: string;
  downloadsCount: number;
  publishedDate: string;
  isLocked: boolean; // Needs student login if true
  downloadUrl: string;
  description: string;
  unitId?: string;
  unitNumber?: number;
  unitTitle?: string;
  classType?: 'theory' | 'paper' | 'revision' | 'both';
}

export interface Ranker {
  id: string;
  name: string;
  rank: string;
  stream: string;
  year: string;
  district: string;
  university: string;
  photoUrl: string;
  quote: string;
}

export interface Testimonial {
  id: string;
  studentName: string;
  school: string;
  results: string;
  comment: string;
  rating: number;
  batch: string;
  avatar: string;
}

export interface StudentProfile {
  id: string;
  name: string;
  indexNo: string;
  email: string;
  phone: string;
  batch: string;
  hallLocation: string;
  attendanceRate: number; // e.g. 96%
  enrolledBatches: string[];
  nextClassZoomLink: string;
  avatarUrl: string;
  classOption?: string;
  classMode?: string;
  isPhysical?: boolean;
}

export interface EnrollmentItem {
  id: string;
  studentName: string;
  phone: string;
  school: string;
  batchId: string;
  batchTitle: string;
  mode: 'physical' | 'online';
  location: string;
  date: string;
  status: 'pending' | 'contacted' | 'admitted';
}

export interface LiveTickerConfig {
  isEnabled: boolean; // Turn on/off
  batchBadge: string; // e.g. "2026 A/L Theory & Paper Batch"
  subject: string; // e.g. "Business Studies – Comprehensive Theory & Speed Paper Masterclass"
  timeSlot: string; // e.g. "08:00 AM – 01:30 PM"
  venue: string; // e.g. "Rotary Institute, Nugegoda & Zoom HD"
  countdownMinutes: number; // e.g. 15
  isStreamingNow: boolean; // if true, shows "LIVE NOW" instead of countdown
  zoomMeetingId: string;
  zoomPasscode: string;
  scheduledDateTime: string; // ISO or human string

  // Daily Class Tute & Handout Upload
  todayTuteTitle?: string; // e.g. "Unit 04: Production & Operations Management Full Tute"
  todayTuteUrl?: string; // File URL or PDF download link
  todayTuteSize?: string; // e.g. "4.2 MB PDF"
  todayTuteDescription?: string;

  // Continuous Session (Theory + Paper together in one room)
  isContinuousSession?: boolean;
  theoryPartTitle?: string;
  theoryPartTime?: string;
  paperPartTitle?: string;
  paperPartTime?: string;
  attachedMaterials?: { title: string; fileUrl: string; fileSize: string }[];
}

export interface RegistrationPayload {
  firstName: string;
  lastName: string;
  email: string;
  school: string;
  district: string;
  whatsapp: string;
  parentPhone: string;
  address: {
    street: string;
    area: string;
    city: string;
  };
  batch: string;
  classOption: string; // Renamed to Class Option
  classMode: string; // Renamed to Class Mode
  classModule?: string; // For backward compatibility
  deliveryMode?: string; // For backward compatibility
  nicNumber: string;
  password: string;
}

export interface ClassOptionItem {
  id: string;
  batch: string; // e.g. "2028 Batch", "2027 Batch", "2026 Batch"
  title: string; // e.g. "2027 BS Theory (Comprehensive)"
  description?: string;
  badge?: string; // e.g. "Theory + Revision", "Recommended"
  fee?: string;
  isActive: boolean;
}

export interface ClassModeItem {
  id: string;
  name: string; // e.g. "Online (with Zoom)", "Sasip Institute, Nugegoda"
  type: 'online' | 'physical';
  description?: string;
  isActive: boolean;
}

export interface RegisteredAccount extends RegistrationPayload {
  id: string;
  indexNo: string;
  createdAt: string;
  status: 'active' | 'pending' | 'suspended';
  lastLogin?: string;
}

export interface LiveAccessRequest {
  id: string;
  studentId: string;
  studentName: string;
  studentIndex: string;
  batch: string;
  type: 'live_zoom' | 'recording';
  targetDate: string; // e.g. "2026-10-04"
  targetSessionTitle: string; // e.g. "Unit 4: Operations Management Masterclass"
  recordingId?: string;
  reason: string; // e.g. "Illness / School Sports Meet"
  requestDate: string; // ISO string
  status: 'pending' | 'approved' | 'rejected';
  approvedUntil?: string; // ISO expiration timestamp
  adminNotes?: string;
}

export interface ClassRecording {
  id: string;
  batch: string;
  title: string;
  unitName: string; // e.g. "Unit 1: Foundations of Business"
  date: string; // e.g. "2026-09-28"
  duration: string; // e.g. "2 hrs 45 mins"
  videoUrl: string; // YouTube, Vimeo, Zoom cloud or MP4 link
  thumbnailUrl?: string;
  attachedMaterials?: { title: string; fileUrl: string; fileSize: string }[];
  availableForDays: number; // default validity e.g. 14 days
  isLockedForPhysical: boolean; // default true for physical students unless approved
  status: 'published' | 'processing' | 'archived';
}

export interface RecordingPolicy {
  onlineStudentDays: number;
  defaultPhysicalApprovedHours: number;
}

export interface LessonUnit {
  id: string;
  unitNumber: number; // e.g. 1, 2, 3...
  title: string; // e.g. "Unit 01: ව්‍යාපාර පරිසරය හා හැඳින්වීම (Introduction to Business & Environment)"
  batch: string; // e.g. "2027 Batch", "2026 Batch", "All Batches"
  description: string;
  order: number;
  isActive: boolean;
}

export interface PaperClassLiveConfig {
  isEnabled: boolean;
  title: string; // e.g. "2027 A/L Business Studies Speed Paper & Discussion"
  paperNumber: string; // e.g. "Model Paper #08 (Full Timed Test)"
  timeSlot: string; // e.g. "Wednesday 06:00 PM – 09:30 PM"
  zoomMeetingId: string;
  zoomPasscode: string;
  durationMinutes: number;
  isLiveNow: boolean;
  scheduledDateTime: string;
  attachedPaperPdf?: string;
  attachedMarkingPdf?: string;
  venue?: string;
}

export interface MonthlyStudentApproval {
  id: string; // e.g. `${studentId}_${month}` or `${studentIndex}_${month}`
  studentId: string;
  studentIndex: string;
  studentName: string;
  studentEmail: string;
  batch: string;
  month: string; // e.g. "2026-10" (October 2026)
  theoryApproved: boolean;
  paperApproved: boolean;
  revisionApproved: boolean;
  feeStatus: 'paid' | 'pending' | 'free_scholarship';
  notes?: string;
  approvedAt?: string;
  updatedAt?: string;
}

export type StatIconType =
  | 'Award'
  | 'Users'
  | 'TrendingUp'
  | 'GraduationCap'
  | 'CheckCircle2'
  | 'BookOpen'
  | 'Target'
  | 'Clock';

export interface StatCardItem {
  id: string;
  value: string;
  label: string;
  subtext: string;
  badge?: string;
  glowColor: 'indigo' | 'emerald' | 'purple' | 'cyan' | 'amber' | 'rose';
  iconType: StatIconType;
  order?: number;
  isActive?: boolean;
}

export type StatMetricItem = StatCardItem;
export type StatMetricIconType = StatIconType;
