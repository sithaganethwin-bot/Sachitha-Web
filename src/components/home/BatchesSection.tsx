import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { BatchInfo, PageId } from '../../types';
import {
  CheckCircle2,
  Calendar,
  MapPin,
  ArrowRight,
  Clock,
  GraduationCap
} from 'lucide-react';
import { BorderGlow } from '../common/BorderGlow';

interface BatchesSectionProps {
  onOpenEnroll: (batchId?: string) => void;
  onNavigateToSchedule: () => void;
}

export const BatchesSection: React.FC<BatchesSectionProps> = ({
  onOpenEnroll,
  onNavigateToSchedule,
}) => {
  const { batches } = useData();
  const [filterMode, setFilterMode] = useState<'all' | '2025' | '2026'>('all');

  const filteredBatches = batches.filter((b) => {
    if (filterMode === '2025') return b.grade.includes('2025');
    if (filterMode === '2026') return b.grade.includes('2026');
    return true;
  });

  return (
    <section className="py-20 border-t border-slate-200/80 dark:border-blue-950/60 bg-transparent transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-cyan-400 mb-3">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Tailored Learning Programs</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white font-['Space_Grotesk']">
              Featured A/L Batches & Courses
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-xl">
              Select your academic year to explore batch syllabus roadmaps, session timings, and admission details.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm self-start md:self-auto">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filterMode === 'all'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-300 hover:text-blue-600'
              }`}
            >
              All Batches
            </button>
            <button
              onClick={() => setFilterMode('2025')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filterMode === '2025'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-300 hover:text-blue-600'
              }`}
            >
              2025 A/L
            </button>
            <button
              onClick={() => setFilterMode('2026')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filterMode === '2026'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-300 hover:text-blue-600'
              }`}
            >
              2026 A/L
            </button>
          </div>
        </div>

        {/* Batches Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredBatches.map((batch) => (
            <BorderGlow
              key={batch.id}
              borderRadius={24}
              glowRadius={36}
              edgeSensitivity={22}
              glowIntensity={batch.popular ? 1.3 : 1.0}
              className={`h-full ${batch.popular ? 'shadow-xl shadow-blue-500/10' : 'shadow-md'}`}
            >
              <div
                className={`relative rounded-3xl p-6 sm:p-8 transition-all duration-300 flex flex-col justify-between h-full ${
                  batch.popular
                    ? 'border-2 border-blue-500'
                    : 'border border-slate-200/80 dark:border-slate-800'
                }`}
              >
                {batch.popular && (
                  <div className="absolute -top-3.5 right-6 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md shadow-blue-500/30 flex items-center gap-1 z-10">
                    
                    <span>{batch.tag}</span>
                  </div>
                )}

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                      {batch.grade}
                    </span>
                    <span className="text-xs font-semibold text-slate-400">
                      {batch.startDate}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-['Space_Grotesk']">
                    {batch.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                    {batch.subtitle}
                  </p>

                  {/* Timing & Venue details */}
                  <div className="mt-5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 space-y-2">
                    <div className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-200 font-semibold">
                      <Clock className="w-4 h-4 text-blue-500 shrink-0" />
                      <span>{batch.scheduleSummary}</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-200 font-semibold">
                      <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                      <span>{batch.venue}</span>
                    </div>
                  </div>

                  {/* Key features checklist */}
                  <div className="mt-6 space-y-2.5">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Included with Batch
                    </div>
                    {batch.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Card Action */}
                <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Class Fee</span>
                    <div className="text-xl font-black text-blue-600 dark:text-cyan-400 font-['Space_Grotesk']">
                      {batch.fee}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={onNavigateToSchedule}
                      className="btn-glow px-4 py-3 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-cyan-400 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors cursor-pointer"
                    >
                      Timetable
                    </button>
                    <button
                      onClick={() => onOpenEnroll(batch.id)}
                      className="btn-glow flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-xs sm:text-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-md shadow-blue-500/20 cursor-pointer"
                    >
                      <span>Enroll Now</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </BorderGlow>
          ))}
        </div>
      </div>
    </section>
  );
};
