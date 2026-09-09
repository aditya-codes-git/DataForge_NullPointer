'use client';

import React from 'react';
import { SpeechRisk } from '@/lib/schemas';

interface RiskHighlightsProps {
  text: string;
  risks: SpeechRisk[];
  selectedRiskId: string | null;
  onSelectRisk: (id: string | null) => void;
}

export function RiskHighlights({
  text,
  risks,
  selectedRiskId,
  onSelectRisk,
}: RiskHighlightsProps) {
  if (!risks || risks.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 font-sans text-base leading-relaxed text-slate-700">
        {text}
      </div>
    );
  }

  const sortedRisks = [...risks].sort((a, b) => a.start - b.start);
  const segments: React.ReactNode[] = [];
  let currentIndex = 0;

  sortedRisks.forEach((risk, idx) => {
    // Regular text before risk
    if (risk.start > currentIndex) {
      segments.push(
        <span key={`plain-${idx}`} className="text-slate-700">
          {text.slice(currentIndex, risk.start)}
        </span>
      );
    }

    // Risky span with amber highlight
    const isSelected = selectedRiskId === risk.id;

    segments.push(
      <mark
        key={`risk-${risk.id}`}
        onClick={() => onSelectRisk(isSelected ? null : risk.id)}
        className={`inline-flex cursor-pointer items-baseline rounded-md border border-amber-300 bg-amber-100 px-1.5 py-0.5 font-mono text-sm font-semibold text-amber-900 transition-all ${
          isSelected ? 'ring-2 ring-indigo-500 ring-offset-2' : 'hover:bg-amber-200'
        }`}
      >
        {risk.text}
      </mark>
    );

    currentIndex = risk.end;
  });

  if (currentIndex < text.length) {
    segments.push(
      <span key="plain-tail" className="text-slate-700">
        {text.slice(currentIndex)}
      </span>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 font-sans text-base leading-relaxed">
      {segments}
    </div>
  );
}
