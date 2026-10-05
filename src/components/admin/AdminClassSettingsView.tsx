import React, { useState } from 'react';
import {
  Layers,
  Radio,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  X,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
  Eye,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useData } from '../../context/DataContext';
import { ClassOptionItem, ClassModeItem } from '../../types';

const BATCH_LIST = ['2028 Batch', '2027 Batch', '2026 Batch'];

export const AdminClassSettingsView: React.FC = () => {
  const {
    classOptions,
    addClassOption,
    updateClassOption,
    deleteClassOption,
    classModes,
    addClassMode,
    updateClassMode,
    deleteClassMode,
  } = useData();

  const [activeSubTab, setActiveSubTab] = useState<'options' | 'modes'>('options');

  // --- Class Option Form State ---
  const [optionBatch, setOptionBatch] = useState('2027 Batch');
  const [optionTitle, setOptionTitle] = useState('');
  const [optionDescription, setOptionDescription] = useState('');
  const [optionBadge, setOptionBadge] = useState('');
  const [optionFee, setOptionFee] = useState('');
  const [editingOptionId, setEditingOptionId] = useState<string | null>(null);

  // --- Class Mode Form State ---
  const [modeName, setModeName] = useState('');
  const [modeType, setModeType] = useState<'online' | 'physical'>('online');
  const [modeDescription, setModeDescription] = useState('');
  const [editingModeId, setEditingModeId] = useState<string | null>(null);

  const [msg, setMsg] = useState('');

  // Handle Class Option Save
  const handleSaveOption = (e: React.FormEvent) => {
    e.preventDefault();
    if (!optionTitle.trim()) {
      alert('Please enter a title for the Class Option.');
      return;
    }

    if (editingOptionId) {
      updateClassOption(editingOptionId, {
        batch: optionBatch,
        title: optionTitle.trim(),
        description: optionDescription.trim(),
        badge: optionBadge.trim() || undefined,
        fee: optionFee.trim() || undefined,
      });
      setMsg('Class Option updated successfully!');
      setEditingOptionId(null);
    } else {
      addClassOption({
        batch: optionBatch,
        title: optionTitle.trim(),
        description: optionDescription.trim(),
        badge: optionBadge.trim() || undefined,
        fee: optionFee.trim() || undefined,
        isActive: true,
      });
      setMsg('New Class Option added to registration form!');
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    }

    setOptionTitle('');
    setOptionDescription('');
    setOptionBadge('');
    setOptionFee('');
    setTimeout(() => setMsg(''), 3000);
  };

  const startEditOption = (opt: ClassOptionItem) => {
    setEditingOptionId(opt.id);
    setOptionBatch(opt.batch);
    setOptionTitle(opt.title);
    setOptionDescription(opt.description || '');
    setOptionBadge(opt.badge || '');
    setOptionFee(opt.fee || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle Class Mode Save
  const handleSaveMode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modeName.trim()) {
      alert('Please enter a name for the Class Mode.');
      return;
    }

    if (editingModeId) {
      updateClassMode(editingModeId, {
        name: modeName.trim(),
        type: modeType,
        description: modeDescription.trim(),
      });
      setMsg('Class Mode updated successfully!');
      setEditingModeId(null);
    } else {
      addClassMode({
        name: modeName.trim(),
        type: modeType,
        description: modeDescription.trim(),
        isActive: true,
      });
      setMsg('New Class Mode added to registration form!');
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    }

    setModeName('');
    setModeDescription('');
    setTimeout(() => setMsg(''), 3000);
  };

  const startEditMode = (mode: ClassModeItem) => {
    setEditingModeId(mode.id);
    setModeName(mode.name);
    setModeType(mode.type);
    setModeDescription(mode.description || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black font-['Space_Grotesk'] text-slate-900 dark:text-white">
            Class Options & Modes Manager
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Configure the exact <strong>Class Options</strong> and <strong>Class Modes</strong> displayed on the Student Registration Form.
          </p>
        </div>

        {/* Sub-tab Pill Switcher */}
        <div className="flex items-center p-1 bg-slate-200 dark:bg-slate-900 rounded-xl">
          <button
            onClick={() => setActiveSubTab('options')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeSubTab === 'options'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Class Options ({classOptions.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('modes')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeSubTab === 'modes'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Class Modes ({classModes.length})</span>
          </button>
        </div>
      </div>

      {msg && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{msg}</span>
        </div>
      )}

      {/* ============================================================== */}
      {/* SUBTAB 1: CLASS OPTIONS (Renamed from Class Module Options)    */}
      {/* ============================================================== */}
      {activeSubTab === 'options' && (
        <div className="space-y-6">
          {/* Add / Edit Form Card */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#0c101a] border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
              <span>{editingOptionId ? 'Edit Class Option' : 'Add New Class Option'}</span>
            </h3>

            <form onSubmit={handleSaveOption} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Target Batch *
                  </label>
                  <select
                    value={optionBatch}
                    onChange={(e) => setOptionBatch(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    {BATCH_LIST.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Class Option Title *
                  </label>
                  <input
                    type="text"
                    value={optionTitle}
                    onChange={(e) => setOptionTitle(e.target.value)}
                    placeholder="e.g. 2027 BS Theory (Comprehensive)"
                    required
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Description / Scope (Optional)
                  </label>
                  <input
                    type="text"
                    value={optionDescription}
                    onChange={(e) => setOptionDescription(e.target.value)}
                    placeholder="e.g. Full syllabus coverage, past paper derivations & unit tests"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Badge Tag (Optional)
                  </label>
                  <input
                    type="text"
                    value={optionBadge}
                    onChange={(e) => setOptionBadge(e.target.value)}
                    placeholder="e.g. Recommended / Core Theory"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                {editingOptionId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingOptionId(null);
                      setOptionTitle('');
                      setOptionDescription('');
                      setOptionBadge('');
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-semibold border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 cursor-pointer"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{editingOptionId ? 'Update Option' : 'Add Class Option'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Grouped by Batch Listing */}
          <div className="space-y-4">
            {BATCH_LIST.map((batchName) => {
              const batchOptions = classOptions.filter((o) => o.batch === batchName);
              return (
                <div
                  key={batchName}
                  className="p-5 rounded-2xl bg-white dark:bg-[#0c101a] border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                        {batchName}
                      </span>
                      <span className="text-[11px] text-blue-600 dark:text-cyan-400 font-semibold bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded-full">
                        {batchOptions.length} Options
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {batchOptions.length > 0 ? (
                      batchOptions.map((opt) => (
                        <div
                          key={opt.id}
                          className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-xs"
                        >
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900 dark:text-white">
                                {opt.title}
                              </span>
                              {opt.badge && (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-cyan-300">
                                  {opt.badge}
                                </span>
                              )}
                              {opt.isActive === false && (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                                  Disabled
                                </span>
                              )}
                            </div>
                            {opt.description && (
                              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                {opt.description}
                              </p>
                            )}
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              onClick={() =>
                                updateClassOption(opt.id, {
                                  isActive: opt.isActive === false ? true : false,
                                })
                              }
                              className={`p-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                                opt.isActive !== false
                                  ? 'text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
                                  : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                              }`}
                              title={opt.isActive !== false ? 'Active on registration form' : 'Disabled'}
                            >
                              {opt.isActive !== false ? (
                                <CheckCircle2 className="w-4 h-4" />
                              ) : (
                                <ToggleLeft className="w-4 h-4" />
                              )}
                            </button>

                            <button
                              onClick={() => startEditOption(opt)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                              title="Edit Class Option"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => {
                                if (confirm(`Delete "${opt.title}"?`)) {
                                  deleteClassOption(opt.id);
                                }
                              }}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
                              title="Delete Class Option"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-400 italic py-2">
                        No Class Options added for {batchName}.
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SUBTAB 2: CLASS MODES (Renamed from Delivery Mode / Location)  */}
      {/* ============================================================== */}
      {activeSubTab === 'modes' && (
        <div className="space-y-6">
          {/* Add / Edit Form Card */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#0c101a] border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Radio className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
              <span>{editingModeId ? 'Edit Class Mode' : 'Add New Class Mode'}</span>
            </h3>

            <form onSubmit={handleSaveMode} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Class Mode Name *
                  </label>
                  <input
                    type="text"
                    value={modeName}
                    onChange={(e) => setModeName(e.target.value)}
                    placeholder="e.g. Online (with Zoom) or Sasip Institute, Nugegoda"
                    required
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Mode Type *
                  </label>
                  <select
                    value={modeType}
                    onChange={(e) => setModeType(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
                  >
                    <option value="online">Online Stream / LMS</option>
                    <option value="physical">Physical Institute Hall</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Location / Venue Description (Optional)
                </label>
                <input
                  type="text"
                  value={modeDescription}
                  onChange={(e) => setModeDescription(e.target.value)}
                  placeholder="e.g. High-speed interactive Zoom stream or Hall A, Air Conditioned"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                {editingModeId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingModeId(null);
                      setModeName('');
                      setModeDescription('');
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-semibold border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 cursor-pointer"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{editingModeId ? 'Update Mode' : 'Add Class Mode'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Listing Grid */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#0c101a] border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800">
              Active Class Delivery Modes
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {classModes.map((mode) => (
                <div
                  key={mode.id}
                  className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-start justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-white">
                        {mode.name}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          mode.type === 'online'
                            ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-cyan-300'
                            : 'bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300'
                        }`}
                      >
                        {mode.type === 'online' ? 'Online' : 'Physical'}
                      </span>
                    </div>
                    {mode.description && (
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {mode.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() =>
                        updateClassMode(mode.id, {
                          isActive: mode.isActive === false ? true : false,
                        })
                      }
                      className={`p-1.5 rounded-lg cursor-pointer ${
                        mode.isActive !== false ? 'text-emerald-600' : 'text-slate-400'
                      }`}
                      title={mode.isActive !== false ? 'Active' : 'Disabled'}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => startEditMode(mode)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 cursor-pointer"
                      title="Edit Mode"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => {
                        if (confirm(`Delete "${mode.name}"?`)) {
                          deleteClassMode(mode.id);
                        }
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 cursor-pointer"
                      title="Delete Mode"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
