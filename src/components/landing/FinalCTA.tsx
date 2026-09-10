import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export function FinalCTA() {
  return (
    <section className="pt-28 pb-16 sm:pt-40 sm:pb-24 bg-white relative overflow-hidden">
      <div className="mx-auto max-w-6xl px-6 lg:px-12 text-left">
        <span className="font-mono text-xs uppercase tracking-widest text-neutral-400 block mb-6">
          [GET STARTED]
        </span>

        {/* Huge Quiet Editorial Headline */}
        <h2 className="font-sans font-black text-6xl sm:text-8xl md:text-9xl tracking-tighter uppercase text-neutral-950 leading-[0.88] select-none max-w-4xl">
          MAKE YOUR <br />
          VOICE <br />
          TESTABLE.
        </h2>

        {/* Clean Link Action */}
        <div className="mt-12 sm:mt-16 flex flex-col sm:flex-row items-start sm:items-center gap-8">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-3 bg-neutral-950 px-8 py-4 font-mono text-xs uppercase tracking-widest font-bold text-white hover:bg-indigo-600 transition-colors"
          >
            <span>Try SaySure</span>
            <ArrowRight className="h-4 w-4" />
          </Link>

          <span className="font-mono text-xs text-neutral-400">
            Zero setup required · Real Rime dual synthesis
          </span>
        </div>

        {/* Thin Waveform moving beneath that slowly disappears into footer */}
        <div className="mt-20 sm:mt-28 w-full overflow-hidden">
          <svg
            className="w-full h-8 text-neutral-300"
            viewBox="0 0 1000 30"
            preserveAspectRatio="none"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <motion.path
              d="M 0 15 Q 50 0, 100 15 T 200 15 T 300 15 T 400 15 T 500 15 T 600 15 T 700 15 T 800 15 T 900 15 T 1000 15"
              stroke="currentColor"
              strokeWidth="1.5"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: 'easeInOut' }}
            />
          </svg>
        </div>
      </div>
    </section>
  );
}
