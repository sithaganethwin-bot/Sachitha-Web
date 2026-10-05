import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Video,
  Radio,
  Search,
  Filter,
  Trash2,
  ExternalLink,
  Plus,
  Pencil,
  Save,
  Layers,
  Calendar,
  AlertCircle,
  Users,
  ArrowRight,
  KeyRound
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useData } from '../../context/DataContext';
import { LiveAccessRequest, ClassRecording } from '../../types';
import { AdminStudentPermissionsManager } from './AdminStudentPermissionsManager';

export const AdminAccessRequestsView: React.FC = () => {
  const {
    accessRequests,
    updateAccessRequestStatus,
    deleteAccessRequest,
    recordings,
    addRecording,
    updateRecording,
    deleteRecording,
    recordingPolicy,
    updateRecordingPolicy,
    batches
  } = useData();

  const [activeSubTab, setActiveSubTab] = useState<'requests' | 'by-student' | 'recordings' | 'policy'>('requests');
  const [selectedStudentForManager, setSelectedStudentForManager] = useState<string | undefined>(undefined);

  // Search & Filter for requests
  const [requestFilter, setRequestFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [searchQuery, setSearchQuery] = useState('');

  // Approval duration modal
  const [approvingReq, setApprovingReq] = useState<LiveAccessRequest | null>(null);
  const [approvalHours, setApprovalHours] = useState(48);
  const [adminNote, setAdminNote] = useState('');

  // Recording Modal state
  const [isRecordingModalOpen, setIsRecordingModalOpen] = useState(false);
  const [editingRecording, setEditingRecording] = useState<ClassRecording | null>(null);
  const [recTitle, setRecTitle] = useState('');
  const [recUnit, setRecUnit] = useState('Unit 1: Fundamentals of Business');
  const [recBatch, setRecBatch] = useState('2027 Batch');
  const [recDate, setRecDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [recDuration, setRecDuration] = useState('2 hrs 30 mins');
  const [recVideoUrl, setRecVideoUrl] = useState('https://www.youtube.com/embed/dQw4w9WgXcQ');
  const [recDays, setRecDays] = useState(14);
  const [recAttachedStr, setRecAttachedStr] = useState('Lesson Lecture Handout.pdf (3.5 MB)');

  // Policy form state
  const [tempPolicy, setTempPolicy] = useState(recordingPolicy);
  const [policySavedMsg, setPolicySavedMsg] = useState('');

  const filteredRequests = accessRequests.filter((r) => {
    const matchesStatus = requestFilter === 'all' || r.status === requestFilter;
    const matchesSearch =
      r.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.studentIndex.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.targetSessionTitle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleOpenApprove = (req: LiveAccessRequest) => {
    setApprovingReq(req);
    setApprovalHours(recordingPolicy.defaultPhysicalApprovedHours || 48);
    setAdminNote('');
  };

  const handleConfirmApproval = () => {
    if (!approvingReq) return;
    const approvedUntil = new Date(Date.now() + approvalHours * 3600 * 1000).toISOString();
    updateAccessRequestStatus(approvingReq.id, 'approved', approvedUntil, adminNote);
    confetti({ particleCount: 40, spread: 50 });
    setApprovingReq(null);
  };

  const handleReject = (id: string) => {
    const reason = prompt('Optional note / reason for rejecting request:', 'Please attend the Sunday make-up session');
    updateAccessRequestStatus(id, 'rejected', undefined, reason || 'Request declined by Sir');
  };

  const handleOpenRecordingModal = (rec?: ClassRecording) => {
    if (rec) {
      setEditingRecording(rec);
      setRecTitle(rec.title);
      setRecUnit(rec.unitName);
      setRecBatch(rec.batch);
      setRecDate(rec.date);
      setRecDuration(rec.duration);
      setRecVideoUrl(rec.videoUrl);
      setRecDays(rec.availableForDays || 14);
      setRecAttachedStr(rec.attachedMaterials?.map((m) => `${m.title} (${m.fileSize})`).join('\n') || '');
    } else {
      setEditingRecording(null);
      setRecTitle('');
      setRecUnit('Unit 1: Fundamentals of Business');
      setRecBatch('2027 Batch');
      setRecDate(new Date().toISOString().split('T')[0]);
      setRecDuration('2 hrs 30 mins');
      setRecVideoUrl('https://www.youtube.com/embed/dQw4w9WgXcQ');
      setRecDays(14);
      setRecAttachedStr('Lecture Summary Handout.pdf (3.2 MB)');
    }
    setIsRecordingModalOpen(true);
  };

  const handleSaveRecording = (e: React.FormEvent) => {
    e.preventDefault();
    const attachedMaterials = recAttachedStr
      .split('\n')
      .filter(Boolean)
      .map((line) => {
        const parts = line.split('(');
        const title = parts[0]?.trim() || line.trim();
        const fileSize = parts[1]?.replace(')', '').trim() || '2.5 MB';
        return { title, fileUrl: '#', fileSize };
      });

    if (editingRecording) {
      updateRecording(editingRecording.id, {
        title: recTitle,
        unitName: recUnit,
        batch: recBatch,
        date: recDate,
        duration: recDuration,
        videoUrl: recVideoUrl,
        availableForDays: recDays,
        attachedMaterials
      });
    } else {
      addRecording({
        title: recTitle,
        unitName: recUnit,
        batch: recBatch,
        date: recDate,
        duration: recDuration,
        videoUrl: recVideoUrl,
        availableForDays: recDays,
        isLockedForPhysical: true,
        status: 'published',
        attachedMaterials
      });
    }

    confetti({ particleCount: 30, spread: 50 });
    setIsRecordingModalOpen(false);
  };

  const handleSavePolicy = () => {
    updateRecordingPolicy(tempPolicy);
    setPolicySavedMsg('Policy updated successfully!');
    setTimeout(() => setPolicySavedMsg(''), 3000);
  };

  const pendingCount = accessRequests.filter((r) => r.status === 'pending').length;

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-black font-['Space_Grotesk'] text-slate-900 dark:text-white">
              Live & Recording Access Permissions
            </h2>
            {pendingCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-500 text-slate-950 animate-pulse">
                {pendingCount} Pending
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Review online Zoom access & replay permission requests from Physical Hall students, and manage recorded archives.
          </p>
        </div>

        {/* Sub-tab Navigation */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs font-bold flex-wrap">
          <button
            onClick={() => setActiveSubTab('requests')}
            className={`px-3.5 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'requests'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Student Requests ({accessRequests.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('by-student')}
            className={`px-3.5 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'by-student'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Student-by-Student Access & Grants</span>
          </button>

          <button
            onClick={() => setActiveSubTab('recordings')}
            className={`px-3.5 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'recordings'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>Manage Recordings ({recordings.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('policy')}
            className={`px-3.5 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'policy'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Access Policies</span>
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: STUDENT REQUESTS TABLE */}
      {activeSubTab === 'requests' && (
        <div className="space-y-4">
          
          {/* Filters Bar */}
          <div className="p-4 rounded-2xl bg-white dark:bg-[#0c101a] border border-slate-200 dark:border-blue-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-500">Filter by Status:</span>
              {(['pending', 'approved', 'rejected', 'all'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setRequestFilter(st)}
                  className={`px-3 py-1.5 rounded-xl font-bold uppercase text-[11px] transition cursor-pointer ${
                    requestFilter === st
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search student or reason..."
                className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white w-full sm:w-60"
              />
            </div>
          </div>

          {/* Table */}
          <div className="rounded-3xl border border-slate-200 dark:border-blue-950 overflow-hidden bg-white dark:bg-[#0c101a] shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-900/80 border-b border-slate-200 dark:border-blue-950 text-slate-500 uppercase font-bold text-[10px] tracking-wider">
                  <tr>
                    <th className="px-5 py-3.5">Student</th>
                    <th className="px-5 py-3.5">Request Type</th>
                    <th className="px-5 py-3.5">Target Session</th>
                    <th className="px-5 py-3.5">Reason Submitted</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-900">
                  {filteredRequests.length > 0 ? (
                    filteredRequests.map((req) => (
                      <tr key={req.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition">
                        <td className="px-5 py-4">
                          <p className="font-bold text-slate-900 dark:text-white">{req.studentName}</p>
                          <p className="font-mono text-[11px] text-blue-600 dark:text-cyan-400">{req.studentIndex}</p>
                          <span className="text-[10px] text-slate-400">{req.batch}</span>
                          <div className="mt-1">
                            <button
                              onClick={() => {
                                setSelectedStudentForManager(req.studentId || req.studentIndex);
                                setActiveSubTab('by-student');
                              }}
                              className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-600 dark:text-cyan-400 hover:underline cursor-pointer"
                              title="View full permissions and request history for this student"
                            >
                              <Users className="w-3 h-3" />
                              <span>Student Dossier</span>
                            </button>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          {req.type === 'live_zoom' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 text-[11px]">
                              <Radio className="w-3 h-3" />
                              <span>Live Zoom</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 text-[11px]">
                              <Video className="w-3 h-3" />
                              <span>Replay Replay</span>
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          <p className="font-semibold text-slate-800 dark:text-slate-200">{req.targetSessionTitle}</p>
                          <span className="text-[11px] text-slate-400">{req.targetDate}</span>
                        </td>
                        <td className="px-5 py-4 max-w-xs">
                          <p className="text-slate-600 dark:text-slate-300 leading-snug">{req.reason}</p>
                          {req.adminNotes && (
                            <p className="text-[10px] text-blue-600 dark:text-cyan-400 mt-1">
                              <strong>Note:</strong> {req.adminNotes}
                            </p>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          {req.status === 'approved' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[11px]">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Approved</span>
                            </span>
                          )}
                          {req.status === 'pending' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[11px] animate-pulse">
                              <Clock className="w-3.5 h-3.5" />
                              <span>Pending</span>
                            </span>
                          )}
                          {req.status === 'rejected' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[11px]">
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Rejected</span>
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-4 text-right">
                          <div className="flex items-center justify-end gap-1.5 flex-wrap">
                            <button
                              onClick={() => {
                                setSelectedStudentForManager(req.studentId || req.studentIndex);
                                setActiveSubTab('by-student');
                              }}
                              className="px-2 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900 text-indigo-600 dark:text-indigo-300 font-bold text-[11px] transition flex items-center gap-1 cursor-pointer"
                              title="Inspect student's full request history & grant custom recordings/live access"
                            >
                              <KeyRound className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Dossier</span>
                            </button>
                            {req.status === 'pending' && (
                              <button
                                onClick={() => {
                                  const approvedUntil = new Date(Date.now() + 48 * 3600 * 1000).toISOString();
                                  updateAccessRequestStatus(req.id, 'approved', approvedUntil, '1-Click Quick Approved by Sir for Continuous Class');
                                  confetti({ particleCount: 35, spread: 50 });
                                }}
                                className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[11px] shadow-sm transition flex items-center gap-1 cursor-pointer"
                                title="Quick 1-Click Approve (48 Hours Access)"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Quick Approve</span>
                              </button>
                            )}
                            {req.status !== 'approved' && req.status !== 'pending' && (
                              <button
                                onClick={() => handleOpenApprove(req)}
                                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] transition cursor-pointer"
                              >
                                Approve
                              </button>
                            )}
                            {req.status === 'pending' && (
                              <button
                                onClick={() => handleOpenApprove(req)}
                                className="px-2 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-[11px] transition cursor-pointer"
                                title="Approve with custom duration"
                              >
                                Custom
                              </button>
                            )}
                            {req.status !== 'rejected' && (
                              <button
                                onClick={() => handleReject(req.id)}
                                className="px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-950 dark:hover:bg-rose-900 dark:text-rose-300 font-bold text-[11px] transition cursor-pointer"
                              >
                                Reject
                              </button>
                            )}
                            <button
                              onClick={() => {
                                if (confirm('Delete this request permanently?')) {
                                  deleteAccessRequest(req.id);
                                }
                              }}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 transition cursor-pointer"
                              title="Delete request"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-5 py-8 text-center text-slate-400 text-xs">
                        No requests found for the selected filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB: STUDENT-BY-STUDENT ACCESS & DOSSIER */}
      {activeSubTab === 'by-student' && (
        <AdminStudentPermissionsManager
          initialStudentId={selectedStudentForManager}
          onClose={() => setActiveSubTab('requests')}
        />
      )}

      {/* SUB-TAB 2: CLASS RECORDINGS MANAGER */}
      {activeSubTab === 'recordings' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500">
              Manage video archive links, lessons, durations, and attached PDF handouts.
            </p>
            <button
              onClick={() => handleOpenRecordingModal()}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Recording</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recordings.map((rec) => (
              <div
                key={rec.id}
                className="p-4 rounded-2xl bg-white dark:bg-[#0c101a] border border-slate-200 dark:border-blue-950 flex flex-col justify-between space-y-3"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-blue-600 dark:text-cyan-400">{rec.unitName}</span>
                    <span className="font-mono text-slate-400">{rec.batch}</span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white leading-snug">
                    {rec.title}
                  </h4>
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-1">
                    <span>{rec.date}</span>
                    <span>•</span>
                    <span>{rec.duration}</span>
                    <span>•</span>
                    <span>Expires in {rec.availableForDays}d</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    rec.isLockedForPhysical ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-500'
                  }`}>
                    {rec.isLockedForPhysical ? 'Physical Locked' : 'Open Access'}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenRecordingModal(rec)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-blue-500 transition cursor-pointer"
                      title="Edit recording"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete "${rec.title}" recording?`)) {
                          deleteRecording(rec.id);
                        }
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 transition cursor-pointer"
                      title="Delete recording"
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

      {/* SUB-TAB 3: ACCESS POLICIES */}
      {activeSubTab === 'policy' && (
        <div className="max-w-2xl p-6 rounded-3xl bg-white dark:bg-[#0c101a] border border-slate-200 dark:border-blue-950 space-y-6">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              Default Access Retention Rules
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Control how long students can view recordings after they are broadcasted.
            </p>
          </div>

          {policySavedMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{policySavedMsg}</span>
            </div>
          )}

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Online Students Recording Retention Window (Days)
              </label>
              <input
                type="number"
                min={1}
                max={90}
                value={tempPolicy.onlineStudentDays}
                onChange={(e) => setTempPolicy({ ...tempPolicy, onlineStudentDays: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Online learners will have access to replay videos for this number of days after class.
              </p>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Physical Students Default Approved Permission Window (Hours)
              </label>
              <input
                type="number"
                min={12}
                max={168}
                value={tempPolicy.defaultPhysicalApprovedHours}
                onChange={(e) => setTempPolicy({ ...tempPolicy, defaultPhysicalApprovedHours: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                When Sir approves a Physical student's request, their Zoom or replay access expires after these hours (e.g. 48 hours = 2 days).
              </p>
            </div>

            <button
              onClick={handleSavePolicy}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Policy Settings</span>
            </button>
          </div>
        </div>
      )}

      {/* APPROVAL DURATION MODAL */}
      {approvingReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md p-6 rounded-3xl bg-white dark:bg-[#0c101a] border border-blue-900 shadow-2xl space-y-4 text-xs">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Grant Permission: {approvingReq.studentName}
            </h3>
            <p className="text-slate-500">
              Session: <strong>{approvingReq.targetSessionTitle}</strong> ({approvingReq.type.replace('_', ' ')})
            </p>

            <div>
              <label className="block font-bold mb-1">How many hours should access remain active?</label>
              <div className="grid grid-cols-4 gap-2">
                {[24, 48, 72, 168].map((h) => (
                  <button
                    key={h}
                    type="button"
                    onClick={() => setApprovalHours(h)}
                    className={`py-2 rounded-xl border font-bold text-xs transition cursor-pointer ${
                      approvalHours === h
                        ? 'border-blue-600 bg-blue-600 text-white'
                        : 'border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900'
                    }`}
                  >
                    {h === 168 ? '7 Days' : `${h}h`}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-bold mb-1">Admin Note / Remark (Visible to student)</label>
              <input
                type="text"
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                placeholder="e.g. Approved for weekend recovery catch-up"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setApprovingReq(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmApproval}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
              >
                Confirm Approval
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RECORDING ADD/EDIT MODAL */}
      {isRecordingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-lg p-6 rounded-3xl bg-white dark:bg-[#0c101a] border border-blue-900 shadow-2xl space-y-4 text-xs max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {editingRecording ? 'Edit Class Recording' : 'Add New Class Recording'}
            </h3>

            <form onSubmit={handleSaveRecording} className="space-y-3">
              <div>
                <label className="block font-bold mb-1">Lesson / Topic Title *</label>
                <input
                  type="text"
                  required
                  value={recTitle}
                  onChange={(e) => setRecTitle(e.target.value)}
                  placeholder="e.g. Unit 3: Government Fiscal Policies & Inflation"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">Unit Name</label>
                  <input
                    type="text"
                    required
                    value={recUnit}
                    onChange={(e) => setRecUnit(e.target.value)}
                    placeholder="e.g. Unit 3: Economic Environment"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">Target Batch</label>
                  <select
                    value={recBatch}
                    onChange={(e) => setRecBatch(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-bold"
                  >
                    <option value="2027 Batch">2027 Batch</option>
                    <option value="2026 Batch">2026 Batch</option>
                    <option value="2028 Batch">2028 Batch</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">Broadcast Date</label>
                  <input
                    type="date"
                    value={recDate}
                    onChange={(e) => setRecDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">Duration</label>
                  <input
                    type="text"
                    value={recDuration}
                    onChange={(e) => setRecDuration(e.target.value)}
                    placeholder="e.g. 2 hrs 45 mins"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">Video Stream Embed / Cloud URL *</label>
                <input
                  type="text"
                  required
                  value={recVideoUrl}
                  onChange={(e) => setRecVideoUrl(e.target.value)}
                  placeholder="https://www.youtube.com/embed/... or Zoom recording link"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Attached PDF Tutes (One per line: "Title (Size)")</label>
                <textarea
                  rows={2}
                  value={recAttachedStr}
                  onChange={(e) => setRecAttachedStr(e.target.value)}
                  placeholder="Unit 3 Theory Handout.pdf (3.2 MB)"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsRecordingModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
                >
                  Save Recording
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
