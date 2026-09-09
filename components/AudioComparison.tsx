'use client';

import React from 'react';
import { AudioPlayer } from './AudioPlayer';
import { ComparisonResult } from '@/lib/schemas';

interface AudioComparisonProps {
  comparison: ComparisonResult;
}

export function AudioComparison({ comparison }: AudioComparisonProps) {
  const { originalText, controlledText, rawAudio, controlledAudio } = comparison;

  return (
    <section className="space-y-4">
      <div>
        <h3 className="text-xl font-bold tracking-tight text-slate-900">
          Compare the audio
        </h3>
        <p className="mt-0.5 text-xs text-slate-500">
          Listen to synthetic voice delivery before and after SaySure normalization.
        </p>
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
          subtitle="Speech-ready text"
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
