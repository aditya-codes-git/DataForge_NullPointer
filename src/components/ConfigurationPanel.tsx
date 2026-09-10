'use client';

import React from 'react';
import { RimeConfigPublic } from '@/lib/schemas';

interface ConfigurationPanelProps {
  config: RimeConfigPublic | null;
}

export function ConfigurationPanel({ config }: ConfigurationPanelProps) {
  const isConnected = config?.status === 'connected';

  return (
    <footer className="mt-8 border-t border-slate-200 pt-6 text-center">
      <div className="inline-flex flex-wrap items-center justify-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-1.5 text-xs text-slate-600">
        <span className="font-semibold text-slate-900">
          Rime {isConnected ? 'Connected ✓' : 'Unconfigured'}
        </span>
        <span className="text-slate-300">•</span>
        <span>
          Model: <strong className="font-mono text-slate-800">{config?.model || 'mistv3'}</strong>
        </span>
        <span className="text-slate-300">•</span>
        <span>
          Voice: <strong className="font-mono text-slate-800">{config?.voice || 'astra'}</strong>
        </span>
        <span className="text-slate-300">•</span>
        <span>
          Language: <strong className="font-mono text-slate-800">{config?.language || 'en'}</strong>
        </span>
      </div>
    </footer>
  );
}
