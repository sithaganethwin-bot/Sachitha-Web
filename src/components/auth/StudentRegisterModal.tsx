import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Mail,
  Building2,
  MapPin,
  Phone,
  Lock,
  CheckCircle2,
  AlertCircle,
  Clock,
  ChevronDown,
  IdCard,
  Send,
  Check,
  GraduationCap,
  Layers,
  Radio,
  MapPinned,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { BorderGlow } from '../common/BorderGlow';
import { RegistrationPayload } from '../../types';

interface StudentRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessRedirect: () => void;
}

const SRI_LANKA_DISTRICTS = [
  'Colombo',
  'Gampaha',
  'Kalutara',
  'Kandy',
  'Matale',
  'Nuwara Eliya',
  'Galle',
  'Matara',
  'Hambantota',
  'Jaffna',
  'Kilinochchi',
  'Mannar',
  'Vavuniya',
  'Mullaitivu',
  'Batticaloa',
  'Ampara',
  'Trincomalee',
  'Kurunegala',
  'Puttalam',
  'Anuradhapura',
  'Polonnaruwa',
  'Badulla',
  'Monaragala',
  'Ratnapura',
  'Kegalle',
];

const POPULAR_SCHOOLS = [
  'Ananda College, Colombo',
  'Royal College, Colombo',
  'Nalanda College, Colombo',
  'Visakha Vidyalaya, Colombo',
  'Devi Balika Vidyalaya, Colombo',
  'Sirimavo Bandaranaike Vidyalaya, Colombo',
  'D.S. Senanayake College, Colombo',
  "St. Joseph's College, Colombo",
  "St. Peter's College, Colombo",
  'Musaeus College, Colombo',
  'Dharmaraja College, Kandy',
  'Kingswood College, Kandy',
  'Trinity College, Kandy',
  'Mahamaya Girls College, Kandy',
  'Mahinda College, Galle',
  'Richmond College, Galle',
  'Southlands College, Galle',
  'Rahula College, Matara',
  'Sujatha Vidyalaya, Matara',
  'Maliyadeva College, Kurunegala',
  'Maliyadeva Balika Vidyalaya, Kurunegala',
  'Central College, Jaffna',
  'Hindu College, Jaffna',
  'Bandarawela Central College',
  'St. Thomas College, Mount Lavinia',
];

const BATCH_LIST = ['2028 Batch', '2027 Batch', '2026 Batch'];

