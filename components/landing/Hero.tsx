'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Play, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { fadeUp, staggerContainer, buttonPress } from '@/lib/animations';

export function Hero() {
  return (
    <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden">
      {/* Subtle radial ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-indigo-50/50 via-blue-50/20 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 text-center">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center"
        >
          {/* Eyebrow */}
          <motion.div variants={fadeUp} className="mb-4">
            <span className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50/80 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-indigo-700">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 animate-pulse" />
              Voice Delivery QA
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeUp}
            className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-slate-900 leading-[1.05] max-w-4xl"
          >
            Your text can be correct{' '}
            <span className="block mt-1 sm:mt-2 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600">
              and still sound wrong.
            </span>
          </motion.h1>

          {/* Supporting paragraph */}
          <motion.p
            variants={fadeUp}
            className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl leading-relaxed font-normal"
          >
            SaySure tests pronunciation-sensitive text against your actual TTS voice,
            compares candidate representations, and helps you choose what listeners should hear.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={fadeUp}
            className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto"
          >
            <motion.div {...buttonPress} className="w-full sm:w-auto">
              <Link
                href="/dashboard"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-base font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors"
              >
                <span>Try SaySure</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>

            <motion.div {...buttonPress} className="w-full sm:w-auto">
              <a
                href="#how-it-works"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-base font-medium text-slate-700 shadow-2xs hover:bg-slate-50 hover:text-slate-900 transition-colors"
              >
                <span>See how it works</span>
              </a>
            </motion.div>
          </motion.div>

          {/* Trust Statement */}
          <motion.div
            variants={fadeUp}
            className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-500 font-medium"
          >
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>Built for production voice interfaces — no black-box rewrites</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
