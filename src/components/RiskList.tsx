'use client';

import React from 'react';
import { SpeechRisk } from '@/lib/schemas';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface RiskListProps {
  risks: SpeechRisk[];
  selectedRiskId: string | null;
  onSelectRisk: (id: string | null) => void;
}

export function RiskList({ risks, selectedRiskId, onSelectRisk }: RiskListProps) {
  if (!risks || risks.length === 0) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 text-sm text-emerald-800">
        <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
        <p>
          <strong className="font-semibold">No speech risks detected:</strong> Original text is directly speech-ready with natural phrasing.
        </p>
      </div>
    );
  }

  const formatCategory = (cat: string) => {
    return cat
      .replace('_', ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());
  };

  return (
    <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
      {risks.map((risk) => {
        const isSelected = selectedRiskId === risk.id;

        return (
          <div
            key={risk.id}
            onClick={() => onSelectRisk(isSelected ? null : risk.id)}
            className={`cursor-pointer rounded-xl border bg-white p-4 shadow-sm transition-all hover:border-slate-300 ${
              isSelected ? 'border-indigo-500 ring-2 ring-indigo-500/10' : 'border-slate-200'
            }`}
          >
            {/* Header: Name — Category · Risk Level */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-base font-bold text-slate-900">
                  {risk.text}
                </span>
                <span className="text-xs text-slate-400">—</span>
                <span className="text-xs font-medium text-slate-600">
                  {formatCategory(risk.category)}
                </span>
              </div>

              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  risk.severity === 'high'
                    ? 'bg-rose-50 text-rose-700 border border-rose-200'
                    : 'bg-amber-50 text-amber-800 border border-amber-200'
                }`}
              >
                {risk.severity === 'high' ? 'High risk' : 'Medium risk'}
              </span>
            </div>

            {/* Plain English explanation */}
            <p className="mt-2 text-xs leading-relaxed text-slate-600">
              {risk.reason}
            </p>
          </div>
        );
      })}
    </div>
  );
}
