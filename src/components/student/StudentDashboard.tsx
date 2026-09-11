import React, { useState } from 'react';
import { StudentProfile, Opportunity, MatchExplanation } from '../../types';
import { EmployabilityLoopProgress } from './EmployabilityLoopProgress';
import { StudentSkillAnalyticsCharts } from './StudentSkillAnalyticsCharts';
import { OpportunityService, MatchingService, StudentService, ApplicationService } from '../../services/portalServices';
import { MatchScoreBadge } from '../common/MatchScoreBadge';
import { ExplainableMatchModal } from '../common/ExplainableMatchModal';
import { SkillPassportModal } from '../common/SkillPassportModal';
import { SoundFX } from '../../lib/soundEffects';
import confetti from 'canvas-confetti';
import {
  Award,
  Briefcase,
  BookOpen,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Building2,
  Calendar,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  PartyPopper
} from 'lucide-react';

interface StudentDashboardProps {
  student: StudentProfile;
  onNavigateTab: (tab: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  student,
  onNavigateTab
}) => {
  const [selectedOppForExplain, setSelectedOppForExplain] = useState<{
    opp: Opportunity;
    explanation: MatchExplanation;
  } | null>(null);
  const [isPassportOpen, setIsPassportOpen] = useState(false);

  const opportunities = OpportunityService.getPublished();
  const matches = MatchingService.getMatchesForStudent(student);
  const gaps = StudentService.getSkillGaps(student);
  const applications = ApplicationService.getForStudent(student.id);

  const topMatches = matches.slice(0, 3);
  const averageScore = Math.round(student.skills.reduce((acc, s) => acc + s.score, 0) / (student.skills.length || 1));
  const readinessIndex = Math.min(100, Math.round(averageScore * 0.7 + (student.projects.length * 10) + (student.certifications.length * 5)));

  return (
    <div className="space-y-6">
      {/* Employability Loop Visualizer */}
      <EmployabilityLoopProgress
        currentStage={student.employabilityStage}
        onNavigateStage={onNavigateTab}
      />

      {/* Hero Welcome Card */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xs relative overflow-hidden border border-slate-800">
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
            <Sparkles className="w-3.5 h-3.5 text-slate-300" />
            Verified Employability Workspace
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-white">
            Welcome back, {student.fullName}
          </h1>
          <p className="text-sm text-slate-300 mt-2 font-light leading-relaxed">
            {student.headline} at {student.institutionName}. Your profile has <strong className="font-semibold text-white">{student.skills.length} verified competencies</strong> benchmarked against live industry opportunities.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-6">
            <button
              onClick={() => {
                SoundFX.click();
                setIsPassportOpen(true);
              }}
              className="px-4 py-2.5 bg-emerald-400 hover:bg-emerald-300 text-slate-950 text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-slate-950" />
              <span>Verifiable Skill Passport</span>
            </button>
            <button
              onClick={() => {
                SoundFX.click();
                onNavigateTab('assessments');
              }}
              className="px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-900 text-xs font-semibold rounded-xl shadow-xs transition-all flex items-center gap-2"
            >
              <Award className="w-4 h-4 text-slate-900" />
              <span>Verify New Skill</span>
            </button>
            <button
              onClick={() => {
                SoundFX.click();
                onNavigateTab('opportunities');
              }}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-xl border border-slate-700 transition-all flex items-center gap-2"
            >
              <Briefcase className="w-4 h-4 text-slate-300" />
              <span>Discover Opportunities ({matches.length})</span>
            </button>
            <button
              onClick={() => {
                SoundFX.success();
                confetti({ particleCount: 60, spread: 50, origin: { y: 0.6 } });
              }}
              className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl border border-slate-700 transition-colors"
              title="Celebrate readiness!"
            >
              <PartyPopper className="w-4 h-4 text-amber-300" />
            </button>
          </div>
        </div>

        {/* Subtle background accent */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-slate-700/20 to-transparent pointer-events-none" />
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs">
          <div className="text-xs font-medium text-slate-500">Placement Readiness</div>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-display font-bold text-slate-900">{readinessIndex}%</span>
            <span className="text-xs font-medium text-emerald-600 flex items-center gap-0.5">
              <TrendingUp className="w-3.5 h-3.5" /> High
            </span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-3">
            <div className="bg-slate-900 h-full rounded-full" style={{ width: `${readinessIndex}%` }} />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs">
          <div className="text-xs font-medium text-slate-500">Verified Competencies</div>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-display font-bold text-slate-900">{student.skills.length}</span>
            <span className="text-xs text-slate-400">Avg {averageScore}%</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-3 font-light">Tested via assessments &amp; projects</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs">
          <div className="text-xs font-medium text-slate-500">High Match Openings</div>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-display font-bold text-slate-900">
              {matches.filter(m => m.explanation.overallScore >= 80).length}
            </span>
            <span className="text-xs font-medium text-slate-600">&ge;80% Compatibility</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-3 font-light">Ready for direct application</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs">
          <div className="text-xs font-medium text-slate-500">Active Applications</div>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-display font-bold text-slate-900">{applications.length}</span>
            <span className="text-xs font-medium text-slate-600">
              {applications.filter(a => a.status === 'SHORTLISTED' || a.status === 'INTERVIEW').length} In Pipeline
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-3 font-light">Recruiter pipeline tracking</p>
        </div>
      </div>

      {/* Interactive Skill Analytics & Assessment Performance Charts */}
      <StudentSkillAnalyticsCharts
        student={student}
        onNavigateTab={onNavigateTab}
      />

      {/* Main Two Columns: Top Matches + Gaps & Applications */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Matches (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Recommended Opportunity Matches</h3>
              <p className="text-xs text-slate-500">Ranked by deterministic compatibility formula</p>
            </div>
            <button
              onClick={() => onNavigateTab('opportunities')}
              className="text-xs font-bold text-slate-900 hover:text-black flex items-center gap-1"
            >
              <span>View All ({matches.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {topMatches.map(({ opportunity, explanation }) => (
              <div
                key={opportunity.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-slate-400 hover:shadow-sm transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                        {opportunity.opportunityType}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                        {opportunity.domain}
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-slate-900 leading-snug">
                      {opportunity.title}
                    </h4>
                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                      <span className="font-semibold text-slate-700 flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        {opportunity.companyName}
                      </span>
                      <span>{opportunity.location}</span>
                      <span className="text-emerald-700 font-semibold">{opportunity.stipendOrSalary}</span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <MatchScoreBadge
                      score={explanation.overallScore}
                      size="md"
                      onClick={() => setSelectedOppForExplain({ opp: opportunity, explanation })}
                    />
                  </div>
                </div>

                {/* Matched skills pill */}
                <div className="flex flex-wrap items-center justify-between gap-2 mt-4 pt-3 border-t border-slate-100 text-xs">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-slate-400 text-[11px]">Matching skills:</span>
                    {explanation.matchedSkills.map(s => (
                      <span key={s} className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium text-[11px] flex items-center gap-1">
                        <CheckCircle2 className="w-2.5 h-2.5" />
                        {s}
                      </span>
                    ))}
                    {explanation.missingRequiredSkills.slice(0, 1).map(s => (
                      <span key={s} className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200 font-medium text-[11px] flex items-center gap-1">
                        <AlertTriangle className="w-2.5 h-2.5" />
                        Missing: {s}
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={() => setSelectedOppForExplain({ opp: opportunity, explanation })}
                    className="text-xs font-bold text-slate-900 hover:text-black"
                  >
                    Details &rarr;
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Skill Gaps & Active Applications */}
        <div className="space-y-6">
          {/* Skill Gaps Card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <h3 className="text-sm font-bold text-slate-900">Priority Skill Gaps</h3>
              </div>
              <button
                onClick={() => onNavigateTab('skills')}
                className="text-xs font-semibold text-slate-900 hover:text-black"
              >
                View ({gaps.length})
              </button>
            </div>
            <p className="text-xs text-slate-500">
              Competencies required in target internships that need score verification.
            </p>

            <div className="space-y-2 pt-1">
              {gaps.slice(0, 3).map(gap => (
                <div
                  key={gap.skillName}
                  className="p-3 bg-amber-50/50 rounded-xl border border-amber-200/60 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-slate-800 block">{gap.skillName}</span>
                    <span className="text-[10px] text-slate-500">Current: {gap.currentScore}% • {gap.demandCount} Openings</span>
                  </div>
                  <button
                    onClick={() => onNavigateTab('learning')}
                    className="px-2.5 py-1 bg-white border border-amber-300 text-amber-800 rounded-lg text-[11px] font-bold hover:bg-amber-100 transition-colors"
                  >
                    Learn
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Applications Card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-slate-700" />
                <h3 className="text-sm font-bold text-slate-900">Recruitment Pipeline</h3>
              </div>
              <button
                onClick={() => onNavigateTab('applications')}
                className="text-xs font-semibold text-slate-900 hover:text-black"
              >
                Track
              </button>
            </div>

            {applications.length === 0 ? (
              <p className="text-xs text-slate-400 py-2">No active applications yet.</p>
            ) : (
              <div className="space-y-2 pt-1">
                {applications.slice(0, 2).map(app => (
                  <div
                    key={app.id}
                    onClick={() => onNavigateTab('applications')}
                    className="p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold text-slate-900 truncate">{app.opportunityTitle}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-900 text-white">
                        {app.status.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center justify-between">
                      <span>{app.companyName}</span>
                      <span className="font-semibold text-slate-900">{app.matchScore}% Match</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal: Full Factor Explanation */}
      {selectedOppForExplain && (
        <ExplainableMatchModal
          isOpen={Boolean(selectedOppForExplain)}
          onClose={() => setSelectedOppForExplain(null)}
          opportunity={selectedOppForExplain.opp}
          explanation={selectedOppForExplain.explanation}
          alreadyApplied={applications.some(a => a.opportunityId === selectedOppForExplain.opp.id)}
          onApply={() => {
            onNavigateTab('opportunities');
            setSelectedOppForExplain(null);
          }}
        />
      )}

      {/* Verifiable Skill Passport Modal */}
      <SkillPassportModal
        isOpen={isPassportOpen}
        onClose={() => setIsPassportOpen(false)}
        student={student}
      />
    </div>
  );
};
