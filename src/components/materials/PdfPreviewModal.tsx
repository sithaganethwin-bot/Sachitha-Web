import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { StudyMaterial } from '../../types';
import {
  X,
  Download,
  Printer,
  ZoomIn,
  ZoomOut,
  FileText,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  CheckCircle2
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface PdfPreviewModalProps {
  material: StudyMaterial | null;
  onClose: () => void;
}

export const PdfPreviewModal: React.FC<PdfPreviewModalProps> = ({
  material,
  onClose,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(100);

  // Prevent body scrolling when modal is open
  useEffect(() => {
    if (material) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [material]);

  if (!material) return null;
  if (typeof document === 'undefined') return null;

  const totalPages = 24;

  const handleDownload = () => {
    confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
    alert(`Downloading complete document: ${material.title} (${material.fileSize})`);
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl h-[90vh] rounded-3xl bg-white dark:bg-[#0c101a] border border-blue-200 dark:border-blue-900 shadow-2xl flex flex-col overflow-hidden">
        {/* Document Header Controls */}
        <div className="p-4 bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-cyan-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate max-w-[200px] sm:max-w-md">
                {material.title}
              </h3>
              <p className="text-[11px] text-slate-400">
                {material.batch} • {material.fileSize} • Authorized Document
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Zoom Controls */}
            <div className="hidden sm:flex items-center gap-1 bg-white dark:bg-slate-800 px-2 py-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
              <button
                onClick={() => setZoomLevel(prev => Math.max(75, prev - 15))}
                className="p-1 hover:text-blue-500"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="w-10 text-center font-semibold text-slate-700 dark:text-slate-300">
                {zoomLevel}%
              </span>
              <button
                onClick={() => setZoomLevel(prev => Math.min(150, prev + 15))}
                className="p-1 hover:text-blue-500"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Action Buttons */}
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Document Body Simulation */}
        <div className="flex-1 p-6 overflow-y-auto bg-slate-200/70 dark:bg-[#07090e] flex justify-center">
          <div
            style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
            className="w-full max-w-2xl bg-white dark:bg-[#0f1422] text-slate-900 dark:text-white rounded-2xl shadow-xl p-8 sm:p-12 border border-slate-300 dark:border-slate-800 transition-transform duration-200 min-h-[600px] flex flex-col justify-between"
          >
            <div>
              {/* Top Document Header */}
              <div className="pb-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 dark:text-cyan-400">
                    Sachitha Sankalpa Official Publication
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black font-['Space_Grotesk'] mt-1">
                    {material.title}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Authored by Sachitha Sankalpa (B.Sc. Business Admin Sp. USJ, Reading for M.Sc. HRM UOC)
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950 flex items-center justify-center text-blue-600 dark:text-cyan-400 font-bold shrink-0">
                  A/L
                </div>
              </div>

              {/* Table of Contents / Abstract */}
              <div className="py-6 space-y-4">
                <div className="p-4 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/60 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  <strong>Overview:</strong> {material.description}
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Topics Included in This Module:
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300 font-medium">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      Section 1: Theoretical Concept Maps & Rigorous Geometric Proofs
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      Section 2: 30-Year Past Paper Categorized Problems (1994 - 2024)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      Section 3: Speed Technique Short-cuts & Common Examiner Traps
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      Section 4: Self-Assessment Speed Drills with Full Step-by-Step Marking Schemes
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Bottom Document Stamp */}
            <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <span>G.C.E. Advanced Level Examination Resource</span>
              <span>Page {currentPage} of {totalPages}</span>
            </div>
          </div>
        </div>

        {/* Footer Pagination Controls */}
        <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-600 dark:text-slate-300 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="text-[11px] text-slate-400 hidden sm:block">
            Watermarked for enrolled students of Sachitha Sankalpa
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
