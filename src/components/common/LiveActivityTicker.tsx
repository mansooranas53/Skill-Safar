import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Activity,
  CheckCircle2,
  Building2,
  GraduationCap,
  Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ActivityItem {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  tag: string;
  text: string;
  time: string;
}

const ACTIVITIES: ActivityItem[] = [
  {
    id: '1',
    icon: Award,
    tag: 'Verification',
    text: 'Aanal Nathvani completed Docker & Containers assessment (Score: 88%)',
    time: '2m ago'
  },
  {
    id: '2',
    icon: Building2,
    tag: 'Industry Match',
    text: 'CloudScale Technologies shortlisted 3 candidates for Distributed Systems Intern',
    time: '8m ago'
  },
  {
    id: '3',
    icon: GraduationCap,
    tag: 'Academician',
    text: 'Prof. Herva Mehta reviewed Capstone Milestone for B.Tech CS candidates',
    time: '14m ago'
  },
  {
    id: '4',
    icon: Activity,
    tag: 'Accreditation',
    text: 'ITS Bangalore updated placement readiness metrics (NIRF 2026 dossier ready)',
    time: '22m ago'
  },
  {
    id: '5',
    icon: Sparkles,
    tag: 'AI Matching',
    text: 'Explainable AI engine recalculated fit compatibility for 18 active job requisitions',
    time: '35m ago'
  }
];

export const LiveActivityTicker: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % ACTIVITIES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isPaused]);

  const current = ACTIVITIES[currentIndex];
  const Icon = current.icon;

  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % ACTIVITIES.length);
  };

  const handlePrev = () => {
    setCurrentIndex(prev => (prev - 1 + ACTIVITIES.length) % ACTIVITIES.length);
  };

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="bg-slate-900 text-white text-xs border-b border-slate-800 px-4 sm:px-8 py-2 flex items-center justify-between gap-4 select-none relative overflow-hidden"
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {/* Live pulsating dot */}
        <div className="flex items-center gap-1.5 shrink-0 bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] uppercase font-bold tracking-widest text-slate-300">
            Live Feed
          </span>
        </div>

        {/* Animated text transition */}
        <div className="relative h-5 overflow-hidden flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2 truncate"
            >
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-800/80 px-1.5 py-0.5 rounded border border-slate-700 shrink-0">
                {current.tag}
              </span>
              <span className="text-slate-200 font-light truncate text-xs">{current.text}</span>
              <span className="text-[11px] text-slate-500 shrink-0 hidden sm:inline">&bull; {current.time}</span>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-1 shrink-0 text-slate-400">
        <button
          onClick={handlePrev}
          className="p-1 hover:text-white rounded hover:bg-slate-800 transition-colors"
          aria-label="Previous event"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>
        <span className="text-[10px] font-mono font-medium text-slate-400 px-1">
          {currentIndex + 1}/{ACTIVITIES.length}
        </span>
        <button
          onClick={handleNext}
          className="p-1 hover:text-white rounded hover:bg-slate-800 transition-colors"
          aria-label="Next event"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
