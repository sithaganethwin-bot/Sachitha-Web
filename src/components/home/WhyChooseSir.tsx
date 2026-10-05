'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Brain,
  TrendingUp,
  FileCheck,
  Video,
  ShieldCheck
} from 'lucide-react';

interface Pillar {
  number: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  tag: string;
  metric: string;
  description: string;
  accentColor: string;
  accentBorder: string;
  accentBg: string;
}

export const WhyChooseSir: React.FC = () => {
  const [isSpread, setIsSpread] = useState(false);
  const [hasAutoSpread, setHasAutoSpread] = useState(false);
  const [isHoveredStack, setIsHoveredStack] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Stack offsets when collapsed into 1 physical card deck
  const stackConfigs = [
    { rot: 0, offX: 0, offY: 0, scale: 1, zIndex: 40 },
    { rot: 2.2, offX: 8, offY: 6, scale: 0.985, zIndex: 30 },
    { rot: -2.5, offX: -8, offY: 12, scale: 0.97, zIndex: 20 },
    { rot: 3.2, offX: 10, offY: 18, scale: 0.955, zIndex: 10 }
  ];

    const pillars: Pillar[] = [
    {
      number: "01",
      icon: <Brain className="w-5 h-5 text-blue-600 dark:text-cyan-400" />,
      title: "Visual Mind Maps",
      subtitle: "සංකල්ප සිතියම්කරණය",
      tag: "Memory",
      metric: "100% Visual Recall",
      description: "Complete syllabus mapped into interconnected visual frameworks for rapid exam recall.",
      accentColor: "text-blue-600 dark:text-cyan-400",
      accentBorder: "border-blue-500/30 dark:border-cyan-400/30",
      accentBg: "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-cyan-300"
    },
    {
      number: "02",
      icon: <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />,
      title: "Corporate Cases",
      subtitle: "සැබෑ ව්‍යාපාරික විශ්ලේෂණ",
      tag: "Acumen",
      metric: "CSE & Blue-Chip Cases",
      description: "Real enterprise case studies from Dialog Axiata, Hayleys, and the Colombo Stock Exchange.",
      accentColor: "text-purple-600 dark:text-purple-400",
      accentBorder: "border-purple-500/30 dark:border-purple-400/30",
      accentBg: "bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300"
    },
    {
      number: "03",
      icon: <FileCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
      title: "3-Hour Speed Papers",
      subtitle: "වේගවත් ප්‍රශ්න පත්‍ර පුහුණුව",
      tag: "Drills",
      metric: "Timed 180-Min Precision",
      description: "Weekly full-length mock exams conditioning answer speed to official marking rubrics.",
      accentColor: "text-emerald-600 dark:text-emerald-400",
      accentBorder: "border-emerald-500/30 dark:border-emerald-400/30",
      accentBg: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
    },
    {
      number: "04",
      icon: <Video className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />,
      title: "Hybrid Hubs & LMS",
      subtitle: "භෞතික හා සජීවී Zoom",
      tag: "Access",
      metric: "Halls + 24/7 Portal",
      description: "Physical hubs at Sasip, Rotary, and Texas with synchronized 1080p Zoom and recordings.",
      accentColor: "text-indigo-600 dark:text-indigo-400",
      accentBorder: "border-indigo-500/30 dark:border-indigo-400/30",
      accentBg: "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300"
    }
  ];

  // Mathematically exact transform deltas calculated from natural un-transformed offsetLeft/offsetTop
  const [transforms, setTransforms] = useState<string[]>(['', '', '', '']);

  const calculateTransforms = useCallback(() => {
    if (!gridRef.current) return;
    const grid = gridRef.current;
    const gridWidth = grid.offsetWidth;
    const gridHeight = grid.offsetHeight;
    const centerX = gridWidth / 2;
    const centerY = gridHeight / 2;

    const newTransforms = pillars.map((_, i) => {
      const card = cardRefs.current[i];
      if (!card) return '';

      // offsetLeft/offsetTop give true untransformed layout position
      const cardCenterX = card.offsetLeft + card.offsetWidth / 2;
      const cardCenterY = card.offsetTop + card.offsetHeight / 2;

      const deltaX = centerX - cardCenterX;
      const deltaY = centerY - cardCenterY;

      const cfg = stackConfigs[i];
      const hoverMult = isHoveredStack ? 1.5 : 1.0;

      if (!isSpread) {
        return `translate3d(${Math.round(deltaX + cfg.offX * hoverMult)}px, ${Math.round(deltaY + cfg.offY * hoverMult)}px, 0px) rotate(${cfg.rot * hoverMult}deg) scale(${cfg.scale})`;
      } else {
        return 'translate3d(0px, 0px, 0px) rotate(0deg) scale(1)';
      }
    });

    setTransforms(newTransforms);
  }, [isSpread, isHoveredStack, pillars.length]);

  useEffect(() => {
    calculateTransforms();
    window.addEventListener('resize', calculateTransforms);
    return () => window.removeEventListener('resize', calculateTransforms);
  }, [calculateTransforms]);

  // Smooth viewport observer: As user scrolls into section, starts stacked, then smoothly glides apart
  useEffect(() => {
    if (hasAutoSpread) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.2) {
            // Natural 250ms cadence pause so user clearly catches the single stacked card before smooth fanning
            const timer = setTimeout(() => {
              setIsSpread(true);
              setHasAutoSpread(true);
            }, 250);
            return () => clearTimeout(timer);
          }
        });
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [hasAutoSpread]);

  return (
    <section
      ref={sectionRef}
      className="py-24 bg-transparent transition-colors relative overflow-hidden"
    >
      {/* Subtle ambient spotlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-blue-500/5 via-indigo-500/5 to-cyan-500/5 blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-cyan-300 shadow-xs">
            
            <span>The Sachitha Sankalpa Advantage</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white font-['Space_Grotesk'] tracking-tight">
            Why Commerce Students Excel with "Beyond the Theory"
          </h2>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Our systematic 4-tier learning architecture eliminates cramming, replaces rote memorization with analytical acumen, and consistently produces Island Rankers.
          </p>
        </div>

        {/* ========================================================
            CARD STAGE: 1-DECK TO 4-COLUMN SPREAD CHOREOGRAPHY
           ======================================================== */}
        <div
          ref={gridRef}
          onMouseEnter={() => !isSpread && setIsHoveredStack(true)}
          onMouseLeave={() => !isSpread && setIsHoveredStack(false)}
          onClick={() => setIsSpread(prev => !prev)}
          className={`relative min-h-[460px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 transition-all ${
            !isSpread ? 'cursor-pointer' : ''
          }`}
        >
          {pillars.map((pillar, i) => {
            const cfg = stackConfigs[i];
            const transform = transforms[i] || '';
            const zIndex = isSpread ? 10 + i : cfg.zIndex;

            // Tight, organic wave stagger (0ms, 40ms, 80ms, 120ms)
            const staggerDelay = isSpread ? i * 40 : (3 - i) * 35;

            return (
                            <div
                key={i}
                ref={el => {
                  cardRefs.current[i] = el;
                }}
                style={{
                  transform: transform || undefined,
                  zIndex: zIndex,
                  transition: `transform 0.72s cubic-bezier(0.19, 1, 0.22, 1) ${staggerDelay}ms, box-shadow 0.4s ease, border-color 0.3s ease`,
                  willChange: 'transform'
                }}
                className={`p-6 sm:p-7 rounded-[24px] bg-white dark:bg-[#0c101a] border border-slate-200/90 dark:border-slate-800/90 flex flex-col justify-between space-y-5 hover:border-blue-500/40 dark:hover:border-cyan-400/40 transition-all duration-300 group shadow-sm hover:shadow-lg relative overflow-hidden select-none ${
                  !isSpread ? 'shadow-xl ring-1 ring-black/5 dark:ring-white/10' : ''
                }`}
              >
                <div className="space-y-4">
                  {/* Top Row: Icon + Metric Tag */}
                  <div className="flex items-center justify-between">
                    <div className="w-11 h-11 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                      {pillar.icon}
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono tracking-wide ${pillar.accentBg}`}>
                      {pillar.tag}
                    </span>
                  </div>

                  {/* Title & Subtitle */}
                  <div>
                    <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white font-['Space_Grotesk'] leading-snug group-hover:text-[#4338CA] dark:group-hover:text-cyan-400 transition-colors">
                      {pillar.title}
                    </h3>
                    <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 pt-0.5 block">
                      {pillar.subtitle}
                    </span>
                  </div>

                  {/* Short Punchy Description */}
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
                    {pillar.description}
                  </p>
                </div>

                {/* Minimalist Bottom Metric Chip */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-[11px] font-mono font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>{pillar.metric}</span>
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {pillar.number}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Helper Note */}
        <div className="text-center pt-2">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Click on any card to view detailed syllabus modules • Developed specifically for the Sri Lankan A/L Business Studies curriculum.
          </p>
        </div>
      </div>
    </section>
  );
};
