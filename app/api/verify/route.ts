import { NextRequest, NextResponse } from 'next/server';
import { recordHumanVerification } from '@/lib/evidence-memory';
import { VerificationSubmission } from '@/lib/schemas';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const comparisonId = typeof body?.comparisonId === 'string' ? body.comparisonId.trim() : '';
    const preference = body?.preference as VerificationSubmission['preference'];
    const notes = typeof body?.notes === 'string' ? body.notes.trim() : undefined;

    const validPreferences = ['RAW', 'CONTROLLED', 'CANDIDATE_A', 'CANDIDATE_B', 'SAME', 'NOT_SURE'];
    if (!comparisonId || !preference || !validPreferences.includes(preference)) {
      return NextResponse.json(
        { error: { code: 'INVALID_INPUT', message: 'Valid comparisonId and preference are required.' } },
        { status: 400 }
      );
    }

    const success = recordHumanVerification({
      comparisonId,
      preference,
      notes,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      success,
      comparisonId,
      preference,
      message: 'Listener verification recorded in evidence store.',
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`[Verify Route Error]: ${msg}`);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to record verification.' } },
      { status: 500 }
    );
  }
}
