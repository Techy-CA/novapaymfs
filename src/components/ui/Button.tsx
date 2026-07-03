import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'ghost' | 'amber';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  loading?: boolean;
  fullWidth?: boolean;
}

const variantMap = {
  primary: 'bg-blue-600 hover:bg-blue-500 text-white border-transparent',
  secondary: 'bg-transparent hover:bg-white/5 text-[var(--text-secondary)] border-[var(--border-strong)] hover:text-[var(--text-primary)] hover:border-white/15',
  success: 'bg-emerald-600 hover:bg-emerald-500 text-white border-transparent',
  danger: 'bg-rose-600 hover:bg-rose-500 text-white border-transparent',
  ghost: 'bg-transparent hover:bg-white/5 text-[var(--text-muted)] border-transparent',
  amber: 'bg-amber-500 hover:bg-amber-400 text-white border-transparent',
};

const sizeMap = {
  xs: 'px-2 py-1 text-[10.5px] gap-1 rounded-md',
  sm: 'px-2.5 py-1.5 text-[11.5px] gap-1.5 rounded-lg',
  md: 'px-3.5 py-2 text-[12.5px] gap-2 rounded-lg',
  lg: 'px-5 py-2.5 text-sm gap-2 rounded-xl',
};

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'secondary',
  size = 'sm',
  icon,
  iconRight,
  loading = false,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}) => {
  return (
    <button
      className={`inline-flex items-center justify-center font-semibold border
        transition-all duration-150 whitespace-nowrap select-none
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantMap[variant]} ${sizeMap[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        icon && <span className="flex-shrink-0">{icon}</span>
      )}
      {children}
      {iconRight && <span className="flex-shrink-0">{iconRight}</span>}
    </button>
  );
};

// Icon-only button
export const IconButton: React.FC<{
  icon: React.ReactNode;
  onClick?: () => void;
  size?: 'sm' | 'md';
  className?: string;
  title?: string;
  active?: boolean;
}> = ({ icon, onClick, size = 'md', className = '', title, active }) => {
  const sz = size === 'sm' ? 'w-7 h-7' : 'w-8 h-8';
  return (
    <button
      onClick={onClick}
      title={title}
      className={`${sz} flex items-center justify-center rounded-lg
        border border-[var(--border)] text-[var(--text-muted)]
        hover:bg-white/5 hover:text-[var(--text-primary)] hover:border-[var(--border-strong)]
        transition-all duration-150 flex-shrink-0
        ${active ? 'bg-white/8 text-[var(--text-primary)] border-white/12' : ''}
        ${className}`}
    >
      {icon}
    </button>
  );
};
