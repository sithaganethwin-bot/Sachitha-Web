import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  GraduationCap,
  Radio,
  Video,
  Calendar,
  BookOpen,
  Lock,
  Unlock,
  Clock,
  Download,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Play,
  FileText,
  Search,
  Filter,
  Copy,
  Check,
  LogOut,
  ArrowRight,
  ShieldAlert,
  ShieldCheck,
  MapPin,
  Globe,
  Bell,
  RefreshCw,
  X,
  Share2,
  Maximize2,
  Layers,
  ChevronRight,
  Award,
  CreditCard
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { BorderGlow } from '../common/BorderGlow';
import { RequestAccessModal } from './RequestAccessModal';
import { ClassRecording, ClassSession, LessonUnit, StudyMaterial } from '../../types';

interface StudentDashboardPageProps {
  onNavigateHome: () => void;
  onOpenSchedule?: () => void;
  onOpenMaterials?: () => void;
}

export const StudentDashboardPage: React.FC<StudentDashboardPageProps> = ({
  onNavigateHome,
  onOpenSchedule,
  onOpenMaterials,
}) => {
  const { student, logout } = useAuth();
  const {
    sessions,
    materials,
    recordings,
    accessRequests,
    recordingPolicy,
    liveTickerConfig,
    lessonUnits,
    paperClassLiveConfig,
    monthlyApprovals,
  } = useData();

  // Active section (Unified Live Meeting Room includes both Theory & Paper Class)
  const [activeTab, setActiveTab] = useState<'live' | 'recordings' | 'timetable' | 'materials'>('live');

  // Zoom Player Mode: 'embed' (in-website web client) vs 'external' (standalone/app)
  const [theoryZoomMode, setTheoryZoomMode] = useState<'embed' | 'app'>('embed');
  const [paperZoomMode, setPaperZoomMode] = useState<'embed' | 'app'>('embed');

  // Request Access Modal
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [requestModalType, setRequestModalType] = useState<'live_zoom' | 'recording'>('live_zoom');
  const [requestTargetRecId, setRequestTargetRecId] = useState<string | undefined>(undefined);
  const [requestTargetRecTitle, setRequestTargetRecTitle] = useState<string | undefined>(undefined);

  // Active video player modal
  const [activePlayerRecording, setActivePlayerRecording] = useState<ClassRecording | null>(null);

  // Copy feedback state
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Search & Filter state for recordings
  const [recSearch, setRecSearch] = useState('');
  const [recUnitFilter, setRecUnitFilter] = useState('all');

  // Search & Filter state for materials
  const [matSearch, setMatSearch] = useState('');
  const [matCategory, setMatCategory] = useState('all');
  const [selectedUnitFilter, setSelectedUnitFilter] = useState<string>('all');

  // Live Classroom Countdown Timer (15-min countdown)
  const [secondsUntilClass, setSecondsUntilClass] = useState<number>(845);
  const [isClassBroadcasting, setIsClassBroadcasting] = useState<boolean>(true);

  // Paper Class Timed Test Clock (e.g. 3 Hours mock exam simulation)
  const [paperTimerSeconds, setPaperTimerSeconds] = useState<number>(10800); // 3 hrs

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsUntilClass((prev) => {
        if (prev <= 1) {
          setIsClassBroadcasting(true);
          return 0;
        }
        return prev - 1;
      });

      setPaperTimerSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Sync active tab with URL path
  useEffect(() => {
    const p = window.location.pathname.toLowerCase();
    if (p.includes('/recordings')) setActiveTab('recordings');
    else if (p.includes('/calendar') || p.includes('/timetable')) setActiveTab('timetable');
    else if (p.includes('/materials')) setActiveTab('materials');
    else if (p.includes('/live') || p.includes('/paper')) setActiveTab('live');
  }, []);

  if (!student) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-slate-900 text-white">
        <div className="text-center space-y-4">
          <p className="text-sm text-slate-400">You are not logged in. Please sign in to access your student portal.</p>
          <button
            onClick={onNavigateHome}
            className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs cursor-pointer"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  // Check physical vs online status
  const isPhysicalStudent = student.isPhysical ?? false;

  // Monthly Approval lookup for current month ("2026-10")
  const currentMonth = '2026-10';
  const currentMonthApproval = monthlyApprovals.find(
    (a) => (a.studentId === student.id || a.studentIndex === student.indexNo) && a.month === currentMonth
  );

  const isTheoryApproved = currentMonthApproval ? currentMonthApproval.theoryApproved : true;
  const isPaperApproved = currentMonthApproval ? currentMonthApproval.paperApproved : false;

  // Check if physical student has an approved live request
  const activeLiveApproval = accessRequests.find(
    (r) =>
      r.studentIndex === student.indexNo &&
      r.type === 'live_zoom' &&
      r.status === 'approved' &&
      (!r.approvedUntil || new Date(r.approvedUntil) > new Date())
  );

  const pendingLiveRequest = accessRequests.find(
    (r) =>
      r.studentIndex === student.indexNo &&
      r.type === 'live_zoom' &&
      r.status === 'pending'
  );

  // Can access Theory Live Classroom
  const canAccessTheoryLive = (!isPhysicalStudent || !!activeLiveApproval) && isTheoryApproved;

  // Check recording access
  const checkRecordingAccess = (rec: ClassRecording) => {
    if (!rec.isLockedForPhysical || !isPhysicalStudent) {
      return { isAllowed: true, reason: 'unrestricted', expirationNote: 'Active Access' };
    }

    const approvedRequest = accessRequests.find(
      (r) =>
        r.studentIndex === student.indexNo &&
        r.type === 'recording' &&
        (r.recordingId === rec.id || r.targetDate === rec.date) &&
        r.status === 'approved' &&
        (!r.approvedUntil || new Date(r.approvedUntil) > new Date())
    );

    if (approvedRequest) {
      return { isAllowed: true, reason: 'approved', expirationNote: 'Temporary Access Granted' };
    }

    const pendingRequest = accessRequests.find(
      (r) =>
        r.studentIndex === student.indexNo &&
        r.type === 'recording' &&
        (r.recordingId === rec.id || r.targetDate === rec.date) &&
        r.status === 'pending'
    );

    if (pendingRequest) {
      return { isAllowed: false, reason: 'pending', expirationNote: 'Approval Pending' };
    }

    return { isAllowed: false, reason: 'locked_physical', expirationNote: 'Locked for Physical Hall' };
  };

  const formatCountdown = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatTimerHours = (totalSecs: number) => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2500);
  };

  const generateGoogleCalendarUrl = (session: ClassSession) => {
    const title = encodeURIComponent(`Business Studies Masterclass: ${session.subject}`);
    const details = encodeURIComponent(
      `Business Studies with Sachitha Sankalpa\nBatch: ${session.targetAudience}\nVenue: ${session.location}\nZoom Meeting ID: ${session.zoomMeetingId || 'Online Portal'}\nPasscode: ${session.passcode || 'N/A'}`
    );
    const location = encodeURIComponent(session.location);
    const now = new Date();
    const startTime = now.toISOString().replace(/-|:|.\d+/g, '');
    const endTime = new Date(now.getTime() + 3.5 * 3600 * 1000).toISOString().replace(/-|:|.\d+/g, '');
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startTime}/${endTime}&details=${details}&location=${location}`;
  };

  const handleDownloadIcs = (session: ClassSession) => {
    const icsData = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Sachitha Sankalpa//Business Studies Schedule//EN',
      'BEGIN:VEVENT',
      `SUMMARY:Business Studies Masterclass: ${session.subject}`,
      `DESCRIPTION:Sachitha Sankalpa Batch: ${session.targetAudience}\\nVenue: ${session.location}`,
      `LOCATION:${session.location}`,
      `DTSTART:${new Date().toISOString().replace(/-|:|.\d+/g, '').slice(0, 15)}Z`,
      `DTEND:${new Date(Date.now() + 3.5 * 3600 * 1000).toISOString().replace(/-|:|.\d+/g, '').slice(0, 15)}Z`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `sachii-${session.id}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered recordings
  const filteredRecordings = recordings.filter((rec) => {
    const matchesSearch =
      rec.title.toLowerCase().includes(recSearch.toLowerCase()) ||
      rec.unitName.toLowerCase().includes(recSearch.toLowerCase());
    const matchesUnit = recUnitFilter === 'all' || rec.unitName.toLowerCase().includes(recUnitFilter.toLowerCase());
    return matchesSearch && matchesUnit;
  });

  // Filtered materials
  const filteredMaterials = materials.filter((mat) => {
    const matchesSearch =
      mat.title.toLowerCase().includes(matSearch.toLowerCase()) ||
      mat.description.toLowerCase().includes(matSearch.toLowerCase());
    const matchesCat = matCategory === 'all' || mat.category === matCategory;
    const matchesUnit = selectedUnitFilter === 'all' || mat.unitId === selectedUnitFilter;
    return matchesSearch && matchesCat && matchesUnit;
  });

  // Attached materials for today's continuous session (from liveTickerConfig)
  const attachedTodayMaterials = liveTickerConfig.attachedMaterials && liveTickerConfig.attachedMaterials.length > 0
    ? liveTickerConfig.attachedMaterials
    : [
        {
          title: liveTickerConfig.todayTuteTitle || 'Unit 3: Economic Environment & Macroeconomic Policies Tute.pdf',
          fileUrl: liveTickerConfig.todayTuteUrl || '#',
          fileSize: liveTickerConfig.todayTuteSize || '3.8 MB'
        },
        {
          title: 'Fiscal & Monetary Matrix Summary Sheet.pdf',
          fileUrl: '#',
          fileSize: '1.2 MB'
        },
        {
          title: `${paperClassLiveConfig.paperNumber || 'Speed Paper 12'} Question Paper.pdf`,
          fileUrl: '#',
          fileSize: '4.5 MB'
        }
      ];

  const handleDownloadTute = (title: string, url?: string) => {
    confetti({ particleCount: 35, spread: 60 });
    if (url && url !== '#' && url.startsWith('http')) {
      window.open(url, '_blank');
    } else {
      const element = document.createElement('a');
      const file = new Blob([`Business Studies with Sachitha Sankalpa\nOfficial Class Handout & Tute: ${title}\nStudent: ${student.name} (${student.indexNo})\nBatch: ${student.batch}\nDate: 2026-10-04\n\nOfficial lecture study material for today's continuous session.`], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = title.endsWith('.pdf') ? title : `${title}.pdf`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-slate-900 dark:text-slate-100 transition-colors relative z-10">
      
      {/* Top Header Bar */}
      <header className="bg-white dark:bg-[#0c101a] border-b border-slate-200 dark:border-blue-950 px-4 sm:px-8 py-3.5 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Left: Student Identity */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-500/20">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white leading-tight">
                  {student.name}
                </h1>
                <span className="font-mono text-[11px] px-2 py-0.5 rounded-md font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-cyan-400 border border-slate-200 dark:border-slate-700">
                  {student.indexNo}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                <span>{student.batch}</span>
                <span>•</span>
                {isPhysicalStudent ? (
                  <span className="inline-flex items-center gap-1 font-semibold text-amber-600 dark:text-amber-400">
                    <MapPin className="w-3 h-3" />
                    <span>Physical: {student.hallLocation}</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-cyan-400">
                    <Globe className="w-3 h-3" />
                    <span>Online Zoom Student</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right: Monthly Status Pill & Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Monthly Status Badge */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
              <span className="text-slate-400 font-bold uppercase text-[10px]">October 2026:</span>
              <span className={`font-bold flex items-center gap-1 ${
                isTheoryApproved ? 'text-blue-500' : 'text-amber-500'
              }`}>
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <span>Theory: {isTheoryApproved ? 'Approved' : 'Pending'}</span>
              </span>
              <span className="text-slate-300 dark:text-slate-700">|</span>
              <span className={`font-bold flex items-center gap-1 ${
                isPaperApproved ? 'text-purple-500' : 'text-slate-400'
              }`}>
                <span className={`w-2 h-2 rounded-full ${isPaperApproved ? 'bg-purple-500' : 'bg-slate-500'}`} />
                <span>Paper: {isPaperApproved ? 'Approved' : 'Not Enrolled'}</span>
              </span>
            </div>

            <button
              onClick={onNavigateHome}
              className="px-3 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer flex items-center gap-1.5"
            >
              <span>Website Home</span>
            </button>

            <button
              onClick={() => {
                logout();
                onNavigateHome();
              }}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/40 hover:bg-rose-100 transition cursor-pointer flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Physical Student Alert Notice Banner */}
      {isPhysicalStudent && (
        <div className="bg-amber-500/10 dark:bg-amber-950/30 border-b border-amber-300 dark:border-amber-900/50 px-4 sm:px-8 py-2.5">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300">
              <ShieldAlert className="w-4 h-4 shrink-0 text-amber-600" />
              <span>
                <strong>Physical Batch Notice:</strong> You are registered for in-person classes at <strong>{student.hallLocation}</strong>. Emergency online Zoom attendance requires approval from Sir.
              </span>
            </div>
            {activeLiveApproval ? (
              <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Online Permission Active</span>
              </span>
            ) : pendingLiveRequest ? (
              <span className="font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 animate-pulse" />
                <span>Permission Request Pending</span>
              </span>
            ) : (
              <button
                onClick={() => {
                  setRequestModalType('live_zoom');
                  setIsRequestModalOpen(true);
                }}
                className="font-bold underline text-amber-700 dark:text-amber-300 hover:text-amber-900 cursor-pointer"
              >
                Request Online Permission &rarr;
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main Dashboard Navigation Bar */}
      <div className="bg-white dark:bg-[#0c101a] border-b border-slate-200 dark:border-blue-950 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center gap-2 sm:gap-4 overflow-x-auto py-2">
          {[
            {
              id: 'live',
              label: 'Live Meeting Room (Theory + Paper)',
              icon: <Radio className="w-4 h-4 text-rose-500 animate-pulse" />,
              badge: isClassBroadcasting ? 'LIVE NOW' : 'TODAY CLASS'
            },
            {
              id: 'recordings',
              label: 'Class Recordings & Tutes',
              icon: <Video className="w-4 h-4 text-indigo-500" />,
              badge: recordings.length.toString()
            },
            {
              id: 'timetable',
              label: 'Timetable & Sync',
              icon: <Calendar className="w-4 h-4 text-blue-500" />,
            },
            {
              id: 'materials',
              label: 'Study Materials (By Unit)',
              icon: <BookOpen className="w-4 h-4 text-emerald-500" />,
              badge: `${lessonUnits.length} Units`
            }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                window.history.pushState({}, '', `/dashboard/${tab.id === 'timetable' ? 'calendar' : tab.id}`);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    activeTab === tab.id
                      ? 'bg-white/20 text-white'
                      : tab.badge === 'LIVE NOW'
                      ? 'bg-rose-500 text-white animate-pulse'
                      : tab.badge === 'ENROLLED'
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Tab Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8 space-y-8">

        {/* ========================================================
            TAB 1: UNIFIED LIVE MEETING ROOM (THEORY + PAPER CLASS)
           ======================================================== */}
        {activeTab === 'live' && (
          <div className="space-y-6">

            {/* Continuous Class Schedule Banner */}
            <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-blue-900/30 via-purple-900/20 to-slate-900 border border-blue-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-500 text-white animate-pulse">
                    ⚡ Continuous Live Room
                  </span>
                  <span className="text-xs font-bold text-slate-300">
                    Theory Masterclass & Speed Paper run back-to-back in this meeting room
                  </span>
                </div>
                <h2 className="text-base sm:text-lg font-black text-white font-['Space_Grotesk']">
                  {liveTickerConfig.subject}
                </h2>
              </div>

              {/* Continuous Session Schedule Timeline */}
              <div className="flex items-center gap-3 text-xs bg-slate-950/70 p-2.5 rounded-2xl border border-slate-800 shrink-0">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  <div>
                    <div className="font-bold text-white text-[11px] leading-tight">
                      {liveTickerConfig.theoryPartTitle || 'Part 1: Theory Lecture'}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      {liveTickerConfig.theoryPartTime || '8:00 AM - 10:30 AM'}
                    </div>
                  </div>
                </div>

                <span className="text-slate-600 font-bold">➔</span>

                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-400" />
                  <div>
                    <div className="font-bold text-purple-300 text-[11px] leading-tight">
                      {liveTickerConfig.paperPartTitle || 'Part 2: Speed Paper & Discussion'}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      {liveTickerConfig.paperPartTime || '10:45 AM - 1:00 PM'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Monthly Fee Notice if not approved */}
            {!isTheoryApproved && (
              <div className="p-4 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-200 text-xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>
                    <strong>October 2026 Monthly Approval Pending:</strong> Your enrollment is waiting for payment verification. Please send your bank slip to Sir or coordinator on WhatsApp.
                  </span>
                </div>
                <a
                  href="https://wa.me/94771234567"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold shrink-0 ml-2"
                >
                  Contact Coordinator
                </a>
              </div>
            )}

            {/* Stream Layout Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* Left 2 Cols: Main Live Broadcast Frame & Continuous Paper Panel */}
              <div className="lg:col-span-2 space-y-5">
                
                {/* Mode Selector Pill: In-Web Zoom Client vs External App */}
                <div className="flex items-center justify-between bg-slate-900 border border-slate-800 p-2 rounded-2xl">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-rose-600 text-white animate-pulse">
                      <Radio className="w-3 h-3" />
                      <span>{isClassBroadcasting ? 'LIVE BROADCAST' : 'COUNTDOWN'}</span>
                    </span>
                    <span className="text-xs text-slate-300 font-bold hidden sm:inline">
                      {liveTickerConfig.batchBadge}
                    </span>
                  </div>

                  {canAccessTheoryLive && (
                    <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                      <button
                        onClick={() => setTheoryZoomMode('embed')}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                          theoryZoomMode === 'embed'
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        📺 In-Website Zoom
                      </button>
                      <button
                        onClick={() => setTheoryZoomMode('app')}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                          theoryZoomMode === 'app'
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        🚀 Zoom Native App
                      </button>
                    </div>
                  )}
                </div>

                {/* Live Broadcast Viewport */}
                <div className="relative rounded-3xl overflow-hidden border border-slate-200 dark:border-blue-900/60 bg-slate-950 aspect-video flex flex-col items-center justify-center text-center text-white shadow-2xl">

                  {!canAccessTheoryLive ? (
                    // GATED ACCESS STATE (Physical Student or Monthly Pending)
                    <div className="max-w-md p-6 space-y-4 animate-in fade-in zoom-in-95">
                      <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 mx-auto flex items-center justify-center">
                        <Lock className="w-8 h-8" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">
                          Continuous Live Meeting Room Locked
                        </h3>
                        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                          {isPhysicalStudent
                            ? `You are registered for physical classes at ${student.hallLocation}. Permission from Sir is required to join today's continuous Theory + Paper Live Session via Zoom.`
                            : 'Your enrollment approval is pending for this month. Please request clearance from Sir below.'}
                        </p>
                      </div>

                      {pendingLiveRequest ? (
                        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs space-y-2 text-left">
                          <div className="flex items-center justify-between">
                            <span className="flex items-center gap-1.5 font-bold text-amber-400">
                              <Clock className="w-4 h-4 animate-pulse shrink-0" />
                              <span>Permission Request Submitted to Sir</span>
                            </span>
                            <button
                              onClick={() => window.location.reload()}
                              className="px-2 py-0.5 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 text-[10px] font-bold flex items-center gap-1 transition cursor-pointer"
                              title="Refresh permission status"
                            >
                              <RefreshCw className="w-3 h-3" />
                              <span>Check Status</span>
                            </button>
                          </div>
                          <p className="text-[11px] text-slate-300">
                            <strong>Target Session:</strong> {pendingLiveRequest.targetSessionTitle}
                            <br />
                            <strong>Reason:</strong> <em>"{pendingLiveRequest.reason}"</em>
                          </p>
                          <div className="pt-1 flex items-center justify-between border-t border-amber-500/20 text-[10px]">
                            <span className="text-amber-400/80">Pending Sir's approval in Admin Panel</span>
                            <a
                              href={`https://wa.me/94771234567?text=${encodeURIComponent(`Hello Sir, I submitted an online access request for today's continuous class. Student: ${student.name} (${student.indexNo})`)}`}
                              target="_blank"
                              rel="noreferrer"
                              className="font-bold underline text-amber-300 hover:text-white"
                            >
                              Notify on WhatsApp &rarr;
                            </a>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-1">
                          <button
                            onClick={() => {
                              setRequestModalType('live_zoom');
                              setIsRequestModalOpen(true);
                            }}
                            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 transition cursor-pointer flex items-center justify-center gap-2"
                          >
                            <ShieldAlert className="w-4 h-4" />
                            <span>Request Access from Sir &rarr;</span>
                          </button>
                          <a
                            href={`https://wa.me/94771234567?text=${encodeURIComponent(`Hello Sir, I need permission to attend today's continuous live class online. Student: ${student.name}, Index: ${student.indexNo}, Hall: ${student.hallLocation || 'Physical'}`)}`}
                            target="_blank"
                            rel="noreferrer"
                            className="w-full sm:w-auto px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition flex items-center justify-center gap-1.5"
                          >
                            <span>WhatsApp Sir</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      )}
                    </div>
                  ) : theoryZoomMode === 'embed' ? (
                    // IN-WEBSITE SYNCHRONIZED EMBEDDED ZOOM CLIENT
                    <div className="w-full h-full flex flex-col relative bg-slate-950">
                      <div className="absolute top-2 left-2 right-2 z-20 flex items-center justify-between px-3 py-1.5 bg-slate-900/90 backdrop-blur-md rounded-xl border border-slate-700 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                          <span className="font-mono text-cyan-300 font-bold text-[11px]">
                            Continuous Meeting Web Stream
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <a
                            href={`zoomus://zoom.us/join?confno=${liveTickerConfig.zoomMeetingId.replace(/\s+/g, '')}&pwd=${liveTickerConfig.zoomPasscode}`}
                            target="_blank"
                            rel="noreferrer"
                            className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-[10px] transition"
                            title="Switch to Zoom Desktop Application"
                          >
                            Launch App ↗
                          </a>
                        </div>
                      </div>

                      <iframe
                        src={`https://zoom.us/wc/${liveTickerConfig.zoomMeetingId.replace(/\s+/g, '')}/join?prefer=1&pwd=${encodeURIComponent(liveTickerConfig.zoomPasscode)}&uname=${encodeURIComponent(student.name)}`}
                        title="Business Studies Continuous Live Meeting"
                        allow="camera; microphone; fullscreen; display-capture"
                        className="w-full h-full border-0 rounded-3xl pt-10"
                      />
                    </div>
                  ) : (
                    // STANDALONE / APP MODE
                    <div className="p-6 space-y-4 max-w-md">
                      {!isClassBroadcasting ? (
                        <div className="space-y-2">
                          <div className="text-xs font-mono uppercase text-slate-400 tracking-wider">
                            Class Starts In
                          </div>
                          <div className="text-5xl sm:text-6xl font-black font-mono text-cyan-400 tracking-tight">
                            {formatCountdown(secondsUntilClass)}
                          </div>
                          <p className="text-xs text-slate-400">
                            Scheduled Start: {liveTickerConfig.timeSlot}
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="w-16 h-16 rounded-3xl bg-blue-600/30 border border-blue-500 text-cyan-400 mx-auto flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <Play className="w-8 h-8 fill-current ml-1" />
                          </div>
                          <h3 className="text-lg sm:text-xl font-black text-white">
                            {liveTickerConfig.subject}
                          </h3>
                          <p className="text-xs text-slate-400 max-w-sm mx-auto">
                            The meeting is actively broadcasting on Zoom. Click below to launch Zoom directly.
                          </p>
                        </div>
                      )}

                      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                        <a
                          href={`zoomus://zoom.us/join?confno=${liveTickerConfig.zoomMeetingId.replace(/\s+/g, '')}&pwd=${liveTickerConfig.zoomPasscode}`}
                          target="_blank"
                          rel="noreferrer"
                          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs shadow-lg shadow-blue-600/30 transition flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <Video className="w-4 h-4" />
                          <span>Open Zoom App</span>
                        </a>

                        <button
                          onClick={() => setTheoryZoomMode('embed')}
                          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <Globe className="w-4 h-4" />
                          <span>Switch to In-Web Zoom</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Bottom Bar: Meeting ID & Passcode Widgets */}
                  <div className="absolute bottom-3 left-3 right-3 z-10 flex flex-wrap items-center justify-between gap-2 px-4 py-2 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-slate-800 text-xs">
                    <div className="flex items-center gap-4 flex-wrap">
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-400">Meeting ID:</span>
                        <span className="font-mono font-bold text-cyan-400">{liveTickerConfig.zoomMeetingId}</span>
                        <button
                          onClick={() => handleCopy(liveTickerConfig.zoomMeetingId, 'mid')}
                          className="text-slate-400 hover:text-white transition cursor-pointer"
                          title="Copy Meeting ID"
                        >
                          {copiedField === 'mid' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-400">Passcode:</span>
                        <span className="font-mono font-bold text-cyan-400">{liveTickerConfig.zoomPasscode}</span>
                        <button
                          onClick={() => handleCopy(liveTickerConfig.zoomPasscode, 'pwd')}
                          className="text-slate-400 hover:text-white transition cursor-pointer"
                          title="Copy Passcode"
                        >
                          {copiedField === 'pwd' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-cyan-400" />
                      <span>{liveTickerConfig.timeSlot}</span>
                    </div>
                  </div>
                </div>

                {/* Session Details Header Card */}
                <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#0c101a] border border-slate-200 dark:border-blue-950 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-600 dark:text-cyan-400 uppercase tracking-wider">
                      Continuous Live Masterclass
                    </span>
                    <span className="text-xs text-slate-400">Hosted by Sachii Sir</span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
                    {liveTickerConfig.subject}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Venue: {liveTickerConfig.venue} • Integrated continuous theory breakdown, live derivations, speed calculations, and student paper discussion.
                  </p>
                </div>

                {/* Part 2: Continuous Speed Paper & Mock Exam Section */}
                <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-purple-950/20 via-slate-900/60 to-slate-950 border border-purple-500/30 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30">
                        <Award className="w-3.5 h-3.5" />
                        <span>Continuous Part 2: Speed Paper Class</span>
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-white">
                        {paperClassLiveConfig.paperNumber || 'Speed Paper 12'}: {paperClassLiveConfig.title}
                      </h3>
                      <p className="text-xs text-slate-400">
                        Follows directly after Theory. Download today's paper question sheet and submit your derivations.
                      </p>
                    </div>

                    {/* Mock Exam Timer Clock */}
                    <div className="px-4 py-2 rounded-2xl bg-purple-950/60 border border-purple-500/40 text-center shrink-0">
                      <div className="text-[10px] font-bold text-purple-300 uppercase tracking-wider flex items-center justify-center gap-1">
                        <Clock className="w-3 h-3 text-purple-400 animate-spin" />
                        <span>Timed Exam Clock</span>
                      </div>
                      <div className="text-xl sm:text-2xl font-black font-mono text-purple-300">
                        {formatTimerHours(paperTimerSeconds)}
                      </div>
                    </div>
                  </div>

                  {/* Active Paper Materials Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-purple-500/20 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-bold text-xs text-white truncate">
                          {paperClassLiveConfig.paperNumber || 'Speed Paper 12'} Question Paper
                        </p>
                        <span className="text-[10px] text-purple-300">Official Exam PDF • 4.5 MB</span>
                      </div>
                      <button
                        onClick={() => handleDownloadTute(`${paperClassLiveConfig.paperNumber || 'Speed Paper 12'} Question Paper`)}
                        className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 transition shrink-0 cursor-pointer shadow-sm"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Paper PDF</span>
                      </button>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-purple-500/20 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-bold text-xs text-white truncate">
                          Marking Scheme & Model Answers
                        </p>
                        <span className="text-[10px] text-slate-400">Live discussion release • 2.8 MB</span>
                      </div>
                      <button
                        onClick={() => handleDownloadTute('Marking Scheme & Model Answers')}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 transition shrink-0 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Scheme</span>
                      </button>
                    </div>
                  </div>
                </div>

              </div>

              {/* Right Col: Today's Class Tute & Attached Materials */}
              <div className="space-y-4">
                
                {/* PRIMARY BOX: TODAY'S CLASS TUTE (Uploaded from Admin) */}
                <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#0c101a] border-2 border-blue-500/40 dark:border-cyan-500/40 space-y-4 shadow-lg shadow-blue-500/5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 dark:bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-100 text-blue-700 dark:bg-cyan-950 dark:text-cyan-300 border border-blue-200 dark:border-cyan-800">
                      📄 Today's Class Tute
                    </span>
                    <span className="text-[10px] font-mono font-bold text-slate-400">
                      {liveTickerConfig.todayTuteSize || '3.8 MB'}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="font-black text-base sm:text-lg text-slate-900 dark:text-white leading-snug">
                      {liveTickerConfig.todayTuteTitle || 'Unit 3: Economic Environment & Macroeconomic Policies Tute'}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      {liveTickerConfig.todayTuteDescription || 'Official comprehensive lecture handout & drill exercises for today’s continuous session. Released by Sachii Sir.'}
                    </p>
                  </div>

                  {/* Prominent Download Button */}
                  <button
                    onClick={() => handleDownloadTute(liveTickerConfig.todayTuteTitle || "Today's Class Tute", liveTickerConfig.todayTuteUrl)}
                    className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs sm:text-sm shadow-xl shadow-blue-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer transform hover:-translate-y-0.5"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Today's Class Tute (PDF)</span>
                  </button>
                </div>

                {/* Additional Attached Handouts & Summary Sheets */}
                <div className="p-5 rounded-3xl bg-white dark:bg-[#0c101a] border border-slate-200 dark:border-blue-950 space-y-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
                      <span>Additional Handouts</span>
                    </h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-cyan-400">
                      {attachedTodayMaterials.length} Files
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {attachedTodayMaterials.map((file, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800/80 flex items-center justify-between gap-3 hover:border-blue-500/40 transition"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-cyan-400 flex items-center justify-center shrink-0">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-xs text-slate-900 dark:text-white truncate">
                              {file.title}
                            </p>
                            <span className="text-[10px] font-bold text-slate-400">
                              PDF • {file.fileSize}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => handleDownloadTute(file.title, file.fileUrl)}
                          className="w-8 h-8 rounded-lg bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center shrink-0 shadow-sm transition cursor-pointer"
                          title="Download PDF"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => setActiveTab('materials')}
                      className="w-full py-2.5 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-xs font-bold text-blue-600 dark:text-cyan-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>Open Full Materials Vault</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Auto-Recording Info */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-900/30 to-purple-900/20 border border-indigo-500/30 text-xs text-indigo-950 dark:text-indigo-200 space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-indigo-600 dark:text-indigo-300">
                    <Video className="w-4 h-4" />
                    <span>Auto-Archived Cloud Recordings</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-slate-600 dark:text-indigo-300/80">
                    This continuous session is recorded from start to finish. The replay alongside today's tute will be published in the Class Recordings tab within 2 hours.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 3: CLASS RECORDINGS VAULT
           ======================================================== */}
        {activeTab === 'recordings' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  Class Recordings & HD Replays
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Access past theory sessions, revision marathons, and structured model paper discussions.
                </p>
              </div>

              <div className="flex items-center gap-2.5 flex-wrap">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={recSearch}
                    onChange={(e) => setRecSearch(e.target.value)}
                    placeholder="Search by topic or unit..."
                    className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white w-48"
                  />
                </div>

                <select
                  value={recUnitFilter}
                  onChange={(e) => setRecUnitFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-700 dark:text-slate-300 font-semibold cursor-pointer"
                >
                  <option value="all">All Units</option>
                  <option value="unit 1">Unit 1</option>
                  <option value="unit 2">Unit 2</option>
                  <option value="unit 3">Unit 3</option>
                  <option value="unit 5">Unit 5</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRecordings.map((rec) => {
                const access = checkRecordingAccess(rec);

                return (
                  <div
                    key={rec.id}
                    className="rounded-3xl bg-white dark:bg-[#0c101a] border border-slate-200 dark:border-blue-950 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col group"
                  >
                    <div className="relative aspect-video bg-slate-900 overflow-hidden">
                      <img
                        src={rec.thumbnailUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80'}
                        alt={rec.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-80"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                      <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold bg-black/80 text-white">
                        {rec.duration}
                      </span>

                      <span
                        className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          access.isAllowed ? 'bg-emerald-600/90 text-white' : 'bg-rose-600/90 text-white'
                        }`}
                      >
                        {access.expirationNote}
                      </span>

                      {access.isAllowed && (
                        <button
                          onClick={() => setActivePlayerRecording(rec)}
                          className="absolute inset-0 flex items-center justify-center text-white/90 hover:text-white transition cursor-pointer"
                        >
                          <div className="w-12 h-12 rounded-full bg-blue-600/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            <Play className="w-5 h-5 fill-current ml-0.5" />
                          </div>
                        </button>
                      )}
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs text-blue-600 dark:text-cyan-400 font-bold">
                          <span>{rec.unitName}</span>
                          <span className="text-slate-400 font-normal">{rec.date}</span>
                        </div>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white leading-snug line-clamp-2">
                          {rec.title}
                        </h4>
                      </div>

                      {/* Attached Session Tute & Handout for Replay */}
                      <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800/80 flex items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-2 min-w-0">
                          <FileText className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400 shrink-0" />
                          <div className="min-w-0">
                            <p className="font-bold text-[11px] text-slate-800 dark:text-slate-200 truncate">
                              {rec.attachedMaterials && rec.attachedMaterials.length > 0
                                ? rec.attachedMaterials[0].title
                                : `${rec.unitName} Lecture Handout & Tute`}
                            </p>
                            <span className="text-[10px] text-slate-400 font-mono">
                              PDF • {rec.attachedMaterials && rec.attachedMaterials.length > 0 ? rec.attachedMaterials[0].fileSize : '3.5 MB'}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const title = rec.attachedMaterials && rec.attachedMaterials.length > 0
                              ? rec.attachedMaterials[0].title
                              : `${rec.unitName} Lecture Handout & Tute`;
                            handleDownloadTute(title, rec.attachedMaterials && rec.attachedMaterials.length > 0 ? rec.attachedMaterials[0].fileUrl : undefined);
                          }}
                          className="px-2.5 py-1 rounded-xl bg-blue-100 hover:bg-blue-200 dark:bg-blue-950 dark:hover:bg-blue-900 text-blue-700 dark:text-cyan-300 font-bold text-[11px] flex items-center gap-1 transition shrink-0 cursor-pointer"
                          title="Download Attached Lecture Tute"
                        >
                          <Download className="w-3 h-3" />
                          <span>Tute</span>
                        </button>
                      </div>

                      <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                        {access.isAllowed ? (
                          <button
                            onClick={() => setActivePlayerRecording(rec)}
                            className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
                          >
                            <Play className="w-3.5 h-3.5 fill-current" />
                            <span>Watch Replay</span>
                          </button>
                        ) : access.reason === 'pending' ? (
                          <div className="w-full py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-center font-bold text-xs flex items-center justify-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 animate-pulse" />
                            <span>Request Pending Sir's Review</span>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setRequestModalType('recording');
                              setRequestTargetRecId(rec.id);
                              setRequestTargetRecTitle(rec.title);
                              setIsRequestModalOpen(true);
                            }}
                            className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black flex items-center justify-center gap-1.5 transition cursor-pointer"
                          >
                            <Lock className="w-3.5 h-3.5" />
                            <span>Request Replay Access</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 4: TIMETABLE & GOOGLE CALENDAR SYNC
           ======================================================== */}
        {activeTab === 'timetable' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  Class Timetable & Calendar Sync
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Synchronize weekly Business Studies lecture schedules directly into your personal calendar.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#0c101a] border border-slate-200 dark:border-blue-950 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-cyan-400 flex items-center justify-center shrink-0">
                      <Calendar className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-cyan-300 border border-blue-200 dark:border-blue-900">
                          {session.targetAudience || session.batchName}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                          {session.dayOfWeek}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                          {session.time}
                        </span>
                      </div>
                      <h4 className="font-extrabold text-base text-slate-900 dark:text-white mt-1.5">
                        {session.subject}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{session.location}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0">
                    <a
                      href={generateGoogleCalendarUrl(session)}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Sync to Google Calendar</span>
                    </a>

                    <button
                      onClick={() => handleDownloadIcs(session)}
                      className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Export iCal</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 5: LESSON-BY-LESSON GROUPED STUDY MATERIALS
           ======================================================== */}
        {activeTab === 'materials' && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 mb-2">
                  <Layers className="w-3.5 h-3.5" />
                  <span>A/L Syllabus Lesson Repository</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-['Space_Grotesk']">
                  Study Materials by Lesson Unit
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Handouts, comprehensive unit notes, model derivations, and pocket sheets categorized by syllabus unit.
                </p>
              </div>

              {/* Filters */}
              <div className="flex items-center gap-2.5 flex-wrap">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={matSearch}
                    onChange={(e) => setMatSearch(e.target.value)}
                    placeholder="Search tutes or topics..."
                    className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white w-48"
                  />
                </div>

                <select
                  value={selectedUnitFilter}
                  onChange={(e) => setSelectedUnitFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-700 dark:text-slate-300 font-semibold cursor-pointer"
                >
                  <option value="all">All Syllabus Units</option>
                  {lessonUnits.map((u) => (
                    <option key={u.id} value={u.id}>
                      Unit {u.unitNumber.toString().padStart(2, '0')}: {u.title.slice(0, 24)}...
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Units Stack */}
            <div className="space-y-6">
              {lessonUnits
                .filter((u) => selectedUnitFilter === 'all' || u.id === selectedUnitFilter)
                .sort((a, b) => a.order - b.order)
                .map((unit) => {
                  const unitMaterials = filteredMaterials.filter(
                    (m) => m.unitId === unit.id || m.unitNumber === unit.unitNumber
                  );

                  return (
                    <div
                      key={unit.id}
                      className="rounded-3xl bg-white dark:bg-[#0c101a] border border-slate-200 dark:border-blue-950 overflow-hidden shadow-sm"
                    >
                      {/* Unit Header */}
                      <div className="p-5 sm:p-6 bg-slate-50/80 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <span className="px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider bg-indigo-600 text-white shrink-0 mt-0.5">
                            Unit {unit.unitNumber.toString().padStart(2, '0')}
                          </span>
                          <div>
                            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white font-['Space_Grotesk']">
                              {unit.title}
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                              {unit.description}
                            </p>
                          </div>
                        </div>

                        <span className="text-xs font-bold text-slate-400 shrink-0">
                          {unitMaterials.length} Documents Available
                        </span>
                      </div>

                      {/* Unit Materials List / Grid */}
                      <div className="p-5 sm:p-6">
                        {unitMaterials.length === 0 ? (
                          <div className="py-6 text-center text-xs text-slate-400">
                            No uploaded materials yet for this unit. Check back soon!
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {unitMaterials.map((mat) => (
                              <div
                                key={mat.id}
                                className="p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between space-y-3 hover:border-indigo-500/40 transition"
                              >
                                <div className="space-y-1.5">
                                  <div className="flex items-center justify-between text-[10px] font-bold">
                                    <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-cyan-300 uppercase">
                                      {mat.category.replace('_', ' ')}
                                    </span>
                                    <span className="text-slate-400">{mat.fileSize}</span>
                                  </div>

                                  <h4 className="font-bold text-xs text-slate-900 dark:text-white line-clamp-2">
                                    {mat.title}
                                  </h4>

                                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                                    {mat.description}
                                  </p>
                                </div>

                                <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-xs">
                                  <span className="text-[10px] text-slate-400">PDF Document</span>
                                  <button
                                    onClick={() => alert(`Downloading ${mat.title}...`)}
                                    className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                                  >
                                    <Download className="w-3.5 h-3.5" />
                                    <span>Download</span>
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </main>

      {/* MODAL 1: PERMISSION REQUEST (Live or Recording) */}
      <RequestAccessModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        defaultType={requestModalType}
        targetRecordingId={requestTargetRecId}
        targetRecordingTitle={requestTargetRecTitle}
      />

      {/* MODAL 2: HD VIDEO REPLAY PLAYER */}
      {activePlayerRecording && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-4xl rounded-3xl bg-slate-950 border border-blue-900/80 overflow-hidden shadow-2xl flex flex-col">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/80 text-white">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                  {activePlayerRecording.unitName}
                </span>
                <h3 className="text-sm sm:text-base font-bold text-white truncate max-w-md sm:max-w-xl">
                  {activePlayerRecording.title}
                </h3>
              </div>
              <button
                onClick={() => setActivePlayerRecording(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative aspect-video bg-black flex items-center justify-center">
              <iframe
                src={activePlayerRecording.videoUrl}
                title={activePlayerRecording.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>

            <div className="p-4 sm:p-5 bg-slate-900 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-white">
              <div className="flex items-center gap-3">
                <span className="text-slate-400">Recorded: {activePlayerRecording.date}</span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-400">Duration: {activePlayerRecording.duration}</span>
              </div>

              {/* Attached Session Tute & Handouts */}
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Lesson Tute:</span>
                <button
                  onClick={() => {
                    const primaryTute = activePlayerRecording.attachedMaterials && activePlayerRecording.attachedMaterials.length > 0
                      ? activePlayerRecording.attachedMaterials[0]
                      : { title: `${activePlayerRecording.title} Lecture Handout & Tute.pdf`, fileSize: '3.5 MB', fileUrl: '#' };
                    handleDownloadTute(primaryTute.title, primaryTute.fileUrl);
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-md cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>
                    Download Tute ({activePlayerRecording.attachedMaterials && activePlayerRecording.attachedMaterials.length > 0 ? activePlayerRecording.attachedMaterials[0].fileSize : '3.5 MB'})
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};
