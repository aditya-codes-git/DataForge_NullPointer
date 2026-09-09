'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, ArrowRight } from 'lucide-react';

const CODE_TEXT = `import { SaySure } from '@saysure/sdk';

const saysure = new SaySure({ apiKey: process.env.SAYSURE_KEY });

// 1. Investigate risks and generate competing candidates
const analysis = await saysure.analyze({
  text: "The primary cluster migrated to PostgreSQL v16.",
  domain: "software",
  locale: "en-US",
});

// 2. Synthesize through your configured Rime voice
const speech = await saysure.compare(analysis, {
  voice: "astra",
  model: "mistv3",
});

// 3. Obtain evidence-backed text for delivery
if (speech.decision.status === 'USE_CONTROLLED') {
  console.log(speech.controlledText); 
  // "The primary cluster migrated to Postgres cue ell version sixteen."
}`;

export function DeveloperSection() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(CODE_TEXT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="developers" className="py-24 sm:py-36 bg-white border-b border-neutral-200">
      <div className="mx-auto max-w-6xl px-6 lg:px-12">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 border-b border-neutral-950 pb-4 mb-16">
          <span className="font-mono text-xs uppercase tracking-widest text-neutral-950 font-bold">
            [INTEGRATION ARCHITECTURE]
          </span>
          <span className="font-mono text-xs text-neutral-500">
            Developer SDK &amp; Dual Synthesis API
          </span>
        </div>

        <div className="max-w-3xl mb-12">
          <h2 className="font-sans font-bold text-3xl sm:text-5xl tracking-tight text-neutral-950">
            Drop SaySure between generation and speech.
          </h2>
          <p className="mt-4 font-sans text-lg text-neutral-600 leading-relaxed">
            Plug SaySure directly into your voice pipeline. It returns the audio representation that delivers clear speech in your production voice.
          </p>
        </div>

        {/* Minimal Pipeline Conduit */}
        <div className="border border-neutral-300 bg-neutral-50/50 p-6 sm:p-8 mb-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 font-mono text-xs uppercase tracking-wider">
            <div className="text-center md:text-left">
              <span className="text-[10px] text-neutral-400 block mb-1">01 // SOURCE</span>
              <strong className="text-neutral-950 text-sm font-bold">YOUR APP</strong>
            </div>
            <ArrowRight className="h-4 w-4 text-neutral-400 rotate-90 md:rotate-0" />
            <div className="text-center md:text-left">
              <span className="text-[10px] text-indigo-600 block mb-1">02 // QA LAYER</span>
              <strong className="text-indigo-600 text-sm font-bold">SAYSURE</strong>
            </div>
            <ArrowRight className="h-4 w-4 text-neutral-400 rotate-90 md:rotate-0" />
            <div className="text-center md:text-left">
              <span className="text-[10px] text-neutral-400 block mb-1">03 // ENGINE</span>
              <strong className="text-neutral-950 text-sm font-bold">RIME TTS</strong>
            </div>
            <ArrowRight className="h-4 w-4 text-neutral-400 rotate-90 md:rotate-0" />
            <div className="text-center md:text-left">
              <span className="text-[10px] text-emerald-600 block mb-1">04 // OUTCOME</span>
              <strong className="text-emerald-700 text-sm font-bold">USER EAR</strong>
            </div>
          </div>
        </div>

        {/* Pure Typographic Code Block */}
        <div className="border-2 border-neutral-950 bg-neutral-950 text-white overflow-hidden">
          <div className="flex items-center justify-between border-b border-neutral-800 px-6 py-3 font-mono text-xs text-neutral-400">
            <span>example.ts</span>
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 text-neutral-300 hover:text-white transition-colors"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-bold">COPIED</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>COPY</span>
                </>
              )}
            </button>
          </div>
          <div className="p-6 sm:p-8 font-mono text-xs sm:text-sm text-neutral-200 overflow-x-auto leading-relaxed">
            <pre>
              <code>{CODE_TEXT}</code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}
