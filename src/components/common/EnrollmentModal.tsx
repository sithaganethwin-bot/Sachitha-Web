import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, CheckCircle2, Send, GraduationCap } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useData } from '../../context/DataContext';
import { BorderGlow } from './BorderGlow';

interface EnrollmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultBatchId?: string;
}

export const EnrollmentModal: React.FC<EnrollmentModalProps> = ({
  isOpen,
  onClose,
  defaultBatchId,
}) => {
  const { batches, addEnrollment } = useData();
  const [studentName, setStudentName] = useState('');
  const [phone, setPhone] = useState('');
  const [school, setSchool] = useState('');
  const [selectedBatch, setSelectedBatch] = useState(defaultBatchId || batches[0]?.id || '');
  const [mode, setMode] = useState<'physical' | 'online'>('physical');
  const [location, setLocation] = useState('Rotary Nugegoda');
  const [isSubmitted, setIsSubmitted] = useState(false);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName || !phone) return;

    const matchedBatch = batches.find((b) => b.id === selectedBatch);
    const title = matchedBatch ? `${matchedBatch.title} (${matchedBatch.grade})` : selectedBatch;

    addEnrollment({
      studentName,
      phone,
      school: school || 'Not specified',
      batchId: selectedBatch,
      batchTitle: title,
      mode,
      location: mode === 'physical' ? location : 'Zoom Online Portal'
    });

    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.6 }
    });

    setIsSubmitted(true);
  };

  const handleClose = () => {
    setIsSubmitted(false);
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200">
      <BorderGlow borderRadius={24} glowRadius={35} edgeSensitivity={20} className="w-full max-w-lg shadow-2xl">
        <div className="relative w-full rounded-3xl overflow-hidden">
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer z-20"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

        {isSubmitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white font-['Space_Grotesk']">
              Enrollment Received!
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 max-w-sm mx-auto">
              Thank you, <strong className="text-blue-600 dark:text-cyan-400">{studentName}</strong>! Our class coordination team will contact you via WhatsApp / SMS within 2 hours with your temporary Student ID and class admission pass.
            </p>
            <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-xs text-left space-y-1.5 text-slate-600 dark:text-slate-300">
              <div><strong>Batch:</strong> {batches.find(b => b.id === selectedBatch)?.title || selectedBatch}</div>
              <div><strong>Mode:</strong> {mode === 'physical' ? `Physical (${location})` : 'Online HD Zoom Stream'}</div>
              <div><strong>Contact Number:</strong> {phone}</div>
            </div>
            <button
              onClick={handleClose}
              className="w-full py-3.5 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 shadow-md transition-colors cursor-pointer"
            >
              Done & Return to Website
            </button>
          </div>
        ) : (
          <div className="p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-cyan-400 flex items-center justify-center">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white font-['Space_Grotesk']">
                  2025/2026 Batch Enrollment
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Fill in your details to secure your admission
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name of Student *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kasun Chamara Bandara"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    WhatsApp Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="077 123 4567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    School / College
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Royal College"
                    value={school}
                    onChange={(e) => setSchool(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Select Batch *
                </label>
                <select
                  value={selectedBatch}
                  onChange={(e) => setSelectedBatch(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {batches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.title} ({b.fee})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Delivery Mode
                  </label>
                  <select
                    value={mode}
                    onChange={(e) => setMode(e.target.value as 'physical' | 'online')}
                    className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="physical">Physical Hall</option>
                    <option value="online">Online Zoom Live</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Preferred Center
                  </label>
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    disabled={mode === 'online'}
                    className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    <option value="Rotary Nugegoda">Rotary - Nugegoda</option>
                    <option value="Siyatha Gampaha">Siyatha - Gampaha</option>
                    <option value="Syzygy Kandy">Syzygy - Kandy</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="btn-glow w-full mt-2 flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-500/25 transition-all cursor-pointer"
              >
                
                <span>Confirm Batch Enrollment</span>
              </button>
            </form>
          </div>
        )}
        </div>
      </BorderGlow>
    </div>,
    document.body
  );
};
