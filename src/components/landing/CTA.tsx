import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ExternalLink, Sparkles } from 'lucide-react';
import { buttonPress } from '@/lib/animations';

export function CTA() {
  return (
    <section className="py-20 md:py-28 bg-white border-t border-slate-200 relative overflow-hidden">
      {/* Soft radial glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-50/30 to-blue-50/40 pointer-events-none -z-10" />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 mb-6">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Launch-Ready QA Workspace</span>
        </div>

        <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-slate-900 leading-tight max-w-3xl mx-auto">
          Make your voice pipeline testable.
        </h2>

        <p className="mt-5 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto font-normal">
          Know what your TTS will actually say before your users hear it. Test pronunciation, validate integrity, and compare real auditory evidence.
        </p>

        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3.5">
          <motion.div {...buttonPress} className="w-full sm:w-auto">
            <Link
              to="/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-7 py-3.5 text-base font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors"
            >
              <span>Try SaySure</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>

          <motion.div {...buttonPress} className="w-full sm:w-auto">
            <a
              href="https://users.rime.ai/docs"
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-7 py-3.5 text-base font-medium text-slate-700 shadow-2xs hover:bg-slate-50 hover:text-slate-900 transition-colors"
            >
              <span>View documentation</span>
              <ExternalLink className="h-4 w-4" />
            </a>
          </motion.div>
        </div>

        <p className="mt-6 text-xs text-slate-400">
          Powered by Rime TTS neural speech models.
        </p>
      </div>
    </section>
  );
}
