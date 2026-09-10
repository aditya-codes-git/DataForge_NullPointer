'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, CheckCircle2, ShieldCheck, Sliders, ExternalLink } from 'lucide-react';
import { fadeUp } from '@/lib/animations';

export function RimeSection() {
  const configs = [
    { label: 'TTS Model', value: 'mistv3', note: 'State-of-the-art conversational neural model' },
    { label: 'Target Voice', value: 'astra', note: 'Configured production voice identity' },
    { label: 'Language', value: 'en-US', note: 'Standard localized acoustic dictionary' },
    { label: 'Audio Format', value: 'audio/mpeg', note: 'Zero transcoding loss or rate shifts' },
  ];

  return (
    <section className="py-20 md:py-28 bg-slate-50/50 border-t border-slate-200">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-3xl mb-14">
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
            Engine Integration
          </span>
          <h2 className="mt-3 text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
            Test against the voice that actually ships.
          </h2>
          <p className="mt-4 text-slate-600 text-lg leading-relaxed">
            Pronunciation cannot be evaluated in the abstract. SaySure runs controlled experiments directly through Rime TTS so every comparison uses your exact production voice configuration.
          </p>
        </div>

        {/* Controlled Experiment Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6 mb-8">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-xs">
                <Cpu className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Controlled Audio Experiment Protocol
                </h3>
                <p className="text-xs text-slate-500">
                  Only the written text representation varies. All acoustic variables remain strictly locked.
                </p>
              </div>
            </div>

            <a
              href="https://users.rime.ai"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900"
            >
              <span>Powered by Rime API</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>

          {/* Config Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {configs.map((c) => (
              <div key={c.label} className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                  {c.label}
                </span>
                <span className="text-base font-mono font-bold text-slate-900 block mb-1">
                  {c.value}
                </span>
                <p className="text-[11px] text-slate-500">{c.note}</p>
              </div>
            ))}
          </div>

          {/* Experiment Rig Rules */}
          <div className="mt-8 rounded-xl bg-indigo-50/40 border border-indigo-100 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="h-5 w-5 text-indigo-600 shrink-0" />
              <span className="text-xs text-indigo-950 font-medium">
                Fair comparison guarantee: Identical sampling rate, bit depth, synthesis latency measurement, and cache lookup.
              </span>
            </div>
            <span className="text-[11px] font-mono font-semibold text-indigo-700 whitespace-nowrap bg-white px-2.5 py-1 rounded-md border border-indigo-200">
              Deterministic Testing
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
