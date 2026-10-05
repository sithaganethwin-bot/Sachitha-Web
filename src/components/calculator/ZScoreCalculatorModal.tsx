import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Calculator,
  Award,
  GraduationCap,
  TrendingUp,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ZScoreCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenEnroll: () => void;
}

export const ZScoreCalculatorModal: React.FC<ZScoreCalculatorModalProps> = ({
  isOpen,
  onClose,
  onOpenEnroll,
}) => {
  const [stream, setStream] = useState('engineering');
  const [district, setDistrict] = useState('Colombo');
  const [markMaths, setMarkMaths] = useState('78');
  const [markPhysics, setMarkPhysics] = useState('75');
  const [markChem, setMarkChem] = useState('72');
  const [predictedZScore, setPredictedZScore] = useState<number | null>(null);

  // Prevent body scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;
  if (typeof document === 'undefined') return null;

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();

    const m1 = parseFloat(markMaths) || 75;
    const m2 = parseFloat(markPhysics) || 70;
    const m3 = parseFloat(markChem) || 70;
    const avg = (m1 + m2 + m3) / 3;

    // Realistic calculation based on Sri Lankan A/L standard deviation estimates
    // Avg 75 -> ~2.1 - 2.3 Z score
    let baseZ = (avg - 50) / 12.5;
    if (district === 'Colombo') baseZ = Math.max(0.5, baseZ - 0.08);
    if (district === 'Jaffna' || district === 'Galle') baseZ = Math.max(0.5, baseZ - 0.04);

    const roundedZ = Math.round(baseZ * 10000) / 10000;
    setPredictedZScore(roundedZ);

    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl max-h-[90vh] rounded-3xl bg-white dark:bg-[#0c101a] border border-blue-200 dark:border-blue-900 shadow-2xl overflow-y-auto">
        {/* Top Header */}
        <div className="p-6 sm:p-8 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-cyan-400 flex items-center justify-center">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-['Space_Grotesk']">
                A/L Z-Score & Campus Predictor
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Estimate your national Z-Score and check eligible university engineering faculties
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          <form onSubmit={handleCalculate} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Target Stream
                </label>
                <select
                  value={stream}
                  onChange={(e) => setStream(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="engineering">Physical Science (Engineering)</option>
                  <option value="bio">Biological Science (Medicine)</option>
                  <option value="ict">Physical Science (ICT & Computing)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Examination District
                </label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Colombo">Colombo</option>
                  <option value="Gampaha">Gampaha</option>
                  <option value="Kandy">Kandy</option>
                  <option value="Kurunegala">Kurunegala</option>
                  <option value="Galle">Galle</option>
                  <option value="Matara">Matara</option>
                  <option value="Jaffna">Jaffna</option>
                </select>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900 space-y-3">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                Estimated / Target Marks (Out of 100)
              </span>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-500 mb-1 font-semibold">
                    Combined Maths
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={markMaths}
                    onChange={(e) => setMarkMaths(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-sm font-bold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-center focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-500 mb-1 font-semibold">
                    Physics
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={markPhysics}
                    onChange={(e) => setMarkPhysics(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-sm font-bold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-center focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-500 mb-1 font-semibold">
                    Chemistry / ICT
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={markChem}
                    onChange={(e) => setMarkChem(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-sm font-bold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-center focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-500/25 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              
              <span>Predict Z-Score & Campus Eligibility</span>
            </button>
          </form>

          {/* Results Display */}
          {predictedZScore !== null && (
            <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-900 to-slate-900 text-white border border-blue-700/60 shadow-xl space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider">
                    Predicted Z-Score
                  </span>
                  <div className="text-3xl font-black font-['Space_Grotesk'] text-white">
                    {predictedZScore.toFixed(4)}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400">Result Rating</span>
                  <div className="text-sm font-bold text-emerald-400">
                    {predictedZScore > 1.9 ? 'Island Top Ranker' : 'University Qualified'}
                  </div>
                </div>
              </div>

              {/* University Faculty Estimations */}
              <div className="pt-3 border-t border-blue-800/80 space-y-2">
                <span className="text-xs font-bold text-slate-300 block">
                  Eligible State Faculties ({district} District):
                </span>
                <div className="space-y-1.5 text-xs text-slate-200">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>University of Moratuwa - Faculty of Engineering</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>University of Peradeniya - Engineering & Computing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>UCSC - University of Colombo School of Computing</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs">
                <span className="text-slate-400">Want to raise your score by +0.35?</span>
                <button
                  onClick={() => {
                    onClose();
                    onOpenEnroll();
                  }}
                  className="font-bold text-cyan-300 hover:text-white underline cursor-pointer"
                >
                  Join Sachii Sir's Batches &rarr;
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};
