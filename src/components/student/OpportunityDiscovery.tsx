import React, { useState } from 'react';
import { Opportunity, StudentProfile, OpportunityType, MatchExplanation } from '../../types';
import { OpportunityService, MatchingService, ApplicationService } from '../../services/portalServices';
import { MatchScoreBadge } from '../common/MatchScoreBadge';
import { ExplainableMatchModal } from '../common/ExplainableMatchModal';
import {
  Search,
  Filter,
  Building2,
  MapPin,
  Calendar,
  DollarSign,
  Briefcase,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  FileText
} from 'lucide-react';

interface OpportunityDiscoveryProps {
  student: StudentProfile;
  onNavigateToApplications?: () => void;
}

export const OpportunityDiscovery: React.FC<OpportunityDiscoveryProps> = ({
  student,
  onNavigateToApplications
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [onlyRemote, setOnlyRemote] = useState(false);
  const [selectedOppForExplain, setSelectedOppForExplain] = useState<{
    opp: Opportunity;
    explanation: MatchExplanation;
  } | null>(null);

  // Apply modal state
  const [applyModalOpp, setApplyModalOpp] = useState<{
    opp: Opportunity;
    explanation: MatchExplanation;
  } | null>(null);
  const [selectedResumeId, setSelectedResumeId] = useState<string>(student.selectedResumeId || student.resumes[0]?.id || '');
  const [coverNote, setCoverNote] = useState<string>('');
  const [isApplying, setIsApplying] = useState(false);
  const [appliedNotice, setAppliedNotice] = useState<string | null>(null);

  const allOpportunities = OpportunityService.getPublished();
  const studentApplications = ApplicationService.getForStudent(student.id);

  const appliedOppIds = new Set(studentApplications.map(a => a.opportunityId));

  // Compute matches and filter
  const opportunitiesWithMatch = allOpportunities.map(opp => ({
    opp,
    explanation: MatchingService.explain(student, opp),
    alreadyApplied: appliedOppIds.has(opp.id)
  }));

  const filtered = opportunitiesWithMatch.filter(({ opp }) => {
    const matchesSearch = 
      opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opp.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opp.requiredSkills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase())) ||
      opp.domain.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = selectedType === 'all' || opp.opportunityType === selectedType;
    const matchesRemote = !onlyRemote || opp.isRemote;

    return matchesSearch && matchesType && matchesRemote;
  });

  // Sort: Highest match score first
  const sorted = [...filtered].sort((a, b) => b.explanation.overallScore - a.explanation.overallScore);

  const handleConfirmApply = () => {
    if (!applyModalOpp) return;
    setIsApplying(true);
    try {
      ApplicationService.apply({
        opportunityId: applyModalOpp.opp.id,
        coverNote,
        resumeId: selectedResumeId,
        matchScore: applyModalOpp.explanation.overallScore
      });
      setAppliedNotice(`Successfully applied to ${applyModalOpp.opp.title} at ${applyModalOpp.opp.companyName}!`);
      setApplyModalOpp(null);
      setCoverNote('');
      setTimeout(() => setAppliedNotice(null), 5000);
    } catch (err: unknown) {
      alert((err as Error).message || 'Failed to apply');
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-900 uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4 text-slate-800" />
            Verified Opportunity Discovery
          </div>
          <h2 className="text-xl font-bold text-slate-900">Industry Opportunities & Intelligent Matching</h2>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">
            Deterministic two-way matching scoring (60% Skill Compatibility, 20% Eligibility, 10% Interest, 10% Preferences). Click any match badge to audit the explanation.
          </p>
        </div>
        {studentApplications.length > 0 && onNavigateToApplications && (
          <button
            onClick={onNavigateToApplications}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl transition-colors shrink-0"
          >
            Track Active Applications ({studentApplications.length})
          </button>
        )}
      </div>

      {/* Applied Banner Notice */}
      {appliedNotice && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-medium flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{appliedNotice}</span>
          </div>
          {onNavigateToApplications && (
            <button
              onClick={onNavigateToApplications}
              className="text-xs font-bold underline hover:opacity-80"
            >
              View in Application Tracker &rarr;
            </button>
          )}
        </div>
      )}

      {/* Search & Filters */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by title, company, technology (e.g. Python, Docker, CloudScale)..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium text-slate-700 cursor-pointer hover:bg-slate-100">
              <input
                type="checkbox"
                checked={onlyRemote}
                onChange={e => setOnlyRemote(e.target.checked)}
                className="rounded-sm text-slate-900 focus:ring-slate-900"
              />
              <span>Remote Only</span>
            </label>
          </div>
        </div>

        {/* Type pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1">
          {['all', 'Internship', 'Job', 'Live Project', 'Apprenticeship'].map(type => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedType === type
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {type === 'all' ? 'All Formats' : type}
            </button>
          ))}
          <span className="text-xs text-slate-400 ml-auto whitespace-nowrap">
            Showing {sorted.length} of {allOpportunities.length} opportunities
          </span>
        </div>
      </div>

      {/* Opportunity Cards */}
      <div className="space-y-4">
        {sorted.map(({ opp, explanation, alreadyApplied }) => (
          <div
            key={opp.id}
            className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:border-slate-400 hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
          >
            <div className="space-y-3 flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                      {opp.opportunityType}
                    </span>
                    <span className="text-xs font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                      {opp.domain}
                    </span>
                    {opp.isRemote && (
                      <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                        Remote Friendly
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 leading-snug">
                    {opp.title}
                  </h3>
                  <div className="flex items-center gap-4 text-xs text-slate-500 mt-1 flex-wrap">
                    <span className="font-semibold text-slate-700 flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      {opp.companyName}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {opp.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                      {opp.stipendOrSalary}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      Deadline: {opp.applicationDeadline}
                    </span>
                  </div>
                </div>

                {/* Match Score Badge */}
                <div className="text-right shrink-0">
                  <MatchScoreBadge
                    score={explanation.overallScore}
                    size="lg"
                    onClick={() => setSelectedOppForExplain({ opp, explanation })}
                  />
                  <div className="text-[10px] text-slate-400 mt-1 cursor-pointer hover:underline" onClick={() => setSelectedOppForExplain({ opp, explanation })}>
                    Click for explanation &rarr;
                  </div>
                </div>
              </div>

              {/* Description Snippet */}
              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                {opp.description}
              </p>

              {/* Skills Tags */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[11px] font-semibold text-slate-400 mr-1">Required:</span>
                {opp.requiredSkills.map(skill => {
                  const isMatched = explanation.matchedSkills.includes(skill);
                  return (
                    <span
                      key={skill}
                      className={`text-[11px] px-2 py-0.5 rounded-md font-medium border flex items-center gap-1 ${
                        isMatched
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}
                    >
                      {isMatched && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                      {skill}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="flex md:flex-col items-center justify-end gap-2 shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedOppForExplain({ opp, explanation })}
                className="w-full md:w-36 px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
              >
                Explain Match
              </button>
              <button
                type="button"
                onClick={() => setApplyModalOpp({ opp, explanation })}
                disabled={alreadyApplied}
                className={`w-full md:w-36 px-4 py-2 text-xs font-bold rounded-xl text-white shadow-xs transition-all ${
                  alreadyApplied
                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                    : 'bg-slate-900 hover:bg-slate-800'
                }`}
              >
                {alreadyApplied ? 'Applied' : 'Apply Now'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Full Factor Explanation */}
      {selectedOppForExplain && (
        <ExplainableMatchModal
          isOpen={Boolean(selectedOppForExplain)}
          onClose={() => setSelectedOppForExplain(null)}
          opportunity={selectedOppForExplain.opp}
          explanation={selectedOppForExplain.explanation}
          alreadyApplied={appliedOppIds.has(selectedOppForExplain.opp.id)}
          onApply={() => {
            setApplyModalOpp(selectedOppForExplain);
            setSelectedOppForExplain(null);
          }}
        />
      )}

      {/* Modal: Apply to Opportunity */}
      {applyModalOpp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Confirm Application
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                {applyModalOpp.opp.title}
              </h3>
              <p className="text-xs text-slate-500">
                {applyModalOpp.opp.companyName} • Match Score: {applyModalOpp.explanation.overallScore}%
              </p>
            </div>

            {/* Resume Selector */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                Select Tailored Resume
              </label>
              <div className="space-y-2">
                {student.resumes.map(res => (
                  <label
                    key={res.id}
                    className={`flex items-center justify-between p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                      selectedResumeId === res.id
                        ? 'border-slate-900 bg-slate-100 text-slate-900 font-semibold'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="selectedResume"
                        checked={selectedResumeId === res.id}
                        onChange={() => setSelectedResumeId(res.id)}
                        className="text-slate-900 focus:ring-slate-900"
                      />
                      <FileText className="w-4 h-4 text-slate-800" />
                      <span className="font-semibold">{res.fileName}</span>
                    </div>
                    {res.isDefault && (
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-slate-200 text-slate-700 rounded-md">
                        Default
                      </span>
                    )}
                  </label>
                ))}
              </div>
            </div>

            {/* Personal Statement / Note */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                Cover Note / Technical Alignment (Optional)
              </label>
              <textarea
                rows={3}
                placeholder="Highlight your demonstrated projects or recent assessments relevant to this opening..."
                value={coverNote}
                onChange={e => setCoverNote(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                onClick={() => setApplyModalOpp(null)}
                className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmApply}
                disabled={isApplying}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-2"
              >
                {isApplying ? 'Submitting...' : 'Confirm & Apply'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
