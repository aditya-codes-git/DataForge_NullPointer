'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, AlertTriangle, Sparkles, Cpu, Headphones, CheckCircle2 } from 'lucide-react';

const TOKENS = [
  { text: 'HTTP 429', category: 'status_code', candidate: 'HTTP four two nine' },
  { text: '₹2,75,500', category: 'currency', candidate: 'two lakh seventy-five thousand five hundred rupees' },
  { text: 'A12B9X7', category: 'identifier', candidate: 'A one two B nine X seven' },
  { text: 'gRPC', category: 'protocol', candidate: 'gee are pee see' },
  { text: '17/09/2026', category: 'date', candidate: 'September seventeenth, twenty twenty-six' },
];

export function HeroPipeline() {
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % TOKENS.length);
    }, 3800);
    return () => clearInterval(timer);
  }, []);

  const activeToken = TOKENS[activeIdx];

  const steps = [
    { label: 'Written Text', icon: FileText, desc: activeToken.text, highlight: false },
    { label: 'Risk Identified', icon: AlertTriangle, desc: activeToken.category, highlight: true },
    { label: 'Candidate Generated', icon: Sparkles, desc: activeToken.candidate, highlight: false },
    { label: 'Rime Synthesized', icon: Cpu, desc: 'mistv3 / astra', highlight: false },
    { label: 'Delivery QA', icon: Headphones, desc: 'Auditory Evidence', highlight: true },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 my-4">
      <div className="relative rounded-2xl border border-slate-200/80 bg-gradient-to-b from-slate-50/70 to-white/90 p-5 sm:p-7 shadow-xs">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Live Pipeline Stream
            </span>
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            {TOKENS.map((tok, i) => (
              <button
                key={tok.text}
                onClick={() => setActiveIdx(i)}
                className={`text-xs px-2.5 py-1 rounded-md transition-all font-mono whitespace-nowrap ${
                  i === activeIdx
                    ? 'bg-slate-900 text-white font-medium shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                {tok.text}
              </button>
            ))}
          </div>
        </div>

        {/* The Pipeline Track */}
        <div className="relative grid grid-cols-1 md:grid-cols-5 gap-3.5">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isLast = idx === steps.length - 1;

            return (
              <div key={step.label} className="relative group">
                <motion.div
                  key={`${activeIdx}-${step.label}`}
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.35, delay: idx * 0.07 }}
                  className={`h-full flex flex-col justify-between rounded-xl border p-3.5 transition-all ${
                    idx === 2 || idx === 4
                      ? 'border-indigo-200 bg-indigo-50/40'
                      : 'border-slate-200/90 bg-white'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono text-slate-400">0{idx + 1}</span>
                      <div
                        className={`p-1.5 rounded-md ${
                          idx === 2 || idx === 4
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                    </div>
                    <h4 className="text-xs font-semibold text-slate-900 mb-1">{step.label}</h4>
                  </div>

                  <div className="mt-2 pt-2 border-t border-slate-100">
                    <p className="text-[11px] font-mono text-slate-600 truncate" title={step.desc}>
                      {step.desc}
                    </p>
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>

        {/* Status Line */}
        <div className="mt-4 flex items-center justify-between text-[11px] text-slate-500 pt-3 border-t border-slate-100">
          <span>Active TTS Voice: <strong className="text-slate-700 font-mono">mistv3 (astra)</strong></span>
          <span className="flex items-center gap-1 text-emerald-600 font-medium">
            <CheckCircle2 className="h-3.5 w-3.5" /> Zero forced character-spelling
          </span>
        </div>
      </div>
    </div>
  );
}
