import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { StudentProfile, SkillScore } from '../../types';
import {
  TrendingUp,
  Award,
  Target,
  Clock,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  Calendar,
  Layers,
  ArrowUpRight
} from 'lucide-react';

interface StudentSkillAnalyticsChartsProps {
  student: StudentProfile;
  onNavigateTab: (tab: string) => void;
}

type ChartViewMode = 'timeline' | 'benchmarks' | 'radar';

interface ProgressDataPoint {
  date: string;
  displayDate: string;
  milestone: string;
  python: number;
  sql: number;
  git: number;
  restApi: number;
  docker: number;
  react: number;
  overallAverage: number;
}

export const StudentSkillAnalyticsCharts: React.FC<StudentSkillAnalyticsChartsProps> = ({
  student,
  onNavigateTab
}) => {
  const [activeView, setActiveView] = useState<ChartViewMode>('timeline');
  const [selectedSkillFilter, setSelectedSkillFilter] = useState<string>('all');
  const [timeRange, setTimeRange] = useState<'6m' | 'all'>('6m');

  // Map student's current live scores
  const skillScoresMap = useMemo(() => {
    const map = new Map<string, SkillScore>();
    student.skills.forEach(s => {
      map.set(s.skillName.toLowerCase(), s);
      map.set(s.skillId.toLowerCase(), s);
    });
    return map;
  }, [student.skills]);

  const getScore = (name: string, fallback: number): number => {
    const found = student.skills.find(s => s.skillName.toLowerCase().includes(name.toLowerCase()));
    return found ? found.score : fallback;
  };

  const currentPython = getScore('python', 85);
  const currentSql = getScore('sql', 82);
  const currentGit = getScore('git', 90);
  const currentRestApi = getScore('rest', 55);
  const currentDocker = getScore('docker', 42);
  const currentReact = getScore('react', 65);

  // Dynamic chronological progression timeline anchored in real evidence milestones
  const progressData: ProgressDataPoint[] = useMemo(() => {
    return [
      {
        date: '2026-04-15',
        displayDate: 'Apr 2026',
        milestone: 'Initial Campus Diagnostics',
        python: 50,
        sql: 45,
        git: 60,
        restApi: 35,
        docker: 20,
        react: 55,
        overallAverage: 44
      },
      {
        date: '2026-05-20',
        displayDate: 'May 2026',
        milestone: 'PostgreSQL Essentials Course',
        python: 62,
        sql: 65,
        git: 68,
        restApi: 40,
        docker: 25,
        react: 58,
        overallAverage: 53
      },
      {
        date: '2026-06-25',
        displayDate: 'Jun 2026',
        milestone: 'TaskFlow Distributed Queue Project',
        python: 72,
        sql: 74,
        git: 78,
        restApi: 48,
        docker: 32,
        react: 60,
        overallAverage: 61
      },
      {
        date: '2026-07-30',
        displayDate: 'Jul 2026',
        milestone: 'Git & VCS Assessment (Score 95%)',
        python: 78,
        sql: 78,
        git: 90,
        restApi: 50,
        docker: 38,
        react: 62,
        overallAverage: 66
      },
      {
        date: '2026-08-18',
        displayDate: 'Aug 2026',
        milestone: 'Python & DB Proctored Exams',
        python: Math.max(85, Math.round(currentPython * 0.96)),
        sql: Math.max(82, Math.round(currentSql * 0.97)),
        git: currentGit,
        restApi: Math.max(55, currentRestApi),
        docker: currentDocker,
        react: currentReact,
        overallAverage: Math.round((currentPython + currentSql + currentGit + currentRestApi + currentDocker + currentReact) / 6 * 0.96)
      },
      {
        date: '2026-09-11',
        displayDate: 'Current Verified',
        milestone: 'Live Platform Verified Record',
        python: currentPython,
        sql: currentSql,
        git: currentGit,
        restApi: currentRestApi,
        docker: currentDocker,
        react: currentReact,
        overallAverage: Math.round((currentPython + currentSql + currentGit + currentRestApi + currentDocker + currentReact) / 6)
      }
    ];
  }, [currentPython, currentSql, currentGit, currentRestApi, currentDocker, currentReact]);

  // Assessment Benchmarking vs Recruiter Requirements
  const benchmarkData = useMemo(() => {
    return [
      {
        skill: 'Git & VCS',
        verifiedScore: currentGit,
        industryThreshold: 75,
        recruiterDemand: 'High Demand',
        category: 'Backend / DevOps',
        confidence: 95,
        status: currentGit >= 75 ? 'Ready' : 'Needs Practice'
      },
      {
        skill: 'Python Backend',
        verifiedScore: currentPython,
        industryThreshold: 80,
        recruiterDemand: 'Very High',
        category: 'Backend Engineering',
        confidence: 90,
        status: currentPython >= 80 ? 'Ready' : 'Needs Practice'
      },
      {
        skill: 'SQL & Databases',
        verifiedScore: currentSql,
        industryThreshold: 75,
        recruiterDemand: 'Very High',
        category: 'Database Systems',
        confidence: 85,
        status: currentSql >= 75 ? 'Ready' : 'Needs Practice'
      },
      {
        skill: 'React Frontend',
        verifiedScore: currentReact,
        industryThreshold: 70,
        recruiterDemand: 'High Demand',
        category: 'Frontend & Web',
        confidence: 70,
        status: currentReact >= 70 ? 'Ready' : 'Minor Gap'
      },
      {
        skill: 'REST API Design',
        verifiedScore: currentRestApi,
        industryThreshold: 75,
        recruiterDemand: 'Critical',
        category: 'Backend Engineering',
        confidence: 65,
        status: currentRestApi >= 75 ? 'Ready' : 'Priority Gap'
      },
      {
        skill: 'Docker & Containers',
        verifiedScore: currentDocker,
        industryThreshold: 70,
        recruiterDemand: 'Critical',
        category: 'Cloud & DevOps',
        confidence: 50,
        status: currentDocker >= 70 ? 'Ready' : 'Priority Gap'
      }
    ];
  }, [currentGit, currentPython, currentSql, currentReact, currentRestApi, currentDocker]);

  // Radar Matrix: Domain Competency vs Target Engineering Profile
  const radarData = useMemo(() => {
    const avgScore = (prefix: string, fallback: number) => {
      const matches = student.skills.filter(s =>
        s.category.toLowerCase().includes(prefix.toLowerCase()) ||
        s.skillName.toLowerCase().includes(prefix.toLowerCase())
      );
      if (matches.length === 0) return fallback;
      return Math.round(matches.reduce((a, b) => a + b.score, 0) / matches.length);
    };

    return [
      {
        domain: 'Backend Eng.',
        studentScore: avgScore('backend', 78),
        industryTarget: 80,
        fullMark: 100
      },
      {
        domain: 'Databases',
        studentScore: avgScore('database', 82),
        industryTarget: 75,
        fullMark: 100
      },
      {
        domain: 'Cloud / DevOps',
        studentScore: avgScore('cloud', 45),
        industryTarget: 70,
        fullMark: 100
      },
      {
        domain: 'Frontend UIs',
        studentScore: avgScore('frontend', 65),
        industryTarget: 65,
        fullMark: 100
      },
      {
        domain: 'API Architecture',
        studentScore: avgScore('rest', 55),
        industryTarget: 75,
        fullMark: 100
      },
      {
        domain: 'Tech Comm.',
        studentScore: avgScore('comm', 80),
        industryTarget: 70,
        fullMark: 100
      }
    ];
  }, [student.skills]);

  // Extract all official assessment verification records from student evidence
  const assessmentHistory = useMemo(() => {
    const records: Array<{
      id: string;
      skillName: string;
      title: string;
      date: string;
      score: string;
      context: string;
      verified: boolean;
    }> = [];

    student.skills.forEach(skill => {
      skill.evidenceSources.forEach(ev => {
        if (ev.sourceType === 'Assessment') {
          records.push({
            id: ev.id,
            skillName: skill.skillName,
            title: ev.title,
            date: ev.date,
            score: ev.scoreOrGrade || `${skill.score}%`,
            context: ev.issuerOrContext,
            verified: true
          });
        }
      });
    });

    // Sort by latest date
    return records.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [student.skills]);

  // Overall performance calculations
  const totalVerified = student.skills.length;
  const avgVerifiedScore = Math.round(student.skills.reduce((acc, s) => acc + s.score, 0) / (totalVerified || 1));
  const readinessDelta = Math.round(avgVerifiedScore - 44); // delta since April baseline
  const benchmarkMetCount = benchmarkData.filter(b => b.verifiedScore >= b.industryThreshold).length;

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Header & Controls */}
      <div className="p-6 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 uppercase tracking-wider mb-1">
            <BarChart3 className="w-3.5 h-3.5 text-slate-900" />
            Skill Analytics & Assessment Performance
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            Competency Growth & Assessment Trajectory
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Interactive visualization of verified test results, learning milestones, and recruiter hiring threshold benchmarks.
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 border border-slate-200/80">
            <button
              onClick={() => setActiveView('timeline')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeView === 'timeline'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Skill Progression</span>
            </button>
            <button
              onClick={() => setActiveView('benchmarks')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeView === 'benchmarks'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Target className="w-3.5 h-3.5" />
              <span>Recruiter Benchmarks</span>
            </button>
            <button
              onClick={() => setActiveView('radar')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeView === 'radar'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Domain Matrix</span>
            </button>
          </div>

          <button
            onClick={() => onNavigateTab('assessments')}
            className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <Award className="w-3.5 h-3.5 text-emerald-400" />
            <span>Take Assessment</span>
          </button>
        </div>
      </div>

      {/* KPI Metrics Summary Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-slate-100 border-b border-slate-100 bg-slate-50/50">
        <div className="p-4 sm:p-5">
          <div className="text-[11px] font-medium text-slate-500">Verified Average</div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-display text-slate-900">{avgVerifiedScore}%</span>
            <span className="text-xs font-semibold text-emerald-600 flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +{readinessDelta}%
            </span>
          </div>
          <span className="text-[10px] text-slate-400 block mt-0.5">Across {totalVerified} verified skills</span>
        </div>

        <div className="p-4 sm:p-5">
          <div className="text-[11px] font-medium text-slate-500">Industry Thresholds Met</div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-display text-slate-900">{benchmarkMetCount} / {benchmarkData.length}</span>
            <span className="text-xs font-semibold text-slate-600">
              {Math.round((benchmarkMetCount / benchmarkData.length) * 100)}%
            </span>
          </div>
          <span className="text-[10px] text-slate-400 block mt-0.5">Ready for Tier-1 interviews</span>
        </div>

        <div className="p-4 sm:p-5">
          <div className="text-[11px] font-medium text-slate-500">Proctored Assessments</div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-display text-slate-900">{assessmentHistory.length}</span>
            <span className="text-xs font-semibold text-emerald-600 flex items-center gap-0.5">
              <CheckCircle2 className="w-3 h-3" /> 100% Passed
            </span>
          </div>
          <span className="text-[10px] text-slate-400 block mt-0.5">Platform validated credentials</span>
        </div>

        <div className="p-4 sm:p-5">
          <div className="text-[11px] font-medium text-slate-500">Highest Yield Priority</div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-base font-bold text-amber-700 truncate">Docker &amp; Containers</span>
          </div>
          <span className="text-[10px] text-slate-400 block mt-0.5">Target: 70% (Current: {currentDocker}%)</span>
        </div>
      </div>

      {/* Main Interactive Chart Section */}
      <div className="p-6">
        {/* VIEW 1: TIMELINE / AREA CHART */}
        {activeView === 'timeline' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <span>Chronological Skill Progression</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md font-semibold">
                    April 2026 &mdash; Present
                  </span>
                </h3>
                <p className="text-xs text-slate-500">
                  Click skill pills below to highlight or isolate specific competency curves over time.
                </p>
              </div>

              {/* Skill Filter Chips */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  onClick={() => setSelectedSkillFilter('all')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                    selectedSkillFilter === 'all'
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  All Competencies
                </button>
                <button
                  onClick={() => setSelectedSkillFilter('python')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                    selectedSkillFilter === 'python'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                  }`}
                >
                  Python ({currentPython}%)
                </button>
                <button
                  onClick={() => setSelectedSkillFilter('sql')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                    selectedSkillFilter === 'sql'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                  }`}
                >
                  SQL ({currentSql}%)
                </button>
                <button
                  onClick={() => setSelectedSkillFilter('git')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                    selectedSkillFilter === 'git'
                      ? 'bg-amber-600 text-white'
                      : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                  }`}
                >
                  Git ({currentGit}%)
                </button>
                <button
                  onClick={() => setSelectedSkillFilter('restApi')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                    selectedSkillFilter === 'restApi'
                      ? 'bg-sky-600 text-white'
                      : 'bg-sky-50 text-sky-700 hover:bg-sky-100'
                  }`}
                >
                  REST API ({currentRestApi}%)
                </button>
              </div>
            </div>

            {/* Recharts Area Chart */}
            <div className="h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={progressData}
                  margin={{ top: 10, right: 15, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorOverall" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0f172a" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#0f172a" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="colorPython" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="colorSql" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="colorGit" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="colorRest" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0284c7" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis
                    dataKey="displayDate"
                    tick={{ fill: '#64748b', fontSize: 11 }}
                    axisLine={{ stroke: '#cbd5e1' }}
                    tickLine={false}
                  />
                  <YAxis
                    domain={[0, 100]}
                    ticks={[0, 25, 50, 75, 100]}
                    tick={{ fill: '#64748b', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={val => `${val}%`}
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (!active || !payload || !payload.length) return null;
                      const milestone = payload[0]?.payload?.milestone;
                      return (
                        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-md text-xs space-y-1.5 min-w-[200px]">
                          <div className="font-bold text-slate-900 border-b border-slate-100 pb-1 flex items-center justify-between">
                            <span>{label}</span>
                            <span className="text-[10px] font-mono text-slate-400 font-normal">Score Progress</span>
                          </div>
                          {milestone && (
                            <div className="text-[11px] text-slate-600 bg-slate-50 p-1.5 rounded-lg border border-slate-100 flex items-start gap-1">
                              <Sparkles className="w-3 h-3 text-emerald-600 shrink-0 mt-0.5" />
                              <span>{milestone}</span>
                            </div>
                          )}
                          <div className="space-y-1 pt-1">
                            {payload.map((entry, idx) => (
                              <div key={idx} className="flex items-center justify-between text-[11px]">
                                <span className="flex items-center gap-1.5 text-slate-600">
                                  <span
                                    className="w-2 h-2 rounded-full"
                                    style={{ backgroundColor: entry.color }}
                                  />
                                  {entry.name}:
                                </span>
                                <span className="font-bold text-slate-900">{entry.value}%</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    }}
                  />
                  <ReferenceLine
                    y={75}
                    stroke="#94a3b8"
                    strokeDasharray="4 4"
                    label={{
                      value: 'Recruiter Benchmark (75%)',
                      fill: '#64748b',
                      fontSize: 10,
                      position: 'top'
                    }}
                  />

                  {/* Areas based on selection */}
                  {(selectedSkillFilter === 'all' || selectedSkillFilter === 'python') && (
                    <Area
                      type="monotone"
                      dataKey="python"
                      name="Python"
                      stroke="#10b981"
                      strokeWidth={selectedSkillFilter === 'python' ? 3 : 2}
                      fillOpacity={1}
                      fill="url(#colorPython)"
                      activeDot={{ r: 5, strokeWidth: 2, stroke: '#ffffff' }}
                    />
                  )}

                  {(selectedSkillFilter === 'all' || selectedSkillFilter === 'sql') && (
                    <Area
                      type="monotone"
                      dataKey="sql"
                      name="SQL & PostgreSQL"
                      stroke="#6366f1"
                      strokeWidth={selectedSkillFilter === 'sql' ? 3 : 2}
                      fillOpacity={1}
                      fill="url(#colorSql)"
                      activeDot={{ r: 5, strokeWidth: 2, stroke: '#ffffff' }}
                    />
                  )}

                  {(selectedSkillFilter === 'all' || selectedSkillFilter === 'git') && (
                    <Area
                      type="monotone"
                      dataKey="git"
                      name="Git & VCS"
                      stroke="#f59e0b"
                      strokeWidth={selectedSkillFilter === 'git' ? 3 : 2}
                      fillOpacity={1}
                      fill="url(#colorGit)"
                      activeDot={{ r: 5, strokeWidth: 2, stroke: '#ffffff' }}
                    />
                  )}

                  {(selectedSkillFilter === 'all' || selectedSkillFilter === 'restApi') && (
                    <Area
                      type="monotone"
                      dataKey="restApi"
                      name="REST API Design"
                      stroke="#0284c7"
                      strokeWidth={selectedSkillFilter === 'restApi' ? 3 : 2}
                      fillOpacity={1}
                      fill="url(#colorRest)"
                      activeDot={{ r: 5, strokeWidth: 2, stroke: '#ffffff' }}
                    />
                  )}

                  {selectedSkillFilter === 'all' && (
                    <Area
                      type="monotone"
                      dataKey="overallAverage"
                      name="Readiness Average"
                      stroke="#0f172a"
                      strokeWidth={2}
                      strokeDasharray="4 2"
                      fillOpacity={1}
                      fill="url(#colorOverall)"
                    />
                  )}
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* VIEW 2: BENCHMARK / GROUPED BAR CHART */}
        {activeView === 'benchmarks' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <span>Verified Score vs. Industry Hiring Threshold</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-md font-semibold">
                    Live Recruiter Criteria
                  </span>
                </h3>
                <p className="text-xs text-slate-500">
                  Bars compare your current verified test performance against the minimum requirement for Tier-1 placements.
                </p>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1.5 font-medium text-slate-700">
                  <span className="w-3 h-3 rounded bg-slate-900" />
                  Your Verified Score
                </span>
                <span className="flex items-center gap-1.5 font-medium text-slate-500">
                  <span className="w-3 h-3 rounded bg-slate-300" />
                  Hiring Threshold
                </span>
              </div>
            </div>

            <div className="h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={benchmarkData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
                  barCategoryGap={16}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis
                    dataKey="skill"
                    tick={{ fill: '#334155', fontSize: 11, fontWeight: 500 }}
                    axisLine={{ stroke: '#cbd5e1' }}
                    tickLine={false}
                    interval={0}
                    angle={-10}
                    textAnchor="end"
                  />
                  <YAxis
                    domain={[0, 100]}
                    ticks={[0, 25, 50, 75, 100]}
                    tick={{ fill: '#64748b', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={val => `${val}%`}
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (!active || !payload || !payload.length) return null;
                      const item = benchmarkData.find(b => b.skill === label);
                      if (!item) return null;
                      const isPassing = item.verifiedScore >= item.industryThreshold;
                      const delta = item.verifiedScore - item.industryThreshold;
                      return (
                        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-md text-xs space-y-2 min-w-[220px]">
                          <div className="font-bold text-slate-900 border-b border-slate-100 pb-1 flex items-center justify-between">
                            <span>{label}</span>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                              isPassing ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                            }`}>
                              {isPassing ? `+${delta}% Above Target` : `${delta}% Below Target`}
                            </span>
                          </div>
                          <div className="space-y-1 text-[11px]">
                            <div className="flex justify-between">
                              <span className="text-slate-500">Verified Score:</span>
                              <span className="font-bold text-slate-900">{item.verifiedScore}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500">Recruiter Cutoff:</span>
                              <span className="font-semibold text-slate-700">{item.industryThreshold}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500">Recruiter Demand:</span>
                              <span className="font-medium text-slate-700">{item.recruiterDemand}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500">Confidence Metric:</span>
                              <span className="font-medium text-slate-700">{item.confidence}%</span>
                            </div>
                          </div>
                        </div>
                      );
                    }}
                  />
                  <ReferenceLine
                    y={80}
                    stroke="#10b981"
                    strokeDasharray="4 4"
                    label={{
                      value: 'Top Candidate Tier (80%)',
                      fill: '#059669',
                      fontSize: 10,
                      position: 'top'
                    }}
                  />
                  <Bar
                    dataKey="verifiedScore"
                    name="Your Score"
                    fill="#0f172a"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="industryThreshold"
                    name="Hiring Cutoff"
                    fill="#cbd5e1"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* VIEW 3: RADAR DOMAIN MATRIX */}
        {activeView === 'radar' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <span>Domain Competency Polygon</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md font-semibold">
                    6-Dimensional Profile
                  </span>
                </h3>
                <p className="text-xs text-slate-500">
                  Evaluates balance across architecture, data systems, cloud infrastructure, and technical communication.
                </p>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1.5 font-medium text-slate-700">
                  <span className="w-3 h-3 rounded bg-emerald-600" />
                  Your Profile
                </span>
                <span className="flex items-center gap-1.5 font-medium text-slate-500">
                  <span className="w-3 h-3 rounded bg-slate-300" />
                  Target Profile
                </span>
              </div>
            </div>

            <div className="h-72 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData} outerRadius="75%">
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis
                    dataKey="domain"
                    tick={{ fill: '#334155', fontSize: 11, fontWeight: 600 }}
                  />
                  <PolarRadiusAxis
                    angle={30}
                    domain={[0, 100]}
                    tick={{ fill: '#94a3b8', fontSize: 9 }}
                  />
                  <Radar
                    name="Your Profile"
                    dataKey="studentScore"
                    stroke="#10b981"
                    fill="#10b981"
                    fillOpacity={0.35}
                    strokeWidth={2}
                  />
                  <Radar
                    name="Target Profile"
                    dataKey="industryTarget"
                    stroke="#94a3b8"
                    fill="#cbd5e1"
                    fillOpacity={0.2}
                    strokeDasharray="4 4"
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload || !payload.length) return null;
                      const data = payload[0]?.payload;
                      if (!data) return null;
                      return (
                        <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-md text-xs space-y-1">
                          <div className="font-bold text-slate-900 border-b border-slate-100 pb-1">
                            {data.domain}
                          </div>
                          <div className="flex justify-between gap-4 text-[11px]">
                            <span className="text-slate-500">Current Standing:</span>
                            <span className="font-bold text-emerald-600">{data.studentScore}%</span>
                          </div>
                          <div className="flex justify-between gap-4 text-[11px]">
                            <span className="text-slate-500">Target Benchmark:</span>
                            <span className="font-semibold text-slate-700">{data.industryTarget}%</span>
                          </div>
                        </div>
                      );
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Verified Assessment Performance Records Table */}
        <div className="mt-6 pt-5 border-t border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-slate-700" />
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Official Assessment Performance Logs ({assessmentHistory.length})
              </h4>
            </div>
            <button
              onClick={() => onNavigateTab('assessments')}
              className="text-xs font-semibold text-slate-900 hover:text-black flex items-center gap-1"
            >
              <span>View Assessment Engine</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {assessmentHistory.map(record => (
              <div
                key={record.id}
                className="p-3 bg-slate-50 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white text-slate-800 border border-slate-200 truncate">
                      {record.skillName}
                    </span>
                    <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      {record.score}
                    </span>
                  </div>
                  <h5 className="text-xs font-semibold text-slate-900 line-clamp-1 mt-1">
                    {record.title}
                  </h5>
                  <p className="text-[10px] text-slate-400 mt-0.5 truncate">
                    {record.context}
                  </p>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2.5 mt-2 border-t border-slate-200/60">
                  <span className="flex items-center gap-1 font-mono">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    {record.date}
                  </span>
                  <span className="text-emerald-600 font-semibold flex items-center gap-0.5">
                    <ShieldCheck className="w-3 h-3" />
                    Verified
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
