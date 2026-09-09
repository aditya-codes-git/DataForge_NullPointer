'use client';

import React from 'react';
import { Volume2, ExternalLink, CheckCircle2 } from 'lucide-react';
import { RimeConfigPublic } from '@/lib/schemas';

interface HeaderProps {
  rimeConfig: RimeConfigPublic | null;
}

export function Header({ rimeConfig }: HeaderProps) {
  const isConnected = rimeConfig?.status === 'connected';

  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-30">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6">
        {/* Brand & Subtitle */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-sm">
            <Volume2 className="h-5 w-5" />
          </div>
          <div className="flex items-baseline gap-2.5">
            <h1 className="text-lg font-bold tracking-tight text-slate-900">SaySure</h1>
            <span className="hidden text-xs text-slate-400 sm:inline">|</span>
            <p className="hidden text-xs font-medium text-slate-500 sm:inline">
              Voice Delivery &amp; Pronunciation QA
            </p>
          </div>
        </div>

        {/* Minimal Actions & Rime Status */}
        <div className="flex items-center gap-4">
          {/* Observable Rime Status Badge */}
          <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs">
            <span className="relative flex h-2 w-2">
              {isConnected ? (
                <>
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                </>
              ) : (
                <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500"></span>
              )}
            </span>
            <span className="font-medium text-slate-700">
              {isConnected ? 'Rime Connected' : 'Rime Offline'}
            </span>
          </div>

          <a
            href="https://users.rime.ai/docs"
            target="_blank"
            rel="noreferrer"
            className="hidden items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-800 sm:flex"
          >
            <span>Documentation</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </header>
  );
}
