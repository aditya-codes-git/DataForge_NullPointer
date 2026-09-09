'use client';

import React from 'react';

export function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-slate-50/50 p-12 text-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent"></div>
      <h4 className="mt-4 text-sm font-semibold text-slate-900">
        Synthesizing with Rime...
      </h4>
      <p className="mt-1 text-xs text-slate-500">
        Generating both RAW and CONTROLLED spoken audio variants.
      </p>
    </div>
  );
}
