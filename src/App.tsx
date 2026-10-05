import React, { useState } from 'react';
import { PageId } from './types';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { DataProvider, useData } from './context/DataContext';
import { CardNav } from './components/layout/CardNav';
import { Footer } from './components/layout/Footer';
import { Hero } from './components/home/Hero';
import { BatchesSection } from './components/home/BatchesSection';
import { WhyChooseSir } from './components/home/WhyChooseSir';
import { HallOfFame } from './components/home/HallOfFame';
import { Testimonials } from './components/home/Testimonials';
import { ClassScheduleView } from './components/schedule/ClassScheduleView';
import { AboutView } from './components/about/AboutView';
import { StudyMaterialsView } from './components/materials/StudyMaterialsView';
import { StudentLoginModal } from './components/auth/StudentLoginModal';
import { StudentDashboardModal } from './components/auth/StudentDashboardModal';
import { StudentLoginPage } from './components/auth/StudentLoginPage';
import { StudentDashboardPage } from './components/dashboard/StudentDashboardPage';
import { EnrollmentModal } from './components/common/EnrollmentModal';
import { LiveZoomModal } from './components/classroom/LiveZoomModal';
import { ZScoreCalculatorModal } from './components/calculator/ZScoreCalculatorModal';
import { WhatsAppFloatingButton } from './components/common/WhatsAppFloatingButton';
import { LenisScroller } from './components/common/LenisScroller';
import { MagneticCursor } from './components/common/MagneticCursor';
import { BackgroundTexture } from './components/common/BackgroundTexture';
import { ExplodedUnitBreakdown } from './components/home/ExplodedUnitBreakdown';
import { EditorialVideoCards } from './components/home/EditorialVideoCards';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { PhoneCall } from 'lucide-react';
import { useAuth } from './context/AuthContext';

