import React, { createContext, useContext, useState, useEffect } from 'react';
import { StudentProfile, RegistrationPayload, RegisteredAccount } from '../types';
import { MOCK_STUDENT } from '../data/mockData';

interface AuthContextType {
  isLoggedIn: boolean;
  student: StudentProfile | null;
  isLoginModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  isDashboardOpen: boolean;
  openDashboard: () => void;
  closeDashboard: () => void;
  loginWithOtp: (identifier: string, otp: string) => Promise<boolean>;
  loginWithEmailPassword: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  registerStudent: (data: RegistrationPayload) => Promise<{ success: boolean; error?: string; student?: StudentProfile }>;
  logout: () => void;
}

const checkIsPhysical = (modeStr?: string): boolean => {
  if (!modeStr) return false;
  const m = modeStr.toLowerCase();
  return (
    m.includes('physical') ||
    m.includes('sasip') ||
    m.includes('rotary') ||
    m.includes('syzygy') ||
    m.includes('nugegoda') ||
    m.includes('gampaha')
  );
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [student, setStudent] = useState<StudentProfile | null>(() => {
    const saved = localStorage.getItem('sachii_student');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);

  useEffect(() => {
    if (student) {
      localStorage.setItem('sachii_student', JSON.stringify(student));
    } else {
      localStorage.removeItem('sachii_student');
    }
  }, [student]);

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  const openDashboard = () => setIsDashboardOpen(true);
  const closeDashboard = () => setIsDashboardOpen(false);

  const loginWithOtp = async (identifier: string, otp: string): Promise<boolean> => {
    // Strictly validate 6-digit OTP 123456
    if (otp.trim() === '123456') {
      const cleanId = identifier.trim().toLowerCase();
      const saved = localStorage.getItem('sachii_registered_students');
      const registered: RegisteredAccount[] = saved ? JSON.parse(saved) : [];
      
      const existing = registered.find(
        (u) => u.email.toLowerCase() === cleanId || u.indexNo.toLowerCase() === cleanId
      );

      if (existing) {
        const mode = existing.classMode || existing.deliveryMode || 'Online (Zoom)';
        const studentProfile: StudentProfile = {
          id: existing.id,
          name: `${existing.firstName} ${existing.lastName}`,
          indexNo: existing.indexNo,
          email: existing.email,
          phone: existing.whatsapp || existing.parentPhone,
          batch: existing.batch,
          hallLocation: mode,
          classOption: existing.classOption || existing.classModule,
          classMode: mode,
          isPhysical: checkIsPhysical(mode),
          attendanceRate: 100,
          enrolledBatches: [existing.classOption || existing.classModule || existing.batch],
          nextClassZoomLink: 'https://zoom.us/j/9876543210?pwd=CLASS_ACCESS',
          avatarUrl: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80`,
        };
        setStudent(studentProfile);
        setIsLoginModalOpen(false);
        setIsDashboardOpen(true);
        return true;
      } else if (cleanId.includes('@')) {
        // First-time verified student profile
        const studentProfile: StudentProfile = {
          id: `std-${Date.now()}`,
          name: cleanId.split('@')[0].toUpperCase(),
          indexNo: `BS-2027-${Math.floor(1000 + Math.random() * 9000)}`,
          email: cleanId,
          phone: '077 123 4567',
          batch: '2027 Batch',
          hallLocation: 'Online (with Zoom)',
          classOption: '2027 BS Theory (Comprehensive)',
          classMode: 'Online (with Zoom)',
          isPhysical: false,
          attendanceRate: 100,
          enrolledBatches: ['2027 BS Theory'],
          nextClassZoomLink: 'https://zoom.us/j/9876543210?pwd=CLASS_ACCESS',
          avatarUrl: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80`,
        };
        setStudent(studentProfile);
        setIsLoginModalOpen(false);
        setIsDashboardOpen(true);
        return true;
      }
    }
    return false;
  };

  const loginWithEmailPassword = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    
    // Check registered accounts
    const saved = localStorage.getItem('sachii_registered_students');
    const registered: RegisteredAccount[] = saved ? JSON.parse(saved) : [];
    
    const existing = registered.find((u) => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      if (existing.password === password) {
        const mode = existing.classMode || existing.deliveryMode || 'Online (Zoom)';
        const studentProfile: StudentProfile = {
          id: existing.id,
          name: `${existing.firstName} ${existing.lastName}`,
          indexNo: existing.indexNo,
          email: existing.email,
          phone: existing.whatsapp || existing.parentPhone,
          batch: existing.batch,
          hallLocation: mode,
          classOption: existing.classOption || existing.classModule,
          classMode: mode,
          isPhysical: checkIsPhysical(mode),
          attendanceRate: 100,
          enrolledBatches: [existing.classOption || existing.classModule || existing.batch],
          nextClassZoomLink: 'https://zoom.us/j/9876543210?pwd=CLASS_ACCESS',
          avatarUrl: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80`,
        };
        setStudent(studentProfile);
        setIsLoginModalOpen(false);
        return { success: true };
      } else {
        return { success: false, error: 'Invalid password. Please check your credentials.' };
      }
    }

    return { success: false, error: 'Account not found. Please click "Register Here" below to register.' };
  };

  const registerStudent = async (
    data: RegistrationPayload
  ): Promise<{ success: boolean; error?: string; student?: StudentProfile }> => {
    try {
      const cleanEmail = data.email.trim().toLowerCase();
      const saved = localStorage.getItem('sachii_registered_students');
      const registered: RegisteredAccount[] = saved ? JSON.parse(saved) : [];

      if (registered.some(u => u.email.toLowerCase() === cleanEmail)) {
        return { success: false, error: 'An account with this email address already exists. Please log in.' };
      }

      const year = data.batch.match(/\d{4}/)?.[0] || '2027';
      const randomId = Math.floor(1000 + Math.random() * 9000);
      const newAccount: RegisteredAccount = {
        ...data,
        id: `std-${Date.now()}`,
        indexNo: `BS-${year}-${randomId}`,
        createdAt: new Date().toISOString(),
        status: 'active',
        lastLogin: new Date().toISOString()
      };

      registered.push(newAccount);
      localStorage.setItem('sachii_registered_students', JSON.stringify(registered));

      const mode = newAccount.classMode || newAccount.deliveryMode || 'Online (with Zoom)';
      const newStudentProfile: StudentProfile = {
        id: newAccount.id,
        name: `${newAccount.firstName} ${newAccount.lastName}`,
        indexNo: newAccount.indexNo,
        email: newAccount.email,
        phone: newAccount.whatsapp,
        batch: newAccount.batch,
        hallLocation: mode,
        classOption: newAccount.classOption || newAccount.classModule,
        classMode: mode,
        isPhysical: checkIsPhysical(mode),
        attendanceRate: 100,
        enrolledBatches: [newAccount.classOption || newAccount.classModule || newAccount.batch],
        nextClassZoomLink: 'https://zoom.us/j/9876543210?pwd=CLASS_ACCESS',
        avatarUrl: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80`
      };

      setStudent(newStudentProfile);
      setIsLoginModalOpen(false);
      return { success: true, student: newStudentProfile };
    } catch (err: any) {
      return { success: false, error: err.message || 'Registration failed. Please try again.' };
    }
  };

  const logout = () => {
    setStudent(null);
    setIsDashboardOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!student,
        student,
        isLoginModalOpen,
        openLoginModal,
        closeLoginModal,
        isDashboardOpen,
        openDashboard,
        closeDashboard,
        loginWithOtp,
        loginWithEmailPassword,
        registerStudent,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
