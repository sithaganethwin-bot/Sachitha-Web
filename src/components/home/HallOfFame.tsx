import React from 'react';
import { useData } from '../../context/DataContext';
import { Award, Trophy, GraduationCap, MapPin, Quote } from 'lucide-react';
import { BorderGlow } from '../common/BorderGlow';

export const HallOfFame: React.FC = () => {
  const { rankers } = useData();

  return (
    <section className="py-20 border-t border-slate-200 dark:border-blue-950/70 bg-transparent transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400 mb-3 border border-amber-300 dark:border-amber-800/80">
            <Trophy className="w-3.5 h-3.5 text-amber-500" />
            <span>Excellence Unmatched</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white font-['Space_Grotesk']">
            Hall of Fame & Top Island Rankers
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            Real students who trusted the process, mastered the concepts, and conquered the G.C.E. Advanced Level Examination.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {rankers.map((ranker) => (
            <BorderGlow
              key={ranker.id}
              borderRadius={24}
              glowRadius={36}
              edgeSensitivity={22}
              glowIntensity={1.15}
              className="h-full shadow-lg"
            >
              <div
                className="relative rounded-3xl p-6 sm:p-8 transition-all duration-300 flex flex-col justify-between h-full border border-blue-200/80 dark:border-blue-900/60"
              >
              {/* Top Rank Badge */}
              <div className="flex items-center justify-between gap-3 mb-6">
                <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-md shadow-amber-500/20 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5" />
                  {ranker.rank}
                </span>
                <span className="text-xs font-bold text-slate-400">
                  {ranker.year}
                </span>
              </div>

              {/* Student Info */}
              <div className="flex items-center gap-4 mb-5">
                <img
                  src={ranker.photoUrl}
                  alt={ranker.name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-blue-500 shadow-md"
                />
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white font-['Space_Grotesk']">
                    {ranker.name}
                  </h3>
                  <p className="text-xs text-blue-600 dark:text-cyan-400 font-semibold">
                    {ranker.stream}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-rose-500" />
                    {ranker.district}
                  </p>
                </div>
              </div>

              {/* Student Quote */}
              <div className="relative p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/70 border border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic mb-6">
                <Quote className="w-4 h-4 text-blue-400 mb-1 opacity-70" />
                "{ranker.quote}"
              </div>

              {/* University Admission Tag */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                <GraduationCap className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="truncate">{ranker.university}</span>
              </div>
            </div>
          </BorderGlow>
          ))}
        </div>
      </div>
    </section>
  );
};
