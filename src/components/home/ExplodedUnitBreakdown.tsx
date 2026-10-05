import React, { useRef, useState, useEffect, useCallback } from 'react';
import { ArrowUpRight, Layers, Shield, TrendingUp, DollarSign, CheckCircle2 } from 'lucide-react';

interface ExplodedUnitBreakdownProps {
  onOpenMaterials?: () => void;
}

interface LayerData {
  id: number;
  badge: string;
  title: string;
  sinName: string;
  description: string;
  tag: string;
  icon: React.ReactNode;
  // Fanned deck state (resting before expansion)
  fanned: { x: number; y: number; rot: number; z: number };
  // Fully exploded 2x2 quadrant state
  exploded: { x: number; y: number; rot: number };
}

export const ExplodedUnitBreakdown: React.FC<ExplodedUnitBreakdownProps> = ({ onOpenMaterials }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const nexusRef = useRef<HTMLDivElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement | null>(null);

  const viewMode = 'scroll';
  const [activeUnit, setActiveUnit] = useState<number | null>(null);

  // Physics animation refs (bypass React state re-render during scroll!)
  const targetProgress = useRef<number>(0);
  const currentProgress = useRef<number>(0);
  const isHoveredCard = useRef<number | null>(null);

    const layers: LayerData[] = [
    {
      id: 1,
      badge: "UNITS 01–04",
      title: "Foundations & Legal Framework",
      sinName: "ව්‍යාපාර පරිසරය හා නීතිය",
      description: "Macro PESTEL drivers, business ethics, and commercial legal structures in Sri Lanka.",
      tag: "Foundations",
      icon: <Shield className="w-5 h-5 text-indigo-600 dark:text-cyan-400" />,
      fanned: { x: -140, y: 12, rot: -7, z: 10 },
      exploded: { x: -300, y: -155, rot: -2.5 }
    },
    {
      id: 2,
      badge: "UNIT 05",
      title: "Principles of Management",
      sinName: "කළමනාකරණය හා නායකත්වය",
      description: "Classical and modern management theories, strategic planning, and corporate governance.",
      tag: "Leadership",
      icon: <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
      fanned: { x: -45, y: -8, rot: -2, z: 20 },
      exploded: { x: 300, y: -155, rot: 2.5 }
    },
    {
      id: 3,
      badge: "UNITS 06–07",
      title: "Marketing & Operations",
      sinName: "අලෙවිකරණය හා මෙහෙයුම්",
      description: "Modern market segmentation, 7P strategy mix, quality management, and logistics.",
      tag: "Operations",
      icon: <Layers className="w-5 h-5 text-amber-600 dark:text-amber-400" />,
      fanned: { x: 45, y: -8, rot: 2, z: 30 },
      exploded: { x: -300, y: 165, rot: 2.5 }
    },
    {
      id: 4,
      badge: "UNIT 08",
      title: "Financial Analysis & Ratios",
      sinName: "මූල්‍ය විශ්ලේෂණය හා අනුපාත",
      description: "Financial ratios, liquidity, working capital cycles, and investment valuation.",
      tag: "Finance",
      icon: <DollarSign className="w-5 h-5 text-blue-600 dark:text-sky-400" />,
      fanned: { x: 140, y: 12, rot: 7, z: 40 },
      exploded: { x: 300, y: 165, rot: -2.5 }
    }
  ];

  // Silky smooth RequestAnimationFrame interpolation loop
  useEffect(() => {
    let rafId: number;
    let isLooping = false;
    let isVisible = false;

    const render = () => {
      const desiredTarget = targetProgress.current;
      const diff = desiredTarget - currentProgress.current;

      // Heavy liquid spring damping
      currentProgress.current += diff * 0.1;
      const progress = currentProgress.current;

      // Update center nexus scale
      if (nexusRef.current) {
        const nexusScale = 1 - progress * 0.12;
        nexusRef.current.style.transform = `scale(${nexusScale})`;
      }

      // Update progress bar indicator
      if (progressBarRef.current) {
        progressBarRef.current.style.width = `${Math.round(progress * 100)}%`;
      }

      // Update each of the 4 cards smoothly via direct transform
      layers.forEach((layer, idx) => {
        const el = cardRefs.current[idx];
        if (!el) return;

        const x = layer.fanned.x + (layer.exploded.x - layer.fanned.x) * progress;
        const y = layer.fanned.y + (layer.exploded.y - layer.fanned.y) * progress;
        const rot = layer.fanned.rot + (layer.exploded.rot - layer.fanned.rot) * progress;

        const isHovered = isHoveredCard.current === layer.id;
        const hoverElevate = isHovered ? 'scale(1.04) translateY(-6px)' : 'scale(1)';

        el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) rotateZ(${rot.toFixed(1)}deg) ${hoverElevate}`;
        el.style.zIndex = isHovered ? '50' : String(layer.fanned.z + Math.round(progress * 10));
      });

      if (Math.abs(diff) > 0.0008) {
        rafId = requestAnimationFrame(render);
      } else {
        currentProgress.current = desiredTarget;
        isLooping = false;
      }
    };

    const startLoop = () => {
      if (!isLooping && isVisible) {
        isLooping = true;
        rafId = requestAnimationFrame(render);
      }
    };

    const handleScroll = () => {
      if (!containerRef.current || !isVisible) return;
      const rect = containerRef.current.getBoundingClientRect();
      const containerHeight = containerRef.current.offsetHeight - window.innerHeight;
      if (containerHeight <= 0) return;

      const currentScroll = -rect.top;
      const rawProgress = Math.max(0, Math.min(1, currentScroll / containerHeight));
      const smoothed = rawProgress * rawProgress * (3 - 2 * rawProgress);

      if (Math.abs(smoothed - targetProgress.current) > 0.0005) {
        targetProgress.current = smoothed;
        startLoop();
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        isVisible = entry.isIntersecting;
        if (isVisible) {
          handleScroll();
          startLoop();
        } else {
          isLooping = false;
          cancelAnimationFrame(rafId);
        }
      },
      { threshold: 0.05 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, [viewMode]);

  const handleCardHover = (id: number | null) => {
    isHoveredCard.current = id;
    setActiveUnit(id);
    // Trigger render when hover status changes
    if (containerRef.current) {
      targetProgress.current = currentProgress.current;
    }
  };

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-[140vh] bg-transparent py-16 px-4 sm:px-6 lg:px-8 select-none"
    >
      {/* Sticky Stage Container */}
      <div className="sticky top-20 min-h-[78vh] flex flex-col items-center justify-center">
        
        {/* Editorial Eyebrow & Title */}
        <div className="text-center max-w-3xl mx-auto mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#E2E8F0] dark:border-white/10 bg-[#FFFFFF]/80 dark:bg-[#18181b]/80 backdrop-blur-md text-[10px] font-mono uppercase tracking-[0.2em] text-[#737373] dark:text-slate-400 mb-3 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#4338CA] dark:bg-cyan-400 animate-pulse" />
            <span>Kinetic Architecture // 3D Exploded Framework</span>
          </div>
          
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#161618] dark:text-[#F7F5F0] font-syne tracking-tight">
            THE A/L FRAMEWORK{' '}
            <span className="font-serif-editorial italic font-normal text-[#4338CA] dark:text-cyan-400">
              Deconstructed
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-[#737373] dark:text-slate-400 font-sans mt-2 max-w-lg mx-auto">
            Scroll to smoothly deconstruct the syllabus units into distinct commercial pillars.
          </p>
        </div>

        {/* 3D Exploded Stage for Desktop (Generous Width & Zero Text Overlap!) */}
        <div className="relative w-full max-w-6xl h-[560px] hidden md:flex items-center justify-center perspective-[1400px]">
          
          {/* Center Nexus Pill: Fixed visual anchor */}
          <div
            ref={nexusRef}
            className="z-15 absolute flex flex-col items-center justify-center p-6 rounded-3xl border border-[#4338CA]/30 dark:border-cyan-400/30 bg-[#FFFFFF]/95 dark:bg-[#101012]/95 backdrop-blur-xl shadow-2xl transition-all duration-150 pointer-events-auto select-none"
            style={{
              boxShadow: '0 25px 60px -15px rgba(67, 56, 202, 0.18)',
              willChange: 'transform'
            }}
          >
            <div className="w-10 h-10 rounded-2xl bg-[#4338CA]/10 dark:bg-cyan-400/10 flex items-center justify-center mb-2">
              <Layers className="w-5 h-5 text-[#4338CA] dark:text-cyan-400" />
            </div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#4338CA] dark:text-cyan-400 font-bold">
              BUSINESS BLUEPRINT
            </span>
            <span className="text-sm font-syne font-black text-[#161618] dark:text-white mt-0.5">
              Sachitha Sankalpa
            </span>
            <span className="text-[11px] font-serif-editorial italic text-[#737373] dark:text-slate-400 mt-1">
              "Beyond the Theory"
            </span>

            {/* Live Progress Bar */}
            <div className="mt-3 w-28 h-1 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
              <div
                ref={progressBarRef}
                className="h-full bg-gradient-to-r from-[#4338CA] to-cyan-400 rounded-full transition-all duration-75"
                style={{ width: '0%' }}
              />
            </div>
          </div>

          {/* 4 Exploding Component Layers */}
          {layers.map((layer, idx) => {
            const isHover = activeUnit === layer.id;

            return (
              <div
                key={layer.id}
                ref={(el) => { cardRefs.current[idx] = el; }}
                onMouseEnter={() => handleCardHover(layer.id)}
                onMouseLeave={() => handleCardHover(null)}
                onClick={() => onOpenMaterials && onOpenMaterials()}
                className={`absolute w-[370px] p-6 rounded-3xl border transition-[box-shadow,border-color,background-color] duration-300 cursor-pointer select-none ${
                  isHover
                    ? 'border-[#4338CA] dark:border-cyan-400 bg-white dark:bg-[#18181b] shadow-2xl'
                    : 'border-[#E2E8F0] dark:border-white/10 bg-[#FFFFFF]/90 dark:bg-[#141416]/90 shadow-xl backdrop-blur-lg'
                }`}
                style={{
                  willChange: 'transform',
                  transformOrigin: 'center center'
                }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-black/5 dark:bg-white/5 flex items-center justify-center">
                      {layer.icon}
                    </div>
                    <span className="text-[10px] font-mono font-bold tracking-tight text-[#4338CA] dark:text-cyan-400 uppercase">
                      {layer.badge}
                    </span>
                  </div>
                  <div className="w-7 h-7 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center text-slate-500 group-hover:text-[#4338CA] transition-colors">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </div>
                </div>

                <h3 className="font-syne font-bold text-base text-[#161618] dark:text-white leading-tight mb-1">
                  {layer.title}
                </h3>
                <p className="text-xs font-serif-editorial italic text-slate-500 dark:text-slate-400 mb-2.5">
                  {layer.sinName}
                </p>
                <p className="text-xs text-[#737373] dark:text-slate-300 leading-relaxed font-sans line-clamp-2">
                  {layer.description}
                </p>

                <div className="mt-4 pt-2.5 border-t border-[#E2E8F0]/60 dark:border-white/5 flex items-center justify-between text-[11px] font-mono">
                  <span className="text-[#4338CA] dark:text-cyan-400 font-semibold">{layer.tag}</span>
                  <span className="text-slate-400 hover:text-[#4338CA] transition-colors flex items-center gap-1">
                    <span>Inspect</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile Fallback: High-end Vertical Stack */}
        <div className="w-full space-y-4 md:hidden px-2 mt-6">
          {layers.map((layer) => (
            <div
              key={layer.id}
              onClick={() => onOpenMaterials && onOpenMaterials()}
              className="p-5 rounded-2xl border border-[#E2E8F0] dark:border-white/10 bg-[#FFFFFF] dark:bg-[#141416] shadow-sm active:scale-[0.98] transition-transform"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono text-[#4338CA] dark:text-cyan-400 font-bold">
                  {layer.badge}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/5 text-slate-500 font-mono">
                  {layer.tag}
                </span>
              </div>
              <h3 className="font-syne font-bold text-base text-[#161618] dark:text-white">
                {layer.title}
              </h3>
              <p className="text-xs font-serif-editorial italic text-slate-500 dark:text-slate-400 mb-2">
                {layer.sinName}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-300 font-sans">
                {layer.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
