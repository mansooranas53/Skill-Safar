import React, { useState } from 'react';
import { ManagedStudent, InstitutionProfile } from '../../types';
import { portalRepository } from '../../repositories/mockRepository';
import { StudentProfileModal } from '../common/StudentProfileModal';
import {
  GraduationCap,
  Plus,
  Search,
  Filter,
  Key,
  Trash2,
  CheckCircle2,
  AlertCircle,
  School,
  Copy,
  Check,
  X,
  ShieldCheck,
  Award,
  Eye
} from 'lucide-react';

interface StudentManagementTabProps {
  students: ManagedStudent[];
  institutions: InstitutionProfile[];
  onRefresh: () => void;
}

export const StudentManagementTab: React.FC<StudentManagementTabProps> = ({
  students,
  institutions,
  onRefresh
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [instFilter, setInstFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [internshipFilter, setInternshipFilter] = useState('ALL');

  const [selectedStudentForProfile, setSelectedStudentForProfile] = useState<string | null>(null);

  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [quickTempPassword, setQuickTempPassword] = useState<{ id: string; pass: string } | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // New student form
  const [usn, setUsn] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedInstId, setSelectedInstId] = useState(institutions[0]?.id || 'inst-01');
  const [branch, setBranch] = useState('Computer Science & Engineering');
  const [semester, setSemester] = useState(7);
  const [cgpa, setCgpa] = useState(8.2);

  // Metrics
  const totalCount = students.length;
  const placedCount = students.filter(s => s.internshipStatus === 'Placed').length;
  const interviewingCount = students.filter(s => s.internshipStatus === 'Interviewing').length;
  const seekingCount = students.filter(s => s.internshipStatus === 'Seeking').length;

  const filtered = students.filter(s => {
    const matchesSearch =
      s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.usn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.branch.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesInst = instFilter === 'ALL' || s.institutionId === instFilter;
    const matchesStatus = statusFilter === 'ALL' || s.accountStatus === statusFilter;
    const matchesIntern = internshipFilter === 'ALL' || s.internshipStatus === internshipFilter;

    return matchesSearch && matchesInst && matchesStatus && matchesIntern;
  });

  const handleResetPass = (student: ManagedStudent) => {
    const pass = portalRepository.resetStudentPassword(student.id);
    setQuickTempPassword({ id: student.id, pass });
    onRefresh();
  };

  const handleCopyPass = (id: string, pass: string) => {
    navigator.clipboard.writeText(pass);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleToggleStatus = (studentId: string) => {
    portalRepository.toggleStudentStatus(studentId);
    onRefresh();
  };

  const handleDelete = (student: ManagedStudent) => {
    if (window.confirm(`Unenroll student record ${student.fullName} (${student.usn})?`)) {
      portalRepository.deleteManagedStudent(student.id);
      onRefresh();
    }
  };

  const handleEnrollSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!usn.trim() || !fullName.trim()) return;

    const inst = institutions.find(i => i.id === selectedInstId) || institutions[0];

    portalRepository.addManagedStudent({
      usn: usn.trim().toUpperCase(),
      fullName: fullName.trim(),
      email: email.trim() || `${usn.toLowerCase()}@student.${inst?.code.toLowerCase() || 'edu'}.in`,
      institutionId: inst.id,
      institutionName: inst.name,
      branch,
      semester: Number(semester),
      cgpa: Number(cgpa),
      verifiedSkillScore: 78,
      internshipStatus: 'Seeking',
      accountStatus: 'ACTIVE',
      lastActiveAt: 'Never',
      twoFactorEnabled: false
    });

    setIsEnrollModalOpen(false);
    setUsn('');
    setFullName('');
    setEmail('');
    onRefresh();
  };

  return (
    <div className="space-y-6">
      {/* Metrics Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Enrolled Students</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{totalCount}</span>
            <span className="text-xs text-slate-500">Verified USNs</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Placed in Industry</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-emerald-900">{placedCount}</span>
            <span className="text-xs text-emerald-600 font-medium">Offers Secured</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">In Interviews</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-indigo-900">{interviewingCount}</span>
            <span className="text-xs text-indigo-600 font-medium">Active Pipelines</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Seeking Internships</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-amber-900">{seekingCount}</span>
            <span className="text-xs text-amber-600 font-medium">Ready for Match</span>
          </div>
        </div>
      </div>

      {/* Filter and Action Bar */}
      <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by student name, USN, branch, email..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <select
            value={instFilter}
            onChange={e => setInstFilter(e.target.value)}
            className="px-2.5 py-2 text-xs rounded-lg border border-slate-300 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="ALL">All Institutions</option>
            {institutions.map(inst => (
              <option key={inst.id} value={inst.id}>{inst.name}</option>
            ))}
          </select>

          <select
            value={internshipFilter}
            onChange={e => setInternshipFilter(e.target.value)}
            className="px-2.5 py-2 text-xs rounded-lg border border-slate-300 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="ALL">All Placement Statuses</option>
            <option value="Placed">Placed</option>
            <option value="Interviewing">Interviewing</option>
            <option value="Seeking">Seeking</option>
            <option value="Not Eligible">Not Eligible</option>
          </select>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-2.5 py-2 text-xs rounded-lg border border-slate-300 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="ALL">All Account Statuses</option>
            <option value="ACTIVE">Active Logins</option>
            <option value="SUSPENDED">Suspended</option>
          </select>
        </div>

        <button
          onClick={() => setIsEnrollModalOpen(true)}
          className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          Enroll New Student
        </button>
      </div>

      {/* Global Quick Temporary Password Reset Banner */}
      {quickTempPassword && (
        <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between text-xs text-amber-900 animate-in fade-in">
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Generated One-Time Student Password: <strong className="font-mono">{quickTempPassword.pass}</strong></span>
          </div>
          <button
            onClick={() => handleCopyPass(quickTempPassword.id, quickTempPassword.pass)}
            className="px-2.5 py-1 text-xs font-semibold bg-white border border-amber-300 rounded hover:bg-amber-100 flex items-center gap-1 transition-colors"
          >
            {copiedId === quickTempPassword.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            {copiedId === quickTempPassword.id ? 'Copied' : 'Copy'}
          </button>
        </div>
      )}

      {/* Students Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold text-[10px] tracking-wider">
              <tr>
                <th className="px-4 py-3">Student & USN</th>
                <th className="px-3 py-3">Institution & Branch</th>
                <th className="px-3 py-3">CGPA / Verified Score</th>
                <th className="px-3 py-3">Internship Status</th>
                <th className="px-3 py-3">Assigned Mentor</th>
                <th className="px-3 py-3">Login Status</th>
                <th className="px-3 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(student => (
                <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setSelectedStudentForProfile(student.id)}
                      className="text-left group flex items-start gap-2"
                    >
                      <div>
                        <div className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors flex items-center gap-1">
                          <span>{student.fullName}</span>
                          <Eye className="w-3 h-3 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                        </div>
                        <div className="font-mono text-[11px] text-slate-500">{student.usn}</div>
                        <div className="text-[10px] text-slate-400">{student.email}</div>
                      </div>
                    </button>
                  </td>

                  <td className="px-3 py-3">
                    <div className="font-medium text-slate-800">{student.institutionName}</div>
                    <div className="text-[11px] text-slate-500">{student.branch} • Sem {student.semester}</div>
                  </td>

                  <td className="px-3 py-3">
                    <div className="font-bold text-slate-900">{student.cgpa} CGPA</div>
                    <div className="text-[11px] text-indigo-600 font-semibold">{student.verifiedSkillScore}/100 Verified</div>
                  </td>

                  <td className="px-3 py-3">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                      student.internshipStatus === 'Placed'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : student.internshipStatus === 'Interviewing'
                        ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                        : student.internshipStatus === 'Seeking'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {student.internshipStatus}
                    </span>
                  </td>

                  <td className="px-3 py-3">
                    <div className="text-slate-700 font-medium">{student.mentorName || 'Unassigned'}</div>
                  </td>

                  <td className="px-3 py-3">
                    <button
                      onClick={() => handleToggleStatus(student.id)}
                      className={`text-[10px] px-2.5 py-0.5 rounded-full font-semibold uppercase transition-colors ${
                        student.accountStatus === 'ACTIVE'
                          ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                          : 'bg-rose-100 text-rose-700 hover:bg-rose-200'
                      }`}
                      title="Click to toggle status"
                    >
                      {student.accountStatus}
                    </button>
                  </td>

                  <td className="px-3 py-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedStudentForProfile(student.id)}
                        className="px-2.5 py-1 text-xs font-semibold text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1 transition-colors"
                        title="Watch full student profile, verified skills, repos, and resume"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Watch</span>
                      </button>

                      <button
                        onClick={() => handleResetPass(student)}
                        className="px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded border border-slate-200 flex items-center gap-1 transition-colors"
                        title="Generate Temporary Password"
                      >
                        <Key className="w-3 h-3 text-amber-600" />
                        Reset Pass
                      </button>

                      <button
                        onClick={() => handleDelete(student)}
                        className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                        title="Unenroll student"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                    No students match the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Enroll Modal */}
      {isEnrollModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Enroll New Student</h3>
              <button onClick={() => setIsEnrollModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEnrollSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Target Institution *</label>
                <select
                  value={selectedInstId}
                  onChange={e => setSelectedInstId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                >
                  {institutions.map(inst => (
                    <option key={inst.id} value={inst.id}>{inst.name} ({inst.code})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">University Seat Number (USN) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 1ITS23CS105"
                  value={usn}
                  onChange={e => setUsn(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Full Student Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ananya Rao"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Student Email</label>
                <input
                  type="email"
                  placeholder="Leave empty for auto-generated institutional email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Semester</label>
                  <select
                    value={semester}
                    onChange={e => setSemester(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                      <option key={s} value={s}>Semester {s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">CGPA</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    value={cgpa}
                    onChange={e => setCgpa(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Branch / Specialization</label>
                <input
                  type="text"
                  value={branch}
                  onChange={e => setBranch(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEnrollModalOpen(false)}
                  className="px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 shadow-sm"
                >
                  Enroll Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Watch Student Profile (Admin Context) */}
      <StudentProfileModal
        isOpen={!!selectedStudentForProfile}
        onClose={() => setSelectedStudentForProfile(null)}
        studentId={selectedStudentForProfile || undefined}
        viewerRole="INSTITUTION_ADMIN"
        onPlacementStatusChanged={() => {
          onRefresh();
        }}
      />
    </div>
  );
};
