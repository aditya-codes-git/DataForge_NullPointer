import crypto from 'crypto';
import { synthesizeWithRime, RimeSynthesisResult, getPublicRimeConfig } from './rime';

export interface TtsExperimentCandidate {
  id: string;
  label: string;
  text: string;
}

export interface TtsExperimentResult {
  candidateId: string;
  label: string;
  text: string;
  audio: RimeSynthesisResult;
}

export interface FairExperimentOutcome {
  raw: TtsExperimentResult;
  candidates: TtsExperimentResult[];
  config: ReturnType<typeof getPublicRimeConfig>;
  totalSynthesisMs: number;
}

// In-memory cache for audio synthesis keyed by hash(text + model + voice + language + format)
const SYNTHESIS_CACHE = new Map<string, { result: RimeSynthesisResult; cachedAt: number }>();
const CACHE_TTL_MS = 1000 * 60 * 60; // 1 hour

function computeSynthesisKey(text: string, config: ReturnType<typeof getPublicRimeConfig>): string {
  const payload = `${text}|${config.model}|${config.voice}|${config.language}|${config.format}`;
  return crypto.createHash('sha256').update(payload).digest('hex');
}

/**
 * Synthesizes text with Rime, utilizing cache if available
 */
export async function synthesizeWithCache(text: string): Promise<RimeSynthesisResult> {
  const config = getPublicRimeConfig();
  const cacheKey = computeSynthesisKey(text, config);

  const cached = SYNTHESIS_CACHE.get(cacheKey);
  if (cached && Date.now() - cached.cachedAt < CACHE_TTL_MS) {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[Timing] Rime Synthesis Cache HIT: 0ms ("${text.slice(0, 25)}...")`);
    }
    return {
      ...cached.result,
      latencyMs: 0, // Cached hit
    };
  }

  const freshResult = await synthesizeWithRime(text);
  if (freshResult.available) {
    SYNTHESIS_CACHE.set(cacheKey, {
      result: freshResult,
      cachedAt: Date.now(),
    });
  }

  if (process.env.NODE_ENV !== 'production') {
    console.log(`[Timing] Rime Synthesis Live: ${freshResult.latencyMs}ms ("${text.slice(0, 25)}...")`);
  }

  return freshResult;
}

/**
 * TTS Experiment Runner
 *
 * Runs a fair experiment synthesizing RAW text alongside candidate(s)
 * under the identical Rime voice, model, format, and language configuration.
 */
export async function runFairTtsExperiment(
  rawText: string,
  candidateList: TtsExperimentCandidate[]
): Promise<FairExperimentOutcome> {
  const config = getPublicRimeConfig();
  const start = performance.now();

  // Run raw and candidates concurrently
  const [rawAudio, ...candidateAudios] = await Promise.all([
    synthesizeWithCache(rawText),
    ...candidateList.map((c) => synthesizeWithCache(c.text)),
  ]);

  const totalSynthesisMs = Math.round(performance.now() - start);

  if (process.env.NODE_ENV !== 'production') {
    console.log(`[Timing] Fair TTS Experiment Concurrent: ${totalSynthesisMs}ms total for ${candidateList.length + 1} stream(s)`);
  }

  const rawResult: TtsExperimentResult = {
    candidateId: 'raw',
    label: 'Original Written',
    text: rawText,
    audio: rawAudio,
  };

  const candidatesResult: TtsExperimentResult[] = candidateList.map((c, idx) => ({
    candidateId: c.id,
    label: c.label,
    text: c.text,
    audio: candidateAudios[idx],
  }));

  return {
    raw: rawResult,
    candidates: candidatesResult,
    config,
    totalSynthesisMs,
  };
}
