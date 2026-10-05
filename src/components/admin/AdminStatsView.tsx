'use client';

import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { StatCardItem, StatIconType } from '../../types';
import { AnimatedCounter } from '../home/StatHighlightCards';
import {
  Award,
  Users,
  TrendingUp,
  GraduationCap,
  CheckCircle2,
  BookOpen,
  Target,
  Clock,
  Plus,
  Trash2,
  Save,
  RotateCcw,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  Layers,
  Palette
} from 'lucide-react';
import confetti from 'canvas-confetti';

const ICON_OPTIONS: { id: StatIconType; label: string; icon: React.ReactNode }[] = [
  { id: 'Award', label: 'Award Ribbon', icon: <Award className="w-4 h-4" /> },
  { id: 'Users', label: 'Students / Community', icon: <Users className="w-4 h-4" /> },
  { id: 'TrendingUp', label: 'Trending / Growth', icon: <TrendingUp className="w-4 h-4" /> },
  { id: 'GraduationCap', label: 'Graduation Cap', icon: <GraduationCap className="w-4 h-4" /> },
  { id: 'CheckCircle2', label: 'Check / Verified', icon: <CheckCircle2 className="w-4 h-4" /> },
  { id: 'BookOpen', label: 'Book / Theory', icon: <BookOpen className="w-4 h-4" /> },
  { id: 'Target', label: 'Target / Aim', icon: <Target className="w-4 h-4" /> },
  { id: 'Clock', label: 'Clock / Timed', icon: <Clock className="w-4 h-4" /> },
];

const GLOW_COLOR_PRESETS: { id: StatCardItem['glowColor']; name: string; hex: string; desc: string }[] = [
  { id: 'indigo', name: 'Royal Indigo', hex: '#6366F1', desc: 'Deep sapphire ambient aura' },
  { id: 'emerald', name: 'Emerald Mint', hex: '#10B981', desc: 'Vibrant jade success glow' },
  { id: 'purple', name: 'Amethyst Purple', hex: '#A855F7', desc: 'Editorial distinction aura' },
  { id: 'cyan', name: 'Cyber Cyan', hex: '#06B6D4', desc: 'High-tech electric glow' },
  { id: 'amber', name: 'Solar Amber', hex: '#F59E0B', desc: 'Gold prestige glow' },
  { id: 'rose', name: 'Crimson Rose', hex: '#F43F5E', desc: 'Bold crimson aura' },
];

const GLOW_STYLES: Record<string, { aura: string; radial: string; border: string; text: string; badge: string; iconBox: string }> = {
  indigo: {
    aura: 'rgba(99, 102, 241, 0.45)',
    radial: 'radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.4) 0%, rgba(59, 130, 246, 0.18) 55%, transparent 80%)',
    border: 'rgba(99, 102, 241, 0.45)',
    text: 'text-indigo-600 dark:text-cyan-400',
    badge: 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800/60',
    iconBox: 'bg-indigo-500/10 text-indigo-600 dark:text-cyan-400 border-indigo-500/20'
  },
  emerald: {
    aura: 'rgba(16, 185, 129, 0.45)',
    radial: 'radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.4) 0%, rgba(20, 184, 166, 0.18) 55%, transparent 80%)',
    border: 'rgba(16, 185, 129, 0.45)',
    text: 'text-emerald-600 dark:text-emerald-400',
    badge: 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60',
    iconBox: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
  },
  purple: {
    aura: 'rgba(168, 85, 247, 0.45)',
    radial: 'radial-gradient(circle at 50% 50%, rgba(168, 85, 247, 0.4) 0%, rgba(217, 70, 239, 0.18) 55%, transparent 80%)',
    border: 'rgba(168, 85, 247, 0.45)',
    text: 'text-purple-600 dark:text-purple-400',
    badge: 'bg-purple-50 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800/60',
    iconBox: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20'
  },
  cyan: {
    aura: 'rgba(6, 182, 212, 0.45)',
    radial: 'radial-gradient(circle at 50% 50%, rgba(6, 182, 212, 0.4) 0%, rgba(56, 189, 248, 0.18) 55%, transparent 80%)',
    border: 'rgba(6, 182, 212, 0.45)',
    text: 'text-cyan-600 dark:text-cyan-400',
    badge: 'bg-cyan-50 dark:bg-cyan-950/70 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800/60',
    iconBox: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 border-cyan-500/20'
  },
  amber: {
    aura: 'rgba(245, 158, 11, 0.45)',
    radial: 'radial-gradient(circle at 50% 50%, rgba(245, 158, 11, 0.4) 0%, rgba(251, 191, 36, 0.18) 55%, transparent 80%)',
    border: 'rgba(245, 158, 11, 0.45)',
    text: 'text-amber-600 dark:text-amber-400',
    badge: 'bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/60',
    iconBox: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
  },
  rose: {
    aura: 'rgba(244, 63, 94, 0.45)',
    radial: 'radial-gradient(circle at 50% 50%, rgba(244, 63, 94, 0.4) 0%, rgba(251, 113, 133, 0.18) 55%, transparent 80%)',
    border: 'rgba(244, 63, 94, 0.45)',
    text: 'text-rose-600 dark:text-rose-400',
    badge: 'bg-rose-50 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800/60',
    iconBox: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
  }
};

