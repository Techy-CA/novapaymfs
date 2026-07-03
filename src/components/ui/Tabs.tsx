import React, { useState } from 'react';

interface Tab {
  key: string;
  label: string;
  count?: number;
}

interface TabsProps {
  tabs: Tab[];
  activeTab?: string;
  onChange?: (key: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  className = '',
}) => {
  const [internal, setInternal] = useState(tabs[0]?.key);
  const active = activeTab ?? internal;

  const handleClick = (key: string) => {
    setInternal(key);
    onChange?.(key);
  };

  return (
    <div className={`flex gap-0.5 bg-[var(--bg-card)] rounded-xl p-1 border border-[var(--border)] ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => handleClick(tab.key)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11.5px] font-semibold
            transition-all duration-150 whitespace-nowrap
            ${active === tab.key
              ? 'bg-[var(--bg-elevated)] text-[var(--text-primary)] shadow-sm'
              : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
            }`}
        >
          {tab.label}
          {tab.count !== undefined && (
            <span
              className={`px-1.5 py-0.5 rounded text-[9px] font-bold
                ${active === tab.key
                  ? 'bg-blue-500/20 text-blue-400'
                  : 'bg-white/5 text-[var(--text-muted)]'
                }`}
            >
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
};
