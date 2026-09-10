import { RimeConfigPublic } from './schemas';

export interface RimeSynthesisResult {
  available: boolean;
  dataUri?: string;
  mimeType: string;
  latencyMs: number;
  error?: string;
}

export function getPublicRimeConfig(): RimeConfigPublic {
  const apiKey = process.env.RIME_API_KEY;
  const model = process.env.RIME_MODEL || 'mistv3';
  const voice = process.env.RIME_VOICE || 'astra';
  const language = process.env.RIME_LANGUAGE || 'en';
  const format = process.env.RIME_AUDIO_FORMAT || 'audio/mpeg';

  return {
    provider: 'Rime',
    model,
    voice,
    language,
    format,
    status: apiKey && apiKey.trim().length > 0 ? 'connected' : 'unconfigured',
  };
}

export async function synthesizeWithRime(text: string): Promise<RimeSynthesisResult> {
  const apiKey = process.env.RIME_API_KEY;
  const endpoint = process.env.RIME_ENDPOINT || 'https://users.rime.ai/v1/rime-tts';
  const model = process.env.RIME_MODEL || 'mistv3';
  const voice = process.env.RIME_VOICE || 'astra';
  const language = process.env.RIME_LANGUAGE || 'en';
  const acceptFormat = process.env.RIME_AUDIO_FORMAT || 'audio/mpeg';

  if (!apiKey || apiKey.trim().length === 0) {
    return {
      available: false,
      mimeType: acceptFormat,
      latencyMs: 0,
      error: 'RIME_API_KEY is not configured on the server. Please add it to .env.local to enable live synthesis.',
    };
  }

  if (!text || text.trim().length === 0) {
    return {
      available: false,
      mimeType: acceptFormat,
      latencyMs: 0,
      error: 'Input text cannot be empty for synthesis.',
    };
  }

  const startTime = performance.now();

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Accept': acceptFormat,
      },
      body: JSON.stringify({
        speaker: voice,
        text: text,
        modelId: model,
        lang: language,
      }),
    });

    const latencyMs = Math.round(performance.now() - startTime);

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`[Rime TTS Error] HTTP ${response.status}: ${errorBody}`);
      return {
        available: false,
        mimeType: acceptFormat,
        latencyMs,
        error: `Rime API error (${response.status}): ${response.statusText || 'Speech synthesis failed'}`,
      };
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Audio = buffer.toString('base64');
    const dataUri = `data:${acceptFormat};base64,${base64Audio}`;

    return {
      available: true,
      dataUri,
      mimeType: acceptFormat,
      latencyMs,
    };
  } catch (err: unknown) {
    const latencyMs = Math.round(performance.now() - startTime);
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`[Rime Exception]: ${msg}`);
    return {
      available: false,
      mimeType: acceptFormat,
      latencyMs,
      error: `Network error connecting to Rime TTS: ${msg}`,
    };
  }
}
