'use client';

import React from 'react';
import { AudioPlayer } from './AudioPlayer';
import { ComparisonResult } from '@/lib/schemas';
import { CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react';

interface AudioComparisonProps {
  comparison: ComparisonResult;
}

export function AudioComparison({ comparison }: AudioComparisonProps) {
  const { originalText, controlledText, rawAudio, controlledAudio, decision, reviewRequired } = comparison;

  const renderDecisionBadge = () => {
    const status = decision?.status || (reviewRequired ? 'NEEDS_REVIEW' : 'USE_CONTROLLED');
    switch (status) {
      case 'USE_CONTROLLED':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
            Controlled recommended
          </span>
        );
      case 'KEEP_RAW':
      case 'SAME_AS_RAW':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-200 bg-sky-50 px-2.5 py-0.5 text-xs font-semibold text-sky-800">
            <ShieldCheck className="h-3.5 w-3.5 text-sky-600" />
            Keep RAW
          </span>
        );
      case 'NEEDS_REVIEW':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
            <AlertCircle className="h-3.5 w-3.5 text-amber-600" />
            Needs review
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-xl font-bold tracking-tight text-slate-900">
            Auditory Comparison
          </h3>
          <p className="mt-0.5 text-xs text-slate-500">
            Listen to both versions synthesized through the exact same Rime configuration (model: mistv3, voice: astra).
          </p>
        </div>
        <div>
          {renderDecisionBadge()}
        </div>
      </div>

      {/* Side-by-side cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <AudioPlayer
          title="RAW"
          subtitle="Original written text"
          text={originalText}
          isControlled={false}
          audioDataUri={rawAudio?.dataUri}
          latencyMs={rawAudio?.latencyMs}
          error={rawAudio?.error}
          isAvailable={Boolean(rawAudio?.available)}
        />

        <AudioPlayer
          title="CONTROLLED"
          subtitle="Speech-ready candidate"
          text={controlledText}
          isControlled={true}
          audioDataUri={controlledAudio?.dataUri}
          latencyMs={controlledAudio?.latencyMs}
          error={controlledAudio?.error}
          isAvailable={Boolean(controlledAudio?.available)}
        />
      </div>
    </section>
  );
}
