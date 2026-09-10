import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, ArrowRight, Check, AlertTriangle, ShieldCheck, Sparkles } from 'lucide-react';

interface ExampleCase {
  id: string;
  token: string;
  category: string;
  sentence: {
    prefix: string;
    highlight: string;
    suffix: string;
  };
  riskDescription: string;
  candidates: {
    text: string;
    tag: string;
    isWinner: boolean;
  }[];
  audioFile: string;
  rimeTestNotes: string;
  decision: {
    status: 'CONTROLLED PREFERRED' | 'RAW PREFERRED';
    summary: string;
  };
}

const EXAMPLES: ExampleCase[] = [
  {
    id: 'pg',
    token: 'PostgreSQL v16',
    category: 'Structured Domain Term & Version',
    sentence: {
      prefix: 'The primary cluster migrated to ',
      highlight: 'PostgreSQL v16',
      suffix: ' in production.',
    },
    riskDescription:
      'Domain term with attached version number. Naive TTS risks spelling SQL letter-by-letter or slurring the version number.',
    candidates: [
      { text: 'Postgres cue ell version sixteen', tag: 'Natural Spoken Words', isWinner: true },
      { text: 'Postgres Q L version sixteen', tag: 'Acronym Spelled', isWinner: false },
      { text: 'PostgreSQL version sixteen', tag: 'Baseline Entity Preserved', isWinner: false },
    ],
    audioFile: '/audio/5_postgres_cue_ell_v16.mp3',
    rimeTestNotes: 'Acoustic testing shows "Postgres cue ell" avoids mechanical letter-by-letter robotic artifacts while maintaining natural cadence.',
    decision: {
      status: 'CONTROLLED PREFERRED',
      summary: 'Controlled candidate preferred over raw spelling. Verified by acoustic waveform comparison.',
    },
  },
  {
    id: 'http',
    token: 'HTTP 429',
    category: 'Protocol & Status Code',
    sentence: {
      prefix: 'Rate limit exceeded: the API endpoint returned ',
      highlight: 'HTTP 429',
      suffix: ' to the client.',
    },
    riskDescription:
      'Ambiguity between reading status code as number magnitude ("four hundred twenty-nine") vs conventional individual digits ("four two nine").',
    candidates: [
      { text: 'HTTP four two nine', tag: 'Status Code Digits', isWinner: true },
      { text: 'HTTP four twenty-nine', tag: 'Conversational Grouping', isWinner: false },
      { text: 'HTTP 429', tag: 'Raw Baseline', isWinner: false },
    ],
    audioFile: '/audio/7_full_sentence_controlled.mp3',
    rimeTestNotes: 'Digit-by-digit expansion prevents confusing HTTP status codes with large counts or monetary values.',
    decision: {
      status: 'CONTROLLED PREFERRED',
      summary: 'Explicit digit separation ensures immediate developer comprehension.',
    },
  },
  {
    id: 'currency',
    token: '₹2,75,500',
    category: 'Indian Numbering & Currency',
    sentence: {
      prefix: 'The verified transaction settlement is ',
      highlight: '₹2,75,500',
      suffix: ' processed via UPI.',
    },
    riskDescription:
      'Indian numbering formatting (lakhs & crores) is not natively grouped by Western speech engines, leading to truncated or garbled amounts.',
    candidates: [
      { text: 'two lakh seventy-five thousand five hundred rupees', tag: 'Lakhs Denomination', isWinner: true },
      { text: '₹2,75,500', tag: 'Raw Symbol Format', isWinner: false },
      { text: 'two hundred seventy-five thousand rupees', tag: 'Western Metric Grouping', isWinner: false },
    ],
    audioFile: '/audio/7_full_sentence_controlled.mp3',
    rimeTestNotes: 'Expands ₹ into localized rupees suffix and correctly handles 2,75,000 as two lakh seventy-five thousand.',
    decision: {
      status: 'CONTROLLED PREFERRED',
      summary: 'Guarantees financial precision and regional notation fidelity.',
    },
  },
  {
    id: 'identifier',
    token: 'A12B9X7',
    category: 'Alphanumeric Identifier',
    sentence: {
      prefix: 'Your one-time security confirmation token is ',
      highlight: 'A12B9X7',
      suffix: '.',
    },
    riskDescription:
      'Alphanumeric tokens risk being pronounced as pseudowords or slurred together, causing severe user authentication failures.',
    candidates: [
      { text: 'A one two B nine X seven', tag: 'Phonetic Character Isolation', isWinner: true },
      { text: 'A-1-2-B-9-X-7', tag: 'Hyphenated Cadence', isWinner: false },
      { text: 'A12B9X7', tag: 'Raw Alphanumeric', isWinner: false },
    ],
    audioFile: '/audio/2_postgres_cue_ell.mp3',
    rimeTestNotes: 'Preserves 100% of character identity with clean rhythmic pauses between letters and digits.',
    decision: {
      status: 'CONTROLLED PREFERRED',
      summary: 'Zero character loss. Every character and digit pronounced with distinct pauses.',
    },
  },
  {
    id: 'k8s',
    token: 'Kubernetes',
    category: 'Technical Vocabulary (RAW Wins)',
    sentence: {
      prefix: 'All container orchestration is handled by ',
      highlight: 'Kubernetes',
      suffix: ' on AWS.',
    },
    riskDescription:
      'Potential pronunciation ambiguity; however, native Rime Mistv3 speech models already handle "Kubernetes" with high acoustic fidelity.',
    candidates: [
      { text: 'Kubernetes', tag: 'Raw Baseline (Preserved)', isWinner: true },
      { text: 'koo-ber-net-eez', tag: 'Phonetic Respelling', isWinner: false },
      { text: 'K 8 s', tag: 'Numeronym Alternative', isWinner: false },
    ],
    audioFile: '/audio/1_postgresql_raw.mp3',
    rimeTestNotes: 'Auditory comparison confirms Rime speaks "Kubernetes" naturally without distortion. Unnecessary respelling avoided.',
    decision: {
      status: 'RAW PREFERRED',
      summary: 'Original retained. Detection does not mandate rewrite when native speech is pristine.',
    },
  },
  {
    id: 'date',
    token: '17/09/2026',
    category: 'Calendar Date Format',
    sentence: {
      prefix: 'The scheduled platform maintenance window opens ',
      highlight: '17/09/2026',
      suffix: ' at midnight.',
    },
    riskDescription:
      'Slash dates are frequently read literally ("seventeen slash zero nine slash...") instead of standard conversational calendar dates.',
    candidates: [
      { text: 'the seventeenth of September, twenty twenty-six', tag: 'Natural Ordinal Date', isWinner: true },
      { text: 'September seventeenth, twenty twenty-six', tag: 'US Format', isWinner: false },
      { text: '17/09/2026', tag: 'Raw Slash Baseline', isWinner: false },
    ],
    audioFile: '/audio/7_full_sentence_controlled.mp3',
    rimeTestNotes: 'Converts ambiguous date strings into unambiguous conversational spoken phrases.',
    decision: {
      status: 'CONTROLLED PREFERRED',
      summary: 'Conversational ordinal calendar date chosen for clarity.',
    },
  },
];

