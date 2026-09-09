import { NextResponse } from 'next/server';
import { getPublicRimeConfig } from '@/lib/rime';

export const dynamic = 'force-dynamic';

export async function GET() {
  const rime = getPublicRimeConfig();
  const groqApiKey = process.env.GROQ_API_KEY;
  const groqModel = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';

  return NextResponse.json({
    rime,
    groq: {
      provider: 'Groq',
      model: groqModel,
      status: groqApiKey && groqApiKey.trim().length > 0 ? 'configured' : 'unconfigured',
    },
  });
}
