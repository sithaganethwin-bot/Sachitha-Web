import React, { useState } from 'react';
import {
  ShieldCheck,
  Mail,
  Lock,
  ArrowRight,
  ArrowLeft,
  FileText,
  AlertCircle,
  KeyRound
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../../context/AuthContext';
import { BorderGlow } from '../common/BorderGlow';
import { StudentRegisterModal } from './StudentRegisterModal';
import { StudentInstructionModal } from './StudentInstructionModal';
import { ForgotPasswordModal } from './ForgotPasswordModal';

interface StudentLoginPageProps {
  onNavigateHome: () => void;
  onNavigateDashboard: () => void;
}

export const StudentLoginPage: React.FC<StudentLoginPageProps> = ({
  onNavigateHome,
  onNavigateDashboard,
}) => {
  const { loginWithEmailPassword } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Modals state
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isInstructionOpen, setIsInstructionOpen] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim() || !password) {
      setErrorMessage('Please enter both your email address and password.');
      return;
    }

    setIsLoading(true);
    const result = await loginWithEmailPassword(email, password);
    setIsLoading(false);

    if (result.success) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
      });
      onNavigateDashboard();
    } else {
      setErrorMessage(result.error || 'Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-transparent transition-colors duration-300">
      {/* Top Navigation Row: ← Home */}
      <div className="w-full max-w-md mb-6 flex items-center justify-between">
        <button
          onClick={onNavigateHome}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Home</span>
        </button>
        <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">
          Portal v2.6
        </span>
      </div>

      {/* Centered Auth Card */}
      <div className="w-full max-w-md">
        <BorderGlow borderRadius={24} glowRadius={38} className="w-full">
          <div className="bg-white dark:bg-[#0c101a] border border-slate-200 dark:border-blue-900/60 rounded-2xl p-6 sm:p-8 shadow-xl text-slate-900 dark:text-white">
            {/* Header Elements */}
            <div className="text-center mb-6">
              {/* Centered shield/user avatar icon inside a rounded square badge */}
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-cyan-400 border border-blue-200 dark:border-blue-800 shadow-md mb-3">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Welcome Back
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Sign in to your account
              </p>
            </div>

            {/* Error Message Alert */}
            {errorMessage && (
              <div className="mb-5 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-red-600 dark:text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Login Input Fields */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 outline-none transition"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsForgotPasswordOpen(true)}
                    className="text-xs font-medium text-blue-600 dark:text-cyan-400 hover:underline cursor-pointer"
                  >
                    Forgot Password
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 outline-none transition"
                  />
                </div>
              </div>

              {/* Sign In Action Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 hover:from-blue-800 hover:to-indigo-800 text-white font-bold text-sm shadow-md transition btn-glow flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span>{isLoading ? 'Signing In...' : 'Sign In →'}</span>
              </button>
            </form>

            {/* Bottom Links */}
            <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 text-center space-y-3">
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setIsRegisterOpen(true)}
                  className="font-bold text-blue-600 dark:text-cyan-400 hover:underline cursor-pointer ml-1"
                >
                  Register Here
                </button>
              </p>

              <div>
                <button
                  type="button"
                  onClick={() => setIsInstructionOpen(true)}
                  className="inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>📄 Read Student Instruction Sheet</span>
                </button>
              </div>
            </div>
          </div>
        </BorderGlow>
      </div>

      {/* Registration Modal */}
      <StudentRegisterModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onSuccessRedirect={onNavigateDashboard}
      />

      {/* Student Instruction Sheet Modal */}
      <StudentInstructionModal
        isOpen={isInstructionOpen}
        onClose={() => setIsInstructionOpen(false)}
      />

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={isForgotPasswordOpen}
        onClose={() => setIsForgotPasswordOpen(false)}
        onSuccess={() => {
          setEmail('');
          setPassword('');
          setErrorMessage('');
        }}
      />
    </div>
  );
};
