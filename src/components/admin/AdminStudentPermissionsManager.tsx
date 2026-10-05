import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Lock,
  Unlock,
  KeyRound,
  ShieldCheck,
  ShieldAlert,
  Radio,
  Video,
  Phone,
  Calendar,
  AlertCircle,
  ExternalLink,
  Copy,
  Plus,
  Trash2,
  RefreshCw,
  X,
  Send,
  Layers,
  Award,
  BookOpen,
  GraduationCap
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useData } from '../../context/DataContext';
import { RegisteredAccount, LiveAccessRequest, ClassRecording } from '../../types';

interface AdminStudentPermissionsManagerProps {
  initialStudentId?: string;
  onClose?: () => void;
  isModal?: boolean;
}

export const AdminStudentPermissionsManager: React.FC<AdminStudentPermissionsManagerProps> = ({
  initialStudentId,
  onClose,
  isModal = false
}) => {
  const {
    registeredStudents,
    accessRequests,
    recordings,
    liveTickerConfig,
    monthlyApprovals,
    updateMonthlyApproval,
    grantDirectAccess,
    extendAccessDuration,
    revokeAccess,
    updateAccessRequestStatus,
    deleteAccessRequest
  } = useData();

  // Search & Filter students list
  const [studentSearch, setStudentSearch] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'pending_req' | 'active_pass' | 'physical'>('all');

  // Currently selected student
  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    initialStudentId || (registeredStudents.length > 0 ? registeredStudents[0].id : '')
  );

  // Grant New Access Form State
  const [grantType, setGrantType] = useState<'recording' | 'live_zoom'>('recording');
  const [selectedRecId, setSelectedRecId] = useState<string>(
    recordings.length > 0 ? recordings[0].id : ''
  );
  const [selectedDurationHours, setSelectedDurationHours] = useState<number>(48);
  const [grantAdminNote, setGrantAdminNote] = useState('');
  const [copiedIndex, setCopiedIndex] = useState(false);

  // Find active student object
  const activeStudent = useMemo(() => {
    return registeredStudents.find(
      (s) => s.id === selectedStudentId || s.indexNo === selectedStudentId
    ) || (registeredStudents.length > 0 ? registeredStudents[0] : null);
  }, [registeredStudents, selectedStudentId]);

  // Requests specific to this student
  const studentRequests = useMemo(() => {
    if (!activeStudent) return [];
    return accessRequests.filter(
      (r) => r.studentIndex === activeStudent.indexNo || r.studentId === activeStudent.id
    );
  }, [accessRequests, activeStudent]);

  // Active Live Pass
  const activeLivePass = useMemo(() => {
    if (!activeStudent) return null;
    return accessRequests.find(
      (r) =>
        (r.studentIndex === activeStudent.indexNo || r.studentId === activeStudent.id) &&
        r.type === 'live_zoom' &&
        r.status === 'approved' &&
        (!r.approvedUntil || new Date(r.approvedUntil) > new Date())
    );
  }, [accessRequests, activeStudent]);

  // Unlocked recordings for this student
  const unlockedRecordings = useMemo(() => {
    if (!activeStudent) return [];
    return accessRequests.filter(
      (r) =>
        (r.studentIndex === activeStudent.indexNo || r.studentId === activeStudent.id) &&
        r.type === 'recording' &&
        r.status === 'approved' &&
        (!r.approvedUntil || new Date(r.approvedUntil) > new Date())
    );
  }, [accessRequests, activeStudent]);

  // Monthly approval for this student
  const currentMonth = '2026-10';
  const studentMonthly = useMemo(() => {
    if (!activeStudent) return null;
    return monthlyApprovals.find(
      (a) =>
        (a.studentIndex === activeStudent.indexNo || a.studentId === activeStudent.id) &&
        a.month === currentMonth
    );
  }, [monthlyApprovals, activeStudent]);

  // Filtered Students List for the Left Column / Selector
  const filteredStudentsList = useMemo(() => {
    return registeredStudents.filter((s) => {
      const q = studentSearch.toLowerCase();
      const fullName = `${s.firstName} ${s.lastName}`.toLowerCase();
      const matchesSearch =
        !q ||
        fullName.includes(q) ||
        s.indexNo.toLowerCase().includes(q) ||
        s.whatsapp.includes(q) ||
        s.school.toLowerCase().includes(q);

      if (!matchesSearch) return false;

      if (filterMode === 'pending_req') {
        return accessRequests.some(
          (r) => (r.studentIndex === s.indexNo || r.studentId === s.id) && r.status === 'pending'
        );
      }
      if (filterMode === 'active_pass') {
        return accessRequests.some(
          (r) =>
            (r.studentIndex === s.indexNo || r.studentId === s.id) &&
            r.status === 'approved' &&
            (!r.approvedUntil || new Date(r.approvedUntil) > new Date())
        );
      }
      if (filterMode === 'physical') {
        const mode = (s.classMode || s.deliveryMode || '').toLowerCase();
        return (
          mode.includes('physical') ||
          mode.includes('sasip') ||
          mode.includes('rotary') ||
          mode.includes('syzygy')
        );
      }
      return true;
    });
  }, [registeredStudents, studentSearch, filterMode, accessRequests]);

  // Handle Direct Access Grant
  const handleGrantAccess = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeStudent) return;

    if (grantType === 'recording') {
      const rec = recordings.find((r) => r.id === selectedRecId);
      const title = rec ? rec.title : 'General Lecture Replay';
      const date = rec ? rec.date : new Date().toISOString().split('T')[0];

      grantDirectAccess({
        studentId: activeStudent.id,
        studentName: `${activeStudent.firstName} ${activeStudent.lastName}`,
        studentIndex: activeStudent.indexNo,
        batch: activeStudent.batch,
        type: 'recording',
        targetDate: date,
        targetSessionTitle: title,
        recordingId: rec?.id,
        durationHours: selectedDurationHours,
        adminNotes: grantAdminNote.trim() || 'Direct Replay Access Granted by Sir'
      });
    } else {
      const sessionTitle = liveTickerConfig.isContinuousSession
        ? `${liveTickerConfig.subject || 'Live Masterclass'} (Continuous Theory + Paper Class)`
        : liveTickerConfig.subject || 'Live Theory Masterclass';

      grantDirectAccess({
        studentId: activeStudent.id,
        studentName: `${activeStudent.firstName} ${activeStudent.lastName}`,
        studentIndex: activeStudent.indexNo,
        batch: activeStudent.batch,
        type: 'live_zoom',
        targetDate: new Date().toISOString().split('T')[0],
        targetSessionTitle: sessionTitle,
        durationHours: selectedDurationHours,
        adminNotes: grantAdminNote.trim() || 'Direct Live Zoom Pass Granted by Sir'
      });
    }

    confetti({ particleCount: 45, spread: 60 });
    setGrantAdminNote('');
  };

  // Toggle Monthly Clearance
  const handleToggleMonthlyClearance = (field: 'theoryApproved' | 'paperApproved') => {
    if (!activeStudent) return;
    const current = studentMonthly
      ? studentMonthly[field]
      : field === 'theoryApproved'
      ? true
      : false;

    updateMonthlyApproval({
      id: studentMonthly?.id || `appr-${activeStudent.id}-${currentMonth}`,
      studentId: activeStudent.id,
      studentIndex: activeStudent.indexNo,
      studentName: `${activeStudent.firstName} ${activeStudent.lastName}`,
      studentEmail: activeStudent.email,
      batch: activeStudent.batch,
      month: currentMonth,
      theoryApproved: field === 'theoryApproved' ? !current : (studentMonthly?.theoryApproved ?? true),
      paperApproved: field === 'paperApproved' ? !current : (studentMonthly?.paperApproved ?? false),
      revisionApproved: studentMonthly?.revisionApproved ?? false,
      feeStatus: !current ? 'paid' : (studentMonthly?.feeStatus ?? 'pending'),
      notes: `Updated directly by Sir via Permissions Manager`
    });

    confetti({ particleCount: 25, spread: 45 });
  };

  // Quick Copy Index
  const handleCopyIndex = (idx: string) => {
    navigator.clipboard.writeText(idx);
    setCopiedIndex(true);
    setTimeout(() => setCopiedIndex(false), 2000);
  };

  // Generate WhatsApp Direct Confirmation Link
  const generateWhatsAppUrl = (student: RegisteredAccount, details: string) => {
    const phone = student.whatsapp.replace(/\D/g, '').replace(/^0/, '94');
    const msg = `Hello ${student.firstName}, Sachitha Sir has updated your class access permissions on the Sachii Portal: ${details}. You can now log in at https://sachii.lk to access your session.`;
    return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
  };

  const isPhysical = useMemo(() => {
    if (!activeStudent) return false;
    const m = (activeStudent.classMode || activeStudent.deliveryMode || '').toLowerCase();
    return (
      m.includes('physical') ||
      m.includes('sasip') ||
      m.includes('rotary') ||
      m.includes('syzygy')
    );
  }, [activeStudent]);

  return (
    <div className={`space-y-6 text-slate-800 dark:text-slate-100 ${isModal ? 'p-2' : ''}`}>
      
      {/* Header bar if modal */}
      {isModal && (
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 mb-2">
          <div className="flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-blue-600 dark:text-cyan-400" />
            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              Student Access & Permission Manager
            </h3>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      )}

      {/* Main 2-Column Split: Left Student Selector, Right Student Permissions Dossier */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ========================================================
            LEFT COLUMN (4 Cols): STUDENT DIRECTORY & SELECTOR
           ======================================================== */}
        <div className="lg:col-span-4 space-y-4">
          
          <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#0c101a] border border-slate-200 dark:border-blue-950 space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
                <span>Select Student</span>
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                {filteredStudentsList.length} Students
              </span>
            </div>

            {/* Search Box */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                placeholder="Search by name, index, school..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Quick Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[10px] font-bold">
              {[
                { id: 'all', label: 'All' },
                { id: 'pending_req', label: '⏳ Pending' },
                { id: 'active_pass', label: '🟢 Active' },
                { id: 'physical', label: '🏫 Physical' }
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFilterMode(f.id as any)}
                  className={`px-2.5 py-1 rounded-lg transition whitespace-nowrap cursor-pointer ${
                    filterMode === f.id
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Scrollable Students List */}
            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
              {filteredStudentsList.length > 0 ? (
                filteredStudentsList.map((stu) => {
                  const isSelected = activeStudent?.id === stu.id;
                  const pendingCount = accessRequests.filter(
                    (r) => (r.studentIndex === stu.indexNo || r.studentId === stu.id) && r.status === 'pending'
                  ).length;
                  const hasActive = accessRequests.some(
                    (r) =>
                      (r.studentIndex === stu.indexNo || r.studentId === stu.id) &&
                      r.status === 'approved' &&
                      (!r.approvedUntil || new Date(r.approvedUntil) > new Date())
                  );

                  return (
                    <button
                      key={stu.id}
                      onClick={() => setSelectedStudentId(stu.id)}
                      className={`w-full p-3 rounded-2xl text-left transition flex items-center justify-between gap-3 cursor-pointer border ${
                        isSelected
                          ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-500/80 shadow-md ring-1 ring-blue-500/30'
                          : 'bg-slate-50/70 dark:bg-slate-900/40 border-slate-200/70 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="font-bold text-xs text-slate-900 dark:text-white truncate">
                            {stu.firstName} {stu.lastName}
                          </p>
                          {hasActive && (
                            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" title="Has Active Online Access" />
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                          <span className="font-mono font-semibold text-blue-600 dark:text-cyan-400">{stu.indexNo}</span>
                          <span>•</span>
                          <span className="truncate">{stu.classMode || 'Online'}</span>
                        </div>
                      </div>

                      {pendingCount > 0 && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500 text-slate-950 animate-pulse shrink-0">
                          {pendingCount} Req
                        </span>
                      )}
                    </button>
                  );
                })
              ) : (
                <div className="p-6 text-center text-xs text-slate-400">
                  No students found matching filters.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ========================================================
            RIGHT COLUMN (8 Cols): SELECTED STUDENT PERMISSION DOSSIER
           ======================================================== */}
        <div className="lg:col-span-8 space-y-5">
          {activeStudent ? (
            <>
              {/* Student Overview Header Card */}
              <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#0c101a] border border-slate-200 dark:border-blue-950 space-y-4 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 text-white font-black text-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
                      {activeStudent.firstName.charAt(0)}{activeStudent.lastName.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-lg font-black text-slate-900 dark:text-white">
                          {activeStudent.firstName} {activeStudent.lastName}
                        </h2>
                        <span className="font-mono text-xs px-2.5 py-0.5 rounded-md font-bold bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-cyan-300 border border-blue-200 dark:border-blue-800">
                          {activeStudent.indexNo}
                        </span>
                        <button
                          onClick={() => handleCopyIndex(activeStudent.indexNo)}
                          className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition cursor-pointer"
                          title="Copy Student Index"
                        >
                          {copiedIndex ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
                        <span>{activeStudent.batch}</span>
                        <span>•</span>
                        <span>{activeStudent.school}</span>
                        <span>•</span>
                        <span className={`font-semibold ${isPhysical ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-cyan-400'}`}>
                          {activeStudent.classMode || 'Online (Zoom)'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions / WhatsApp */}
                  <div className="flex items-center gap-2 shrink-0">
                    <a
                      href={`https://wa.me/94${activeStudent.whatsapp.replace(/\D/g, '').replace(/^0/, '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>WhatsApp Student</span>
                    </a>
                  </div>
                </div>

                {/* Quick Stats Banner */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Total Requests</span>
                    <p className="text-base font-black text-slate-900 dark:text-white mt-0.5">
                      {studentRequests.length}
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Continuous Live Pass</span>
                    <p className={`text-base font-black mt-0.5 ${activeLivePass ? 'text-emerald-500' : 'text-slate-400'}`}>
                      {activeLivePass ? 'ACTIVE NOW' : 'NOT ACTIVE'}
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Unlocked Recordings</span>
                    <p className="text-base font-black text-indigo-500 dark:text-cyan-400 mt-0.5">
                      {unlockedRecordings.length} Replays
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">October 2026 Fee</span>
                    <p className={`text-base font-black mt-0.5 ${studentMonthly?.feeStatus === 'paid' ? 'text-emerald-500' : 'text-amber-500'}`}>
                      {studentMonthly?.feeStatus === 'paid' ? 'FEE PAID' : 'PENDING'}
                    </p>
                  </div>
                </div>
              </div>

              {/* ========================================================
                  SECTION 1: ACTIVE PERMISSIONS & PASSES
                 ======================================================== */}
              <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#0c101a] border border-slate-200 dark:border-blue-950 space-y-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span>Active Access Grants & Clearance</span>
                  </h3>
                  <span className="text-[10px] text-slate-400">Real-time status synced to student portal</span>
                </div>

                <div className="space-y-3">
                  {/* Active Continuous Live Zoom Pass */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Radio className="w-4 h-4 text-rose-500 animate-pulse" />
                        <span className="font-bold text-xs text-slate-900 dark:text-white">
                          Continuous Live Zoom Class Access
                        </span>
                        {activeLivePass ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                            🟢 ACTIVE ACCESS
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 dark:bg-slate-800 text-slate-500">
                            LOCKED (Physical Hall Only)
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {activeLivePass ? (
                          <>
                            Target: <strong>{activeLivePass.targetSessionTitle}</strong> • Valid until:{' '}
                            <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                              {activeLivePass.approvedUntil ? new Date(activeLivePass.approvedUntil).toLocaleString() : 'Permanent'}
                            </span>
                          </>
                        ) : (
                          'Student must request access or Sir can grant permission below.'
                        )}
                      </p>
                    </div>

                    {activeLivePass && (
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => {
                            extendAccessDuration(activeLivePass.id, 24);
                            confetti({ particleCount: 25, spread: 45 });
                          }}
                          className="px-2.5 py-1.5 rounded-xl bg-blue-100 hover:bg-blue-200 dark:bg-blue-950 dark:hover:bg-blue-900 text-blue-700 dark:text-cyan-300 font-bold text-[11px] transition cursor-pointer"
                          title="Add 24 hours to active pass"
                        >
                          +24h Extend
                        </button>
                        <button
                          onClick={() => revokeAccess(activeLivePass.id, 'Revoked by Sir in Permissions Manager')}
                          className="px-2.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950 dark:hover:bg-rose-900 text-rose-600 dark:text-rose-300 font-bold text-[11px] transition cursor-pointer"
                        >
                          Revoke Pass
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Active Recording Replays List */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Video className="w-4 h-4 text-indigo-500" />
                        <span className="font-bold text-xs text-slate-900 dark:text-white">
                          Unlocked Recording Replays ({unlockedRecordings.length})
                        </span>
                      </div>
                    </div>

                    {unlockedRecordings.length > 0 ? (
                      <div className="space-y-2">
                        {unlockedRecordings.map((recReq) => (
                          <div
                            key={recReq.id}
                            className="p-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200/70 dark:border-slate-800/80 flex items-center justify-between gap-3"
                          >
                            <div className="min-w-0">
                              <p className="font-bold text-xs text-slate-900 dark:text-white truncate">
                                {recReq.targetSessionTitle}
                              </p>
                              <p className="text-[10px] text-slate-400 font-mono">
                                Expires: {recReq.approvedUntil ? new Date(recReq.approvedUntil).toLocaleDateString() : 'Unlimited'} • {recReq.adminNotes || 'Replay Access'}
                              </p>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <button
                                onClick={() => {
                                  extendAccessDuration(recReq.id, 168); // +7 days
                                  confetti({ particleCount: 20, spread: 40 });
                                }}
                                className="px-2 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 font-bold text-[10px] hover:bg-indigo-100 transition cursor-pointer"
                                title="Extend +7 days"
                              >
                                +7 Days
                              </button>
                              <button
                                onClick={() => revokeAccess(recReq.id, 'Revoked by Sir in Permissions Manager')}
                                className="px-2 py-1 rounded-lg bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 font-bold text-[10px] hover:bg-rose-100 transition cursor-pointer"
                              >
                                Revoke
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 italic">
                        No specific recordings currently unlocked. Select from the library below to grant permission.
                      </p>
                    )}
                  </div>

                  {/* Monthly Fee Course Clearance */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white">
                        October 2026 Monthly Enrollment Clearance
                      </span>
                      <p className="text-[11px] text-slate-400">
                        Controls whether student is permitted into Theory and Paper classes for October.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleMonthlyClearance('theoryApproved')}
                        className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 cursor-pointer ${
                          studentMonthly?.theoryApproved !== false
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Theory: {studentMonthly?.theoryApproved !== false ? 'Approved' : 'Pending'}</span>
                      </button>

                      <button
                        onClick={() => handleToggleMonthlyClearance('paperApproved')}
                        className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 cursor-pointer ${
                          studentMonthly?.paperApproved
                            ? 'bg-purple-600 text-white shadow-sm'
                            : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        <Award className="w-3.5 h-3.5" />
                        <span>Paper: {studentMonthly?.paperApproved ? 'Approved' : 'Gated'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* ========================================================
                  SECTION 2: GRANT NEW PERMISSION / UNLOCK RECORDS
                 ======================================================== */}
              <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-blue-900/20 via-indigo-950/20 to-slate-900/40 border border-blue-500/30 space-y-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Plus className="w-4 h-4 text-blue-500 dark:text-cyan-400" />
                    <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                      Grant New Permission to {activeStudent.firstName}
                    </h3>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-cyan-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
                    Instant 1-Click Unlock
                  </span>
                </div>

                <form onSubmit={handleGrantAccess} className="space-y-4 text-xs">
                  {/* Permission Type Switch */}
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setGrantType('recording')}
                      className={`p-3 rounded-2xl border text-left flex items-start gap-2.5 transition cursor-pointer ${
                        grantType === 'recording'
                          ? 'border-indigo-600 dark:border-indigo-400 bg-indigo-50/80 dark:bg-indigo-950/50 text-indigo-950 dark:text-indigo-200 ring-2 ring-indigo-500/20'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <Video className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-xs">Unlock Class Recording</div>
                        <div className="text-[11px] opacity-75">Grant replay access for specific lecture</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setGrantType('live_zoom')}
                      className={`p-3 rounded-2xl border text-left flex items-start gap-2.5 transition cursor-pointer ${
                        grantType === 'live_zoom'
                          ? 'border-rose-600 dark:border-rose-400 bg-rose-50/80 dark:bg-rose-950/50 text-rose-950 dark:text-rose-200 ring-2 ring-rose-500/20'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <Radio className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-xs">Continuous Live Zoom Pass</div>
                        <div className="text-[11px] opacity-75">Allow physical student to join online</div>
                      </div>
                    </button>
                  </div>

                  {/* If Recording: Pick Recording from Library */}
                  {grantType === 'recording' && (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Select Recording to Unlock *
                      </label>
                      <select
                        value={selectedRecId}
                        onChange={(e) => setSelectedRecId(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs font-medium text-slate-900 dark:text-white cursor-pointer"
                      >
                        {recordings.map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.title} ({r.unitName} • {r.date})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* If Live Zoom: Target Session Preview */}
                  {grantType === 'live_zoom' && (
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                      <span className="text-[10px] text-slate-400 uppercase font-bold">Target Live Broadcast</span>
                      <p className="font-bold text-xs text-slate-900 dark:text-white mt-0.5">
                        {liveTickerConfig.subject}
                      </p>
                      <span className="text-[11px] text-rose-500 font-semibold">
                        Continuous Theory Masterclass + Speed Paper Room
                      </span>
                    </div>
                  )}

                  {/* Duration and Admin Note */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Access Duration *
                      </label>
                      <select
                        value={selectedDurationHours}
                        onChange={(e) => setSelectedDurationHours(Number(e.target.value))}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs font-medium text-slate-900 dark:text-white cursor-pointer"
                      >
                        <option value={24}>24 Hours (1 Day)</option>
                        <option value={48}>48 Hours (2 Days - Recommended)</option>
                        <option value={168}>7 Days (1 Week)</option>
                        <option value={336}>14 Days (2 Weeks)</option>
                        <option value={720}>30 Days (1 Month)</option>
                        <option value={-1}>Permanent / Unlimited</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Admin Note / Reason (Optional)
                      </label>
                      <input
                        type="text"
                        value={grantAdminNote}
                        onChange={(e) => setGrantAdminNote(e.target.value)}
                        placeholder="e.g. Medical catch-up pass granted by Sir"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                    <button
                      type="submit"
                      className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs shadow-lg shadow-blue-600/30 transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <KeyRound className="w-4 h-4" />
                      <span>
                        Grant {grantType === 'recording' ? 'Recording Replay' : 'Continuous Live'} Access &rarr;
                      </span>
                    </button>

                    {/* Quick WhatsApp Alert Button */}
                    <a
                      href={generateWhatsAppUrl(
                        activeStudent,
                        grantType === 'recording' ? 'Class Recording Replay' : 'Continuous Live Zoom Pass'
                      )}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2.5 rounded-xl bg-emerald-600/15 hover:bg-emerald-600/25 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 font-bold text-xs flex items-center justify-center gap-1.5 transition"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Pass to Student on WhatsApp</span>
                    </a>
                  </div>
                </form>
              </div>

              {/* ========================================================
                  SECTION 3: REQUEST HISTORY LOG FOR THIS STUDENT
                 ======================================================== */}
              <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#0c101a] border border-slate-200 dark:border-blue-950 space-y-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
                    <span>Request & Access History for {activeStudent.firstName}</span>
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {studentRequests.length} Total Records
                  </span>
                </div>

                {studentRequests.length > 0 ? (
                  <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold text-[10px] uppercase">
                          <tr>
                            <th className="px-4 py-3">Type</th>
                            <th className="px-4 py-3">Target Session / Material</th>
                            <th className="px-4 py-3">Student's Reason</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-900">
                          {studentRequests.map((req) => (
                            <tr key={req.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition">
                              <td className="px-4 py-3">
                                {req.type === 'live_zoom' ? (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[10px]">
                                    <Radio className="w-3 h-3" />
                                    <span>Live Zoom</span>
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 text-[10px]">
                                    <Video className="w-3 h-3" />
                                    <span>Recording</span>
                                  </span>
                                )}
                              </td>

                              <td className="px-4 py-3">
                                <p className="font-bold text-slate-900 dark:text-white leading-tight">
                                  {req.targetSessionTitle}
                                </p>
                                <span className="text-[10px] text-slate-400 font-mono">
                                  Requested: {new Date(req.requestDate).toLocaleDateString()}
                                </span>
                              </td>

                              <td className="px-4 py-3 max-w-xs">
                                <p className="text-slate-600 dark:text-slate-300 leading-snug">
                                  {req.reason}
                                </p>
                                {req.adminNotes && (
                                  <p className="text-[10px] text-blue-600 dark:text-cyan-400 mt-0.5">
                                    <strong>Sir Note:</strong> {req.adminNotes}
                                  </p>
                                )}
                              </td>

                              <td className="px-4 py-3">
                                {req.status === 'approved' && (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px]">
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    <span>Approved</span>
                                  </span>
                                )}
                                {req.status === 'pending' && (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] animate-pulse">
                                    <Clock className="w-3.5 h-3.5" />
                                    <span>Pending</span>
                                  </span>
                                )}
                                {req.status === 'rejected' && (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[10px]">
                                    <XCircle className="w-3.5 h-3.5" />
                                    <span>Rejected</span>
                                  </span>
                                )}
                              </td>

                              <td className="px-4 py-3 text-right">
                                <div className="flex items-center justify-end gap-1">
                                  {req.status === 'pending' && (
                                    <button
                                      onClick={() => {
                                        const approvedUntil = new Date(Date.now() + 48 * 3600 * 1000).toISOString();
                                        updateAccessRequestStatus(req.id, 'approved', approvedUntil, 'Approved by Sir');
                                        confetti({ particleCount: 30, spread: 50 });
                                      }}
                                      className="px-2 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] transition cursor-pointer"
                                    >
                                      Approve
                                    </button>
                                  )}
                                  {req.status === 'approved' && (
                                    <button
                                      onClick={() => revokeAccess(req.id, 'Revoked')}
                                      className="px-2 py-1 rounded bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 font-bold text-[10px] hover:bg-rose-100 transition cursor-pointer"
                                    >
                                      Revoke
                                    </button>
                                  )}
                                  {req.status === 'rejected' && (
                                    <button
                                      onClick={() => {
                                        const approvedUntil = new Date(Date.now() + 48 * 3600 * 1000).toISOString();
                                        updateAccessRequestStatus(req.id, 'approved', approvedUntil, 'Re-approved by Sir');
                                        confetti({ particleCount: 25, spread: 45 });
                                      }}
                                      className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-[10px] hover:bg-slate-200 transition cursor-pointer"
                                    >
                                      Re-Approve
                                    </button>
                                  )}
                                  <button
                                    onClick={() => deleteAccessRequest(req.id)}
                                    className="p-1 rounded text-slate-400 hover:text-rose-500 transition cursor-pointer"
                                    title="Delete record"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-center text-xs text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                    No past requests submitted by {activeStudent.firstName}. Use the form above to grant immediate access.
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="p-12 text-center text-slate-400 bg-white dark:bg-[#0c101a] rounded-3xl border border-slate-200 dark:border-slate-800">
              <Users className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-700 mb-2" />
              <p className="font-bold text-slate-600 dark:text-slate-300">No Student Selected</p>
              <p className="text-xs text-slate-400 mt-1">Please select a student from the left directory to view and manage their permissions.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
