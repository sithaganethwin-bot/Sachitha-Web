import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  Pencil,
  Trash2,
  Layers,
  CheckCircle2,
  FileText,
  X,
  Save,
  ArrowUpDown
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useData } from '../../context/DataContext';
import { LessonUnit } from '../../types';

export const AdminLessonUnitsView: React.FC = () => {
  const { lessonUnits, addLessonUnit, updateLessonUnit, deleteLessonUnit, materials } = useData();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState<LessonUnit | null>(null);

  // Form states
  const [unitNumber, setUnitNumber] = useState<number>(1);
  const [title, setTitle] = useState('');
  const [batch, setBatch] = useState('All Batches');
  const [description, setDescription] = useState('');
  const [order, setOrder] = useState<number>(1);
  const [isActive, setIsActive] = useState(true);

  const handleOpenAdd = () => {
    setEditingUnit(null);
    const nextNum = lessonUnits.length + 1;
    setUnitNumber(nextNum);
    setTitle(`Unit 0${nextNum}: `);
    setBatch('All Batches');
    setDescription('');
    setOrder(nextNum);
    setIsActive(true);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (unit: LessonUnit) => {
    setEditingUnit(unit);
    setUnitNumber(unit.unitNumber);
    setTitle(unit.title);
    setBatch(unit.batch);
    setDescription(unit.description);
    setOrder(unit.order);
    setIsActive(unit.isActive);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingUnit) {
      updateLessonUnit(editingUnit.id, {
        unitNumber: Number(unitNumber),
        title: title.trim(),
        batch: batch.trim(),
        description: description.trim(),
        order: Number(order),
        isActive
      });
    } else {
      addLessonUnit({
        unitNumber: Number(unitNumber),
        title: title.trim(),
        batch: batch.trim(),
        description: description.trim(),
        order: Number(order),
        isActive
      });
      confetti({ particleCount: 50, spread: 60 });
    }

    setIsModalOpen(false);
  };

  const sortedUnits = [...lessonUnits].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-[#0c101a] border border-slate-200 dark:border-blue-950">
        <div>
          <h3 className="font-black text-lg text-slate-900 dark:text-white font-['Space_Grotesk'] flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-500" />
            <span>A/L Syllabus Lesson Units CMS</span>
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Define units to group study materials, theory packs, short notes, and model questions systematically.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-500 text-white shadow-md transition cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Lesson Unit</span>
        </button>
      </div>

      {/* Units Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedUnits.map((unit) => {
          const linkedMaterials = materials.filter(m => m.unitId === unit.id || m.unitNumber === unit.unitNumber);

          return (
            <div
              key={unit.id}
              className="p-5 rounded-2xl bg-white dark:bg-[#0c101a] border border-slate-200 dark:border-blue-950/80 flex flex-col justify-between shadow-sm relative group hover:border-indigo-500/50 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                    Unit {unit.unitNumber.toString().padStart(2, '0')}
                  </span>

                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    unit.isActive
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-slate-100 text-slate-500 dark:bg-slate-800'
                  }`}>
                    {unit.isActive ? 'Active' : 'Hidden'}
                  </span>
                </div>

                <h4 className="font-bold text-sm text-slate-900 dark:text-white leading-snug line-clamp-2">
                  {unit.title}
                </h4>

                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2">
                  {unit.description || 'No unit description provided.'}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <span>Batch: <strong className="text-slate-600 dark:text-slate-300">{unit.batch}</strong></span>
                  <span className="flex items-center gap-1 text-indigo-500 font-bold">
                    <FileText className="w-3.5 h-3.5" />
                    <span>{linkedMaterials.length} Materials</span>
                  </span>
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">Order: #{unit.order}</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEdit(unit)}
                    className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 text-indigo-600 dark:text-indigo-400 transition cursor-pointer"
                    title="Edit Unit"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => {
                      if (confirm(`Delete lesson unit "${unit.title}"? Materials linked to this unit will be unlinked.`)) {
                        deleteLessonUnit(unit.id);
                      }
                    }}
                    className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 text-rose-600 transition cursor-pointer"
                    title="Delete Unit"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Add/Edit Lesson Unit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-[#0c101a] border border-blue-900 shadow-2xl p-6 sm:p-8">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-lg font-bold font-['Space_Grotesk'] text-slate-900 dark:text-white">
                {editingUnit ? 'Edit Lesson Unit' : 'Create New Lesson Unit'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Unit Number *</label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    required
                    value={unitNumber}
                    onChange={(e) => setUnitNumber(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Display Order #</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={order}
                    onChange={(e) => setOrder(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Unit Title (Sinhala / English) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Unit 01: ව්‍යාපාර පරිසරය හා හැඳින්වීම (Introduction to Business)"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Target Batch</label>
                <input
                  type="text"
                  value={batch}
                  onChange={(e) => setBatch(e.target.value)}
                  placeholder="e.g. All Batches, 2027 Batch"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Unit Description & Scope</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Briefly describe what theory, sub-topics, or competencies are covered in this unit..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="unit-active"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 cursor-pointer"
                />
                <label htmlFor="unit-active" className="font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
                  Unit is Visible on Website & Student Portal
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Unit</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
