import { NextRequest, NextResponse } from 'next/server';
import { analyzeSpeechRisks } from '@/lib/risk-detector';
import { generateControlledText } from '@/lib/controlled-text';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const text = typeof body?.text === 'string' ? body.text.trim() : '';

    if (!text) {
      return NextResponse.json(
        { error: { code: 'INVALID_INPUT', message: 'Text is required.' } },
        { status: 400 }
      );
    }

    const risks = analyzeSpeechRisks(text);
    const controlled = await generateControlledText(text, risks);

    return NextResponse.json({
      originalText: text,
      controlledText: controlled.controlledText,
      risks,
      changes: controlled.changes,
      reviewRequired: controlled.reviewRequired,
      reviewReasons: controlled.reviewReasons,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`[Analyze Route Error]: ${msg}`);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to analyze text.' } },
      { status: 500 }
    );
  }
}
