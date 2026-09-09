import { SpeechRisk, Transformation, InvestigationDecision } from './schemas';
import { transformRiskDeterministically } from './deterministic-transform';
import { requestGroqReasoning } from './groq';
import { validateControlledText } from './validators';

export interface ControlledTextResult {
  controlledText: string;
  changes: Transformation[];
  decision: InvestigationDecision;
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
      decision: {
        status: 'SAME_AS_RAW',
        summary: 'Original text speech-ready',
        reason: 'No pronunciation or delivery risks detected; raw text is directly speech-ready.',
      },
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
      if (groqResult.enrichedRisks) {
        for (const er of groqResult.enrichedRisks) {
          const matchRisk = risks.find((r) => r.text === er.original);
          if (matchRisk) {
            matchRisk.decision = er.decision;
            matchRisk.candidates = er.candidates;
          }
        }
      }

      const normalizedChanges: Transformation[] = groqResult.changes.map((c) => ({
        original: c.original,
        replacement: c.replacement,
        category: c.category || 'ambiguous',
        reason: c.reason,
        confidence: c.confidence || 'HIGH',
        evidenceStatus: 'tested',
        action: c.action || (c.replacement === c.original ? 'KEEP_RAW' : 'USE_CONTROLLED'),
        rank: c.rank || 1,
        candidates: c.candidates,
      }));

      const validation = validateControlledText(
        originalText,
        groqResult.controlledText,
        risks,
        normalizedChanges
      );

      const reviewReq = groqResult.reviewRequired || validation.reviewRequired;
      const decision: InvestigationDecision = reviewReq
        ? {
            status: 'NEEDS_REVIEW',
            summary: 'Human review recommended',
            reason:
              groqResult.overallReason ||
              'Contextual reasoning flagged one or more items that require listener confirmation.',
          }
        : {
            status: 'USE_CONTROLLED',
            summary: 'Controlled candidate recommended',
            reason:
              groqResult.overallReason ||
              'Contextual reasoning generated candidate representations for improved spoken delivery.',
          };

      return {
        controlledText: groqResult.controlledText,
        changes: normalizedChanges,
        decision,
        reviewRequired: reviewReq,
        reviewReasons: validation.reasons,
      };
    }
  }

  // Otherwise, perform deterministic token-specific evaluation: DETECT != CORRECT
  let controlled = originalText;
  const changes: Transformation[] = [];
  const reviewReasons: string[] = [];

  // Sort risks in reverse order of start index so replacements don't shift positions
  const reverseSortedRisks = [...risks].sort((a, b) => b.start - a.start);

  for (const risk of reverseSortedRisks) {
    const deterministic = transformRiskDeterministically(risk);
    if (deterministic) {
      // Annotate risk with decision and candidates
      risk.decision =
        deterministic.action === 'KEEP_RAW'
          ? 'KEEP_ORIGINAL'
          : deterministic.action === 'USE_CONTROLLED'
          ? 'PROPOSE_CONTROLLED'
          : 'NEEDS_REVIEW';
      risk.candidates = deterministic.candidates;

      // Only mutate text if action is USE_CONTROLLED
      if (deterministic.action === 'USE_CONTROLLED' && deterministic.replacement !== risk.text) {
        const before = controlled.slice(0, risk.start);
        const after = controlled.slice(risk.end);
        controlled = before + deterministic.replacement + after;
      }

      changes.unshift({
        original: risk.text,
        replacement: deterministic.replacement,
        category: risk.category,
        reason: deterministic.reason,
        confidence: deterministic.confidence,
        evidenceStatus: 'tested',
        action: deterministic.action,
        rank: deterministic.rank || 1,
        candidates: deterministic.candidates,
      });

      if (deterministic.action === 'NEEDS_REVIEW' || deterministic.confidence === 'NEEDS_REVIEW') {
        reviewReasons.push(`Ambiguous term "${risk.text}" requires review.`);
      }
    }
  }

  const validation = validateControlledText(originalText, controlled, risks, changes);
  const isReviewRequired = validation.reviewRequired || reviewReasons.length > 0;

  // Build overall investigation decision
  let decision: InvestigationDecision;
  if (isReviewRequired) {
    decision = {
      status: 'NEEDS_REVIEW',
      summary: 'Human review recommended',
      reason: 'One or more detected tokens cannot be reliably verified without human listener review.',
    };
  } else if (changes.some((c) => c.action === 'USE_CONTROLLED')) {
    decision = {
      status: 'USE_CONTROLLED',
      summary: 'Controlled candidate recommended',
      reason: 'Controlled delivery improves spoken clarity for targeted tokens while preserving naturally synthesized terms.',
    };
  } else if (changes.some((c) => c.action === 'KEEP_RAW')) {
    decision = {
      status: 'KEEP_RAW',
      summary: 'Original retained (No change recommended)',
      reason: 'The original Rime rendering was retained because no verified controlled representation showed a clear advantage.',
    };
  } else {
    decision = {
      status: 'SAME_AS_RAW',
      summary: 'Original speech-ready',
      reason: 'Clean text with no delivery risks identified; identical spoken output.',
    };
  }

  return {
    controlledText: controlled,
    changes,
    decision,
    reviewRequired: isReviewRequired,
    reviewReasons: Array.from(new Set([...reviewReasons, ...validation.reasons])),
  };
}
