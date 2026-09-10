import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { TextInput } from '@/components/TextInput';
import { RiskHighlights } from '@/components/RiskHighlights';
import { RiskList } from '@/components/RiskList';
import { ControlledText } from '@/components/ControlledText';
import { AudioComparison } from '@/components/AudioComparison';
import { VerificationPanel } from '@/components/VerificationPanel';
import { ConfigurationPanel } from '@/components/ConfigurationPanel';
import { LoadingState } from '@/components/LoadingState';
import { ErrorState } from '@/components/ErrorState';
import { ComparisonResult, RimeConfigPublic } from '@/lib/schemas';
import { saveAnalysisToHistory } from '@/lib/history-store';
import { getClientConfig, getLoadedClientConfig } from '@/lib/config-client';

export default function AnalyzePage() {
  const [searchParams] = useSearchParams();
  const initialPrompt = searchParams.get('text') || '';

  const [inputText, setInputText] = useState(initialPrompt);
  const [isLoading, setIsLoading] = useState(false);
  const [comparison, setComparison] = useState<ComparisonResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedRiskId, setSelectedRiskId] = useState<string | null>(null);
  const [rimeConfig, setRimeConfig] = useState<RimeConfigPublic | null>(() => getLoadedClientConfig()?.rime || null);

  useEffect(() => {
    if (!rimeConfig) {
      getClientConfig().then((data) => {
        if (data?.rime) setRimeConfig(data.rime);
      });
    }
  }, [rimeConfig]);

  const handleAnalyze = async (customText?: string) => {
    const textToRun = (customText || inputText).trim();
    if (!textToRun) return;

    const clickStart = performance.now();
    setIsLoading(true);
    setError(null);
    setSelectedRiskId(null);

    try {
      const netStart = performance.now();
      const res = await fetch('/api/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textToRun }),
      });

      const netMs = Math.round(performance.now() - netStart);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error?.message || `Request failed with status ${res.status}`);
      }

      setComparison(data);
      if (data.rime) {
        setRimeConfig(data.rime);
      }

      const totalMs = Math.round(performance.now() - clickStart);
      if (process.env.NODE_ENV !== 'production') {
        console.log(
          `[Timing] UI Click → Render Complete: ${totalMs}ms (API roundtrip: ${netMs}ms, Server: ${data.timing?.totalMs || 0}ms, Analysis: ${data.timing?.analysisMs || 0}ms, RAW audio: ${data.timing?.rawAudioMs || 0}ms, Controlled audio: ${data.timing?.controlledAudioMs || 0}ms)`
        );
      }

      // Persist real check to client history store
      saveAnalysisToHistory({
        text: textToRun,
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
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold font-sans tracking-tight text-neutral-950 uppercase">
          Analyze
        </h1>
        <p className="text-xs text-neutral-500 font-sans mt-1">
          Test speech risks, inspect acoustic transformations, and verify audio delivery with Rime TTS.
        </p>
      </div>

      <div className="space-y-10">
        {/* Section 1: Analyze text input */}
        <TextInput
          text={inputText}
          onChange={setInputText}
          onAnalyze={() => handleAnalyze()}
          isLoading={isLoading}
        />

        {/* Error notification */}
        {error && <ErrorState message={error} onDismiss={() => setError(null)} />}

        {/* Loading Spinner */}
        {isLoading && <LoadingState />}

        {/* Results Flow */}
        {comparison && !isLoading && (
          <div className="space-y-10">
            {/* Safety Warning Banner if sensitive credential detected */}
            {comparison.safetyWarning && (
              <div className="rounded-none border border-rose-200 bg-rose-50 p-4 text-xs text-rose-900 flex items-start gap-3">
                <span className="font-bold text-sm text-rose-600">⚠ Security Notice:</span>
                <div>{comparison.safetyWarning}</div>
              </div>
            )}

            {/* Section 2: Speech risks detected */}
            <section className="space-y-4">
              <div className="flex items-center gap-2.5">
                <h3 className="text-lg font-bold tracking-tight text-slate-900">
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
      </div>
    </div>
  );
}
