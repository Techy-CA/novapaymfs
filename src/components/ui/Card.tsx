import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg' | 'none';
  elevated?: boolean;
}

interface CardHeaderProps {
  title: React.ReactNode;
  subtitle?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

const paddingMap = {
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-5',
  none: 'p-0',
};

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  padding = 'md',
  elevated = false,
}) => {
  const bg = elevated ? 'bg-[var(--bg-card2)]' : 'bg-[var(--bg-card)]';
  return (
    <div
      className={`${bg} border border-[var(--border)] rounded-xl ${paddingMap[padding]} ${className}`}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<CardHeaderProps> = ({
  title,
  subtitle,
  icon,
  action,
  className = '',
}) => {
  return (
    <div className={`flex items-center justify-between mb-4 ${className}`}>
      <div className="flex items-center gap-2">
        {icon && <span className="flex-shrink-0">{icon}</span>}
        <div>
          {typeof title === 'string' ? (
            <h3 className="text-[13.5px] font-bold text-[var(--text-primary)]">{title}</h3>
          ) : (
            title
          )}
          {subtitle && (
            <p className="text-[11px] text-[var(--text-muted)] mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
};

// Table wrapper card
export const TableCard: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => (
  <div
    className={`bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden ${className}`}
  >
    {children}
  </div>
);
