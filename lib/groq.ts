import { SpeechRisk, Transformation } from './schemas';
import { SPEECH_ANALYSIS_SYSTEM_PROMPT, createControlledTextPrompt } from '../prompts/speech-analysis';

export interface GroqReasoningResult {
  controlledText: string;
  changes: Transformation[];
  reviewRequired: boolean;
}

export async function requestGroqReasoning(
  originalText: string,
  risks: SpeechRisk[]
): Promise<GroqReasoningResult | null> {
  const apiKey = process.env.GROQ_API_KEY;
  const model = process.env.GROQ_MODEL || 'qwen/qwen3.8-27b';

  if (!apiKey || apiKey.trim().length === 0) {
    // Graceful fallback when Groq key is not configured
    return null;
  }

  const promptContent = createControlledTextPrompt(
    originalText,
    risks.map((r) => ({ text: r.text, category: r.category, reason: r.reason }))
  );

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: SPEECH_ANALYSIS_SYSTEM_PROMPT },
          { role: 'user', content: promptContent },
        ],
        temperature: 0.1, // Low temperature for deterministic/conservative output
        response_format: { type: 'json_object' },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[Groq Error] HTTP ${response.status}: ${errorText}`);
      return null;
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) return null;

    const parsed = JSON.parse(content);
    if (!parsed.controlledText || !Array.isArray(parsed.changes)) {
      return null;
    }

    return {
      controlledText: parsed.controlledText,
      changes: parsed.changes,
      reviewRequired: Boolean(parsed.reviewRequired),
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`[Groq Exception] Error during LLM reasoning: ${msg}`);
    return null;
  }
}
