import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import {
  BatchInfo,
  ClassSession,
  StudyMaterial,
  Ranker,
  EnrollmentItem,
  LiveTickerConfig,
  LessonUnit
} from '../../types';
import {
  ShieldCheck,
  LayoutDashboard,
  GraduationCap,
  Calendar,
  BookOpen,
  Trophy,
  Users,
  Settings,
  Plus,
  Pencil,
  Trash2,
  CheckCircle2,
  X,
  RotateCcw,
  ExternalLink,
  Lock,
  Unlock,
  KeyRound,
  AlertCircle,
  Save,
  Search,
  Filter,
  Radio,
  Video,
  Clock,
  MapPin,
  Eye,
  EyeOff,
  ArrowRight,
  UserCheck,
  Layers,
  TrendingUp,
  FileText,
  Download,
  Upload
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { AdminStudentsView } from './AdminStudentsView';
import { AdminClassSettingsView } from './AdminClassSettingsView';
import { AdminAccessRequestsView } from './AdminAccessRequestsView';
import { AdminMonthlyApprovalsView } from './AdminMonthlyApprovalsView';
import { AdminLessonUnitsView } from './AdminLessonUnitsView';
import { AdminStatsView } from './AdminStatsView';

interface AdminDashboardProps {
  onBackToSite: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToSite }) => {
  const {
    batches,
    sessions,
    materials,
    rankers,
    teacherInfo,
    enrollments,
    announcement,
    liveTickerConfig,
    classOptions,
    classModes,
    registeredStudents,
    accessRequests,
    recordings,
    addRecording,
    lessonUnits,
    paperClassLiveConfig,
    updatePaperClassLiveConfig,
    monthlyApprovals,
    updateLiveTickerConfig,
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
    updateEnrollmentStatus,
    deleteEnrollment,
    highlightStats,
    resetAllData,
  } = useData();

  // Authentication gate
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminPin, setAdminPin] = useState('');
  const [loginError, setLoginError] = useState('');

  // Active section
  const [activeTab, setActiveTab] = useState<'overview' | 'ticker' | 'access-requests' | 'monthly-approvals' | 'students' | 'class-settings' | 'batches' | 'schedule' | 'materials' | 'rankers' | 'enrollments' | 'settings' | 'highlight-stats'>('overview');

  // Search filter
  const [searchFilter, setSearchFilter] = useState('');

  // Modals state
  const [editingBatch, setEditingBatch] = useState<BatchInfo | null>(null);
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);

  const [editingSession, setEditingSession] = useState<ClassSession | null>(null);
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);

  const [editingMaterial, setEditingMaterial] = useState<StudyMaterial | null>(null);
  const [isMaterialModalOpen, setIsMaterialModalOpen] = useState(false);
  const [materialsSubTab, setMaterialsSubTab] = useState<'units' | 'items'>('units');

  const [editingRanker, setEditingRanker] = useState<Ranker | null>(null);
  const [isRankerModalOpen, setIsRankerModalOpen] = useState(false);

  // Settings form state
  const [tempTeacher, setTempTeacher] = useState(teacherInfo);
  const [tempAnnouncement, setTempAnnouncement] = useState(announcement);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  // Live Ticker Banner state
  const [tempTicker, setTempTicker] = useState<LiveTickerConfig>(liveTickerConfig);
  const [tempPaperLive, setTempPaperLive] = useState(paperClassLiveConfig);
  const [tickerSuccessMsg, setTickerSuccessMsg] = useState('');

  // End Meeting & Auto-Archive state
  const [archiveModalOpen, setArchiveModalOpen] = useState(false);
  const [archiveVideoUrl, setArchiveVideoUrl] = useState('https://www.youtube.com/embed/dQw4w9WgXcQ');
  const [archiveDuration, setArchiveDuration] = useState('2 hrs 30 mins');
  const [archiveSuccessMsg, setArchiveSuccessMsg] = useState('');

  const handleConfirmAutoArchive = (e: React.FormEvent) => {
    e.preventDefault();
    const todayDate = new Date().toISOString().split('T')[0];

    const attachedMaterials = liveTickerConfig.todayTuteTitle
      ? [{
          title: liveTickerConfig.todayTuteTitle,
          fileUrl: liveTickerConfig.todayTuteUrl || '#',
          fileSize: liveTickerConfig.todayTuteSize || '4.2 MB PDF'
        }]
      : [{
          title: `${liveTickerConfig.subject || 'Class'} - Lecture Handout.pdf`,
          fileUrl: '#',
          fileSize: '3.5 MB'
        }];

    addRecording({
      title: liveTickerConfig.subject || 'Live Class Session',
      unitName: 'Unit 4: Production & Operations Management',
      batch: liveTickerConfig.batchBadge || '2026 Batch',
      date: todayDate,
      duration: archiveDuration,
      videoUrl: archiveVideoUrl,
      availableForDays: 14,
      isLockedForPhysical: true,
      status: 'published',
      attachedMaterials
    });

    const updatedTicker: LiveTickerConfig = {
      ...liveTickerConfig,
      isStreamingNow: false,
      scheduledDateTime: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString()
    };
    updateLiveTickerConfig(updatedTicker);
    setTempTicker(updatedTicker);

    confetti({ particleCount: 50, spread: 60 });
    setArchiveSuccessMsg(`Class successfully ended & archived to Recordings Database with Date: ${todayDate}!`);
    setTimeout(() => {
      setArchiveSuccessMsg('');
      setArchiveModalOpen(false);
    }, 2200);
  };

  useEffect(() => {
    setTempTicker(liveTickerConfig);
  }, [liveTickerConfig]);

  // Handle Admin Login
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPin === 'admin123' || adminPin === 'admin' || adminPin === 'sachii') {
      setIsAdminLoggedIn(true);
      setLoginError('');
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    } else {
      setLoginError('Invalid Admin Passcode. Please check your credentials.');
    }
  };

  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-screen py-20 px-4 flex items-center justify-center bg-slate-900 text-white">
        <div className="w-full max-w-md p-8 rounded-3xl bg-[#0c101a] border border-blue-900/80 shadow-2xl space-y-6 text-center">
          <div className="w-16 h-16 rounded-3xl bg-blue-600/20 text-blue-400 flex items-center justify-center mx-auto border border-blue-500/30">
            <KeyRound className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-2xl font-black font-['Space_Grotesk'] text-white">
              Business Studies with Sachitha - CMS Portal
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Authorized Master & Coordinator Control Panel
            </p>
          </div>

          {loginError && (
            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-900 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Admin Passcode
              </label>
              <input
                type="password"
                placeholder="Enter authorized admin passcode"
                value={adminPin}
                onChange={(e) => setAdminPin(e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-sm bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-500 transition-colors shadow-lg cursor-pointer"
            >
              Sign In to Admin Portal
            </button>
          </form>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-end text-xs">
            <button
              onClick={onBackToSite}
              className="text-slate-400 hover:text-white cursor-pointer"
            >
              &larr; Back to Website
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-[#07090e] text-slate-900 dark:text-slate-100 flex flex-col transition-colors">
      {/* Admin Top Header */}
      <header className="h-16 px-6 bg-white dark:bg-[#0c101a] border-b border-slate-200 dark:border-blue-950 flex items-center justify-between shrink-0 shadow-sm z-30">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-black font-['Space_Grotesk'] leading-tight">
              Sachitha Sankalpa Content Manager
            </h1>
            <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
              Live Control Active • Changes persist to website immediately
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (confirm('Reset all website data back to factory defaults?')) {
                resetAllData();
                alert('All data restored to defaults.');
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Reset to sample data"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Defaults</span>
          </button>

          <button
            onClick={onBackToSite}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md transition-colors cursor-pointer"
          >
            <span>View Live Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Main Admin Content Layout */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left Sidebar Navigation */}
        <aside className="w-full md:w-64 bg-white dark:bg-[#0a0e17] border-r border-slate-200 dark:border-blue-950/80 p-4 space-y-1 shrink-0 overflow-y-auto">
          {[
            { id: 'overview', label: 'Dashboard Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
            {
              id: 'ticker',
              label: "Live Class & Today's Tute",
              icon: <Radio className="w-4 h-4 text-rose-500 animate-pulse" />,
              badge: liveTickerConfig.isEnabled ? 'ON' : 'OFF',
              badgeColor: liveTickerConfig.isEnabled ? 'bg-emerald-500 text-white' : 'bg-rose-500/80 text-white'
            },
            {
              id: 'access-requests',
              label: 'Live & Replay Requests',
              icon: <ShieldCheck className="w-4 h-4 text-amber-500" />,
              badge: accessRequests.filter(r => r.status === 'pending').length > 0
                ? `${accessRequests.filter(r => r.status === 'pending').length} PENDING`
                : undefined,
              badgeColor: 'bg-amber-500 text-slate-950 font-black animate-pulse'
            },
            {
              id: 'students',
              label: 'Registered Students',
              icon: <UserCheck className="w-4 h-4 text-cyan-500" />,
              count: registeredStudents.length
            },
            {
              id: 'class-settings',
              label: 'Class Options & Modes',
              icon: <Layers className="w-4 h-4 text-indigo-400" />,
              count: classOptions.length + classModes.length
            },
            { id: 'batches', label: 'Batches & Courses', icon: <GraduationCap className="w-4 h-4" />, count: batches.length },
            { id: 'schedule', label: 'Class Timetable', icon: <Calendar className="w-4 h-4" />, count: sessions.length },
            { id: 'materials', label: 'Study Materials', icon: <BookOpen className="w-4 h-4" />, count: materials.length },
            { id: 'rankers', label: 'Hall of Fame', icon: <Trophy className="w-4 h-4" />, count: rankers.length },
            { id: 'enrollments', label: 'Student Inquiries', icon: <Users className="w-4 h-4" />, count: enrollments.length },
            {
              id: 'highlight-stats',
              label: 'Highlight Stat Cards',
              icon: <TrendingUp className="w-4 h-4 text-emerald-400" />,
              badge: `${highlightStats.length} Live`,
              badgeColor: 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30'
            },
            { id: 'settings', label: 'Master & Site Settings', icon: <Settings className="w-4 h-4" /> },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                activeTab === item.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {item.icon}
                <span>{item.label}</span>
              </div>
              {item.badge ? (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${item.badgeColor}`}>
                  {item.badge}
                </span>
              ) : item.count !== undefined ? (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  activeTab === item.id ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}>
                  {item.count}
                </span>
              ) : null}
            </button>
          ))}
        </aside>

        {/* Right Tab Content */}
        <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-8 max-w-6xl">
              <div>
                <h2 className="text-2xl font-black font-['Space_Grotesk'] text-slate-900 dark:text-white">
                  Class Operations Overview
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Manage syllabus batches, scheduled classes, downloadable tutorials, and prospective student admissions.
                </p>
              </div>

              {/* Stat Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                <div
                  onClick={() => setActiveTab('students')}
                  className="p-5 rounded-2xl bg-white dark:bg-[#0c101a] border border-slate-200 dark:border-blue-950 shadow-sm cursor-pointer hover:border-cyan-500/50 hover:shadow-md transition-all group"
                >
                  <div className="text-xs font-bold uppercase text-slate-400 flex items-center justify-between">
                    <span>Students</span>
                    <UserCheck className="w-4 h-4 text-cyan-500 group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="text-3xl font-black text-cyan-600 dark:text-cyan-400 font-['Space_Grotesk'] mt-1">
                    {registeredStudents.length}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">Registered Profiles</div>
                </div>

                <div className="p-5 rounded-2xl bg-white dark:bg-[#0c101a] border border-slate-200 dark:border-blue-950 shadow-sm">
                  <div className="text-xs font-bold uppercase text-slate-400">Total Batches</div>
                  <div className="text-3xl font-black text-blue-600 dark:text-cyan-400 font-['Space_Grotesk'] mt-1">
                    {batches.length}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">Active Courses</div>
                </div>

                <div className="p-5 rounded-2xl bg-white dark:bg-[#0c101a] border border-slate-200 dark:border-blue-950 shadow-sm">
                  <div className="text-xs font-bold uppercase text-slate-400">Scheduled Sessions</div>
                  <div className="text-3xl font-black text-purple-600 dark:text-purple-400 font-['Space_Grotesk'] mt-1">
                    {sessions.length}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">Weekly Live Classes</div>
                </div>

                <div className="p-5 rounded-2xl bg-white dark:bg-[#0c101a] border border-slate-200 dark:border-blue-950 shadow-sm">
                  <div className="text-xs font-bold uppercase text-slate-400">Study Materials</div>
                  <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 font-['Space_Grotesk'] mt-1">
                    {materials.length}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">PDF Modules & Papers</div>
                </div>

                <div className="p-5 rounded-2xl bg-white dark:bg-[#0c101a] border border-slate-200 dark:border-blue-950 shadow-sm">
                  <div className="text-xs font-bold uppercase text-slate-400">Inquiries</div>
                  <div className="text-3xl font-black text-amber-500 font-['Space_Grotesk'] mt-1">
                    {enrollments.length}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">Pending Enrollments</div>
                </div>
              </div>

              {/* Live Stream Banner Quick Status & Controller */}
              <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-900/40 via-indigo-950/40 to-slate-900/60 border border-blue-500/30 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                    liveTickerConfig.isEnabled ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'
                  }`}>
                    <Radio className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        liveTickerConfig.isEnabled ? 'bg-emerald-500 text-white animate-pulse' : 'bg-rose-500/80 text-white'
                      }`}>
                        {liveTickerConfig.isEnabled ? 'Banner is Visible (ON)' : 'Banner is Hidden (OFF)'}
                      </span>
                      <span className="text-xs text-slate-400">
                        {liveTickerConfig.isStreamingNow ? 'Mode: Broadcasting Live' : 'Mode: Countdown Timer'}
                      </span>
                    </div>
                    <h4 className="font-bold text-sm sm:text-base text-white mt-1">
                      {liveTickerConfig.subject}
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {liveTickerConfig.batchBadge} • {liveTickerConfig.timeSlot} • {liveTickerConfig.venue}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 flex-wrap">
                  {liveTickerConfig.isStreamingNow && (
                    <button
                      onClick={() => setArchiveModalOpen(true)}
                      className="px-4 py-2.5 rounded-xl font-black text-xs bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20 transition cursor-pointer flex items-center gap-1.5"
                      title="End current broadcast and auto-archive recording with date & tute"
                    >
                      <Video className="w-4 h-4" />
                      <span>End & Archive</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      updateLiveTickerConfig({ isEnabled: !liveTickerConfig.isEnabled });
                      confetti({ particleCount: 40, spread: 50 });
                    }}
                    className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center gap-2 ${
                      liveTickerConfig.isEnabled
                        ? 'bg-rose-600/80 hover:bg-rose-600 text-white'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30'
                    }`}
                  >
                    {liveTickerConfig.isEnabled ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    <span>{liveTickerConfig.isEnabled ? 'Turn OFF' : 'Turn ON'}</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('ticker')}
                    className="px-4 py-2.5 rounded-xl font-bold text-xs bg-blue-600 hover:bg-blue-500 text-white shadow-md transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Configure & Schedule</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Highlight Stat Cards Quick Preview & Controller */}
              <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-slate-900/60 border border-indigo-500/30 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.3)]">
                    <TrendingUp className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-500 text-white">
                        {highlightStats.length} Live Stat Cards (With Outer Glow)
                      </span>
                      <span className="text-xs text-slate-400">
                        Home Page Hero Showcase
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-2 flex-wrap">
                      {highlightStats.map((s) => (
                        <span key={s.id} className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-800">
                          <span className="font-bold text-indigo-400">{s.value}</span>
                          <span className="text-slate-400">{s.label}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={() => setActiveTab('highlight-stats')}
                    className="px-4 py-2.5 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-500 text-white shadow-md transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Edit Stat Cards & Outer Glow</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Quick Actions Panel */}
              <div className="p-6 rounded-3xl bg-white dark:bg-[#0c101a] border border-slate-200 dark:border-blue-950 space-y-4">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Quick Tasks</h3>
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => setActiveTab('highlight-stats')}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-colors cursor-pointer"
                  >
                    <TrendingUp className="w-4 h-4" />
                    <span>Edit Stat Cards ({highlightStats.length})</span>
                  </button>
                  <button
                    onClick={() => {
                      setEditingBatch(null);
                      setIsBatchModalOpen(true);
                    }}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create New Batch</span>
                  </button>

                  <button
                    onClick={() => {
                      setEditingSession(null);
                      setIsSessionModalOpen(true);
                    }}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Scheduled Class</span>
                  </button>

                  <button
                    onClick={() => {
                      setEditingMaterial(null);
                      setIsMaterialModalOpen(true);
                    }}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Upload Study Material</span>
                  </button>

                  <button
                    onClick={() => {
                      setEditingRanker(null);
                      setIsRankerModalOpen(true);
                    }}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs bg-amber-600 hover:bg-amber-700 text-white shadow-sm transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Island Ranker</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('students')}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs bg-cyan-600 hover:bg-cyan-700 text-white shadow-sm transition-colors cursor-pointer"
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>Manage Students ({registeredStudents.length})</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('class-settings')}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-colors cursor-pointer"
                  >
                    <Layers className="w-4 h-4" />
                    <span>Class Options & Modes</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('ticker')}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs bg-rose-600 hover:bg-rose-700 text-white shadow-sm transition-colors cursor-pointer"
                  >
                    <Radio className="w-4 h-4" />
                    <span>Live Banner Settings</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB: LIVE STREAM BANNER & SCHEDULER */}
          {activeTab === 'ticker' && (
            <div className="space-y-8 max-w-5xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20 mb-2">
                    <Radio className="w-3.5 h-3.5 animate-pulse" />
                    <span>Live Class Ticker & Countdown Controller</span>
                  </div>
                  <h2 className="text-2xl font-black font-['Space_Grotesk'] text-slate-900 dark:text-white">
                    Live Stream Banner Management
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Control visibility (ON/OFF), countdown timer, scheduling, and topic information for the live stream banner.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      updateLiveTickerConfig({ ...tempTicker });
                      setTickerSuccessMsg('Live Stream Banner configuration saved & updated on site!');
                      confetti({ particleCount: 60, spread: 70 });
                      setTimeout(() => setTickerSuccessMsg(''), 4000);
                    }}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/25 transition-all cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save & Publish Live</span>
                  </button>
                </div>
              </div>

              {tickerSuccessMsg && (
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{tickerSuccessMsg}</span>
                </div>
              )}

              {/* SECTION 1: MASTER ON / OFF SWITCH */}
              <div className={`p-6 rounded-3xl border transition-all ${
                tempTicker.isEnabled
                  ? 'bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border-emerald-500/40 shadow-lg shadow-emerald-950/20'
                  : 'bg-slate-900/60 border-slate-800'
              }`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`w-3 h-3 rounded-full ${tempTicker.isEnabled ? 'bg-emerald-400 animate-ping' : 'bg-rose-500'}`} />
                      <h3 className="text-lg font-black text-white font-['Space_Grotesk']">
                        Banner Visibility Status
                      </h3>
                    </div>
                    <p className="text-xs text-slate-400 max-w-lg">
                      {tempTicker.isEnabled
                        ? 'The live stream countdown banner is currently ACTIVE and visible to all students on the Home page and Class Schedule view.'
                        : 'The banner is currently TURNED OFF (Hidden). No student will see this ticker on the website.'}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        const newStatus = !tempTicker.isEnabled;
                        setTempTicker(prev => ({ ...prev, isEnabled: newStatus }));
                        updateLiveTickerConfig({ isEnabled: newStatus });
                        confetti({ particleCount: 40, spread: 60 });
                      }}
                      className={`relative inline-flex h-10 w-20 items-center rounded-full transition-colors cursor-pointer ${
                        tempTicker.isEnabled ? 'bg-emerald-600' : 'bg-slate-700'
                      }`}
                      aria-label="Toggle banner visibility"
                    >
                      <span
                        className={`inline-block h-8 w-8 transform rounded-full bg-white shadow-md transition-transform ${
                          tempTicker.isEnabled ? 'translate-x-11' : 'translate-x-1'
                        }`}
                      />
                    </button>
                    <span className="text-sm font-black text-white w-12">
                      {tempTicker.isEnabled ? 'ON' : 'OFF'}
                    </span>
                  </div>
                </div>
              </div>

              {/* SECTION 2: LIVE INTERACTIVE PREVIEW */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                    
                    <span>Real-Time Website Preview</span>
                  </h3>
                  <span className="text-[11px] text-slate-500">
                    {tempTicker.isEnabled ? 'Live on Site' : 'Currently Hidden'}
                  </span>
                </div>

                {/* Banner preview container matching user screenshot */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 border border-blue-500/30 text-white shadow-xl p-4 sm:p-5">
                  <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600/30 border border-blue-400/40 shrink-0">
                        <Radio className="w-6 h-6 text-cyan-400 animate-pulse" />
                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
                        </span>
                      </div>

                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider text-white ${tempTicker.isStreamingNow ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500 animate-pulse'}`}>
                            {tempTicker.isStreamingNow ? '● STREAMING LIVE NOW' : 'NEXT LIVE SESSION'}
                          </span>
                          <span className="text-xs font-semibold text-blue-200">
                            {tempTicker.batchBadge || '2025 A/L Theory Batch'}
                          </span>
                        </div>
                        <h4 className="text-sm sm:text-base font-bold text-white mt-0.5 truncate max-w-md sm:max-w-xl">
                          {tempTicker.subject || 'Business Studies – Theory & Beyond Masterclass'}
                        </h4>
                        <div className="flex items-center gap-3 text-xs text-slate-300 mt-1">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-cyan-400" />
                            {tempTicker.timeSlot || '08:00 AM – 01:30 PM'}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-rose-400" />
                            {tempTicker.venue || 'Rotary Institute, Nugegoda & Zoom HD'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 sm:gap-6 self-start lg:self-auto border-t lg:border-t-0 border-blue-800/60 pt-3 lg:pt-0 w-full lg:w-auto justify-between lg:justify-end">
                      {tempTicker.isStreamingNow ? (
                        <div className="text-left sm:text-right">
                          <span className="block text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                            Session Active
                          </span>
                          <div className="flex items-center gap-2 text-sm sm:text-base font-black text-emerald-300">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                            <span>Broadcasting Live</span>
                          </div>
                        </div>
                      ) : (
                        <div className="text-left sm:text-right">
                          <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Live Stream Starts In
                          </span>
                          <div className="flex items-center gap-1 font-mono font-black text-xl sm:text-2xl text-cyan-300">
                            <div className="p-1 px-2 rounded-lg bg-blue-950/80 border border-blue-800/80">
                              {String(tempTicker.countdownMinutes || 15).padStart(2, '0')}
                            </div>
                            <span className="text-slate-400 animate-pulse">:</span>
                            <div className="p-1 px-2 rounded-lg bg-blue-950/80 border border-blue-800/80">
                              00
                            </div>
                            <span className="text-xs text-slate-400 font-sans ml-1 font-normal">min:sec</span>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-lg shadow-cyan-500/25">
                          <Video className="w-4 h-4 text-slate-950" />
                          <span>Join Zoom Room</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-blue-950/70 border border-blue-800/80 text-blue-200">
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 3: BROADCAST & SCHEDULING MODE */}
              <div className="p-6 rounded-3xl bg-white dark:bg-[#0c101a] border border-slate-200 dark:border-blue-950 space-y-6">
                <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-500" />
                  <span>Countdown & Stream Timing Options</span>
                </h3>

                {/* Mode Selector */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div
                    onClick={() => setTempTicker(prev => ({ ...prev, isStreamingNow: false }))}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      !tempTicker.isStreamingNow
                        ? 'bg-blue-500/10 border-blue-500 text-white shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="font-bold text-sm text-slate-900 dark:text-white flex items-center justify-between">
                      <span>Upcoming Countdown Mode</span>
                      {!tempTicker.isStreamingNow && <CheckCircle2 className="w-4 h-4 text-blue-400" />}
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Shows "Live Stream Starts In [ mm : ss ]" countdown boxes before class starts.
                    </p>
                  </div>

                  <div
                    onClick={() => setTempTicker(prev => ({ ...prev, isStreamingNow: true }))}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      tempTicker.isStreamingNow
                        ? 'bg-emerald-500/10 border-emerald-500 text-white shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="font-bold text-sm text-slate-900 dark:text-white flex items-center justify-between">
                      <span>Broadcast Live Now Mode</span>
                      {tempTicker.isStreamingNow && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Highlights "STREAMING LIVE NOW" with a green broadcast badge while class is in session.
                    </p>
                  </div>
                </div>

                {/* Live stream quick archive action */}
                {tempTicker.isStreamingNow && (
                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <span className="text-[11px] font-black uppercase text-amber-500 dark:text-amber-400 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                        <span>Live Broadcast Active • End Class Action</span>
                      </span>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                        When the Zoom class finishes, click below to automatically archive today's lecture recording, date, and attached tute into the database.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setArchiveModalOpen(true)}
                      className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition shadow-md flex items-center gap-1.5 shrink-0 cursor-pointer"
                    >
                      <Video className="w-4 h-4" />
                      <span>End Meeting & Auto-Archive</span>
                    </button>
                  </div>
                )}

                {/* Countdown presets & time setup */}
                {!tempTicker.isStreamingNow && (
                  <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                        Quick Preset Countdowns
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { label: '10 Mins', mins: 10 },
                          { label: '15 Mins', mins: 15 },
                          { label: '30 Mins', mins: 30 },
                          { label: '45 Mins', mins: 45 },
                          { label: '1 Hour', mins: 60 },
                          { label: '2 Hours', mins: 120 },
                        ].map((preset) => (
                          <button
                            key={preset.mins}
                            type="button"
                            onClick={() => {
                              const targetTime = new Date(Date.now() + preset.mins * 60 * 1000).toISOString();
                              setTempTicker(prev => ({
                                ...prev,
                                countdownMinutes: preset.mins,
                                scheduledDateTime: targetTime
                              }));
                            }}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                              tempTicker.countdownMinutes === preset.mins
                                ? 'bg-blue-600 text-white border-blue-500'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
                            }`}
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Exact Scheduled Date & Time
                        </label>
                        <input
                          type="datetime-local"
                          value={tempTicker.scheduledDateTime ? tempTicker.scheduledDateTime.slice(0, 16) : ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val) {
                              const dt = new Date(val);
                              const diffMins = Math.max(1, Math.round((dt.getTime() - Date.now()) / (1000 * 60)));
                              setTempTicker(prev => ({
                                ...prev,
                                scheduledDateTime: dt.toISOString(),
                                countdownMinutes: diffMins
                              }));
                            }
                          }}
                          className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Countdown Minutes (fallback)
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="1440"
                          value={tempTicker.countdownMinutes}
                          onChange={(e) => setTempTicker(prev => ({ ...prev, countdownMinutes: Number(e.target.value) || 15 }))}
                          className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* SECTION 4: CONTENT & TOPIC DETAILS */}
              <div className="p-6 rounded-3xl bg-white dark:bg-[#0c101a] border border-slate-200 dark:border-blue-950 space-y-4">
                <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-cyan-400" />
                  <span>Session Topic & Venue Information</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Batch Badge Text
                    </label>
                    <input
                      type="text"
                      value={tempTicker.batchBadge}
                      onChange={(e) => setTempTicker(prev => ({ ...prev, batchBadge: e.target.value }))}
                      placeholder="e.g. 2025 A/L Theory Batch"
                      className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Time Slot
                    </label>
                    <input
                      type="text"
                      value={tempTicker.timeSlot}
                      onChange={(e) => setTempTicker(prev => ({ ...prev, timeSlot: e.target.value }))}
                      placeholder="e.g. 08:00 AM – 01:30 PM"
                      className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Subject & Masterclass Topic Title
                  </label>
                  <input
                    type="text"
                    value={tempTicker.subject}
                    onChange={(e) => setTempTicker(prev => ({ ...prev, subject: e.target.value }))}
                    placeholder="e.g. Business Studies – Theory & Beyond Masterclass"
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Lecture Hall & Online Venue Description
                  </label>
                  <input
                    type="text"
                    value={tempTicker.venue}
                    onChange={(e) => setTempTicker(prev => ({ ...prev, venue: e.target.value }))}
                    placeholder="e.g. Sasip Institute, Nugegoda & Zoom HD"
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Zoom Meeting ID
                    </label>
                    <input
                      type="text"
                      value={tempTicker.zoomMeetingId}
                      onChange={(e) => setTempTicker(prev => ({ ...prev, zoomMeetingId: e.target.value }))}
                      placeholder="e.g. 982 4410 7712"
                      className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Zoom Passcode
                    </label>
                    <input
                      type="text"
                      value={tempTicker.zoomPasscode}
                      onChange={(e) => setTempTicker(prev => ({ ...prev, zoomPasscode: e.target.value }))}
                      placeholder="e.g. BSBEYOND"
                      className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 5: TODAY'S CLASS TUTE & MATERIALS UPLOAD */}
              <div className="p-6 rounded-3xl bg-white dark:bg-[#0c101a] border border-slate-200 dark:border-blue-950 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                    <FileText className="w-4 h-4 text-emerald-500" />
                    <span>Today's Class Tute & Handouts Upload</span>
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">
                    Instant Live Download
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Upload or attach the PDF Tute for today's active session. Students will see and download it directly in today's live meeting room, and it will automatically be attached when students watch the recording later.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Today's Tute / Document Title
                    </label>
                    <input
                      type="text"
                      value={tempTicker.todayTuteTitle || ''}
                      onChange={(e) => setTempTicker(prev => ({ ...prev, todayTuteTitle: e.target.value }))}
                      placeholder="e.g. Unit 04: Production & Operations Management Full Tute"
                      className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      File Size / Format
                    </label>
                    <input
                      type="text"
                      value={tempTicker.todayTuteSize || ''}
                      onChange={(e) => setTempTicker(prev => ({ ...prev, todayTuteSize: e.target.value }))}
                      placeholder="e.g. 4.2 MB PDF"
                      className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    PDF Download Link or Cloud Storage URL
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={tempTicker.todayTuteUrl || ''}
                      onChange={(e) => setTempTicker(prev => ({ ...prev, todayTuteUrl: e.target.value }))}
                      placeholder="https://example.com/materials/Unit_04_Operations_Tute.pdf"
                      className="flex-1 px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                    />
                    <label className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shrink-0 transition-colors shadow-sm">
                      <Plus className="w-3.5 h-3.5" />
                      <span>Upload PDF</span>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setTempTicker(prev => ({
                              ...prev,
                              todayTuteTitle: prev.todayTuteTitle || file.name.replace(/\.[^/.]+$/, ""),
                              todayTuteSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB PDF`,
                              todayTuteUrl: URL.createObjectURL(file)
                            }));
                            alert(`File "${file.name}" attached successfully! Click "Save & Publish Live" to publish.`);
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Brief Note / Instructions for Students
                  </label>
                  <input
                    type="text"
                    value={tempTicker.todayTuteDescription || ''}
                    onChange={(e) => setTempTicker(prev => ({ ...prev, todayTuteDescription: e.target.value }))}
                    placeholder="e.g. Please print or keep open on tablet before starting Part 2 speed drill."
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* SECTION 6: UNIFIED CONTINUOUS MEETING ROOM (THEORY + PAPER CLASS) */}
              <div className="p-6 rounded-3xl bg-white dark:bg-[#0c101a] border border-slate-200 dark:border-blue-950 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                    <Layers className="w-4 h-4 text-purple-400" />
                    <span>Continuous Class Meeting Room Configuration</span>
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 font-semibold">Single Unified Room:</span>
                    <button
                      type="button"
                      onClick={() => setTempTicker(prev => ({ ...prev, isContinuousSession: !(prev.isContinuousSession ?? true) }))}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                        (tempTicker.isContinuousSession ?? true) ? 'bg-purple-600' : 'bg-slate-700'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          (tempTicker.isContinuousSession ?? true) ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Paper class and Theory class run continuously one after the other on class day. Students will enter ONE unified meeting room instead of having to switch between separate links.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/20 space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold text-blue-400">
                      <span>Part 1: Theory Masterclass</span>
                      <span className="px-2 py-0.5 rounded bg-blue-500/10 text-[10px]">Morning</span>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">Title</label>
                      <input
                        type="text"
                        value={tempTicker.theoryPartTitle || 'Part 1: Operations Management Core Concepts & Mind Mapping'}
                        onChange={(e) => setTempTicker(prev => ({ ...prev, theoryPartTitle: e.target.value }))}
                        className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">Time Slot</label>
                      <input
                        type="text"
                        value={tempTicker.theoryPartTime || '08:00 AM – 10:30 AM'}
                        onChange={(e) => setTempTicker(prev => ({ ...prev, theoryPartTime: e.target.value }))}
                        className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-purple-500/5 border border-purple-500/20 space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold text-purple-400">
                      <span>Part 2: Speed Paper Drill & Evaluation</span>
                      <span className="px-2 py-0.5 rounded bg-purple-500/10 text-[10px]">Noon</span>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">Title</label>
                      <input
                        type="text"
                        value={tempTicker.paperPartTitle || 'Part 2: Model Paper #08 Speed Test & Marking Step Discussion'}
                        onChange={(e) => setTempTicker(prev => ({ ...prev, paperPartTitle: e.target.value }))}
                        className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">Time Slot</label>
                      <input
                        type="text"
                        value={tempTicker.paperPartTime || '10:45 AM – 01:30 PM'}
                        onChange={(e) => setTempTicker(prev => ({ ...prev, paperPartTime: e.target.value }))}
                        className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* SAVE BUTTON ROW */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-[#0c101a] border border-slate-200 dark:border-blue-950">
                <button
                  type="button"
                  onClick={() => {
                    const defaultConf = {
                      isEnabled: true,
                      batchBadge: "2026 A/L Theory Batch",
                      subject: "Business Studies – Theory & Beyond Masterclass",
                      timeSlot: "08:00 AM – 01:30 PM",
                      venue: "Sasip Institute, Nugegoda & Zoom HD",
                      countdownMinutes: 13,
                      isStreamingNow: false,
                      zoomMeetingId: "982 4410 7712",
                      zoomPasscode: "BSBEYOND",
                      scheduledDateTime: new Date(Date.now() + 13 * 60 * 1000).toISOString()
                    };
                    setTempTicker(defaultConf);
                    updateLiveTickerConfig(defaultConf);
                    alert('Live ticker banner reset to original defaults.');
                  }}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors cursor-pointer"
                >
                  Reset to Original Banner
                </button>

                <button
                  type="button"
                  onClick={() => {
                    updateLiveTickerConfig({ ...tempTicker });
                    setTickerSuccessMsg('Live Stream Banner configuration saved & updated on site!');
                    confetti({ particleCount: 60, spread: 70 });
                    setTimeout(() => setTickerSuccessMsg(''), 4000);
                  }}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/25 transition-all cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save & Publish Live</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: BATCHES CRUD */}
          {activeTab === 'batches' && (
            <div className="space-y-6 max-w-6xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-black font-['Space_Grotesk']">Manage Batches & Courses</h2>
                  <p className="text-xs text-slate-500">Edit, add, or remove batches displayed on the website</p>
                </div>
                <button
                  onClick={() => {
                    setEditingBatch(null);
                    setIsBatchModalOpen(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-colors cursor-pointer shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Batch</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {batches.map((batch) => (
                  <div
                    key={batch.id}
                    className="p-5 rounded-2xl bg-white dark:bg-[#0c101a] border border-slate-200 dark:border-blue-950 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-cyan-400">
                          {batch.grade}
                        </span>
                        <div className="text-xs font-bold text-blue-600 dark:text-cyan-400">{batch.fee}</div>
                      </div>
                      <h4 className="font-bold text-base text-slate-900 dark:text-white font-['Space_Grotesk']">
                        {batch.title}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">{batch.subtitle}</p>
                      <div className="text-xs text-slate-400 mt-3">
                        <div><strong>Venue:</strong> {batch.venue}</div>
                        <div><strong>Schedule:</strong> {batch.scheduleSummary}</div>
                      </div>
                    </div>

                    <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400">{batch.features.length} features listed</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditingBatch(batch);
                            setIsBatchModalOpen(true);
                          }}
                          className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900 text-blue-600 dark:text-cyan-400 cursor-pointer"
                          title="Edit"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Are you sure you want to delete "${batch.title}"?`)) {
                              deleteBatch(batch.id);
                            }
                          }}
                          className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950 text-rose-600 cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: SCHEDULE CRUD */}
          {activeTab === 'schedule' && (
            <div className="space-y-6 max-w-6xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-black font-['Space_Grotesk']">Class Schedule & Timetable</h2>
                  <p className="text-xs text-slate-500">Add or modify lecture hours, hall names, and Zoom links</p>
                </div>
                <button
                  onClick={() => {
                    setEditingSession(null);
                    setIsSessionModalOpen(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-colors cursor-pointer shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Class Session</span>
                </button>
              </div>

              <div className="space-y-3">
                {sessions.map((session) => (
                  <div
                    key={session.id}
                    className="p-4 rounded-2xl bg-white dark:bg-[#0c101a] border border-slate-200 dark:border-blue-950 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-bold text-xs text-blue-600 dark:text-cyan-400">
                          {session.batchName}
                        </span>
                        <span className="text-[11px] text-slate-400">•</span>
                        <span className="text-[11px] font-semibold text-slate-500">{session.dayOfWeek} ({session.time})</span>
                      </div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                        {session.subject}
                      </h4>
                      <div className="text-xs text-slate-400 mt-1">
                        Location: {session.location} • Zoom ID: {session.zoomMeetingId || 'N/A'}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => {
                          setEditingSession(session);
                          setIsSessionModalOpen(true);
                        }}
                        className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 text-blue-600 dark:text-cyan-400 cursor-pointer"
                        title="Edit"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete scheduled class "${session.subject}"?`)) {
                            deleteSession(session.id);
                          }
                        }}
                        className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 text-rose-600 cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: MATERIALS & LESSON UNITS CMS */}
          {activeTab === 'materials' && (
            <div className="space-y-6 max-w-6xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-black font-['Space_Grotesk']">Study Materials & Syllabus CMS</h2>
                  <p className="text-xs text-slate-500">Manage lesson units, upload tutorials, tag by unit, and set class permissions</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setEditingMaterial(null);
                      setIsMaterialModalOpen(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-colors cursor-pointer shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Upload Material</span>
                  </button>
                </div>
              </div>

              {/* Sub-tab Navigation */}
              <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
                <button
                  onClick={() => setMaterialsSubTab('units')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                    materialsSubTab === 'units'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Layers className="w-4 h-4" />
                  <span>1. Lesson Units CMS ({lessonUnits.length})</span>
                </button>

                <button
                  onClick={() => setMaterialsSubTab('items')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                    materialsSubTab === 'items'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>2. Materials Library ({materials.length})</span>
                </button>
              </div>

              {materialsSubTab === 'units' ? (
                <AdminLessonUnitsView />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {materials.map((mat) => (
                    <div
                      key={mat.id}
                      className="p-4 rounded-2xl bg-white dark:bg-[#0c101a] border border-slate-200 dark:border-blue-950 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2 flex-wrap gap-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-cyan-400">
                              {mat.category.replace('_', ' ')}
                            </span>
                            {mat.unitTitle && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                                {mat.unitTitle.slice(0, 16)}...
                              </span>
                            )}
                            {mat.classType && mat.classType !== 'both' && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                                {mat.classType.toUpperCase()} CLASS
                              </span>
                            )}
                          </div>
                          {mat.isLocked ? (
                            <span className="flex items-center gap-1 text-[10px] font-bold text-amber-500">
                              <Lock className="w-3 h-3" /> Enrolled Only
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-500">
                              <Unlock className="w-3 h-3" /> Public
                            </span>
                          )}
                        </div>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white leading-snug">
                          {mat.title}
                        </h4>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-2">{mat.description}</p>
                        <div className="text-[11px] text-slate-400 mt-2">
                          {mat.batch} • {mat.fileSize} • {mat.downloadsCount} downloads
                        </div>
                      </div>

                      <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setEditingMaterial(mat);
                            setIsMaterialModalOpen(true);
                          }}
                          className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 text-blue-600 dark:text-cyan-400 cursor-pointer"
                          title="Edit"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Delete material "${mat.title}"?`)) {
                              deleteMaterial(mat.id);
                            }
                          }}
                          className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 text-rose-600 cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: RANKERS CRUD */}
          {activeTab === 'rankers' && (
            <div className="space-y-6 max-w-6xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-black font-['Space_Grotesk']">Hall of Fame & Rankers</h2>
                  <p className="text-xs text-slate-500">Add or edit top scoring student achievements and university placements</p>
                </div>
                <button
                  onClick={() => {
                    setEditingRanker(null);
                    setIsRankerModalOpen(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-amber-600 hover:bg-amber-700 text-white shadow-sm transition-colors cursor-pointer shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Ranker</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {rankers.map((ranker) => (
                  <div
                    key={ranker.id}
                    className="p-4 rounded-2xl bg-white dark:bg-[#0c101a] border border-slate-200 dark:border-blue-950 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <img
                          src={ranker.photoUrl}
                          alt={ranker.name}
                          className="w-12 h-12 rounded-xl object-cover border border-blue-500"
                        />
                        <div>
                          <h4 className="font-bold text-sm text-slate-900 dark:text-white">{ranker.name}</h4>
                          <span className="text-[10px] font-black uppercase text-amber-500">{ranker.rank}</span>
                        </div>
                      </div>
                      <div className="text-xs text-slate-500 space-y-0.5">
                        <div><strong>Stream:</strong> {ranker.stream} ({ranker.year})</div>
                        <div><strong>District:</strong> {ranker.district}</div>
                        <div><strong>University:</strong> {ranker.university}</div>
                      </div>
                    </div>

                    <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setEditingRanker(ranker);
                          setIsRankerModalOpen(true);
                        }}
                        className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 text-blue-600 dark:text-cyan-400 cursor-pointer"
                        title="Edit"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Remove ranker "${ranker.name}"?`)) {
                            deleteRanker(ranker.id);
                          }
                        }}
                        className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 text-rose-600 cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: ENROLLMENT INQUIRIES */}
          {activeTab === 'enrollments' && (
            <div className="space-y-6 max-w-6xl">
              <div>
                <h2 className="text-xl font-black font-['Space_Grotesk']">Student Registrations & Inquiries</h2>
                <p className="text-xs text-slate-500">Students who registered via the batch enrollment form</p>
              </div>

              <div className="space-y-3">
                {enrollments.map((enr) => (
                  <div
                    key={enr.id}
                    className="p-4 rounded-2xl bg-white dark:bg-[#0c101a] border border-slate-200 dark:border-blue-950 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">{enr.studentName}</h4>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          enr.status === 'admitted'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                            : enr.status === 'contacted'
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-cyan-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        }`}>
                          {enr.status.toUpperCase()}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mt-1 flex items-center gap-3 flex-wrap">
                        <span>Phone: <strong className="text-slate-700 dark:text-slate-300">{enr.phone}</strong></span>
                        <span>•</span>
                        <span>School: {enr.school || 'Not specified'}</span>
                        <span>•</span>
                        <span>Batch: {enr.batchTitle}</span>
                        <span>•</span>
                        <span>Location: {enr.location}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={enr.status}
                        onChange={(e) => updateEnrollmentStatus(enr.id, e.target.value as any)}
                        className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                      >
                        <option value="pending">Pending</option>
                        <option value="contacted">Contacted</option>
                        <option value="admitted">Admitted</option>
                      </select>

                      <a
                        href={`https://wa.me/${enr.phone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer"
                      >
                        WhatsApp
                      </a>

                      <button
                        onClick={() => deleteEnrollment(enr.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: HIGHLIGHT STAT CARDS */}
          {activeTab === 'highlight-stats' && (
            <AdminStatsView />
          )}

          {/* TAB 7: SETTINGS & TEACHER INFO */}
          {activeTab === 'settings' && (
            <div className="space-y-6 max-w-4xl">
              <div>
                <h2 className="text-xl font-black font-['Space_Grotesk']">Master Profile & Site Settings</h2>
                <p className="text-xs text-slate-500">Update Sir's credentials, hotline, WhatsApp numbers, and announcements</p>
              </div>

              {saveSuccessMsg && (
                <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{saveSuccessMsg}</span>
                </div>
              )}

              <div className="p-6 rounded-3xl bg-white dark:bg-[#0c101a] border border-slate-200 dark:border-blue-950 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Top Announcement Strip Text
                  </label>
                  <input
                    type="text"
                    value={tempAnnouncement}
                    onChange={(e) => setTempAnnouncement(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Master Full Name
                    </label>
                    <input
                      type="text"
                      value={tempTeacher.name}
                      onChange={(e) => setTempTeacher({ ...tempTeacher, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Honorific / Short Name
                    </label>
                    <input
                      type="text"
                      value={tempTeacher.honorific}
                      onChange={(e) => setTempTeacher({ ...tempTeacher, honorific: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Academic Title & University Degree
                  </label>
                  <input
                    type="text"
                    value={tempTeacher.title}
                    onChange={(e) => setTempTeacher({ ...tempTeacher, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Years of Experience
                    </label>
                    <input
                      type="number"
                      value={tempTeacher.experienceYears}
                      onChange={(e) => setTempTeacher({ ...tempTeacher, experienceYears: parseInt(e.target.value) || 0 })}
                      className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Pass Rate
                    </label>
                    <input
                      type="text"
                      value={tempTeacher.passRate}
                      onChange={(e) => setTempTeacher({ ...tempTeacher, passRate: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Students Trained
                    </label>
                    <input
                      type="text"
                      value={tempTeacher.studentsTrained}
                      onChange={(e) => setTempTeacher({ ...tempTeacher, studentsTrained: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Helpline / Hotline
                    </label>
                    <input
                      type="text"
                      value={tempTeacher.contact.hotline}
                      onChange={(e) => setTempTeacher({
                        ...tempTeacher,
                        contact: { ...tempTeacher.contact, hotline: e.target.value }
                      })}
                      className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      WhatsApp Number
                    </label>
                    <input
                      type="text"
                      value={tempTeacher.contact.whatsapp}
                      onChange={(e) => setTempTeacher({
                        ...tempTeacher,
                        contact: { ...tempTeacher.contact, whatsapp: e.target.value }
                      })}
                      className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <button
                  onClick={() => {
                    updateTeacherInfo(tempTeacher);
                    setAnnouncement(tempAnnouncement);
                    setSaveSuccessMsg('Settings saved successfully! Website updated.');
                    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
                    setTimeout(() => setSaveSuccessMsg(''), 3000);
                  }}
                  className="mt-4 flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs sm:text-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-md cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save All Settings</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB: LIVE ACCESS & RECORDING PERMISSION REQUESTS */}
          {activeTab === 'access-requests' && <AdminAccessRequestsView />}

          {/* TAB: REGISTERED STUDENTS DIRECTORY */}
          {activeTab === 'students' && <AdminStudentsView />}

          {/* TAB: CLASS OPTIONS & MODES MANAGEMENT */}
          {activeTab === 'class-settings' && <AdminClassSettingsView />}
        </main>
      </div>

      {/* MODAL 1: BATCH ADD/EDIT */}
      {isBatchModalOpen && (
        <BatchFormModal
          batch={editingBatch}
          onClose={() => setIsBatchModalOpen(false)}
          onSave={(data) => {
            if (editingBatch) {
              updateBatch(editingBatch.id, data);
            } else {
              addBatch(data);
            }
            setIsBatchModalOpen(false);
          }}
        />
      )}

      {/* MODAL 2: SESSION ADD/EDIT */}
      {isSessionModalOpen && (
        <SessionFormModal
          session={editingSession}
          onClose={() => setIsSessionModalOpen(false)}
          onSave={(data) => {
            if (editingSession) {
              updateSession(editingSession.id, data);
            } else {
              addSession(data);
            }
            setIsSessionModalOpen(false);
          }}
        />
      )}

      {/* MODAL 3: MATERIAL ADD/EDIT */}
      {isMaterialModalOpen && (
        <MaterialFormModal
          material={editingMaterial}
          lessonUnits={lessonUnits}
          onClose={() => setIsMaterialModalOpen(false)}
          onSave={(data) => {
            if (editingMaterial) {
              updateMaterial(editingMaterial.id, data);
            } else {
              addMaterial(data);
            }
            setIsMaterialModalOpen(false);
          }}
        />
      )}

      {/* MODAL 4: RANKER ADD/EDIT */}
      {isRankerModalOpen && (
        <RankerFormModal
          ranker={editingRanker}
          onClose={() => setIsRankerModalOpen(false)}
          onSave={(data) => {
            if (editingRanker) {
              updateRanker(editingRanker.id, data);
            } else {
              addRanker(data);
            }
            setIsRankerModalOpen(false);
          }}
        />
      )}

      {/* MODAL 5: END MEETING & AUTO-ARCHIVE TO DATABASE */}
      {archiveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-lg p-6 rounded-3xl bg-white dark:bg-[#0c101a] border border-blue-900 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold">
                  <Video className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    End Live Class & Auto-Archive to Database
                  </h3>
                  <p className="text-slate-500 text-[11px]">
                    Saves today's recorded lecture and attached handouts to student vault with today's date.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setArchiveModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {archiveSuccessMsg && (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{archiveSuccessMsg}</span>
              </div>
            )}

            <form onSubmit={handleConfirmAutoArchive} className="space-y-3.5">
              <div className="p-3.5 rounded-2xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-900/60 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-bold">Auto-Generated Archive Date:</span>
                  <span className="font-mono font-bold text-blue-600 dark:text-cyan-400">
                    {new Date().toISOString().split('T')[0]} (Today)
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-bold">Class / Topic Title:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 text-right max-w-xs truncate">
                    {liveTickerConfig.subject}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-bold">Batch Target:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {liveTickerConfig.batchBadge}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-bold">Attached Class Handout:</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400 text-right truncate max-w-xs">
                    {liveTickerConfig.todayTuteTitle || 'Default Lecture Handout.pdf'}
                  </span>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Recorded Video Stream / Cloud URL *
                </label>
                <input
                  type="text"
                  required
                  value={archiveVideoUrl}
                  onChange={(e) => setArchiveVideoUrl(e.target.value)}
                  placeholder="https://www.youtube.com/embed/... or Zoom Cloud Recording share link"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono text-[11px]"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Paste the Zoom Cloud Recording URL, YouTube unlisted link, or Google Drive MP4 player URL.
                </p>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Lesson Duration
                </label>
                <input
                  type="text"
                  value={archiveDuration}
                  onChange={(e) => setArchiveDuration(e.target.value)}
                  placeholder="e.g. 2 hrs 45 mins"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setArchiveModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1.5 shadow-md cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Confirm & Save to Database</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// SUB-MODALS

interface BatchFormModalProps {
  batch: BatchInfo | null;
  onClose: () => void;
  onSave: (data: any) => void;
}

const BatchFormModal: React.FC<BatchFormModalProps> = ({ batch, onClose, onSave }) => {
  const [title, setTitle] = useState(batch?.title || '');
  const [subtitle, setSubtitle] = useState(batch?.subtitle || '');
  const [grade, setGrade] = useState(batch?.grade || '2025 A/L');
  const [fee, setFee] = useState(batch?.fee || 'LKR 4,500 / Month');
  const [venue, setVenue] = useState(batch?.venue || 'Rotary Nugegoda & Zoom HD');
  const [scheduleSummary, setScheduleSummary] = useState(batch?.scheduleSummary || 'Saturdays 8.00 AM - 1.30 PM');
  const [featuresStr, setFeaturesStr] = useState(batch?.features?.join('\n') || 'Full Theory + Tutorials\nPrinted workbooks delivered\n24/7 HD Replay Archive');
  const [popular, setPopular] = useState(batch?.popular ?? false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      title,
      subtitle,
      grade,
      fee,
      venue,
      scheduleSummary,
      startDate: batch?.startDate || 'Enrolling Now',
      mode: batch?.mode || 'hybrid',
      tag: popular ? 'Most Popular' : 'Active Batch',
      popular,
      features: featuresStr.split('\n').filter(Boolean)
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-lg max-h-[90vh] rounded-3xl bg-white dark:bg-[#0c101a] border border-blue-900 shadow-2xl p-6 sm:p-8 overflow-y-auto">
        <h3 className="text-xl font-bold font-['Space_Grotesk'] mb-4">
          {batch ? 'Edit Batch' : 'Create New Batch'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold mb-1">Batch Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
            />
          </div>

          <div>
            <label className="block font-bold mb-1">Subtitle / Summary</label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold mb-1">Target Grade</label>
              <input
                type="text"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
              />
            </div>
            <div>
              <label className="block font-bold mb-1">Monthly Fee</label>
              <input
                type="text"
                value={fee}
                onChange={(e) => setFee(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold mb-1">Venue & Location</label>
            <input
              type="text"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
            />
          </div>

          <div>
            <label className="block font-bold mb-1">Schedule Timing</label>
            <input
              type="text"
              value={scheduleSummary}
              onChange={(e) => setScheduleSummary(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
            />
          </div>

          <div>
            <label className="block font-bold mb-1">Features (one per line)</label>
            <textarea
              rows={3}
              value={featuresStr}
              onChange={(e) => setFeaturesStr(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 font-mono"
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer font-bold">
            <input
              type="checkbox"
              checked={popular}
              onChange={(e) => setPopular(e.target.checked)}
              className="rounded"
            />
            <span>Mark as Popular Batch</span>
          </label>

          <div className="pt-3 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-blue-600 text-white font-bold"
            >
              Save Batch
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface SessionFormModalProps {
  session: ClassSession | null;
  onClose: () => void;
  onSave: (data: any) => void;
}

const SessionFormModal: React.FC<SessionFormModalProps> = ({ session, onClose, onSave }) => {
  const [batchName, setBatchName] = useState(session?.batchName || '2025 A/L Theory Batch');
  const [subject, setSubject] = useState(session?.subject || '');
  const [dayOfWeek, setDayOfWeek] = useState(session?.dayOfWeek || 'Every Saturday');
  const [time, setTime] = useState(session?.time || '08:00 AM - 01:30 PM');
  const [location, setLocation] = useState(session?.location || 'Rotary Institute, Nugegoda');
  const [zoomMeetingId, setZoomMeetingId] = useState(session?.zoomMeetingId || '849 2039 1194');
  const [passcode, setPasscode] = useState(session?.passcode || 'SACHII25');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      batchName,
      subject,
      dayOfWeek,
      time,
      location,
      mode: 'hybrid',
      targetAudience: 'Registered Students',
      nextSessionDate: 'Upcoming this week',
      zoomMeetingId,
      passcode,
      status: 'upcoming'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-[#0c101a] border border-blue-900 shadow-2xl p-6 sm:p-8">
        <h3 className="text-xl font-bold font-['Space_Grotesk'] mb-4">
          {session ? 'Edit Scheduled Class' : 'Add Scheduled Class'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold mb-1">Batch Name *</label>
            <input
              type="text"
              required
              value={batchName}
              onChange={(e) => setBatchName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
            />
          </div>

          <div>
            <label className="block font-bold mb-1">Subject Topic *</label>
            <input
              type="text"
              required
              placeholder="e.g. Calculus & Integration Masterclass"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold mb-1">Day of Week</label>
              <input
                type="text"
                value={dayOfWeek}
                onChange={(e) => setDayOfWeek(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
              />
            </div>
            <div>
              <label className="block font-bold mb-1">Class Time</label>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold mb-1">Physical Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold mb-1">Zoom Meeting ID</label>
              <input
                type="text"
                value={zoomMeetingId}
                onChange={(e) => setZoomMeetingId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
              />
            </div>
            <div>
              <label className="block font-bold mb-1">Passcode</label>
              <input
                type="text"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
              />
            </div>
          </div>

          <div className="pt-3 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-bold"
            >
              Save Schedule
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface MaterialFormModalProps {
  material: StudyMaterial | null;
  lessonUnits: LessonUnit[];
  onClose: () => void;
  onSave: (data: any) => void;
}

const MaterialFormModal: React.FC<MaterialFormModalProps> = ({ material, lessonUnits, onClose, onSave }) => {
  const [title, setTitle] = useState(material?.title || '');
  const [category, setCategory] = useState<StudyMaterial['category']>(material?.category || 'theory_modules');
  const [batch, setBatch] = useState(material?.batch || '2027 Batch');
  const [fileSize, setFileSize] = useState(material?.fileSize || '5.2 MB');
  const [description, setDescription] = useState(material?.description || '');
  const [isLocked, setIsLocked] = useState(material?.isLocked ?? false);
  const [unitId, setUnitId] = useState(material?.unitId || '');
  const [classType, setClassType] = useState<StudyMaterial['classType']>(material?.classType || 'both');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      title,
      category,
      batch,
      fileSize,
      fileFormat: 'PDF',
      downloadsCount: material?.downloadsCount || 100,
      publishedDate: material?.publishedDate || 'October 2024',
      isLocked,
      unitId: unitId || undefined,
      unitTitle: lessonUnits.find(u => u.id === unitId)?.title,
      unitNumber: lessonUnits.find(u => u.id === unitId)?.unitNumber,
      classType,
      downloadUrl: '#',
      description
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-[#0c101a] border border-blue-900 shadow-2xl p-6 sm:p-8">
        <h3 className="text-xl font-bold font-['Space_Grotesk'] mb-4">
          {material ? 'Edit Study Material' : 'Upload Study Material'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold mb-1">Document Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
              >
                <option value="theory_modules">Theory Modules</option>
                <option value="short_notes">Short Notes</option>
                <option value="model_papers">Model Papers</option>
                <option value="past_papers">Past Papers Bank</option>
                <option value="marking_schemes">Marking Schemes</option>
              </select>
            </div>
            <div>
              <label className="block font-bold mb-1">Target Batch</label>
              <input
                type="text"
                value={batch}
                onChange={(e) => setBatch(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
              />
            </div>
          </div>


          {/* Lesson Unit and Class Stream Selection */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Assign to Lesson Unit</label>
              <select
                value={unitId}
                onChange={(e) => setUnitId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
              >
                <option value="">General / No Specific Unit</option>
                {lessonUnits.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Class Permission Stream</label>
              <select
                value={classType}
                onChange={(e) => setClassType(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
              >
                <option value="both">Both Theory & Paper Class</option>
                <option value="theory">Theory Class Only</option>
                <option value="paper">Paper Class Only (Restricted)</option>
                <option value="revision">Revision Class Only</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold mb-1">File Size</label>
            <input
              type="text"
              value={fileSize}
              onChange={(e) => setFileSize(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
            />
          </div>

          <div>
            <label className="block font-bold mb-1">Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer font-bold">
            <input
              type="checkbox"
              checked={isLocked}
              onChange={(e) => setIsLocked(e.target.checked)}
              className="rounded"
            />
            <span>Lock for Enrolled Students Only (Requires Student Login)</span>
          </label>

          <div className="pt-3 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold"
            >
              Save Material
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface RankerFormModalProps {
  ranker: Ranker | null;
  onClose: () => void;
  onSave: (data: any) => void;
}

const RankerFormModal: React.FC<RankerFormModalProps> = ({ ranker, onClose, onSave }) => {
  const [name, setName] = useState(ranker?.name || '');
  const [rank, setRank] = useState(ranker?.rank || 'Island Rank 01');
  const [stream, setStream] = useState(ranker?.stream || 'Physical Science (Engineering)');
  const [year, setYear] = useState(ranker?.year || '2023 A/L');
  const [district, setDistrict] = useState(ranker?.district || 'Colombo District');
  const [university, setUniversity] = useState(ranker?.university || 'University of Moratuwa - Engineering');
  const [photoUrl, setPhotoUrl] = useState(ranker?.photoUrl || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80');
  const [quote, setQuote] = useState(ranker?.quote || "Sachii Sir's classes were the foundation of my success.");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name,
      rank,
      stream,
      year,
      district,
      university,
      photoUrl,
      quote
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-[#0c101a] border border-blue-900 shadow-2xl p-6 sm:p-8">
        <h3 className="text-xl font-bold font-['Space_Grotesk'] mb-4">
          {ranker ? 'Edit Island Ranker' : 'Add Island Ranker'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold mb-1">Student Full Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold mb-1">Rank Title</label>
              <input
                type="text"
                placeholder="Island Rank 01"
                value={rank}
                onChange={(e) => setRank(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
              />
            </div>
            <div>
              <label className="block font-bold mb-1">A/L Year</label>
              <input
                type="text"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold mb-1">District</label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
              />
            </div>
            <div>
              <label className="block font-bold mb-1">Stream</label>
              <input
                type="text"
                value={stream}
                onChange={(e) => setStream(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold mb-1">University & Faculty</label>
            <input
              type="text"
              value={university}
              onChange={(e) => setUniversity(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
            />
          </div>

          <div>
            <label className="block font-bold mb-1">Photo Image URL</label>
            <input
              type="text"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
            />
          </div>

          <div>
            <label className="block font-bold mb-1">Testimonial Quote</label>
            <textarea
              rows={2}
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
            />
          </div>

          <div className="pt-3 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-amber-600 text-white font-bold"
            >
              Save Ranker
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
