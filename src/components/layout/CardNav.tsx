import React, { useEffect, useRef, useState, useMemo } from 'react';
import { gsap } from 'gsap';
import { ArrowUpRight, GraduationCap, Sun, Moon, LogIn } from 'lucide-react';
import { PageId } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import './CardNav.css';

export interface CardNavLink {
  label: string;
  ariaLabel?: string;
  onClick: () => void;
}

export interface CardNavItem {
  label: string;
  bgColor: string;
  textColor: string;
  links: CardNavLink[];
}

interface CardNavProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
  onOpenEnroll: () => void;
  onOpenZoom?: () => void;
  onOpenCalculator?: () => void;
  className?: string;
  ease?: string;
}

export const CardNav: React.FC<CardNavProps> = ({
  currentPage,
  onNavigate,
  onOpenEnroll,
  onOpenZoom,
  onOpenCalculator,
  className = '',
  ease = 'power3.out',
}) => {
  const { theme, toggleTheme } = useTheme();
  const { isLoggedIn, student, openLoginModal, openDashboard } = useAuth();

  const [isExpanded, setIsExpanded] = useState(false);
  const isPinnedRef = useRef(false);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navRef = useRef<HTMLElement | null>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  const handleLinkClick = (action: () => void) => {
    action();
    isPinnedRef.current = false;
    setIsExpanded(false);
  };

  const handleMouseEnter = () => {
    if (typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches) {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
        hoverTimeoutRef.current = null;
      }
      setIsExpanded(true);
    }
  };

  const handleMouseLeave = () => {
    if (typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches) {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      hoverTimeoutRef.current = setTimeout(() => {
        if (!isPinnedRef.current) {
          setIsExpanded(false);
        }
      }, 280);
    }
  };

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  // 3 Rich Cards:
  // Card 1: Home & Schedule
  // Card 2: Study Materials
  // Card 3: About Sir & Mentorship (Placed AFTER Study Materials as requested)
  const items: CardNavItem[] = useMemo(() => [
    {
      label: "Class & Schedule",
      bgColor: theme === 'dark' ? "rgba(20, 20, 26, 0.65)" : "rgba(255, 255, 255, 0.7)",
      textColor: theme === 'dark' ? "#F7F5F0" : "#161618",
      links: [
        {
          label: "Home & Announcements",
          ariaLabel: "Navigate to Home",
          onClick: () => handleLinkClick(() => onNavigate('home'))
        },
        {
          label: "Class Schedule & Timetable",
          ariaLabel: "View Class Schedule",
          onClick: () => handleLinkClick(() => onNavigate('schedule'))
        },
        {
          label: "Live Zoom Classroom",
          ariaLabel: "Join Live Zoom Class",
          onClick: () => handleLinkClick(() => onOpenZoom && onOpenZoom())
        }
      ]
    },
    {
      label: "Study Materials",
      bgColor: theme === 'dark' ? "rgba(28, 28, 36, 0.6)" : "rgba(248, 250, 252, 0.65)",
      textColor: theme === 'dark' ? "#F7F5F0" : "#161618",
      links: [
        {
          label: "All Study Materials & Tutes",
          ariaLabel: "View Study Materials",
          onClick: () => handleLinkClick(() => onNavigate('materials'))
        },
        {
          label: "Theory Derivations & Modules",
          ariaLabel: "Theory Modules",
          onClick: () => handleLinkClick(() => onNavigate('materials'))
        },
        {
          label: "Past Papers & Model Papers",
          ariaLabel: "Past Papers Bank",
          onClick: () => handleLinkClick(() => onNavigate('materials'))
        }
      ]
    },
    {
      label: "About Sir & Class",
      bgColor: theme === 'dark' ? "rgba(34, 34, 44, 0.55)" : "rgba(241, 245, 249, 0.65)",
      textColor: theme === 'dark' ? "#F7F5F0" : "#161618",
      links: [
        {
          label: "About Sachitha Sankalpa (BS Specialist)",
          ariaLabel: "About Sir",
          onClick: () => handleLinkClick(() => onNavigate('about'))
        },
        {
          label: "Beyond the Theory Methodology",
          ariaLabel: "Achievements & Auditoriums",
          onClick: () => handleLinkClick(() => onNavigate('about'))
        },
        {
          label: "A/L Z-Score Predictor Tool",
          ariaLabel: "Calculate Z-Score",
          onClick: () => handleLinkClick(() => onOpenCalculator && onOpenCalculator())
        },
        {
          label: "2025/2026 Batch Admission",
          ariaLabel: "Enroll in Batch",
          onClick: () => handleLinkClick(() => onOpenEnroll())
        }
      ]
    }
  ], [theme, onNavigate, onOpenZoom, onOpenCalculator, onOpenEnroll]);

  const calculateTargetHeight = () => {
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    if (isMobile) {
      const contentEl = navRef.current?.querySelector('.card-nav-content') as HTMLElement | null;
      if (contentEl) {
        return 64 + contentEl.scrollHeight + 16;
      }
      return 520;
    }
    return 335;
  };

  // GSAP animation triggered directly on isExpanded changes
  useEffect(() => {
    const navEl = navRef.current;
    if (!navEl) return;

    const cards = cardsRef.current.filter(Boolean);

    if (isExpanded) {
      const targetHeight = calculateTargetHeight();
      gsap.killTweensOf(navEl);
      gsap.killTweensOf(cards);

      // Harmonized expansion: height & borderRadius animate concurrently with expo.out
      gsap.to(navEl, {
        height: targetHeight,
        borderRadius: 24,
        duration: 0.42,
        ease: 'expo.out'
      });

      // Cards smoothly bloom into place immediately as the capsule expands
      gsap.fromTo(
        cards,
        { y: 18, opacity: 0, scale: 0.98 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.38,
          stagger: 0.04,
          ease: 'power2.out',
          clearProps: 'transform,scale'
        }
      );
    } else {
      gsap.killTweensOf(navEl);
      gsap.killTweensOf(cards);

      // Smooth fade out of cards
      gsap.to(cards, {
        y: 10,
        opacity: 0,
        scale: 0.98,
        duration: 0.16,
        ease: 'power2.in'
      });

      // Collapse container back to 64px capsule and 32px pill borderRadius
      gsap.to(navEl, {
        height: 64,
        borderRadius: 32,
        duration: 0.32,
        ease: 'power3.inOut'
      });
    }
  }, [isExpanded]);

  const toggleMenu = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    if (isExpanded) {
      isPinnedRef.current = false;
      setIsExpanded(false);
    } else {
      isPinnedRef.current = true;
      setIsExpanded(true);
    }
  };

  const setCardRef = (i: number) => (el: HTMLDivElement | null) => {
    cardsRef.current[i] = el;
  };

  return (
    <div className={`card-nav-container ${className}`}>
      <nav
        ref={navRef}
        className={`card-nav ${isExpanded ? 'open' : ''}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="card-nav-top">
          {/* LEFT: Two-Line Hamburger Button (Morphs into X when open) */}
          <div
            onClick={toggleMenu}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleMenu();
              }
            }}
            role="button"
            aria-label={isExpanded ? 'Close menu' : 'Open menu'}
            aria-expanded={isExpanded}
            tabIndex={0}
            className={`hamburger-menu text-slate-800 dark:text-slate-100 ${isExpanded ? 'open' : ''}`}
            title="Click to view all pages"
          >
            <div className="hamburger-line" />
            <div className="hamburger-line" />
          </div>

          {/* CENTER: Logo Emblem and Teacher Name */}
          <div
            onClick={() => handleLinkClick(() => onNavigate('home'))}
            className="logo-container group"
            title="Sachitha Sankalpa - Home"
          >
            <div className="logo-emblem w-8 h-8 rounded-full flex items-center justify-center bg-[#161618] text-[#F7F5F0] dark:bg-[#F7F5F0] dark:text-[#101012] shadow-sm">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-sans font-extrabold text-sm sm:text-base tracking-tight text-[#161618] dark:text-[#F7F5F0]">
                SACHITHA<span className="text-[#4338CA] dark:text-cyan-400"> SANKALPA</span>
              </span>
              <span className="hidden sm:inline-block text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full border border-[#E2E8F0] dark:border-white/10 bg-black/5 dark:bg-white/5 text-[#737373] dark:text-slate-400">
                A/L BS
              </span>
            </div>
          </div>

          {/* RIGHT: Actions Cluster (Theme Toggle & Highlighted Student Login) */}
          <div className="card-nav-actions">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-full flex items-center justify-center text-[#737373] dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/10 transition-all duration-300 active:scale-90 cursor-pointer overflow-hidden relative"
              title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            >
              <div className="relative w-4 h-4 flex items-center justify-center">
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-amber-400 rotate-0 scale-100 transition-all duration-500 transform" />
                ) : (
                  <Moon className="w-4 h-4 text-slate-700 -rotate-12 scale-100 transition-all duration-500 transform" />
                )}
              </div>
            </button>

            {/* HIGHLIGHTED STUDENT LOGIN / PORTAL BUTTON (Button-in-Button Pattern) */}
            {isLoggedIn ? (
              <button
                type="button"
                onClick={() => onNavigate('dashboard')}
                className="btn-magnetic-pill group !py-1.5 !px-3.5 !text-xs"
              >
                <div className="w-5 h-5 rounded-full bg-[#4338CA]/20 text-cyan-300 flex items-center justify-center text-[10px] font-bold">
                  {student?.name.charAt(0)}
                </div>
                <span className="font-sans font-bold">{student?.name.split(' ')[0]}</span>
                <span className="icon-bubble !w-6 !h-6">
                  <ArrowUpRight className="w-3 h-3 text-white dark:text-black" />
                </span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onNavigate('login')}
                className="btn-magnetic-pill group relative overflow-hidden !py-1.5 !px-3.5 !text-xs !bg-[#4338CA] dark:!bg-[#3730A3] !text-white border border-indigo-400/30 shadow-md transition-all duration-300 hover:shadow-indigo-500/30 hover:shadow-lg cursor-pointer"
                title="Student Portal Login"
              >
                {/* Smooth Full Loading Fill: Sweeps 0% -> 100% completely across the pill from left to right */}
                <span
                  className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#4F46E5] via-[#2563EB] to-[#06B6D4] origin-left scale-x-0 group-hover:scale-x-[1.02] transition-transform duration-300 group-hover:duration-[850ms] ease-[cubic-bezier(0.22,1,0.36,1)] pointer-events-none"
                  aria-hidden="true"
                />

                <span className="relative z-10 font-sans font-bold uppercase tracking-wider text-[11px] text-white drop-shadow-xs">
                  Student Login
                </span>
                <span className="icon-bubble !w-6 !h-6 !bg-white/20 relative z-10 transition-all duration-300 group-hover:scale-110 group-hover:translate-x-0.5 group-hover:bg-white/30">
                  <LogIn className="w-3 h-3 text-white" />
                </span>
              </button>
            )}
          </div>
        </div>

        {/* EXPANDED CARDS VIEW (GSAP Animated) */}
        <div className="card-nav-content" aria-hidden={!isExpanded}>
          {items.map((item, idx) => (
            <div
              key={`${item.label}-${idx}`}
              className="nav-card shadow-sm"
              ref={setCardRef(idx)}
              style={{ backgroundColor: item.bgColor, color: item.textColor }}
            >
              <div className="nav-card-label">
                <span>{item.label}</span>
                
              </div>
              <div className="nav-card-links">
                {item.links.map((lnk, i) => (
                  <button
                    key={`${lnk.label}-${i}`}
                    className="nav-card-link text-inherit"
                    onClick={lnk.onClick}
                    aria-label={lnk.ariaLabel}
                  >
                    <ArrowUpRight className="nav-card-link-icon" />
                    <span>{lnk.label}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default CardNav;
