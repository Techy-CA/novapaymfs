import React from 'react';

// ─── Input ────────────────────────────────────────────────────────────────

type InputBaseProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'prefix' | 'suffix'>;
interface InputProps extends InputBaseProps {
  label?: string;
  error?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  fullWidth?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  prefix,
  suffix,
  fullWidth = true,
  className = '',
  ...props
}) => {
  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label className="block text-[11px] font-semibold text-[var(--text-secondary)] mb-1.5 uppercase tracking-wide">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {prefix && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] flex items-center">
            {prefix}
          </div>
        )}
        <input
          className={`w-full px-3 py-2 text-[12.5px] rounded-lg bg-white/4 border border-[var(--border)]
            text-[var(--text-primary)] placeholder-[var(--text-muted)]
            focus:outline-none focus:border-blue-500/50 focus:bg-blue-500/4
            transition-all duration-150
            ${prefix ? 'pl-8' : ''}
            ${suffix ? 'pr-8' : ''}
            ${error ? 'border-rose-500/50 bg-rose-500/4' : ''}
            ${className}`}
          {...props}
        />
        {suffix && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] flex items-center">
            {suffix}
          </div>
        )}
      </div>
      {error && <p className="text-[10.5px] text-rose-400 mt-1">{error}</p>}
    </div>
  );
};

// ─── Select ────────────────────────────────────────────────────────────────

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  options: { value: string; label: string }[];
}

export const Select: React.FC<SelectProps> = ({
  label,
  error,
  fullWidth = true,
  options,
  className = '',
  ...props
}) => {
  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label className="block text-[11px] font-semibold text-[var(--text-secondary)] mb-1.5 uppercase tracking-wide">
          {label}
        </label>
      )}
      <select
        className={`w-full px-3 py-2 text-[12.5px] rounded-lg bg-white/4 border border-[var(--border)]
          text-[var(--text-primary)] appearance-none
          focus:outline-none focus:border-blue-500/50 focus:bg-blue-500/4
          transition-all duration-150 cursor-pointer
          ${error ? 'border-rose-500/50' : ''}
          ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-[10.5px] text-rose-400 mt-1">{error}</p>}
    </div>
  );
};

// ─── Textarea ─────────────────────────────────────────────────────────────

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea: React.FC<TextareaProps> = ({
  label, error, className = '', ...props
}) => (
  <div className="w-full">
    {label && (
      <label className="block text-[11px] font-semibold text-[var(--text-secondary)] mb-1.5 uppercase tracking-wide">
        {label}
      </label>
    )}
    <textarea
      className={`w-full px-3 py-2 text-[12.5px] rounded-lg bg-white/4 border border-[var(--border)]
        text-[var(--text-primary)] placeholder-[var(--text-muted)] resize-y min-h-[80px]
        focus:outline-none focus:border-blue-500/50 focus:bg-blue-500/4
        transition-all duration-150 font-sans
        ${error ? 'border-rose-500/50' : ''}
        ${className}`}
      {...props}
    />
    {error && <p className="text-[10.5px] text-rose-400 mt-1">{error}</p>}
  </div>
);

// ─── Search ────────────────────────────────────────────────────────────────

interface SearchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onClear?: () => void;
  icon?: React.ReactNode;
}

export const SearchInput: React.FC<SearchProps> = ({
  icon,
  onClear,
  className = '',
  value,
  ...props
}) => {
  return (
    <div className="relative flex items-center">
      {icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
          {icon}
        </div>
      )}
      <input
        value={value}
        className={`pl-9 pr-8 py-2 text-[12.5px] rounded-lg bg-white/4 border border-[var(--border)]
          text-[var(--text-primary)] placeholder-[var(--text-muted)]
          focus:outline-none focus:border-blue-500/50 focus:bg-blue-500/4
          transition-all duration-150 w-full
          ${className}`}
        {...props}
      />
      {value && onClear && (
        <button
          onClick={onClear}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]
            hover:text-[var(--text-primary)] transition-colors w-4 h-4 flex items-center justify-center"
        >
          ✕
        </button>
      )}
    </div>
  );
};

// ─── Form Row ─────────────────────────────────────────────────────────────

export const FormRow: React.FC<{ children: React.ReactNode; cols?: 1 | 2 | 3 }> = ({
  children,
  cols = 2,
}) => {
  const colMap = { 1: 'grid-cols-1', 2: 'grid-cols-1 sm:grid-cols-2', 3: 'grid-cols-1 sm:grid-cols-3' };
  return <div className={`grid ${colMap[cols]} gap-3`}>{children}</div>;
};
