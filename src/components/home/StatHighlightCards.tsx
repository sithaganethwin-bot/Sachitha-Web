import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { StatCardItem, StatIconType } from '../../types';
import {
  Award,
  Users,
  TrendingUp,
  GraduationCap,
  CheckCircle2,
  BookOpen,
  Target,
  Clock
} from 'lucide-react';

interface GlowPreset {
  auraColor: string;
  radialGradient: string;
  border: string;
  iconBox: string;
  valueText: string;
}

const GLOW_PRESETS: Record<string, GlowPreset> = {
  indigo: {
    auraColor: 'rgba(99, 102, 241, 0.45)',
    radialGradient: 'radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.38) 0%, rgba(59, 130, 246, 0.15) 55%, transparent 75%)',
    border: 'rgba(99, 102, 241, 0.45)',
    iconBox: 'bg-indigo-500/10 text-indigo-600 dark:text-cyan-400 border-indigo-500/20',
    valueText: 'text-indigo-600 dark:text-cyan-400'
  },
  emerald: {
    auraColor: 'rgba(16, 185, 129, 0.45)',
    radialGradient: 'radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.38) 0%, rgba(20, 184, 166, 0.15) 55%, transparent 75%)',
    border: 'rgba(16, 185, 129, 0.45)',
    iconBox: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    valueText: 'text-emerald-600 dark:text-emerald-400'
  },
  purple: {
    auraColor: 'rgba(168, 85, 247, 0.45)',
    radialGradient: 'radial-gradient(circle at 50% 50%, rgba(168, 85, 247, 0.38) 0%, rgba(217, 70, 239, 0.15) 55%, transparent 75%)',
    border: 'rgba(168, 85, 247, 0.45)',
    iconBox: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
    valueText: 'text-purple-600 dark:text-purple-400'
  },
  cyan: {
    auraColor: 'rgba(6, 182, 212, 0.45)',
    radialGradient: 'radial-gradient(circle at 50% 50%, rgba(6, 182, 212, 0.38) 0%, rgba(56, 189, 248, 0.15) 55%, transparent 75%)',
    border: 'rgba(6, 182, 212, 0.45)',
    iconBox: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 border-cyan-500/20',
    valueText: 'text-cyan-600 dark:text-cyan-400'
  },
  amber: {
    auraColor: 'rgba(245, 158, 11, 0.45)',
    radialGradient: 'radial-gradient(circle at 50% 50%, rgba(245, 158, 11, 0.38) 0%, rgba(251, 191, 36, 0.15) 55%, transparent 75%)',
    border: 'rgba(245, 158, 11, 0.45)',
    iconBox: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    valueText: 'text-amber-600 dark:text-amber-400'
  },
  rose: {
    auraColor: 'rgba(244, 63, 94, 0.45)',
    radialGradient: 'radial-gradient(circle at 50% 50%, rgba(244, 63, 94, 0.38) 0%, rgba(251, 113, 133, 0.15) 55%, transparent 75%)',
    border: 'rgba(244, 63, 94, 0.45)',
    iconBox: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
    valueText: 'text-rose-600 dark:text-rose-400'
  }
};

const renderStatIcon = (icon?: StatIconType | string, className: string = 'w-5 h-5') => {
  const norm = (icon || 'Award').toLowerCase();
  switch (norm) {
    case 'award':
      return <Award className={className} strokeWidth={2.2} />;
    case 'users':
      return <Users className={className} strokeWidth={2.2} />;
    case 'trendingup':
    case 'trending':
      return <TrendingUp className={className} strokeWidth={2.2} />;
    case 'graduationcap':
    case 'graduation':
      return <GraduationCap className={className} strokeWidth={2.2} />;
    case 'checkcircle2':
    case 'check':
      return <CheckCircle2 className={className} strokeWidth={2.2} />;
    case 'bookopen':
    case 'book':
      return <BookOpen className={className} strokeWidth={2.2} />;
    case 'target':
      return <Target className={className} strokeWidth={2.2} />;
    case 'clock':
      return <Clock className={className} strokeWidth={2.2} />;
    default:
      return <Award className={className} strokeWidth={2.2} />;
  }
};