export const StudentRegisterModal: React.FC<StudentRegisterModalProps> = ({
  isOpen,
  onClose,
  onSuccessRedirect,
}) => {
  const { registerStudent } = useAuth();
  const { classOptions, classModes } = useData();

  // Active step (1 to 4)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1: Academic Enrollment Selection
  const [batch, setBatch] = useState('2027 Batch');
  const [classOption, setClassOption] = useState('');
  const [classMode, setClassMode] = useState('');

  // Step 2: Student Identity
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [nicNumber, setNicNumber] = useState('');
  const [school, setSchool] = useState('');
  const [schoolQuery, setSchoolQuery] = useState('');
  const [showSchoolDropdown, setShowSchoolDropdown] = useState(false);
  const [district, setDistrict] = useState('Colombo');

  // Step 3: Verified Contact & Courier Delivery
  const [email, setEmail] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [otpTimerSeconds, setOtpTimerSeconds] = useState(150); // 2:30 countdown
  const [otpError, setOtpError] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [street, setStreet] = useState('');
  const [area, setArea] = useState('');
  const [city, setCity] = useState('');

  // Step 4: Security Credentials
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Form State
  const [topError, setTopError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const schoolInputRef = useRef<HTMLInputElement>(null);

  // Filter dynamic class options based on selected batch
  const currentBatchOptions = classOptions.filter(
    (o) => o.batch === batch && o.isActive !== false
  );

  // Set default classOption when batch changes
  useEffect(() => {
    if (currentBatchOptions.length > 0) {
      setClassOption(currentBatchOptions[0].title);
    } else {
      setClassOption(`${batch} Standard Module`);
    }
  }, [batch, classOptions]);

  // Set default classMode from active modes
  useEffect(() => {
    const activeModes = classModes.filter((m) => m.isActive !== false);
    if (activeModes.length > 0 && !classMode) {
      setClassMode(activeModes[0].name);
    }
  }, [classModes, classMode]);

  // Reset or clear errors when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
      setTopError('');
      setOtpError('');
    }
  }, [isOpen]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [isOpen]);

  // Countdown timer for OTP
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isOtpSent && !isEmailVerified && otpTimerSeconds > 0) {
      interval = setInterval(() => {
        setOtpTimerSeconds((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isOtpSent, isEmailVerified, otpTimerSeconds]);

  if (!isOpen) return null;

  const formatCountdown = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleSendOtp = () => {
    if (!email.trim() || !email.includes('@')) {
      setTopError('Please enter a valid email address to receive your OTP code.');
      return;
    }
    setTopError('');
    setOtpError('');
    setIsOtpSent(true);
    setOtpTimerSeconds(150);
  };

  const handleVerifyOtp = () => {
    if (otpCode.trim() !== '123456') {
      setOtpError('Invalid OTP code. Please enter the valid 6-digit verification code.');
      return;
    }
    setOtpError('');
    setIsEmailVerified(true);
    setIsOtpSent(false);
  };

  const handleNicChange = (val: string) => {
    const cleaned = val.replace(/\D/g, '').slice(0, 12);
    setNicNumber(cleaned);
  };

  const filteredSchools = POPULAR_SCHOOLS.filter((s) =>
    s.toLowerCase().includes(schoolQuery.toLowerCase())
  );

  // Step 1 Validation
  const handleNextStep1 = () => {
    setTopError('');
    if (!batch) {
      setTopError('Please select your target A/L Batch.');
      return;
    }
    if (!classOption) {
      setTopError('Please select a Class Option.');
      return;
    }
    if (!classMode) {
      setTopError('Please select a Class Mode (Delivery location).');
      return;
    }
    setCurrentStep(2);
    const scrollEl = document.getElementById('reg-modal-scroll');
    if (scrollEl) scrollEl.scrollTop = 0;
  };

  // Step 2 Validation
  const handleNextStep2 = () => {
    setTopError('');
    if (!firstName.trim() || !lastName.trim()) {
      setTopError('Please provide both First Name and Last Name.');
      return;
    }
    if (nicNumber.length < 10 || nicNumber.length > 12) {
      setTopError('National Identity Card (NIC) number must be 10 to 12 digits.');
      return;
    }
    if (!school.trim()) {
      setTopError('Please specify your current school.');
      return;
    }
    if (!district) {
      setTopError('Please select your school/home district.');
      return;
    }
    setCurrentStep(3);
    const scrollEl = document.getElementById('reg-modal-scroll');
    if (scrollEl) scrollEl.scrollTop = 0;
  };

  // Step 3 Validation
  const handleNextStep3 = () => {
    setTopError('');
    if (!isEmailVerified) {
      setTopError('Please verify your email address with the OTP verification code.');
      return;
    }
    if (!whatsapp.trim() || whatsapp.trim().length < 9) {
      setTopError('Please provide a valid WhatsApp number.');
      return;
    }
    if (!parentPhone.trim() || parentPhone.trim().length < 9) {
      setTopError("Please provide a valid Parent/Guardian's contact phone number.");
      return;
    }
    if (!street.trim() || !area.trim() || !city.trim()) {
      setTopError('Please complete your courier postal address (Street, Area, City).');
      return;
    }
    setCurrentStep(4);
    const scrollEl = document.getElementById('reg-modal-scroll');
    if (scrollEl) scrollEl.scrollTop = 0;
  };

  // Final Submission
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setTopError('');

    if (!isEmailVerified) {
      setTopError('Please verify your email address before registering.');
      setCurrentStep(3);
      return;
    }

    if (password.length < 6) {
      setTopError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setTopError('Passwords do not match. Please re-check your password entry.');
      return;
    }

    setIsSubmitting(true);

    const payload: RegistrationPayload = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      school: school.trim(),
      district,
      whatsapp: whatsapp.trim(),
      parentPhone: parentPhone.trim(),
      address: {
        street: street.trim(),
        area: area.trim(),
        city: city.trim(),
      },
      batch,
      classOption,
      classMode,
      nicNumber,
      password,
    };

    const res = await registerStudent(payload);
    setIsSubmitting(false);

    if (res.success) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
      onClose();
      onSuccessRedirect();
    } else {
      setTopError(res.error || 'Registration failed. Please check your information.');
    }
  };

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
      data-lenis-prevent
      onWheel={(e) => e.stopPropagation()}
    >
      <BorderGlow
        borderRadius={24}
        glowRadius={35}
        className="w-full max-w-2xl max-h-[90vh] !flex !flex-col min-h-0"
        innerClassName="min-h-0 h-full !flex !flex-col overflow-hidden"
      >
        <div
          data-lenis-prevent
          className="bg-white dark:bg-[#0c101a] border border-slate-200 dark:border-blue-900/60 rounded-[24px] shadow-2xl flex flex-col h-full max-h-[90vh] min-h-0 overflow-hidden text-slate-800 dark:text-slate-100"
        >
          
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between bg-slate-50/80 dark:bg-slate-900/50 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-500/25">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white leading-tight">
                  Student Portal Registration
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Select your program and register for verified class access
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Stepper Progress Bar */}
          <div className="px-6 py-3 bg-slate-100/60 dark:bg-slate-950/60 border-b border-slate-200/80 dark:border-slate-800 shrink-0">
            <div className="flex items-center justify-between max-w-lg mx-auto">
              {[
                { num: 1, label: 'Program' },
                { num: 2, label: 'Identity' },
                { num: 3, label: 'Contact' },
                { num: 4, label: 'Security' },
              ].map((stepItem, idx) => {
                const isPassed = currentStep > stepItem.num;
                const isCurrent = currentStep === stepItem.num;
                return (
                  <React.Fragment key={stepItem.num}>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                          isPassed
                            ? 'bg-emerald-600 text-white'
                            : isCurrent
                            ? 'bg-blue-600 text-white ring-4 ring-blue-500/20 shadow-sm'
                            : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        {isPassed ? <Check className="w-4 h-4" /> : stepItem.num}
                      </div>
                      <span
                        className={`text-xs font-semibold hidden sm:inline ${
                          isCurrent
                            ? 'text-blue-600 dark:text-cyan-400 font-bold'
                            : isPassed
                            ? 'text-slate-700 dark:text-slate-300'
                            : 'text-slate-400 dark:text-slate-500'
                        }`}
                      >
                        {stepItem.label}
                      </span>
                    </div>

                    {idx < 3 && (
                      <div
                        className={`flex-1 h-0.5 mx-2 rounded transition-colors ${
                          currentStep > idx + 1
                            ? 'bg-emerald-500'
                            : 'bg-slate-200 dark:bg-slate-800'
                        }`}
                      />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* Form Scroll Area */}
          <div
            id="reg-modal-scroll"
            data-lenis-prevent
            onWheel={(e) => e.stopPropagation()}
            className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-5 sm:p-6 pb-10 space-y-4"
            style={{ overscrollBehavior: 'contain', WebkitOverflowScrolling: 'touch' }}
          >
            
            {/* Top Error Alert Banner */}
            {topError && (
              <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/70 border border-red-300 dark:border-red-800 text-red-700 dark:text-red-300 text-xs sm:text-sm font-medium flex items-start gap-2.5 shadow-sm animate-in fade-in slide-in-from-top-2 duration-200">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600 dark:text-red-400 mt-0.5" />
                <div className="flex-1">
                  <p className="font-bold">Action Required</p>
                  <p className="text-xs mt-0.5 leading-relaxed">{topError}</p>
                </div>
              </div>
            )}

            {/* STAGE 1: ACADEMIC PROGRAM & ENROLLMENT */}
            {currentStep === 1 && (
              <div className="space-y-4 pb-4 animate-in fade-in duration-200">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200/80 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                      1
                    </span>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider">
                      Academic Program & Enrollment
                    </h4>
                  </div>
                  <span className="text-xs text-blue-600 dark:text-cyan-400 font-semibold">
                    Step 1 of 4
                  </span>
                </div>

                {/* Batch Selection */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Select A/L Target Batch *
                  </label>
                  <div className="grid grid-cols-3 gap-2.5">
                    {BATCH_LIST.map((batchKey) => {
                      const isSelected = batch === batchKey;
                      const count = classOptions.filter(
                        (o) => o.batch === batchKey && o.isActive !== false
                      ).length;
                      return (
                        <div
                          key={batchKey}
                          onClick={() => setBatch(batchKey)}
                          className={`p-2.5 sm:p-3 rounded-xl border text-left cursor-pointer transition ${
                            isSelected
                              ? 'border-blue-600 dark:border-cyan-400 bg-blue-50/50 dark:bg-blue-950/40 shadow-sm ring-2 ring-blue-500/20'
                              : 'border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950 hover:border-slate-300 dark:hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                              {batchKey}
                            </span>
                            <span
                              className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                                isSelected
                                  ? 'border-blue-600 bg-blue-600 text-white'
                                  : 'border-slate-300 dark:border-slate-700'
                              }`}
                            >
                              {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                            </span>
                          </div>
                          <p className="text-[11px] text-blue-600 dark:text-cyan-400 font-semibold mt-1">
                            {count} {count === 1 ? 'Option' : 'Options'} Available
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Class Option */}
                <div className="p-3 rounded-xl bg-slate-50/60 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />
                      <span>Class Option *</span>
                      <span className="text-slate-400 font-normal">({batch})</span>
                    </label>
                    <span className="text-[10px] text-slate-400 uppercase font-mono">
                      CMS MANAGED
                    </span>
                  </div>

                  <div className="space-y-2">
                    {currentBatchOptions.length > 0 ? (
                      currentBatchOptions.map((opt) => {
                        const isChosen = classOption === opt.title;
                        return (
                          <label
                            key={opt.id}
                            className={`flex items-start gap-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition ${
                              isChosen
                                ? 'border-blue-600 dark:border-cyan-400 bg-blue-50/60 dark:bg-blue-950/40 text-blue-950 dark:text-cyan-100 font-medium ring-1 ring-blue-500/30'
                                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                            }`}
                          >
                            <input
                              type="radio"
                              name="classOption"
                              value={opt.title}
                              checked={isChosen}
                              onChange={(e) => setClassOption(e.target.value)}
                              className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-slate-300 dark:border-slate-700 mt-0.5"
                            />
                            <div className="flex-1">
                              <div className="flex items-center justify-between gap-2">
                                <span className="font-bold text-slate-900 dark:text-white">
                                  {opt.title}
                                </span>
                                {opt.badge && (
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-cyan-300 shrink-0">
                                    {opt.badge}
                                  </span>
                                )}
                              </div>
                              {opt.description && (
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                                  {opt.description}
                                </p>
                              )}
                            </div>
                          </label>
                        );
                      })
                    ) : (
                      <div className="p-3 text-center text-xs text-slate-500">
                        Standard {batch} program selected.
                      </div>
                    )}
                  </div>
                </div>

                {/* Class Mode */}
                <div className="space-y-2 pb-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Radio className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />
                      <span>Class Mode *</span>
                    </label>
                    <span className="text-[10px] text-slate-400 uppercase font-mono">
                      CMS MANAGED
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {classModes
                      .filter((m) => m.isActive !== false)
                      .map((mode) => {
                        const isSelected = classMode === mode.name;
                        return (
                          <label
                            key={mode.id}
                            className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition ${
                              isSelected
                                ? 'border-blue-600 dark:border-cyan-400 bg-blue-50/70 dark:bg-blue-950/50 text-blue-900 dark:text-cyan-200 font-bold ring-1 ring-blue-500/20'
                                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                            }`}
                          >
                            <input
                              type="radio"
                              name="classMode"
                              value={mode.name}
                              checked={isSelected}
                              onChange={(e) => setClassMode(e.target.value)}
                              className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="truncate">{mode.name}</span>
                          </label>
                        );
                      })}
                  </div>
                </div>
              </div>
            )}

            {/* STAGE 2: STUDENT IDENTITY */}
            {currentStep === 2 && (
              <div className="space-y-4 pb-4 animate-in fade-in duration-200">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200/80 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                      2
                    </span>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider">
                      Student Identity & Academic Profile
                    </h4>
                  </div>
                  <span className="text-xs text-blue-600 dark:text-cyan-400 font-semibold">
                    Step 2 of 4
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      First Name *
                    </label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="e.g. Sithaga"
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="e.g. Perera"
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 outline-none transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    National Identity Card (NIC) *
                  </label>
                  <div className="relative">
                    <IdCard className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={nicNumber}
                      onChange={(e) => handleNicChange(e.target.value)}
                      placeholder="Enter 10 to 12 digit NIC number"
                      maxLength={12}
                      required
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 outline-none transition font-mono"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Enter standard 10–12 digit national identity card number (no photo upload required).
                  </p>
                </div>

                <div className="relative">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Current School *
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      ref={schoolInputRef}
                      type="text"
                      value={school}
                      onChange={(e) => {
                        setSchool(e.target.value);
                        setSchoolQuery(e.target.value);
                        setShowSchoolDropdown(true);
                      }}
                      onFocus={() => setShowSchoolDropdown(true)}
                      placeholder="Type or select your school..."
                      required
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 outline-none transition"
                    />
                  </div>

                  {showSchoolDropdown && filteredSchools.length > 0 && (
                    <div className="absolute z-20 left-0 right-0 mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl max-h-40 overflow-y-auto">
                      {filteredSchools.map((sch) => (
                        <div
                          key={sch}
                          onClick={() => {
                            setSchool(sch);
                            setShowSchoolDropdown(false);
                          }}
                          className="px-3.5 py-2 text-xs text-slate-800 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-blue-950/60 cursor-pointer transition flex items-center justify-between"
                        >
                          <span>{sch}</span>
                          {school === sch && <Check className="w-3.5 h-3.5 text-blue-600" />}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    District *
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <select
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full pl-10 pr-8 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition appearance-none cursor-pointer"
                    >
                      {SRI_LANKA_DISTRICTS.map((dist) => (
                        <option key={dist} value={dist}>
                          {dist} District
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-3 pointer-events-none" />
                  </div>
                </div>
              </div>
            )}

            {/* STAGE 3: VERIFIED CONTACT & COURIER DELIVERY */}
            {currentStep === 3 && (
              <div className="space-y-4 pb-4 animate-in fade-in duration-200">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200/80 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                      3
                    </span>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider">
                      Verified Contact & Courier Delivery
                    </h4>
                  </div>
                  <span className="text-xs text-blue-600 dark:text-cyan-400 font-semibold">
                    Step 3 of 4
                  </span>
                </div>

                {/* Email Verification Box */}
                <div className="p-3.5 rounded-xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />
                      <span>Student Email Verification *</span>
                    </label>
                    {isEmailVerified && (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Verified
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="email"
                      value={email}
                      disabled={isEmailVerified}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="student@example.com"
                      className="flex-1 px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 outline-none transition disabled:opacity-75"
                    />
                    {!isEmailVerified && (
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition flex items-center gap-1.5 cursor-pointer shrink-0"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{isOtpSent ? 'Resend' : 'Send Code'}</span>
                      </button>
                    )}
                  </div>

                  {/* OTP Entry Box */}
                  {isOtpSent && !isEmailVerified && (
                    <div className="p-3 rounded-lg bg-white dark:bg-slate-950 border border-blue-200 dark:border-blue-900/60 space-y-2">
                      <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                        <span>Enter 6-digit verification code sent to your email:</span>
                        <span className="font-mono font-bold text-blue-600 dark:text-cyan-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatCountdown(otpTimerSeconds)}
                        </span>
                      </div>

                      <div className="flex gap-2">
                        <input
                          type="text"
                          maxLength={6}
                          value={otpCode}
                          onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                          placeholder="123456"
                          className="flex-1 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-center tracking-widest font-mono text-base font-bold bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                        <button
                          type="button"
                          onClick={handleVerifyOtp}
                          className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition cursor-pointer"
                        >
                          Verify
                        </button>
                      </div>

                      {otpError && (
                        <p className="text-xs text-red-500 font-medium">{otpError}</p>
                      )}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Student WhatsApp Number *
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="tel"
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value)}
                        placeholder="077 123 4567"
                        required
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 outline-none transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Parent / Guardian Phone *
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="tel"
                        value={parentPhone}
                        onChange={(e) => setParentPhone(e.target.value)}
                        placeholder="071 987 6543"
                        required
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 outline-none transition"
                      />
                    </div>
                  </div>
                </div>

                {/* Courier Delivery Address */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <MapPinned className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />
                      <span>Courier Delivery Address (For Monthly Tutes & Materials) *</span>
                    </label>
                  </div>

                  <input
                    type="text"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder="House No, Street Name / Road (e.g. 45/2, Temple Road)"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 outline-none transition"
                  />

                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      placeholder="Area / Town (e.g. Nugegoda)"
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 outline-none transition"
                    />
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="City / Postal City (e.g. Colombo)"
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 outline-none transition"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STAGE 4: PORTAL CREDENTIALS & SECURITY */}
            {currentStep === 4 && (
              <div className="space-y-4 pb-4 animate-in fade-in duration-200">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200/80 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                      4
                    </span>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider">
                      Portal Credentials & Verification
                    </h4>
                  </div>
                  <span className="text-xs text-blue-600 dark:text-cyan-400 font-semibold">
                    Step 4 of 4
                  </span>
                </div>

                {/* Password Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Create Password *
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="At least 6 characters"
                        required
                        className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 outline-none transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Confirm Password *
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-type password"
                        required
                        className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl border ${
                          confirmPassword && password !== confirmPassword
                            ? 'border-red-500 dark:border-red-500 focus:ring-red-400'
                            : 'border-slate-300 dark:border-slate-700 focus:ring-blue-500'
                        } bg-white dark:bg-slate-950 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none transition`}
                      />
                    </div>
                    {confirmPassword && password !== confirmPassword && (
                      <p className="text-xs text-red-500 font-medium mt-1">
                        Passwords do not match
                      </p>
                    )}
                  </div>
                </div>

                {/* Review Summary Card */}
                <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-900 dark:text-cyan-300 uppercase tracking-wider">
                      Registration Summary
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                      Email Verified
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-blue-100 dark:border-blue-900/40">
                    <div>
                      <span className="text-slate-400">Student:</span>{' '}
                      <span className="font-bold text-slate-900 dark:text-white">
                        {firstName} {lastName}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400">Target Batch:</span>{' '}
                      <span className="font-bold text-blue-600 dark:text-cyan-400">{batch}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Class Option:</span>{' '}
                      <span className="font-bold text-slate-800 dark:text-slate-200">{classOption}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Delivery Mode:</span>{' '}
                      <span className="font-bold text-slate-800 dark:text-slate-200">{classMode}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-slate-400">Courier Destination:</span>{' '}
                      <span className="font-medium text-slate-800 dark:text-slate-200">
                        {street}, {area}, {city} ({district} District)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Modal Actions Footer */}
          <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-900/60 flex items-center justify-between shrink-0">
            {currentStep === 1 ? (
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                Cancel
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setTopError('');
                  setCurrentStep((prev) => (prev > 1 ? ((prev - 1) as any) : 1));
                  const scrollEl = document.getElementById('reg-modal-scroll');
                  if (scrollEl) scrollEl.scrollTop = 0;
                }}
                className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            )}

            {currentStep === 1 && (
              <button
                type="button"
                onClick={handleNextStep1}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer"
              >
                <span>Continue to Step 2</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            {currentStep === 2 && (
              <button
                type="button"
                onClick={handleNextStep2}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer"
              >
                <span>Continue to Step 3</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            {currentStep === 3 && (
              <button
                type="button"
                onClick={handleNextStep3}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer"
              >
                <span>Continue to Step 4</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            {currentStep === 4 && (
              <button
                type="button"
                onClick={() => handleSubmit()}
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 hover:from-blue-800 hover:to-indigo-800 text-white font-bold text-xs shadow-md transition flex items-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                
                <span>{isSubmitting ? 'Registering...' : 'Register Student'}</span>
              </button>
            )}
          </div>
        </div>
      </BorderGlow>
    </div>,
    document.body
  );
};
