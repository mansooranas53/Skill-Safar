import React, { useState } from 'react';
import { LearningProgram, StudentProfile } from '../../types';
import { LearningService, StudentService } from '../../services/portalServices';
import confetti from 'canvas-confetti';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Award
} from 'lucide-react';

interface LearningCenterProps {
  student: StudentProfile;
  onNavigateToAssessment?: () => void;
}

export const LearningCenter: React.FC<LearningCenterProps> = ({
  student,
  onNavigateToAssessment
}) => {
  const [completedNotice, setCompletedNotice] = useState<string | null>(null);
  const [completingId, setCompletingId] = useState<string | null>(null);

  const programs = LearningService.getAllPrograms();
  const gaps = StudentService.getSkillGaps(student);

  const handleCompleteProgram = (prog: LearningProgram) => {
    setCompletingId(prog.id);
    setTimeout(() => {
      LearningService.completeProgram(prog.id);
      setCompletingId(null);
      setCompletedNotice(`Successfully completed "${prog.title}"! Verified ${prog.targetSkill} score increased by +${prog.scoreBoost}%.`);
      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch {
        // ignore
      }
      setTimeout(() => setCompletedNotice(null), 6000);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-900 uppercase tracking-wider mb-1">
            <BookOpen className="w-4 h-4 text-slate-800" />
            Employability Skill Bridge
          </div>
          <h2 className="text-xl font-bold text-slate-900">Personalized Learning & Reassessment</h2>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">
            Targeted micro-workshops and technical modules explicitly mapped to bridge identified skill gaps. Completing modules boosts your verified score and triggers reassessment.
          </p>
        </div>
        {onNavigateToAssessment && (
          <button
            onClick={onNavigateToAssessment}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-all shrink-0"
          >
            Take Skill Reassessment
          </button>
        )}
      </div>

      {/* Completion Banner */}
      {completedNotice && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-medium flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{completedNotice}</span>
          </div>
          {onNavigateToAssessment && (
            <button
              onClick={onNavigateToAssessment}
              className="text-xs font-bold underline hover:opacity-85 ml-2 shrink-0"
            >
              Verify in Assessment &rarr;
            </button>
          )}
        </div>
      )}

      {/* Gap recommendation notice */}
      {gaps.length > 0 && (
        <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-slate-800 shrink-0" />
            <span className="text-xs text-slate-800 font-medium">
              We identified <strong>{gaps.length} priority skill gaps</strong> ({gaps.map(g => g.skillName).join(', ')}) based on your targeted opportunity openings.
            </span>
          </div>
        </div>
      )}

      {/* Course Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {programs.map(prog => {
          const isTargetGap = gaps.some(g => g.skillName.toLowerCase() === prog.targetSkill.toLowerCase());
          return (
            <div
              key={prog.id}
              className={`bg-white rounded-2xl p-6 border transition-all flex flex-col justify-between ${
                prog.isCompleted
                  ? 'border-emerald-200 bg-emerald-50/20'
                  : isTargetGap
                  ? 'border-slate-400 shadow-xs'
                  : 'border-slate-200'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                    {prog.type}
                  </span>
                  {prog.isCompleted ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Completed
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-800 border border-slate-300 rounded-md flex items-center gap-1">
                      <TrendingUp className="w-3 h-3 text-slate-600" />
                      +{prog.scoreBoost}% Score
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-slate-900 leading-snug mt-1 mb-1">
                  {prog.title}
                </h3>
                <p className="text-xs text-slate-500 font-medium mb-2">
                  {prog.provider}
                </p>

                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4">
                  {prog.description}
                </p>

                {/* Target Competency */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 mb-4 text-xs">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Targeted Competency
                  </div>
                  <div className="font-bold text-slate-800 flex items-center justify-between">
                    <span>{prog.targetSkill}</span>
                    <span className="text-[10px] text-slate-500 font-normal">
                      Difficulty: {prog.difficulty}
                    </span>
                  </div>
                </div>

                {/* Syllabus snippets */}
                <div className="space-y-1 mb-4">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Curriculum Modules
                  </div>
                  {prog.syllabus.map((topic, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-[11px] text-slate-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
                      <span className="truncate">{topic}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="text-xs text-slate-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{prog.durationHours} Hours</span>
                </div>
                {prog.isCompleted ? (
                  <button
                    disabled
                    className="px-3 py-1.5 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-xl cursor-default flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Verified in Profile
                  </button>
                ) : (
                  <button
                    onClick={() => handleCompleteProgram(prog)}
                    disabled={completingId === prog.id}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5"
                  >
                    <span>{completingId === prog.id ? 'Verifying...' : 'Complete Module'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
