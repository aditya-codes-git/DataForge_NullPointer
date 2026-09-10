'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Download, Volume2, ShieldCheck, Check, Sparkles, AlertCircle } from 'lucide-react';
import { scaleIn } from '@/lib/animations';

export function ProductDemo() {
  const [selectedCandidate, setSelectedCandidate] = useState(0);
  const [playingTrack, setPlayingTrack] = useState<'raw' | 'controlled' | null>(null);

  const candidates = [
    {
      text: 'Postgres cue ell version sixteen',
      reason: 'Natural spoken representation with spelled acronym suffix and word-based version.',
      preferred: true,
    },
    {
      text: 'Postgres Q L version sixteen',
      reason: 'Alternative initialism tokenization for modern neural TTS pronunciation dictionaries.',
      preferred: false,
    },
    {
      text: 'PostgreSQL version sixteen',
      reason: 'Original entity spelling with verbalized version number.',
      preferred: false,
    },
  ];

  const togglePlay = (track: 'raw' | 'controlled') => {
    if (playingTrack === track) {
      setPlayingTrack(null);
    } else {
      setPlayingTrack(track);
    }
  };

  return (
    <section id="product" className="py-16 md:py-24 bg-slate-50/50 border-y border-slate-200/60">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
            Interactive Product View
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
            The evidence-driven QA workspace
          </h2>
          <p className="mt-3 text-slate-600 text-base">
            See how SaySure investigates complex entities, generates hypotheses, and lets actual Rime audio decide.
          </p>
        </div>

        {/* Stylized Console Container */}
        <motion.div
          variants={scaleIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-200/40 overflow-hidden"
        >
          {/* Mock Window Header */}
          <div className="flex items-center justify-between border-b border-slate-200/80 bg-slate-50/80 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-slate-300" />
              <span className="h-3 w-3 rounded-full bg-slate-300" />
              <span className="h-3 w-3 rounded-full bg-slate-300" />
              <span className="ml-2 text-xs font-mono font-medium text-slate-500">
                saysure-console — session_qa_live
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[11px] font-medium text-emerald-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Rime TTS Connected (mistv3 / astra)
              </span>
            </div>
          </div>

          <div className="p-5 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Text & Risks */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              {/* Input Display with Highlighted Span */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                  Input Sentence Under QA
                </label>
                <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 text-slate-800 text-base font-normal leading-relaxed">
                  The primary cluster is migrating to{' '}
                  <span className="inline-block rounded-md bg-amber-100/90 border border-amber-300/80 px-2 py-0.5 font-medium text-amber-900 text-sm">
                    PostgreSQL v16
                  </span>{' '}
                  with strict replication rules.
                </div>
              </div>

              {/* Detected Risks Panel */}
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-amber-500" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                      Speech Risk Detected
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    Investigation Active
                  </span>
                </div>

                <div className="rounded-lg border border-slate-100 bg-slate-50 p-3 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <strong className="text-slate-900 font-mono text-sm">PostgreSQL v16</strong>
                    <span className="text-[10px] font-medium uppercase px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                      Domain Term + Version
                    </span>
                  </div>
                  <p className="text-slate-600 mt-1">
                    Technical initialism with version suffix. Native neural models often trip over the letters "SQL" or pronounce "v16" as separate unlinked letters.
                  </p>
                </div>
              </div>

              {/* Candidate Hypotheses Selector */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2.5">
                  TTS Candidate Hypotheses
                </label>
                <div className="space-y-2.5">
                  {candidates.map((c, i) => (
                    <button
                      key={c.text}
                      type="button"
                      onClick={() => setSelectedCandidate(i)}
                      className={`w-full text-left p-3 rounded-xl border transition-all ${
                        selectedCandidate === i
                          ? 'border-indigo-600 bg-indigo-50/50 shadow-xs ring-1 ring-indigo-600'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono text-xs font-semibold text-slate-900">
                          {c.text}
                        </span>
                        {c.preferred && (
                          <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 flex items-center gap-1">
                            <Check className="h-3 w-3" /> Listener Preferred
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500">{c.reason}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Audio Evidence & Comparison */}
            <div className="lg:col-span-5 flex flex-col justify-between rounded-xl border border-slate-200 bg-slate-50/50 p-5">
              <div>
                <div className="flex items-center justify-between mb-4 border-b border-slate-200 pb-3">
                  <div className="flex items-center gap-2">
                    <Volume2 className="h-4 w-4 text-indigo-600" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-900">
                      Auditory Evidence
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-500">
                    Dual Synthesis
                  </span>
                </div>

                {/* RAW Audio Card */}
                <div className="rounded-xl border border-slate-200 bg-white p-4 mb-4 shadow-2xs hover:border-slate-300 transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      RAW Synthesized
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">1.2s</span>
                  </div>
                  <p className="text-xs font-mono text-slate-700 mb-3 truncate">
                    "PostgreSQL v16"
                  </p>

                  {/* Waveform graphic */}
                  <div className="h-8 flex items-center gap-1 mb-3 px-2 rounded bg-slate-50">
                    {[12, 28, 45, 18, 55, 32, 60, 42, 22, 50, 65, 30, 15, 35, 20].map((h, idx) => (
                      <div
                        key={idx}
                        className={`flex-1 rounded-full transition-all duration-300 ${
                          playingTrack === 'raw' ? 'bg-slate-700 animate-pulse' : 'bg-slate-300'
                        }`}
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => togglePlay('raw')}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700 hover:text-slate-950"
                    >
                      {playingTrack === 'raw' ? (
                        <>
                          <Pause className="h-3.5 w-3.5" /> Pause RAW
                        </>
                      ) : (
                        <>
                          <Play className="h-3.5 w-3.5" /> Play RAW
                        </>
                      )}
                    </button>
                    <span className="text-[11px] text-slate-400">34 KB</span>
                  </div>
                </div>

                {/* CONTROLLED Audio Card */}
                <div className="rounded-xl border border-indigo-200 bg-indigo-50/30 p-4 shadow-2xs hover:border-indigo-300 transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-indigo-700">
                      CONTROLLED Candidate
                    </span>
                    <span className="text-[11px] font-mono text-indigo-600">1.4s</span>
                  </div>
                  <p className="text-xs font-mono text-slate-900 font-medium mb-3 truncate">
                    "{candidates[selectedCandidate].text}"
                  </p>

                  {/* Waveform graphic */}
                  <div className="h-8 flex items-center gap-1 mb-3 px-2 rounded bg-white">
                    {[20, 45, 70, 35, 80, 50, 90, 65, 40, 75, 85, 45, 30, 55, 25].map((h, idx) => (
                      <div
                        key={idx}
                        className={`flex-1 rounded-full transition-all duration-300 ${
                          playingTrack === 'controlled' ? 'bg-indigo-600 animate-pulse' : 'bg-indigo-300'
                        }`}
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-indigo-100">
                    <button
                      type="button"
                      onClick={() => togglePlay('controlled')}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-700 hover:text-indigo-950"
                    >
                      {playingTrack === 'controlled' ? (
                        <>
                          <Pause className="h-3.5 w-3.5" /> Pause Controlled
                        </>
                      ) : (
                        <>
                          <Play className="h-3.5 w-3.5" /> Play Controlled
                        </>
                      )}
                    </button>
                    <span className="text-[11px] text-indigo-500">76 KB</span>
                  </div>
                </div>
              </div>

              {/* Evaluation Outcome Box */}
              <div className="mt-4 rounded-lg bg-white border border-slate-200 p-3.5">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                    Decision Outcome
                  </span>
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Controlled candidate preferred
                  </span>
                </div>
                <p className="text-xs text-slate-600">
                  Rime synthesis demonstrated that "Postgres cue ell version sixteen" delivered 100% natural pronunciation without phonetic artifacting.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
