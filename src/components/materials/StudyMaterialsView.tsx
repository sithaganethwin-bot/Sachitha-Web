import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { StudyMaterial, LessonUnit } from '../../types';
import { useAuth } from '../../context/AuthContext';
import {
  BookOpen,
  Search,
  Download,
  Lock,
  Unlock,
  Eye,
  CheckCircle2,
  FileText,
  Layers,
  ChevronRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PdfPreviewModal } from './PdfPreviewModal';
import { BorderGlow } from '../common/BorderGlow';

export const StudyMaterialsView: React.FC = () => {
  const { materials, lessonUnits } = useData();
  const { isLoggedIn, openLoginModal } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedUnit, setSelectedUnit] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'by_unit' | 'grid'>('by_unit');
  const [downloadNotification, setDownloadNotification] = useState<string | null>(null);
  const [previewMaterial, setPreviewMaterial] = useState<StudyMaterial | null>(null);

  const categories = [
    { id: 'all', label: 'All Resources' },
    { id: 'theory_modules', label: 'Theory Modules' },
    { id: 'short_notes', label: 'Short Notes & Pocket Sheets' },
    { id: 'model_papers', label: 'Model Papers' },
    { id: 'past_papers', label: 'Past Papers Bank' },
    { id: 'marking_schemes', label: 'Marking Schemes' },
  ];

  const filteredMaterials = materials.filter((mat) => {
    const matchesCategory =
      selectedCategory === 'all' || mat.category === selectedCategory;
    const matchesSearch =
      mat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mat.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mat.batch.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesUnit =
      selectedUnit === 'all' || mat.unitId === selectedUnit;

    return matchesCategory && matchesSearch && matchesUnit;
  });

  const handleDownload = (material: StudyMaterial) => {
    if (material.isLocked && !isLoggedIn) {
      openLoginModal();
      return;
    }

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 }
    });

    setDownloadNotification(`Downloading "${material.title}" (${material.fileSize})...`);
    setTimeout(() => setDownloadNotification(null), 3500);
  };

  const handlePreview = (material: StudyMaterial) => {
    if (material.isLocked && !isLoggedIn) {
      openLoginModal();
      return;
    }
    setPreviewMaterial(material);
  };

  return (
    <div className="py-12 bg-transparent transition-colors min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-cyan-400 mb-3">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Digital Study Repository</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white font-['Space_Grotesk']">
            Study Materials & Question Bank
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-2">
            Organized lesson-by-lesson: high-yield summary notes, theory derivations, official marking schemes, and exclusive model papers.
          </p>
        </div>

        {/* Download Notification Banner */}
        {downloadNotification && (
          <div className="max-w-md mx-auto p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs flex items-center justify-between shadow-lg animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span className="font-semibold">{downloadNotification}</span>
            </div>
          </div>
        )}

        {/* Search & Category Filter Controls */}
        <div className="p-4 sm:p-6 rounded-3xl bg-white dark:bg-[#0c101a] border border-blue-100 dark:border-blue-950 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search business environment, management, model questions, marking scheme..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* View Mode Toggle: By Unit vs All Grid */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 shrink-0">
              <button
                onClick={() => setViewMode('by_unit')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  viewMode === 'by_unit'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Group by Lesson Units</span>
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>All Documents</span>
              </button>
            </div>

            {/* Quick Login Reminder status */}
            {!isLoggedIn ? (
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <Lock className="w-3.5 h-3.5 text-amber-500" />
                <span>Enrolled student?</span>
                <button
                  onClick={openLoginModal}
                  className="font-bold text-blue-600 dark:text-cyan-400 hover:underline cursor-pointer"
                >
                  Log in to unlock all
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                <Unlock className="w-3.5 h-3.5" />
                <span>Student pass active</span>
              </div>
            )}
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-800/80">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* View Mode 1: Grouped by Lesson Units */}
        {viewMode === 'by_unit' ? (
          <div className="space-y-6">
            {lessonUnits
              .sort((a, b) => a.order - b.order)
              .map((unit) => {
                const unitMats = filteredMaterials.filter(
                  (m) => m.unitId === unit.id || m.unitNumber === unit.unitNumber
                );

                return (
                  <div
                    key={unit.id}
                    className="rounded-3xl bg-white dark:bg-[#0c101a] border border-blue-100 dark:border-blue-950 overflow-hidden shadow-sm"
                  >
                    {/* Unit Title Bar */}
                    <div className="p-5 sm:p-6 bg-slate-50/80 dark:bg-slate-900/60 border-b border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <span className="px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider bg-indigo-600 text-white shrink-0 mt-0.5">
                          Unit {unit.unitNumber.toString().padStart(2, '0')}
                        </span>
                        <div>
                          <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white font-['Space_Grotesk']">
                            {unit.title}
                          </h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            {unit.description}
                          </p>
                        </div>
                      </div>

                      <span className="text-xs font-bold text-slate-400 shrink-0">
                        {unitMats.length} Materials
                      </span>
                    </div>

                    {/* Unit Materials Grid */}
                    <div className="p-5 sm:p-6">
                      {unitMats.length === 0 ? (
                        <div className="py-6 text-center text-xs text-slate-400">
                          Materials for this unit are being prepared and will be uploaded shortly.
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {unitMats.map((mat) => (
                            <div
                              key={mat.id}
                              className="p-4 rounded-2xl bg-slate-50/60 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between space-y-3 hover:border-indigo-500/40 transition"
                            >
                              <div className="space-y-1.5">
                                <div className="flex items-center justify-between text-[10px] font-bold">
                                  <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-cyan-300 uppercase">
                                    {mat.category.replace('_', ' ')}
                                  </span>
                                  {mat.isLocked ? (
                                    <span className="flex items-center gap-1 text-amber-500 font-bold">
                                      <Lock className="w-3 h-3" /> Enrolled Only
                                    </span>
                                  ) : (
                                    <span className="flex items-center gap-1 text-emerald-500 font-bold">
                                      <Unlock className="w-3 h-3" /> Public
                                    </span>
                                  )}
                                </div>

                                <h4 className="font-bold text-xs text-slate-900 dark:text-white line-clamp-2">
                                  {mat.title}
                                </h4>

                                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                                  {mat.description}
                                </p>
                              </div>

                              <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-xs">
                                <span className="text-[10px] text-slate-400 font-medium">PDF • {mat.fileSize}</span>
                                <div className="flex items-center gap-1.5">
                                  <button
                                    onClick={() => handlePreview(mat)}
                                    className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 dark:hover:text-cyan-400 cursor-pointer"
                                    title="Preview PDF"
                                  >
                                    <Eye className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleDownload(mat)}
                                    className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                                  >
                                    <Download className="w-3.5 h-3.5" />
                                    <span>Download</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        ) : (
          /* View Mode 2: Standard Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMaterials.map((material) => (
              <BorderGlow
                key={material.id}
                borderRadius={24}
                glowRadius={30}
                className="h-full flex flex-col"
                innerClassName="h-full flex flex-col"
              >
                <div className="p-6 rounded-3xl bg-white dark:bg-[#0c101a] border border-blue-100 dark:border-blue-950/80 flex flex-col justify-between flex-1 space-y-5 hover:border-blue-300 dark:hover:border-blue-800 transition-all shadow-sm">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-cyan-400 border border-blue-200 dark:border-blue-900/50 uppercase tracking-wider">
                        {material.category.replace('_', ' ')}
                      </span>
                      {material.isLocked ? (
                        <span className="flex items-center gap-1 text-[11px] font-bold text-amber-500 dark:text-amber-400">
                          <Lock className="w-3.5 h-3.5" />
                          <span>Student Only</span>
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                          <Unlock className="w-3.5 h-3.5" />
                          <span>Open Access</span>
                        </span>
                      )}
                    </div>

                    <h3 className="font-bold text-base text-slate-900 dark:text-white leading-snug">
                      {material.title}
                    </h3>

                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {material.description}
                    </p>
                  </div>

                  <div className="space-y-4 pt-2">
                    <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-100 dark:border-slate-800/80 pt-3">
                      <span>{material.fileFormat} • {material.fileSize}</span>
                      <span>{material.publishedDate}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handlePreview(material)}
                        className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 font-bold text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Eye className="w-4 h-4" />
                        <span>Preview</span>
                      </button>

                      <button
                        onClick={() => handleDownload(material)}
                        className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download</span>
                      </button>
                    </div>
                  </div>
                </div>
              </BorderGlow>
            ))}
          </div>
        )}

        {/* Modal: PDF Preview */}
        {previewMaterial && (
          <PdfPreviewModal
            material={previewMaterial}
            onClose={() => setPreviewMaterial(null)}
          />
        )}
      </div>
    </div>
  );
};
