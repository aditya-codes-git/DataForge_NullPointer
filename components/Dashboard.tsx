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

export function Dashboard() {
  // Default to Case 1 for an immediate, impressive demo out of the box
  const [inputText, setInputText] = useState(PRESET_CASES[0].text);
  const [isLoading, setIsLoading] = useState(false);
  const [comparison, setComparison] = useState<ComparisonResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedRiskId, setSelectedRiskId] = useState<string | null>(null);
  const [rimeConfig, setRimeConfig] = useState<RimeConfigPublic | null>(null);

  // Fetch initial public server config
  useEffect(() => {
    fetch('/api/config')
      .then((res) => res.json())
      .then((data) => {
        if (data?.rime) setRimeConfig(data.rime);
      })
      .catch((err) => console.error('[Config Fetch Error]:', err));
  }, []);

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
            {/* Section 2: Speech risks detected */}
            <section className="space-y-4">
              <div className="flex items-center gap-2.5">
                <h3 className="text-xl font-bold tracking-tight text-slate-900">
                  Speech risks detected
                </h3>
                <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
                  {comparison.risks.length} issue{comparison.risks.length === 1 ? '' : 's'} found
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

            {/* Section 3: Speech-ready version */}
            <ControlledText
              originalText={comparison.originalText}
              controlledText={comparison.controlledText}
              changes={comparison.changes}
              reviewRequired={comparison.reviewRequired}
              reviewReasons={comparison.reviewReasons}
            />

            {/* Section 4: Audio comparison (The Centerpiece) */}
            <AudioComparison comparison={comparison} />

            {/* Section 5: Verification */}
            <VerificationPanel />
          </div>
        )}

        {/* Section 6: Rime Configuration footer card */}
        <ConfigurationPanel config={rimeConfig} />
      </main>
    </div>
  );
}
