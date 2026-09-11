import React, { useState } from 'react';
import { Opportunity, Application, ApplicationStatus, StudentProfile, ManagedStudent } from '../../types';
import { OpportunityService, ApplicationService } from '../../services/portalServices';
import { OpportunityCreatorModal } from './OpportunityCreatorModal';
import { StudentProfileModal } from '../common/StudentProfileModal';
import { portalRepository } from '../../repositories/mockRepository';
import { MatchScoreBadge } from '../common/MatchScoreBadge';
import {
  Building2,
  Plus,
  Users,
  CheckCircle2,
  Clock,
  Calendar,
  XCircle,
  Briefcase,
  Sparkles,
  Search,
  Filter,
  ArrowRight,
  ShieldCheck,
  Eye,
  GraduationCap,
  Award,
  ExternalLink
} from 'lucide-react';

export const IndustryDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'pipeline' | 'listings' | 'talent'>('pipeline');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [stageModalApp, setStageModalApp] = useState<Application | null>(null);
  const [nextStage, setNextStage] = useState<ApplicationStatus>('SHORTLISTED');
  const [stageNote, setStageNote] = useState('');
  const [interviewDate, setInterviewDate] = useState('2026-09-18T14:30');
  const [selectedOppFilter, setSelectedOppFilter] = useState<string>('all');

  // Watch Profile State
  const [selectedStudentForProfile, setSelectedStudentForProfile] = useState<{
    id: string;
    opportunityTitle?: string;
    matchScore?: number;
  } | null>(null);

  // Talent Pool Filter State
  const [talentSearchQuery, setTalentSearchQuery] = useState('');
  const [talentBranchFilter, setTalentBranchFilter] = useState('ALL');
  const [talentMinScoreFilter, setTalentMinScoreFilter] = useState<number>(0);

  const opportunities = OpportunityService.getAll();
  const applications = portalRepository.getApplications();
  const student = portalRepository.getStudentProfile();
  const managedStudents = portalRepository.getManagedStudents();

  const filteredApplications = applications.filter(a => {
    if (selectedOppFilter !== 'all' && a.opportunityId !== selectedOppFilter) return false;
    return true;
  });

  const filteredTalentPool = managedStudents.filter(std => {
    if (talentBranchFilter !== 'ALL' && std.branch !== talentBranchFilter) return false;
    if (talentMinScoreFilter > 0 && std.verifiedSkillScore < talentMinScoreFilter) return false;
    if (talentSearchQuery.trim()) {
      const q = talentSearchQuery.toLowerCase();
      const matchName = std.fullName.toLowerCase().includes(q);
      const matchEmail = std.email.toLowerCase().includes(q);
      const matchBranch = std.branch.toLowerCase().includes(q);
      const matchInst = std.institutionName.toLowerCase().includes(q);
      if (!matchName && !matchEmail && !matchBranch && !matchInst) return false;
    }
    return true;
  });

  const handleUpdateStage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!stageModalApp) return;

    try {
      ApplicationService.updateStatus(
        stageModalApp.id,
        nextStage,
        stageNote,
        'CloudScale Lead Recruiter',
        nextStage === 'INTERVIEW' ? interviewDate : undefined
      );
      setStageModalApp(null);
      setStageNote('');
    } catch (err: unknown) {
      alert((err as Error).message || 'Invalid state transition');
    }
  };

  const handleToggleStatus = (opp: Opportunity) => {
    const newStatus = opp.status === 'PUBLISHED' ? 'CLOSED' : 'PUBLISHED';
    try {
      OpportunityService.updateStatus(opp.id, newStatus);
    } catch (err: unknown) {
      alert((err as Error).message || 'Failed to update opportunity status');
    }
  };

  return (
    <div className="space-y-6">
      {/* Industry Recruiter Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black text-xl shadow-xs">
            CS
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <h2 className="text-xl font-bold text-slate-900">CloudScale Technologies</h2>
              <span className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider bg-emerald-50 text-emerald-700 rounded-md border border-emerald-200 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600" /> Verified Partner
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Cloud Infrastructure & Developer Platforms • Bangalore, India
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create Opportunity</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="text-xs font-medium text-slate-500">Active Listings</div>
          <div className="text-2xl font-black text-slate-900 mt-1">
            {opportunities.filter(o => o.status === 'PUBLISHED').length}
          </div>
          <span className="text-[10px] text-slate-400 mt-2 block">Published on student portal</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="text-xs font-medium text-slate-500">Total Applicants</div>
          <div className="text-2xl font-black text-slate-900 mt-1">
            {applications.length}
          </div>
          <span className="text-[10px] text-slate-400 mt-2 block">Screened by matching engine</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="text-xs font-medium text-slate-500">In Interview Stage</div>
          <div className="text-2xl font-black text-slate-900 mt-1">
            {applications.filter(a => a.status === 'INTERVIEW').length}
          </div>
          <span className="text-[10px] text-slate-400 mt-2 block">Technical rounds ongoing</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="text-xs font-medium text-slate-500">Avg Candidate Fit</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">
            {Math.round(applications.reduce((acc, a) => acc + a.matchScore, 0) / (applications.length || 1))}%
          </div>
          <span className="text-[10px] text-slate-400 mt-2 block">Explainable competency compatibility</span>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('pipeline')}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'pipeline'
              ? 'border-slate-900 text-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Candidate Pipeline ({filteredApplications.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('talent')}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'talent'
              ? 'border-slate-900 text-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Talent Pool & Student Profiles ({filteredTalentPool.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('listings')}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'listings'
              ? 'border-slate-900 text-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Manage Listings ({opportunities.length})</span>
        </button>
      </div>

      {/* Pipeline View */}
      {activeTab === 'pipeline' && (
        <div className="space-y-4">
          {/* Opportunity Filter selector */}
          <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200 text-xs">
            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-semibold text-slate-700">Filter by Opportunity:</span>
              <select
                value={selectedOppFilter}
                onChange={e => setSelectedOppFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs"
              >
                <option value="all">All Postings ({applications.length} Candidates)</option>
                {opportunities.map(o => (
                  <option key={o.id} value={o.id}>{o.title}</option>
                ))}
              </select>
            </div>
            <span className="text-slate-400 text-[11px]">
              Sorted by deterministic compatibility
            </span>
          </div>

          {/* Candidates List */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold tracking-wider">
                  <tr>
                    <th className="p-4">Candidate Profile</th>
                    <th className="p-4">Opportunity</th>
                    <th className="p-4">Match Compatibility</th>
                    <th className="p-4">Recruitment Stage</th>
                    <th className="p-4">Applied Date</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredApplications.map(app => (
                    <tr key={app.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-4">
                        <button
                          onClick={() => setSelectedStudentForProfile({
                            id: app.studentId,
                            opportunityTitle: app.opportunityTitle,
                            matchScore: app.matchScore
                          })}
                          className="text-left group flex items-start gap-2.5"
                        >
                          <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center font-bold text-xs shrink-0 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                            {app.studentName.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors flex items-center gap-1.5">
                              <span>{app.studentName}</span>
                              <Eye className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 transition-colors" />
                            </div>
                            <div className="text-[11px] text-slate-500">{app.studentDegree} • {app.studentBranch}</div>
                            <div className="text-[10px] text-slate-400">{app.studentEmail}</div>
                          </div>
                        </button>
                      </td>
                      <td className="p-4">
                        <div className="font-semibold text-slate-800">{app.opportunityTitle}</div>
                        <div className="text-[10px] text-slate-400">{app.opportunityType}</div>
                      </td>
                      <td className="p-4">
                        <MatchScoreBadge score={app.matchScore} size="sm" />
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                          app.status === 'SELECTED'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : app.status === 'INTERVIEW'
                            ? 'bg-slate-900 text-white border-slate-900'
                            : app.status === 'SHORTLISTED'
                            ? 'bg-slate-100 text-slate-800 border-slate-300'
                            : app.status === 'REJECTED'
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : 'bg-slate-100 text-slate-700 border-slate-200'
                        }`}>
                          {app.status.replace('_', ' ')}
                        </span>
                        {app.interviewDate && (
                          <div className="text-[10px] text-slate-500 mt-1">
                            Interview: {new Date(app.interviewDate).toLocaleDateString()}
                          </div>
                        )}
                      </td>
                      <td className="p-4 text-slate-500">
                        {new Date(app.appliedAt).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => setSelectedStudentForProfile({
                            id: app.studentId,
                            opportunityTitle: app.opportunityTitle,
                            matchScore: app.matchScore
                          })}
                          className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-all text-xs inline-flex items-center gap-1.5 shadow-xs"
                          title="Watch full verified student profile, portfolio & evidence"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Watch Profile</span>
                        </button>
                        <button
                          onClick={() => {
                            setStageModalApp(app);
                            // default next stage
                            if (app.status === 'APPLIED') setNextStage('UNDER_REVIEW');
                            else if (app.status === 'UNDER_REVIEW') setNextStage('SHORTLISTED');
                            else if (app.status === 'SHORTLISTED') setNextStage('INTERVIEW');
                            else if (app.status === 'INTERVIEW') setNextStage('SELECTED');
                          }}
                          className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-800 border border-emerald-200 font-bold rounded-xl transition-all text-xs"
                        >
                          Update Stage
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Talent Pool / Watch Student Profiles Tab */}
      {activeTab === 'talent' && (
        <div className="space-y-4">
          {/* Filter and Search Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search students by name, skills, USN, or institution..."
                value={talentSearchQuery}
                onChange={e => setTalentSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto flex-wrap">
              <select
                value={talentBranchFilter}
                onChange={e => setTalentBranchFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700"
              >
                <option value="ALL">All Engineering Disciplines</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Data Science & AI">Data Science & AI</option>
                <option value="Electronics & Communication">Electronics & Communication</option>
                <option value="Robotics & Automation">Robotics & Automation</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Mechanical & Mechatronics">Mechanical & Mechatronics</option>
              </select>

              <select
                value={talentMinScoreFilter}
                onChange={e => setTalentMinScoreFilter(Number(e.target.value))}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700"
              >
                <option value={0}>Any Verified Skill Score</option>
                <option value={75}>Score 75%+</option>
                <option value={80}>Score 80%+ (Top Tier)</option>
                <option value={85}>Score 85%+ (Elite)</option>
              </select>
            </div>
          </div>

          {/* Student Talent Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTalentPool.map(std => (
              <div
                key={std.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-slate-900 text-white font-bold flex items-center justify-center text-sm shrink-0">
                        {std.fullName.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 leading-tight">{std.fullName}</h4>
                        <div className="text-[11px] text-slate-500">{std.branch}</div>
                        <div className="text-[10px] text-slate-400 font-mono">USN: {std.usn}</div>
                      </div>
                    </div>

                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      std.internshipStatus === 'Placed'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : std.internshipStatus === 'Interviewing'
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}>
                      {std.internshipStatus}
                    </span>
                  </div>

                  {/* Institution and Academic Stats */}
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 space-y-1.5 text-xs">
                    <div className="text-slate-600 truncate font-medium">
                      {std.institutionName}
                    </div>
                    <div className="flex items-center justify-between text-slate-500 text-[11px]">
                      <span>Semester {std.semester} &bull; CGPA: <strong className="text-slate-800">{std.cgpa}</strong></span>
                      <span>Verified: <strong className="text-emerald-700">{std.verifiedSkillScore}%</strong></span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-600 h-full rounded-full"
                        style={{ width: `${std.verifiedSkillScore}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-slate-400 font-medium">
                    Verified Competencies
                  </span>
                  <button
                    onClick={() => setSelectedStudentForProfile({ id: std.id })}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs inline-flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Watch Profile</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredTalentPool.length === 0 && (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs">
              No students match the selected discipline and skill score filters.
            </div>
          )}
        </div>
      )}

      {/* Listings Tab */}
      {activeTab === 'listings' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">Active & Draft Postings</h3>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-xl"
            >
              <Plus className="w-4 h-4" />
              <span>Post New Role</span>
            </button>
          </div>

          <div className="space-y-3">
            {opportunities.map(opp => (
              <div
                key={opp.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                      {opp.opportunityType}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                      opp.status === 'PUBLISHED'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      {opp.status}
                    </span>
                    <span className="text-xs text-slate-400">Deadline: {opp.applicationDeadline}</span>
                  </div>
                  <h4 className="text-base font-bold text-slate-900">{opp.title}</h4>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                    <span>{opp.location}</span>
                    <span>{opp.stipendOrSalary}</span>
                    <span className="font-semibold text-slate-800">{opp.totalApplicants} Applicants</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleStatus(opp)}
                    className="px-3 py-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl"
                  >
                    {opp.status === 'PUBLISHED' ? 'Close Listing' : 'Publish Listing'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Update Application Stage */}
      {stageModalApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <form
            onSubmit={handleUpdateStage}
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4"
          >
            <div className="border-b border-slate-100 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                Advance Recruitment Lifecycle
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-0.5">
                {stageModalApp.studentName}
              </h3>
              <p className="text-xs text-slate-500">
                Position: {stageModalApp.opportunityTitle} (Current: {stageModalApp.status})
              </p>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Select Target Stage *
              </label>
              <select
                value={nextStage}
                onChange={e => setNextStage(e.target.value as ApplicationStatus)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              >
                <option value="UNDER_REVIEW">UNDER_REVIEW (Screening)</option>
                <option value="SHORTLISTED">SHORTLISTED (Technical Review)</option>
                <option value="INTERVIEW">INTERVIEW (Schedule Technical Round)</option>
                <option value="SELECTED">SELECTED (Offer Extended)</option>
                <option value="REJECTED">REJECTED (Decline Candidate)</option>
              </select>
            </div>

            {nextStage === 'INTERVIEW' && (
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Interview Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={interviewDate}
                  onChange={e => setInterviewDate(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Audited Note for Candidate
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Cleared technical screening; schedule round 1 system design..."
                value={stageNote}
                onChange={e => setStageNote(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setStageModalApp(null)}
                className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs"
              >
                Confirm Stage Transition
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal: Create Opportunity */}
      <OpportunityCreatorModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />

      {/* Modal: Watch Student Profile */}
      <StudentProfileModal
        isOpen={!!selectedStudentForProfile}
        onClose={() => setSelectedStudentForProfile(null)}
        studentId={selectedStudentForProfile?.id}
        viewerRole="INDUSTRY"
        opportunityTitle={selectedStudentForProfile?.opportunityTitle}
        applicationMatchScore={selectedStudentForProfile?.matchScore}
        onUpdateApplicationStage={(newStage, note) => {
          // If viewing candidate from an active application
          const matchApp = applications.find(a => a.studentId === selectedStudentForProfile?.id);
          if (matchApp) {
            try {
              ApplicationService.updateStatus(
                matchApp.id,
                newStage,
                note || `Stage updated to ${newStage} via Profile Viewer`,
                'Industry Recruiter'
              );
            } catch (err) {
              console.warn('Could not update application stage:', err);
            }
          }
        }}
      />
    </div>
  );
};
