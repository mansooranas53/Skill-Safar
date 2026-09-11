import React from 'react';
import { Check, ArrowRight, Sparkles } from 'lucide-react';

interface EmployabilityLoopProps {
  currentStage: string;
  onNavigateStage?: (tab: string) => void;
}

export const EmployabilityLoopProgress: React.FC<EmployabilityLoopProps> = ({
  currentStage,
  onNavigateStage
}) => {
  const stages = [
    { id: 'ASSESS', label: 'Assess', tab: 'assessments', desc: 'Verify baseline competencies' },
    { id: 'IDENTIFY_GAPS', label: 'Identify Gaps', tab: 'skills', desc: 'Benchmark vs industry demand' },
    { id: 'LEARN', label: 'Learn', tab: 'learning', desc: 'Targeted micro-courses' },
    { id: 'REASSESS', label: 'Reassess', tab: 'assessments', desc: 'Validate score improvements' },
    { id: 'MATCH', label: 'Match', tab: 'opportunities', desc: 'Deterministic compatibility' },
    { id: 'APPLY', label: 'Apply', tab: 'opportunities', desc: 'Submit tailored applications' },
    { id: 'EXPERIENCE', label: 'Experience', tab: 'applications', desc: 'Internship & real-world proof' },
  ];

  const currentIdx = stages.findIndex(s => s.id === currentStage);
  const activeIndex = currentIdx >= 0 ? currentIdx : 1;

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-2xs mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-slate-800" />
          </div>
          <div>
            <h3 className="text-sm font-display font-bold text-slate-900 tracking-tight">
              Continuous Employability Progression
            </h3>
            <p className="text-xs text-slate-500 font-light">
              Step-by-step readiness cycle benchmarked against industry standards
            </p>
          </div>
        </div>
        <span className="self-start sm:self-auto text-xs font-medium px-3 py-1 bg-slate-100 text-slate-700 rounded-full">
          Step {activeIndex + 1} of {stages.length}: <strong className="font-semibold text-slate-900">{stages[activeIndex]?.label}</strong>
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
        {stages.map((stage, idx) => {
          const isDone = idx < activeIndex;
          const isCurrent = idx === activeIndex;
          return (
            <button
              key={stage.id}
              onClick={() => onNavigateStage && onNavigateStage(stage.tab)}
              className={`p-3 rounded-xl text-left border transition-all ${
                isCurrent
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : isDone
                  ? 'bg-white border-slate-200 text-slate-800 hover:border-slate-300'
                  : 'bg-slate-50/70 border-slate-100 text-slate-500 hover:bg-slate-100/70'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className={`text-[10px] font-bold uppercase tracking-wider ${
                  isCurrent ? 'text-slate-400' : isDone ? 'text-emerald-600' : 'text-slate-400'
                }`}>
                  0{idx + 1}
                </span>
                {isDone ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : isCurrent ? (
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                ) : (
                  <ArrowRight className="w-3 h-3 text-slate-300" />
                )}
              </div>
              <div className={`text-xs font-semibold leading-snug ${isCurrent ? 'text-white' : 'text-slate-900'}`}>
                {stage.label}
              </div>
              <div className={`text-[10px] mt-0.5 line-clamp-1 font-light ${
                isCurrent ? 'text-slate-300' : isDone ? 'text-slate-500' : 'text-slate-400'
              }`}>
                {stage.desc}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