export function InteractiveSentence() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioObj, setAudioObj] = useState<HTMLAudioElement | null>(null);

  // Subtle auto-advance every 6 seconds unless paused by user interaction
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setSelectedIndex((prev) => (prev + 1) % EXAMPLES.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const current = EXAMPLES[selectedIndex];

  const handleSelect = (index: number) => {
    setIsPaused(true);
    if (audioObj) {
      audioObj.pause();
      setIsPlayingAudio(false);
    }
    setSelectedIndex(index);
  };

  const handleAudioPlay = () => {
    if (isPlayingAudio && audioObj) {
      audioObj.pause();
      setIsPlayingAudio(false);
      return;
    }

    if (audioObj) audioObj.pause();
    const a = new Audio(current.audioFile);
    a.play()
      .then(() => setIsPlayingAudio(true))
      .catch(() => setIsPlayingAudio(false));
    a.onended = () => setIsPlayingAudio(false);
    setAudioObj(a);
  };

  return (
    <section id="interactive" className="py-24 sm:py-36 bg-white border-b border-neutral-200">
      <div className="mx-auto max-w-6xl px-6 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 border-b border-neutral-950 pb-4 mb-12">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-neutral-950 font-bold block mb-1">
              [LABORATORY // MULTI-CATEGORY SPEECH QA]
            </span>
            <span className="text-xs text-neutral-500 font-sans">
              Test candidate generation across technical terms, status codes, currencies, identifiers, and dates
            </span>
          </div>
          <span className="font-mono text-[11px] text-neutral-400">
            Case {selectedIndex + 1} of {EXAMPLES.length}
          </span>
        </div>

        {/* 6 Category Pills / Tickers */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 font-mono text-xs">
          {EXAMPLES.map((item, idx) => {
            const isActive = selectedIndex === idx;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelect(idx)}
                className={`px-3.5 py-2 whitespace-nowrap transition-all border text-left cursor-pointer ${
                  isActive
                    ? 'border-neutral-950 bg-neutral-950 text-white font-bold shadow-xs'
                    : 'border-neutral-200 bg-neutral-50 text-neutral-600 hover:border-neutral-400 hover:text-neutral-950'
                }`}
              >
                <div className="text-[10px] uppercase opacity-75">{item.category}</div>
                <div className="font-bold text-xs">{item.token}</div>
              </button>
            );
          })}
        </div>

        {/* The Live Interactive Sentence Box */}
        <div className="p-8 sm:p-12 border-2 border-neutral-950 bg-neutral-50/50 mb-8">
          <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 block mb-3">
            WRITTEN SENTENCE UNDER INVESTIGATION
          </span>

          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="text-2xl sm:text-3xl md:text-4xl font-sans font-bold text-neutral-950 leading-relaxed"
            >
              {current.sentence.prefix}
              <span className="relative inline-block text-indigo-600 underline decoration-indigo-400 decoration-2 underline-offset-8 bg-indigo-50/60 px-2 py-0.5 rounded-none">
                {current.sentence.highlight}
              </span>
              {current.sentence.suffix}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* 5-Step Pipeline Inspector */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="border border-neutral-300 p-8 bg-white grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
          >
            {/* Left Col: Step 1 (Original) → Step 2 (Risk) → Step 3 (Candidates) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Step 1 & 2: Original & Risk */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs uppercase tracking-widest text-indigo-600 font-bold">
                    01 // ORIGINAL → 02 // RISK DETECTED
                  </span>
                </div>
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-xl sm:text-2xl font-black text-neutral-950">
                    {current.token}
                  </span>
                  <span className="text-xs font-mono text-neutral-500 uppercase">
                    [{current.category}]
                  </span>
                </div>
                <p className="font-sans text-xs sm:text-sm text-neutral-600 leading-relaxed">
                  {current.riskDescription}
                </p>
              </div>

              {/* Step 3: Candidates */}
              <div className="space-y-2 pt-4 border-t border-neutral-100">
                <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 block mb-1">
                  03 // CANDIDATE HYPOTHESES GENERATED
                </span>
                <div className="space-y-2">
                  {current.candidates.map((cand, idx) => (
                    <div
                      key={cand.text}
                      className={`flex items-center justify-between p-3 font-mono text-xs border ${
                        cand.isWinner
                          ? 'border-indigo-600 bg-indigo-50/40 text-indigo-950 font-bold'
                          : 'border-neutral-200 bg-neutral-50 text-neutral-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-neutral-400">0{idx + 1}</span>
                        <span>"{cand.text}"</span>
                      </div>
                      {cand.isWinner && (
                        <span className="text-[10px] text-indigo-700 uppercase tracking-wider flex items-center gap-1 font-bold">
                          <Check className="h-3 w-3" /> Selected Hypothesis
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Col: Step 4 (Rime Acoustic Test) → Step 5 (Decision) */}
            <div className="lg:col-span-5 border-t lg:border-t-0 lg:border-l border-neutral-200 pt-6 lg:pt-0 lg:pl-8 flex flex-col justify-between h-full space-y-6">
              {/* Step 4: Rime */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 block">
                    04 // RIME ACOUSTIC TEST
                  </span>
                  <span className="font-mono text-[10px] text-neutral-500">Mistv3 / Astra</span>
                </div>

                <div className="h-14 flex items-center gap-1 my-2 px-3 bg-neutral-50 border border-neutral-200">
                  {[20, 55, 30, 80, 45, 90, 65, 35, 75, 50, 85, 40, 60, 25].map((h, idx) => (
                    <div
                      key={idx}
                      className={`flex-1 ${
                        isPlayingAudio ? 'bg-indigo-600 animate-pulse' : 'bg-neutral-300'
                      }`}
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>

                <p className="font-sans text-xs text-neutral-600 leading-relaxed">
                  {current.rimeTestNotes}
                </p>

                <button
                  type="button"
                  onClick={handleAudioPlay}
                  className="inline-flex items-center gap-2 bg-neutral-950 text-white px-4 py-2 font-mono text-xs uppercase tracking-wider font-bold hover:bg-indigo-600 transition-colors cursor-pointer"
                >
                  {isPlayingAudio ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                  <span>{isPlayingAudio ? 'Pause Audio' : 'Play Acoustic Test'}</span>
                </button>
              </div>

              {/* Step 5: Decision */}
              <div className="pt-4 border-t border-neutral-100 space-y-1">
                <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 block">
                  05 // FINAL OUTCOME
                </span>
                <div className="flex items-center gap-2">
                  <span
                    className={`font-mono text-sm px-2.5 py-0.5 font-bold border ${
                      current.decision.status === 'RAW PREFERRED'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : 'bg-indigo-50 text-indigo-800 border-indigo-300'
                    }`}
                  >
                    {current.decision.status}
                  </span>
                </div>
                <p className="font-sans text-xs text-neutral-600 pt-1">
                  {current.decision.summary}
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
