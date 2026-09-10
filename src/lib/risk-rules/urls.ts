import { SpeechRisk } from '../schemas';

const URL_REGEX = /\b(?:https?:\/\/|www\.)[a-z0-9-]+(?:\.[a-z0-9-]+)+(?:\/[^\s]*)?/gi;

export function detectUrls(text: string): SpeechRisk[] {
  const risks: SpeechRisk[] = [];
  let match: RegExpExecArray | null;

  while ((match = URL_REGEX.exec(text)) !== null) {
    const matchedText = match[0];
    risks.push({
      id: `url-${match.index}`,
      text: matchedText,
      category: 'url',
      severity: 'high',
      reason: 'Raw URLs contain slashes, dots, and protocols that sound clumsy when spoken aloud without phonetic adaptation.',
      start: match.index,
      end: match.index + matchedText.length,
      confidence: 'HIGH',
      ruleMatched: 'URL_FORMAT',
    });
  }

  return risks;
}
