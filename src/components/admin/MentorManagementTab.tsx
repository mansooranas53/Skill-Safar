import React, { useState } from 'react';
import { ManagedMentor, InstitutionProfile } from '../../types';
import { portalRepository } from '../../repositories/mockRepository';
import {
  Users,
  Plus,
  Search,
  Filter,
  Key,
  Trash2,
  CheckCircle2,
  AlertCircle,
  School,
  Building2,
  Copy,
  Check,
  X,
  Award,
  ShieldCheck
} from 'lucide-react';

interface MentorManagementTabProps {
  mentors: ManagedMentor[];
  institutions: InstitutionProfile[];
  onRefresh: () => void;
}

export const MentorManagementTab: React.FC<MentorManagementTabProps> = ({
  mentors,
  institutions,
  onRefresh
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [quickTempPassword, setQuickTempPassword] = useState<{ id: string; pass: string } | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // New mentor form
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [type, setType] = useState<'FACULTY' | 'INDUSTRY'>('FACULTY');
  const [selectedInstId, setSelectedInstId] = useState(institutions[0]?.id || 'inst-01');
  const [deptOrCompany, setDeptOrCompany] = useState('Computer Science');
  const [designation, setDesignation] = useState('Associate Professor');
  const [maxCapacity, setMaxCapacity] = useState(15);
  const [specializationsText, setSpecializationsText] = useState('Cloud Computing, Distributed Systems');

  // Metrics
  const totalMentors = mentors.length;
  const facultyCount = mentors.filter(m => m.type === 'FACULTY').length;
  const industryCount = mentors.filter(m => m.type === 'INDUSTRY').length;
  const totalMenteesAllocated = mentors.reduce((acc, m) => acc + (m.assignedMenteesCount || 0), 0);

  const filtered = mentors.filter(m => {
    const matchesSearch =
      m.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.departmentOrCompany.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.institutionName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = typeFilter === 'ALL' || m.type === typeFilter;
    const matchesStatus = statusFilter === 'ALL' || m.accountStatus === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  const handleResetPass = (mentor: ManagedMentor) => {
    const pass = portalRepository.resetMentorPassword(mentor.id);
    setQuickTempPassword({ id: mentor.id, pass });
    onRefresh();
  };

  const handleCopyPass = (id: string, pass: string) => {
    navigator.clipboard.writeText(pass);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleToggleStatus = (mentorId: string) => {
    portalRepository.toggleMentorStatus(mentorId);
    onRefresh();
  };

  const handleDelete = (mentor: ManagedMentor) => {
    if (window.confirm(`Remove mentor record for ${mentor.fullName}?`)) {
      portalRepository.deleteManagedMentor(mentor.id);
      onRefresh();
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) return;

    const inst = institutions.find(i => i.id === selectedInstId) || institutions[0];
    const specs = specializationsText
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    portalRepository.addManagedMentor({
      fullName: fullName.trim(),
      email: email.trim(),
      type,
      institutionId: type === 'FACULTY' ? inst.id : undefined,
      institutionName: type === 'FACULTY' ? inst.name : `${deptOrCompany} (Industry Partner)`,
      departmentOrCompany: deptOrCompany.trim(),
      designation: designation.trim(),
      assignedMenteesCount: 0,
      maxMenteesCapacity: Number(maxCapacity),
      specialization: specs.length > 0 ? specs : ['Career Mentorship'],
      accountStatus: 'ACTIVE',
      lastActiveAt: 'Never',
      twoFactorEnabled: true
    });

    setIsAddModalOpen(false);
    setFullName('');
    setEmail('');
    onRefresh();
  };

  return (
    <div className="space-y-6">
      {/* Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Mentors</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{totalMentors}</span>
            <span className="text-xs text-slate-500">Advisors</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Faculty Mentors</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-indigo-900">{facultyCount}</span>
            <span className="text-xs text-indigo-600 font-medium">Campus Professors</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Industry Mentors</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-purple-900">{industryCount}</span>
            <span className="text-xs text-purple-600 font-medium">Tech Architects</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Mentees</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-emerald-900">{totalMenteesAllocated}</span>
            <span className="text-xs text-emerald-600 font-medium">Students Advised</span>
          </div>
        </div>
      </div>

      {/* Filter & Action Bar */}
      <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search mentors by name, email, department or partner..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="px-2.5 py-2 text-xs rounded-lg border border-slate-300 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="ALL">All Mentor Types</option>
            <option value="FACULTY">Faculty Mentors</option>
            <option value="INDUSTRY">Industry Mentors</option>
          </select>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-2.5 py-2 text-xs rounded-lg border border-slate-300 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="ALL">All Account Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="SUSPENDED">Suspended</option>
          </select>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          Assign / Add Mentor
        </button>
      </div>

      {/* Quick Password Reset Banner */}
      {quickTempPassword && (
        <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between text-xs text-amber-900 animate-in fade-in">
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Generated One-Time Mentor Password: <strong className="font-mono">{quickTempPassword.pass}</strong></span>
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

      {/* Mentor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(mentor => (
          <div
            key={mentor.id}
            className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h3 className="font-bold text-slate-900 text-sm">{mentor.fullName}</h3>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                      mentor.type === 'FACULTY'
                        ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                        : 'bg-purple-50 text-purple-700 border border-purple-200'
                    }`}>
                      {mentor.type}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 font-medium mt-0.5">{mentor.designation}</p>
                  <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                    {mentor.type === 'FACULTY' ? <School className="w-3 h-3 text-slate-400" /> : <Building2 className="w-3 h-3 text-slate-400" />}
                    {mentor.institutionName}
                  </p>
                  <p className="font-mono text-[11px] text-slate-500 mt-1">{mentor.email}</p>
                </div>

                <button
                  onClick={() => handleToggleStatus(mentor.id)}
                  className={`text-[10px] px-2.5 py-0.5 rounded-full font-semibold uppercase transition-colors shrink-0 ${
                    mentor.accountStatus === 'ACTIVE'
                      ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                      : 'bg-rose-100 text-rose-700 hover:bg-rose-200'
                  }`}
                  title="Toggle status"
                >
                  {mentor.accountStatus}
                </button>
              </div>

              {/* Mentee Capacity Utilization Bar */}
              <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center justify-between text-xs text-slate-600 mb-1.5">
                  <span className="font-medium">Mentee Capacity</span>
                  <span className="font-bold text-slate-900">
                    {mentor.assignedMenteesCount} / {mentor.maxMenteesCapacity} students
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      mentor.assignedMenteesCount >= mentor.maxMenteesCapacity
                        ? 'bg-amber-500'
                        : 'bg-indigo-600'
                    }`}
                    style={{
                      width: `${Math.min(100, (mentor.assignedMenteesCount / mentor.maxMenteesCapacity) * 100)}%`
                    }}
                  />
                </div>
              </div>

              {/* Specializations */}
              <div className="mt-3 flex flex-wrap gap-1.5">
                {mentor.specialization.map(spec => (
                  <span key={spec} className="px-2.5 py-0.5 bg-slate-100 text-slate-700 rounded-md text-[11px] font-medium border border-slate-200/60">
                    {spec}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Bar */}
            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => handleDelete(mentor)}
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                title="Remove Mentor"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => handleResetPass(mentor)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 border border-slate-200 rounded-lg flex items-center gap-1.5 transition-colors"
              >
                <Key className="w-3.5 h-3.5 text-amber-600" />
                Reset Password
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
          <Users className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h4 className="text-sm font-semibold text-slate-700">No mentors match the criteria</h4>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search query or mentor type filter.
          </p>
        </div>
      )}

      {/* Add Mentor Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Assign New Mentor</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Mentor Type *</label>
                <select
                  value={type}
                  onChange={e => setType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                >
                  <option value="FACULTY">Faculty Mentor (Campus Professor)</option>
                  <option value="INDUSTRY">Industry Partner Mentor (Company Staff)</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Sudhir Shenoy"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Email *</label>
                <input
                  type="email"
                  required
                  placeholder="sudhir.shenoy@institution.edu.in"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono"
                />
              </div>

              {type === 'FACULTY' ? (
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Institution</label>
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
              ) : (
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Company / Organization Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CloudScale Technologies"
                    value={deptOrCompany}
                    onChange={e => setDeptOrCompany(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Designation</label>
                  <input
                    type="text"
                    value={designation}
                    onChange={e => setDesignation(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Max Mentee Capacity</label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={maxCapacity}
                    onChange={e => setMaxCapacity(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Specialization Tags (Comma-separated)</label>
                <input
                  type="text"
                  placeholder="e.g. System Design, AI, Career Preparation"
                  value={specializationsText}
                  onChange={e => setSpecializationsText(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 shadow-sm"
                >
                  Assign Mentor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
