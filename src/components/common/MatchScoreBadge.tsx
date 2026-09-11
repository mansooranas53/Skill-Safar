import React from 'react';

interface MatchScoreBadgeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  onClick?: () => void;
}

export const MatchScoreBadge: React.FC<MatchScoreBadgeProps> = ({
  score,
  size = 'md',
  showLabel = true,
  onClick
}) => {
  let colorClass = 'bg-slate-900 text-white border-slate-900';
  let dotColor = 'bg-white';

  if (score < 60) {
    colorClass = 'bg-slate-100 text-slate-700 border-slate-200';
    dotColor = 'bg-slate-400';
  } else if (score < 80) {
    colorClass = 'bg-slate-100 text-slate-900 border-slate-300 font-semibold';
    dotColor = 'bg-slate-800';
  }

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-sm px-2.5 py-1 gap-1.5',
    lg: 'text-base px-3.5 py-1.5 gap-2 font-semibold'
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      className={`inline-flex items-center font-medium rounded-full border transition-all ${colorClass} ${sizeClasses[size]} ${
        onClick ? 'hover:scale-105 cursor-pointer shadow-xs' : 'cursor-default'
      }`}
      title={`Deterministic match score: ${score}%. Click to view full skill & eligibility breakdown.`}
    >
      <span className={`rounded-full ${dotColor} ${size === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2'}`} />
      <span>{score}%</span>
      {showLabel && <span className="font-normal opacity-85">Match</span>}
    </button>
  );
};
