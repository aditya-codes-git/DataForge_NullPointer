import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables (.env.local takes precedence)
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config();

import { getPublicRimeConfig } from '../src/lib/rime';
import { analyzeSpeechRisks, detectSensitiveCredentials } from '../src/lib/risk-detector';
import { generateControlledText } from '../src/lib/controlled-text';
import { runFairTtsExperiment, synthesizeWithCache } from '../src/lib/tts-runner';
import { recordEvidence, recordHumanVerification } from '../src/lib/evidence-memory';
import { AnalysisResponse, ComparisonResult, CandidateItem } from '../src/lib/schemas';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '2mb' }));

// Health / Status & Public Config
app.get('/api/config', (_req, res) => {
  const rime = getPublicRimeConfig();
  const groqApiKey = process.env.GROQ_API_KEY;
  const groqModel = process.env.GROQ_MODEL || 'qwen/qwen3.8-27b';

  res.json({
    rime,
    groq: {
      provider: 'Groq',
      model: groqModel,
      status: groqApiKey && groqApiKey.trim().length > 0 ? 'configured' : 'unconfigured',
    },
  });
});

// Speech Risk Analysis
app.post('/api/analyze', async (req, res) => {
  try {
    const text = typeof req.body?.text === 'string' ? req.body.text.trim() : '';
    const domain = typeof req.body?.domain === 'string' ? req.body.domain : undefined;
    const language = typeof req.body?.language === 'string' ? req.body.language : undefined;
    const locale = typeof req.body?.locale === 'string' ? req.body.locale : undefined;

    if (!text) {
      return res.status(400).json({
        error: { code: 'INVALID_INPUT', message: 'Text is required and cannot be empty.' },
      });
    }

    const start = performance.now();
    const safetyWarning = detectSensitiveCredentials(text);
    const risks = analyzeSpeechRisks(text);
    const controlled = await generateControlledText(text, risks, { domain, language, locale });
    const durationMs = Math.round(performance.now() - start);

    if (process.env.NODE_ENV !== 'production') {
      console.log(`[Timing] POST /api/analyze: ${durationMs}ms for ${risks.length} risk(s)`);
    }

    const investigation = risks.map((r) => ({
      term: r.text,
      category: r.category,
      decision: r.decision || (r.investigationRequired ? 'INVESTIGATE' : 'NO_INTERVENTION'),
      reason: r.reason,
      candidates: r.candidates || [],
    }));

    const response: AnalysisResponse = {
      text,
      controlledText: controlled.controlledText,
      risks,
      investigation,
      candidates: controlled.candidates || [],
      reviewRequired: controlled.reviewRequired,
      safetyWarning,
    };

    return res.json(response);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`[Analyze Route Error]: ${msg}`);
    return res.status(500).json({
      error: { code: 'INTERNAL_ERROR', message: 'Failed to analyze text.' },
    });
  }
});

