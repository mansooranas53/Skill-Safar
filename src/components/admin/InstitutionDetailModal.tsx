import React, { useState, useEffect } from 'react';
import {
  InstitutionProfile,
  ManagedStudent,
  ManagedMentor,
  InstitutionLoginCredential
} from '../../types';
import { portalRepository } from '../../repositories/mockRepository';
import {
  X,
  School,
  Building2,
  Users,
  GraduationCap,
  Key,
  ShieldCheck,
  ShieldAlert,
  Lock,
  Unlock,
  RotateCcw,
  Copy,
  Check,
  Plus,
  Trash2,
  Mail,
  Phone,
  Search,
  Filter,
  Award,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Clock,
  Layers,
  Sparkles,
  ChevronRight
} from 'lucide-react';

interface InstitutionDetailModalProps {
  institution: InstitutionProfile | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdated: () => void;
}

export const InstitutionDetailModal: React.FC<InstitutionDetailModalProps> = ({
  institution,
  isOpen,
  onClose,
  onUpdated
}) => {
  if (!isOpen || !institution) return null;

  const [activeTab, setActiveTab] = useState<'overview' | 'login' | 'students' | 'mentors'>('overview');
  const [students, setStudents] = useState<ManagedStudent[]>([]);
  const [mentors, setMentors] = useState<ManagedMentor[]>([]);

  // Search in students
  const [studentSearch, setStudentSearch] = useState('');
  const [studentBranchFilter, setStudentBranchFilter] = useState('ALL');

  // Search in mentors
  const [mentorSearch, setMentorSearch] = useState('');

  // Password reset notifications
  const [resetMessage, setResetMessage] = useState<{ id: string; pass: string } | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Modals inside deep manage
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [isAddMentorOpen, setIsAddMentorOpen] = useState(false);

  // New student form state
  const [newUsn, setNewUsn] = useState('');
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newBranch, setNewBranch] = useState('Computer Science & Engineering');
  const [newSemester, setNewSemester] = useState(7);
  const [newCgpa, setNewCgpa] = useState(8.5);

  // New mentor form state
  const [newMentorName, setNewMentorName] = useState('');
  const [newMentorEmail, setNewMentorEmail] = useState('');
  const [newMentorType, setNewMentorType] = useState<'FACULTY' | 'INDUSTRY'>('FACULTY');
  const [newMentorDept, setNewMentorDept] = useState('Computer Science');
  const [newMentorDesignation, setNewMentorDesignation] = useState('Assistant Professor');
  const [newMentorCapacity, setNewMentorCapacity] = useState(12);

  // Login credentials state
  const currentCreds = institution.loginCredentials || {
    adminEmail: institution.contactEmail || `admin@${institution.code.toLowerCase()}.edu.in`,
    adminUsername: `${institution.code.toLowerCase()}_admin`,
    status: 'ACTIVE',
    lastLoginAt: 'Never',
    ssoDomain: `${institution.code.toLowerCase()}.edu.in`,
    twoFactorEnforced: true,
    activeSessionsCount: 2
  };

  const [adminEmail, setAdminEmail] = useState(currentCreds.adminEmail);
  const [adminUsername, setAdminUsername] = useState(currentCreds.adminUsername);
  const [adminStatus, setAdminStatus] = useState<'ACTIVE' | 'LOCKED' | 'SUSPENDED'>(currentCreds.status);
  const [ssoDomain, setSsoDomain] = useState(currentCreds.ssoDomain || '');
  const [twoFactorEnforced, setTwoFactorEnforced] = useState(currentCreds.twoFactorEnforced);
  const [loginSaveMsg, setLoginSaveMsg] = useState<string | null>(null);

  const loadData = () => {
    setStudents(portalRepository.getManagedStudents(institution.id));
    setMentors(portalRepository.getManagedMentors(institution.id));
  };

  useEffect(() => {
    loadData();
  }, [institution.id]);

  const handleCopy = (id: string, pass: string) => {
    navigator.clipboard.writeText(pass);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Student Actions
  const handleResetStudentPassword = (studentId: string) => {
    const pass = portalRepository.resetStudentPassword(studentId);
    setResetMessage({ id: studentId, pass });
    loadData();
    onUpdated();
  };

  const handleToggleStudentStatus = (studentId: string) => {
    portalRepository.toggleStudentStatus(studentId);
    loadData();
    onUpdated();
  };

  const handleDeleteStudent = (student: ManagedStudent) => {
    if (window.confirm(`Unenroll student ${student.fullName} (${student.usn})?`)) {
      portalRepository.deleteManagedStudent(student.id);
      loadData();
      onUpdated();
    }
  };

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsn.trim() || !newName.trim()) return;

    portalRepository.addManagedStudent({
      usn: newUsn.trim().toUpperCase(),
      fullName: newName.trim(),
      email: newEmail.trim() || `${newUsn.toLowerCase()}@student.${institution.code.toLowerCase()}.edu.in`,
      institutionId: institution.id,
      institutionName: institution.name,
      branch: newBranch,
      semester: Number(newSemester),
      cgpa: Number(newCgpa),
      verifiedSkillScore: 75,
      internshipStatus: 'Seeking',
      accountStatus: 'ACTIVE',
      lastActiveAt: 'Never',
      twoFactorEnabled: false
    });

    setIsAddStudentOpen(false);
    setNewUsn('');
    setNewName('');
    setNewEmail('');
    loadData();
    onUpdated();
  };

  // Mentor Actions
  const handleResetMentorPassword = (mentorId: string) => {
    const pass = portalRepository.resetMentorPassword(mentorId);
    setResetMessage({ id: mentorId, pass });
    loadData();
    onUpdated();
  };

  const handleToggleMentorStatus = (mentorId: string) => {
    portalRepository.toggleMentorStatus(mentorId);
    loadData();
    onUpdated();
  };

  const handleDeleteMentor = (mentor: ManagedMentor) => {
    if (window.confirm(`Remove mentor ${mentor.fullName}?`)) {
      portalRepository.deleteManagedMentor(mentor.id);
      loadData();
      onUpdated();
    }
  };

  const handleAddMentor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMentorName.trim() || !newMentorEmail.trim()) return;

    portalRepository.addManagedMentor({
      fullName: newMentorName.trim(),
      email: newMentorEmail.trim(),
      institutionId: institution.id,
      institutionName: institution.name,
      type: newMentorType,
      departmentOrCompany: newMentorDept,
      designation: newMentorDesignation,
      assignedMenteesCount: 0,
      maxMenteesCapacity: Number(newMentorCapacity),
      specialization: ['Mentorship', 'Career Guidance'],
      accountStatus: 'ACTIVE',
      lastActiveAt: 'Never',
      twoFactorEnabled: true
    });

    setIsAddMentorOpen(false);
    setNewMentorName('');
    setNewMentorEmail('');
    loadData();
    onUpdated();
  };

  // Save Login Security Settings
  const handleSaveLoginSettings = (e: React.FormEvent) => {
    e.preventDefault();
    portalRepository.updateInstitutionCredentials(institution.id, {
      adminEmail: adminEmail.trim(),
      adminUsername: adminUsername.trim(),
      status: adminStatus,
      ssoDomain: ssoDomain.trim() || undefined,
      twoFactorEnforced
    });
    setLoginSaveMsg('Campus administrator security rules saved.');
    onUpdated();
    setTimeout(() => setLoginSaveMsg(null), 3500);
  };

  const handleGenerateEmergencyCampusPass = () => {
    const pass = portalRepository.resetInstitutionPassword(institution.id);
    setResetMessage({ id: institution.id, pass });
    onUpdated();
  };

  // Filtered Students
  const filteredStudents = students.filter(s => {
    const matchesSearch =
      s.fullName.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.usn.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.email.toLowerCase().includes(studentSearch.toLowerCase());
    const matchesBranch = studentBranchFilter === 'ALL' || s.branch === studentBranchFilter;
    return matchesSearch && matchesBranch;
  });

  // Filtered Mentors
  const filteredMentors = mentors.filter(m =>
    m.fullName.toLowerCase().includes(mentorSearch.toLowerCase()) ||
    m.email.toLowerCase().includes(mentorSearch.toLowerCase()) ||
    m.departmentOrCompany.toLowerCase().includes(mentorSearch.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-3 md:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-5xl my-4 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Deep Management Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              <School className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold tracking-tight">{institution.name}</h2>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-bold uppercase bg-indigo-500/30 text-indigo-200 border border-indigo-500/30">
                  {institution.code}
                </span>
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold uppercase ${
                  institution.status === 'ACTIVE'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                }`}>
                  {institution.status || 'ACTIVE'}
                </span>
              </div>
              <p className="text-xs text-indigo-200 mt-0.5">
                {institution.location} • NAAC: {institution.naacGrade} • Total Licensed Seats: {institution.subscription?.totalStudentSeats || institution.totalStudents}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 pt-3 border-b border-slate-200 bg-slate-50 flex items-center gap-2 shrink-0">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-xl border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'overview'
                ? 'bg-white text-indigo-600 border-indigo-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900 border-transparent'
            }`}
          >
            <Building2 className="w-4 h-4" />
            Institution Overview
          </button>

          <button
            onClick={() => setActiveTab('login')}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-xl border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'login'
                ? 'bg-white text-indigo-600 border-indigo-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900 border-transparent'
            }`}
          >
            <Key className="w-4 h-4" />
            Campus Login & Access
          </button>

          <button
            onClick={() => setActiveTab('students')}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-xl border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'students'
                ? 'bg-white text-indigo-600 border-indigo-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900 border-transparent'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            Students Roster ({students.length})
          </button>

          <button
            onClick={() => setActiveTab('mentors')}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-xl border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'mentors'
                ? 'bg-white text-indigo-600 border-indigo-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900 border-transparent'
            }`}
          >
            <Users className="w-4 h-4" />
            Mentors & Faculty ({mentors.length})
          </button>
        </div>

        {/* Global Temporary Password Notification Banner */}
        {resetMessage && (
          <div className="mx-6 mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between text-xs text-amber-900 font-medium shrink-0 animate-in fade-in">
            <div className="flex items-center gap-2 font-mono">
              <Key className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Temporary Generated Password: <strong>{resetMessage.pass}</strong></span>
            </div>
            <button
              onClick={() => handleCopy(resetMessage.id, resetMessage.pass)}
              className="px-2.5 py-1 text-xs font-semibold bg-white border border-amber-300 rounded hover:bg-amber-100 flex items-center gap-1 transition-colors"
            >
              {copiedId === resetMessage.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedId === resetMessage.id ? 'Copied' : 'Copy'}
            </button>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Accreditation</span>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-xl font-bold text-slate-900">NAAC {institution.naacGrade}</span>
                    {institution.nirfRank && (
                      <span className="text-xs text-indigo-600 font-semibold">NIRF #{institution.nirfRank}</span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">State: {institution.state || 'Karnataka'}</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Subscription Tier</span>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-xl font-bold text-indigo-900">{institution.subscription?.planTier || 'ENTERPRISE'}</span>
                    <span className="text-xs text-emerald-600 font-semibold">{institution.subscription?.contractStatus || 'Active'}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Seats: {institution.subscription?.allocatedStudentSeats || 0} / {institution.subscription?.totalStudentSeats || institution.totalStudents}</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Placement Rate</span>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-xl font-bold text-slate-900">{institution.placedPercentage}%</span>
                    <span className="text-xs text-slate-500">Verified Placement</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Departments: {institution.departments?.length || 4} branches</p>
                </div>
              </div>

              {/* Department Badges */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Academic Departments</h4>
                <div className="flex flex-wrap gap-2">
                  {institution.departments?.map(dept => (
                    <span key={dept} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium border border-slate-200">
                      {dept}
                    </span>
                  ))}
                </div>
              </div>

              {/* Contact Personnel */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">Campus Leadership & Contacts</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 block mb-0.5">Contact Person</span>
                    <strong className="text-slate-800">{institution.contactPerson || 'Dean of Academics'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-0.5">Official Email</span>
                    <span className="text-slate-800 font-mono">{institution.contactEmail || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-0.5">Phone Number</span>
                    <span className="text-slate-800">{institution.contactPhone || '+91 80 2345 6789'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CAMPUS LOGIN & ACCESS */}
          {activeTab === 'login' && (
            <form onSubmit={handleSaveLoginSettings} className="space-y-6">
              {loginSaveMsg && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{loginSaveMsg}</span>
                </div>
              )}

              {/* Status Switcher */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Campus Account Status</span>
                  <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-semibold uppercase ${
                    adminStatus === 'ACTIVE'
                      ? 'bg-emerald-100 text-emerald-700'
                      : adminStatus === 'LOCKED'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-rose-100 text-rose-700'
                  }`}>
                    {adminStatus}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setAdminStatus('ACTIVE')}
                    className={`px-3 py-2 text-xs font-medium rounded-lg border flex items-center justify-center gap-1.5 transition-all ${
                      adminStatus === 'ACTIVE'
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <Unlock className="w-3.5 h-3.5" />
                    Active
                  </button>

                  <button
                    type="button"
                    onClick={() => setAdminStatus('LOCKED')}
                    className={`px-3 py-2 text-xs font-medium rounded-lg border flex items-center justify-center gap-1.5 transition-all ${
                      adminStatus === 'LOCKED'
                        ? 'bg-amber-600 text-white border-amber-600'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <Lock className="w-3.5 h-3.5" />
                    Locked
                  </button>

                  <button
                    type="button"
                    onClick={() => setAdminStatus('SUSPENDED')}
                    className={`px-3 py-2 text-xs font-medium rounded-lg border flex items-center justify-center gap-1.5 transition-all ${
                      adminStatus === 'SUSPENDED'
                        ? 'bg-rose-600 text-white border-rose-600'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <ShieldAlert className="w-3.5 h-3.5" />
                    Suspended
                  </button>
                </div>
              </div>

              {/* Credential Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Campus Admin Email</label>
                  <input
                    type="email"
                    required
                    value={adminEmail}
                    onChange={e => setAdminEmail(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Campus Admin Username</label>
                  <input
                    type="text"
                    required
                    value={adminUsername}
                    onChange={e => setAdminUsername(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Enforced SSO Domain</label>
                <input
                  type="text"
                  value={ssoDomain}
                  onChange={e => setSsoDomain(e.target.value)}
                  placeholder="e.g. its-blr.edu.in"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Enforces that all faculty and campus administrators must use institutional Google or Microsoft SSO.
                </p>
              </div>

              {/* Emergency Pass Reset & 2FA */}
              <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-100 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-indigo-950 flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-indigo-600" />
                    Generate Emergency One-Time Password
                  </h4>
                  <p className="text-[11px] text-indigo-700 mt-0.5">
                    Generate an instant password reset token for the campus administrator.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleGenerateEmergencyCampusPass}
                  className="px-3 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors flex items-center gap-1 shrink-0"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Generate Bypass
                </button>
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="text-xs font-medium text-slate-800 flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={twoFactorEnforced}
                    onChange={e => setTwoFactorEnforced(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                  />
                  <span>Enforce Two-Factor Authentication (2FA) across campus staff</span>
                </label>

                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-all"
                >
                  Save Campus Security Rules
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: STUDENTS ROSTER */}
          {activeTab === 'students' && (
            <div className="space-y-4">
              {/* Filter & Action Toolbar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2 flex-1">
                  <div className="relative flex-1">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="Search by name, USN, or email..."
                      value={studentSearch}
                      onChange={e => setStudentSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <select
                    value={studentBranchFilter}
                    onChange={e => setStudentBranchFilter(e.target.value)}
                    className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="ALL">All Branches</option>
                    {institution.departments?.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={() => setIsAddStudentOpen(true)}
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors flex items-center gap-1.5 shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Enroll Student
                </button>
              </div>

              {/* Students Table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold text-[10px] tracking-wider">
                      <tr>
                        <th className="px-4 py-3">USN / Student</th>
                        <th className="px-3 py-3">Branch & Sem</th>
                        <th className="px-3 py-3">CGPA / Score</th>
                        <th className="px-3 py-3">Status</th>
                        <th className="px-3 py-3">Account</th>
                        <th className="px-3 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredStudents.map(student => (
                        <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="px-4 py-3">
                            <div className="font-semibold text-slate-900">{student.fullName}</div>
                            <div className="font-mono text-[11px] text-slate-500">{student.usn} • {student.email}</div>
                          </td>
                          <td className="px-3 py-3">
                            <div className="text-slate-800">{student.branch}</div>
                            <div className="text-[11px] text-slate-500">Semester {student.semester}</div>
                          </td>
                          <td className="px-3 py-3">
                            <div className="font-bold text-slate-900">{student.cgpa} CGPA</div>
                            <div className="text-[11px] text-indigo-600 font-medium">{student.verifiedSkillScore}/100 Verified</div>
                          </td>
                          <td className="px-3 py-3">
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                              student.internshipStatus === 'Placed'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : student.internshipStatus === 'Interviewing'
                                ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                                : 'bg-slate-100 text-slate-700'
                            }`}>
                              {student.internshipStatus}
                            </span>
                          </td>
                          <td className="px-3 py-3">
                            <button
                              onClick={() => handleToggleStudentStatus(student.id)}
                              className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase transition-colors ${
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
                                onClick={() => handleResetStudentPassword(student.id)}
                                className="px-2 py-1 text-[11px] font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded flex items-center gap-1 transition-colors"
                                title="Reset Student Password"
                              >
                                <Key className="w-3 h-3 text-amber-600" />
                                Reset Pass
                              </button>
                              <button
                                onClick={() => handleDeleteStudent(student)}
                                className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                                title="Unenroll Student"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}

                      {filteredStudents.length === 0 && (
                        <tr>
                          <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                            No students found for this filter. Click "Enroll Student" to add a new record.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: MENTORS & FACULTY */}
          {activeTab === 'mentors' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div className="relative flex-1 max-w-sm">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search mentors by name, email..."
                    value={mentorSearch}
                    onChange={e => setMentorSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <button
                  onClick={() => setIsAddMentorOpen(true)}
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors flex items-center gap-1.5 shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Assign Mentor
                </button>
              </div>

              {/* Mentors Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredMentors.map(mentor => (
                  <div key={mentor.id} className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h5 className="font-bold text-slate-900 text-xs">{mentor.fullName}</h5>
                          <p className="text-[11px] text-slate-500">{mentor.designation} • {mentor.departmentOrCompany}</p>
                          <p className="font-mono text-[10px] text-indigo-600 mt-0.5">{mentor.email}</p>
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase ${
                          mentor.type === 'FACULTY' ? 'bg-indigo-50 text-indigo-700' : 'bg-purple-50 text-purple-700'
                        }`}>
                          {mentor.type}
                        </span>
                      </div>

                      {/* Mentee allocation bar */}
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                          <span>Mentees Assigned</span>
                          <span className="font-bold text-slate-800">{mentor.assignedMenteesCount} / {mentor.maxMenteesCapacity}</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-indigo-600 rounded-full"
                            style={{ width: `${Math.min(100, (mentor.assignedMenteesCount / mentor.maxMenteesCapacity) * 100)}%` }}
                          />
                        </div>
                      </div>

                      {/* Specializations */}
                      <div className="mt-3 flex flex-wrap gap-1">
                        {mentor.specialization.map(spec => (
                          <span key={spec} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px]">
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 pt-2 border-t border-slate-100 flex items-center justify-between">
                      <button
                        onClick={() => handleToggleMentorStatus(mentor.id)}
                        className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase ${
                          mentor.accountStatus === 'ACTIVE'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-rose-100 text-rose-700'
                        }`}
                      >
                        {mentor.accountStatus}
                      </button>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleResetMentorPassword(mentor.id)}
                          className="px-2 py-1 text-[10px] font-medium text-slate-700 hover:bg-slate-100 rounded border border-slate-200 flex items-center gap-1"
                        >
                          <Key className="w-3 h-3 text-amber-600" />
                          Reset Pass
                        </button>
                        <button
                          onClick={() => handleDeleteMentor(mentor)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {filteredMentors.length === 0 && (
                  <div className="col-span-2 p-8 text-center text-slate-500 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                    No faculty mentors currently assigned to this campus.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Enroll Student Sub-Modal */}
        {isAddStudentOpen && (
          <div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-950/60 p-4">
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">Enroll Student to {institution.code}</h3>
                <button onClick={() => setIsAddStudentOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAddStudent} className="space-y-3 text-xs">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">University Seat Number (USN) *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 1ITS23CS099"
                    value={newUsn}
                    onChange={e => setNewUsn(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Student Email</label>
                  <input
                    type="email"
                    placeholder="Auto-generated if empty"
                    value={newEmail}
                    onChange={e => setNewEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Semester</label>
                    <select
                      value={newSemester}
                      onChange={e => setNewSemester(Number(e.target.value))}
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
                      value={newCgpa}
                      onChange={e => setNewCgpa(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Branch / Department</label>
                  <select
                    value={newBranch}
                    onChange={e => setNewBranch(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                  >
                    {institution.departments?.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div className="pt-3 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddStudentOpen(false)}
                    className="px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700"
                  >
                    Enroll Student
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Assign Mentor Sub-Modal */}
        {isAddMentorOpen && (
          <div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-950/60 p-4">
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">Assign Mentor to {institution.code}</h3>
                <button onClick={() => setIsAddMentorOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAddMentor} className="space-y-3 text-xs">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Ramesh Rao"
                    value={newMentorName}
                    onChange={e => setNewMentorName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Official Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="ramesh.rao@institution.edu.in"
                    value={newMentorEmail}
                    onChange={e => setNewMentorEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Mentor Type</label>
                    <select
                      value={newMentorType}
                      onChange={e => setNewMentorType(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                    >
                      <option value="FACULTY">Faculty Mentor</option>
                      <option value="INDUSTRY">Industry Mentor</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Mentee Capacity</label>
                    <input
                      type="number"
                      min="1"
                      max="50"
                      value={newMentorCapacity}
                      onChange={e => setNewMentorCapacity(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Designation</label>
                  <input
                    type="text"
                    value={newMentorDesignation}
                    onChange={e => setNewMentorDesignation(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>

                <div className="pt-3 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddMentorOpen(false)}
                    className="px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700"
                  >
                    Assign Mentor
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
