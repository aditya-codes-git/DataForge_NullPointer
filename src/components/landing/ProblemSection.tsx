'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, ArrowRight, VolumeX, Volume2, HelpCircle } from 'lucide-react';
import { fadeUp, staggerContainer } from '@/lib/animations';

const PROBLEM_CASES = [
  {
    id: 'code',
    written: 'HTTP 429',
    category: 'Protocol Status Code',
    naiveTTS: 'H-T-T-P four hundred twenty-nine',
    listenerHears: 'Ambiguous grouping as large count instead of individual digits',
    controlledCandidate: 'HTTP four two nine',
    note: 'Status codes require discrete digit pronunciation in conversational audio.',
  },
  {
    id: 'proto',
    written: 'HTTP/2',
    category: 'Protocol Version',
    naiveTTS: 'H-T-T-P slash two',
    listenerHears: 'Unnatural literal word "slash" spoken aloud',
    controlledCandidate: 'HTTP two',
    note: 'Protocol conventions skip the slash in human speech.',
  },
  {
    id: 'grpc',
    written: 'gRPC',
    category: 'Protocol Initialism',
    naiveTTS: 'gerp-see',
    listenerHears: 'Garbled attempt at phonetic word pronunciation',
    controlledCandidate: 'gee are pee see',
    note: 'Lowercase prefix confuses standard pronunciation dictionaries.',
  },
  {
    id: 'curr',
    written: '₹2,75,500',
    category: 'Currency & Numbering',
    naiveTTS: 'currency symbol two hundred seventy five thousand...',
    listenerHears: 'Incorrect Western grouping instead of Indian lakh scale',
    controlledCandidate: 'two lakh seventy-five thousand five hundred rupees',
    note: 'Locale-specific currency numbering demands localized representation.',
  },
  {
    id: 'date',
    written: '17/09/2026',
    category: 'Ambiguous Date',
    naiveTTS: 'seventeen slash zero nine slash twenty twenty-six',
    listenerHears: 'Mechanical slash recitation without month resolution',
    controlledCandidate: 'September seventeenth, twenty twenty-six',
    note: 'Ambiguous separator leads to mechanical speech delivery.',
  },
];

export function ProblemSection() {
  const [activeCase, setActiveCase] = useState(0);
  const current = PROBLEM_CASES[activeCase];

  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-3xl mb-14">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Text is not speech
          </span>
          <h2 className="mt-3 text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
            TTS doesn't read your intent. <br className="hidden sm:inline" />
            It reads your representation.
          </h2>
          <p className="mt-4 text-lg text-slate-600 leading-relaxed font-normal">
            Neural TTS engines are trained on text, but real-world text is full of abbreviations, version numbers, protocols, and regional currency formats.
            <strong className="text-slate-900 font-semibold block sm:inline sm:ml-1">
              The same text can sound perfect in one voice and awkward in another.
            </strong>
          </p>
        </div>

        {/* Interactive Problem Explorer */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5 sm:p-8">
          {/* Case Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 border-b border-slate-200">
            {PROBLEM_CASES.map((item, idx) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveCase(idx)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all whitespace-nowrap ${
                  idx === activeCase
                    ? 'bg-slate-900 text-white font-medium shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                {item.written}
              </button>
            ))}
          </div>

          {/* Three-Stage Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Step 1: Written Form */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  01 — Written Form
                </span>
                <div className="mt-3 text-2xl font-bold font-mono text-slate-900">
                  {current.written}
                </div>
                <span className="inline-block mt-2 text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  {current.category}
                </span>
              </div>
              <p className="mt-4 text-xs text-slate-500 border-t border-slate-100 pt-3">
                Valid in documentation or code.
              </p>
            </div>

            {/* Step 2: Naive TTS Output */}
            <div className="rounded-xl border border-rose-200 bg-rose-50/30 p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-rose-600">
                    02 — Naive TTS Interpretation
                  </span>
                  <VolumeX className="h-4 w-4 text-rose-500" />
                </div>
                <div className="mt-3 text-lg font-mono text-rose-950 bg-white/80 border border-rose-200 rounded-lg p-3">
                  "{current.naiveTTS}"
                </div>
              </div>
              <p className="mt-4 text-xs text-rose-700 border-t border-rose-100 pt-3 font-medium">
                {current.listenerHears}
              </p>
            </div>

            {/* Step 3: What SaySure Investigates */}
            <div className="rounded-xl border border-indigo-200 bg-indigo-50/40 p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-700">
                    03 — Tested Representation
                  </span>
                  <Volume2 className="h-4 w-4 text-indigo-600" />
                </div>
                <div className="mt-3 text-lg font-mono text-indigo-950 bg-white border border-indigo-200 rounded-lg p-3">
                  "{current.controlledCandidate}"
                </div>
              </div>
              <p className="mt-4 text-xs text-indigo-700 border-t border-indigo-100 pt-3 font-medium">
                Verified with configured voice before shipping.
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-xl bg-white border border-slate-200 p-4 text-xs text-slate-600 flex items-start gap-3">
            <HelpCircle className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900 font-semibold">Important architectural principle: </strong>
              SaySure does not assume the original is wrong. Some voices natively handle "{current.written}" cleanly; other voices require "{current.controlledCandidate}". SaySure synthesizes both so developers make decisions based on real sound, not guesswork.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
