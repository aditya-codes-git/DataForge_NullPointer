import { NextRequest, NextResponse } from 'next/server';
import { analyzeSpeechRisks } from '@/lib/risk-detector';
import { generateControlledText } from '@/lib/controlled-text';
import { synthesizeWithRime, getPublicRimeConfig } from '@/lib/rime';
import { ComparisonResult } from '@/lib/schemas';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const startTotal = performance.now();

  try {
    const body = await req.json();
    const text = typeof body?.text === 'string' ? body.text.trim() : '';

    if (!text) {
      return NextResponse.json(
        { error: { code: 'INVALID_INPUT', message: 'Text payload is required and cannot be empty.' } },
        { status: 400 }
      );
    }

    if (text.length > 2000) {
      return NextResponse.json(
        { error: { code: 'PAYLOAD_TOO_LARGE', message: 'Input text exceeds the 2,000 character MVP limit.' } },
        { status: 400 }
      );
    }

    // 1. Analyze speech risks
    const analysisStart = performance.now();
    const risks = analyzeSpeechRisks(text);

    // 2. Generate controlled text
    const controlledResult = await generateControlledText(text, risks);
    const analysisMs = Math.round(performance.now() - analysisStart);

    // 3. Synthesize both RAW and CONTROLLED versions with Rime
    // Running both concurrently for optimal user experience
    const [rawAudio, controlledAudio] = await Promise.all([
      synthesizeWithRime(text),
      synthesizeWithRime(controlledResult.controlledText),
    ]);

    const totalMs = Math.round(performance.now() - startTotal);

    const candidates = [
      {
        type: 'raw' as const,
        label: 'Original Written',
        text,
      },
      {
        type: 'controlled' as const,
        label: 'Speech-Ready Candidate',
        text: controlledResult.controlledText,
      },
    ];

    const result: ComparisonResult = {
      originalText: text,
      controlledText: controlledResult.controlledText,
      candidates,
      risks,
      transformations: controlledResult.changes,
      changes: controlledResult.changes,
      decision: controlledResult.decision,
      reviewRequired: controlledResult.reviewRequired,
      reviewReasons: controlledResult.reviewReasons,
      rawAudio,
      controlledAudio,
      rime: getPublicRimeConfig(),
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
