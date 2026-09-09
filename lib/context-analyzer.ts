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
  const items: ContextAnalysisItem[] = [];

  // Determine which risks have contextual ambiguity
  const contextualRisks = risks.filter(
    (r) =>
      r.detectionMethod === 'contextual' ||
      r.category === 'acronym' ||
      r.category === 'ambiguous' ||
      r.category === 'name' ||
      r.category === 'domain_term'
  );

  let groqResult: GroqReasoningResult | null = null;
  let llmReasoningApplied = false;

  // Use Groq for contextual questions if available
  if (contextualRisks.length > 0 && process.env.GROQ_API_KEY) {
    groqResult = await requestGroqReasoning(text, contextualRisks);
    if (groqResult) {
      llmReasoningApplied = true;
    }
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
