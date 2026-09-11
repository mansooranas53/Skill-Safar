import React, { useState } from 'react';
import { portalRepository } from '../../repositories/mockRepository';
import { FacultyCollaboration, ManagedStudent } from '../../types';
import { StudentProfileModal } from '../common/StudentProfileModal';
import {
  BookOpen,
  Building2,
  Calendar,
  Sparkles,
  CheckCircle2,
  Award,
  DollarSign,
  FileText,
  MapPin,
  ExternalLink,
  GraduationCap,
  Users,
  Search,
  Filter,
  Eye,
  ShieldCheck,
  UserCheck
} from 'lucide-react';

export const AcademicianDashboard: React.FC = () => {
  const academicians = portalRepository.getAcademicians();
  const collaborations = portalRepository.getCollaborations();
  const currentProf = academicians[0];

  const [activeTab, setActiveTab] = useState<'mentees' | 'synergy'>('mentees');
  const [appliedNotice, setAppliedNotice] = useState<string | null>(null);

  // Student Profile Watch state
  const [selectedStudentForProfile, setSelectedStudentForProfile] = useState<string | null>(null);

  // Filter state for mentees
  const [studentSearchQuery, setStudentSearchQuery] = useState('');
  const [studentBranchFilter, setStudentBranchFilter] = useState('ALL');
  const [mentorshipScope, setMentorshipScope] = useState<'MY_INSTITUTION' | 'ALL_CAMPUSES'>('MY_INSTITUTION');

  const allStudents = portalRepository.getManagedStudents();

  // Filter students by institution or branch
  const institutionStudents = mentorshipScope === 'MY_INSTITUTION'
    ? allStudents.filter(s => s.institutionName === currentProf.institutionName || s.institutionName.includes('Bangalore'))
    : allStudents;

  const filteredStudents = institutionStudents.filter(std => {
    if (studentBranchFilter !== 'ALL' && std.branch !== studentBranchFilter) return false;
    if (studentSearchQuery.trim()) {
      const q = studentSearchQuery.toLowerCase();
      const matchName = std.fullName.toLowerCase().includes(q);
      const matchUsn = std.usn.toLowerCase().includes(q);
      const matchEmail = std.email.toLowerCase().includes(q);
      const matchBranch = std.branch.toLowerCase().includes(q);
      if (!matchName && !matchUsn && !matchEmail && !matchBranch) return false;
    }
    return true;
  });

  const avgMenteeScore = filteredStudents.length
    ? Math.round(filteredStudents.reduce((acc, s) => acc + s.verifiedSkillScore, 0) / filteredStudents.length)
    : 82;

  const handleApplyCollab = (collab: FacultyCollaboration) => {
    setAppliedNotice(`Collaboration proposal submitted for "${collab.title}". The industry coordinator at ${collab.industryPartner} has been notified.`);
    setTimeout(() => setAppliedNotice(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold text-xl shadow-xs">
            <GraduationCap className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <h2 className="text-xl font-bold text-slate-900">{currentProf.fullName}</h2>
              <span className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider bg-slate-100 text-slate-800 rounded-md border border-slate-200">
                Senior Faculty & Research Mentor
              </span>
            </div>
            <p className="text-xs text-slate-500">
              {currentProf.designation} &bull; {currentProf.institutionName}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 bg-slate-50 text-slate-800 rounded-xl text-center min-w-28 border border-slate-200">
            <div className="text-[10px] text-slate-500 font-medium">Assigned Mentees</div>
            <div className="text-lg font-black text-slate-900">{filteredStudents.length} Students</div>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl text-center min-w-28 border border-emerald-100">
            <div className="text-[10px] text-slate-500 font-medium">Avg Mentee Score</div>
            <div className="text-lg font-black text-emerald-700">{avgMenteeScore} / 100</div>
          </div>
        </div>
      </div>

      {/* Applied Banner */}
      {appliedNotice && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-medium flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{appliedNotice}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('mentees')}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'mentees'
              ? 'border-slate-900 text-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Department Students & Mentees ({filteredStudents.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('synergy')}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'synergy'
              ? 'border-slate-900 text-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Industry–Academia Synergy RFPs ({collaborations.length})</span>
        </button>
      </div>

      {/* 1. MENTEES AND STUDENTS DIRECTORY */}
      {activeTab === 'mentees' && (
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search students by name, USN, email, or discipline..."
                value={studentSearchQuery}
                onChange={e => setStudentSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto flex-wrap">
              <select
                value={mentorshipScope}
                onChange={e => setMentorshipScope(e.target.value as 'MY_INSTITUTION' | 'ALL_CAMPUSES')}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700"
              >
                <option value="MY_INSTITUTION">My Campus ({currentProf.institutionName.split(',')[0]})</option>
                <option value="ALL_CAMPUSES">All Partner Campuses</option>
              </select>

              <select
                value={studentBranchFilter}
                onChange={e => setStudentBranchFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700"
              >
                <option value="ALL">All Disciplines</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Data Science & AI">Data Science & AI</option>
                <option value="Electronics & Communication">Electronics & Communication</option>
                <option value="Robotics & Automation">Robotics & Automation</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Mechanical & Mechatronics">Mechanical & Mechatronics</option>
              </select>
            </div>
          </div>

          {/* Student Roster Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold tracking-wider">
                  <tr>
                    <th className="p-4">Student & USN</th>
                    <th className="p-4">Discipline & Sem</th>
                    <th className="p-4">Academic CGPA</th>
                    <th className="p-4">Verified Skill Index</th>
                    <th className="p-4">Placement Status</th>
                    <th className="p-4 text-right">Faculty Review</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredStudents.map(std => (
                    <tr key={std.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-4">
                        <button
                          onClick={() => setSelectedStudentForProfile(std.id)}
                          className="text-left group flex items-start gap-3"
                        >
                          <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0 group-hover:bg-emerald-700 transition-colors">
                            {std.fullName.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors flex items-center gap-1.5">
                              <span>{std.fullName}</span>
                              <Eye className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 transition-colors" />
                            </div>
                            <div className="text-[11px] text-slate-500 font-mono">USN: {std.usn}</div>
                            <div className="text-[10px] text-slate-400">{std.email}</div>
                          </div>
                        </button>
                      </td>

                      <td className="p-4">
                        <div className="font-semibold text-slate-800">{std.branch}</div>
                        <div className="text-[11px] text-slate-500">Semester {std.semester}</div>
                      </td>

                      <td className="p-4">
                        <span className="font-bold text-slate-900 text-sm">{std.cgpa}</span>
                        <span className="text-slate-400 text-xs"> / 10.0</span>
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-black text-slate-900">{std.verifiedSkillScore}%</span>
                          <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-bold border border-emerald-200">
                            {std.verifiedSkillScore >= 85 ? 'Top 5%' : std.verifiedSkillScore >= 75 ? 'Industry Ready' : 'In Progress'}
                          </span>
                        </div>
                        <div className="w-28 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-slate-900 h-full rounded-full"
                            style={{ width: `${std.verifiedSkillScore}%` }}
                          />
                        </div>
                      </td>

                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                          std.internshipStatus === 'Placed'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : std.internshipStatus === 'Interviewing'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : 'bg-slate-100 text-slate-700 border-slate-200'
                        }`}>
                          {std.internshipStatus}
                        </span>
                      </td>

                      <td className="p-4 text-right">
                        <button
                          onClick={() => setSelectedStudentForProfile(std.id)}
                          className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-all text-xs inline-flex items-center gap-1.5 shadow-xs"
                          title="Watch student portfolio, project repos, and record mentorship remark"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Watch Profile</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredStudents.length === 0 && (
              <div className="p-8 text-center text-slate-400 text-xs">
                No students match the current filters.
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. SYNERGY OPPORTUNITIES TAB */}
      {activeTab === 'synergy' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Industry–Academia Synergy Opportunities</h3>
              <p className="text-xs text-slate-500">
                Faculty sabbaticals, co-funded research grants, and accredited Faculty Development Programs (FDPs).
              </p>
            </div>
            <span className="text-xs text-slate-400">
              {collaborations.length} Active Industry RFPs
            </span>
          </div>

          <div className="space-y-4">
            {collaborations.map(collab => (
              <div
                key={collab.id}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:border-slate-400 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 border border-slate-200">
                      {collab.type}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                      {collab.domain}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {collab.stipendOrGrant}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-slate-900 leading-snug">
                    {collab.title}
                  </h4>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {collab.description}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-slate-500 flex-wrap">
                    <span className="font-semibold text-slate-800 flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      {collab.industryPartner}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {collab.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      Duration: {collab.duration} &bull; Deadline: {collab.deadline}
                    </span>
                  </div>
                </div>

                <div className="shrink-0 flex items-center justify-end">
                  <button
                    onClick={() => handleApplyCollab(collab)}
                    className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-2"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Submit Faculty Expression of Interest</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Watch Student Profile (with Faculty Context) */}
      <StudentProfileModal
        isOpen={!!selectedStudentForProfile}
        onClose={() => setSelectedStudentForProfile(null)}
        studentId={selectedStudentForProfile || undefined}
        viewerRole="ACADEMICIAN"
      />
    </div>
  );
};
