import { SpeechRisk, SpeechCandidate, Transformation } from './schemas';
import { transformRiskDeterministically } from './deterministic-transform';
import { lookupPronunciationKnowledge } from './pronunciation-knowledge';
import { ContextAnalysisResult } from './context-analyzer';

export interface GeneratedCandidatesResult {
  primaryControlledText: string;
  itemCandidates: Map<string, SpeechCandidate[]>;
  changes: Transformation[];
}

/**
 * Candidate Generator
 *
 * For difficult terms, generates 0-3 ranked TTS-friendly candidates.
 * Avoids IPA, arbitrary phonetic respellings, and unnecessary text modifications.
 */
export function generateCandidatesForRisks(
  originalText: string,
  risks: SpeechRisk[],
  contextResult?: ContextAnalysisResult
): GeneratedCandidatesResult {
  const itemCandidates = new Map<string, SpeechCandidate[]>();
  const changes: Transformation[] = [];
  let controlled = originalText;

  // Process risks in reverse order so string replacements preserve start/end offsets
  const reverseSorted = [...risks].sort((a, b) => b.start - a.start);

  for (const risk of reverseSorted) {
    const raw = risk.text;
    const candidates: SpeechCandidate[] = [];

    // 1. Check Pronunciation Knowledge Base first
    const knowledge = lookupPronunciationKnowledge(raw);
    if (knowledge && knowledge.preferredTtsRepresentations && knowledge.preferredTtsRepresentations.length > 0) {
      knowledge.preferredTtsRepresentations.slice(0, 3).forEach((rep, idx) => {
        candidates.push({
          candidateText: rep,
          text: rep,
          reason: `Knowledge catalog candidate (${knowledge.canonicalSpokenForm}): preferred spoken representation.`,
          source: 'knowledge_base',
          confidenceState: knowledge.verificationStatus === 'verified' ? 'high' : 'medium',
          requiresVerification: knowledge.verificationStatus !== 'verified',
          rank: idx + 1,
        });
      });
    }

    // 2. Check Contextual Analysis (Groq Structured Output) if available
    const ctxItem = contextResult?.items.find((it) => it.term.toLowerCase() === raw.toLowerCase());
    if (ctxItem && ctxItem.suggestedCandidates.length > 0) {
      for (const sc of ctxItem.suggestedCandidates) {
        if (!candidates.some((c) => c.candidateText.toLowerCase() === sc.candidateText.toLowerCase())) {
          candidates.push({
            ...sc,
            text: sc.candidateText || sc.text,
            rank: candidates.length + 1,
          });
        }
      }
    }

    // 3. Fallback to Deterministic Transform rules
    const deterministic = transformRiskDeterministically(risk);
    if (deterministic) {
      if (deterministic.candidates && deterministic.candidates.length > 0) {
        for (const dc of deterministic.candidates) {
          if (!candidates.some((c) => c.candidateText.toLowerCase() === dc.text.toLowerCase())) {
            candidates.push({
              candidateText: dc.text,
              text: dc.text,
              reason: dc.reason,
              source: 'deterministic',
              confidenceState: deterministic.confidence === 'HIGH' ? 'high' : deterministic.confidence === 'MEDIUM' ? 'medium' : 'low',
              requiresVerification: deterministic.action === 'NEEDS_REVIEW' || deterministic.confidence === 'NEEDS_REVIEW',
              rank: candidates.length + 1,
            });
          }
        }
      } else if (!candidates.some((c) => c.candidateText.toLowerCase() === deterministic.replacement.toLowerCase())) {
        candidates.push({
          candidateText: deterministic.replacement,
          text: deterministic.replacement,
          reason: deterministic.reason,
          source: 'deterministic',
          confidenceState: deterministic.confidence === 'HIGH' ? 'high' : 'medium',
          requiresVerification: deterministic.action === 'NEEDS_REVIEW',
          rank: candidates.length + 1,
        });
      }
    }

    // Cap at 3 candidates
    const finalCandidates = candidates.slice(0, 3);
    itemCandidates.set(raw, finalCandidates);

    // Determine primary transformation for text synthesis
    const primaryCandidate = finalCandidates[0];
    const isKeepRaw =
      !primaryCandidate ||
      primaryCandidate.candidateText.toLowerCase() === raw.toLowerCase() ||
      deterministic?.action === 'KEEP_RAW';

    const isNeedsReview =
      deterministic?.action === 'NEEDS_REVIEW' ||
      risk.category === 'ambiguous' ||
      risk.confidence === 'NEEDS_REVIEW';

    const replacement = isKeepRaw || isNeedsReview ? raw : primaryCandidate.candidateText;
    const action = isNeedsReview ? 'NEEDS_REVIEW' : isKeepRaw ? 'KEEP_RAW' : 'USE_CONTROLLED';

    if (action === 'USE_CONTROLLED' && replacement !== raw) {
      const before = controlled.slice(0, risk.start);
      const after = controlled.slice(risk.end);
      controlled = before + replacement + after;
    }

    changes.unshift({
      original: raw,
      replacement,
      category: risk.category,
      reason: primaryCandidate?.reason || deterministic?.reason || risk.reason,
      confidence: isNeedsReview ? 'NEEDS_REVIEW' : 'HIGH',
      evidenceStatus: 'tested',
      action,
      rank: 1,
      candidates: finalCandidates,
    });

    // Annotate risk with decision & candidates
    risk.decision = isNeedsReview
      ? 'NEEDS_REVIEW'
      : isKeepRaw
      ? 'KEEP_ORIGINAL'
      : 'PROPOSE_CONTROLLED';
    risk.candidates = finalCandidates;
  }

  return {
    primaryControlledText: controlled,
    itemCandidates,
    changes,
  };
}
