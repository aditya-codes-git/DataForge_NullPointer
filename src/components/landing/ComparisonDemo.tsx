'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Download, Volume2, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';
import { buttonPress } from '@/lib/animations';

export function ComparisonDemo() {
  const [activeTab, setActiveTab] = useState<'case1' | 'case2'>('case1');
  const [playingState, setPlayingState] = useState<'raw' | 'controlled' | null>(null);

  const cases = {
    case1: {
      title: 'HTTP 429',
      context: 'Rate limit exceeded: the API endpoint returned HTTP 429 to the client.',
      rawText: 'Rate limit exceeded: the API endpoint returned HTTP 429 to the client.',
      controlledText: 'Rate limit exceeded: the API endpoint returned HTTP four two nine to the client.',
      decision: 'Controlled candidate preferred',
      reason: 'Rime synthesis produced clearer digit-by-digit clarity and eliminated numeric ambiguity.',
      rawWaveform: [18, 45, 30, 75, 40, 60, 20, 80, 50, 30, 20, 15],
      controlledWaveform: [25, 60, 45, 85, 65, 90, 70, 95, 80, 55, 40, 25],
    },
    case2: {
      title: 'Kubernetes',
      context: 'Kubernetes cluster state is healthy and synchronized.',
      rawText: 'Kubernetes cluster state is healthy and synchronized.',
      controlledText: 'Kubernetes cluster state is healthy and synchronized.',
      decision: 'RAW preferred (Keep Original)',
      reason: 'Configured Rime voice already produces natural pronunciation. No text rewriting required.',
      rawWaveform: [30, 70, 55, 90, 60, 80, 75, 60, 40, 25, 20, 15],
      controlledWaveform: [30, 70, 55, 90, 60, 80, 75, 60, 40, 25, 20, 15],
    },
  };

  const current = cases[activeTab];

  const handlePlayToggle = (track: 'raw' | 'controlled') => {
    if (playingState === track) {
      setPlayingState(null);
    } else {
      setPlayingState(track);
    }
  };

  return (
    <section className="py-20 md:py-28 bg-slate-50/50 border-t border-slate-200">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
            Real Comparison Mechanics
          </span>
          <h2 className="mt-3 text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
            Listen before you commit.
          </h2>
          <p className="mt-4 text-slate-600 text-lg">
            SaySure synthesizes the original text alongside candidate hypotheses using identical voice configurations so humans can compare real auditory evidence.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1 shadow-2xs">
            <button
              type="button"
              onClick={() => {
                setActiveTab('case1');
                setPlayingState(null);
              }}
              className={`px-4 py-2 text-xs font-medium rounded-lg transition-all ${
                activeTab === 'case1'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Case 1: Controlled Wins (HTTP 429)
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('case2');
                setPlayingState(null);
              }}
              className={`px-4 py-2 text-xs font-medium rounded-lg transition-all ${
                activeTab === 'case2'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Case 2: RAW Wins (Kubernetes)
            </button>
          </div>
        </div>

        {/* Comparison Board */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* RAW Card */}
            <motion.div
              whileHover={{ y: -3 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className="rounded-xl border border-slate-200 bg-slate-50/60 p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    RAW Text (Original)
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">Rime Output</span>
                </div>
                <div className="rounded-lg bg-white border border-slate-200 p-4 font-mono text-sm text-slate-800 leading-relaxed min-h-[70px]">
                  {current.rawText}
                </div>

                {/* Animated Waveform */}
                <div className="mt-5 h-10 flex items-center gap-1 px-3 rounded-lg bg-white border border-slate-100">
                  {current.rawWaveform.map((h, i) => (
                    <div
                      key={i}
                      className={`flex-1 rounded-full transition-all duration-300 ${
                        playingState === 'raw' ? 'bg-slate-800 animate-pulse' : 'bg-slate-300'
                      }`}
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between">
                <motion.button
                  {...buttonPress}
                  type="button"
                  onClick={() => handlePlayToggle('raw')}
                  className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-xs font-medium text-white shadow-2xs hover:bg-slate-800 transition-colors"
                >
                  {playingState === 'raw' ? (
                    <>
                      <Pause className="h-3.5 w-3.5" /> Pause Audio
                    </>
                  ) : (
                    <>
                      <Play className="h-3.5 w-3.5" /> Play RAW Audio
                    </>
                  )}
                </motion.button>

                <span className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 cursor-pointer">
                  <Download className="h-3.5 w-3.5" /> Download
                </span>
              </div>
            </motion.div>

            {/* CONTROLLED Card */}
            <motion.div
              whileHover={{ y: -3 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className="rounded-xl border border-indigo-200 bg-indigo-50/20 p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-indigo-700">
                    CONTROLLED Candidate
                  </span>
                  <span className="text-[11px] font-mono text-indigo-500">Rime Output</span>
                </div>
                <div className="rounded-lg bg-white border border-indigo-200 p-4 font-mono text-sm text-indigo-950 leading-relaxed min-h-[70px]">
                  {current.controlledText}
                </div>

                {/* Animated Waveform */}
                <div className="mt-5 h-10 flex items-center gap-1 px-3 rounded-lg bg-white border border-indigo-100">
                  {current.controlledWaveform.map((h, i) => (
                    <div
                      key={i}
                      className={`flex-1 rounded-full transition-all duration-300 ${
                        playingState === 'controlled' ? 'bg-indigo-600 animate-pulse' : 'bg-indigo-300'
                      }`}
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-indigo-100 flex items-center justify-between">
                <motion.button
                  {...buttonPress}
                  type="button"
                  onClick={() => handlePlayToggle('controlled')}
                  className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-medium text-white shadow-2xs hover:bg-indigo-700 transition-colors"
                >
                  {playingState === 'controlled' ? (
                    <>
                      <Pause className="h-3.5 w-3.5" /> Pause Audio
                    </>
                  ) : (
                    <>
                      <Play className="h-3.5 w-3.5" /> Play Controlled Audio
                    </>
                  )}
                </motion.button>

                <span className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 cursor-pointer">
                  <Download className="h-3.5 w-3.5" /> Download
                </span>
              </div>
            </motion.div>
          </div>

          {/* Decision Outcome Banner */}
          <div className="mt-6 rounded-xl bg-slate-50 border border-slate-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                <CheckCircle2 className="h-4 w-4" />
              </span>
              <div>
                <span className="text-xs font-semibold text-slate-900 block">
                  Evaluation Outcome: {current.decision}
                </span>
                <p className="text-xs text-slate-600 mt-0.5">{current.reason}</p>
              </div>
            </div>
            <span className="text-xs font-mono text-slate-400 whitespace-nowrap">
              Latency: ~580ms / Voice: astra
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
