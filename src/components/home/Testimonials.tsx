import React from 'react';
import { MOCK_TESTIMONIALS } from '../../data/mockData';
import { Star, MessageSquareQuote, CheckCircle2 } from 'lucide-react';

export const Testimonials: React.FC = () => {
  return (
    <section className="py-20 bg-transparent border-t border-slate-200 dark:border-blue-950/70 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-cyan-400 mb-3">
            <MessageSquareQuote className="w-3.5 h-3.5" />
            <span>Student & Parent Voices</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white font-['Space_Grotesk']">
            Stories of Transformation
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            Hear from students across leading schools in Sri Lanka who transformed their examination results.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {MOCK_TESTIMONIALS.map((t) => (
            <div
              key={t.id}
              className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0c101a] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>

                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed italic mb-6">
                  "{t.comment}"
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-3.5">
                <img
                  src={t.avatar}
                  alt={t.studentName}
                  className="w-12 h-12 rounded-xl object-cover border border-blue-400/40"
                />
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    {t.studentName}
                  </h4>
                  <div className="text-xs text-blue-600 dark:text-cyan-400 font-semibold">
                    {t.results}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {t.school} • {t.batch}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
