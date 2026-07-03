import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'green' | 'red' | 'amber' | 'blue' | 'purple' | 'teal' | 'gray';
  size?: 'sm' | 'md';
  dot?: boolean;
  className?: string;
}

const variantMap = {
  green: 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20',
  red: 'bg-rose-400/10 text-rose-400 border-rose-400/20',
  amber: 'bg-amber-400/10 text-amber-400 border-amber-400/20',
  blue: 'bg-blue-400/10 text-blue-400 border-blue-400/20',
  purple: 'bg-violet-400/10 text-violet-400 border-violet-400/20',
  teal: 'bg-teal-400/10 text-teal-400 border-teal-400/20',
  gray: 'bg-white/5 text-white/40 border-white/10',
};

const dotMap = {
  green: 'bg-emerald-400',
  red: 'bg-rose-400',
  amber: 'bg-amber-400',
  blue: 'bg-blue-400',
  purple: 'bg-violet-400',
  teal: 'bg-teal-400',
  gray: 'bg-white/30',
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'gray',
  size = 'sm',
  dot = true,
  className = '',
}) => {
  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-[10.5px]' : 'px-2.5 py-1 text-xs';
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-lg border font-semibold 
        ${sizeClass} ${variantMap[variant]} ${className}`}
    >
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dotMap[variant]}`} />
      )}
      {children}
    </span>
  );
};
