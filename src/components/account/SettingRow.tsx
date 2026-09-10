import React from 'react';

interface SettingRowProps {
  label: string;
  description: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}

export function SettingRow({ label, description, children, action }: SettingRowProps) {
  return (
    <div className="py-5 border-b border-neutral-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 last:border-b-0">
      <div className="max-w-md">
        <h4 className="text-xs font-mono uppercase tracking-wider font-semibold text-neutral-900">
          {label}
        </h4>
        <p className="text-xs text-neutral-500 mt-1 leading-normal font-sans">
          {description}
        </p>
      </div>
      <div className="flex items-center gap-4 sm:justify-end min-w-0">
        <div className="text-sm font-sans text-neutral-800 truncate">
          {children}
        </div>
        {action && (
          <div className="flex-shrink-0">
            {action}
          </div>
        )}
      </div>
    </div>
  );
}
