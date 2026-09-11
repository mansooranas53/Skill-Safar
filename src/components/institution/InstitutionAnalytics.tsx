import React, { useState, useEffect } from 'react';
import { portalRepository } from '../../repositories/mockRepository';
import { InstitutionProfile, ManagedStudent } from '../../types';
import { StudentProfileModal } from '../common/StudentProfileModal';
import {
  School,
  TrendingUp,
  Award,
  Users,
  Building2,
  AlertTriangle,
  CheckCircle2,
  BarChart3,
  Layers,
  ChevronDown,
  Sliders,
  ShieldCheck,
  ExternalLink,
  Search,
  Filter,
  Eye,
  GraduationCap
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell
} from 'recharts';

interface InstitutionAnalyticsProps {
  onOpenMasterAdmin?: () => void;
}

export const InstitutionAnalytics: React.FC<InstitutionAnalyticsProps> = ({
  onOpenMasterAdmin
}) => {
  const [institutions, setInstitutions] = useState<InstitutionProfile[]>([]);
  const [activeInstitution, setActiveInstitution] = useState<InstitutionProfile>(portalRepository.getActiveInstitution());
  const [activeTab, setActiveTab] = useState<'analytics' | 'students'>('analytics');

  // Student Profile Watch modal state
  const [selectedStudentForProfile, setSelectedStudentForProfile] = useState<string | null>(null);

  // Student directory filters
  const [studentSearchQuery, setStudentSearchQuery] = useState('');
  const [branchFilter, setBranchFilter] = useState('ALL');
  const [placementStatusFilter, setPlacementStatusFilter] = useState('ALL');

  useEffect(() => {
    const update = () => {
      setInstitutions(portalRepository.getInstitutions());
      setActiveInstitution(portalRepository.getActiveInstitution());
    };
    update();
    const unsub = portalRepository.subscribe(update);
    return unsub;
  }, []);

  const institution = activeInstitution;
  const opportunities = portalRepository.getOpportunities();
  const sub = institution.subscription;
  const modules = sub?.modules;

  const allManagedStudents = portalRepository.getManagedStudents();
  // Filter for students associated with this institution
  const campusStudents = allManagedStudents.filter(
    s => s.institutionId === institution.id || s.institutionName === institution.name || s.institutionName.toLowerCase().includes(institution.code.toLowerCase())
  );

  const filteredCampusStudents = (campusStudents.length > 0 ? campusStudents : allManagedStudents).filter(std => {
    if (branchFilter !== 'ALL' && std.branch !== branchFilter) return false;
    if (placementStatusFilter !== 'ALL' && std.internshipStatus !== placementStatusFilter) return false;
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

  const handleSelectInstitute = (id: string) => {
    portalRepository.setActiveInstitutionId(id);
    setActiveInstitution(portalRepository.getActiveInstitution());
  };

  // Aggregate industry skill demand from opportunities
  const skillCountMap = new Map<string, number>();
  opportunities.forEach(o => {
    o.requiredSkills.forEach(s => {
      skillCountMap.set(s, (skillCountMap.get(s) || 0) + 1);
    });
  });

  const skillDemandData = Array.from(skillCountMap.entries())
    .map(([skill, count]) => ({
      name: skill,
      demandCount: count
    }))
    .sort((a, b) => b.demandCount - a.demandCount)
    .slice(0, 6);

  const departmentReadinessData = [
    { department: 'Computer Science', readiness: 91, students: 480, targetGap: 'Docker & Microservices' },
    { department: 'Data Science & AI', readiness: 86, students: 240, targetGap: 'PyTorch Production Pipelines' },
    { department: 'Information Tech', readiness: 84, students: 360, targetGap: 'Cloud Architecture & IAM' },
    { department: 'Electronics & Comm', readiness: 78, students: 420, targetGap: 'Embedded C++ & RTOS' },
    { department: 'Mechanical Eng', readiness: 72, students: 310, targetGap: 'Industrial IoT Telemetry' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold text-xl shadow-xs shrink-0">
            <School className="w-7 h-7 text-slate-200" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              {/* If multiple institutes, allow quick selection */}
              {institutions.length > 1 ? (
                <div className="relative inline-block">
                  <select
                    value={institution.id}
                    onChange={e => handleSelectInstitute(e.target.value)}
                    className="text-lg font-bold text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl px-3 py-1 pr-8 focus:outline-none cursor-pointer appearance-none"
                  >
                    {institutions.map(inst => (
                      <option key={inst.id} value={inst.id}>
                        {inst.name} ({inst.code})
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              ) : (
                <h2 className="text-xl font-bold text-slate-900">{institution.name}</h2>
              )}

              <span className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider bg-slate-900 text-white rounded-md">
                {sub?.planTier || 'STANDARD'} SUITE
              </span>
              <span className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider bg-slate-100 text-slate-800 rounded-md border border-slate-200 font-mono">
                NAAC {institution.naacGrade} &bull; NIRF #{institution.nirfRank || 'N/A'}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Campus Institution Analytics &bull; Placement Readiness & Skill Gap Oversight &bull; {institution.location}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 flex-wrap">
          <div className="p-3 bg-slate-50 text-slate-800 rounded-xl text-center min-w-28 border border-slate-200">
            <div className="text-[10px] text-slate-500 font-medium">Placement Rate</div>
            <div className="text-lg font-black text-slate-900">{institution.placedPercentage}%</div>
          </div>
          <div className="p-3 bg-slate-50 text-slate-800 rounded-xl text-center min-w-28 border border-slate-200">
            <div className="text-[10px] text-slate-500 font-medium">Licensed Seats</div>
            <div className="text-lg font-black text-slate-900">
              {sub?.totalStudentSeats ? sub.totalStudentSeats.toLocaleString('en-IN') : institution.totalStudents.toLocaleString('en-IN')}
            </div>
          </div>

          {onOpenMasterAdmin && (
            <button
              onClick={onOpenMasterAdmin}
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
              title="Open HQ Master Admin to adjust service tier or add campuses"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Master Admin</span>
            </button>
          )}
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('analytics')}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'analytics'
              ? 'border-slate-900 text-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Campus Analytics & Readiness</span>
        </button>

        <button
          onClick={() => setActiveTab('students')}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'students'
              ? 'border-slate-900 text-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Students & Placement Directory ({filteredCampusStudents.length})</span>
        </button>
      </div>

      {/* 1. CAMPUS ANALYTICS TAB */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {/* Service Subscription Status Banner */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-semibold text-slate-900">Active Service Agreement:</span>
              <span className="text-slate-600">
                {sub?.planTier || 'STANDARD'} Package &bull; Valid through {sub?.renewalDate || '2026-12-31'} &bull; Managed by {sub?.accountManagerName || 'Skill Safar HQ'}
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-500">
              <span className="font-mono bg-white px-2 py-0.5 rounded border border-slate-200">
                Invoice: {sub?.lastInvoiceNumber || 'INV-2026-089'}
              </span>
            </div>
          </div>

          {/* Analytics Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Department Readiness Chart */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Department Placement Readiness Index</h3>
                  <p className="text-xs text-slate-500">Benchmark score derived from verified student assessments</p>
                </div>
                <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2 py-1 rounded-md">
                  Avg 82.2%
                </span>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={departmentReadinessData} layout="vertical" margin={{ left: 10, right: 30, top: 10, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                    <XAxis type="number" domain={[0, 100]} unit="%" tick={{ fontSize: 11 }} />
                    <YAxis dataKey="department" type="category" width={130} tick={{ fontSize: 11 }} />
                    <Tooltip
                      formatter={(val: number) => [`${val}% Readiness`, 'Readiness']}
                      contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                    />
                    <Bar dataKey="readiness" radius={[0, 4, 4, 0]}>
                      {departmentReadinessData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.readiness >= 85 ? '#059669' : '#0284c7'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
                <div className="text-xs font-bold text-slate-700">Target Curriculum Gaps by Department:</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {departmentReadinessData.map(d => (
                    <div key={d.department} className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="font-semibold text-slate-800">{d.department}</div>
                      <div className="text-[11px] text-rose-600 mt-0.5">Gap: {d.targetGap}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Industry Demand Chart */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Highest In-Demand Industry Skills</h3>
                    <p className="text-xs text-slate-500">Live aggregated demand across active corporate postings</p>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200">
                    Live Feed
                  </span>
                </div>

                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={skillDemandData} margin={{ left: 10, right: 10, top: 10, bottom: 25 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="name" angle={-25} textAnchor="end" tick={{ fontSize: 10 }} interval={0} />
                      <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                      <Tooltip
                        formatter={(val: number) => [`${val} Active Postings`, 'Corporate Demand']}
                        contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                      />
                      <Bar dataKey="demandCount" fill="#0f172a" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-500">
                Data refreshed every 24 hours based on corporate partner requirements and verified placement trends.
              </div>
            </div>
          </div>

          {/* Curriculum Update Recommendations */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              Curriculum Modernization & Industry Alignment Suggestions
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Actionable recommendations for academic boards to update semester electives and faculty development.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-900">Cloud & DevOps Labs</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200">
                    High Priority
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Introduce hands-on containerization (Docker) and Kubernetes orchestration in 5th semester Distributed Systems laboratory.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-900">REST API Security Protocols</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200">
                    Moderate Priority
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Incorporate OAuth2 bearer authentication and API rate limiting into Web Architecture curriculum to match FinTech industry requirements.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-900">Faculty Industry Immersion</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Ongoing
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Encourage 4 faculty members to apply for CloudScale Technologies 6-week summer faculty immersion grant program.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. STUDENTS & PLACEMENT DIRECTORY TAB */}
      {activeTab === 'students' && (
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search campus students by name, USN, email, or branch..."
                value={studentSearchQuery}
                onChange={e => setStudentSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto flex-wrap">
              <select
                value={branchFilter}
                onChange={e => setBranchFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700"
              >
                <option value="ALL">All Departments</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Data Science & AI">Data Science & AI</option>
                <option value="Electronics & Communication">Electronics & Communication</option>
                <option value="Robotics & Automation">Robotics & Automation</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Mechanical & Mechatronics">Mechanical & Mechatronics</option>
              </select>

              <select
                value={placementStatusFilter}
                onChange={e => setPlacementStatusFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700"
              >
                <option value="ALL">All Placement Statuses</option>
                <option value="Placed">Placed</option>
                <option value="Interviewing">Interviewing</option>
                <option value="Seeking">Actively Seeking</option>
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
                    <th className="p-4">Department</th>
                    <th className="p-4">Academic CGPA</th>
                    <th className="p-4">Verified Skill Index</th>
                    <th className="p-4">Placement Status</th>
                    <th className="p-4 text-right">Student Profile</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredCampusStudents.map(std => (
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
                            {std.verifiedSkillScore >= 85 ? 'Top Tier' : std.verifiedSkillScore >= 75 ? 'Industry Ready' : 'Training'}
                          </span>
                        </div>
                        <div className="w-28 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-emerald-600 h-full rounded-full"
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
                          title="Watch student verified skills, portfolio, and update placement status"
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

            {filteredCampusStudents.length === 0 && (
              <div className="p-8 text-center text-slate-400 text-xs">
                No students found matching the selected filters.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal: Watch Student Profile (with Campus Admin Context) */}
      <StudentProfileModal
        isOpen={!!selectedStudentForProfile}
        onClose={() => setSelectedStudentForProfile(null)}
        studentId={selectedStudentForProfile || undefined}
        viewerRole="INSTITUTION_ADMIN"
      />
    </div>
  );
};