export interface ParsedStatValue {
  isNumeric: boolean;
  prefix: string;
  target: number;
  suffix: string;
  hasCommas: boolean;
  decimals: number;
  raw: string;
}

export function parseStatValue(raw: string): ParsedStatValue {
  if (!raw) {
    return { isNumeric: false, raw: '', prefix: '', target: 0, suffix: '', hasCommas: false, decimals: 0 };
  }
  const trimmed = raw.trim();
  const match = trimmed.match(/^([^\d]*)([\d,]+(?:\.\d+)?)(.*)$/);
  if (!match) {
    return { isNumeric: false, raw: trimmed, prefix: '', target: 0, suffix: '', hasCommas: false, decimals: 0 };
  }
  const prefix = match[1] || '';
  const numStr = match[2] || '0';
  const suffix = match[3] || '';
  const hasCommas = numStr.includes(',');
  const cleanNumStr = numStr.replace(/,/g, '');
  const target = parseFloat(cleanNumStr);
  const decimals = cleanNumStr.includes('.') ? (cleanNumStr.split('.')[1]?.length || 0) : 0;

  return {
    isNumeric: !isNaN(target),
    prefix,
    target: isNaN(target) ? 0 : target,
    suffix,
    hasCommas,
    decimals,
    raw: trimmed
  };
}

export const AnimatedCounter: React.FC<{
  value: string;
  className?: string;
  duration?: number;
  trigger?: boolean;
}> = ({ value, className = '', duration = 1600, trigger = true }) => {
  const parsed = useMemo(() => parseStatValue(value), [value]);
  const [displayValue, setDisplayValue] = useState<string>(() => {
    if (!parsed.isNumeric) return value;
    const initialNum = parsed.decimals > 0 ? (0).toFixed(parsed.decimals) : '0';
    return `${parsed.prefix}${initialNum}${parsed.suffix}`;
  });

  const elementRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!parsed.isNumeric) {
      setDisplayValue(value);
      return;
    }

    if (!trigger) {
      const initialNum = parsed.decimals > 0 ? (0).toFixed(parsed.decimals) : '0';
      setDisplayValue(`${parsed.prefix}${initialNum}${parsed.suffix}`);
      return;
    }

    let animFrame: number;
    const startTime = performance.now();
    const target = parsed.target;

    const updateCount = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Smooth easeOutExpo
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = target * ease;

      let formatted = current.toFixed(parsed.decimals);
      if (parsed.hasCommas) {
        const parts = formatted.split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        formatted = parts.join('.');
      }

      setDisplayValue(`${parsed.prefix}${formatted}${parsed.suffix}`);

      if (progress < 1) {
        animFrame = requestAnimationFrame(updateCount);
      } else {
        // Final exact formatting
        let finalFormatted = target.toFixed(parsed.decimals);
        if (parsed.hasCommas) {
          const parts = finalFormatted.split('.');
          parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
          finalFormatted = parts.join('.');
        }
        setDisplayValue(`${parsed.prefix}${finalFormatted}${parsed.suffix}`);
      }
    };

    animFrame = requestAnimationFrame(updateCount);

    return () => {
      if (animFrame) cancelAnimationFrame(animFrame);
    };
  }, [parsed, value, duration, trigger]);

  return (
    <span ref={elementRef} className={className}>
      {displayValue}
    </span>
  );
};

