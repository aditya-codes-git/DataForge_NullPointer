'use client';

import React, { useState } from 'react';
import { Check, ThumbsUp } from 'lucide-react';

type EvaluationChoice = 'raw' | 'controlled' | 'same' | 'not_sure';

interface VerificationPanelProps {
  onAssess?: (assessment: EvaluationChoice) => void;
}

export function VerificationPanel({ onAssess }: VerificationPanelProps) {
  const [selected, setSelected] = useState<EvaluationChoice | null>(null);

  const handleSelect = (choice: EvaluationChoice) => {
    setSelected(choice);
    if (onAssess) onAssess(choice);
  };

  const getChoiceLabel = (choice: EvaluationChoice) => {
    switch (choice) {
      case 'raw':
        return 'Raw is clearer';
      case 'controlled':
        return 'Controlled candidate is clearer';
      case 'same':
        return 'About the same';
      case 'not_sure':
        return 'Not sure / Needs review';
    }
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-slate-50/70 p-6 space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <ThumbsUp className="h-4 w-4 text-indigo-600" />
            Listener Delivery QA
          </h4>
          <p className="mt-0.5 text-xs text-slate-500">
            Listen to both Rime recordings above. Which representation sounds clearer for human listeners?
          </p>
        </div>

        {/* 4 Transparent Listener Evaluation Options */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => handleSelect('raw')}
            className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
              selected === 'raw'
                ? 'border border-sky-500 bg-sky-600 text-white shadow-sm'
                : 'border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            RAW IS BETTER
          </button>

          <button
            type="button"
            onClick={() => handleSelect('controlled')}
            className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
              selected === 'controlled'
                ? 'border border-emerald-500 bg-emerald-600 text-white shadow-sm'
                : 'border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            CONTROLLED IS BETTER
          </button>

          <button
            type="button"
            onClick={() => handleSelect('same')}
            className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
              selected === 'same'
                ? 'border border-slate-700 bg-slate-800 text-white shadow-sm'
                : 'border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            ABOUT THE SAME
          </button>

          <button
            type="button"
            onClick={() => handleSelect('not_sure')}
            className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
              selected === 'not_sure'
                ? 'border border-amber-500 bg-amber-600 text-white shadow-sm'
                : 'border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            NOT SURE
          </button>
        </div>
      </div>

      {selected && (
        <div className="flex items-center gap-2 rounded-lg bg-white p-3 border border-slate-200 text-xs text-slate-700 shadow-2xs">
          <Check className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>
            <strong>Listener assessment recorded:</strong> Marked as &ldquo;{getChoiceLabel(selected)}&rdquo; (stored in session).
          </span>
        </div>
      )}
    </section>
  );
}
