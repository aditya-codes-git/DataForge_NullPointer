'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles, AlertCircle, Volume2, Info } from 'lucide-react';
import { fadeUp } from '@/lib/animations';

export function PronunciationSection() {
  const [selectedRep, setSelectedRep] = useState(0);

  const representations = [
    {
      label: 'Candidate 1',
      text: 'Postgres cue ell version sixteen',
      type: 'Natural Spoken Words',
      status: 'High Clarity in Rime',
      bars: [30, 60, 45, 80, 70, 95, 85, 60, 40, 25],
    },
    {
      label: 'Candidate 2',
      text: 'Postgres Q L version sixteen',
      type: 'Initialism Tokenized',
      status: 'Tested in mistv3',
      bars: [25, 50, 40, 75, 65, 85, 75, 55, 35, 20],
    },
    {
      label: 'Candidate 3',
      text: 'PostgreSQL version sixteen',
      type: 'Original Name + Spoken Num',
      status: 'Evaluated Baseline',
      bars: [20, 40, 30, 65, 50, 70, 60, 45, 25, 15],
    },
  ];

  return (
    <section id="intelligence" className="py-20 md:py-28 bg-white border-t border-slate-200">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-3xl mb-14">
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
            Pronunciation Intelligence
          </span>
          <h2 className="mt-3 text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
            The three-way representation model.
          </h2>
          <p className="mt-4 text-slate-600 text-lg leading-relaxed">
            Speech QA requires separating what is written from how humans describe it, and from what exact string triggers the intended pronunciation in a neural TTS engine.
          </p>
        </div>

        {/* 3-Way Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Card 1: Original Written Form */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              01 — Original Written Form
            </span>
            <div className="mt-4 text-2xl font-bold font-mono text-slate-900">
              PostgreSQL v16
            </div>
            <p className="mt-3 text-xs text-slate-500 leading-relaxed">
              The exact raw string supplied by user, API caller, or LLM output. Preserved for evaluation.
            </p>
          </div>

          {/* Card 2: Canonical Spoken Form */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              02 — Canonical Spoken Form
            </span>
            <div className="mt-4 text-xl font-bold text-slate-900 font-sans">
              "Postgres cue ell, version sixteen"
            </div>
            <p className="mt-3 text-xs text-slate-500 leading-relaxed">
              Human-readable linguistic description of conventional speech. Not automatically the best TTS input.
            </p>
          </div>

          {/* Card 3: TTS Representations */}
          <div className="rounded-2xl border border-indigo-200 bg-indigo-50/30 p-6">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-700">
              03 — TTS Representations
            </span>
            <div className="mt-4 text-sm font-mono text-indigo-950 font-medium">
              Exact strings sent to Rime to test actual delivery.
            </div>
            <p className="mt-3 text-xs text-indigo-700/80 leading-relaxed">
              Hypotheses systematically tested against the configured model and voice.
            </p>
          </div>
        </div>

        {/* Interactive Representation Selector */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Explore Candidate Hypotheses
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Click any candidate to preview its TTS string and synthesis profile.
              </p>
            </div>
            <div className="inline-flex items-center gap-1 text-xs text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md font-medium">
              <Info className="h-3.5 w-3.5" /> Canonical ≠ Best TTS Input
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {representations.map((rep, idx) => (
              <button
                key={rep.label}
                type="button"
                onClick={() => setSelectedRep(idx)}
                className={`text-left p-4 rounded-xl border transition-all ${
                  selectedRep === idx
                    ? 'border-indigo-600 bg-indigo-50/40 ring-1 ring-indigo-600'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-semibold text-slate-500">{rep.label}</span>
                  <span className="text-[10px] font-medium bg-white border border-slate-200 px-2 py-0.5 rounded text-slate-700">
                    {rep.type}
                  </span>
                </div>
                <div className="font-mono text-xs text-slate-900 font-bold mb-3">
                  "{rep.text}"
                </div>

                {/* Mini Waveform */}
                <div className="h-6 flex items-center gap-1 mb-3 px-1 rounded bg-slate-50">
                  {rep.bars.map((h, i) => (
                    <div
                      key={i}
                      className={`flex-1 rounded-full ${
                        selectedRep === idx ? 'bg-indigo-600' : 'bg-slate-300'
                      }`}
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                  <span>{rep.status}</span>
                  {selectedRep === idx && <Check className="h-3.5 w-3.5 text-indigo-600" />}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
