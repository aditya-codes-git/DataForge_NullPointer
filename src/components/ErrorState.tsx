'use client';

import React from 'react';
import { AlertCircle, X } from 'lucide-react';

interface ErrorStateProps {
  message: string;
  onDismiss?: () => void;
}

export function ErrorState({ message, onDismiss }: ErrorStateProps) {
  return (
    <div className="flex items-start justify-between gap-3 rounded-xl border border-rose-200 bg-rose-50/70 p-4 text-xs text-rose-900 shadow-sm">
      <div className="flex items-start gap-2.5">
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" />
        <div>
          <strong className="font-semibold text-rose-900">Notice: </strong>
          <span>{message}</span>
        </div>
      </div>

      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="text-rose-400 hover:text-rose-700"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
