'use client';

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
