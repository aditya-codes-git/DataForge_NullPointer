import { NextRequest, NextResponse } from 'next/server';
import { synthesizeWithRime } from '@/lib/rime';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const text = typeof body?.text === 'string' ? body.text.trim() : '';

    if (!text) {
      return NextResponse.json(
        { error: { code: 'INVALID_INPUT', message: 'Text is required for synthesis.' } },
        { status: 400 }
      );
    }

    const result = await synthesizeWithRime(text);

    if (!result.available) {
      return NextResponse.json(
        { error: { code: 'RIME_SYNTHESIS_FAILED', message: result.error || 'Failed to synthesize speech.' } },
        { status: 502 }
      );
    }

    return NextResponse.json(result);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`[Synthesize Route Error]: ${msg}`);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to process synthesis request.' } },
      { status: 500 }
    );
  }
}
