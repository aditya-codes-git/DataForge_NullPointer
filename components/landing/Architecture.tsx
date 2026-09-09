'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  AlertTriangle,
  Compass,
  BookOpen,
  Sparkles,
  ShieldCheck,
  Cpu,
  CheckCircle2,
  Users,
  Database,
} from 'lucide-react';

const ARCH_NODES = [
  {
    id: 'text',
    name: 'Input Text',
    icon: FileText,
    role: 'Raw input string',
    desc: 'Unsanitized text from conversational AI, prompt output, or notification triggers.',
  },
  {
    id: 'detector',
    name: 'Risk Detector',
    icon: AlertTriangle,
    role: '14 risk categories',
    desc: 'Regex and NLP heuristics locate acronyms, versioned entities, currency, and domain terms.',
  },
  {
    id: 'context',
    name: 'Context Engine',
    icon: Compass,
    role: 'Sentence semantics',
    desc: 'Evaluates ambiguity in full sentence context with domain priors and Groq structured output.',
  },
  {
    id: 'knowledge',
    name: 'Knowledge Base',
    icon: BookOpen,
    role: 'Canonical seed dictionary',
    desc: 'Extensible repository storing canonical spoken forms and candidate representations.',
  },
  {
    id: 'candidates',
    name: 'Candidate Generator',
    icon: Sparkles,
    role: '0 to 3 hypotheses',
    desc: 'Emits natural-language-first representations while preserving RAW text as a candidate.',
  },
  {
    id: 'validator',
    name: 'Integrity Validator',
    icon: ShieldCheck,
    role: '10-point safety check',
    desc: 'Strict checklist ensuring zero number drift, currency preservation, and identity integrity.',
  },
  {
    id: 'rime',
    name: 'Rime TTS',
    icon: Cpu,
    role: 'Audio authority',
    desc: 'Synthesizes RAW and candidates through identical neural voice and model configurations.',
  },
  {
    id: 'decision',
    name: 'Decision Engine',
    icon: CheckCircle2,
    role: 'Objective outcome',
    desc: 'Weighs auditory evidence, safety rules, and minimality: KEEP_RAW, USE_CONTROLLED, SAME, or NEEDS_REVIEW.',
  },
  {
    id: 'human',
    name: 'Human Listener',
    icon: Users,
    role: 'Verification loop',
    desc: 'Listener verification flow for ambiguous cases and production gold standard datasets.',
  },
  {
    id: 'evidence',
    name: 'Evidence Memory',
    icon: Database,
    role: 'Voice-isolated provenance',
    desc: 'Stores provenance and preferences strictly bounded to compatible voice/model keys.',
  },
];

export function Architecture() {
  const [selectedNode, setSelectedNode] = useState(ARCH_NODES[6]); // default to Rime

  return (
    <section id="architecture" className="py-20 md:py-28 bg-slate-50/50 border-t border-slate-200">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-3xl mb-14">
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
            System Architecture
          </span>
          <h2 className="mt-3 text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
            Designed for modularity and safety.
          </h2>
          <p className="mt-4 text-slate-600 text-lg leading-relaxed">
            Every layer in SaySure has a single, verifiable responsibility. Zero black-box rewrites, zero uninspected mutations.
          </p>
        </div>

        {/* Interactive Diagram Container */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Node Map */}
            <div className="lg:col-span-8">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">
                Architecture Pipeline (Click any node to inspect)
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {ARCH_NODES.map((node, i) => {
                  const Icon = node.icon;
                  const isSelected = selectedNode.id === node.id;

                  return (
                    <button
                      key={node.id}
                      type="button"
                      onClick={() => setSelectedNode(node)}
                      className={`text-left p-3.5 rounded-xl border transition-all flex flex-col justify-between h-28 ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/50 shadow-xs ring-1 ring-indigo-600'
                          : 'border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-slate-400">
                          {(i + 1).toString().padStart(2, '0')}
                        </span>
                        <div
                          className={`p-1.5 rounded-md ${
                            isSelected ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 border border-slate-200'
                          }`}
                        >
                          <Icon className="h-3.5 w-3.5" />
                        </div>
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-900 block truncate">
                          {node.name}
                        </span>
                        <span className="text-[10px] text-slate-500 block truncate">
                          {node.role}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Node Detail Card */}
            <div className="lg:col-span-4 rounded-xl border border-indigo-100 bg-indigo-50/30 p-6 flex flex-col justify-between h-full min-h-[220px]">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="p-2 rounded-lg bg-indigo-600 text-white shadow-2xs">
                    {React.createElement(selectedNode.icon, { className: 'h-4 w-4' })}
                  </span>
                  <div>
                    <h4 className="text-base font-bold text-slate-900">{selectedNode.name}</h4>
                    <span className="text-xs text-indigo-700 font-medium">{selectedNode.role}</span>
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed mt-4">
                  {selectedNode.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-indigo-100/80 text-[11px] text-indigo-900/70 font-mono">
                Component status: production_verified
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
