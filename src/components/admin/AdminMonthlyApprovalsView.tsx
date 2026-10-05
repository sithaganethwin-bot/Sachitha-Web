import React, { useState, useMemo } from 'react';
import {
  Calendar,
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  Users,
  CreditCard,
  BookOpen,
  FileText,
  ArrowRight,
  ShieldCheck,
  Clock,
  HelpCircle,
  Save,
  Check,
  ChevronDown
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useData } from '../../context/DataContext';
import { MonthlyStudentApproval, RegisteredAccount } from '../../types';

export const AdminMonthlyApprovalsView: React.FC = () => {
  const {
    registeredStudents,
    monthlyApprovals,
    updateMonthlyApproval,
    batchUpdateMonthlyApprovals,
  } = useData();

  // Current selected month: default to current "2026-10"
  const [selectedMonth, setSelectedMonth] = useState('2026-10');
  const [searchQuery, setSearchQuery] = useState('');
  const [batchFilter, setBatchFilter] = useState('all');
  const [classFilter, setClassFilter] = useState<'all' | 'theory' | 'paper' | 'both' | 'none'>('all');
  const [feeFilter, setFeeFilter] = useState<'all' | 'paid' | 'pending' | 'free_scholarship'>('all');

  const [notification, setNotification] = useState<string | null>(null);

  const months = [
    { id: '2026-09', label: 'September 2026' },
    { id: '2026-10', label: 'October 2026 (Active)' },
    { id: '2026-11', label: 'November 2026' },
    { id: '2026-12', label: 'December 2026' },
    { id: '2027-01', label: 'January 2027' },
  ];

  // Merge registered students with existing monthly approvals for selected month
  const consolidatedList = useMemo(() => {
    // Collect all registered students + any sample approvals
    const studentMap = new Map<string, { student: Partial<RegisteredAccount>; approval: MonthlyStudentApproval }>();

    // 1. Seed from registered students
    registeredStudents.forEach((student) => {
      const existing = monthlyApprovals.find(
        (a) => (a.studentId === student.id || a.studentIndex === student.indexNo) && a.month === selectedMonth
      );

      const defaultApproval: MonthlyStudentApproval = existing || {
        id: `appr-${student.id}-${selectedMonth}`,
        studentId: student.id,
        studentIndex: student.indexNo,
        studentName: `${student.firstName} ${student.lastName}`,
        studentEmail: student.email,
        batch: student.batch,
        month: selectedMonth,
        // Auto-approve theory if registered mode has theory, or default true for new enrollments
        theoryApproved: student.classOption?.toLowerCase().includes('theory') ?? true,
        paperApproved: student.classOption?.toLowerCase().includes('paper') ?? false,
        revisionApproved: student.classOption?.toLowerCase().includes('revision') ?? false,
        feeStatus: 'paid',
        notes: 'Monthly enrollment',
        approvedAt: new Date().toISOString(),
      };

      studentMap.set(student.id, {
        student,
        approval: defaultApproval,
      });
    });

    // 2. Add any approvals in store not currently in registered accounts (e.g. mock seeds)
    monthlyApprovals
      .filter((a) => a.month === selectedMonth)
      .forEach((appr) => {
        if (!studentMap.has(appr.studentId)) {
          studentMap.set(appr.studentId, {
            student: {
              id: appr.studentId,
              firstName: appr.studentName.split(' ')[0],
              lastName: appr.studentName.split(' ').slice(1).join(' '),
              indexNo: appr.studentIndex,
              email: appr.studentEmail,
              batch: appr.batch,
              classMode: 'Online (with Zoom)',
              status: 'active',
            },
            approval: appr,
          });
        }
      });

    return Array.from(studentMap.values());
  }, [registeredStudents, monthlyApprovals, selectedMonth]);

  // Filtered list
  const filteredList = useMemo(() => {
    return consolidatedList.filter(({ student, approval }) => {
      // Search
      const search = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        approval.studentName.toLowerCase().includes(search) ||
        approval.studentIndex.toLowerCase().includes(search) ||
        approval.studentEmail.toLowerCase().includes(search) ||
        (student.whatsapp && student.whatsapp.includes(search));

      // Batch
      const matchesBatch = batchFilter === 'all' || approval.batch === batchFilter;

      // Class
      let matchesClass = true;
      if (classFilter === 'theory') matchesClass = approval.theoryApproved;
      else if (classFilter === 'paper') matchesClass = approval.paperApproved;
      else if (classFilter === 'both') matchesClass = approval.theoryApproved && approval.paperApproved;
      else if (classFilter === 'none') matchesClass = !approval.theoryApproved && !approval.paperApproved;

      // Fee
      const matchesFee = feeFilter === 'all' || approval.feeStatus === feeFilter;

      return matchesSearch && matchesBatch && matchesClass && matchesFee;
    });
  }, [consolidatedList, searchQuery, batchFilter, classFilter, feeFilter]);

  // Statistics
  const stats = useMemo(() => {
    const total = consolidatedList.length;
    const theoryCount = consolidatedList.filter((c) => c.approval.theoryApproved).length;
    const paperCount = consolidatedList.filter((c) => c.approval.paperApproved).length;
    const bothCount = consolidatedList.filter((c) => c.approval.theoryApproved && c.approval.paperApproved).length;
    const paidCount = consolidatedList.filter((c) => c.approval.feeStatus === 'paid').length;
    const pendingCount = consolidatedList.filter((c) => c.approval.feeStatus === 'pending').length;

    return { total, theoryCount, paperCount, bothCount, paidCount, pendingCount };
  }, [consolidatedList]);

  const handleToggle = (
    item: { student: Partial<RegisteredAccount>; approval: MonthlyStudentApproval },
    field: 'theoryApproved' | 'paperApproved' | 'revisionApproved'
  ) => {
    const updated: MonthlyStudentApproval = {
      ...item.approval,
      [field]: !item.approval[field],
      month: selectedMonth,
      approvedAt: new Date().toISOString(),
    };
    updateMonthlyApproval(updated);

    const label = field === 'theoryApproved' ? 'Theory Class' : field === 'paperApproved' ? 'Paper Class' : 'Revision Class';
    setNotification(`${updated.studentName}: ${label} ${updated[field] ? 'APPROVED' : 'REVOKED'}`);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleFeeStatusChange = (
    item: { student: Partial<RegisteredAccount>; approval: MonthlyStudentApproval },
    feeStatus: MonthlyStudentApproval['feeStatus']
  ) => {
    const updated: MonthlyStudentApproval = {
      ...item.approval,
      feeStatus,
      month: selectedMonth,
      approvedAt: new Date().toISOString(),
    };
    updateMonthlyApproval(updated);
    setNotification(`${updated.studentName}: Fee status set to ${feeStatus.toUpperCase()}`);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleBulkApproveTheory = () => {
    const ids = filteredList.map((i) => i.approval.studentId);
    batchUpdateMonthlyApprovals(selectedMonth, ids, { theoryApproved: true });
    confetti({ particleCount: 50, spread: 60 });
    setNotification(`Approved Theory Class for ${ids.length} students for ${selectedMonth}`);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleBulkApprovePaper = () => {
    const ids = filteredList.map((i) => i.approval.studentId);
    batchUpdateMonthlyApprovals(selectedMonth, ids, { paperApproved: true });
    confetti({ particleCount: 50, spread: 60 });
    setNotification(`Approved Paper Class for ${ids.length} students for ${selectedMonth}`);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleBulkMarkPaid = () => {
    const ids = filteredList.map((i) => i.approval.studentId);
    batchUpdateMonthlyApprovals(selectedMonth, ids, { feeStatus: 'paid' });
    confetti({ particleCount: 50, spread: 60 });
    setNotification(`Marked fees as PAID for ${ids.length} students for ${selectedMonth}`);
    setTimeout(() => setNotification(null), 3500);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner & Month Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-blue-900/40 via-indigo-950/40 to-slate-900/60 border border-blue-500/30">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-blue-500/20 text-cyan-300 border border-blue-500/30 mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Monthly Access & Fee Approval System</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white font-['Space_Grotesk']">
            Student Class Approvals by Month
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Sir can approve or revoke individual student access to <strong>Theory Class</strong> and <strong>Paper Class</strong> for each month.
          </p>
        </div>

        {/* Month Selector Pill */}
        <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-700/80 p-1.5 rounded-2xl shrink-0">
          <Calendar className="w-4 h-4 text-cyan-400 ml-2" />
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="bg-transparent text-white font-bold text-xs py-1.5 px-2 rounded-xl focus:outline-none cursor-pointer"
          >
            {months.map((m) => (
              <option key={m.id} value={m.id} className="bg-slate-900 text-white">
                {m.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{notification}</span>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-4 rounded-2xl bg-white dark:bg-[#0c101a] border border-slate-200 dark:border-blue-950">
          <div className="text-[10px] font-bold uppercase text-slate-400">Total Enrolled</div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">{stats.total}</div>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-[#0c101a] border border-slate-200 dark:border-blue-950">
          <div className="text-[10px] font-bold uppercase text-blue-500">Theory Approved</div>
          <div className="text-2xl font-black text-blue-600 dark:text-cyan-400 mt-1">{stats.theoryCount}</div>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-[#0c101a] border border-slate-200 dark:border-blue-950">
          <div className="text-[10px] font-bold uppercase text-purple-500">Paper Approved</div>
          <div className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-1">{stats.paperCount}</div>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-[#0c101a] border border-slate-200 dark:border-blue-950">
          <div className="text-[10px] font-bold uppercase text-indigo-500">Theory + Paper</div>
          <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">{stats.bothCount}</div>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-[#0c101a] border border-slate-200 dark:border-blue-950">
          <div className="text-[10px] font-bold uppercase text-emerald-500">Fees Paid</div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{stats.paidCount}</div>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-[#0c101a] border border-slate-200 dark:border-blue-950">
          <div className="text-[10px] font-bold uppercase text-amber-500">Fees Pending</div>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">{stats.pendingCount}</div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-3xl bg-white dark:bg-[#0c101a] border border-slate-200 dark:border-blue-950 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by student name, index no (BS-...), email, or WhatsApp..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Batch Filter */}
            <select
              value={batchFilter}
              onChange={(e) => setBatchFilter(e.target.value)}
              className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="all">All Batches</option>
              <option value="2027 Batch">2027 Batch</option>
              <option value="2026 Batch">2026 Batch</option>
              <option value="2025 Batch">2025 Batch</option>
            </select>

            {/* Class Filter */}
            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value as any)}
              className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="all">All Approvals</option>
              <option value="theory">Theory Class Approved</option>
              <option value="paper">Paper Class Approved</option>
              <option value="both">Both Classes Approved</option>
              <option value="none">No Class Approved</option>
            </select>

            {/* Fee Filter */}
            <select
              value={feeFilter}
              onChange={(e) => setFeeFilter(e.target.value as any)}
              className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="all">All Fee Status</option>
              <option value="paid">Fee Paid</option>
              <option value="pending">Fee Pending</option>
              <option value="free_scholarship">Free / Scholarship</option>
            </select>
          </div>
        </div>

        {/* Bulk Action Controls */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between flex-wrap gap-2 text-xs">
          <span className="text-slate-400">
            Showing <strong>{filteredList.length}</strong> students for <strong>{selectedMonth}</strong>
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={handleBulkApproveTheory}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-500/10 text-blue-600 dark:text-cyan-400 hover:bg-blue-500/20 border border-blue-500/20 transition cursor-pointer"
            >
              + Approve All Filtered for Theory
            </button>
            <button
              onClick={handleBulkApprovePaper}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-purple-500/10 text-purple-600 dark:text-purple-300 hover:bg-purple-500/20 border border-purple-500/20 transition cursor-pointer"
            >
              + Approve All Filtered for Paper Class
            </button>
            <button
              onClick={handleBulkMarkPaid}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 transition cursor-pointer"
            >
              ✓ Mark All Paid
            </button>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="rounded-3xl bg-white dark:bg-[#0c101a] border border-slate-200 dark:border-blue-950 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Student Details</th>
                <th className="py-3 px-4 text-center">Theory Class</th>
                <th className="py-3 px-4 text-center">Paper Class</th>
                <th className="py-3 px-4 text-center">Revision Class</th>
                <th className="py-3 px-4">Fee Status</th>
                <th className="py-3 px-4">Remarks / Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No students found matching your search or filters for this month.
                  </td>
                </tr>
              ) : (
                filteredList.map((item) => {
                  const { student, approval } = item;
                  return (
                    <tr
                      key={approval.id}
                      className="hover:bg-slate-50/60 dark:hover:bg-slate-900/30 transition-colors"
                    >
                      {/* Student Details */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 dark:text-white text-sm">
                          {approval.studentName}
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                          <span className="font-mono text-cyan-500 font-bold">{approval.studentIndex}</span>
                          <span>•</span>
                          <span>{approval.batch}</span>
                          {student.classMode && (
                            <>
                              <span>•</span>
                              <span className="text-slate-500">{student.classMode}</span>
                            </>
                          )}
                        </div>
                      </td>

                      {/* Theory Class Toggle */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => handleToggle(item, 'theoryApproved')}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-black text-xs transition cursor-pointer ${
                            approval.theoryApproved
                              ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                          }`}
                        >
                          {approval.theoryApproved ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Approved</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Not Approved</span>
                            </>
                          )}
                        </button>
                      </td>

                      {/* Paper Class Toggle */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => handleToggle(item, 'paperApproved')}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-black text-xs transition cursor-pointer ${
                            approval.paperApproved
                              ? 'bg-purple-600 text-white shadow-sm shadow-purple-500/20'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                          }`}
                        >
                          {approval.paperApproved ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Approved</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Not Approved</span>
                            </>
                          )}
                        </button>
                      </td>

                      {/* Revision Class Toggle */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => handleToggle(item, 'revisionApproved')}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-black text-xs transition cursor-pointer ${
                            approval.revisionApproved
                              ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/20'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                          }`}
                        >
                          {approval.revisionApproved ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Approved</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Not Approved</span>
                            </>
                          )}
                        </button>
                      </td>

                      {/* Fee Status Select */}
                      <td className="py-3.5 px-4">
                        <select
                          value={approval.feeStatus}
                          onChange={(e) => handleFeeStatusChange(item, e.target.value as any)}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-bold border focus:outline-none cursor-pointer ${
                            approval.feeStatus === 'paid'
                              ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                              : approval.feeStatus === 'pending'
                              ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-300 border-amber-300 dark:border-amber-800'
                              : 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-cyan-300 border-blue-300 dark:border-blue-800'
                          }`}
                        >
                          <option value="paid">Paid (Verified)</option>
                          <option value="pending">Payment Pending</option>
                          <option value="free_scholarship">Free / Scholarship</option>
                        </select>
                      </td>

                      {/* Remarks / Notes */}
                      <td className="py-3.5 px-4">
                        <input
                          type="text"
                          defaultValue={approval.notes || ''}
                          onBlur={(e) => {
                            if (e.target.value !== approval.notes) {
                              updateMonthlyApproval({
                                ...approval,
                                notes: e.target.value,
                                month: selectedMonth,
                              });
                            }
                          }}
                          placeholder="Add remark..."
                          className="w-full max-w-[200px] px-2.5 py-1.5 rounded-lg text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
