'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Compass,
  Sparkles,
  ShieldCheck,
  Cpu,
  GitCompare,
  UserCheck,
  Database,
  ArrowRight,
} from 'lucide-react';
import { fadeUp, staggerContainer } from '@/lib/animations';

const PIPELINE_STEPS = [
  {
    step: '01',
    title: 'Detect',
    icon: Search,
    summary: 'Identify speech risks',
    desc: 'Analyzes input text across 14 risk categories including technical terms, currency symbols, identifiers, version numbers, and ambiguous abbreviations.',
  },
  {
    step: '02',
    title: 'Investigate',
    icon: Compass,
    summary: 'Understand context',
    desc: 'Evaluates the term inside its actual sentence context, considering surrounding punctuation, domain vocabulary, and voice parameters.',
  },
  {
    step: '03',
    title: 'Generate candidates',
    icon: Sparkles,
    summary: '0 to 3 natural hypotheses',
    desc: 'Produces natural-language-first spoken alternatives. Never forces artificial hyphen chains or letter-by-letter spelling. The RAW text is always retained.',
  },
  {
    step: '04',
    title: 'Validate',
    icon: ShieldCheck,
    summary: '10-point integrity check',
    desc: 'Strict checklist guarantees zero hallucinations, numerical preservation, identifier integrity, and entity-version coherence before any audio is requested.',
  },
  {
    step: '05',
    title: 'Synthesize',
    icon: Cpu,
    summary: 'Dual Rime synthesis',
    desc: 'Synthesizes both RAW and validated candidates through the configured Rime TTS endpoint using identical voice, model, language, and audio format.',
  },
  {
    step: '06',
    title: 'Compare',
    icon: GitCompare,
    summary: 'Auditory comparison',
    desc: 'Direct auditory evidence allows developers to compare delivery nuances, syllable cadence, and pronunciation clarity side-by-side.',
  },
  {
    step: '07',
    title: 'Verify',
    icon: UserCheck,
    summary: 'Human confirmation',
    desc: 'Ambiguous or high-consequence proper nouns can be verified by listeners, preventing unproven rewrites from entering production.',
  },
  {
    step: '08',
    title: 'Remember',
    icon: Database,
    summary: 'Voice-specific memory',
    desc: 'Stores verified evidence isolated to specific model and voice configurations so preferences never leak across incompatible voices.',
  },
];

export function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section id="how-it-works" className="py-20 md:py-28 bg-slate-50/50 border-t border-slate-200">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-3xl mb-14">
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
            Pipeline Mechanics
          </span>
          <h2 className="mt-3 text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
            From text to evidence.
          </h2>
          <p className="mt-4 text-slate-600 text-lg leading-relaxed">
            An eight-stage technical pipeline that treats speech quality as an engineering discipline. Every transformation must justify itself through audio evidence.
          </p>
        </div>

        {/* Desktop Pipeline Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {PIPELINE_STEPS.map((item, idx) => {
            const Icon = item.icon;
            const isActive = activeStep === idx;

            return (
              <motion.div
                key={item.step}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.15 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => setActiveStep(idx)}
                className={`cursor-pointer rounded-2xl border p-5 transition-all flex flex-col justify-between ${
                  isActive
                    ? 'border-indigo-600 bg-white shadow-md ring-1 ring-indigo-600'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                      {item.step}
                    </span>
                    <div
                      className={`p-2 rounded-lg ${
                        isActive ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-1">{item.title}</h3>
                  <p className="text-xs font-medium text-indigo-600 mb-2">{item.summary}</p>
                  <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Phase {idx < 4 ? 'Analysis' : 'Audio QA'}</span>
                  {isActive && <span className="text-indigo-600 font-semibold">Active</span>}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
