import React, { useState } from 'react';
import { StudentProfile } from '../../types';
import { StudentService } from '../../services/portalServices';
import { portalRepository } from '../../repositories/mockRepository';
import {
  Award,
  AlertTriangle,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  TrendingUp,
  FileCheck,
  ShieldCheck
} from 'lucide-react';

interface SkillProfileViewProps {
  student: StudentProfile;
  onNavigateToLearning?: () => void;
  onNavigateToAssessment?: () => void;
}

export const SkillProfileView: React.FC<SkillProfileViewProps> = ({
  student,
  onNavigateToLearning,
  onNavigateToAssessment
}) => {
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');
  const categories = portalRepository.getCategories();
  const gaps = StudentService.getSkillGaps(student);

  const filteredSkills = activeCategoryFilter === 'all'
    ? student.skills
    : student.skills.filter(s => s.category === activeCategoryFilter);

  const getProficiencyColor = (level: string) => {
    switch (level) {
      case 'Expert':
        return 'bg-slate-900 text-white border-slate-900';
      case 'Advanced':
        return 'bg-slate-100 text-slate-900 border-slate-300 font-semibold';
      case 'Intermediate':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Skill Intelligence Summary Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-900 uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4 text-slate-800" />
              Verified Competency Framework
            </div>
            <h2 className="text-xl font-bold text-slate-900">Student Skill Profile & Evidence</h2>
            <p className="text-sm text-slate-500 mt-1 max-w-2xl">
              Deterministic skill ledger supported by verifiable multi-source evidence: formal code reviews, timed technical assessments, and verified certifications.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onNavigateToAssessment}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-all shadow-xs"
            >
              Take Assessment
            </button>
            <button
              onClick={onNavigateToLearning}
              className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl transition-all"
            >
              Browse Learning
            </button>
          </div>
        </div>
      </div>

      {/* Skill Gap Analysis vs Live Market Demand */}
      {gaps.length > 0 && (
        <div className="bg-gradient-to-br from-amber-50/70 via-white to-amber-50/40 rounded-2xl p-6 border border-amber-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-amber-500 text-white rounded-lg">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Targeted Skill Gaps Benchmarked Against Active Recruiter Postings
                </h3>
                <p className="text-xs text-slate-500">
                  Top engineering openings prioritize these skills where your current verified score is below benchmark (&lt;70%).
                </p>
              </div>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-amber-100 text-amber-800 rounded-full">
              {gaps.length} Gaps Detected
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
            {gaps.map(gap => (
              <div
                key={gap.skillName}
                className="p-4 bg-white rounded-xl border border-amber-200/60 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className="text-xs font-bold text-slate-900">{gap.skillName}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                      gap.gapSeverity === 'Critical'
                        ? 'bg-rose-50 text-rose-700 border-rose-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      {gap.gapSeverity} Gap
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 mb-2">
                    Required in {gap.demandCount} active partner listings • Current: {gap.currentScore}%
                  </div>
                  {gap.recommendedLearning && (
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 mb-3 text-[11px] text-slate-600">
                      <span className="font-semibold text-slate-800 block truncate">
                        Recommended: {gap.recommendedLearning.title}
                      </span>
                      <span className="text-[10px] text-emerald-600 font-bold">
                        Expected boost: +{gap.recommendedLearning.scoreBoost}%
                      </span>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={onNavigateToLearning}
                  className="w-full py-1.5 px-3 bg-amber-50 hover:bg-amber-600 hover:text-white text-amber-900 border border-amber-200 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Bridge Gap With Course</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills Inventory */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        {/* Category Filters */}
        <div className="flex items-center justify-between flex-wrap gap-2 pb-4 border-b border-slate-100 mb-6">
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <button
              onClick={() => setActiveCategoryFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeCategoryFilter === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Skills ({student.skills.length})
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategoryFilter(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  activeCategoryFilter === cat.id
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Skills Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredSkills.map(skill => (
            <div
              key={skill.skillId}
              className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-400 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{skill.skillName}</h4>
                    <span className="text-[11px] text-slate-400">
                      Last Assessed: {skill.lastAssessedAt || 'Recently'}
                    </span>
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${getProficiencyColor(skill.proficiency)}`}>
                    {skill.proficiency}
                  </span>
                </div>

                {/* Score and Progress */}
                <div className="space-y-1 mb-3">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500 font-medium">Competency Score</span>
                    <span className="font-bold text-slate-900">{skill.score}/100</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-slate-900 h-full rounded-full transition-all duration-300"
                      style={{ width: `${skill.score}%` }}
                    />
                  </div>
                </div>

                {/* Confidence */}
                <div className="flex items-center justify-between text-[11px] text-slate-500 mb-3 pb-3 border-b border-slate-200/80">
                  <span className="flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5 text-slate-700" />
                    Model Confidence: <strong>{skill.confidence}%</strong>
                  </span>
                  <span>{skill.evidenceSources.length} Evidence Records</span>
                </div>

                {/* Evidence timeline preview */}
                {skill.evidenceSources.length > 0 && (
                  <div className="space-y-1.5">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Verifiable Evidence
                    </div>
                    {skill.evidenceSources.map(ev => (
                      <div
                        key={ev.id}
                        className="flex items-center justify-between text-[11px] p-2 bg-white rounded-lg border border-slate-200/70"
                      >
                        <div className="flex items-center gap-1.5 truncate">
                          <FileCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span className="truncate font-medium text-slate-700">{ev.title}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 shrink-0 ml-2">
                          {ev.scoreOrGrade || ev.date}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