const AppContent: React.FC = () => {
  const { openDashboard } = useAuth();
  const [currentPage, setCurrentPage] = useState<PageId>('home');
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [enrollBatchId, setEnrollBatchId] = useState<string | undefined>(undefined);

  // Live classroom state
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [zoomTitle, setZoomTitle] = useState('Business Studies – Beyond the Theory Masterclass');
  const [zoomBatch, setZoomBatch] = useState('2026 A/L Theory');

  // Z-Score calculator state
  const [isCalcOpen, setIsCalcOpen] = useState(false);

  // Dynamic shared data from CMS
  const { announcement, teacherInfo } = useData();

  const handleOpenEnroll = (batchId?: string) => {
    setEnrollBatchId(batchId);
    setIsEnrollModalOpen(true);
  };

  const handleOpenZoom = (title?: string, batch?: string) => {
    if (title) setZoomTitle(title);
    if (batch) setZoomBatch(batch);
    setIsZoomOpen(true);
  };

  const handleNavigate = (page: PageId) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (page === 'login') {
      window.history.pushState({}, '', '/login');
    } else if (page === 'dashboard') {
      window.history.pushState({}, '', '/dashboard');
    } else if (page === 'home') {
      if (window.location.pathname === '/login' || window.location.pathname === '/dashboard') {
        window.history.pushState({}, '', '/');
      }
    }
  };

  // Check for /admin, #admin, /login, or /dashboard URL access
  React.useEffect(() => {
    const hash = window.location.hash;
    const path = window.location.pathname;
    const search = window.location.search;

    if (path.startsWith('/admin') || search.includes('admin') || hash === '#admin') {
      setCurrentPage('admin');
      return;
    }
    if (path.startsWith('/login') || search.includes('login') || hash === '#login') {
      setCurrentPage('login');
    } else if (path.startsWith('/dashboard') || search.includes('dashboard') || hash === '#dashboard') {
      setCurrentPage('dashboard');
    }

    const handlePopState = () => {
      const currentHash = window.location.hash;
      const currentPath = window.location.pathname;
      if (currentPath.startsWith('/admin') || currentHash === '#admin') {
        setCurrentPage('admin');
      } else if (currentPath.startsWith('/login') || currentHash === '#login') {
        setCurrentPage('login');
      } else if (currentPath.startsWith('/dashboard') || currentHash === '#dashboard') {
        setCurrentPage('dashboard');
      } else {
        setCurrentPage('home');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return (
    <LenisScroller>
      {/* Magnetic custom cursor */}
      <MagneticCursor />

      <div className="min-h-screen flex flex-col bg-white text-[#161618] dark:bg-[#101012] dark:text-[#F7F5F0] transition-colors duration-500 relative">
        {/* Dynamic tactile background texture & atmospheric glow */}
        <BackgroundTexture />

        {/* Global Announcement bar & Navigation (Hidden on dedicated Student Dashboard & Admin) */}
        {currentPage !== 'dashboard' && currentPage !== 'admin' && (
          <>
            {/* Top micro announcement bar */}
            <div className="bg-[#161618] text-[#F7F5F0] dark:bg-black dark:text-slate-300 text-xs py-2 px-4 font-mono border-b border-slate-200/60 dark:border-white/10 relative z-30">
              <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-[11px]">
                <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#4338CA] text-white uppercase tracking-wider animate-pulse shrink-0">
                    OFFICIAL BULLETIN
                  </span>
                  <span className="truncate">{announcement}</span>
                </div>
                <div className="flex items-center gap-4 shrink-0 font-medium">
                  <a
                    href={`tel:${teacherInfo.contact.hotline.replace(/\s+/g, '')}`}
                    className="hidden md:flex items-center gap-1.5 hover:text-[#4338CA] dark:hover:text-cyan-300 transition-colors"
                  >
                    <PhoneCall className="w-3 h-3 text-[#4338CA] dark:text-cyan-400" />
                    <span>HOTLINE: {teacherInfo.contact.hotline}</span>
                  </a>
                  <button
                    onClick={() => handleOpenEnroll()}
                    className="hover:underline font-bold text-[#4338CA] dark:text-cyan-300 transition-colors cursor-pointer text-[11px]"
                  >
                    ENROLL ↗
                  </button>
                </div>
              </div>
            </div>

            {/* Floating Capsule Navigation */}
            <CardNav
              currentPage={currentPage}
              onNavigate={handleNavigate}
              onOpenEnroll={() => handleOpenEnroll()}
              onOpenZoom={() => handleOpenZoom()}
              onOpenCalculator={() => setIsCalcOpen(true)}
            />
          </>
        )}

        {/* Main Page Content */}
        <main className="flex-1 relative">
          {currentPage === 'home' && (
            <>
              <Hero
                onNavigate={handleNavigate}
                onOpenEnroll={() => handleOpenEnroll()}
                onOpenZoom={handleOpenZoom}
                onOpenCalculator={() => setIsCalcOpen(true)}
              />
              <ExplodedUnitBreakdown
                onOpenMaterials={() => handleNavigate('materials')}
              />
              <EditorialVideoCards
                onOpenZoom={() => handleOpenZoom()}
                onOpenEnroll={() => handleOpenEnroll()}
              />
              <BatchesSection
                onOpenEnroll={handleOpenEnroll}
                onNavigateToSchedule={() => handleNavigate('schedule')}
              />
              <WhyChooseSir />
              <HallOfFame />
              <Testimonials />
            </>
          )}

          {currentPage === 'schedule' && (
            <ClassScheduleView
              onOpenEnroll={() => handleOpenEnroll()}
              onOpenZoom={handleOpenZoom}
            />
          )}

          {currentPage === 'materials' && (
            <StudyMaterialsView />
          )}

          {currentPage === 'about' && (
            <AboutView onOpenEnroll={() => handleOpenEnroll()} />
          )}

          {currentPage === 'login' && (
            <StudentLoginPage
              onNavigateHome={() => handleNavigate('home')}
              onNavigateDashboard={() => {
                handleNavigate('dashboard');
              }}
            />
          )}

          {currentPage === 'dashboard' && (
            <StudentDashboardPage
              onNavigateHome={() => handleNavigate('home')}
              onOpenSchedule={() => handleNavigate('schedule')}
              onOpenMaterials={() => handleNavigate('materials')}
            />
          )}

          {currentPage === 'admin' && (
            <AdminDashboard onBackToSite={() => handleNavigate('home')} />
          )}
        </main>

        {/* Footer & Floating Speed Connect (Hidden on dedicated Student Dashboard & Admin) */}
        {currentPage !== 'dashboard' && currentPage !== 'admin' && (
          <>
            <Footer onNavigate={handleNavigate} />
            <WhatsAppFloatingButton />
          </>
        )}

      {/* Modals & Dialogs */}
      <StudentLoginModal />
      <StudentDashboardModal
        onOpenSchedule={() => handleNavigate('schedule')}
        onOpenMaterials={() => handleNavigate('materials')}
        onOpenZoom={handleOpenZoom}
      />
      <EnrollmentModal
        isOpen={isEnrollModalOpen}
        onClose={() => setIsEnrollModalOpen(false)}
        defaultBatchId={enrollBatchId}
      />
      <LiveZoomModal
        isOpen={isZoomOpen}
        onClose={() => setIsZoomOpen(false)}
        sessionTitle={zoomTitle}
        batchName={zoomBatch}
      />
      <ZScoreCalculatorModal
        isOpen={isCalcOpen}
        onClose={() => setIsCalcOpen(false)}
        onOpenEnroll={() => handleOpenEnroll()}
      />
      </div>
    </LenisScroller>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DataProvider>
          <AppContent />
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
