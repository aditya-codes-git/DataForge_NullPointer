import { SpeechRisk } from '../schemas';

// Matches uncommon CamelCase words with trailing capitals, rare letter clusters (q without u, x/z clusters)
// e.g. XyloQ, Qzxt, Jxly
const AMBIGUOUS_PATTERN = /\b(?:[A-Z][a-z]+[A-Z]|[A-Z]{1}[a-z]*q(?!u)[a-z]*|[A-Z][a-z]*[xzjkq]{2,}[a-z]*)\b/g;

export function detectAmbiguousTerms(text: string): SpeechRisk[] {
  const risks: SpeechRisk[] = [];
  let match: RegExpExecArray | null;

  while ((match = AMBIGUOUS_PATTERN.exec(text)) !== null) {
    const matchedText = match[0];

    // Skip known acronyms or common words
    if (/^(McDonald|MacArthur|eBay|iPhone|iPad)$/i.test(matchedText)) {
      continue;
    }

    risks.push({
      id: `ambig-${match.index}`,
      text: matchedText,
      category: 'ambiguous',
      severity: 'high',
      reason: `Uncommon or non-standard token "${matchedText}" has uncertain pronunciation. Requires manual confirmation before synthetic audio deployment.`,
      start: match.index,
      end: match.index + matchedText.length,
      confidence: 'NEEDS_REVIEW',
      ruleMatched: 'UNUSUAL_PHONOTACTIC_PATTERN',
    });
  }

  return risks;
}
