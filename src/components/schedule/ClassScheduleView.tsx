import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { ClassSession } from '../../types';
import {
  Calendar,
  Clock,
  MapPin,
  Video,
  Download,
  Filter,
  CheckCircle2,
  ExternalLink,
  Search
} from 'lucide-react';
import { LiveClassTicker } from '../home/LiveClassTicker';
import { BorderGlow } from '../common/BorderGlow';

interface ClassScheduleViewProps {
  onOpenEnroll: () => void;
  onOpenZoom?: (sessionTitle?: string, batchName?: string) => void;
}

export const ClassScheduleView: React.FC<ClassScheduleViewProps> = ({ onOpenEnroll, onOpenZoom }) => {
  const { sessions, liveTickerConfig } = useData();
  const [selectedBatch, setSelectedBatch] = useState<string>('all');
  const [selectedMode, setSelectedMode] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredSessions = sessions.filter((session) => {
    const matchesBatch =
      selectedBatch === 'all' ||
      session.batchName.toLowerCase().includes(selectedBatch.toLowerCase());
    const matchesMode =
      selectedMode === 'all' ||
      session.mode === selectedMode ||
      (selectedMode === 'online' && session.mode === 'hybrid') ||
      (selectedMode === 'physical' && session.mode === 'hybrid');
    const matchesSearch =
      session.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.batchName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.location.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesBatch && matchesMode && matchesSearch;
  });

  const generateIcsFile = (session: ClassSession) => {
    // Generate .ics calendar download for the student
    const icsData = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Sachitha Sankalpa//Class Timetable//EN',
      'BEGIN:VEVENT',
      `SUMMARY:${session.subject} - ${session.batchName}`,
      `DESCRIPTION:${session.subject} by Sachitha Sankalpa (A/L Business Studies). Venue: ${session.location}. Zoom ID: ${session.zoomMeetingId || 'N/A'}`,
      `LOCATION:${session.location}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `${session.batchName.replace(/\s+/g, '_')}_Schedule.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="py-12 bg-transparent transition-colors min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-cyan-400 mb-3">
            <Calendar className="w-3.5 h-3.5" />
            <span>Weekly Class Timetable</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white font-['Space_Grotesk']">
            Master Class Schedule
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-2">
            Explore active physical lecture hall sessions and interactive live Zoom broadcasts.
          </p>
        </div>

        {/* Live Countdown Banner */}
        {liveTickerConfig.isEnabled && (
          <div className="mb-10">
            <LiveClassTicker onNavigateToSchedule={() => {}} onOpenZoom={onOpenZoom} />
          </div>
        )}

        {/* Filter Controls Bar */}
        <div className="p-4 sm:p-6 rounded-3xl bg-white dark:bg-[#0c101a] border border-blue-100 dark:border-blue-950 shadow-sm mb-10 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search subject, batch, or lecture hall..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Batch Filter Buttons */}
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { id: 'all', label: 'All Batches' },
                { id: '2025 Theory', label: '2025 Theory' },
                { id: '2026', label: '2026 Theory' },
                { id: 'Revision', label: 'Revision' },
                { id: 'Paper', label: 'Paper Class' },
              ].map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setSelectedBatch(filter.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedBatch === filter.id
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:text-blue-600'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            {/* Mode Select */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Mode:</span>
              <select
                value={selectedMode}
                onChange={(e) => setSelectedMode(e.target.value)}
                className="px-3 py-2 rounded-xl text-xs font-bold bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Modes (Physical & Zoom)</option>
                <option value="physical">Physical Hall Only</option>
                <option value="online">Online Zoom Only</option>
              </select>
            </div>
          </div>
        </div>

        {/* Schedule List */}
        {filteredSessions.length === 0 ? (
          <div className="text-center py-16 p-8 rounded-3xl bg-white dark:bg-[#0c101a] border border-slate-200 dark:border-slate-800">
            <Calendar className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">No classes match your filter</h3>
            <p className="text-xs text-slate-400 mt-1">Try resetting the search keywords or selecting "All Batches".</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredSessions.map((session) => (
              <BorderGlow
                key={session.id}
                borderRadius={24}
                glowRadius={32}
                edgeSensitivity={22}
                glowIntensity={1.05}
                className="shadow-md"
              >
                <div
                  className="relative rounded-3xl p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6"
                >
                  {/* Left: Timing & Batch Details */}
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-cyan-400">
                        {session.batchName}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300">
                        {session.targetAudience}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        session.mode === 'online'
                          ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
                          : session.mode === 'physical'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}>
                        {session.mode === 'hybrid' ? 'Hybrid (Hall + Zoom)' : session.mode === 'physical' ? 'Physical Hall' : 'Zoom Live Stream'}
                      </span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-['Space_Grotesk']">
                      {session.subject}
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs text-slate-600 dark:text-slate-300 pt-1">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-blue-500 shrink-0" />
                        <span><strong>{session.dayOfWeek}:</strong> {session.time}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                        <span>{session.location} {session.hallNumber && `(${session.hallNumber})`}</span>
                      </div>

                      {session.zoomMeetingId && (
                        <div className="flex items-center gap-2">
                          <Video className="w-4 h-4 text-purple-500 shrink-0" />
                          <span>Zoom ID: <strong>{session.zoomMeetingId}</strong> (Pass: {session.passcode})</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 self-start lg:self-auto border-t lg:border-t-0 border-slate-100 dark:border-slate-800 pt-4 lg:pt-0 shrink-0">
                    <button
                      onClick={() => generateIcsFile(session)}
                      className="btn-glow flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                      title="Add to Calendar (.ics)"
                    >
                      <Download className="w-4 h-4 text-blue-500" />
                      <span>Calendar (.ics)</span>
                    </button>

                    <button
                      onClick={() => {
                        if (onOpenZoom) {
                          onOpenZoom(session.subject, session.batchName);
                        } else {
                          window.open('https://zoom.us', '_blank');
                        }
                      }}
                      className="btn-glow flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md shadow-blue-500/20 transition-all cursor-pointer"
                    >
                      <Video className="w-4 h-4 text-cyan-300" />
                      <span>Join Class</span>
                    </button>

                    <button
                      onClick={onOpenEnroll}
                      className="btn-glow flex items-center gap-1.5 px-4 py-3 rounded-xl text-xs font-bold text-blue-600 dark:text-cyan-400 bg-blue-50/50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 cursor-pointer"
                    >
                      <span>Register</span>
                    </button>
                  </div>
                </div>
              </BorderGlow>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
