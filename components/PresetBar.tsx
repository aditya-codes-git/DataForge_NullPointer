'use client';

import React from 'react';
import { Bookmark, Sparkles, AlertTriangle, ShieldCheck } from 'lucide-react';

export interface PresetCase {
  id: string;
  name: string;
  text: string;
  badge: string;
  badgeColor: 'indigo' | 'amber' | 'emerald' | 'rose';
}

export const PRESET_CASES: PresetCase[] = [
  {
    id: 'case-1',
    name: 'Case 1: Alphanumeric & Currency',
    text: 'Your verification code is A12B9X7 and your total is ₹1,25,000.',
    badge: 'Dual Risk',
    badgeColor: 'indigo',
  },
  {
    id: 'case-2',
    name: 'Case 2: HTTP 429 & Kubernetes',
    text: 'HTTP 429 occurred while connecting to Kubernetes.',
    badge: 'Tech Jargon',
    badgeColor: 'indigo',
  },
  {
    id: 'case-3',
    name: 'Case 3: Clean Speech',
    text: 'Hello, how are you today?',
    badge: 'Baseline Clean',
    badgeColor: 'emerald',
  },
  {
    id: 'case-4',
    name: 'Case 4: Ambiguous (XyloQ)',
    text: 'The customer requested a refund for product XyloQ.',
    badge: 'Needs Review',
    badgeColor: 'rose',
  },
  {
    id: 'case-5',
    name: 'Case 5: Multi-Protocol Tech',
    text: 'We migrated the dataset from PostgreSQL to Neo4j over IPv6.',
    badge: 'Complex Domain',
    badgeColor: 'amber',
  },
];

interface PresetBarProps {
  onSelectPreset: (text: string) => void;
  selectedText: string;
}

export function PresetBar({ onSelectPreset, selectedText }: PresetBarProps) {
  return (
    <div className="border-b border-[#2A364F] bg-[#0E1524] px-6 py-3">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
          <Bookmark className="h-3.5 w-3.5 text-indigo-400" />
          <span>Acceptance Test Presets:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {PRESET_CASES.map((preset) => {
            const isActive = selectedText === preset.text;
            return (
              <button
                key={preset.id}
                onClick={() => onSelectPreset(preset.text)}
                className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                  isActive
                    ? 'border border-indigo-500 bg-indigo-600/20 text-white shadow-sm shadow-indigo-500/10'
                    : 'border border-[#374151] bg-[#1F2937] text-slate-300 hover:border-slate-500 hover:bg-[#2A364F]'
                }`}
              >
                <span>{preset.name}</span>
                <span
                  className={`rounded px-1.5 py-0.5 font-mono text-[9px] font-semibold uppercase ${
                    preset.badgeColor === 'indigo'
                      ? 'bg-indigo-500/20 text-indigo-300'
                      : preset.badgeColor === 'emerald'
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : preset.badgeColor === 'rose'
                      ? 'bg-rose-500/20 text-rose-300'
                      : 'bg-amber-500/20 text-amber-300'
                  }`}
                >
                  {preset.badge}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
