import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, KeyRound, Mail, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { BorderGlow } from '../common/BorderGlow';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<'email' | 'otp' | 'success'>('email');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(60);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setStep('email');
      setEmail('');
      setOtp('');
      setNewPassword('');
      setConfirmPassword('');
      setError('');
      setCountdown(60);
    }
  }, [isOpen]);

  useEffect(() => {
    if (step === 'otp' && countdown > 0) {
      const timer = setInterval(() => setCountdown(c => c - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [step, countdown]);

  if (!isOpen) return null;
  if (typeof document === 'undefined') return null;

  const handleSendResetOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid registered email address.');
      return;
    }
    setError('');
    setStep('otp');
    setCountdown(60);
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp !== '123456') {
      setError('Invalid verification code. Please enter the valid 6-digit code (123456).');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    // Update in localStorage if registered
    const saved = localStorage.getItem('sachii_registered_students');
    if (saved) {
      try {
        const registered = JSON.parse(saved);
        const idx = registered.findIndex((u: any) => u.email.toLowerCase() === email.trim().toLowerCase());
        if (idx !== -1) {
          registered[idx].password = newPassword;
          localStorage.setItem('sachii_registered_students', JSON.stringify(registered));
        }
      } catch {
        // ignore
      }
    }

    setError('');
    setStep('success');
    setTimeout(() => {
      onSuccess();
      onClose();
    }, 1500);
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200">
      <BorderGlow borderRadius={24} glowRadius={35} className="w-full max-w-md">
        <div className="bg-white dark:bg-[#0c101a] border border-slate-200 dark:border-blue-900/60 rounded-[24px] shadow-2xl p-6 text-slate-800 dark:text-slate-100">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-200 dark:border-blue-800">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Reset Password
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Recover your student portal credentials
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {error && (
            <div className="mt-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {step === 'email' && (
            <form onSubmit={handleSendResetOtp} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Registered Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="student@example.com"
                    required
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md transition-colors btn-glow flex items-center justify-center gap-2"
              >
                <span>Send Reset OTP</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {step === 'otp' && (
            <form onSubmit={handleResetPassword} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  6-Digit Verification Code
                </label>
                <p className="text-[11px] text-slate-500 mb-2">Sent to {email}</p>
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="••••••"
                  required
                  className="w-full text-center font-mono text-lg tracking-widest py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>{countdown > 0 ? `Resend in ${countdown}s` : 'Resend available'}</span>
                {countdown === 0 && (
                  <button
                    type="button"
                    onClick={() => setCountdown(60)}
                    className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
                  >
                    Resend Code
                  </button>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md transition-colors btn-glow"
              >
                Update Password
              </button>
            </form>
          )}

          {step === 'success' && (
            <div className="py-8 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
              <h4 className="font-bold text-base text-slate-900 dark:text-white">
                Password Reset Successfully!
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                You can now log in using your new credentials.
              </p>
            </div>
          )}
        </div>
      </BorderGlow>
    </div>,
    document.body
  );
};
