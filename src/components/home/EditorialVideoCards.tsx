import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Play, Clock, CheckCircle2, ArrowUpRight } from 'lucide-react';

interface VideoHighlight {
  id: string;
  year: string;
  badge: string;
  title: string;
  subtitle: string;
  duration: string;
  thumbnail: string;
  keyTopics: string[];
}

interface EditorialVideoCardsProps {
  onOpenZoom?: () => void;
  onOpenEnroll?: () => void;
}

export const EditorialVideoCards: React.FC<EditorialVideoCardsProps> = ({ onOpenZoom, onOpenEnroll }) => {
  const [activeVideo, setActiveVideo] = useState<VideoHighlight | null>(null);

  // Prevent body scrolling when modal is open
  useEffect(() => {
    if (activeVideo) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [activeVideo]);

  const highlights: VideoHighlight[] = [
    {
      id: "v1",
      year: "2026",
      badge: "THEORY MASTERCLASS",
      title: "PESTEL Strategic Analysis & Sri Lankan Corporate Cases",
      subtitle: "Deconstructing macro environmental factors with Dialog Axiata & Hayleys PLC financial reports.",
      duration: "1h 45m",
      thumbnail: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80",
      keyTopics: ["Economic Factors", "Legal Compliance", "Exchange Rates"]
    },
    {
      id: "v2",
      year: "2025",
      badge: "EXAM REVISION",
      title: "Speed Paper Drills: Structuring 20-Mark Structured Essays",
      subtitle: "The exact formula for scoring top marks under tight G.C.E. A/L time pressure.",
      duration: "2h 10m",
      thumbnail: "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=800&q=80",
      keyTopics: ["Essay Formatting", "Key Verb Mastery", "Examiner Keywords"]
    },
    {
      id: "v3",
      year: "2024",
      badge: "CASE STUDY",
      title: "Accounting Ratios & DuPont Financial Decomposition",
      subtitle: "Visual breakdown of liquidity, solvency, and investor return metrics without rote memorization.",
      duration: "1h 30m",
      thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
      keyTopics: ["ROCE & ROE", "Working Capital", "Gearing Ratios"]
    }
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#E2E8F0] dark:border-white/10 bg-[#FFFFFF]/80 dark:bg-[#18181b]/80 backdrop-blur-md text-[10px] font-mono uppercase tracking-[0.2em] text-[#737373] dark:text-slate-400 mb-3">
            
            <span>Curated Lecture Archives</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#161618] dark:text-[#F7F5F0] font-syne tracking-tight">
            MASTERCLASS{' '}
            <span className="font-serif-editorial italic font-normal text-[#4338CA] dark:text-cyan-400">
              Vault
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-[#737373] dark:text-slate-400 font-sans mt-2 max-w-lg">
            High-yield masterclass excerpts engineered for cognitive clarity and immediate exam execution.
          </p>
        </div>

        <button
          onClick={onOpenEnroll}
          className="btn-magnetic-pill group self-start md:self-auto"
        >
          <span>Unlock Full 2026/2027 Vault</span>
          <span className="icon-bubble">
            <ArrowUpRight className="w-3.5 h-3.5 text-white dark:text-black" />
          </span>
        </button>
      </div>

      {/* Video Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {highlights.map((item) => (
          <div
            key={item.id}
            onClick={() => setActiveVideo(item)}
            className="group relative rounded-3xl overflow-hidden border border-[#E2E8F0] dark:border-white/10 bg-[#FFFFFF] dark:bg-[#141416] p-2 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl cursor-pointer"
          >
            {/* Visual Thumbnail Frame */}
            <div className="relative aspect-[16/10] rounded-[1.25rem] overflow-hidden bg-slate-900">
              <img
                src={item.thumbnail}
                alt={item.title}
                className="w-full h-full object-cover opacity-85 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              {/* Bold Serif Year Watermark */}
              <div className="absolute top-3 left-4 font-serif-editorial italic text-4xl sm:text-5xl font-normal text-white/30 tracking-tight select-none pointer-events-none group-hover:text-white/50 transition-colors">
                {item.year}
              </div>

              {/* Duration badge */}
              <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-mono">
                <Clock className="w-3 h-3 text-cyan-400" />
                <span>{item.duration}</span>
              </div>

              {/* Stylized Circular Play Badge */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center text-white shadow-xl group-hover:scale-115 group-hover:bg-[#4338CA] group-hover:border-[#4338CA] transition-all duration-300">
                  <Play className="w-5 h-5 ml-0.5 fill-current" />
                </div>
              </div>
            </div>

            {/* Editorial Content Below */}
            <div className="p-4 space-y-2">
              <div className="flex items-center justify-between text-[10px] font-mono text-[#4338CA] dark:text-cyan-400 font-bold uppercase tracking-wider">
                <span>{item.badge}</span>
                <span className="text-[#737373] dark:text-slate-400">EPISODE {item.id.replace('v', '0')}</span>
              </div>

              <h3 className="font-syne font-bold text-base text-[#161618] dark:text-white group-hover:text-[#4338CA] dark:group-hover:text-cyan-300 transition-colors leading-snug">
                {item.title}
              </h3>

              <p className="text-xs text-[#737373] dark:text-slate-400 font-sans line-clamp-2 leading-relaxed">
                {item.subtitle}
              </p>

              {/* Key topics pills */}
              <div className="pt-2 flex flex-wrap gap-1.5">
                {item.keyTopics.map((topic, i) => (
                  <span
                    key={i}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-black/5 dark:bg-white/5 font-mono text-[#161618] dark:text-slate-300"
                  >
                    #{topic}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Video Modal Preview */}
      {activeVideo && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl rounded-3xl bg-[#101012] border border-white/20 text-white p-6 shadow-2xl overflow-hidden">
            <button
              onClick={() => setActiveVideo(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            >
              ✕
            </button>

            <div className="flex items-center gap-2 text-[10px] font-mono text-cyan-400 mb-2">
              <span>{activeVideo.year} SESSION</span>
              <span>•</span>
              <span>{activeVideo.duration}</span>
            </div>

            <h3 className="font-syne font-extrabold text-xl sm:text-2xl text-white mb-1">
              {activeVideo.title}
            </h3>
            <p className="text-xs text-slate-300 mb-6 font-sans">
              {activeVideo.subtitle}
            </p>

            {/* Embedded Video Placeholder Preview with In-Website Zoom Option */}
            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-900 border border-white/10 flex flex-col items-center justify-center p-8 text-center relative group">
              <img
                src={activeVideo.thumbnail}
                alt="Lecture Preview"
                className="absolute inset-0 w-full h-full object-cover opacity-35"
              />
              <div className="relative z-10 max-w-md space-y-4">
                <div className="w-16 h-16 rounded-full bg-cyan-400/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 mx-auto">
                  <Play className="w-7 h-7 ml-1 fill-current" />
                </div>
                <h4 className="font-syne font-bold text-lg text-white">
                  Student Portal Synchronized Stream
                </h4>
                <p className="text-xs text-slate-300">
                  Enrolled students receive instant uncompressed HD access with synced digital worksheets.
                </p>
                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      setActiveVideo(null);
                      if (onOpenZoom) onOpenZoom();
                    }}
                    className="px-5 py-2.5 rounded-full bg-[#4338CA] hover:bg-indigo-600 text-white font-bold text-xs transition"
                  >
                    Open Live Studio
                  </button>
                  <button
                    onClick={() => {
                      setActiveVideo(null);
                      if (onOpenEnroll) onOpenEnroll();
                    }}
                    className="px-5 py-2.5 rounded-full bg-white text-black font-bold text-xs hover:bg-slate-200 transition"
                  >
                    Enroll Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </section>
  );
};
