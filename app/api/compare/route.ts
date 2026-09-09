import { NextRequest, NextResponse } from 'next/server';
import { analyzeSpeechRisks } from '@/lib/risk-detector';
import { generateControlledText } from '@/lib/controlled-text';
import { runFairTtsExperiment } from '@/lib/tts-runner';
import { recordEvidence } from '@/lib/evidence-memory';
import { ComparisonResult, CandidateItem } from '@/lib/schemas';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const startTotal = performance.now();

  try {
    const body = await req.json();
    const text = typeof body?.text === 'string' ? body.text.trim() : '';
    const domain = typeof body?.domain === 'string' ? body.domain : undefined;
    const locale = typeof body?.locale === 'string' ? body.locale : undefined;

    if (!text) {
      return NextResponse.json(
        { error: { code: 'INVALID_INPUT', message: 'Text payload is required and cannot be empty.' } },
        { status: 400 }
      );
    }

    if (text.length > 2000) {
      return NextResponse.json(
        { error: { code: 'PAYLOAD_TOO_LARGE', message: 'Input text exceeds the 2,000 character limit.' } },
        { status: 400 }
      );
    }

    // 1. Analyze speech risks
    const analysisStart = performance.now();
    const risks = analyzeSpeechRisks(text);

    // 2. Generate controlled text & candidate options
    const controlledResult = await generateControlledText(text, risks, { domain, locale });
    const analysisMs = Math.round(performance.now() - analysisStart);

    // 3. Fair TTS Experiment Runner
    // Synthesizes RAW and candidate(s) under identical Rime model, voice, and format settings
    const experiment = await runFairTtsExperiment(text, [
      {
        id: 'candidate-1',
        label: 'Speech-Ready Candidate',
        text: controlledResult.controlledText,
      },
    ]);

    const totalMs = Math.round(performance.now() - startTotal);

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

    return NextResponse.json(result);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`[Compare Route Error]: ${msg}`);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'An error occurred while processing the comparison.' } },
      { status: 500 }
    );
  }
}
