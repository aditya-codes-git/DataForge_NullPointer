'use client';

import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

export interface PresetCase {
  id: string;
  name: string;
  text: string;
}

export const PRESET_CASES: PresetCase[] = [
  {
    id: 'case-1',
    name: 'Identifier + Currency',
    text: 'Your verification code is A12B9X7 and your total is ₹1,25,000.',
  },
  {
    id: 'case-2',
    name: 'HTTP 429 + Kubernetes',
    text: 'HTTP 429 occurred while connecting to Kubernetes.',
  },
  {
    id: 'case-3',
    name: 'Clean sentence',
    text: 'Hello, how are you today?',
  },
  {
    id: 'case-4',
    name: 'Ambiguous term',
    text: 'The customer requested a refund for product XyloQ.',
  },
];

interface TextInputProps {
  text: string;
  onChange: (val: string) => void;
  onAnalyze: () => void;
  isLoading: boolean;
}

export function TextInput({ text, onChange, onAnalyze, isLoading }: TextInputProps) {
  return (
    <section className="space-y-4">
      {/* Section Titles */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Analyze your text
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Check what your users will actually hear.
        </p>
      </div>

      {/* Main Input Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
        <textarea
          value={text}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste or write text here to test pronunciation and speech delivery..."
          rows={3}
          className="w-full resize-y rounded-lg border-0 p-0 text-base text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-0"
        />

        {/* Bottom Toolbar: Presets & Action Button */}
        <div className="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Preset Buttons */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-medium text-slate-400 mr-1">Examples:</span>
            {PRESET_CASES.map((preset) => {
              const isActive = text === preset.text;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => onChange(preset.text)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                    isActive
                      ? 'border border-indigo-200 bg-indigo-50 text-indigo-700'
                      : 'border border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  {preset.name}
                </button>
              );
            })}
          </div>

          {/* Primary Action */}
          <button
            onClick={onAnalyze}
            disabled={isLoading || !text.trim()}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                <span>Synthesizing...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>Analyze Speech</span>
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
