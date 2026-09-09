'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Terminal, Copy, Check, ArrowRight, Code2 } from 'lucide-react';
import { buttonPress } from '@/lib/animations';

const CODE_SNIPPET = `import { SaySure } from '@saysure/sdk';

const saysure = new SaySure({ apiKey: process.env.SAYSURE_KEY });

// 1. Detect risks and generate candidates in sentence context
const analysis = await saysure.analyze({
  text: "The deployment is running on PostgreSQL v16 with gRPC.",
  domain: "software",
  locale: "en-US",
});

// 2. Synthesize RAW and candidates through Rime
const speech = await saysure.compare(analysis, {
  voice: "astra",
  model: "mistv3",
});

// 3. Obtain evidence-backed spoken text
console.log(speech.decision.status); // "USE_CONTROLLED"
console.log(speech.controlledText);   // "...Postgres cue ell version sixteen..."`;

export function DeveloperSection() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(CODE_SNIPPET);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="developers" className="py-20 md:py-28 bg-white border-t border-slate-200">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-3xl mb-14">
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
            Developer Integration
          </span>
          <h2 className="mt-3 text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
            Drop it between generation and speech.
          </h2>
          <p className="mt-4 text-slate-600 text-lg leading-relaxed">
            Integrate SaySure into your existing LLM or voice agent pipeline with minimal code. Inspect risks, generate hypotheses, and compare audio programmatically.
          </p>
        </div>

        {/* Pipeline Architecture Row */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-6 mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="h-10 w-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-mono text-xs font-bold">
              APP
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-900 block">Your LLM or Agent</span>
              <span className="text-[11px] text-slate-500">Generates arbitrary text</span>
            </div>
          </div>

          <ArrowRight className="h-5 w-5 text-slate-400 rotate-90 md:rotate-0" />

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="h-10 w-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-mono text-xs font-bold">
              QA
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-900 block">SaySure Engine</span>
              <span className="text-[11px] text-slate-500">Investigates &amp; validates</span>
            </div>
          </div>

          <ArrowRight className="h-5 w-5 text-slate-400 rotate-90 md:rotate-0" />

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="h-10 w-10 rounded-xl bg-slate-800 text-white flex items-center justify-center font-mono text-xs font-bold">
              TTS
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-900 block">Rime Speech</span>
              <span className="text-[11px] text-slate-500">Controlled dual audio</span>
            </div>
          </div>

          <ArrowRight className="h-5 w-5 text-slate-400 rotate-90 md:rotate-0" />

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="h-10 w-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-mono text-xs font-bold">
              EAR
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-900 block">Real Listener</span>
              <span className="text-[11px] text-slate-500">Hears intended speech</span>
            </div>
          </div>
        </div>

        {/* Code Snippet Display */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/90 px-4 py-3">
            <div className="flex items-center gap-2">
              <Code2 className="h-4 w-4 text-indigo-400" />
              <span className="text-xs font-mono text-slate-300">pipeline.ts</span>
            </div>
            <motion.button
              {...buttonPress}
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 rounded-md bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy Code</span>
                </>
              )}
            </motion.button>
          </div>

          <div className="p-5 font-mono text-xs text-slate-300 overflow-x-auto leading-relaxed">
            <pre className="text-slate-200">
              <code>{CODE_SNIPPET}</code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}