// Acoustic Comparison with Rime TTS
app.post('/api/compare', async (req, res) => {
  const startTotal = performance.now();

  try {
    const text = typeof req.body?.text === 'string' ? req.body.text.trim() : '';
    const domain = typeof req.body?.domain === 'string' ? req.body.domain : undefined;
    const locale = typeof req.body?.locale === 'string' ? req.body.locale : undefined;

    if (!text) {
      return res.status(400).json({
        error: { code: 'INVALID_INPUT', message: 'Text payload is required and cannot be empty.' },
      });
    }

    if (text.length > 2000) {
      return res.status(400).json({
        error: { code: 'PAYLOAD_TOO_LARGE', message: 'Input text exceeds the 2,000 character limit.' },
      });
    }

    // 1. Analyze speech risks
    const analysisStart = performance.now();
    const risks = analyzeSpeechRisks(text);

    // 2. Generate controlled text & candidate options
    const controlledResult = await generateControlledText(text, risks, { domain, locale });
    const analysisMs = Math.round(performance.now() - analysisStart);

    // 3. Fair TTS Experiment Runner
    // Synthesizes RAW and candidate(s) concurrently under identical settings
    const experiment = await runFairTtsExperiment(text, [
      {
        id: 'candidate-1',
        label: 'Speech-Ready Candidate',
        text: controlledResult.controlledText,
      },
    ]);

    const totalMs = Math.round(performance.now() - startTotal);

    if (process.env.NODE_ENV !== 'production') {
      console.log(
        `[Timing] POST /api/compare: ${totalMs}ms (Analysis: ${analysisMs}ms, Rime Raw: ${experiment.raw.audio.latencyMs}ms, Rime Candidate: ${experiment.candidates[0]?.audio?.latencyMs || 0}ms, Total Synthesis: ${experiment.totalSynthesisMs}ms)`
      );
    }

    const candidates: CandidateItem[] = [
      {
        type: 'raw',
        label: 'Original Written',
        text,
      },
      {
        type: 'controlled',
        label: 'Speech-Ready Candidate',
        text: controlledResult.controlledText,
      },
    ];

    // 4. Record provenance in Evidence Memory Layer
    const evidence = recordEvidence({
      term: risks[0]?.text || 'general_text',
      originalText: text,
      riskCategory: risks[0]?.category || 'domain_term',
      candidate: controlledResult.controlledText,
      rimeConfig: {
        model: experiment.config.model,
        voice: experiment.config.voice,
        language: experiment.config.language,
        format: experiment.config.format,
      },
      evaluationMethod: 'deterministic_rules',
      decision: controlledResult.decision.status,
      verificationStatus: controlledResult.reviewRequired ? 'unconfirmed' : 'verified',
      benchmarkVersion: 'v1.0',
    });

    const rawAudio = experiment.raw.audio;
    const controlledAudio = experiment.candidates[0]?.audio || {
      available: false,
      mimeType: experiment.config.format,
      latencyMs: 0,
      error: 'Candidate audio unavailable',
    };

    const result: ComparisonResult = {
      originalText: text,
      controlledText: controlledResult.controlledText,
      candidates,
      rankedCandidates: controlledResult.candidates,
      risks,
      transformations: controlledResult.changes,
      changes: controlledResult.changes,
      decision: controlledResult.decision,
      reviewRequired: controlledResult.reviewRequired,
      reviewReasons: controlledResult.reviewReasons,
      safetyWarning: controlledResult.safetyWarning,
      evidenceId: evidence.id,
      rawAudio,
      controlledAudio,
      rime: experiment.config,
      timing: {
        analysisMs,
        rawAudioMs: rawAudio.latencyMs,
        controlledAudioMs: controlledAudio.latencyMs,
        totalMs,
      },
    };

    return res.json(result);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`[Compare Route Error]: ${msg}`);
    return res.status(500).json({
      error: { code: 'INTERNAL_ERROR', message: 'An error occurred while processing the comparison.' },
    });
  }
});

// Direct Rime Speech Synthesis
app.post('/api/synthesize', async (req, res) => {
  try {
    const text = typeof req.body?.text === 'string' ? req.body.text.trim() : '';
    if (!text) {
      return res.status(400).json({ error: 'Text is required for synthesis' });
    }
    const result = await synthesizeWithCache(text);
    return res.json(result);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`[Synthesize Route Error]: ${msg}`);
    return res.status(500).json({ error: 'Failed to synthesize speech' });
  }
});

// Listener Verification
app.post('/api/verify', (req, res) => {
  try {
    const comparisonId = typeof req.body?.comparisonId === 'string' ? req.body.comparisonId : '';
    const preference = req.body?.preference;
    const notes = typeof req.body?.notes === 'string' ? req.body.notes : undefined;

    if (!comparisonId || !preference) {
      return res.status(400).json({
        error: { code: 'INVALID_INPUT', message: 'comparisonId and preference are required.' },
      });
    }

    const validPreferences = ['RAW', 'CONTROLLED', 'CANDIDATE_A', 'CANDIDATE_B', 'SAME', 'NOT_SURE', 'EQUAL', 'NEITHER'];
    if (!validPreferences.includes(preference)) {
      return res.status(400).json({
        error: { code: 'INVALID_PREFERENCE', message: 'Invalid listener preference option.' },
      });
    }

    const success = recordHumanVerification({
      comparisonId,
      preference: preference as any,
      notes,
      timestamp: new Date().toISOString(),
    });

    return res.json({
      success,
      comparisonId,
      preference,
      message: 'Listener verification recorded in evidence store.',
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: msg } });
  }
});

// Export app for testing & run server if executed directly
export { app };

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`[SaySure API Server] running on http://localhost:${PORT}`);
  });
}
