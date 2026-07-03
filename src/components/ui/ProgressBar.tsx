import React from 'react';

interface ProgressBarProps {
  value: number;
  max?: number;
  color?: 'blue' | 'green' | 'amber' | 'red' | 'purple';
  size?: 'xs' | 'sm' | 'md';
  showLabel?: boolean;
  className?: string;
  animated?: boolean;
}

const colorMap = {
  blue: 'bg-blue-500',
  green: 'bg-emerald-500',
  amber: 'bg-amber-500',
  red: 'bg-rose-500',
  purple: 'bg-violet-500',
};

const sizeMap = {
  xs: 'h-1',
  sm: 'h-1.5',
  md: 'h-2',
};

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  color = 'blue',
  size = 'sm',
  showLabel = false,
  className = '',
  animated = false,
}) => {
  const pct = Math.min(Math.max((value / max) * 100, 0), 100);
  const autoColor =
    pct >= 95 ? 'green' : pct >= 80 ? 'blue' : pct >= 60 ? 'amber' : 'red';
  const finalColor = color !== 'blue' ? color : autoColor;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className={`flex-1 bg-white/5 rounded-full overflow-hidden ${sizeMap[size]}`}>
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out
            ${colorMap[finalColor]}
            ${animated ? 'animate-pulse-slow' : ''}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-[10.5px] font-semibold text-[var(--text-muted)] min-w-[32px] text-right">
          {pct.toFixed(0)}%
        </span>
      )}
    </div>
  );
};
