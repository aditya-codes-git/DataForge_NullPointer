import { SpeechRisk } from '../schemas';

// Regex matches alphanumeric identifiers:
// - Contains at least one letter and at least one digit (e.g., A12B9X7, INV2024, 42B)
// - Or uppercase alphanumeric codes with hyphens/underscores (e.g., REF-9021, TX_99)
const ALPHANUMERIC_REGEX = /\b(?=[A-Za-z0-9_-]{3,20}\b)(?=[A-Za-z0-9_-]*[A-Za-z])(?=[A-Za-z0-9_-]*[0-9])[A-Za-z0-9]+(?:[-_][A-Za-z0-9]+)*\b/g;

export function detectIdentifiers(text: string): SpeechRisk[] {
  const risks: SpeechRisk[] = [];
  let match: RegExpExecArray | null;

  while ((match = ALPHANUMERIC_REGEX.exec(text)) !== null) {
    const matchedText = match[0];
    
    // Skip if it looks like an ordinary measurement like 100m, 50kg, 24h
    if (/^\d+(?:m|cm|mm|km|kg|g|mg|h|min|s|px|rem|em|hz|khz|mhz|ghz|gb|mb|kb|tb)$/i.test(matchedText)) {
      continue;
    }

    risks.push({
      id: `id-${match.index}`,
      text: matchedText,
      category: 'identifier',
      severity: 'high',
      reason: 'Alphanumeric identifier with mixed letters and numbers may be mispronounced or slurred if read as a word.',
      start: match.index,
      end: match.index + matchedText.length,
      confidence: 'HIGH',
      ruleMatched: 'ALPHANUMERIC_CODE',
    });
  }

  return risks;
}
