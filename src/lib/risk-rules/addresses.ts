import { SpeechRisk } from '../schemas';

// Matches known complex address phrases, hyphenated localities (e.g., Bandra-Kurla Complex, Connaught Place, Silicon Valley)
// and street abbreviations with numbers
const ADDRESS_PATTERNS = [
  /\b(Bandra-Kurla\s+Complex|Connaught\s+Place|Cyber\s+City)\b/gi,
  /\b\d+\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\s+(?:St\.?|Street|Ave\.?|Avenue|Blvd\.?|Boulevard|Rd\.?|Road|Dr\.?|Drive|Suite\s+\d+|Sector\s+\d+)\b/gi,
];

export function detectAddresses(text: string): SpeechRisk[] {
  const risks: SpeechRisk[] = [];

  for (const pattern of ADDRESS_PATTERNS) {
    let match: RegExpExecArray | null;
    while ((match = pattern.exec(text)) !== null) {
      risks.push({
        id: `addr-${match.index}`,
        text: match[0],
        category: 'address',
        severity: 'medium',
        reason: 'Complex address notation and street abbreviations (St., Ave., Suite) benefit from clear listener-oriented cadence.',
        start: match.index,
        end: match.index + match[0].length,
        confidence: 'MEDIUM',
        ruleMatched: 'ADDRESS_PATTERN',
      });
    }
  }

  return risks;
}
