'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, RefreshCw, HelpCircle, Shield, ArrowRight } from 'lucide-react';
import { fadeUp, staggerContainer } from '@/lib/animations';

export function DetectionVsCorrection() {
  const outcomes = [
    {
      title: 'RAW preferred',
      badge: 'KEEP_RAW',
      desc: 'The original written representation naturally sounds clearer in the configured Rime voice. Zero text modification.',
      color: 'border-slate-300 bg-slate-50 text-slate-800',
      tagColor: 'bg-slate-200 text-slate-700',
      example: 'Kubernetes -> "Kubernetes" (handled cleanly by Rime natively)',
    },
    {
      title: 'Controlled preferred',
      badge: 'USE_CONTROLLED',
      desc: 'The candidate representation resolves an acoustic ambiguity, initialism, or awkward phrasing.',
      color: 'border-indigo-200 bg-indigo-50/40 text-indigo-950',
      tagColor: 'bg-indigo-100 text-indigo-800',
      example: 'PostgreSQL v16 -> "Postgres cue ell version sixteen"',
    },
    {
      title: 'Same',
      badge: 'SAME',
      desc: 'Both representations yield identical acoustic output in Rime. The simpler original is retained.',
      color: 'border-emerald-200 bg-emerald-50/30 text-emerald-950',
      tagColor: 'bg-emerald-100 text-emerald-800',
      example: 'Clean natural sentences require no transformation.',
    },
    {
      title: 'Needs review',
      badge: 'NEEDS_REVIEW',
      desc: 'Uncertain proper nouns or ambiguous acronyms are safely flagged for human confirmation.',
      color: 'border-amber-200 bg-amber-50/40 text-amber-950',
      tagColor: 'bg-amber-100 text-amber-800',
      example: 'Novel brand names or unverified domain codes.',
    },
  ];

  return (
    <section className="py-20 md:py-28 bg-white border-t border-slate-200">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-14">
          {/* Big Typography Statement */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-block"
          >
            <div className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter text-slate-900 select-none">
              DETECT <span className="text-indigo-600 font-light">≠</span> CORRECT
            </div>
          </motion.div>

          <h3 className="mt-6 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            A pronunciation risk does not mean the text should be rewritten.
          </h3>
          <p className="mt-3 text-slate-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Many speech systems blindly rewrite detected keywords with arbitrary phonetic respellings. SaySure treats detected risks as an invitation to investigate — never an excuse to mutate text.
          </p>
        </div>

        {/* Visual Pipeline Flow */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-6 sm:p-8 mb-10">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-4">
            Hypothesis Evaluation Architecture
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-center">
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <span className="text-[10px] font-mono text-slate-400 block mb-1">01</span>
              <strong className="text-xs font-semibold text-slate-900 block">RAW Text</strong>
              <span className="text-[11px] text-slate-500 mt-1 block">Always stays in competition</span>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <span className="text-[10px] font-mono text-slate-400 block mb-1">02</span>
              <strong className="text-xs font-semibold text-slate-900 block">Candidate A</strong>
              <span className="text-[11px] text-slate-500 mt-1 block">Spoken dictionary form</span>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <span className="text-[10px] font-mono text-slate-400 block mb-1">03</span>
              <strong className="text-xs font-semibold text-slate-900 block">Candidate B</strong>
              <span className="text-[11px] text-slate-500 mt-1 block">Spelled initialism</span>
            </div>
            <div className="rounded-xl border border-indigo-200 bg-indigo-50/50 p-4">
              <span className="text-[10px] font-mono text-indigo-500 block mb-1">04</span>
              <strong className="text-xs font-semibold text-indigo-950 block">Rime Dual Synth</strong>
              <span className="text-[11px] text-indigo-700 mt-1 block">Identical voice & model</span>
            </div>
            <div className="rounded-xl border border-slate-900 bg-slate-900 p-4 text-white">
              <span className="text-[10px] font-mono text-slate-400 block mb-1">05</span>
              <strong className="text-xs font-semibold text-white block">Decision Engine</strong>
              <span className="text-[11px] text-slate-300 mt-1 block">Evidence-based outcome</span>
            </div>
          </div>
        </div>

        {/* The 4 Legitimate Outcomes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {outcomes.map((item, idx) => (
            <motion.div
              key={item.title}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: idx * 0.1 }}
              className={`rounded-2xl border p-5 flex flex-col justify-between ${item.color}`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded ${item.tagColor}`}>
                    {item.badge}
                  </span>
                </div>
                <h4 className="text-base font-bold text-slate-900 mb-2">{item.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-200/60">
                <span className="text-[11px] font-mono text-slate-500 block">{item.example}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
