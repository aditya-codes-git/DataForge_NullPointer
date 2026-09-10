import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/components/auth/AuthProvider';
import { getStoredAnalyses, StoredAnalysisItem } from '@/lib/history-store';
import { RimeConfigPublic } from '@/lib/schemas';
import { getClientConfig, getLoadedClientConfig } from '@/lib/config-client';
import {
  Mic2,
  ArrowUpRight,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sliders,
  AudioWaveform,
} from 'lucide-react';

export default function DashboardOverviewPage() {
  const { userName } = useAuth();
  const [recentAnalyses, setRecentAnalyses] = useState<StoredAnalysisItem[]>(() => getStoredAnalyses().slice(0, 5));
  const [rimeConfig, setRimeConfig] = useState<RimeConfigPublic | null>(() => getLoadedClientConfig()?.rime || null);

  useEffect(() => {
    if (!rimeConfig) {
      getClientConfig().then((data) => {
        if (data?.rime) setRimeConfig(data.rime);
      });
    }
  }, [rimeConfig]);

  const isConnected = rimeConfig?.status === 'connected';

  // Greeting based on time of day
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="space-y-8">
      {/* Top Greeting Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-neutral-200 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black font-sans tracking-tight text-neutral-950 uppercase">
            {greeting}, {userName || 'Creator'}.
          </h1>
          <p className="text-xs text-neutral-500 font-sans mt-1">
            Check what your users will actually hear. Test pronunciation, resolve speech risks, and verify audio delivery.
          </p>
        </div>

        <Link
          to="/dashboard/analyze"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-neutral-950 hover:bg-indigo-600 text-white text-xs font-mono uppercase tracking-widest font-semibold transition-colors shadow-xs"
        >
          <Mic2 className="w-3.5 h-3.5" />
          <span>Analyze Text</span>
        </Link>
      </div>

      {/* Grid: Quick Access & Acoustic Engine Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Quick Start */}
        <div className="p-5 border border-neutral-200 bg-white space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-neutral-500 font-semibold">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>Interactive QA</span>
          </div>
          <p className="text-xs text-neutral-600 leading-relaxed font-sans">
            Run real-time pronunciation checks against PostgreSQL, version numbers, or Indian numbering formats.
          </p>
          <Link
            to="/dashboard/analyze"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-indigo-600 hover:text-indigo-800 font-semibold"
          >
            <span>Open Laboratory</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Card 2: Acoustic Model Status */}
        <div className="p-5 border border-neutral-200 bg-white space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-neutral-500 font-semibold">
              <AudioWaveform className="w-4 h-4 text-neutral-700" />
              <span>Acoustic Engine</span>
            </div>
            <span
              className={`inline-flex items-center gap-1.5 text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                isConnected
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-amber-50 text-amber-800 border-amber-200'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-emerald-500' : 'bg-amber-500'}`} />
              <span>{isConnected ? 'Rime Connected' : 'Rime Offline'}</span>
            </span>
          </div>

          <div className="space-y-1 text-xs font-mono text-neutral-600">
            <div className="flex justify-between">
              <span className="text-neutral-400">Model:</span>
              <span className="font-semibold text-neutral-800">{rimeConfig?.model || 'mistv3'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Voice:</span>
              <span className="font-semibold text-neutral-800">{rimeConfig?.voice || 'astra'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Language:</span>
              <span className="font-semibold text-neutral-800">{rimeConfig?.language?.toUpperCase() || 'EN'}</span>
            </div>
          </div>
        </div>

        {/* Card 3: Resources */}
        <div className="p-5 border border-neutral-200 bg-white space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-neutral-500 font-semibold">
            <Sliders className="w-4 h-4 text-neutral-700" />
            <span>Developer Guides</span>
          </div>
          <p className="text-xs text-neutral-600 leading-relaxed font-sans">
            Learn how deterministic rules and candidate generation prevent phoneme degradation.
          </p>
          <Link
            to="/dashboard/docs"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-neutral-900 hover:text-indigo-600 font-semibold"
          >
            <span>Read Documentation</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Recent Analyses Section */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-neutral-500" />
            <h2 className="text-sm font-mono uppercase tracking-wider font-bold text-neutral-900">
              Recent Analyses
            </h2>
          </div>
          {recentAnalyses.length > 0 && (
            <Link
              to="/dashboard/history"
              className="text-xs font-mono text-indigo-600 hover:text-indigo-800 font-semibold"
            >
              View all history →
            </Link>
          )}
        </div>

        {recentAnalyses.length > 0 ? (
          <div className="border border-neutral-200 bg-white divide-y divide-neutral-100">
            {recentAnalyses.map((item) => {
              const isControlled = item.decision === 'USE_CONTROLLED' || item.decision === 'CONTROLLED_PREFERRED';
              const isReview = item.decision === 'NEEDS_REVIEW';

              return (
                <Link
                  key={item.id}
                  to={`/dashboard/analyze?text=${encodeURIComponent(item.text)}`}
                  className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:bg-neutral-50/70 transition-colors group"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-sans text-neutral-900 font-medium truncate group-hover:text-indigo-600 transition-colors">
                      {item.text}
                    </p>
                    <div className="flex items-center gap-3 mt-1 text-[11px] font-mono text-neutral-400">
                      <span>{item.term || 'speech check'}</span>
                      <span>•</span>
                      <span>Voice: {item.voice}</span>
                      <span>•</span>
                      <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-mono px-2.5 py-0.5 rounded-full border ${
                        isControlled
                          ? 'bg-indigo-50 text-indigo-800 border-indigo-200'
                          : isReview
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      }`}
                    >
                      {isControlled ? (
                        <>
                          <CheckCircle2 className="w-3 h-3 text-indigo-600" />
                          <span>Controlled preferred</span>
                        </>
                      ) : isReview ? (
                        <>
                          <AlertTriangle className="w-3 h-3 text-amber-600" />
                          <span>Needs review</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>RAW preferred</span>
                        </>
                      )}
                    </span>
                    <ArrowUpRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-900 transition-colors" />
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="border border-dashed border-neutral-300 bg-neutral-50/50 p-10 text-center space-y-4">
            <div className="w-10 h-10 mx-auto rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400">
              <Mic2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold font-sans text-neutral-900">
                No analyses yet
              </h3>
              <p className="text-xs text-neutral-500 font-sans mt-1 max-w-sm mx-auto">
                Run your first speech check to inspect pronunciation risks and see results recorded here.
              </p>
            </div>
            <div>
              <Link
                to="/dashboard/analyze"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-neutral-950 hover:bg-indigo-600 text-white text-xs font-mono uppercase tracking-widest font-semibold transition-colors"
              >
                <Mic2 className="w-3.5 h-3.5" />
                <span>Analyze text</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
