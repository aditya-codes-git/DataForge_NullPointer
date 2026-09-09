'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowDown } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative pt-8 pb-12 sm:pt-12 sm:pb-16 border-b border-neutral-200 overflow-hidden bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        {/* Horizontal Editorial Grid (Dominant Headline Left + Generous Whitespace & Unboxed Acoustic Wave Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Left Column: Editorial Headline & Actions (Dominant, ~64-70px desktop) */}
          <div className="lg:col-span-8 flex flex-col justify-center max-w-2xl">
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="font-sans font-black text-3xl sm:text-5xl lg:text-[66px] xl:text-[70px] tracking-tight text-neutral-950 uppercase leading-[0.98] select-none"
            >
              <div>TEXT</div>
              <div>CAN BE</div>
              <div>CORRECT.</div>
              <div className="mt-1.5 sm:mt-2 text-neutral-400 font-light italic">
                BUT SOUND
              </div>
              <div className="flex items-baseline gap-2.5 sm:gap-3 flex-wrap">
                <span>CAN STILL</span>
                <span className="relative inline-block text-indigo-600 font-black">
                  BE WRONG.
                  {/* Subtle animated waveform underline */}
                  <svg
                    className="absolute -bottom-1 sm:-bottom-1.5 left-0 w-full h-2 sm:h-2.5 text-indigo-600 overflow-visible"
                    viewBox="0 0 300 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <motion.path
                      d="M 0 10 Q 25 0, 50 10 T 100 10 T 150 10 T 200 10 T 250 10 T 300 10"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      fill="none"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1.0, delay: 0.3 }}
                    />
                  </svg>
                </span>
              </div>
            </motion.h1>

            {/* Supporting Paragraph */}
            <p className="mt-4 sm:mt-5 font-sans text-base sm:text-lg text-neutral-600 leading-relaxed font-normal max-w-xl">
              SaySure sits between generated text and TTS. It analyzes technical terms, version numbers, and currency formats, testing candidate representations against your actual voice before users hear them.
            </p>

            {/* Action Row */}
            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 bg-neutral-950 px-6 py-3 text-xs uppercase tracking-widest font-mono font-semibold text-white hover:bg-indigo-600 transition-colors shadow-xs"
              >
                <span>Try SaySure</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              <a
                href="#specimen"
                className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-mono text-neutral-500 hover:text-neutral-950 transition-colors"
              >
                <span>Explore Specimen</span>
                <ArrowDown className="h-3.5 w-3.5" />
              </a>
            </div>

            {/* Micro Trust Line */}
            <div className="mt-5 sm:mt-6 flex items-center gap-2 text-[11px] font-mono text-neutral-400">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-neutral-950" />
              <span>Real Rime dual synthesis · Zero forced hyphenation · RAW can win</span>
            </div>
          </div>

          {/* Right Column: Generous Whitespace with Subtle Unboxed Acoustic Waveform */}
          <div className="lg:col-span-4 hidden lg:flex flex-col items-center justify-center pl-4">
            <div className="w-full max-w-xs flex flex-col items-center gap-4 opacity-70 hover:opacity-100 transition-opacity">
              {/* Minimal Unboxed Sound Wave */}
              <div className="w-full flex items-center justify-between gap-1.5 h-24">
                {[14, 28, 45, 72, 90, 60, 85, 40, 68, 95, 52, 34, 78, 48, 22].map((height, i) => (
                  <motion.div
                    key={i}
                    className="w-1 bg-neutral-950/20 rounded-full"
                    animate={{
                      height: [`${height * 0.4}%`, `${height}%`, `${height * 0.3}%`],
                      backgroundColor: [
                        'rgba(10, 10, 10, 0.15)',
                        'rgba(79, 70, 229, 0.45)',
                        'rgba(10, 10, 10, 0.15)',
                      ],
                    }}
                    transition={{
                      duration: 2.2 + (i % 4) * 0.3,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: i * 0.08,
                    }}
                  />
                ))}
              </div>
              <div className="flex items-center gap-2 font-mono text-[10px] tracking-widest uppercase text-neutral-400">
                <span className="h-1 w-1 rounded-full bg-indigo-500 animate-ping" />
                <span>Acoustic Waveform QA</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

