import { SpeechRisk, SpeechCandidate, RiskCategory } from './schemas';
import { requestGroqReasoning, GroqReasoningResult } from './groq';
import { lookupPronunciationKnowledge } from './pronunciation-knowledge';

export interface ContextAnalysisItem {
  term: string;
  category: RiskCategory;
  contextualRole?: string;
  suggestedCandidates: SpeechCandidate[];
  requiresInvestigation: boolean;
  notes: string;
}

export interface ContextAnalysisResult {
  items: ContextAnalysisItem[];
  llmReasoningApplied: boolean;
  groqResult?: GroqReasoningResult | null;
}

/**
 * Context Analyzer
 *
 * Examines surrounding words, technical context, and entity types to determine
 * spoken intent. Only invokes Groq for genuinely contextual questions,
 * bypassing LLM for purely deterministic structural spans.
 */
export async function analyzeContext(
  text: string,
  risks: SpeechRisk[],
  options?: { domain?: string; language?: string; locale?: string }
): Promise<ContextAnalysisResult> {
  const startTime = performance.now();
  const items: ContextAnalysisItem[] = [];

  // Filter for risks that genuinely require contextual ambiguity reasoning.
  // Bypass Groq if the term is already known in the pronunciation catalog or
  // is a purely deterministic structural span (currency, date, time, identifier, version, etc.)
  const ambiguousRisks = risks.filter((r) => {
    // 1. Knowledge catalog has verified or domain-specific pronunciations
    const knowledge = lookupPronunciationKnowledge(r.text, { domain: options?.domain });
    if (knowledge) return false;

    // 2. Deterministic categories that never need LLM contextual reasoning
    if (
      r.category === 'currency' ||
      r.category === 'number' ||
      r.category === 'identifier' ||
      r.category === 'version' ||
      r.category === 'url' ||
      r.category === 'email' ||
      r.category === 'unit' ||
      r.category === 'symbol' ||
      r.category === 'date' ||
      r.category === 'time'
    ) {
      return false;
    }

    // 3. Obvious deterministic detection without ambiguous flag
    if (r.detectionMethod === 'deterministic' && !r.investigationRequired) {
      return false;
    }

    // 4. Ambiguous words, unknown acronyms, or contextual risks without catalog knowledge
    return (
      r.category === 'ambiguous' ||
      r.detectionMethod === 'contextual' ||
      Boolean(r.investigationRequired)
    );
  });

  let groqResult: GroqReasoningResult | null = null;
  let llmReasoningApplied = false;

  // Only invoke Groq if genuinely ambiguous risks exist and API key is present
  if (ambiguousRisks.length > 0 && process.env.GROQ_API_KEY) {
    const groqStart = performance.now();
    groqResult = await requestGroqReasoning(text, ambiguousRisks);
    const groqMs = Math.round(performance.now() - groqStart);

    if (groqResult) {
      llmReasoningApplied = true;
    }
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[Timing] Groq Reasoning: ${groqMs}ms for ${ambiguousRisks.length} ambiguous risk(s)`);
    }
  } else if (process.env.NODE_ENV !== 'production') {
    const totalMs = Math.round(performance.now() - startTime);
    console.log(`[Timing] Context Analysis: ${totalMs}ms (Groq bypassed: deterministic/catalog resolution)`);
  }

  for (const risk of risks) {
    const knowledge = lookupPronunciationKnowledge(risk.text, { domain: options?.domain });

    // If knowledge base has verified data, integrate it
    if (knowledge) {
      const candidates: SpeechCandidate[] = (knowledge.preferredTtsRepresentations || [risk.text]).map(
        (cand, idx) => ({
          candidateText: cand,
          reason: `Known conventional pronunciation in ${knowledge.domain} domain (${knowledge.canonicalSpokenForm}).`,
          source: 'knowledge_base',
          confidenceState: knowledge.verificationStatus === 'verified' ? 'high' : 'medium',
          requiresVerification: knowledge.verificationStatus !== 'verified',
          rank: idx + 1,
        })
      );

      items.push({
        term: risk.text,
        category: risk.category,
        contextualRole: `${knowledge.domain} domain term`,
        suggestedCandidates: candidates,
        requiresInvestigation: knowledge.verificationStatus !== 'verified',
        notes: knowledge.notes || 'Catalog entry matched.',
      });
      continue;
    }

    // If Groq provided enriched candidates for this risk
    if (groqResult?.enrichedRisks) {
      const match = groqResult.enrichedRisks.find(
        (er) => er.original.toLowerCase() === risk.text.toLowerCase()
      );
      if (match?.candidates && match.candidates.length > 0) {
        items.push({
          term: risk.text,
          category: risk.category,
          contextualRole: 'Contextual inference via reasoning engine',
          suggestedCandidates: match.candidates.map((c, i) => ({
            candidateText: c.text,
            reason: c.reason,
            source: 'contextual_llm',
            confidenceState: 'medium',
            requiresVerification: true,
            rank: c.rank || i + 1,
          })),
          requiresInvestigation: true,
          notes: 'Contextually evaluated by Groq reasoning layer.',
        });
        continue;
      }
    }

    // Default contextual fallback
    items.push({
      term: risk.text,
      category: risk.category,
      contextualRole: `${risk.category} span`,
      suggestedCandidates: [],
      requiresInvestigation: Boolean(risk.investigationRequired),
      notes: risk.reason,
    });
  }

  return {
    items,
    llmReasoningApplied,
    groqResult,
  };
}
