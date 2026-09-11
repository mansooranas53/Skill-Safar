import React, { useState } from 'react';
import { AssessmentQuestion, StudentProfile } from '../../types';
import { portalRepository } from '../../repositories/mockRepository';
import { AssessmentService } from '../../services/portalServices';
import confetti from 'canvas-confetti';
import {
  Award,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  Sparkles,
  HelpCircle
} from 'lucide-react';

interface SkillAssessmentRunnerProps {
  student: StudentProfile;
  onAssessmentCompleted?: () => void;
}

export const SkillAssessmentRunner: React.FC<SkillAssessmentRunnerProps> = ({
  student,
  onAssessmentCompleted
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('cat-backend');
  const [activeQuizQuestions, setActiveQuizQuestions] = useState<AssessmentQuestion[] | null>(null);
  const [currentQIndex, setCurrentQIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [quizResult, setQuizResult] = useState<{
    totalQuestions: number;
    correctCount: number;
    scorePercentage: number;
    skillUpdates: { skillName: string; score: number }[];
  } | null>(null);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);

  const categories = portalRepository.getCategories();
  const allQuestions = portalRepository.getAssessmentQuestions();

  const startAssessment = (catId: string) => {
    const qList = allQuestions.filter(q => q.categoryId === catId);
    if (qList.length === 0) {
      // fallback to all
      setActiveQuizQuestions(allQuestions.slice(0, 4));
    } else {
      setActiveQuizQuestions(qList);
    }
    setCurrentQIndex(0);
    setSelectedAnswers({});
    setQuizResult(null);
    setShowExplanation(false);
  };

  const handleSelectOption = (qId: string, optIndex: number) => {
    setSelectedAnswers(prev => ({ ...prev, [qId]: optIndex }));
    setShowExplanation(true);
  };

  const handleNext = () => {
    if (!activeQuizQuestions) return;
    if (currentQIndex < activeQuizQuestions.length - 1) {
      setCurrentQIndex(prev => prev + 1);
      setShowExplanation(Boolean(selectedAnswers[activeQuizQuestions[currentQIndex + 1]?.id] !== undefined));
    } else {
      // Finish and evaluate
      submitQuiz();
    }
  };

  const submitQuiz = () => {
    if (!activeQuizQuestions) return;
    const res = AssessmentService.evaluateAndSubmit(student.id, selectedAnswers);
    setQuizResult(res);
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // Ignore confetti if unsupported
    }
    if (onAssessmentCompleted) {
      onAssessmentCompleted();
    }
  };

  const currentQ = activeQuizQuestions ? activeQuizQuestions[currentQIndex] : null;
  const isAnswered = currentQ ? selectedAnswers[currentQ.id] !== undefined : false;

  return (
    <div className="space-y-6">
      {/* Assessment Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 uppercase tracking-wider mb-1">
            <Award className="w-4 h-4 text-slate-900" />
            Skill Assessment Engine
          </div>
          <h2 className="text-xl font-bold text-slate-900">Standardized Competency Verification</h2>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">
            Take timed, objective assessments designed with industry engineering leads. Verified scores directly populate your Skill Profile and update your opportunity match scores.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="p-3 bg-slate-50 text-slate-800 rounded-xl text-center min-w-28 border border-slate-200">
            <div className="text-xs text-slate-500 font-medium">Verified Skills</div>
            <div className="text-xl font-black text-slate-900">{student.skills.length}</div>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl text-center min-w-28 border border-emerald-100">
            <div className="text-xs text-slate-500 font-medium">Avg Score</div>
            <div className="text-xl font-black text-emerald-700">
              {Math.round(student.skills.reduce((a, b) => a + b.score, 0) / (student.skills.length || 1))}%
            </div>
          </div>
        </div>
      </div>

      {/* If Quiz is in Progress */}
      {activeQuizQuestions && !quizResult && currentQ && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 animate-in fade-in-50">
          {/* Progress Bar & Counter */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-semibold uppercase tracking-wider text-slate-900">
              Question {currentQIndex + 1} of {activeQuizQuestions.length}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Target Competency: <strong>{currentQ.skillTarget}</strong>
            </span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-6">
            <div
              className="bg-slate-900 h-full transition-all duration-300 rounded-full"
              style={{ width: `${((currentQIndex + 1) / activeQuizQuestions.length) * 100}%` }}
            />
          </div>

          {/* Question Text */}
          <div className="mb-6">
            <div className="inline-block px-2.5 py-0.5 text-xs font-semibold text-slate-600 bg-slate-100 rounded-md mb-2">
              Difficulty: {currentQ.difficulty}
            </div>
            <h3 className="text-lg font-bold text-slate-900 leading-snug">
              {currentQ.questionText}
            </h3>

            {currentQ.codeSnippet && (
              <pre className="mt-3 p-4 bg-slate-900 text-slate-100 rounded-xl text-xs font-mono overflow-x-auto border border-slate-800">
                <code>{currentQ.codeSnippet}</code>
              </pre>
            )}
          </div>

          {/* Options */}
          <div className="space-y-3 mb-6">
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedAnswers[currentQ.id] === idx;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectOption(currentQ.id, idx)}
                  className={`w-full p-4 rounded-xl text-left border text-sm font-medium transition-all flex items-start gap-3 ${
                    isSelected
                      ? 'bg-slate-900 border-slate-900 text-white shadow-xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                    isSelected ? 'bg-white text-slate-900' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="flex-1 leading-relaxed">{opt}</span>
                </button>
              );
            })}
          </div>

          {/* Explanation after selecting */}
          {showExplanation && (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 mb-6 text-xs text-slate-700 animate-in fade-in">
              <div className="font-semibold text-slate-900 flex items-center gap-1.5 mb-1">
                <HelpCircle className="w-4 h-4 text-slate-800" />
                Technical Explanation & Context
              </div>
              <p className="leading-relaxed">{currentQ.explanation}</p>
            </div>
          )}

          {/* Next / Submit Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setActiveQuizQuestions(null)}
              className="text-xs font-medium text-slate-400 hover:text-slate-600"
            >
              Exit Assessment
            </button>
            <button
              onClick={handleNext}
              disabled={!isAnswered}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white shadow-xs transition-all ${
                isAnswered ? 'bg-slate-900 hover:bg-slate-800' : 'bg-slate-300 cursor-not-allowed'
              }`}
            >
              <span>{currentQIndex === activeQuizQuestions.length - 1 ? 'Submit & Calculate Score' : 'Next Question'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Quiz Result View */}
      {quizResult && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center animate-in zoom-in-95">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Award className="w-8 h-8" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Assessment Complete
          </span>
          <h3 className="text-2xl font-black text-slate-900 mt-2">
            Score: {quizResult.scorePercentage}%
          </h3>
          <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
            You answered {quizResult.correctCount} of {quizResult.totalQuestions} questions correctly. Your skills have been dynamically updated in the central repository!
          </p>

          <div className="max-w-md mx-auto my-6 p-4 bg-slate-50 rounded-xl border border-slate-200 text-left">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Verified Skill Score Updates
            </h4>
            <div className="space-y-2">
              {quizResult.skillUpdates.map(s => (
                <div key={s.skillName} className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800">{s.skillName}</span>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded-md">
                    {s.score}% (Updated)
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => {
                setQuizResult(null);
                setActiveQuizQuestions(null);
              }}
              className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors"
            >
              Back to Catalog
            </button>
            <button
              onClick={() => startAssessment(selectedCategory)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold shadow-xs transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Retake Assessment
            </button>
          </div>
        </div>
      )}

      {/* Catalog of Assessments */}
      {!activeQuizQuestions && !quizResult && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900">Available Assessment Domains</h3>
            <span className="text-xs text-slate-500">Pick a domain to start instant verification</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map(cat => {
              const catQuestions = allQuestions.filter(q => q.categoryId === cat.id);
              const count = catQuestions.length > 0 ? catQuestions.length : 3;
              return (
                <div
                  key={cat.id}
                  className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:border-slate-400 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center mb-4 font-bold">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <h4 className="text-base font-bold text-slate-900">{cat.name}</h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      {cat.description}
                    </p>
                    <div className="flex items-center gap-3 mt-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Award className="w-3.5 h-3.5 text-slate-600" /> {count} Questions
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" /> ~10 Mins
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      startAssessment(cat.id);
                    }}
                    className="mt-5 w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>Launch Assessment</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-300" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
