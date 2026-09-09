'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause } from 'lucide-react';

const RIBBON_ITEMS = [
  {
    raw: 'PostgreSQL v16',
    risk: 'Ambiguous Initialism & Version',
    candidate: 'Postgres cue ell version sixteen',
    voice: 'mistv3 (astra)',
    decision: 'CONTROLLED PREFERRED',
    decisionType: 'controlled',
    audioFile: '/audio/5_postgres_cue_ell_v16.mp3',
  },
  {
    raw: 'HTTP/2',
    risk: 'Protocol Slash Convention',
    candidate: 'HTTP two',
    voice: 'mistv3 (astra)',
    decision: 'CONTROLLED PREFERRED',
    decisionType: 'controlled',
    audioFile: '/audio/7_full_sentence_controlled.mp3',
  },
  {
    raw: 'Kubernetes',
    risk: 'Known Domain Term',
    candidate: 'Kubernetes',
    voice: 'mistv3 (astra)',
    decision: 'RAW PREFERRED',
    decisionType: 'raw',
    audioFile: '/audio/1_postgresql_raw.mp3',
  },
  {
    raw: '₹2,75,500',
    risk: 'Regional Currency Grouping',
    candidate: 'two lakh seventy-five thousand five hundred rupees',
    voice: 'mistv3 (astra)',
    decision: 'CONTROLLED PREFERRED',
    decisionType: 'controlled',
    audioFile: '/audio/7_full_sentence_controlled.mp3',
  },
  {
    raw: 'gRPC',
    risk: 'Mixed-Case Protocol',
    candidate: 'gee are pee see',
    voice: 'mistv3 (astra)',
    decision: 'CONTROLLED PREFERRED',
    decisionType: 'controlled',
    audioFile: '/audio/2_postgres_cue_ell.mp3',
  },
];

export function SpeechRibbon() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  const active = RIBBON_ITEMS[selectedIdx];

  useEffect(() => {
    // Auto cycle every 6 seconds if not manually playing
    if (isPlaying) return;
    const interval = setInterval(() => {
      setSelectedIdx((prev) => (prev + 1) % RIBBON_ITEMS.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleAudioToggle = () => {
    if (!active.audioFile) return;
    if (isPlaying && audio) {
      audio.pause();
      setIsPlaying(false);
    } else {
      if (audio) audio.pause();
      const newAudio = new Audio(active.audioFile);
      newAudio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
      newAudio.onended = () => setIsPlaying(false);
      setAudio(newAudio);
    }
  };

  return (
    <section className="py-20 md:py-32 bg-neutral-950 text-white overflow-hidden relative">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        {/* Header Label */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-6 mb-12">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-indigo-400 block mb-1">
              [THE SPEECH RIBBON]
            </span>
            <h2 className="font-sans text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Watch text transform into sound.
            </h2>
          </div>

          {/* Interactive Token Selector */}
          <div className="flex items-center gap-2 overflow-x-auto py-1">
            {RIBBON_ITEMS.map((item, idx) => (
              <button
                key={item.raw}
                type="button"
                onClick={() => {
                  setSelectedIdx(idx);
                  if (audio) {
                    audio.pause();
                    setIsPlaying(false);
                  }
                }}
                className={`px-3 py-1.5 font-mono text-xs uppercase tracking-wider transition-all rounded-none whitespace-nowrap ${
                  idx === selectedIdx
                    ? 'bg-white text-neutral-950 font-bold'
                    : 'text-neutral-400 hover:text-white border border-neutral-800'
                }`}
              >
                {item.raw}
              </button>
            ))}
          </div>
        </div>

        {/* The Continuous Transformation Ribbon */}
        <div className="relative border border-neutral-800 bg-neutral-900/60 p-6 sm:p-12">
          {/* Progress Guide Line */}
          <div className="hidden lg:block absolute top-1/2 left-8 right-8 h-px bg-neutral-800 -translate-y-1/2 -z-0" />

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-4 relative z-10">
            {/* Step 1: Raw Text */}
            <div className="flex flex-col justify-between h-44 border-l border-neutral-800 lg:border-l-0 lg:border-t lg:border-neutral-800 pl-4 lg:pl-0 lg:pt-4">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-500 block mb-2">
                  01 // WRITTEN FORM
                </span>
                <motion.div
                  key={`raw-${active.raw}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="font-mono text-2xl font-bold text-white tracking-tight"
                >
                  {active.raw}
                </motion.div>
              </div>
              <span className="font-mono text-[11px] text-neutral-500">
                Input characters
              </span>
            </div>

            {/* Step 2: Risk Flagged */}
            <div className="flex flex-col justify-between h-44 border-l border-neutral-800 lg:border-l-0 lg:border-t lg:border-neutral-800 pl-4 lg:pl-0 lg:pt-4">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-amber-400 block mb-2">
                  02 // RISK IDENTIFIED
                </span>
                <motion.div
                  key={`risk-${active.raw}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="font-sans text-base font-semibold text-amber-300 leading-snug"
                >
                  {active.risk}
                </motion.div>
              </div>
              <span className="font-mono text-[11px] text-neutral-500">
                Investigation triggered
              </span>
            </div>

            {/* Step 3: Candidate Hypotheses */}
            <div className="flex flex-col justify-between h-44 border-l border-neutral-800 lg:border-l-0 lg:border-t lg:border-neutral-800 pl-4 lg:pl-0 lg:pt-4">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-indigo-400 block mb-2">
                  03 // CANDIDATE
                </span>
                <motion.div
                  key={`cand-${active.raw}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="font-mono text-sm font-bold text-indigo-200 leading-snug"
                >
                  "{active.candidate}"
                </motion.div>
              </div>
              <span className="font-mono text-[11px] text-neutral-500">
                Zero forced hyphenation
              </span>
            </div>

            {/* Step 4: Rime Audio Waveform */}
            <div className="flex flex-col justify-between h-44 border-l border-neutral-800 lg:border-l-0 lg:border-t lg:border-neutral-800 pl-4 lg:pl-0 lg:pt-4">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 block mb-2">
                  04 // RIME SPEECH (ASTRA)
                </span>
                {/* Real SVG Oscillating Waveform */}
                <div className="h-10 flex items-center gap-1 my-2">
                  {[30, 70, 45, 90, 60, 85, 40, 95, 75, 50, 65, 35, 80, 55, 30].map((h, idx) => (
                    <div
                      key={idx}
                      className={`flex-1 rounded-none transition-all duration-300 ${
                        isPlaying ? 'bg-indigo-400 animate-pulse' : 'bg-neutral-700'
                      }`}
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
              </div>
              <button
                type="button"
                onClick={handleAudioToggle}
                className="inline-flex items-center gap-1.5 font-mono text-[11px] text-indigo-400 hover:text-white uppercase tracking-wider text-left"
              >
                {isPlaying ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                <span>{isPlaying ? 'Pause Audio' : 'Play Live Rime Audio'}</span>
              </button>
            </div>

            {/* Step 5: Final Evidentiary Decision */}
            <div className="flex flex-col justify-between h-44 border-l border-neutral-800 lg:border-l-0 lg:border-t lg:border-neutral-800 pl-4 lg:pl-0 lg:pt-4">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-emerald-400 block mb-2">
                  05 // DECISION
                </span>
                <motion.div
                  key={`dec-${active.raw}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`font-mono text-sm font-black tracking-tight ${
                    active.decisionType === 'raw' ? 'text-white' : 'text-emerald-400'
                  }`}
                >
                  {active.decision}
                </motion.div>
              </div>
              <span className="font-mono text-[11px] text-neutral-500">
                Auditory provenance stored
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
