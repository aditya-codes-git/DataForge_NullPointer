'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause } from 'lucide-react';

export function ScenesStory() {
  const [activeCand, setActiveCand] = useState(0);
  const [playingTrack, setPlayingTrack] = useState<'raw' | 'controlled' | null>(null);

  const candidates = [
    { text: 'Postgres cue ell', desc: 'Natural spoken words' },
    { text: 'Postgres Q L', desc: 'Acronym tokenized' },
    { text: 'PostgreSQL', desc: 'Original baseline' },
  ];

  const togglePlay = (track: 'raw' | 'controlled') => {
    const src = track === 'raw' ? '/audio/1_postgresql_raw.mp3' : '/audio/2_postgres_cue_ell.mp3';
    const audio = new Audio(src);
    setPlayingTrack(track);
    audio.play().catch(() => setPlayingTrack(null));
    audio.onended = () => setPlayingTrack(null);
  };

  return (
    <div id="story" className="border-b border-neutral-200">
      {/* ======================================================
          SCENE 1: TEXT
          ====================================================== */}
      <section className="py-24 sm:py-36 bg-white border-b border-neutral-200">
        <div className="mx-auto max-w-6xl px-6 lg:px-12">
          <span className="font-mono text-xs uppercase tracking-widest text-neutral-400 block mb-6">
            [SCENE 01 // TEXT]
          </span>
          <h2 className="font-sans font-black text-4xl sm:text-7xl md:text-8xl tracking-tighter text-neutral-950 uppercase leading-[0.9] max-w-5xl">
            Written language <br />
            <span className="text-neutral-400 font-light">hides pronunciation</span> <br />
            risk.
          </h2>
          <p className="mt-8 sm:mt-12 text-lg sm:text-2xl text-neutral-600 font-sans max-w-2xl leading-relaxed font-normal">
            To an LLM or database, text is identical whether read with the eye or spoken aloud. But human speech demands cadence, syllable boundaries, and unwritten domain conventions.
          </p>
        </div>
      </section>

      {/* ======================================================
          SCENE 2: RISK
          ====================================================== */}
      <section className="py-24 sm:py-36 bg-neutral-50/70 border-b border-neutral-200">
        <div className="mx-auto max-w-6xl px-6 lg:px-12">
          <span className="font-mono text-xs uppercase tracking-widest text-amber-600 block mb-6">
            [SCENE 02 // RISK]
          </span>
          <p className="font-mono text-xs uppercase tracking-widest text-neutral-500 mb-4">
            Notice what happens inside an ordinary production sentence:
          </p>

          <div className="text-3xl sm:text-5xl md:text-6xl font-sans font-bold text-neutral-950 leading-tight">
            The service failed connecting to{' '}
            <span className="text-amber-600 underline decoration-amber-400 decoration-wavy underline-offset-8">
              PostgreSQL
            </span>{' '}
            over{' '}
            <span className="text-amber-600 underline decoration-amber-400 decoration-wavy underline-offset-8">
              HTTP/2
            </span>{' '}
            after transferring{' '}
            <span className="text-amber-600 underline decoration-amber-400 decoration-wavy underline-offset-8">
              ₹1,25,000
            </span>
            .
          </div>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-8 pt-8 border-t border-neutral-200 font-mono text-xs">
            <div>
              <span className="text-amber-600 font-bold block mb-1">PostgreSQL</span>
              <span className="text-neutral-500">Naive TTS: "post-gree-ess-cue-ell"</span>
            </div>
            <div>
              <span className="text-amber-600 font-bold block mb-1">HTTP/2</span>
              <span className="text-neutral-500">Naive TTS: "H-T-T-P slash two"</span>
            </div>
            <div>
              <span className="text-amber-600 font-bold block mb-1">₹1,25,000</span>
              <span className="text-neutral-500">Naive TTS: "currency one twenty five thousand"</span>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================
          SCENE 3: INVESTIGATE
          ====================================================== */}
      <section className="py-24 sm:py-36 bg-white border-b border-neutral-200">
        <div className="mx-auto max-w-6xl px-6 lg:px-12">
          <span className="font-mono text-xs uppercase tracking-widest text-indigo-600 block mb-6">
            [SCENE 03 // INVESTIGATE]
          </span>

          <div className="mb-8">
            <span className="font-mono text-xs uppercase tracking-widest text-neutral-400 block mb-2">
              TARGET TERM EXPANSION
            </span>
            <div className="text-4xl sm:text-6xl font-mono font-black text-neutral-950">
              PostgreSQL
            </div>
          </div>

          <p className="font-sans text-lg text-neutral-600 max-w-2xl mb-8">
            SaySure doesn't force a single hardcoded respelling. It generates competing natural candidate hypotheses:
          </p>

          <div className="space-y-4 max-w-3xl font-mono">
            {candidates.map((c, i) => (
              <button
                key={c.text}
                type="button"
                onClick={() => setActiveCand(i)}
                className={`w-full text-left p-6 border transition-all ${
                  activeCand === i
                    ? 'border-indigo-600 bg-indigo-50/30 text-indigo-950'
                    : 'border-neutral-200 bg-neutral-50 text-neutral-700 hover:border-neutral-400'
                }`}
              >
                <div className="flex items-center justify-between text-base sm:text-xl font-bold">
                  <span>Candidate {i + 1}: "{c.text}"</span>
                  <span className="text-xs uppercase tracking-widest font-normal text-neutral-500">
                    {c.desc}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ======================================================
          SCENE 4: HEAR
          ====================================================== */}
      <section className="py-24 sm:py-36 bg-neutral-950 text-white border-b border-neutral-900">
        <div className="mx-auto max-w-6xl px-6 lg:px-12">
          <span className="font-mono text-xs uppercase tracking-widest text-neutral-500 block mb-6">
            [SCENE 04 // HEAR]
          </span>

          <div className="max-w-2xl mb-12">
            <h3 className="font-sans text-3xl sm:text-5xl font-bold tracking-tight text-white">
              The auditory experiment.
            </h3>
            <p className="mt-4 font-sans text-neutral-400 text-base sm:text-lg">
              The screen becomes quiet. Text recedes. Two real neural speech waveforms emerge from Rime.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {/* RAW Waveform */}
            <div className="border border-neutral-800 p-8 bg-neutral-900/40">
              <div className="flex items-center justify-between font-mono text-xs text-neutral-400 mb-6">
                <span>RAW AUDIO</span>
                <span>RIME ASTRA</span>
              </div>
              <div className="h-16 flex items-center gap-1 my-6">
                {[20, 35, 60, 25, 75, 40, 80, 60, 30, 45, 65, 35, 25, 20].map((h, i) => (
                  <div
                    key={i}
                    className={`flex-1 ${
                      playingTrack === 'raw' ? 'bg-white animate-pulse' : 'bg-neutral-700'
                    }`}
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={() => togglePlay('raw')}
                className="font-mono text-xs uppercase tracking-widest text-white hover:text-indigo-400 inline-flex items-center gap-2"
              >
                {playingTrack === 'raw' ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                <span>{playingTrack === 'raw' ? 'Pause' : 'Play RAW'}</span>
              </button>
            </div>

            {/* CONTROLLED Waveform */}
            <div className="border border-indigo-600 p-8 bg-indigo-950/20">
              <div className="flex items-center justify-between font-mono text-xs text-indigo-400 mb-6">
                <span>CONTROLLED AUDIO</span>
                <span>RIME ASTRA</span>
              </div>
              <div className="h-16 flex items-center gap-1 my-6">
                {[30, 55, 80, 45, 90, 65, 95, 75, 50, 85, 95, 60, 40, 30].map((h, i) => (
                  <div
                    key={i}
                    className={`flex-1 ${
                      playingTrack === 'controlled' ? 'bg-indigo-400 animate-pulse' : 'bg-indigo-700'
                    }`}
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={() => togglePlay('controlled')}
                className="font-mono text-xs uppercase tracking-widest text-indigo-400 hover:text-white inline-flex items-center gap-2"
              >
                {playingTrack === 'controlled' ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                <span>{playingTrack === 'controlled' ? 'Pause' : 'Play Controlled'}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================
          SCENE 5: DECIDE
          ====================================================== */}
      <section className="py-24 sm:py-36 bg-white">
        <div className="mx-auto max-w-6xl px-6 lg:px-12">
          <span className="font-mono text-xs uppercase tracking-widest text-emerald-600 block mb-6">
            [SCENE 05 // DECIDE]
          </span>

          <div className="max-w-4xl">
            <div className="font-mono text-xs uppercase tracking-widest text-neutral-400 mb-4">
              THE VERDICT
            </div>
            <h3 className="font-sans font-black text-4xl sm:text-7xl md:text-8xl tracking-tighter text-neutral-950 uppercase leading-none">
              CONTROLLED <br />
              <span className="text-emerald-600">PREFERRED.</span>
            </h3>
            <p className="mt-8 font-sans text-xl text-neutral-600 leading-relaxed max-w-2xl">
              "Postgres cue ell" demonstrably reduced acoustic ambiguity in the configured voice. The provenance record is saved to evidence memory.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
