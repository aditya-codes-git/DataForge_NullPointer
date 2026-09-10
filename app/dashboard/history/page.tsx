'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getStoredAnalyses, StoredAnalysisItem } from '@/lib/history-store';
import { Search, Filter, Mic2, ArrowUpRight, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function HistoryPage() {
  const [analyses, setAnalyses] = useState<StoredAnalysisItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDecision, setFilterDecision] = useState<string>('all');

  useEffect(() => {
    setAnalyses(getStoredAnalyses());
  }, []);

  const filteredAnalyses = analyses.filter((item) => {
    const matchesSearch =
      item.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.term && item.term.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (filterDecision === 'all') return true;
    if (filterDecision === 'controlled') {
      return item.decision === 'USE_CONTROLLED' || item.decision === 'CONTROLLED_PREFERRED';
    }
    if (filterDecision === 'raw') {
      return item.decision === 'KEEP_RAW' || item.decision === 'SAME_AS_RAW';
    }
    if (filterDecision === 'review') {
      return item.decision === 'NEEDS_REVIEW';
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-neutral-200 pb-6">
        <div>
          <h1 className="text-2xl font-bold font-sans tracking-tight text-neutral-950 uppercase">
            Analysis History
          </h1>
          <p className="text-xs text-neutral-500 font-sans mt-1">
            Review previous speech checks, detected phonetic risks, and their listener decisions.
          </p>
        </div>

        <Link
          href="/dashboard/analyze"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-neutral-950 hover:bg-indigo-600 text-white text-xs font-mono uppercase tracking-wider font-semibold transition-colors"
        >
          <Mic2 className="w-3.5 h-3.5" />
          <span>New check</span>
        </Link>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search checks..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-neutral-300 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 rounded-none placeholder-neutral-400 font-sans"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          {[
            { id: 'all', label: 'All' },
            { id: 'controlled', label: 'Controlled preferred' },
            { id: 'raw', label: 'RAW preferred' },
            { id: 'review', label: 'Needs review' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilterDecision(f.id)}
              className={`px-3 py-1.5 text-xs font-mono tracking-wide whitespace-nowrap transition-colors border ${
                filterDecision === f.id
                  ? 'bg-neutral-950 text-white border-neutral-950 font-semibold'
                  : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-400'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* History List or Empty State */}
      {filteredAnalyses.length > 0 ? (
        <div className="border border-neutral-200 bg-white divide-y divide-neutral-100">
          <div className="hidden sm:grid grid-cols-12 gap-4 px-4 py-2.5 bg-neutral-50 text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-semibold border-b border-neutral-100">
            <span className="col-span-6">Text &amp; Risk</span>
            <span className="col-span-3">Decision</span>
            <span className="col-span-2">Voice</span>
            <span className="col-span-1 text-right">Date</span>
          </div>

          {filteredAnalyses.map((item) => {
            const isControlled = item.decision === 'USE_CONTROLLED' || item.decision === 'CONTROLLED_PREFERRED';
            const isReview = item.decision === 'NEEDS_REVIEW';

            return (
              <Link
                key={item.id}
                href={`/dashboard/analyze?text=${encodeURIComponent(item.text)}`}
                className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 p-4 hover:bg-neutral-50/70 transition-colors group items-center"
              >
                <div className="sm:col-span-6 min-w-0">
                  <p className="text-sm font-sans font-medium text-neutral-900 truncate group-hover:text-indigo-600 transition-colors">
                    {item.text}
                  </p>
                  <span className="text-[11px] font-mono text-neutral-400">
                    Category: {item.category || 'domain_term'}
                  </span>
                </div>

                <div className="sm:col-span-3">
                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-full border ${
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
                        <span>Controlled</span>
                      </>
                    ) : isReview ? (
                      <>
                        <AlertTriangle className="w-3 h-3 text-amber-600" />
                        <span>Needs review</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>RAW</span>
                      </>
                    )}
                  </span>
                </div>

                <div className="sm:col-span-2 text-xs font-mono text-neutral-600">
                  {item.voice}
                </div>

                <div className="sm:col-span-1 text-right text-xs font-mono text-neutral-400">
                  {new Date(item.timestamp).toLocaleDateString()}
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="border border-dashed border-neutral-300 bg-neutral-50/50 p-12 text-center space-y-4">
          <div className="w-10 h-10 mx-auto rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400">
            <Search className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold font-sans text-neutral-900">
              No analysis history found
            </h3>
            <p className="text-xs text-neutral-500 font-sans mt-1 max-w-sm mx-auto">
              {searchQuery
                ? 'No previous speech checks match your search criteria.'
                : 'Analyses run in the laboratory will automatically be archived here.'}
            </p>
          </div>
          <div>
            <Link
              href="/dashboard/analyze"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-neutral-950 hover:bg-indigo-600 text-white text-xs font-mono uppercase tracking-widest font-semibold transition-colors"
            >
              <Mic2 className="w-3.5 h-3.5" />
              <span>Run your first check</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
