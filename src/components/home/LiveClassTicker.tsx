import React, { useState, useEffect } from 'react';
import { Clock, Video, Radio, ArrowRight, MapPin } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { BorderGlow } from '../common/BorderGlow';

interface LiveClassTickerProps {
  onNavigateToSchedule: () => void;
  onOpenZoom?: (sessionTitle?: string, batchName?: string) => void;
}

export const LiveClassTicker: React.FC<LiveClassTickerProps> = ({
  onNavigateToSchedule,
  onOpenZoom,
}) => {
  const { liveTickerConfig } = useData();

  // If disabled by Admin, don't render anything
  if (!liveTickerConfig.isEnabled) {
    return null;
  }

  // Calculate remaining seconds based on scheduledDateTime or countdownMinutes
  const calculateInitialSeconds = () => {
    if (liveTickerConfig.scheduledDateTime) {
      const diffMs = new Date(liveTickerConfig.scheduledDateTime).getTime() - Date.now();
      if (diffMs > 0) {
        return Math.floor(diffMs / 1000);
      }
    }
    return (liveTickerConfig.countdownMinutes || 15) * 60;
  };

  const [secondsLeft, setSecondsLeft] = useState(calculateInitialSeconds);

  useEffect(() => {
    setSecondsLeft(calculateInitialSeconds());
  }, [liveTickerConfig.scheduledDateTime, liveTickerConfig.countdownMinutes]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const hours = Math.floor(secondsLeft / 3600);
  const minutes = Math.floor((secondsLeft % 3600) / 60);
  const seconds = secondsLeft % 60;

  const formattedHours = String(hours).padStart(2, '0');
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(seconds).padStart(2, '0');

  const handleZoomClick = (e: React.MouseEvent) => {
    if (onOpenZoom) {
      e.preventDefault();
      onOpenZoom(liveTickerConfig.subject, liveTickerConfig.batchBadge);
    }
  };

  return (
    <BorderGlow
      borderRadius={16}
      glowRadius={36}
      edgeSensitivity={20}
      glowIntensity={1.2}
      className="shadow-xl shadow-blue-950/40"
    >
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 text-white p-4 sm:p-5 transition-all duration-300">
        {/* Background glow effects */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-cyan-500/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Left: Live Indicator & Session Info */}
          <div className="flex items-center gap-4">
            <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600/30 border border-blue-400/40 shrink-0">
              <Radio className="w-6 h-6 text-cyan-400 animate-pulse" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider text-white ${liveTickerConfig.isStreamingNow ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500 animate-pulse'}`}>
                  {liveTickerConfig.isStreamingNow ? '● STREAMING LIVE NOW' : 'NEXT LIVE SESSION'}
                </span>
                <span className="text-xs font-semibold text-blue-200">
                  {liveTickerConfig.batchBadge}
                </span>
              </div>
              <h4 className="text-sm sm:text-base font-bold text-white mt-0.5 truncate max-w-md sm:max-w-xl">
                {liveTickerConfig.subject}
              </h4>
              <div className="flex items-center gap-3 text-xs text-slate-300 mt-1">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  {liveTickerConfig.timeSlot}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-rose-400" />
                  {liveTickerConfig.venue}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Countdown Timer / Live Now & Action Button */}
          <div className="flex items-center gap-4 sm:gap-6 self-start lg:self-auto border-t lg:border-t-0 border-blue-800/60 pt-3 lg:pt-0 w-full lg:w-auto justify-between lg:justify-end">
            {liveTickerConfig.isStreamingNow ? (
              <div className="text-left sm:text-right">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                  Session Active
                </span>
                <div className="flex items-center gap-2 text-base sm:text-lg font-black text-emerald-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  <span>Broadcasting 1080p</span>
                </div>
              </div>
            ) : (
              <div className="text-left sm:text-right">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Live Stream Starts In
                </span>
                <div className="flex items-center gap-1 font-mono font-black text-xl sm:text-2xl text-cyan-300">
                  {hours > 0 && (
                    <>
                      <div className="p-1 px-2 rounded-lg bg-blue-950/80 border border-blue-800/80">
                        {formattedHours}
                      </div>
                      <span className="text-slate-400 animate-pulse">:</span>
                    </>
                  )}
                  <div className="p-1 px-2 rounded-lg bg-blue-950/80 border border-blue-800/80">
                    {formattedMinutes}
                  </div>
                  <span className="text-slate-400 animate-pulse">:</span>
                  <div className="p-1 px-2 rounded-lg bg-blue-950/80 border border-blue-800/80">
                    {formattedSeconds}
                  </div>
                  <span className="text-xs text-slate-400 font-sans ml-1 font-normal">
                    {hours > 0 ? 'hr:min' : 'min:sec'}
                  </span>
                </div>
              </div>
            )}

            <div className="flex items-center gap-2">
              <button
                onClick={handleZoomClick}
                className="btn-glow inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-lg shadow-cyan-500/25 transition-all cursor-pointer whitespace-nowrap"
              >
                <Video className="w-4 h-4 text-slate-950" />
                <span>Join Zoom Room</span>
              </button>
              <button
                onClick={onNavigateToSchedule}
                className="btn-glow p-2.5 rounded-xl bg-blue-950/70 hover:bg-blue-900 border border-blue-800/80 text-blue-200 transition-colors cursor-pointer"
                title="View full schedule"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </BorderGlow>
  );
};
