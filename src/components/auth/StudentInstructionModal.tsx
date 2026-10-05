import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, FileText, CheckCircle2, Video, Package, HelpCircle, PhoneCall, Printer } from 'lucide-react';
import { BorderGlow } from '../common/BorderGlow';

interface StudentInstructionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StudentInstructionModal: React.FC<StudentInstructionModalProps> = ({
  isOpen,
  onClose,
}) => {
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

  const handlePrint = () => {
    window.print();
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200">
      <BorderGlow borderRadius={24} glowRadius={35} className="w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="bg-white dark:bg-[#0c101a] border border-slate-200 dark:border-blue-900/60 rounded-[24px] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden text-slate-800 dark:text-slate-100">
          {/* Header */}
          <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-900/50 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-200 dark:border-blue-800">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                  Student Instruction Sheet
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Official Guidelines for A/L Business Studies Student Portal
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Close instruction modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto space-y-6 text-sm leading-relaxed">
            {/* Section 1 */}
            <div className="space-y-2">
              <h4 className="font-bold text-blue-600 dark:text-cyan-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                1. Portal Account & Verification
              </h4>
              <p className="text-slate-600 dark:text-slate-300 pl-6">
                Your registered email address and 12-digit NIC will serve as your permanent Student Portal identity. Please verify your email with the 6-digit OTP code during registration. Keep your password confidential at all times.
              </p>
            </div>

            {/* Section 2 */}
            <div className="space-y-2">
              <h4 className="font-bold text-blue-600 dark:text-cyan-400 flex items-center gap-2">
                <Video className="w-4 h-4 shrink-0" />
                2. Live Zoom Classroom Access
              </h4>
              <ul className="text-slate-600 dark:text-slate-300 pl-6 list-disc space-y-1">
                <li>Join live classes 10 minutes prior to the scheduled start time.</li>
                <li>Your Zoom screen name MUST match your registered Student ID / Index No (e.g. <span className="font-mono font-semibold text-blue-700 dark:text-blue-300">BS-2027-1042 Kasun P.</span>).</li>
                <li>Live links and passcodes are strictly personalized; sharing will result in permanent account suspension.</li>
              </ul>
            </div>

            {/* Section 3 */}
            <div className="space-y-2">
              <h4 className="font-bold text-blue-600 dark:text-cyan-400 flex items-center gap-2">
                <Package className="w-4 h-4 shrink-0" />
                3. Printed Tutes & Courier Delivery
              </h4>
              <p className="text-slate-600 dark:text-slate-300 pl-6">
                Monthly theory packs and printed model papers are dispatched via registered domestic courier to your verified residential address before the 1st of each calendar month. Tracking numbers are updated in your Student Dashboard.
              </p>
            </div>

            {/* Section 4 */}
            <div className="space-y-2">
              <h4 className="font-bold text-blue-600 dark:text-cyan-400 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 shrink-0" />
                4. Monthly Class Fees & Slip Upload
              </h4>
              <p className="text-slate-600 dark:text-slate-300 pl-6">
                Upload your bank deposit / online transfer receipt before the 7th of every month under the "Payment Verification" tab on your student dashboard to maintain uninterrupted video archive access.
              </p>
            </div>

            {/* Support Box */}
            <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/60 flex items-start gap-3">
              <PhoneCall className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-blue-900 dark:text-blue-200">
                  Student Support Helpline & WhatsApp
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-300 mt-0.5">
                  Hotline: +94 77 123 4567 | WhatsApp: 077 123 4567 (Operating Mon – Sat: 8:00 AM – 7:00 PM)
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 flex items-center justify-between shrink-0">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              Print Instructions
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-colors"
            >
              I Understand & Close
            </button>
          </div>
        </div>
      </BorderGlow>
    </div>,
    document.body
  );
};
