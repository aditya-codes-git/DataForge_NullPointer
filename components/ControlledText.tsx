'use client';

import React from 'react';
import { Transformation } from '@/lib/schemas';
import { ArrowRight, AlertCircle } from 'lucide-react';

interface ControlledTextProps {
  originalText: string;
  controlledText: string;
  changes: Transformation[];
  reviewRequired: boolean;
  reviewReasons?: string[];
}

export function ControlledText({
  originalText,
  controlledText,
  changes,
  reviewRequired,
  reviewReasons,
}: ControlledTextProps) {
  return (
    <section className="space-y-4">
      <h3 className="text-lg font-bold tracking-tight text-slate-900">
        Speech-ready version
      </h3>

      {/* Ambiguous Term / Review Required State */}
      {reviewRequired && (
        <div className="flex items-start justify-between gap-4 rounded-xl border border-amber-200 bg-amber-50/70 p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
            <div>
              <h4 className="text-sm font-semibold text-amber-900">Needs review</h4>
              <p className="mt-0.5 text-xs text-amber-800">
                We couldn't confidently determine how this term should be spoken.
              </p>
              {reviewReasons && reviewReasons.length > 0 && (
                <ul className="mt-1.5 list-inside list-disc text-xs text-amber-900">
                  {reviewReasons.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          <button
            type="button"
            className="rounded-lg border border-amber-300 bg-white px-3 py-1 text-xs font-semibold text-amber-900 shadow-2xs hover:bg-amber-50"
          >
            Review
          </button>
        </div>
      )}

      {/* Two Clean Comparative Boxes */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Original */}
        <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Original
          </span>
          <p className="mt-2 font-sans text-sm leading-relaxed text-slate-700">
            {originalText}
          </p>
        </div>

        {/* Controlled */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">
            Controlled
          </span>
          <p className="mt-2 font-sans text-sm leading-relaxed text-slate-900 font-medium">
            {controlledText}
          </p>
        </div>
      </div>

      {/* What changed? List */}
      {changes.length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            What changed?
          </h4>
          <div className="mt-3 divide-y divide-slate-100">
            {changes.map((change, idx) => (
              <div key={idx} className="py-2.5 first:pt-0 last:pb-0">
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <span className="font-mono font-semibold text-slate-900 line-through decoration-rose-400">
                    {change.original}
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
                  <span className="font-mono font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                    {change.replacement}
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  <strong className="text-slate-600">Reason: </strong>
                  {change.reason}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
