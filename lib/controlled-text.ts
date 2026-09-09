import { SpeechRisk, Transformation } from './schemas';
import { transformRiskDeterministically } from './deterministic-transform';
import { requestGroqReasoning } from './groq';
import { validateControlledText } from './validators';

export interface ControlledTextResult {
  controlledText: string;
  changes: Transformation[];
  reviewRequired: boolean;
  reviewReasons: string[];
}

export async function generateControlledText(
  originalText: string,
  risks: SpeechRisk[]
): Promise<ControlledTextResult> {
  // If there are no risks, the text is speech-ready as is
  if (!risks || risks.length === 0) {
    return {
      controlledText: originalText,
      changes: [],
      reviewRequired: false,
      reviewReasons: [],
    };
  }

  // Check if any risks require contextual reasoning (Level B / ambiguous)
  const hasContextualRisks = risks.some(
    (r) => r.category === 'name' || r.category === 'address' || r.category === 'ambiguous'
  );

  // If Groq is available and contextual risks exist, attempt Groq reasoning
  if (hasContextualRisks && process.env.GROQ_API_KEY) {
    const groqResult = await requestGroqReasoning(originalText, risks);
    if (groqResult) {
      const validation = validateControlledText(
        originalText,
        groqResult.controlledText,
        risks,
        groqResult.changes
      );

      return {
        controlledText: groqResult.controlledText,
        changes: groqResult.changes,
        reviewRequired: groqResult.reviewRequired || validation.reviewRequired,
        reviewReasons: validation.reasons,
      };
    }
  }

  // Otherwise, perform deterministic controlled-text transformation
  let controlled = originalText;
  const changes: Transformation[] = [];
  const reviewReasons: string[] = [];

  // Sort risks in reverse order of start index so replacements don't shift positions
  const reverseSortedRisks = [...risks].sort((a, b) => b.start - a.start);

  for (const risk of reverseSortedRisks) {
    const deterministic = transformRiskDeterministically(risk);
    if (deterministic) {
      const before = controlled.slice(0, risk.start);
      const after = controlled.slice(risk.end);
      controlled = before + deterministic.replacement + after;

      changes.unshift({
        original: risk.text,
        replacement: deterministic.replacement,
        reason: deterministic.reason,
        type: risk.category,
        confidence: deterministic.confidence,
      });

      if (deterministic.confidence === 'NEEDS_REVIEW') {
        reviewReasons.push(`Ambiguous term "${risk.text}" requires review.`);
      }
    }
  }

  const validation = validateControlledText(originalText, controlled, risks, changes);

  return {
    controlledText: controlled,
    changes,
    reviewRequired: validation.reviewRequired || reviewReasons.length > 0,
    reviewReasons: Array.from(new Set([...reviewReasons, ...validation.reasons])),
  };
}
