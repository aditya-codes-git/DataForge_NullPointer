import { NextRequest, NextResponse } from 'next/server';
import { analyzeSpeechRisks, detectSensitiveCredentials } from '@/lib/risk-detector';
import { generateControlledText } from '@/lib/controlled-text';
import { AnalysisResponse } from '@/lib/schemas';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const text = typeof body?.text === 'string' ? body.text.trim() : '';
    const domain = typeof body?.domain === 'string' ? body.domain : undefined;
    const language = typeof body?.language === 'string' ? body.language : undefined;
    const locale = typeof body?.locale === 'string' ? body.locale : undefined;

    if (!text) {
      return NextResponse.json(
        { error: { code: 'INVALID_INPUT', message: 'Text is required and cannot be empty.' } },
        { status: 400 }
      );
    }

    const safetyWarning = detectSensitiveCredentials(text);
    const risks = analyzeSpeechRisks(text);
    const controlled = await generateControlledText(text, risks, { domain, language, locale });

    const investigation = risks.map((r) => ({
      term: r.text,
      category: r.category,
      decision: r.decision || (r.investigationRequired ? 'INVESTIGATE' : 'NO_INTERVENTION'),
      reason: r.reason,
      candidates: r.candidates || [],
    }));

    const response: AnalysisResponse = {
      text,
      risks,
      investigation,
      candidates: controlled.candidates || [],
      reviewRequired: controlled.reviewRequired,
      safetyWarning,
    };

    return NextResponse.json(response);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`[Analyze Route Error]: ${msg}`);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to analyze text.' } },
      { status: 500 }
    );
  }
}
