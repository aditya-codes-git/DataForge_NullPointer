import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowDown, AudioWaveform } from 'lucide-react';

const HERO_EXAMPLES = [
  {
    token: 'HTTP 429',
    category: 'Status Code',
    spoken: 'HTTP four two nine',
    outcome: 'CONTROLLED PREFERRED',
  },
  {
    token: '₹2,75,500',
    category: 'Currency',
    spoken: 'two lakh seventy-five thousand five hundred rupees',
    outcome: 'CONTROLLED PREFERRED',
  },
  {
    token: 'Kubernetes',
    category: 'Technical Term',
    spoken: 'Kubernetes (retained clean)',
    outcome: 'RAW PREFERRED',
  },
  {
    token: 'A12B9X7',
    category: 'Identifier',
    spoken: 'A one two B nine X seven',
    outcome: 'CONTROLLED PREFERRED',
  },
  {
    token: '17/09/2026',
    category: 'Date Format',
    spoken: 'the seventeenth of September, twenty twenty-six',
    outcome: 'CONTROLLED PREFERRED',
  },
  {
    token: 'gRPC',
    category: 'Initialism',
    spoken: 'gee are pee see',
    outcome: 'CONTROLLED PREFERRED',
  },
];

export function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % HERO_EXAMPLES.length);
    }, 3200);
    return () => clearInterval(timer);
  }, []);

  const currentExample = HERO_EXAMPLES[currentIndex];

  return (
    <section className="relative pt-4 pb-6 sm:pt-6 sm:pb-8 border-b border-neutral-200 overflow-hidden bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        {/* Horizontal Editorial Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          {/* Left Column: Editorial Headline & Actions */}
          <div className="lg:col-span-7 flex flex-col justify-center max-w-2xl">
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="font-sans font-black text-3xl sm:text-5xl lg:text-[64px] xl:text-[68px] tracking-tight text-neutral-950 uppercase leading-[0.98] select-none"
            >
              <div>TEXT</div>
              <div>CAN BE</div>
              <div>CORRECT.</div>
              <div className="mt-1 sm:mt-1.5 text-neutral-400 font-light italic">
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
            <p className="mt-3 sm:mt-4 font-sans text-sm sm:text-base text-neutral-600 leading-normal font-normal max-w-xl">
              SaySure sits between generated text and TTS. It tests technical terms, currencies, identifiers, dates, and version numbers against your production voice before users hear them.
            </p>

            {/* Action Row */}
            <div className="mt-4 sm:mt-5 flex flex-col sm:flex-row items-start sm:items-center gap-3.5 sm:gap-5">
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 bg-neutral-950 px-5 py-2.5 text-xs uppercase tracking-widest font-mono font-semibold text-white hover:bg-indigo-600 transition-colors shadow-xs"
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
          </div>

          {/* Right Column: Dynamic Multi-Risk Acoustic Flow Showcase */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <div className="border border-neutral-300 bg-neutral-50/70 p-6 sm:p-7 relative">
              {/* Header Bar */}
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-neutral-200 text-[10px] font-mono uppercase tracking-widest text-neutral-400">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-neutral-700 font-semibold">Speech Risk Pipeline</span>
                </div>
                <span>Case {currentIndex + 1} of {HERO_EXAMPLES.length}</span>
              </div>

              {/* Animated Content Transition */}
              <div className="min-h-[140px] flex flex-col justify-between">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentExample.token}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.22, ease: 'easeOut' }}
                    className="space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 bg-neutral-200 text-neutral-700 font-semibold tracking-wider">
                        {currentExample.category}
                      </span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 border ${
                        currentExample.outcome === 'RAW PREFERRED'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : 'bg-indigo-50 text-indigo-800 border-indigo-200'
                      }`}>
                        {currentExample.outcome}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block">
                        Written Input
                      </span>
                      <span className="font-mono text-xl sm:text-2xl font-bold text-neutral-950">
                        {currentExample.token}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-neutral-200/80">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-600 block">
                        Tested Spoken Hypothesis
                      </span>
                      <span className="font-sans text-xs sm:text-sm font-semibold text-indigo-950">
                        "{currentExample.spoken}"
                      </span>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Acoustic Wave Bars */}
              <div className="pt-4 mt-4 border-t border-neutral-200 flex items-center justify-between gap-1.5 h-10">
                {[20, 45, 75, 90, 60, 85, 40, 70, 95, 55, 35, 80, 50, 25].map((height, i) => (
                  <motion.div
                    key={i}
                    className="flex-1 bg-neutral-300 rounded-xs"
                    animate={{
                      height: [`${height * 0.35}%`, `${height}%`, `${height * 0.25}%`],
                      backgroundColor: [
                        'rgba(163, 163, 163, 0.4)',
                        'rgba(79, 70, 229, 0.7)',
                        'rgba(163, 163, 163, 0.4)',
                      ],
                    }}
                    transition={{
                      duration: 1.8 + (i % 3) * 0.25,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: i * 0.05,
                    }}
                  />
                ))}
              </div>

              <div className="mt-2.5 flex items-center justify-between text-[10px] font-mono text-neutral-400">
                <span>Mistv3 // Astra</span>
                <span>Zero Hallucination Guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
