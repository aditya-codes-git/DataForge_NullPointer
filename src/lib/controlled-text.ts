import { SpeechRisk, Transformation, InvestigationDecision, SpeechCandidate } from './schemas';
import { analyzeContext } from './context-analyzer';
import { generateCandidatesForRisks } from './candidate-generator';
import { validateControlledText, ValidationResult } from './validators';
import { evaluateSpeechDecision } from './decision-engine';
import { detectSensitiveCredentials } from './risk-detector';
import { applyHardcodedOverrides } from './hardcoded-overrides';

export interface ControlledTextResult {
  controlledText: string;
  changes: Transformation[];
  decision: InvestigationDecision;
  reviewRequired: boolean;
  reviewReasons: string[];
  safetyWarning?: string | null;
  candidates?: SpeechCandidate[];
  validation: ValidationResult;
}

/**
 * Speech Quality Intelligence Pipeline
 *
 * Orchestrates:
 * 1. Secret/Credential check
 * 2. Context Analysis (surrounding words, domain, Groq structured outputs)
 * 3. Pronunciation Knowledge lookup
 * 4. 0-3 Candidate Generation
 * 5. 10-point Candidate Validation
 * 6. Decision Engine evaluation
 */
export async function generateControlledText(
  originalText: string,
  risks: SpeechRisk[],
  options?: { domain?: string; language?: string; locale?: string }
): Promise<ControlledTextResult> {
  const safetyWarning = detectSensitiveCredentials(originalText);

  // If there are no risks, the text is speech-ready as is
  if (!risks || risks.length === 0) {
    const emptyValidation = validateControlledText(originalText, originalText, [], []);
    const decision = evaluateSpeechDecision({
      originalText,
      controlledText: originalText,
      risks: [],
      changes: [],
      validation: emptyValidation,
      safetyWarning,
    });

    return {
      controlledText: originalText,
      changes: [],
      decision,
      reviewRequired: Boolean(safetyWarning),
      reviewReasons: safetyWarning ? [safetyWarning] : [],
      safetyWarning,
      candidates: [],
      validation: emptyValidation,
    };
  }

  // 0. Apply hardcoded pronunciation overrides (temporary hackathon fast-path)
  const overrideResult = applyHardcodedOverrides(originalText);
  const workingText = overrideResult.text;

  // 1. Context Analysis (evaluates ambiguity, domain, and invokes Groq if needed)
  const contextResult = await analyzeContext(originalText, risks, options);

  // 2. Candidate Generation (generates 0-3 ranked candidates using knowledge + rules + context)
  const candidateResult = generateCandidatesForRisks(originalText, risks, contextResult);
  // If overrides changed the text, use the override result as the base controlled text
  const controlled = overrideResult.changes.length > 0
    ? applyHardcodedOverrides(candidateResult.primaryControlledText).text
    : candidateResult.primaryControlledText;
  const changes = [...overrideResult.changes, ...candidateResult.changes];

  // Collect all generated candidates across risks
  const allCandidates: SpeechCandidate[] = [];
  candidateResult.itemCandidates.forEach((cands) => {
    allCandidates.push(...cands);
  });

  // 3. 10-Point Validation
  const validation = validateControlledText(originalText, controlled, risks, changes);

  // 4. Decision Engine
  const decision = evaluateSpeechDecision({
    originalText,
    controlledText: controlled,
    risks,
    changes,
    validation,
    safetyWarning,
  });

  const isReviewRequired =
    Boolean(safetyWarning) ||
    decision.status === 'NEEDS_REVIEW' ||
    validation.reviewRequired ||
    changes.some((c) => c.action === 'NEEDS_REVIEW');

  const combinedReviewReasons = Array.from(
    new Set([
      ...(safetyWarning ? [safetyWarning] : []),
      ...validation.reasons,
      ...changes
        .filter((c) => c.action === 'NEEDS_REVIEW')
        .map((c) => `Ambiguous term "${c.original}" requires review.`),
    ])
  );

  return {
    controlledText: controlled,
    changes,
    decision,
    reviewRequired: isReviewRequired,
    reviewReasons: combinedReviewReasons,
    safetyWarning,
    candidates: allCandidates,
    validation,
  };
}
