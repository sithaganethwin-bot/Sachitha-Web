import React, { useState } from 'react';
import { PageId } from '../../types';
import { useData } from '../../context/DataContext';
import {
  Calendar,
  BookOpen,
  ArrowRight,
  MapPin,
  CheckCircle2,
  Clock,
  TrendingUp,
  Brain,
  Video,
  FileText,
  Layers,
  Award,
  GraduationCap
} from 'lucide-react';
import sachiiPortrait from '../../assets/sachii_portrait.png';
import { InstagramIcon } from '../common/SocialIcons';
import { LiveClassTicker } from './LiveClassTicker';
import { ScrollExpand } from '../common/ScrollExpand';
import { Particles } from '../common/Particles';
import { useTheme } from '../../context/ThemeContext';
import { KineticTypewriterHeadline } from './KineticTypewriterHeadline';
import { StatHighlightCards } from './StatHighlightCards';
import { ParallaxCommerceCanvas } from '../common/ParallaxCommerceCanvas';

interface HeroProps {
  onNavigate: (page: PageId) => void;
  onOpenEnroll: () => void;
  onOpenZoom?: (sessionTitle?: string, batchName?: string) => void;
  onOpenCalculator?: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onNavigate,
  onOpenEnroll,
  onOpenZoom,
  onOpenCalculator,
}) => {
  const { teacherInfo, liveTickerConfig } = useData();
  const { theme } = useTheme();

  // Dynamic business particle palette matching the editorial theme
  const particleColors = theme === 'dark'
    ? ['#6366F1', '#38BDF8', '#10B981', '#FBBF24', '#C084FC']
    : ['#4338CA', '#065F46', '#2563EB', '#D97706', '#4F46E5'];

  // Active showcase tab inside the expanding stage
  const [activeShowcase, setActiveShowcase] = useState<'mindmap' | 'cases' | 'papers'>('mindmap');

  return (
    <section className="relative pt-4 pb-20 overflow-hidden bg-transparent transition-colors">
      
      {/* 3D WebGL Particle Field (React Bits OGL) - Business / Commerce Data Nodes */}
      <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-0 opacity-90 dark:opacity-90">
        <Particles
          particleColors={particleColors}
          particleCount={180}
          particleSpread={15}
          speed={0.14}
          particleBaseSize={100}
          moveParticlesOnHover={true}
          particleHoverFactor={0.9}
          alphaParticles={true}
          disableRotation={false}
          cameraDistance={20}
        />
      </div>

      {/* Subtle macro-texture background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-80 bg-gradient-to-b from-[#4338CA]/5 via-indigo-500/5 to-transparent blur-3xl pointer-events-none z-0" />

      {/* Mouse reactive commerce canvas - strictly confined to Hero section */}
      <ParallaxCommerceCanvas />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 relative z-10">
        
        {/* Live Countdown Ticker Banner */}
        {liveTickerConfig.isEnabled && (
          <div>
            <LiveClassTicker
              onNavigateToSchedule={() => onNavigate('schedule')}
              onOpenZoom={onOpenZoom}
            />
          </div>
        )}

        {/* Editorial Kinetic Hero Grid: Left Copy & Right Cutout Portrait */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 xl:gap-12 items-center pt-2 sm:pt-4">
          
          {/* Left Column: Authority Badge, Headline, Subtitle, CTAs, Locations (7 of 12 cols) */}
          <div className="w-full lg:col-span-7 text-center lg:text-left space-y-6 max-w-2xl mx-auto lg:mx-0">
            
            {/* Top Authority Pill: Instagram Handle & Specialization */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-[#E2E8F0] dark:border-white/10 bg-[#FFFFFF]/90 dark:bg-[#18181b]/90 backdrop-blur-md text-xs font-mono text-[#161618] dark:text-[#F7F5F0] shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <a
                href="https://www.instagram.com/business_studies_with_sachitha/"
                target="_blank"
                rel="noreferrer"
                className="hover:underline flex items-center gap-1.5 text-[#161618] dark:text-white font-bold"
              >
                <InstagramIcon className="w-3.5 h-3.5 text-pink-500" />
                <span>@business_studies_with_sachitha</span>
              </a>
              <span className="text-[#E2E8F0] dark:text-white/20">•</span>
              <span className="text-[#4338CA] dark:text-cyan-400 font-bold uppercase tracking-wider text-[10px]">
                Beyond the Theory
              </span>
            </div>

            {/* Main Headline (Kinetic Typewriter Effect) */}
            <KineticTypewriterHeadline align="left" />

            {/* Clean Subheading */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-medium leading-relaxed max-w-xl mx-auto lg:mx-0">
              A/L Business Studies reimagined with corporate case studies, visual mind maps, and structured speed paper mastery.
            </p>

            {/* Minimalist Primary Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
              <button
                onClick={() => onNavigate('schedule')}
                className="btn-magnetic-pill group"
              >
                <span>Weekly Timetable</span>
                <span className="icon-bubble">
                  <ArrowRight className="w-3.5 h-3.5 text-white dark:text-black" />
                </span>
              </button>

              <button
                onClick={() => onNavigate('materials')}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full font-bold text-xs sm:text-sm bg-white dark:bg-[#18181b] text-slate-800 dark:text-white border border-slate-200 dark:border-white/10 hover:border-[#4338CA] dark:hover:border-cyan-400 transition-all cursor-pointer shadow-xs hover:scale-102"
              >
                <BookOpen className="w-4 h-4 text-[#4338CA] dark:text-cyan-400" />
                <span>Study Materials (Units 1–6)</span>
              </button>
            </div>

            {/* Hall Locations Row */}
            <div className="pt-2 flex items-center justify-center lg:justify-start gap-2 flex-wrap text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-blue-500" />
                <span>Sasip Nugegoda</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                <span>Rotary Nugegoda</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-cyan-500" />
                <span>Texas Battaramulla</span>
              </span>
              <span>•</span>
              <span className="font-semibold text-emerald-600 dark:text-cyan-400">Zoom Live HD Islandwide</span>
            </div>
          </div>

          {/* Right Column: High-End Hero Cutout Portrait Stage (5 of 12 cols) */}
          <div className="w-full lg:col-span-5 relative flex justify-center items-center lg:justify-end mt-8 lg:mt-0">
            <div className="relative w-full max-w-[340px] sm:max-w-[400px] lg:max-w-[440px] xl:max-w-[470px] flex items-end justify-center">
              
              {/* Backlight Multi-Layer Ambient Glow Aura */}
              <div className="absolute inset-x-2 sm:inset-x-4 top-4 bottom-4 rounded-full bg-gradient-to-tr from-indigo-500/25 via-blue-500/20 to-cyan-400/25 blur-3xl pointer-events-none -z-10" />
              <div className="absolute -inset-2 rounded-full bg-indigo-500/10 dark:bg-cyan-500/10 blur-2xl pointer-events-none -z-10" />

              {/* Decorative Subtle Orbit Rings */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[290px] sm:w-[350px] lg:w-[390px] h-[290px] sm:h-[350px] lg:h-[390px] rounded-full border border-indigo-500/15 dark:border-cyan-400/20 pointer-events-none -z-10" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[230px] sm:w-[280px] h-[230px] sm:h-[280px] rounded-full border border-dashed border-indigo-500/15 dark:border-cyan-400/15 pointer-events-none -z-10 animate-[spin_60s_linear_infinite]" />

              {/* Floating Glassmorphism Badge 1: Top Right */}
              <div className="absolute top-3 sm:top-5 -right-2 sm:-right-4 z-20 flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-white/90 dark:bg-[#18181b]/90 backdrop-blur-md border border-slate-200/80 dark:border-white/10 shadow-lg shadow-indigo-500/5 hover:scale-105 transition-transform duration-300 whitespace-nowrap">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white shadow-xs shrink-0">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div className="text-left leading-tight">
                  <p className="text-[11px] font-bold text-slate-900 dark:text-white">Sachitha Sankalpa</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">B.B.Mgt (Accountancy) Sp.</p>
                </div>
              </div>

              {/* Floating Glassmorphism Badge 2: Bottom Left */}
              <div className="absolute bottom-8 sm:bottom-12 -left-2 sm:-left-4 z-20 flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-white/90 dark:bg-[#18181b]/90 backdrop-blur-md border border-slate-200/80 dark:border-white/10 shadow-lg shadow-emerald-500/5 hover:scale-105 transition-transform duration-300 whitespace-nowrap">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-xs shrink-0">
                  <Award className="w-4 h-4" />
                </div>
                <div className="text-left leading-tight">
                  <p className="text-[11px] font-bold text-slate-900 dark:text-white">28+ Island Top Ranks</p>
                  <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">A/L Theory & Revision</p>
                </div>
              </div>

              {/* The Cutout Portrait Image with Clean Transparent Edges */}
              <img
                src={sachiiPortrait}
                alt="Sachitha Sankalpa - A/L Business Studies"
                className="relative z-10 w-auto h-auto max-h-[390px] sm:max-h-[460px] lg:max-h-[510px] xl:max-h-[540px] object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.25)] select-none pointer-events-none transform transition-transform duration-500 hover:scale-[1.02]"
              />
            </div>
          </div>
        </div>

        {/* 3 Prominent Highlight Stat Cards with Luminous Outer Glow */}
        <div className="pt-2 pb-2">
          <StatHighlightCards />
        </div>

        {/* ========================================================
            REACT BITS SCROLL EXPAND STAGE: "BEYOND THE THEORY"
           ======================================================== */}
        <ScrollExpand startWidth={78} startRadius={28} endRadius={12} className="pt-4">
          <div className="w-full relative rounded-[28px] overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c101a] shadow-xl">
            
            {/* Top Showcase Toolbar */}
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/80 dark:bg-slate-900/60">
              <div className="flex items-center gap-2">
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider font-['Space_Grotesk']">
                  The "Beyond the Theory" Learning Architecture
                </span>
              </div>

              {/* Showcase Tab Selector */}
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
                <button
                  onClick={() => setActiveShowcase('mindmap')}
                  className={'px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ' + (
                    activeShowcase === 'mindmap'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  )}
                >
                  1. Visual Mind Maps
                </button>
                <button
                  onClick={() => setActiveShowcase('cases')}
                  className={'px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ' + (
                    activeShowcase === 'cases'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  )}
                >
                  2. Corporate Case Studies
                </button>
                <button
                  onClick={() => setActiveShowcase('papers')}
                  className={'px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ' + (
                    activeShowcase === 'papers'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  )}
                >
                  3. Speed Paper Drills
                </button>
              </div>
            </div>

            {/* Showcase Stage Content - Clean & Eye-Catching */}
            <div className="p-6 sm:p-8">
              {activeShowcase === 'mindmap' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-center animate-in fade-in duration-300">
                  <div className="space-y-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-cyan-300">
                      Hierarchical Knowledge
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-['Space_Grotesk'] leading-snug">
                      Visual Mind Maps for Instant Exam Recall
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      Syllabus units 01 to 06 condensed into clear visual diagrams for effortless memory retention under exam pressure.
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center space-y-1">
                      <span className="text-xl sm:text-2xl font-black text-[#4338CA] dark:text-cyan-400 font-syne">01–06</span>
                      <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">All Units Mapped</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center space-y-1">
                      <span className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 font-syne">100%</span>
                      <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Exam Recall Rate</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center space-y-1">
                      <span className="text-xl sm:text-2xl font-black text-purple-600 dark:text-purple-400 font-syne">PDF</span>
                      <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">High-Res Print Packs</p>
                    </div>
                  </div>
                </div>
              )}

              {activeShowcase === 'cases' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-center animate-in fade-in duration-300">
                  <div className="space-y-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                      Corporate Realism
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-['Space_Grotesk'] leading-snug">
                      Real Corporate & CSE Case Study Analysis
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      Score distinguished marks on essay questions by integrating actual business moves from Dialog Axiata, Hayleys, and the CSE.
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center space-y-1">
                      <span className="text-xl sm:text-2xl font-black text-purple-600 dark:text-purple-400 font-syne">CSE</span>
                      <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Stock Market Cases</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center space-y-1">
                      <span className="text-xl sm:text-2xl font-black text-[#4338CA] dark:text-cyan-400 font-syne">40+</span>
                      <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Enterprise Files</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center space-y-1">
                      <span className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 font-syne">Part II</span>
                      <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Essay Blueprints</p>
                    </div>
                  </div>
                </div>
              )}

              {activeShowcase === 'papers' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-center animate-in fade-in duration-300">
                  <div className="space-y-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                      Exam Conditioning
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-['Space_Grotesk'] leading-snug">
                      Strict 3-Hour Timed Speed Paper Drills
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      Eliminate panic and condition your brain to allocate exact minutes per question on official Department of Examinations rubrics.
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center space-y-1">
                      <span className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 font-syne">180m</span>
                      <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Full Mock Simulation</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center space-y-1">
                      <span className="text-xl sm:text-2xl font-black text-blue-600 dark:text-cyan-400 font-syne">50 MCQ</span>
                      <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">45-Min Speed Focus</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center space-y-1">
                      <span className="text-xl sm:text-2xl font-black text-purple-600 dark:text-purple-400 font-syne">Marks</span>
                      <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Individual Grading</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Stage Footer Bar */}
            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900/40 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-500" />
                <span>Over 28+ Island Top Ranks & Colombo/Jayewardenepura Management Faculty Entrants</span>
              </div>
              <button
                onClick={onOpenEnroll}
                className="font-bold text-blue-600 dark:text-cyan-400 hover:underline cursor-pointer flex items-center gap-1"
              >
                <span>Reserve Seat in Batch</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </ScrollExpand>
      </div>
    </section>
  );
};
