'use client';

import React, { useState } from 'react';
import { Check } from 'lucide-react';

interface VerificationPanelProps {
  onAssess?: (assessment: 'better' | 'same' | 'worse') => void;
}

export function VerificationPanel({ onAssess }: VerificationPanelProps) {
  const [selected, setSelected] = useState<'better' | 'same' | 'worse' | null>(null);

  const handleSelect = (choice: 'better' | 'same' | 'worse') => {
    setSelected(choice);
    if (onAssess) onAssess(choice);
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-slate-50/70 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h4 className="text-sm font-semibold text-slate-900">
            Did the controlled version improve the spoken delivery?
          </h4>
          <p className="mt-0.5 text-xs text-slate-500">
            Help verify the audio comparison outcome.
          </p>
        </div>

        {/* 3 Simple Options */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleSelect('better')}
            className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
              selected === 'better'
                ? 'border border-emerald-500 bg-emerald-600 text-white shadow-sm'
                : 'border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            Better
          </button>

          <button
            type="button"
            onClick={() => handleSelect('same')}
            className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
              selected === 'same'
                ? 'border border-slate-700 bg-slate-800 text-white shadow-sm'
                : 'border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            About the same
          </button>

          <button
            type="button"
            onClick={() => handleSelect('worse')}
            className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
              selected === 'worse'
                ? 'border border-rose-500 bg-rose-600 text-white shadow-sm'
                : 'border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            Worse
          </button>
        </div>
      </div>

      {selected && (
        <div className="mt-3 flex items-center gap-2 text-xs text-emerald-700">
          <Check className="h-4 w-4" />
          <span>Feedback noted: marked as {selected === 'same' ? 'about the same' : selected}.</span>
        </div>
      )}
    </section>
  );
}
