import React from 'react';
import { MatchExplanation, Opportunity } from '../../types';
import { X, CheckCircle2, AlertTriangle, Sparkles, GraduationCap, MapPin, Briefcase } from 'lucide-react';

interface ExplainableMatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  opportunity: Opportunity;
  explanation: MatchExplanation;
  onApply?: () => void;
  alreadyApplied?: boolean;
}

export const ExplainableMatchModal: React.FC<ExplainableMatchModalProps> = ({
  isOpen,
  onClose,
  opportunity,
  explanation,
  onApply,
  alreadyApplied
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50/50">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-900 uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5 text-slate-800" />
              Explainable Compatibility Analysis
            </div>
            <h3 className="text-xl font-bold text-slate-900">{opportunity.title}</h3>
            <p className="text-sm text-slate-500">{opportunity.companyName} • {opportunity.location}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Main Score Bar */}
          <div className="bg-slate-50 p-5 rounded-xl border border-slate-200/80">
            <div className="flex items-baseline justify-between mb-2">
              <span className="text-sm font-semibold text-slate-700">Overall Match Score</span>
              <span className="text-2xl font-black text-slate-900">{explanation.overallScore}%</span>
            </div>
            <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden flex">
              <div
                className="bg-slate-900 h-full rounded-full transition-all duration-500"
                style={{ width: `${explanation.overallScore}%` }}
              />
            </div>
            <p className="text-xs text-slate-600 mt-2.5 leading-relaxed">
              {explanation.recommendationSummary}
            </p>
          </div>

          {/* Factor Breakdown */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              Mathematical Factor Breakdown
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl border border-slate-200 bg-white">
                <span className="text-xs text-slate-500 block mb-1">Skill Match (60%)</span>
                <span className="text-lg font-bold text-slate-900">{explanation.skillCompatibilityScore}/60</span>
              </div>
              <div className="p-3 rounded-xl border border-slate-200 bg-white">
                <span className="text-xs text-slate-500 block mb-1">Eligibility (20%)</span>
                <span className="text-lg font-bold text-slate-900">{explanation.eligibilityScore}/20</span>
              </div>
              <div className="p-3 rounded-xl border border-slate-200 bg-white">
                <span className="text-xs text-slate-500 block mb-1">Interest (10%)</span>
                <span className="text-lg font-bold text-slate-900">{explanation.careerInterestScore}/10</span>
              </div>
              <div className="p-3 rounded-xl border border-slate-200 bg-white">
                <span className="text-xs text-slate-500 block mb-1">Preferences (10%)</span>
                <span className="text-lg font-bold text-slate-900">{explanation.preferencesScore}/10</span>
              </div>
            </div>
          </div>

          {/* Matched Skills */}
          <div>
            <h4 className="text-sm font-semibold text-slate-800 mb-2.5 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Verified Matching Competencies ({explanation.matchedSkills.length})
            </h4>
            <div className="flex flex-wrap gap-2">
              {explanation.matchedSkills.map(skill => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-medium"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  {skill}
                </span>
              ))}
              {explanation.matchedPreferredSkills.map(skill => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-800 border border-slate-300 rounded-lg text-xs font-medium"
                >
                  <Sparkles className="w-3.5 h-3.5 text-slate-700" />
                  {skill} (Preferred)
                </span>
              ))}
            </div>
          </div>

          {/* Missing Required Skills */}
          {explanation.missingRequiredSkills.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-slate-800 mb-2.5 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                Missing Required Competencies ({explanation.missingRequiredSkills.length})
              </h4>
              <div className="flex flex-wrap gap-2">
                {explanation.missingRequiredSkills.map(skill => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-lg text-xs font-medium"
                  >
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    {skill}
                  </span>
                ))}
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Tip: You can take our targeted skill assessments or micro-workshops to bridge these competency gaps and boost your score.
              </p>
            </div>
          )}

          {/* Eligibility Audit */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-slate-500" />
              Eligibility Checklist
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-600">
              {explanation.eligibilityDetails.map((detail, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-800" />
                  {detail}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            Explainable AI calculation • No black-box filtering
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 text-slate-700 text-sm font-medium rounded-xl hover:bg-slate-100 transition-colors"
            >
              Close
            </button>
            {onApply && (
              <button
                onClick={() => {
                  onClose();
                  onApply();
                }}
                disabled={alreadyApplied}
                className={`px-5 py-2 text-sm font-semibold rounded-xl text-white shadow-xs transition-all ${
                  alreadyApplied
                    ? 'bg-slate-400 cursor-not-allowed'
                    : 'bg-slate-900 hover:bg-slate-800'
                }`}
              >
                {alreadyApplied ? 'Already Applied' : 'Apply to Opportunity'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
