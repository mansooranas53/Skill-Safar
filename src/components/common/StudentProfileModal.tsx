import React, { useState, useEffect } from 'react';
import {
  StudentProfile,
  ManagedStudent,
  UserRole,
  ApplicationStatus,
  SkillScore,
  ProficiencyLevel
} from '../../types';
import { portalRepository } from '../../repositories/mockRepository';
import {
  X,
  ShieldCheck,
  Award,
  BookOpen,
  FolderGit2,
  FileText,
  Mail,
  GraduationCap,
  MapPin,
  ExternalLink,
  CheckCircle2,
  Clock,
  Briefcase,
  Star,
  Sparkles,
  Send,
  Building2,
  UserCheck,
  AlertCircle
} from 'lucide-react';

interface StudentProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentId?: string;
  student?: StudentProfile | ManagedStudent | null;
  viewerRole?: UserRole;
  opportunityTitle?: string;
  applicationMatchScore?: number;
  onUpdateApplicationStage?: (newStage: ApplicationStatus, note?: string) => void;
  onMentorshipFeedbackAdded?: (note: string) => void;
  onPlacementStatusChanged?: (newStatus: ManagedStudent['internshipStatus']) => void;
}

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  isOpen,
  onClose,
  studentId,
  student: initialStudent,
  viewerRole = 'INDUSTRY',
  opportunityTitle,
  applicationMatchScore,
  onUpdateApplicationStage,
  onMentorshipFeedbackAdded,
  onPlacementStatusChanged
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'skills' | 'projects' | 'certifications' | 'resume'>('overview');
  const [mentorNoteText, setMentorNoteText] = useState('');
  const [mentorEndorsedSkill, setMentorEndorsedSkill] = useState('');
  const [actionSuccessNotice, setActionSuccessNotice] = useState<string | null>(null);

  // Derive full StudentProfile
  const profile: StudentProfile = React.useMemo(() => {
    if (studentId) {
      return portalRepository.getStudentProfileById(studentId);
    }
    if (initialStudent) {
      if ('projects' in initialStudent && Array.isArray(initialStudent.projects)) {
        return initialStudent as StudentProfile;
      }
      return portalRepository.getStudentProfileById(initialStudent.id || initialStudent.email);
    }
    return portalRepository.getStudentProfile();
  }, [studentId, initialStudent]);

  useEffect(() => {
    if (isOpen) {
      setActionSuccessNotice(null);
      setMentorNoteText('');
    }
  }, [isOpen, profile.id]);

  if (!isOpen || !profile) return null;

  // Calculate aggregate verified score
  const avgSkillScore = profile.skills.length
    ? Math.round(profile.skills.reduce((acc, s) => acc + s.score, 0) / profile.skills.length)
    : 80;

  const showNotification = (msg: string) => {
    setActionSuccessNotice(msg);
    setTimeout(() => {
      setActionSuccessNotice(null);
    }, 4500);
  };

  const handleRecruiterStage = (stage: ApplicationStatus) => {
    if (onUpdateApplicationStage) {
      onUpdateApplicationStage(stage, `Status updated to ${stage} by Recruiter.`);
    }
    showNotification(`Candidate ${profile.fullName} successfully marked as "${stage.replace('_', ' ')}"!`);
  };

  const handleFacultyEndorsement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mentorNoteText && !mentorEndorsedSkill) return;

    portalRepository.addStudentMentorshipNote(
      profile.id,
      'Senior Faculty Mentor',
      mentorNoteText || 'Academic and technical progress validated.',
      mentorEndorsedSkill ? [mentorEndorsedSkill] : undefined
    );

    if (onMentorshipFeedbackAdded) {
      onMentorshipFeedbackAdded(mentorNoteText);
    }

    showNotification(`Mentorship note and endorsement recorded for ${profile.fullName}!`);
    setMentorNoteText('');
  };

  const handleAdminStatusChange = (newStatus: ManagedStudent['internshipStatus']) => {
    try {
      portalRepository.updateManagedStudent(profile.id, { internshipStatus: newStatus });
    } catch {
      // ignore
    }
    if (onPlacementStatusChanged) {
      onPlacementStatusChanged(newStatus);
    }
    showNotification(`Campus placement status for ${profile.fullName} updated to "${newStatus}".`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-4xl w-full my-6 max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden text-slate-900">
        
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-slate-900 text-white border-b border-slate-800 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Close profile dialog"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pr-10">
            {profile.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt={profile.fullName}
                referrerPolicy="no-referrer"
                className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-700 shadow-md shrink-0"
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-slate-800 text-white font-bold flex items-center justify-center text-xl border-2 border-slate-700 shadow-md shrink-0">
                {profile.fullName.slice(0, 2).toUpperCase()}
              </div>
            )}

            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">{profile.fullName}</h2>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Verified Student Profile
                </span>
                {viewerRole === 'INDUSTRY' && applicationMatchScore !== undefined && (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-800 text-slate-200 border border-slate-700">
                    Fit Score: <strong className="text-emerald-400">{applicationMatchScore}%</strong>
                  </span>
                )}
              </div>

              <p className="text-xs sm:text-sm text-slate-300 font-medium">
                {profile.headline}
              </p>

              <div className="flex items-center gap-4 text-xs text-slate-400 flex-wrap pt-1">
                <span className="flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5 text-slate-300" />
                  {profile.degree} &bull; {profile.branch}
                </span>
                <span className="flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-slate-300" />
                  {profile.institutionName}
                </span>
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-300" />
                  {profile.email}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-slate-800/80 text-xs">
            <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
              <div className="text-slate-400 text-[10px] uppercase font-semibold">Verified Skill Index</div>
              <div className="text-lg font-black text-emerald-400 mt-0.5">{avgSkillScore} / 100</div>
            </div>
            <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
              <div className="text-slate-400 text-[10px] uppercase font-semibold">Academic CGPA</div>
              <div className="text-lg font-black text-white mt-0.5">{profile.cgpa} <span className="text-xs text-slate-400 font-normal">/ 10.0</span></div>
            </div>
            <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
              <div className="text-slate-400 text-[10px] uppercase font-semibold">Graduation Year</div>
              <div className="text-lg font-black text-white mt-0.5">{profile.graduationYear}</div>
            </div>
            <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
              <div className="text-slate-400 text-[10px] uppercase font-semibold">Candidate Status</div>
              <div className="text-sm font-bold text-slate-200 mt-1 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                Active Candidate
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-6 pt-2 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'overview'
                ? 'border-slate-900 text-slate-900 bg-white rounded-t-lg'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Profile Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('skills')}
            className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'skills'
                ? 'border-slate-900 text-slate-900 bg-white rounded-t-lg'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Verified Skills ({profile.skills.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('projects')}
            className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'projects'
                ? 'border-slate-900 text-slate-900 bg-white rounded-t-lg'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <FolderGit2 className="w-3.5 h-3.5" />
            <span>Projects & Work ({profile.projects.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('certifications')}
            className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'certifications'
                ? 'border-slate-900 text-slate-900 bg-white rounded-t-lg'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Certifications ({profile.certifications.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('resume')}
            className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'resume'
                ? 'border-slate-900 text-slate-900 bg-white rounded-t-lg'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Resume & Credentials</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          
          {/* Action Success Alert */}
          {actionSuccessNotice && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{actionSuccessNotice}</span>
            </div>
          )}

          {/* 1. OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Bio & Candidate Summary */}
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Candidate Bio & Technical Focus
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {profile.bio}
                </p>
              </div>

              {/* Preferences Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-slate-500" />
                    Target Job Roles
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {profile.preferredRoles.map((role, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-800 font-medium text-[11px] border border-slate-200">
                        {role}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    Preferred Locations
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {profile.preferredLocations.map((loc, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-800 font-medium text-[11px] border border-slate-200">
                        {loc}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Top Verified Skills Quick Glance */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Core Competency Breakdown
                  </h4>
                  <button
                    onClick={() => setActiveTab('skills')}
                    className="text-xs font-bold text-slate-900 hover:underline"
                  >
                    View All & Proof Sources &rarr;
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {profile.skills.slice(0, 4).map(skill => (
                    <div key={skill.skillId} className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-900">{skill.skillName}</span>
                        <span className="text-xs font-black text-slate-800">{skill.score}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-slate-900 h-full rounded-full transition-all"
                          style={{ width: `${skill.score}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span className="font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                          {skill.proficiency}
                        </span>
                        <span>{skill.evidenceSources.length} verified proof sources</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Latest Project Feature */}
              {profile.projects[0] && (
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-200 text-slate-800">
                      Featured Project
                    </span>
                    <span className="text-xs text-slate-500">Completed {profile.projects[0].completedDate}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">{profile.projects[0].title}</h4>
                  <p className="text-xs text-slate-600 mt-1 mb-3 leading-relaxed">
                    {profile.projects[0].description}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {profile.projects[0].technologies.map(t => (
                      <span key={t} className="px-2 py-0.5 bg-white text-slate-700 font-medium rounded text-[10px] border border-slate-200">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 2. SKILLS TAB */}
          {activeTab === 'skills' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Deterministic Verified Competency Ledger</h3>
                  <p className="text-xs text-slate-500">
                    Assessed through non-deterministic tasks, coding sandbox tests, and verified repository analysis.
                  </p>
                </div>
                <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                  Avg Competency: {avgSkillScore}%
                </span>
              </div>

              <div className="space-y-3">
                {profile.skills.map(skill => (
                  <div
                    key={skill.skillId}
                    className="p-4 bg-white rounded-xl border border-slate-200 hover:border-slate-300 transition-all space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900">{skill.skillName}</span>
                          <span className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded-md bg-slate-100 text-slate-800 border border-slate-200">
                            {skill.proficiency}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-500">
                          Assessed {skill.lastAssessedAt || 'Recently'} &bull; Confidence Rating: {skill.confidence}%
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="text-xl font-black text-slate-900">{skill.score}</span>
                        <span className="text-xs text-slate-400"> / 100</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-slate-900 h-full rounded-full transition-all"
                        style={{ width: `${skill.score}%` }}
                      />
                    </div>

                    {/* Proof Sources */}
                    <div className="bg-slate-50 rounded-lg p-3 border border-slate-200/70 text-xs">
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Verifiable Evidence Trail
                      </div>
                      <div className="space-y-1.5">
                        {skill.evidenceSources.map(ev => (
                          <div key={ev.id} className="flex items-center justify-between text-[11px] text-slate-700">
                            <span>
                              <strong>{ev.sourceType}:</strong> {ev.title} ({ev.issuerOrContext})
                            </span>
                            <span className="text-slate-500 font-mono">{ev.date} {ev.scoreOrGrade && `[${ev.scoreOrGrade}]`}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. PROJECTS TAB */}
          {activeTab === 'projects' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Engineering Work Artifacts & Projects</h3>
                <p className="text-xs text-slate-500">
                  Practical problem-solving artifacts with verifiable code repositories.
                </p>
              </div>

              <div className="space-y-4">
                {profile.projects.map(proj => (
                  <div key={proj.id} className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                      <div>
                        <h4 className="text-base font-bold text-slate-900">{proj.title}</h4>
                        <span className="text-xs text-slate-400">Completed Date: {proj.completedDate}</span>
                      </div>

                      {proj.githubUrl && (
                        <a
                          href={proj.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 text-white hover:bg-slate-800 text-xs font-medium transition-colors shrink-0"
                        >
                          <FolderGit2 className="w-3.5 h-3.5" />
                          <span>View Code Repository</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {proj.description}
                    </p>

                    <div className="space-y-1 pt-1">
                      <div className="text-[10px] uppercase font-bold text-slate-400">Technologies Stack</div>
                      <div className="flex flex-wrap gap-1.5">
                        {proj.technologies.map(t => (
                          <span key={t} className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 text-[11px] font-medium border border-slate-200">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    {proj.skillsDemonstrated.length > 0 && (
                      <div className="text-[11px] text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Demonstrates competencies: <strong>{proj.skillsDemonstrated.join(', ')}</strong></span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. CERTIFICATIONS TAB */}
          {activeTab === 'certifications' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Industry Certifications & Credentials</h3>
                <p className="text-xs text-slate-500">
                  Third-party accredited credentials verified through provider APIs.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {profile.certifications.map(cert => (
                  <div key={cert.id} className="p-4 bg-white rounded-xl border border-slate-200 space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                        <Award className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">Issued {cert.issueDate}</span>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{cert.title}</h4>
                      <p className="text-xs text-slate-500">{cert.issuer}</p>
                    </div>

                    {cert.credentialId && (
                      <div className="text-[10px] text-slate-500 font-mono bg-slate-50 p-1.5 rounded border border-slate-200">
                        ID: {cert.credentialId}
                      </div>
                    )}

                    <div className="flex flex-wrap gap-1 pt-1">
                      {cert.skillsCertified.map(s => (
                        <span key={s} className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-medium">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. RESUME & CREDENTIALS TAB */}
          {activeTab === 'resume' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Candidate Resume & Verified Profile Dossier</h3>
                <p className="text-xs text-slate-500">
                  Standardized ATS-parsed resume summary and verified academic credentials.
                </p>
              </div>

              {profile.resumes && profile.resumes[0] ? (
                <div className="p-5 bg-white rounded-2xl border border-slate-200 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-bold text-sm text-slate-900">{profile.resumes[0].fileName}</div>
                        <div className="text-xs text-slate-400">{profile.resumes[0].fileSize} &bull; Uploaded {profile.resumes[0].uploadedAt}</div>
                      </div>
                    </div>

                    <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
                      Verified ATS Resume
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">Executive Summary</div>
                    <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                      {profile.resumes[0].summary}
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">Extracted Skills & Keywords</div>
                    <div className="flex flex-wrap gap-1.5">
                      {profile.resumes[0].extractedSkills.map(sk => (
                        <span key={sk} className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-800 text-xs font-medium border border-slate-200">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-6 text-center text-slate-400 text-xs bg-slate-50 rounded-xl border border-slate-200">
                  No uploaded PDF file attached. Verified competency ledger serves as primary evaluation dossier.
                </div>
              )}
            </div>
          )}

        </div>

        {/* Modal Action Bar (Role-Specific Context Controls) */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          
          {/* 1. INDUSTRIALIST CONTROLS */}
          {viewerRole === 'INDUSTRY' && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full gap-3">
              <div className="text-slate-600">
                <span className="font-bold text-slate-900">Recruiter Actions:</span>
                <span className="text-slate-500 ml-1">
                  Evaluate {profile.fullName} for active hiring pipeline
                </span>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => handleRecruiterStage('SHORTLISTED')}
                  className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-colors shadow-xs"
                >
                  Shortlist Candidate
                </button>
                <button
                  onClick={() => handleRecruiterStage('INTERVIEW')}
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors shadow-xs"
                >
                  Invite to Interview
                </button>
                <button
                  onClick={() => handleRecruiterStage('SELECTED')}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 font-bold rounded-xl transition-colors"
                >
                  Extend Offer
                </button>
              </div>
            </div>
          )}

          {/* 2. FACULTY CONTROLS */}
          {viewerRole === 'ACADEMICIAN' && (
            <div className="w-full space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="text-slate-600">
                  <span className="font-bold text-slate-900">Faculty Mentorship Panel:</span>
                  <span className="text-slate-500 ml-1">
                    Endorse student competencies or record guidance note
                  </span>
                </div>
              </div>

              <form onSubmit={handleFacultyEndorsement} className="flex flex-col sm:flex-row items-center gap-2 w-full">
                <input
                  type="text"
                  value={mentorNoteText}
                  onChange={e => setMentorNoteText(e.target.value)}
                  placeholder="Record faculty mentorship remark or project milestone evaluation..."
                  className="flex-1 bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900 w-full"
                />

                <select
                  value={mentorEndorsedSkill}
                  onChange={e => setMentorEndorsedSkill(e.target.value)}
                  className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none w-full sm:w-auto"
                >
                  <option value="">Endorse a Core Skill...</option>
                  {profile.skills.map(s => (
                    <option key={s.skillId} value={s.skillName}>{s.skillName}</option>
                  ))}
                </select>

                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-colors shadow-xs shrink-0 flex items-center gap-1.5 w-full sm:w-auto justify-center"
                >
                  <Send className="w-3 h-3" />
                  <span>Save Mentorship Note</span>
                </button>
              </form>
            </div>
          )}

          {/* 3. CAMPUS ADMIN CONTROLS */}
          {viewerRole === 'INSTITUTION_ADMIN' && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full gap-3">
              <div className="text-slate-600">
                <span className="font-bold text-slate-900">Campus Administration:</span>
                <span className="text-slate-500 ml-1">
                  Manage placement verification for {profile.fullName}
                </span>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-slate-500 text-[11px] font-semibold">Placement Stage:</span>
                <button
                  onClick={() => handleAdminStatusChange('Placed')}
                  className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold rounded-xl transition-colors"
                >
                  Mark as Placed
                </button>
                <button
                  onClick={() => handleAdminStatusChange('Interviewing')}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-colors"
                >
                  Interviewing
                </button>
                <button
                  onClick={() => handleAdminStatusChange('Seeking')}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 font-bold rounded-xl transition-colors"
                >
                  Actively Seeking
                </button>
              </div>
            </div>
          )}

          {/* SUPER ADMIN OR DEFAULT */}
          {viewerRole === 'SUPER_ADMIN' && (
            <div className="flex items-center justify-between w-full">
              <span className="text-slate-500">
                Viewing student record in Master Audit inspection mode.
              </span>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl font-bold"
              >
                Close Viewer
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
