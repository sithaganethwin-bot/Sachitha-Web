import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  Filter,
  Download,
  Eye,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Phone,
  Mail,
  Building2,
  MapPin,
  Calendar,
  IdCard,
  RefreshCw,
  X,
  Copy,
  ExternalLink,
  ShieldCheck,
  Ban,
  KeyRound
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useData } from '../../context/DataContext';
import { RegisteredAccount } from '../../types';
import { AdminStudentPermissionsManager } from './AdminStudentPermissionsManager';

export const AdminStudentsView: React.FC = () => {
  const { registeredStudents, updateStudentStatus, deleteRegisteredStudent, refreshRegisteredStudents } = useData();

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('all');
  const [selectedMode, setSelectedMode] = useState('all');
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'active' | 'suspended'>('all');

  // Selected student for detail modal
  const [selectedStudent, setSelectedStudent] = useState<RegisteredAccount | null>(null);
  const [managingPermissionsStudentId, setManagingPermissionsStudentId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState(false);

  // Extract unique batches, modes, districts for filter dropdowns
  const uniqueBatches = useMemo(() => {
    const set = new Set(registeredStudents.map((s) => s.batch).filter(Boolean));
    return Array.from(set);
  }, [registeredStudents]);

  const uniqueModes = useMemo(() => {
    const set = new Set(
      registeredStudents.map((s) => s.classMode || s.deliveryMode).filter(Boolean)
    );
    return Array.from(set);
  }, [registeredStudents]);

  const uniqueDistricts = useMemo(() => {
    const set = new Set(registeredStudents.map((s) => s.district).filter(Boolean));
    return Array.from(set);
  }, [registeredStudents]);

  // Filtered Students
  const filteredStudents = useMemo(() => {
    return registeredStudents.filter((student) => {
      const mode = student.classMode || student.deliveryMode || '';
      const fullName = `${student.firstName} ${student.lastName}`.toLowerCase();
      const query = searchQuery.toLowerCase();

      // Search match
      const matchesSearch =
        !query ||
        fullName.includes(query) ||
        student.email.toLowerCase().includes(query) ||
        student.indexNo.toLowerCase().includes(query) ||
        student.nicNumber.toLowerCase().includes(query) ||
        student.whatsapp.includes(query) ||
        student.school.toLowerCase().includes(query);

      // Batch match
      const matchesBatch = selectedBatch === 'all' || student.batch === selectedBatch;

      // Mode match
      const matchesMode = selectedMode === 'all' || mode === selectedMode;

      // District match
      const matchesDistrict = selectedDistrict === 'all' || student.district === selectedDistrict;

      // Status match
      const matchesStatus =
        selectedStatus === 'all' || (student.status || 'active') === selectedStatus;

      return matchesSearch && matchesBatch && matchesMode && matchesDistrict && matchesStatus;
    });
  }, [registeredStudents, searchQuery, selectedBatch, selectedMode, selectedDistrict, selectedStatus]);

  // Export to CSV
  const handleExportCSV = () => {
    if (filteredStudents.length === 0) {
      alert('No student records to export.');
      return;
    }

    const headers = [
      'Index No',
      'First Name',
      'Last Name',
      'Email',
      'WhatsApp',
      'Parent Phone',
      'Batch',
      'Class Option',
      'Class Mode',
      'NIC Number',
      'School',
      'District',
      'Street Address',
      'Area',
      'City',
      'Status',
      'Registered Date',
    ];

    const rows = filteredStudents.map((s) => [
      `"${s.indexNo}"`,
      `"${s.firstName}"`,
      `"${s.lastName}"`,
      `"${s.email}"`,
      `"${s.whatsapp}"`,
      `"${s.parentPhone}"`,
      `"${s.batch}"`,
      `"${s.classOption || s.classModule || ''}"`,
      `"${s.classMode || s.deliveryMode || ''}"`,
      `"${s.nicNumber}"`,
      `"${s.school}"`,
      `"${s.district}"`,
      `"${s.address?.street || ''}"`,
      `"${s.address?.area || ''}"`,
      `"${s.address?.city || ''}"`,
      `"${s.status || 'active'}"`,
      `"${s.createdAt ? new Date(s.createdAt).toLocaleDateString() : ''}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `sachii_registered_students_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyIndex = (indexNo: string) => {
    navigator.clipboard.writeText(indexNo);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to permanently remove student ${name} from registry?`)) {
      deleteRegisteredStudent(id);
      if (selectedStudent?.id === id) {
        setSelectedStudent(null);
      }
    }
  };

  const handleToggleStatus = (id: string, currentStatus?: string) => {
    const newStatus = currentStatus === 'suspended' ? 'active' : 'suspended';
    updateStudentStatus(id, newStatus);
    if (selectedStudent?.id === id) {
      setSelectedStudent((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  // Metrics
  const activeCount = registeredStudents.filter((s) => s.status !== 'suspended').length;
  const suspendedCount = registeredStudents.filter((s) => s.status === 'suspended').length;
  const onlineCount = registeredStudents.filter((s) =>
    (s.classMode || s.deliveryMode || '').toLowerCase().includes('online')
  ).length;

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header and Quick Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-2xl font-black font-['Space_Grotesk'] text-slate-900 dark:text-white">
              Registered Students Directory
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-cyan-400 border border-blue-200 dark:border-blue-900">
              {registeredStudents.length} {registeredStudents.length === 1 ? 'Student' : 'Students'}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time verified student accounts, enrollment options, contact dossiers, and courier delivery data.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={refreshRegisteredStudents}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer"
            title="Refresh database records"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-white dark:bg-[#0c101a] border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase">
            Total Registered
          </span>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {registeredStudents.length}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#0c101a] border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase">
            Active Accounts
          </span>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            {activeCount}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#0c101a] border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] font-semibold text-blue-600 dark:text-cyan-400 uppercase">
            Online (Zoom/Video)
          </span>
          <p className="text-2xl font-black text-blue-600 dark:text-cyan-400 mt-1">
            {onlineCount}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#0c101a] border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] font-semibold text-rose-500 uppercase">
            Suspended
          </span>
          <p className="text-2xl font-black text-rose-500 mt-1">
            {suspendedCount}
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#0c101a] border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {/* Search Box */}
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by student name, index no, email, NIC, phone..."
              className="w-full pl-9 pr-3.5 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 outline-none transition"
            />
          </div>

          {/* Batch Filter */}
          <div>
            <select
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
              className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition cursor-pointer"
            >
              <option value="all">All Batches</option>
              {uniqueBatches.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          {/* Class Mode Filter */}
          <div>
            <select
              value={selectedMode}
              onChange={(e) => setSelectedMode(e.target.value)}
              className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition cursor-pointer"
            >
              <option value="all">All Class Modes</option>
              {uniqueModes.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as any)}
              className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active Only</option>
              <option value="suspended">Suspended Only</option>
            </select>
          </div>
        </div>

        {/* Active Filter Chips / Reset */}
        {(searchQuery ||
          selectedBatch !== 'all' ||
          selectedMode !== 'all' ||
          selectedDistrict !== 'all' ||
          selectedStatus !== 'all') && (
          <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100 dark:border-slate-800 text-slate-500">
            <span>
              Showing <span className="font-bold text-blue-600 dark:text-cyan-400">{filteredStudents.length}</span> of{' '}
              {registeredStudents.length} registered students
            </span>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedBatch('all');
                setSelectedMode('all');
                setSelectedDistrict('all');
                setSelectedStatus('all');
              }}
              className="text-blue-600 dark:text-cyan-400 font-semibold hover:underline cursor-pointer"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      {/* Main Table */}
      <div className="rounded-2xl bg-white dark:bg-[#0c101a] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4">Student</th>
                <th className="py-3.5 px-4">Program & Class Option</th>
                <th className="py-3.5 px-4">Class Mode</th>
                <th className="py-3.5 px-4">Contact (WhatsApp / Email)</th>
                <th className="py-3.5 px-4">NIC & District</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => {
                  const isSuspended = student.status === 'suspended';
                  const mode = student.classMode || student.deliveryMode || 'Online (with Zoom)';
                  const option = student.classOption || student.classModule || 'Standard Module';

                  return (
                    <tr
                      key={student.id}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-900/50 transition-colors"
                    >
                      {/* Student Info */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-cyan-400 font-bold flex items-center justify-center shrink-0 border border-blue-200 dark:border-blue-900">
                            {student.firstName.charAt(0)}
                            {student.lastName.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white">
                              {student.firstName} {student.lastName}
                            </p>
                            <p className="font-mono text-[10px] text-blue-600 dark:text-cyan-400 font-semibold">
                              {student.indexNo}
                            </p>
                            <p className="text-[11px] text-slate-400 truncate max-w-[150px]">
                              {student.school}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Program & Class Option */}
                      <td className="py-3.5 px-4">
                        <div>
                          <span className="font-semibold text-slate-800 dark:text-slate-200">
                            {student.batch}
                          </span>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">
                            {option}
                          </p>
                        </div>
                      </td>

                      {/* Class Mode */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            mode.toLowerCase().includes('online')
                              ? 'bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-cyan-300 border border-blue-200 dark:border-blue-800'
                              : 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                          }`}
                        >
                          {mode}
                        </span>
                      </td>

                      {/* Contact */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200">
                            <Phone className="w-3 h-3 text-slate-400" />
                            <span>{student.whatsapp}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-[11px]">
                            <Mail className="w-3 h-3 text-slate-400" />
                            <span className="truncate max-w-[140px]">{student.email}</span>
                          </div>
                        </div>
                      </td>

                      {/* NIC & District */}
                      <td className="py-3.5 px-4">
                        <div>
                          <span className="font-mono text-xs text-slate-700 dark:text-slate-300">
                            {student.nicNumber}
                          </span>
                          <p className="text-[11px] text-slate-400">{student.district} District</p>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            isSuspended
                              ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                              : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isSuspended ? 'bg-rose-500' : 'bg-emerald-500'
                            }`}
                          />
                          {isSuspended ? 'Suspended' : 'Active'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setManagingPermissionsStudentId(student.id)}
                            className="p-1.5 rounded-lg text-amber-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40 transition cursor-pointer"
                            title="Manage Permissions, Passes & Recording Replays"
                          >
                            <KeyRound className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => setSelectedStudent(student)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 dark:hover:text-cyan-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                            title="View Full Student Dossier"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleToggleStatus(student.id, student.status)}
                            className={`p-1.5 rounded-lg transition cursor-pointer ${
                              isSuspended
                                ? 'text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
                                : 'text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40'
                            }`}
                            title={isSuspended ? 'Activate Account' : 'Suspend Account'}
                          >
                            {isSuspended ? <CheckCircle2 className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                          </button>

                          <button
                            onClick={() =>
                              handleDelete(student.id, `${student.firstName} ${student.lastName}`)
                            }
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer"
                            title="Delete Student Record"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <Users className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-700 mb-2" />
                    <p className="font-semibold text-slate-600 dark:text-slate-300">
                      No student records found
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {searchQuery || selectedBatch !== 'all' || selectedMode !== 'all'
                        ? 'Try adjusting your search filters'
                        : 'Students will appear here once they register or log in on the website'}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Dossier Detail Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#0c101a] border border-slate-200 dark:border-blue-900/60 rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-6 bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-800 text-white flex items-start justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center font-black text-lg border border-white/20">
                  {selectedStudent.firstName.charAt(0)}
                  {selectedStudent.lastName.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-extrabold leading-tight">
                    {selectedStudent.firstName} {selectedStudent.lastName}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-mono text-xs bg-white/20 px-2 py-0.5 rounded-full font-bold">
                      {selectedStudent.indexNo}
                    </span>
                    <button
                      onClick={() => handleCopyIndex(selectedStudent.indexNo)}
                      className="text-xs text-cyan-200 hover:text-white flex items-center gap-1 cursor-pointer"
                    >
                      <Copy className="w-3 h-3" />
                      <span>{copiedId ? 'Copied!' : 'Copy'}</span>
                    </button>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedStudent(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-800 dark:text-slate-200">
              {/* Enrollment Info Card */}
              <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-900/60 space-y-2">
                <h4 className="font-bold text-blue-900 dark:text-cyan-300 uppercase tracking-wider text-[11px]">
                  Academic Enrollment
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-400">Target Batch:</span>
                    <p className="font-bold">{selectedStudent.batch}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Class Option:</span>
                    <p className="font-bold text-blue-600 dark:text-cyan-400">
                      {selectedStudent.classOption || selectedStudent.classModule || 'Standard'}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-400">Class Mode:</span>
                    <p className="font-bold text-emerald-600 dark:text-emerald-400">
                      {selectedStudent.classMode || selectedStudent.deliveryMode || 'Online'}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-400">Account Status:</span>
                    <p className="font-bold uppercase">{selectedStudent.status || 'Active'}</p>
                  </div>
                </div>
              </div>

              {/* Personal & School */}
              <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
                <div>
                  <span className="text-slate-400">NIC Number:</span>
                  <p className="font-mono font-bold">{selectedStudent.nicNumber}</p>
                </div>
                <div>
                  <span className="text-slate-400">District:</span>
                  <p className="font-bold">{selectedStudent.district} District</p>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-400">School Attending:</span>
                  <p className="font-bold">{selectedStudent.school}</p>
                </div>
              </div>

              {/* Contact Information */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 space-y-2">
                <h4 className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[11px]">
                  Direct Contact & Guardians
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-slate-400">WhatsApp Number:</span>
                    <p className="font-bold">{selectedStudent.whatsapp}</p>
                    <a
                      href={`https://wa.me/94${selectedStudent.whatsapp.replace(/\D/g, '').replace(/^0/, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold hover:underline mt-0.5"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Chat on WhatsApp</span>
                    </a>
                  </div>
                  <div>
                    <span className="text-slate-400">Parent's Phone:</span>
                    <p className="font-bold">{selectedStudent.parentPhone}</p>
                    <a
                      href={`tel:${selectedStudent.parentPhone}`}
                      className="inline-flex items-center gap-1 text-[11px] text-blue-600 dark:text-cyan-400 font-semibold hover:underline mt-0.5"
                    >
                      <Phone className="w-3 h-3" />
                      <span>Call Parent</span>
                    </a>
                  </div>
                  <div className="col-span-2 pt-1 border-t border-slate-200 dark:border-slate-800">
                    <span className="text-slate-400">Registered Email Address:</span>
                    <p className="font-bold">{selectedStudent.email}</p>
                  </div>
                </div>
              </div>

              {/* Courier Delivery Address */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[11px]">
                  Tutorial Delivery Address:
                </span>
                <p className="text-xs font-semibold leading-relaxed">
                  {selectedStudent.address?.street}, {selectedStudent.address?.area},{' '}
                  {selectedStudent.address?.city}
                </p>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0 gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleStatus(selectedStudent.id, selectedStudent.status)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                    selectedStudent.status === 'suspended'
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      : 'bg-amber-600 hover:bg-amber-700 text-white'
                  }`}
                >
                  {selectedStudent.status === 'suspended' ? 'Activate Account' : 'Suspend Account'}
                </button>

                <button
                  onClick={() => {
                    const sid = selectedStudent.id;
                    setSelectedStudent(null);
                    setManagingPermissionsStudentId(sid);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition cursor-pointer flex items-center gap-1.5 shadow-sm"
                >
                  <KeyRound className="w-3.5 h-3.5 text-amber-300" />
                  <span>Manage Permissions & Recordings</span>
                </button>
              </div>

              <button
                onClick={() => setSelectedStudent(null)}
                className="px-5 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-white text-xs font-bold transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Student Permissions & Replay Unlock Manager Modal */}
      {managingPermissionsStudentId && (
        <AdminStudentPermissionsManager
          initialStudentId={managingPermissionsStudentId}
          isModal={true}
          onClose={() => setManagingPermissionsStudentId(null)}
        />
      )}
    </div>
  );
};