const renderPreviewIcon = (icon?: StatIconType | string, className: string = 'w-5 h-5') => {
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

export const AdminStatsView: React.FC = () => {
  const {
    highlightStats,
    updateAllHighlightStats,
    resetHighlightStats
  } = useData();

  // Local working copy for editing before final save
  const [localStats, setLocalStats] = useState<StatCardItem[]>(() => {
    return JSON.parse(JSON.stringify(highlightStats || []));
  });

  const [previewTheme, setPreviewTheme] = useState<'light' | 'dark'>('dark');
  const [previewDropped, setPreviewDropped] = useState(true);
  const [successMsg, setSuccessMsg] = useState('');
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

  const handleTestDrop = () => {
    setPreviewDropped(false);
    setTimeout(() => {
      setPreviewDropped(true);
    }, 60);
  };

  // Sync if context updates from external
  useEffect(() => {
    if (highlightStats && highlightStats.length > 0 && localStats.length === 0) {
      setLocalStats(JSON.parse(JSON.stringify(highlightStats)));
    }
  }, [highlightStats]);

  const handleFieldChange = (id: string, field: keyof StatCardItem, value: any) => {
    setLocalStats(prev =>
      prev.map(item => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= localStats.length) return;

    const updated = [...localStats];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    // re-index order
    const reordered = updated.map((item, idx) => ({ ...item, order: idx + 1 }));
    setLocalStats(reordered);
  };

  const handleAddNewCard = () => {
    const newCard: StatCardItem = {
      id: `stat-${Date.now()}`,
      value: '100%',
      label: 'New Highlight Metric',
      subtext: 'Verified academic excellence in A/L Business Studies',
      badge: 'Certified',
      glowColor: 'cyan',
      iconType: 'Award',
      isActive: true,
      order: localStats.length + 1
    };
    setLocalStats(prev => [...prev, newCard]);
    setSelectedCardId(newCard.id);
  };

  const handleDeleteCard = (id: string, label: string) => {
    if (confirm(`Are you sure you want to remove the stat card "${label}"?`)) {
      setLocalStats(prev => prev.filter(item => item.id !== id));
    }
  };

  const handleResetDefaults = () => {
    if (confirm('Reset Highlight Stat Cards to the verified 3 defaults (Experience, Active Students, Pass Percentage)?')) {
      resetHighlightStats();
      const defaultCards: StatCardItem[] = [
        {
          id: 'stat-exp',
          value: '8+ Years',
          label: 'Years of Experience',
          subtext: 'Specialist coaching beyond the theory with 28+ Island Top Ranks',
          badge: 'Senior Lecturer',
          glowColor: 'indigo',
          iconType: 'Award',
          order: 1,
          isActive: true
        },
        {
          id: 'stat-students',
          value: '8,500+',
          label: 'Active Students',
          subtext: 'Enrolled across Sasip, Rotary, Texas & Zoom Live HD Islandwide',
          badge: 'Islandwide Community',
          glowColor: 'emerald',
          iconType: 'Users',
          order: 2,
          isActive: true
        },
        {
          id: 'stat-pass',
          value: '99.2%',
          label: 'Pass Percentage',
          subtext: 'Distinction rate conditioned with timed speed paper mastery',
          badge: 'High Distinction',
          glowColor: 'purple',
          iconType: 'TrendingUp',
          order: 3,
          isActive: true
        }
      ];
      setLocalStats(defaultCards);
      setSuccessMsg('Restored original 3 Highlight Stat Cards!');
      setTimeout(() => setSuccessMsg(''), 3000);
    }
  };

  const handleSaveAll = () => {
    updateAllHighlightStats(localStats);
    setSuccessMsg('Highlight Stat Cards & Outer Glow settings saved and published live!');
    confetti({ particleCount: 75, spread: 70, origin: { y: 0.6 } });
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  return (
    <div className="space-y-8 max-w-6xl pb-20">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-600 dark:text-cyan-400 border border-indigo-500/20 mb-2">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Home Page Highlights & Outer Glow Controller</span>
          </div>
          <h2 className="text-2xl font-black font-['Space_Grotesk'] text-slate-900 dark:text-white">
            Highlight Stat Cards Management
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Customize the 3 prominent authority cards shown in the Hero section (Numbers, Titles, Descriptions, Badges, Icons & Luminous Outer Glow Auras).
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            type="button"
            onClick={handleAddNewCard}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 transition-colors cursor-pointer shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Card</span>
          </button>

          <button
            type="button"
            onClick={handleSaveAll}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save & Publish Live</span>
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2.5 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <span className="font-semibold">{successMsg}</span>
        </div>
      )}

      {/* LIVE INTERACTIVE PREVIEW WITH VISIBLE OUTER GLOW */}
      <div className="p-6 rounded-3xl bg-slate-50 dark:bg-[#070a10] border border-slate-200 dark:border-blue-950/80 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 font-['Space_Grotesk']">
              Live Preview (With Outer Glow Radiance)
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleTestDrop}
              className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-cyan-400 border border-indigo-500/20 text-xs font-bold transition-all cursor-pointer shadow-xs"
              title="Test the physical drop-down entrance animation and rolling count-up"
            >
              <ArrowDown className="w-3.5 h-3.5" />
              <span>Test Drop Entrance</span>
            </button>

            <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-[11px] font-bold">
              <button
                type="button"
                onClick={() => setPreviewTheme('light')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  previewTheme === 'light'
                    ? 'bg-slate-200 text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Light Mode
              </button>
              <button
                type="button"
                onClick={() => setPreviewTheme('dark')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  previewTheme === 'dark'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Dark Mode
              </button>
            </div>
          </div>
        </div>

        {/* The Live Render Deck */}
        <div
          className={`p-6 sm:p-10 rounded-2xl transition-colors duration-300 overflow-hidden [perspective:1200px] ${
            previewTheme === 'light' ? 'bg-[#F8FAFC]' : 'bg-[#0b0e14]'
          }`}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
            {localStats
              .filter(s => s.isActive !== false)
              .map((stat, index) => {
                const glow = GLOW_STYLES[stat.glowColor] || GLOW_STYLES.indigo;
                const isSelected = selectedCardId === stat.id;
                const dropDelay = index * 80;

                return (
                  <div
                    key={stat.id}
                    onClick={() => setSelectedCardId(stat.id)}
                    className="relative group cursor-pointer transition-all duration-[750ms] will-change-transform"
                    style={{
                      transform: previewDropped
                        ? 'translateY(0px) scale(1) rotateX(0deg)'
                        : 'translateY(-70px) scale(0.92) rotateX(15deg)',
                      opacity: previewDropped ? 1 : 0,
                      filter: previewDropped ? 'blur(0px)' : 'blur(5px)',
                      transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
                      transitionDelay: previewDropped ? `${dropDelay}ms` : '0ms'
                    }}
                  >
                    {/* Multi-layered Luminous Outer Glow Halo */}
                    <div
                      className={`absolute -inset-1 sm:-inset-1.5 rounded-2xl sm:rounded-[22px] blur-md sm:blur-lg transition-all duration-700 pointer-events-none ${
                        previewDropped
                          ? 'opacity-70 dark:opacity-85 group-hover:opacity-100 group-hover:blur-xl'
                          : 'opacity-0 blur-sm'
                      }`}
                      style={{
                        background: glow.radial,
                        transitionDelay: previewDropped ? `${dropDelay + 120}ms` : '0ms'
                      }}
                    />
                    <div
                      className="absolute -inset-[1px] rounded-2xl sm:rounded-[20px] pointer-events-none transition-all duration-500"
                      style={{
                        boxShadow: previewDropped ? `0 0 20px -3px ${glow.aura}` : 'none',
                        transitionDelay: previewDropped ? `${dropDelay + 120}ms` : '0ms'
                      }}
                    />

                    {/* Minimalist Compact Card Surface */}
                    <div
                      className={`relative h-full flex flex-col items-center justify-center text-center p-4 sm:p-5 rounded-2xl sm:rounded-[20px] backdrop-blur-xl border transition-all duration-300 group-hover:-translate-y-1 ${
                        previewTheme === 'light'
                          ? 'bg-white/90 border-slate-200/90 shadow-sm'
                          : 'bg-[#0d121f]/90 border-white/10 shadow-lg'
                      } ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
                      style={{
                        borderColor: glow.border
                      }}
                    >
                      {/* Clean Jewel Icon */}
                      <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center mb-2 border transition-transform duration-300 group-hover:scale-110 ${glow.iconBox}`}>
                        {renderPreviewIcon(stat.iconType, 'w-4 h-4 sm:w-5 sm:h-5')}
                      </div>

                      {/* Animated Number */}
                      <div className={`text-2xl sm:text-3xl lg:text-[32px] font-black font-['Space_Grotesk'] tracking-tight leading-tight ${glow.text}`}>
                        <AnimatedCounter value={stat.value} trigger={previewDropped} />
                      </div>

                      {/* Uppercase Title */}
                      <div className={`text-[11px] sm:text-xs font-bold uppercase tracking-wider font-['Space_Grotesk'] mt-1 ${
                        previewTheme === 'light' ? 'text-slate-800' : 'text-slate-100'
                      }`}>
                        {stat.label}
                      </div>

                      <div className="mt-1 text-[9px] font-bold text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
                        Click to edit ↓
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      {/* CARD EDITORS LIST */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-500" />
            <span>Card Field Customization ({localStats.length} Cards)</span>
          </h3>
          <span className="text-xs text-slate-400">
            Reorder or edit numbers, labels, badges, outer glow, and icons
          </span>
        </div>

        <div className="space-y-4">
          {localStats.map((card, index) => {
            const isSelected = selectedCardId === card.id;

            return (
              <div
                key={card.id}
                id={`card-editor-${card.id}`}
                className={`p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#0c101a] border transition-all ${
                  isSelected
                    ? 'border-blue-500 shadow-md ring-1 ring-blue-500/20'
                    : 'border-slate-200 dark:border-blue-950/70 hover:border-slate-300'
                }`}
              >
                {/* Card Top Row Controls */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-1 rounded-lg text-xs font-black bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono">
                      Card #{index + 1}
                    </span>
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center border"
                      style={{
                        backgroundColor: `${GLOW_COLOR_PRESETS.find(p => p.id === card.glowColor)?.hex || '#6366F1'}15`,
                        borderColor: `${GLOW_COLOR_PRESETS.find(p => p.id === card.glowColor)?.hex || '#6366F1'}35`,
                        color: GLOW_COLOR_PRESETS.find(p => p.id === card.glowColor)?.hex || '#6366F1'
                      }}
                    >
                      {renderPreviewIcon(card.iconType, 'w-4 h-4')}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {card.value} — {card.label}
                      </h4>
                      <span className="text-[11px] text-slate-400">
                        {card.isActive !== false ? 'Active on Home Page' : 'Hidden from site'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Move Up */}
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => handleMove(index, 'up')}
                      className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                      title="Move card left/up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>

                    {/* Move Down */}
                    <button
                      type="button"
                      disabled={index === localStats.length - 1}
                      onClick={() => handleMove(index, 'down')}
                      className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                      title="Move card right/down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>

                    {/* Toggle Active */}
                    <button
                      type="button"
                      onClick={() => handleFieldChange(card.id, 'isActive', card.isActive === false ? true : false)}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                        card.isActive !== false
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                      }`}
                    >
                      {card.isActive !== false ? (
                        <>
                          <Eye className="w-3.5 h-3.5" />
                          <span>Visible</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3.5 h-3.5" />
                          <span>Hidden</span>
                        </>
                      )}
                    </button>

                    {/* Delete */}
                    <button
                      type="button"
                      onClick={() => handleDeleteCard(card.id, card.label)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/60 transition-colors cursor-pointer"
                      title="Delete card"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Form Fields Grid - Minimalist & Focused */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Big Number / Value */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Target Number / Value (Animates 0 → ...) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={card.value}
                      onChange={(e) => handleFieldChange(card.id, 'value', e.target.value)}
                      placeholder="e.g. 8+ Years, 8,500+, 99.2%"
                      className="w-full px-3.5 py-2.5 rounded-xl text-xs font-black font-['Space_Grotesk'] bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      Smoothly counts up from 0 to this number when viewed.
                    </span>
                  </div>

                  {/* Main Title / Label */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Card Title / Label <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={card.label}
                      onChange={(e) => handleFieldChange(card.id, 'label', e.target.value)}
                      placeholder="e.g. Years of Experience"
                      className="w-full px-3.5 py-2.5 rounded-xl text-xs font-bold bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      Clean uppercase label shown under the animated number.
                    </span>
                  </div>
                </div>

                {/* Icon Selection & Outer Glow Palette */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/60">
                  {/* Icon Selector */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                      Card Icon (Minimalist Aesthetic)
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {ICON_OPTIONS.map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => handleFieldChange(card.id, 'iconType', opt.id)}
                          className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-[11px] font-bold transition-all cursor-pointer ${
                            card.iconType === opt.id
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-cyan-400 ring-2 ring-blue-500/20'
                              : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                          }`}
                          title={opt.label}
                        >
                          <div className="mb-1">{opt.icon}</div>
                          <span className="truncate w-full text-center">{opt.id}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Outer Glow Color Presets */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
                      <Palette className="w-3.5 h-3.5 text-blue-500" />
                      <span>Outer Glow Aura Theme</span>
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {GLOW_COLOR_PRESETS.map((preset) => {
                        const isCurrent = card.glowColor === preset.id;
                        return (
                          <button
                            key={preset.id}
                            type="button"
                            onClick={() => handleFieldChange(card.id, 'glowColor', preset.id)}
                            className={`flex items-center gap-2 p-2 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                              isCurrent
                                ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/40 ring-1 ring-blue-500'
                                : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 hover:border-slate-300'
                            }`}
                          >
                            <span
                              className="w-4 h-4 rounded-full shrink-0 shadow-sm"
                              style={{
                                backgroundColor: preset.hex,
                                boxShadow: `0 0 10px ${preset.hex}`
                              }}
                            />
                            <div className="truncate">
                              <span className="block font-semibold text-[11px] text-slate-800 dark:text-slate-200">
                                {preset.name}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-2">
                      Changes the luminous ambient radiation and borders around the card.
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* BOTTOM FLOATING SAVE BAR */}
      <div className="sticky bottom-6 p-4 rounded-2xl bg-white/95 dark:bg-[#0c101a]/95 backdrop-blur-md border border-slate-200 dark:border-blue-950 shadow-xl flex items-center justify-between z-20">
        <div className="text-xs text-slate-500 dark:text-slate-400">
          Changes will instantly update on the live website and be saved in local storage.
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Reset Defaults
          </button>
          <button
            type="button"
            onClick={handleSaveAll}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/25 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save & Publish Live</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminStatsView;
