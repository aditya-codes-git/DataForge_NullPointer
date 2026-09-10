'use client';

import React, { useState, useEffect } from 'react';
import { Header } from './Header';
import { TextInput, PRESET_CASES } from './TextInput';
import { RiskHighlights } from './RiskHighlights';
import { RiskList } from './RiskList';
import { ControlledText } from './ControlledText';
import { AudioComparison } from './AudioComparison';
import { VerificationPanel } from './VerificationPanel';
import { ConfigurationPanel } from './ConfigurationPanel';
import { LoadingState } from './LoadingState';
import { ErrorState } from './ErrorState';
import { ComparisonResult, RimeConfigPublic } from '@/lib/schemas';
import { saveAnalysisToHistory } from '@/lib/history-store';
import { getClientConfig, getLoadedClientConfig } from '@/lib/config-client';

export function Dashboard() {
  // Textarea starts completely empty on initial load/refresh
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [comparison, setComparison] = useState<ComparisonResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedRiskId, setSelectedRiskId] = useState<string | null>(null);
  const [rimeConfig, setRimeConfig] = useState<RimeConfigPublic | null>(() => getLoadedClientConfig()?.rime || null);

  // Fetch initial public server config via singleton cache
  useEffect(() => {
    if (!rimeConfig) {
      getClientConfig().then((data) => {
        if (data?.rime) setRimeConfig(data.rime);
      });
    }
  }, [rimeConfig]);

  const handleAnalyze = async () => {
    if (!inputText.trim()) return;

    setIsLoading(true);
    setError(null);
    setSelectedRiskId(null);

    try {
      const res = await fetch('/api/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error?.message || `Request failed with status ${res.status}`);
      }

      setComparison(data);
      if (data.rime) {
        setRimeConfig(data.rime);
      }

      // Persist real check to client history store
      saveAnalysisToHistory({
        text: inputText.trim(),
        term: data.risks?.[0]?.text || 'general_term',
        category: data.risks?.[0]?.category || 'domain_term',
        decision: data.decision?.status || (data.reviewRequired ? 'NEEDS_REVIEW' : 'CONTROLLED_PREFERRED'),
        voice: data.rime?.voice || 'astra',
        risksCount: data.risks?.length || 0,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An unexpected error occurred.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Header */}
      <Header rimeConfig={rimeConfig} />

      {/* Main Container */}
      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 space-y-10">
        {/* Section 1: Analyze your text */}
        <TextInput
          text={inputText}
          onChange={setInputText}
          onAnalyze={handleAnalyze}
          isLoading={isLoading}
        />

        {/* Error notification */}
        {error && (
          <ErrorState message={error} onDismiss={() => setError(null)} />
        )}

        {/* Loading Spinner */}
        {isLoading && <LoadingState />}

        {/* Results Flow */}
        {comparison && !isLoading && (
          <div className="space-y-10">
            {/* Safety Warning Banner if sensitive credential detected */}
            {comparison.safetyWarning && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-900 flex items-start gap-3">
                <span className="font-bold text-sm text-rose-600">⚠ Security Notice:</span>
                <div>{comparison.safetyWarning}</div>
              </div>
            )}

            {/* Section 2: Speech risks detected */}
            <section className="space-y-4">
              <div className="flex items-center gap-2.5">
                <h3 className="text-xl font-bold tracking-tight text-slate-900">
                  Speech risks detected
                </h3>
                <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
                  {comparison.risks.length} item{comparison.risks.length === 1 ? '' : 's'} investigated
                </span>
              </div>

              {/* Highlighted original text */}
              <RiskHighlights
                text={comparison.originalText}
                risks={comparison.risks}
                selectedRiskId={selectedRiskId}
                onSelectRisk={setSelectedRiskId}
              />

              {/* Explanations */}
              <RiskList
                risks={comparison.risks}
                selectedRiskId={selectedRiskId}
                onSelectRisk={setSelectedRiskId}
              />
            </section>

            {/* Section 3: Investigation & Candidates */}
            <ControlledText
              originalText={comparison.originalText}
              controlledText={comparison.controlledText}
              transformations={comparison.transformations || comparison.changes || []}
              decision={comparison.decision}
              reviewRequired={comparison.reviewRequired}
              reviewReasons={comparison.reviewReasons}
            />

            {/* Section 4: Audio comparison (The Centerpiece) */}
            <AudioComparison comparison={comparison} />

            {/* Section 5: Verification */}
            <VerificationPanel comparisonId={comparison.evidenceId} />
          </div>
        )}

        {/* Section 6: Rime Configuration footer card */}
        <ConfigurationPanel config={rimeConfig} />
      </main>
    </div>
  );
}
