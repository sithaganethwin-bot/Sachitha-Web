import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Radio,
  Video,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Send,
  Clock,
  ShieldCheck,
  Building2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { BorderGlow } from '../common/BorderGlow';

interface RequestAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultType?: 'live_zoom' | 'recording';
  targetRecordingId?: string;
  targetRecordingTitle?: string;
}

const COMMON_REASONS = [
  'Illness / Medical reason (Unable to travel)',
  'School sports meet / Inter-house event',
  'Transport / Bus disruption',
  'Distance / Bad weather condition',
  'Family emergency / Function',
  'Catch-up on missed physical theory'
];

export const RequestAccessModal: React.FC<RequestAccessModalProps> = ({
  isOpen,
  onClose,
  defaultType = 'live_zoom',
  targetRecordingId,
  targetRecordingTitle
}) => {
  const { student } = useAuth();
  const { submitAccessRequest, recordings, liveTickerConfig } = useData();

  // Prevent body scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;
  if (typeof document === 'undefined') return null;

  const [requestType, setRequestType] = useState<'live_zoom' | 'recording'>(defaultType);
  const [targetDate, setTargetDate] = useState(() => {
    const d = new Date();
    return d.toISOString().split('T')[0];
  });
  const [selectedSessionTitle, setSelectedSessionTitle] = useState(
    targetRecordingTitle ||
    (liveTickerConfig.isContinuousSession
      ? `${liveTickerConfig.subject || 'Live Masterclass'} (Continuous Theory + Paper Class)`
      : liveTickerConfig.subject || 'Upcoming Live Theory Masterclass')
  );
  const [reason, setReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen || !student) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const finalReason = reason === 'Other' ? customReason.trim() : (reason || customReason.trim());
    if (!finalReason) {
      setErrorMsg('Please select or specify a reason for requesting online access.');
      return;
    }

    submitAccessRequest({
      studentId: student.id,
      studentName: student.name,
      studentIndex: student.indexNo,
      batch: student.batch,
      type: requestType,
      targetDate,
      targetSessionTitle: selectedSessionTitle,
      recordingId: requestType === 'recording' ? targetRecordingId : undefined,
      reason: finalReason
    });

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 }
    });

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 2500);
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <BorderGlow
        borderRadius={24}
        glowRadius={30}
        className="w-full max-w-lg max-h-[92vh] flex flex-col"
        innerClassName="min-h-0 h-full flex flex-col"
      >
        <div className="bg-white dark:bg-[#0c101a] border border-slate-200 dark:border-blue-900/60 rounded-[24px] shadow-2xl flex flex-col h-full max-h-[92vh] min-h-0 overflow-hidden text-slate-800 dark:text-slate-100">
          
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-900/50 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-600 text-white flex items-center justify-center shadow-md">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white leading-tight">
                  Request Online Permission
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Physical student permission request directly to Sir
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 min-h-0 overflow-y-auto p-5 sm:p-6 space-y-4 text-xs sm:text-sm">
            {isSuccess ? (
              <div className="py-8 text-center space-y-3 animate-in fade-in zoom-in-95">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-500 mx-auto flex items-center justify-center border border-emerald-500/30">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                  Permission Request Sent!
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
                  Sir / Admin will review your request. Once approved, your online access will automatically unlock in your portal.
                </p>
              </div>
            ) : (
              <form id="access-request-form" onSubmit={handleSubmit} className="space-y-4">
                
                {/* Student Info Card */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-400 uppercase font-bold">Requesting Student</span>
                    <p className="font-bold text-slate-900 dark:text-white">{student.name}</p>
                    <p className="text-xs text-blue-600 dark:text-cyan-400 font-mono">{student.indexNo} • {student.batch}</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                      Physical Hall Student
                    </span>
                    <p className="text-[11px] text-slate-400 mt-1">{student.hallLocation}</p>
                  </div>
                </div>

                {errorMsg && (
                  <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Request Type Selector */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    What permission do you need? *
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setRequestType('live_zoom')}
                      className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition cursor-pointer ${
                        requestType === 'live_zoom'
                          ? 'border-blue-600 dark:border-cyan-400 bg-blue-50/60 dark:bg-blue-950/40 text-blue-900 dark:text-cyan-200 ring-2 ring-blue-500/20'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <Radio className="w-4 h-4 text-blue-600 dark:text-cyan-400 mt-0.5" />
                      <div>
                        <div className="font-bold text-xs">Live Zoom Access</div>
                        <div className="text-[11px] opacity-75">Attend class online today</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRequestType('recording')}
                      className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition cursor-pointer ${
                        requestType === 'recording'
                          ? 'border-blue-600 dark:border-cyan-400 bg-blue-50/60 dark:bg-blue-950/40 text-blue-900 dark:text-cyan-200 ring-2 ring-blue-500/20'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <Video className="w-4 h-4 text-blue-600 dark:text-cyan-400 mt-0.5" />
                      <div>
                        <div className="font-bold text-xs">Recording Replay</div>
                        <div className="text-[11px] opacity-75">Watch a missed class</div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Target Date & Session */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Session Date *
                    </label>
                    <div className="relative">
                      <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="date"
                        value={targetDate}
                        onChange={(e) => setTargetDate(e.target.value)}
                        required
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Target Class / Unit
                    </label>
                    <input
                      type="text"
                      value={selectedSessionTitle}
                      onChange={(e) => setSelectedSessionTitle(e.target.value)}
                      placeholder="e.g. Unit 3 Theory"
                      required
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                {/* Quick Select Reason */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Reason for Online Access *
                  </label>
                  <div className="space-y-1.5">
                    {COMMON_REASONS.map((r) => (
                      <label
                        key={r}
                        className={`flex items-center gap-2 p-2 rounded-lg border text-xs cursor-pointer transition ${
                          reason === r
                            ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 text-blue-950 dark:text-cyan-200 font-semibold'
                            : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="reasonRadio"
                          value={r}
                          checked={reason === r}
                          onChange={() => {
                            setReason(r);
                            setCustomReason('');
                          }}
                          className="w-3.5 h-3.5 text-blue-600"
                        />
                        <span>{r}</span>
                      </label>
                    ))}

                    <label
                      className={`flex items-center gap-2 p-2 rounded-lg border text-xs cursor-pointer transition ${
                        reason === 'Other'
                          ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 text-blue-950 dark:text-cyan-200 font-semibold'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="reasonRadio"
                        value="Other"
                        checked={reason === 'Other'}
                        onChange={() => setReason('Other')}
                        className="w-3.5 h-3.5 text-blue-600"
                      />
                      <span>Other (Please specify below)</span>
                    </label>
                  </div>
                </div>

                {(reason === 'Other' || !reason) && (
                  <div>
                    <textarea
                      rows={2}
                      value={customReason}
                      onChange={(e) => setCustomReason(e.target.value)}
                      placeholder="Explain your situation to Sir..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs text-slate-900 dark:text-white"
                    />
                  </div>
                )}

                <div className="p-3 rounded-xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/40 text-[11px] text-blue-800 dark:text-cyan-300 leading-relaxed flex items-start gap-2">
                  <Clock className="w-4 h-4 shrink-0 text-blue-600 mt-0.5" />
                  <span>
                    <strong>Note:</strong> Approved permission typically grants access for 48 hours to complete live streaming or view video replay.
                  </span>
                </div>
              </form>
            )}
          </div>

          {/* Footer */}
          {!isSuccess && (
            <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/60 flex items-center justify-between shrink-0">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="access-request-form"
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit to Sir</span>
              </button>
            </div>
          )}
        </div>
      </BorderGlow>
    </div>,
    document.body
  );
};