export const StatHighlightCards: React.FC = () => {
  const { highlightStats } = useData();
  const [hasDropped, setHasDropped] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter active cards and sort by order
  const activeStats = (highlightStats || [])
    .filter(item => item.isActive !== false)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    let hasScrolled = window.scrollY > 15;

    const checkDropTrigger = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const vh = window.innerHeight || 800;

      // When the card container enters the active viewport zone
      const isInView = rect.top < vh * 0.88 && rect.bottom > 40;

      // If user has scrolled or cards are clearly scrolled into view
      if (isInView && (hasScrolled || window.scrollY > 10 || rect.top < vh * 0.75)) {
        setHasDropped(true);
      } else if (rect.top > vh + 120 || (window.scrollY < 8 && rect.top > 250)) {
        // Reset when user scrolls back to the very top or far below
        setHasDropped(false);
      }
    };

    const handleScroll = () => {
      hasScrolled = true;
      checkDropTrigger();
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            checkDropTrigger();
          } else {
            const rect = entry.boundingClientRect;
            const vh = window.innerHeight || 800;
            if (rect.top > vh || rect.bottom < 0) {
              setHasDropped(false);
            }
          }
        });
      },
      {
        threshold: [0, 0.1, 0.25],
        rootMargin: '0px 0px -40px 0px'
      }
    );

    observer.observe(element);
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Safety fallback: If user stays on page and hasn't scrolled, drop in after 1.8s
    const safetyTimer = setTimeout(() => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const vh = window.innerHeight || 800;
        if (rect.top < vh && rect.bottom > 0) {
          setHasDropped(true);
        }
      }
    }, 1800);

    // Initial check
    checkDropTrigger();

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(safetyTimer);
    };
  }, []);

  if (!activeStats || activeStats.length === 0) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-2 sm:py-3 [perspective:1200px]"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4 lg:gap-5">
        {activeStats.map((stat: StatCardItem, index: number) => {
          const glow = GLOW_PRESETS[stat.glowColor] || GLOW_PRESETS.indigo;
          // Micro-stagger: 0ms, 80ms, 160ms for a rapid, cohesive drop sequence
          const dropDelay = index * 80;

          return (
            <div
              key={stat.id}
              className="relative transition-all duration-[750ms] will-change-transform"
              style={{
                transform: hasDropped
                  ? 'translateY(0px) scale(1) rotateX(0deg)'
                  : 'translateY(-80px) scale(0.9) rotateX(15deg)',
                opacity: hasDropped ? 1 : 0,
                filter: hasDropped ? 'blur(0px)' : 'blur(5px)',
                transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
                transitionDelay: hasDropped ? `${dropDelay}ms` : '0ms',
                pointerEvents: hasDropped ? 'auto' : 'none'
              }}
            >
              {/* Luminous Outer Glow Halo */}
              <div
                className={`absolute -inset-1 sm:-inset-1.5 rounded-2xl sm:rounded-[22px] blur-md sm:blur-lg transition-all duration-700 pointer-events-none ${
                  hasDropped
                    ? 'opacity-70 dark:opacity-85 group-hover:opacity-100 group-hover:blur-xl'
                    : 'opacity-0 blur-sm'
                }`}
                style={{
                  background: glow.radialGradient,
                  transitionDelay: hasDropped ? `${dropDelay + 120}ms` : '0ms'
                }}
              />
              <div
                className="absolute -inset-[1px] rounded-2xl sm:rounded-[20px] pointer-events-none transition-all duration-500"
                style={{
                  boxShadow: hasDropped ? `0 0 20px -3px ${glow.auraColor}` : 'none',
                  transitionDelay: hasDropped ? `${dropDelay + 120}ms` : '0ms'
                }}
              />

              {/* Minimalist Compact Card Surface */}
              <div
                className="group relative h-full flex flex-col items-center justify-center text-center p-4 sm:p-5 rounded-2xl sm:rounded-[20px] bg-white/90 dark:bg-[#0c101a]/90 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 shadow-sm dark:shadow-lg transition-all duration-300 group-hover:-translate-y-1 cursor-default"
                style={{
                  borderColor: glow.border
                }}
              >
                {/* Clean Jewel Icon */}
                <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center mb-2 border transition-transform duration-300 group-hover:scale-110 ${glow.iconBox}`}>
                  {renderStatIcon(stat.iconType, 'w-4 h-4 sm:w-5 sm:h-5')}
                </div>

                {/* Big Animated Rolling Value */}
                <div className={`text-2xl sm:text-3xl lg:text-[32px] font-black font-['Space_Grotesk'] tracking-tight leading-tight ${glow.valueText}`}>
                  <AnimatedCounter value={stat.value} trigger={hasDropped} />
                </div>

                {/* Minimalist Uppercase Title */}
                <div className="text-[11px] sm:text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider font-['Space_Grotesk'] mt-1">
                  {stat.label}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StatHighlightCards;

