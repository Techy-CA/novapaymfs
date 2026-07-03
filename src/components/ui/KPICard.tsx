import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { formatCurrency, formatPercent } from '../../lib/utils';

interface KPICardProps {
  label: string;
  value: string | number;
  valueFormatType?: 'currency' | 'currency-compact' | 'number' | 'percent' | 'raw';
  change?: number;
  changeLabel?: string;
  sub?: string;
  icon: React.ReactNode;
  accentColor?: 'blue' | 'green' | 'amber' | 'red' | 'purple' | 'teal';
  iconBg?: string;
  className?: string;
}

const accentMap = {
  blue: 'from-blue-500/0 via-blue-500/30 to-blue-500/0',
  green: 'from-emerald-500/0 via-emerald-500/30 to-emerald-500/0',
  amber: 'from-amber-500/0 via-amber-500/30 to-amber-500/0',
  red: 'from-rose-500/0 via-rose-500/30 to-rose-500/0',
  purple: 'from-violet-500/0 via-violet-500/30 to-violet-500/0',
  teal: 'from-teal-500/0 via-teal-500/30 to-teal-500/0',
};

const iconBgMap = {
  blue: 'bg-blue-500/10 text-blue-400',
  green: 'bg-emerald-500/10 text-emerald-400',
  amber: 'bg-amber-500/10 text-amber-400',
  red: 'bg-rose-500/10 text-rose-400',
  purple: 'bg-violet-500/10 text-violet-400',
  teal: 'bg-teal-500/10 text-teal-400',
};

function formatValue(value: string | number, type: KPICardProps['valueFormatType']): string {
  if (type === 'currency') return formatCurrency(Number(value));
  if (type === 'currency-compact') return formatCurrency(Number(value), true);
  if (type === 'percent') return formatPercent(Number(value));
  if (type === 'number') return new Intl.NumberFormat('en-IN').format(Number(value));
  return String(value);
}

export const KPICard: React.FC<KPICardProps> = ({
  label,
  value,
  valueFormatType = 'raw',
  change,
  changeLabel,
  sub,
  icon,
  accentColor = 'blue',
  className = '',
}) => {
  const isPositive = change !== undefined && change >= 0;
  const isNegative = change !== undefined && change < 0;

  return (
    <div
      className={`relative bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-4 overflow-hidden
        transition-all duration-200 hover:border-white/10 group ${className}`}
    >
      {/* Top accent line */}
      <div
        className={`absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r ${accentMap[accentColor]}`}
      />

      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wide mb-2">
            {label}
          </p>
          <p className="text-2xl font-extrabold text-[var(--text-primary)] tracking-tight leading-none mb-2">
            {formatValue(value, valueFormatType)}
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            {change !== undefined && (
              <span
                className={`inline-flex items-center gap-0.5 text-[10.5px] font-semibold px-1.5 py-0.5 rounded-md
                  ${isPositive ? 'bg-emerald-400/10 text-emerald-400' : ''}
                  ${isNegative ? 'bg-rose-400/10 text-rose-400' : ''}
                  ${change === 0 ? 'bg-white/5 text-white/40' : ''}`}
              >
                {isPositive ? <TrendingUp size={9} /> : <TrendingDown size={9} />}
                {Math.abs(change)}%
              </span>
            )}
            {changeLabel && (
              <span className="text-[10.5px] text-[var(--text-muted)]">{changeLabel}</span>
            )}
            {sub && !changeLabel && (
              <span className="text-[10.5px] text-[var(--text-muted)]">{sub}</span>
            )}
          </div>
        </div>
        <div
          className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ml-3
            ${iconBgMap[accentColor]}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};
