'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, ArrowRight, ShieldCheck, Check } from 'lucide-react';

interface TermDetail {
  id: string;
  word: string;
  category: string;
  spoken: string;
  alternatives: string[];
  audioFile: string;
  rationale: string;
}

const TERMS: Record<string, TermDetail> = {
  pg: {
    id: 'pg',
    word: 'PostgreSQL v16',
    category: 'Structured Domain Term + Version',
    spoken: 'Postgres cue ell version sixteen',
    alternatives: [
      'Postgres cue ell version sixteen',
      'Postgres Q L version sixteen',
      'PostgreSQL version sixteen',
    ],
    audioFile: '/audio/5_postgres_cue_ell_v16.mp3',
    rationale: 'Avoids letter-by-letter spelling of SQL; spells version number sixteen naturally without merging entity and version.',
  },
  grpc: {
    id: 'grpc',
    word: 'gRPC',
    category: 'Mixed-Case Initialism',
    spoken: 'gee are pee see',
    alternatives: ['gee are pee see', 'G R P C', 'gRPC'],
    audioFile: '/audio/2_postgres_cue_ell.mp3',
    rationale: 'Prevents synthetic attempts to pronounce the acronym as a single phonetic syllable ("gerp-see").',
  },
  http: {
    id: 'http',
    word: 'HTTP/2',
    category: 'Protocol Designation',
    spoken: 'HTTP two',
    alternatives: ['HTTP two', 'H T T P two', 'HTTP/2'],
    audioFile: '/audio/7_full_sentence_controlled.mp3',
    rationale: 'Suppresses the mechanical slash pronunciation to match conversational developer conventions.',
  },
};

export function InteractiveSentence() {
  const [selectedTerm, setSelectedTerm] = useState<string>('pg');
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioObj, setAudioObj] = useState<HTMLAudioElement | null>(null);

  const current = TERMS[selectedTerm];

  const handleAudioPlay = () => {
    if (isPlaying && audioObj) {
      audioObj.pause();
      setIsPlaying(false);
      return;
    }

    if (audioObj) audioObj.pause();
    const a = new Audio(current.audioFile);
    a.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    a.onended = () => setIsPlaying(false);
    setAudioObj(a);
  };

  return (
    <section id="interactive" className="py-24 sm:py-36 bg-white border-b border-neutral-200">
      <div className="mx-auto max-w-6xl px-6 lg:px-12">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 border-b border-neutral-950 pb-4 mb-16">
          <span className="font-mono text-xs uppercase tracking-widest text-neutral-950 font-bold">
            [LABORATORY // INTERACTIVE INVESTIGATION]
          </span>
          <span className="font-mono text-xs text-neutral-500">
            Click highlighted terms to inspect candidate generation
          </span>
        </div>

        {/* The Live Sentence */}
        <div className="p-8 sm:p-14 border-2 border-neutral-950 bg-neutral-50/50 mb-8">
          <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 block mb-4">
            CLICK ANY UNDERLINED TERM TO TEST HYPOTHESES
          </span>

          <div className="text-2xl sm:text-4xl md:text-5xl font-sans font-bold text-neutral-950 leading-relaxed">
            The deployment is running on{' '}
            <button
              type="button"
              onClick={() => {
                setSelectedTerm('pg');
                if (audioObj) audioObj.pause();
                setIsPlaying(false);
              }}
              className={`transition-all underline decoration-2 underline-offset-8 ${
                selectedTerm === 'pg'
                  ? 'text-indigo-600 decoration-indigo-600 bg-indigo-50 px-2'
                  : 'text-neutral-950 decoration-neutral-400 hover:text-indigo-600 hover:decoration-indigo-600'
              }`}
            >
              PostgreSQL v16
            </button>{' '}
            with{' '}
            <button
              type="button"
              onClick={() => {
                setSelectedTerm('grpc');
                if (audioObj) audioObj.pause();
                setIsPlaying(false);
              }}
              className={`transition-all underline decoration-2 underline-offset-8 ${
                selectedTerm === 'grpc'
                  ? 'text-indigo-600 decoration-indigo-600 bg-indigo-50 px-2'
                  : 'text-neutral-950 decoration-neutral-400 hover:text-indigo-600 hover:decoration-indigo-600'
              }`}
            >
              gRPC
            </button>{' '}
            over{' '}
            <button
              type="button"
              onClick={() => {
                setSelectedTerm('http');
                if (audioObj) audioObj.pause();
                setIsPlaying(false);
              }}
              className={`transition-all underline decoration-2 underline-offset-8 ${
                selectedTerm === 'http'
                  ? 'text-indigo-600 decoration-indigo-600 bg-indigo-50 px-2'
                  : 'text-neutral-950 decoration-neutral-400 hover:text-indigo-600 hover:decoration-indigo-600'
              }`}
            >
              HTTP/2
            </button>
            .
          </div>
        </div>

        {/* Selected Term Inspector */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="border border-neutral-300 p-8 bg-white grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
          >
            {/* Left Col: Term & Spoken Candidate */}
            <div className="lg:col-span-7">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-mono text-xs uppercase tracking-widest text-indigo-600 font-bold">
                  {current.word}
                </span>
                <span className="text-neutral-300">/</span>
                <span className="font-mono text-xs text-neutral-500">{current.category}</span>
              </div>

              <div className="font-mono text-2xl sm:text-3xl font-bold text-neutral-950 my-4">
                "{current.spoken}"
              </div>

              <p className="font-sans text-sm text-neutral-600 leading-relaxed mb-6">
                {current.rationale}
              </p>

              <div className="space-y-2">
                <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 block mb-1">
                  CANDIDATE HYPOTHESES EVALUATED IN RIME
                </span>
                {current.alternatives.map((alt, idx) => (
                  <div
                    key={alt}
                    className="flex items-center justify-between p-2.5 font-mono text-xs border border-neutral-200 bg-neutral-50"
                  >
                    <span className="text-neutral-900 font-medium">
                      0{idx + 1} — "{alt}"
                    </span>
                    {idx === 0 && (
                      <span className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider flex items-center gap-1">
                        <Check className="h-3 w-3" /> Listener Preferred
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Right Col: Auditory Testing */}
            <div className="lg:col-span-5 border-t lg:border-t-0 lg:border-l border-neutral-200 pt-6 lg:pt-0 lg:pl-8 flex flex-col justify-between h-full">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 block mb-3">
                  ACOUSTIC VERIFICATION
                </span>

                <div className="h-14 flex items-center gap-1 my-4 px-3 bg-neutral-50 border border-neutral-200">
                  {[20, 55, 30, 80, 45, 90, 65, 35, 75, 50, 85, 40, 60, 25].map((h, idx) => (
                    <div
                      key={idx}
                      className={`flex-1 ${
                        isPlaying ? 'bg-indigo-600 animate-pulse' : 'bg-neutral-300'
                      }`}
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-neutral-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleAudioPlay}
                  className="inline-flex items-center gap-2 bg-neutral-950 text-white px-5 py-2.5 font-mono text-xs uppercase tracking-wider font-bold hover:bg-indigo-600 transition-colors"
                >
                  {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                  <span>{isPlaying ? 'Pause' : 'Listen to Candidate'}</span>
                </button>
                <span className="font-mono text-[11px] text-neutral-400">
                  Rime mistv3
                </span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
