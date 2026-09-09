'use client';

import React from 'react';
import { Transformation, InvestigationDecision } from '@/lib/schemas';
import { ArrowRight, AlertCircle, CheckCircle2, ShieldCheck, HelpCircle } from 'lucide-react';

interface ControlledTextProps {
  originalText: string;
  controlledText: string;
  transformations: Transformation[];
  decision?: InvestigationDecision;
  reviewRequired: boolean;
  reviewReasons?: string[];
}

export function ControlledText({
  originalText,
  controlledText,
  transformations,
  decision,
  reviewRequired,
  reviewReasons,
}: ControlledTextProps) {
  const getDecisionBadge = () => {
    const status = decision?.status || (reviewRequired ? 'NEEDS_REVIEW' : 'USE_CONTROLLED');

    switch (status) {
      case 'USE_CONTROLLED':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
            Controlled candidate recommended
          </span>
        );
      case 'KEEP_RAW':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-800">
            <ShieldCheck className="h-3.5 w-3.5 text-sky-600" />
            Original retained — No change recommended
          </span>
        );
      case 'SAME_AS_RAW':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
            <ShieldCheck className="h-3.5 w-3.5 text-slate-500" />
            Original speech-ready
          </span>
        );
      case 'NEEDS_REVIEW':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800">
            <AlertCircle className="h-3.5 w-3.5 text-amber-600" />
            Needs human review
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-xl font-bold tracking-tight text-slate-900">
            Investigation & Candidates
          </h3>
          <p className="mt-0.5 text-xs text-slate-500">
            We tested the original text and controlled candidate with Rime under identical synthesis parameters.
          </p>
        </div>
        <div>{getDecisionBadge()}</div>
      </div>

      {/* 5-Step Investigation Workflow State */}
      <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-2.5 text-[11px] text-slate-600">
        <span className="font-semibold text-slate-800">QA Flow:</span>
        <span className="flex items-center gap-1 text-emerald-700 font-medium">
          <CheckCircle2 className="h-3 w-3" /> Risk detected
        </span>
        <span className="text-slate-300">→</span>
        <span className="flex items-center gap-1 text-emerald-700 font-medium">
          <CheckCircle2 className="h-3 w-3" /> Candidate testing
        </span>
        <span className="text-slate-300">→</span>
        <span className="flex items-center gap-1 text-emerald-700 font-medium">
          <CheckCircle2 className="h-3 w-3" /> Audio ready
        </span>
        <span className="text-slate-300">→</span>
        <span className="flex items-center gap-1 text-emerald-700 font-medium">
          <CheckCircle2 className="h-3 w-3" /> Audition
        </span>
        <span className="text-slate-300">→</span>
        <span className="flex items-center gap-1 text-indigo-700 font-semibold bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
          Decision
        </span>
      </div>

      {/* Decision rationale callout */}
      {decision && (
        <div
          className={`rounded-xl border p-4 text-xs leading-relaxed ${
            decision.status === 'KEEP_RAW'
              ? 'border-sky-200 bg-sky-50/50 text-sky-900'
              : decision.status === 'NEEDS_REVIEW'
              ? 'border-amber-200 bg-amber-50/60 text-amber-900'
              : 'border-emerald-200 bg-emerald-50/40 text-emerald-950'
          }`}
        >
          <div className="flex items-start gap-2.5">
            <div className="font-semibold">{decision.summary}:</div>
            <div>{decision.reason}</div>
          </div>
        </div>
      )}

      {/* Ambiguous Term / Review Required State Details */}
      {reviewRequired && reviewReasons && reviewReasons.length > 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
            <div>
              <h4 className="text-sm font-semibold text-amber-900">Uncertain pronunciation flagged</h4>
              <p className="mt-0.5 text-xs text-amber-800">
                SaySure does not guess or alter pronunciation without verified evidence:
              </p>
              <ul className="mt-1.5 list-inside list-disc text-xs text-amber-900 space-y-0.5">
                {reviewReasons.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Two Comparative Candidates */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Original */}
        <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Original Written Text
          </span>
          <p className="mt-2 font-sans text-sm leading-relaxed text-slate-700">
            {originalText}
          </p>
        </div>

        {/* Controlled Candidate */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">
              Speech-Ready Candidate
            </span>
            <span className="text-[10px] text-slate-400 font-medium">
              Targeted adjustments only
            </span>
          </div>
          <p className="mt-2 font-sans text-sm leading-relaxed text-slate-900 font-medium">
            {controlledText}
          </p>
        </div>
      </div>

      {/* Result & Why: Token-by-token Actions */}
      {transformations && transformations.length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Item-Level Decisions & QA Results
            </h4>
            <span className="text-[11px] text-slate-400">
              Evidence tested against Rime synthesis
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {transformations.map((item, idx) => (
              <div key={idx} className="py-3 first:pt-1 last:pb-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2 text-sm">
                    {item.action === 'USE_CONTROLLED' ? (
                      <>
                        <span className="font-mono font-semibold text-slate-800 line-through decoration-rose-400">
                          {item.original}
                        </span>
                        <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
                        <span className="font-mono font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          {item.replacement}
                        </span>
                      </>
                    ) : item.action === 'KEEP_RAW' ? (
                      <>
                        <span className="font-mono font-bold text-slate-900">
                          {item.original}
                        </span>
                        <span className="text-xs font-medium text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                          Original retained
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="font-mono font-bold text-slate-900">
                          {item.original}
                        </span>
                        <span className="text-xs font-medium text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          Needs review
                        </span>
                      </>
                    )}
                  </div>

                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                      item.action === 'USE_CONTROLLED'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : item.action === 'KEEP_RAW'
                        ? 'bg-sky-50 text-sky-800 border border-sky-200'
                        : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}
                  >
                    {item.action === 'USE_CONTROLLED'
                      ? '✓ Controlled candidate preferred'
                      : item.action === 'KEEP_RAW'
                      ? '✓ Original retained'
                      : '⚠ Needs review'}
                  </span>
                </div>

                <p className="mt-1.5 text-xs leading-relaxed text-slate-500">
                  <strong className="text-slate-700">Why: </strong>
                  {item.reason}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
