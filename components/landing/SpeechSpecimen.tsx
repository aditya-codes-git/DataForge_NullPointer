'use client';

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Download, Volume2, ShieldCheck, CheckCircle2 } from 'lucide-react';

export function SpeechSpecimen() {
  const [playingTrack, setPlayingTrack] = useState<'raw' | 'controlled' | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playAudio = (track: 'raw' | 'controlled', src: string) => {
    if (playingTrack === track && audioRef.current) {
      audioRef.current.pause();
      setPlayingTrack(null);
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
    }

    const audio = new Audio(src);
    audioRef.current = audio;
    audio.play()
      .then(() => setPlayingTrack(track))
      .catch((err) => {
        console.warn('Audio playback not permitted without interaction', err);
        setPlayingTrack(null);
      });

    audio.onended = () => {
      setPlayingTrack(null);
    };
  };

  return (
    <section id="specimen" className="py-24 md:py-36 bg-white border-b border-neutral-200">
      <div className="mx-auto max-w-5xl px-6 lg:px-12">
        {/* Specimen Header */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-neutral-950 pb-4 mb-16">
          <span className="font-mono text-xs uppercase tracking-widest text-neutral-950 font-bold">
            [SPECIMEN NO. 042]
          </span>
          <span className="font-mono text-xs text-neutral-500">
            Acoustic Measurement — PostgreSQL v16 Entity Integrity
          </span>
        </div>

        {/* The Instrument Surface */}
        <div className="relative border-2 border-neutral-950 p-8 sm:p-14 bg-neutral-50/50">
          {/* Top Label */}
          <div className="flex items-center justify-between text-xs font-mono uppercase tracking-widest text-neutral-400 mb-8 border-b border-neutral-200 pb-4">
            <span>INPUT STREAM</span>
            <span>VOICE: ASTRA // MODEL: MISTV3</span>
          </div>

          {/* Level 1: The Input Sentence with highlighted token */}
          <div className="mb-12">
            <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 block mb-2">
              WRITTEN PHRASE
            </span>
            <div className="text-2xl sm:text-4xl md:text-5xl font-sans font-bold text-neutral-950 leading-tight">
              The deployment is running on{' '}
              <span className="relative inline-block text-indigo-600 underline decoration-indigo-300 underline-offset-8">
                PostgreSQL v16
              </span>{' '}
              with gRPC.
            </div>
          </div>

          {/* Downward Conduit */}
          <div className="flex items-center gap-3 my-8 text-neutral-300 font-mono text-xs">
            <span className="h-px bg-neutral-300 w-12" />
            <span className="text-neutral-500 uppercase tracking-widest text-[10px]">
              INVESTIGATION HYPOTHESIS
            </span>
            <span className="h-px bg-neutral-300 flex-1" />
          </div>

          {/* Level 2: Spoken Representation */}
          <div className="mb-12">
            <span className="font-mono text-[10px] uppercase tracking-widest text-indigo-600 block mb-2">
              SPOKEN REPRESENTATION TESTED
            </span>
            <div className="font-mono text-xl sm:text-3xl font-bold text-indigo-950 tracking-tight">
              "The deployment is running on Postgres cue ell version sixteen with gee are pee see."
            </div>
          </div>

          {/* Downward Conduit */}
          <div className="flex items-center gap-3 my-8 text-neutral-300 font-mono text-xs">
            <span className="h-px bg-neutral-300 w-12" />
            <span className="text-neutral-500 uppercase tracking-widest text-[10px]">
              DUAL RIME SYNTHESIS
            </span>
            <span className="h-px bg-neutral-300 flex-1" />
          </div>

          {/* Level 3: Dual Auditory Comparison */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12">
            {/* Track 1: RAW */}
            <div className="border border-neutral-300 bg-white p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-xs uppercase tracking-widest font-bold text-neutral-500">
                  A // RAW SYNTHESIS
                </span>
                <span className="font-mono text-[10px] text-neutral-400">0.71s</span>
              </div>

              {/* Waveform graphic */}
              <div className="h-12 flex items-center gap-1.5 my-4 px-2 bg-neutral-50">
                {[15, 30, 45, 20, 60, 35, 70, 50, 25, 40, 55, 30, 20, 15].map((h, i) => (
                  <div
                    key={i}
                    className={`flex-1 transition-all duration-200 ${
                      playingTrack === 'raw' ? 'bg-neutral-950 animate-pulse' : 'bg-neutral-300'
                    }`}
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => playAudio('raw', '/audio/6_full_sentence_raw.mp3')}
                  className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider font-bold text-neutral-950 hover:text-indigo-600"
                >
                  {playingTrack === 'raw' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  <span>{playingTrack === 'raw' ? 'Stop Audio' : 'Play RAW Audio'}</span>
                </button>
                <a
                  href="/audio/6_full_sentence_raw.mp3"
                  download
                  className="font-mono text-[11px] text-neutral-400 hover:text-neutral-950 flex items-center gap-1"
                >
                  <Download className="h-3 w-3" /> MP3
                </a>
              </div>
            </div>

            {/* Track 2: CONTROLLED */}
            <div className="border-2 border-indigo-600 bg-indigo-50/20 p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-xs uppercase tracking-widest font-bold text-indigo-700">
                  B // CONTROLLED CANDIDATE
                </span>
                <span className="font-mono text-[10px] text-indigo-600">0.56s</span>
              </div>

              {/* Waveform graphic */}
              <div className="h-12 flex items-center gap-1.5 my-4 px-2 bg-white">
                {[25, 50, 75, 40, 85, 60, 95, 70, 45, 80, 90, 55, 35, 25].map((h, i) => (
                  <div
                    key={i}
                    className={`flex-1 transition-all duration-200 ${
                      playingTrack === 'controlled' ? 'bg-indigo-600 animate-pulse' : 'bg-indigo-300'
                    }`}
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-indigo-100">
                <button
                  type="button"
                  onClick={() => playAudio('controlled', '/audio/7_full_sentence_controlled.mp3')}
                  className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider font-bold text-indigo-700 hover:text-indigo-950"
                >
                  {playingTrack === 'controlled' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  <span>{playingTrack === 'controlled' ? 'Stop Audio' : 'Play Controlled'}</span>
                </button>
                <a
                  href="/audio/7_full_sentence_controlled.mp3"
                  download
                  className="font-mono text-[11px] text-indigo-500 hover:text-indigo-950 flex items-center gap-1"
                >
                  <Download className="h-3 w-3" /> MP3
                </a>
              </div>
            </div>
          </div>

          {/* Level 4: Final Auditory Decision */}
          <div className="border-t-2 border-neutral-950 pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 block mb-1">
                EVALUATION OUTCOME
              </span>
              <div className="font-mono text-2xl font-black text-emerald-700">
                CONTROLLED PREFERRED
              </div>
              <p className="font-sans text-xs text-neutral-600 mt-1 max-w-xl">
                Acoustic verification demonstrated that "Postgres cue ell version sixteen" delivered clean syllable cadence without character-by-character letter artifacts.
              </p>
            </div>
            <div className="text-right">
              <span className="font-mono text-[11px] text-neutral-500 block">
                Evidence ID: ev-1788981197077
              </span>
              <span className="font-mono text-[10px] text-emerald-600 font-semibold block mt-0.5">
                VERIFIED BY AUDITORY TEST
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
