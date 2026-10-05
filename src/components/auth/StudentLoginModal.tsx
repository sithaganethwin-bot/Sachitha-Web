import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '../../context/AuthContext';
import {
  X,
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  AlertCircle,
  KeyRound,
  CheckCircle2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { BorderGlow } from '../common/BorderGlow';
import { StudentRegisterModal } from './StudentRegisterModal';

export const StudentLoginModal: React.FC = () => {
  const { isLoginModalOpen, closeLoginModal, openDashboard, loginWithOtp } = useAuth();

  const [step, setStep] = useState<'identifier' | 'otp'>('identifier');
  const [identifier, setIdentifier] = useState('');
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [errorMessage, setErrorMessage] = useState('');
  const [countdown, setCountdown] = useState(60);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Prevent body scrolling when modal is open
  useEffect(() => {
    if (isLoginModalOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [isLoginModalOpen]);

  // Reset state when modal opens
  useEffect(() => {
    if (isLoginModalOpen) {
      setStep('identifier');
      setOtpDigits(['', '', '', '', '', '']);
      setErrorMessage('');
      setCountdown(60);
    }
  }, [isLoginModalOpen]);

  // Countdown timer for OTP resend
  useEffect(() => {
    if (step === 'otp' && countdown > 0) {
      const timer = setInterval(() => setCountdown(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [step, countdown]);

  if (!isLoginModalOpen) return null;
  if (typeof document === 'undefined') return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setErrorMessage('Please enter your Student ID or Registered Email');
      return;
    }
    setErrorMessage('');
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setStep('otp');
      setCountdown(60);
      // Focus first OTP input
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    }, 600);
  };

  const handleDigitChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newDigits = [...otpDigits];
    newDigits[index] = value.slice(-1);
    setOtpDigits(newDigits);
    setErrorMessage('');

    // Auto focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto submit if all filled
    if (index === 5 && value) {
      const fullOtp = newDigits.join('');
      if (fullOtp.length === 6) {
        verifyCode(fullOtp);
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const verifyCode = async (codeToVerify?: string) => {
    const code = codeToVerify || otpDigits.join('');
    if (code.length !== 6) {
      setErrorMessage('Please enter all 6 digits of the verification code.');
      return;
    }

    setIsSubmitting(true);
    try {
      const success = await loginWithOtp(identifier, code);
      if (success) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } else {
        setErrorMessage('Invalid verification code. Please enter the valid 6-digit code (123456).');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <BorderGlow borderRadius={20} glowRadius={35} edgeSensitivity={20} className="w-full max-w-md shadow-2xl">
        <div className="relative w-full rounded-2xl overflow-hidden">
          {/* Top Header decoration */}
          <div className="h-2 w-full bg-gradient-to-r from-blue-600 via-cyan-400 to-indigo-600" />

          {/* Close Button */}
          <button
            onClick={closeLoginModal}
            className="absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer z-20"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

        <div className="p-6 sm:p-8">
          {/* Badge & Title */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-cyan-400 mb-3 shadow-inner">
              <KeyRound className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white font-['Space_Grotesk']">
              Student Portal Access
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Access live Zoom links, monthly tutorial PDFs, and individual attendance records
            </p>
          </div>

          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {step === 'identifier' ? (
            /* STEP 1: Email or Student ID Form */
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Student ID or Registered Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="e.g. SACHII-2025-4819 or your email"
                    className="w-full pl-10 pr-4 py-3 rounded-xl text-sm font-medium bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1.5 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  We protect your student account with 2-factor OTP verification
                </p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-500/25 transition-all cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>Request 6-Digit OTP</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            /* STEP 2: 6-Digit OTP Verification Screen */
            <div className="space-y-5">
              <div className="text-center">
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Verification code sent to{' '}
                  <span className="font-semibold text-slate-900 dark:text-white">{identifier}</span>
                </span>
                <button
                  onClick={() => setStep('identifier')}
                  className="block mx-auto text-xs text-blue-600 dark:text-cyan-400 font-semibold hover:underline mt-1 cursor-pointer"
                >
                  Change Email / ID
                </button>
              </div>

              {/* 6 Digit Input Boxes */}
              <div className="flex justify-center gap-2 sm:gap-2.5">
                {otpDigits.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => { inputRefs.current[index] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleDigitChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-11 h-14 sm:w-12 sm:h-14 text-center font-extrabold text-xl rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-cyan-400 shadow-sm"
                  />
                ))}
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
                <span>Didn't receive code?</span>
                {countdown > 0 ? (
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    Resend in {countdown}s
                  </span>
                ) : (
                  <button
                    onClick={() => {
                      setCountdown(60);
                      setOtpDigits(['', '', '', '', '', '']);
                      inputRefs.current[0]?.focus();
                    }}
                    className="font-bold text-blue-600 dark:text-cyan-400 hover:underline cursor-pointer"
                  >
                    Resend OTP Code
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() => verifyCode()}
                disabled={isSubmitting || otpDigits.join('').length !== 6}
                className="btn-glow w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-500/25 transition-all cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Verify & Enter Dashboard</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Register Link */}
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-center">
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  closeLoginModal();
                  setIsRegisterOpen(true);
                }}
                className="font-bold text-blue-600 dark:text-cyan-400 hover:underline cursor-pointer ml-1"
              >
                Register Here
              </button>
            </p>
          </div>

          {/* Footer note */}
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-center">
            <p className="text-[11px] text-slate-400">
              Need assistance with your student account? Contact helpline:{' '}
              <a href="tel:+94771234567" className="font-semibold text-blue-500 hover:underline">
                +94 77 123 4567
              </a>
            </p>
          </div>
        </div>
        </div>
      </BorderGlow>

      <StudentRegisterModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onSuccessRedirect={openDashboard}
      />
    </div>,
    document.body
  );
};
