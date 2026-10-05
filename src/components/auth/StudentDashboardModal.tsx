import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '../../context/AuthContext';
import {
  X,
  LogOut,
  Video,
  CheckCircle2,
  BookOpen,
  Calendar,
  Award,
  Download,
  MapPin,
  Truck,
  UploadCloud,
  FileCheck,
  PlayCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface StudentDashboardModalProps {
  onOpenSchedule: () => void;
  onOpenMaterials: () => void;
  onOpenZoom?: (sessionTitle?: string, batchName?: string) => void;
}

export const StudentDashboardModal: React.FC<StudentDashboardModalProps> = ({
  onOpenSchedule,
  onOpenMaterials,
  onOpenZoom,
}) => {
  const { student, isDashboardOpen, closeDashboard, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'courier' | 'recordings' | 'payments'>('overview');
  const [isSlipUploaded, setIsSlipUploaded] = useState(false);

  // Prevent body scrolling when modal is open
  useEffect(() => {
    if (isDashboardOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [isDashboardOpen]);

  if (!isDashboardOpen || !student) return null;
  if (typeof document === 'undefined') return null;

  const handleSlipUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIsSlipUploaded(true);
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    }
  };

  const handleLaunchZoom = () => {
    if (onOpenZoom) {
      closeDashboard();
      onOpenZoom("Calculus & Mechanics Session", "2025 Theory");
    } else {
      window.open(student.nextClassZoomLink, '_blank');
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] rounded-3xl bg-white dark:bg-[#0c101a] border border-blue-200 dark:border-blue-900/80 shadow-2xl flex flex-col overflow-hidden">
        {/* Top Gradient Banner */}
        <div className="relative h-28 bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-800 p-6 flex items-start justify-between shrink-0">
          <div className="flex items-center gap-2 text-white/90 text-xs font-bold uppercase tracking-wider">
            
            <span>Official Student LMS Portal</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={logout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/30 hover:bg-rose-600 text-white text-xs font-semibold backdrop-blur-md transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
            <button
              onClick={closeDashboard}
              className="p-1.5 rounded-lg bg-black/30 hover:bg-black/50 text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Container */}
        <div className="flex-1 overflow-y-auto px-6 sm:px-8 pb-8 -mt-10">
          {/* Profile Header Overlap */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-end gap-4">
              <div className="w-20 h-20 rounded-2xl border-4 border-white dark:border-[#0c101a] bg-blue-600 text-white text-2xl font-black flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0">
                {student.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-['Space_Grotesk']">
                    {student.name}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Active Student
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-2 flex-wrap">
                  <span>ID: <strong className="text-slate-700 dark:text-slate-200">{student.indexNo}</strong></span>
                  <span>•</span>
                  <span>{student.email}</span>
                </p>
              </div>
            </div>

            {/* Attendance Score Card */}
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 self-start sm:self-auto">
              <div className="text-right">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Attendance</span>
                <div className="text-lg font-black text-blue-600 dark:text-cyan-400">{student.attendanceRate}%</div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Quick Action: Live Zoom Session Access */}
          <div className="mt-6 p-5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg shadow-blue-600/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="p-3 rounded-xl bg-white/15 backdrop-blur-md shrink-0">
                <Video className="w-6 h-6 text-cyan-300" />
              </div>
              <div>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-cyan-400 text-slate-950 uppercase tracking-wider mb-1">
                  Active Live Stream Available
                </span>
                <h4 className="text-base font-bold">2025 Theory: Calculus & Mechanics Session</h4>
                <p className="text-xs text-blue-100 mt-0.5">Stream direct into in-app classroom or external Zoom</p>
              </div>
            </div>
            <button
              onClick={handleLaunchZoom}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-sm bg-white text-blue-700 hover:bg-blue-50 transition-colors shadow-md cursor-pointer shrink-0"
            >
              <Video className="w-4 h-4" />
              <span>Launch Live Class</span>
            </button>
          </div>

          {/* Navigation Sub-Tabs */}
          <div className="mt-8 flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 overflow-x-auto">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900'
              }`}
            >
              Overview & Batches
            </button>
            <button
              onClick={() => setActiveTab('courier')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'courier'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900'
              }`}
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Tute Courier Tracking</span>
            </button>
            <button
              onClick={() => setActiveTab('recordings')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'recordings'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900'
              }`}
            >
              <PlayCircle className="w-3.5 h-3.5" />
              <span>Video Recordings</span>
            </button>
            <button
              onClick={() => setActiveTab('payments')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'payments'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900'
              }`}
            >
              <FileCheck className="w-3.5 h-3.5" />
              <span>Slip Verification</span>
            </button>
          </div>

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Enrolled Batches */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-500" />
                    My Enrolled Batches
                  </h4>
                  <button
                    onClick={() => {
                      closeDashboard();
                      onOpenSchedule();
                    }}
                    className="text-xs font-semibold text-blue-600 dark:text-cyan-400 hover:underline cursor-pointer"
                  >
                    View Timetable
                  </button>
                </div>

                <div className="space-y-3">
                  {student.enrolledBatches.map((batchName, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-white dark:bg-[#0c101a] border border-slate-200 dark:border-slate-800 flex items-center justify-between"
                    >
                      <div>
                        <div className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-100">{batchName}</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5">
                          <MapPin className="w-3 h-3 text-rose-500" />
                          <span>{student.hallLocation}</span>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-cyan-300">
                        Enrolled
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tutes & Packs */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-cyan-500" />
                    Study Packs & Tutes
                  </h4>
                  <button
                    onClick={() => {
                      closeDashboard();
                      onOpenMaterials();
                    }}
                    className="text-xs font-semibold text-blue-600 dark:text-cyan-400 hover:underline cursor-pointer"
                  >
                    All Materials
                  </button>
                </div>

                <div className="space-y-2.5">
                  <div className="p-3 rounded-xl bg-white dark:bg-[#0c101a] border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-xs text-slate-800 dark:text-slate-100">
                        Calculus Module 04 (Special Student Pack)
                      </div>
                      <span className="text-[10px] text-slate-400">PDF • 5.2 MB • Oct 2024</span>
                    </div>
                    <button
                      onClick={() => alert('Downloading official student tutorial PDF...')}
                      className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-cyan-400 hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors cursor-pointer"
                      title="Download"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="p-3 rounded-xl bg-white dark:bg-[#0c101a] border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-xs text-slate-800 dark:text-slate-100">
                        Model Paper 08 Answer Script Discussion
                      </div>
                      <span className="text-[10px] text-slate-400">PDF • 7.8 MB • Marking Scheme</span>
                    </div>
                    <button
                      onClick={() => alert('Downloading marking scheme analysis...')}
                      className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-cyan-400 hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors cursor-pointer"
                      title="Download"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: COURIER TRACKING */}
          {activeTab === 'courier' && (
            <div className="mt-6 p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                    <Truck className="w-5 h-5 text-blue-500" />
                    Monthly Printed Tutorial Dispatch
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Track the physical delivery of your bound monthly tute pack to your home address
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                  Out For Delivery
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-[#0c101a] border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Courier Partner</span>
                    <strong className="text-slate-800 dark:text-slate-100">PromptX Logistics Sri Lanka</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Tracking Number</span>
                    <strong className="text-blue-600 dark:text-cyan-400 font-mono">PX-LK-9048122</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Delivery Location</span>
                    <strong className="text-slate-800 dark:text-slate-100">High Level Rd, Nugegoda</strong>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-3 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Package collected from institute printing press • Expected arrival today before 5:00 PM</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: RECORDINGS */}
          {activeTab === 'recordings' && (
            <div className="mt-6 space-y-3">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2 mb-2">
                <PlayCircle className="w-4 h-4 text-rose-500" />
                Latest 1080p Cloud Lesson Archives
              </h4>

              {[
                { title: "Calculus Marathon: Definite Integrals & Area Under Curves", date: "Sep 28, 2024", duration: "3h 45m" },
                { title: "Relative Velocity: River Crossing & Wind Speed Vector Triangles", date: "Sep 21, 2024", duration: "4h 10m" },
                { title: "Complex Numbers: De Moivre's Expansion & Cube Roots of Unity", date: "Sep 14, 2024", duration: "3h 20m" }
              ].map((rec, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-white dark:bg-[#0c101a] border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4"
                >
                  <div>
                    <h5 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">{rec.title}</h5>
                    <span className="text-[11px] text-slate-400">{rec.date} • {rec.duration} • 1080p HD</span>
                  </div>
                  <button
                    onClick={() => alert(`Starting video stream for: ${rec.title}`)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs bg-rose-600 hover:bg-rose-500 text-white transition-colors cursor-pointer shrink-0"
                  >
                    <PlayCircle className="w-3.5 h-3.5" />
                    <span>Watch</span>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: PAYMENTS & SLIP */}
          {activeTab === 'payments' && (
            <div className="mt-6 p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                    <FileCheck className="w-5 h-5 text-emerald-500" />
                    Monthly Class Fee & Admission Slip
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Upload your bank transfer slip or online receipt to keep your class admission card active
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  isSlipUploaded
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-cyan-300'
                }`}>
                  {isSlipUploaded ? 'Slip Verified & Card Active' : 'October Fee Due'}
                </span>
              </div>

              {isSlipUploaded ? (
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  <div>
                    <strong>Payment verified for October 2024!</strong>
                    <div className="text-slate-500 dark:text-slate-400 mt-0.5">
                      Your hall entry barcode and Zoom link access are unlocked until next month.
                    </div>
                  </div>
                </div>
              ) : (
                <label className="border-2 border-dashed border-blue-300 dark:border-blue-800/80 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50/50 dark:hover:bg-blue-950/20 transition-colors">
                  <UploadCloud className="w-8 h-8 text-blue-500 mb-2" />
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Click to select payment slip or screenshot (PDF, JPG, PNG)
                  </span>
                  <span className="text-[11px] text-slate-400 mt-1">Bank of Ceylon / Commercial Bank / Sampath Bank / Online App</span>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleSlipUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};
