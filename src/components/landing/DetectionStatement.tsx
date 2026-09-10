import React from 'react';
import { motion } from 'framer-motion';

export function DetectionStatement() {
  const outcomes = [
    { label: 'RAW PREFERRED', note: 'Original text retained when native voice delivery is clear' },
    { label: 'CONTROLLED PREFERRED', note: 'Candidate selected when acoustic evidence proves superiority' },
    { label: 'SAME', note: 'Both versions sound identical; simplest text wins' },
    { label: 'NEEDS REVIEW', note: 'Ambiguous proper nouns flagged for listener confirmation' },
  ];

  return (
    <section className="py-28 sm:py-40 bg-neutral-950 text-white border-y border-neutral-900 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-12 text-center">
        {/* Massive Typographic Statement */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="select-none"
        >
          <div className="font-sans font-black text-6xl sm:text-9xl md:text-[11rem] tracking-tighter uppercase leading-[0.85] text-white">
            DETECTION
          </div>
          <div className="font-sans font-thin text-6xl sm:text-8xl md:text-9xl text-indigo-500 my-2 sm:my-4">
            ≠
          </div>
          <div className="font-sans font-black text-6xl sm:text-9xl md:text-[11rem] tracking-tighter uppercase leading-[0.85] text-white">
            CORRECTION
          </div>
        </motion.div>

        {/* Minimal Editorial Subtext */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-12 sm:mt-16 max-w-2xl mx-auto"
        >
          <p className="font-sans text-xl sm:text-2xl text-neutral-400 font-normal leading-relaxed">
            A speech risk tells us to investigate. It does not tell us to rewrite. The original text is always an active candidate — and it is always permitted to win.
          </p>
        </motion.div>

        {/* Visual Pipeline Demonstration Using HTTP 429 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-14 max-w-4xl mx-auto border border-neutral-800 bg-neutral-900/60 p-6 sm:p-8 text-left font-mono"
        >
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800 text-[10px] uppercase tracking-widest text-neutral-400">
            <span>Case Study: Protocol Status Code</span>
            <span className="text-indigo-400 font-bold">Investigation: HTTP 429</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 text-xs">
            <div className="border border-neutral-800 p-4 bg-neutral-950">
              <span className="text-[10px] text-neutral-500 uppercase tracking-wider block mb-1">
                01 // RAW INPUT
              </span>
              <span className="text-white font-bold block text-sm">"HTTP 429"</span>
              <p className="text-[11px] text-neutral-500 mt-2">
                Evaluated directly as written without preemptive distortion
              </p>
            </div>

            <div className="border border-neutral-800 p-4 bg-neutral-950">
              <span className="text-[10px] text-indigo-400 uppercase tracking-wider block mb-1">
                02 // CANDIDATE
              </span>
              <span className="text-indigo-300 font-bold block text-sm">"HTTP four two nine"</span>
              <p className="text-[11px] text-neutral-500 mt-2">
                Natural spoken representation tested side-by-side
              </p>
            </div>

            <div className="border border-neutral-800 p-4 bg-neutral-950">
              <span className="text-[10px] text-neutral-500 uppercase tracking-wider block mb-1">
                03 // RIME DUAL TEST
              </span>
              <span className="text-white font-bold block text-sm">Mistv3 // Astra</span>
              <p className="text-[11px] text-neutral-500 mt-2">
                Identical audio codec, voice, and sampling parameters
              </p>
            </div>

            <div className="border border-emerald-900/60 p-4 bg-emerald-950/30">
              <span className="text-[10px] text-emerald-400 uppercase tracking-wider block mb-1">
                04 // DECISION
              </span>
              <span className="text-emerald-400 font-bold block text-sm">CONTROLLED WINS</span>
              <p className="text-[11px] text-neutral-400 mt-2">
                Proven to eliminate numeric slurring in production audio
              </p>
            </div>
          </div>
        </motion.div>

        {/* The 4 Legitimate States */}
        <div className="mt-16 sm:mt-24 pt-12 border-t border-neutral-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-left">
          {outcomes.map((item, i) => (
            <div key={item.label} className="border-l-2 border-neutral-700 pl-4">
              <span className="font-mono text-[10px] text-neutral-500 uppercase tracking-widest block mb-1">
                OUTCOME 0{i + 1}
              </span>
              <strong className="font-mono text-sm font-bold text-white block mb-1">
                {item.label}
              </strong>
              <p className="font-sans text-xs text-neutral-400 leading-normal">
                {item.note}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
