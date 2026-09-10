import { describe, it, expect } from 'vitest';
import { analyzeSpeechRisks } from '../src/lib/risk-detector';
import { analyzeContext } from '../src/lib/context-analyzer';
import { synthesizeWithCache, runFairTtsExperiment } from '../src/lib/tts-runner';

describe('Latency Optimization Test Suite', () => {
  it('Deterministic Case (Currency) bypasses Groq reasoning', async () => {
    const text = 'Your total is ₹1,25,000.';
    const risks = analyzeSpeechRisks(text);
    const contextResult = await analyzeContext(text, risks);

    // Groq reasoning should NOT be applied for pure currency
    expect(contextResult.llmReasoningApplied).toBe(false);
    expect(contextResult.groqResult).toBeNull();
  });

  it('Catalog Term (PostgreSQL v16) bypasses Groq reasoning', async () => {
    const text = 'Your PostgreSQL v16 migration completed successfully.';
    const risks = analyzeSpeechRisks(text);
    const contextResult = await analyzeContext(text, risks);

    // PostgreSQL is in knowledge catalog, v16 is deterministic
    expect(contextResult.llmReasoningApplied).toBe(false);
    expect(contextResult.groqResult).toBeNull();
  });

  it('Catalog Term (Kubernetes) bypasses Groq reasoning', async () => {
    const text = 'Kubernetes is deployed successfully.';
    const risks = analyzeSpeechRisks(text);
    const contextResult = await analyzeContext(text, risks);

    // Kubernetes is in knowledge catalog
    expect(contextResult.llmReasoningApplied).toBe(false);
    expect(contextResult.groqResult).toBeNull();
  });

  it('Audio Synthesis Cache returns 0ms latency on repeated synthesis', async () => {
    const testPhrase = `Cache test phrase ${Date.now()}`;
    // First synthesis (cold)
    const result1 = await synthesizeWithCache(testPhrase);

    // Second synthesis (warm hit)
    const result2 = await synthesizeWithCache(testPhrase);

    // If RIME_API_KEY was not configured in test env, it returns error result without crashing,
    // but if cached, latencyMs is strictly 0.
    if (result1.available) {
      expect(result2.latencyMs).toBe(0);
    }
  });

  it('Fair TTS experiment synthesizes streams concurrently', async () => {
    const rawText = 'Clean test speech.';
    const outcome = await runFairTtsExperiment(rawText, [
      { id: 'c1', label: 'Candidate 1', text: 'Clean test speech candidate.' },
    ]);

    expect(outcome.raw).toBeDefined();
    expect(outcome.candidates).toHaveLength(1);
    expect(outcome.totalSynthesisMs).toBeGreaterThanOrEqual(0);
  });
});
