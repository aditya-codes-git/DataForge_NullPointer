import { SpeechRisk } from '../schemas';

// Common title + name pattern
const TITLE_NAME_REGEX = /\b(?:Dr\.?|Mr\.?|Mrs\.?|Ms\.?|Prof\.?)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)\b/g;

// Difficult/multi-ethnic phonetic names often mispronounced by English TTS
const PHONETIC_NAMES = [
  'Mukherjee',
  'Venkataraman',
  'Choudhury',
  'Siobhan',
  'Saoirse',
  'Nguyen',
  'Niamh',
  'Macleod',
  'Krzyzewski',
];

export function detectNames(text: string): SpeechRisk[] {
  const risks: SpeechRisk[] = [];
  const claimedRanges: Array<[number, number]> = [];

  // 1. Title + Name
  let match: RegExpExecArray | null;
  while ((match = TITLE_NAME_REGEX.exec(text)) !== null) {
    const fullMatch = match[0];
    const start = match.index;
    const end = start + fullMatch.length;
    claimedRanges.push([start, end]);

    risks.push({
      id: `name-title-${start}`,
      text: fullMatch,
      category: 'name',
      severity: 'medium',
      reason: 'Personal name with honorific requires natural respectful inflection and precise pronunciation.',
      start,
      end,
      confidence: 'MEDIUM',
      ruleMatched: 'TITLE_PRECEDED_NAME',
    });
  }

  // 2. Phonetically challenging names
  for (const name of PHONETIC_NAMES) {
    const regex = new RegExp(`\\b${name}\\b`, 'g');
    while ((match = regex.exec(text)) !== null) {
      const start = match.index;
      const end = start + match[0].length;

      if (claimedRanges.some(([s, e]) => start >= s && end <= e)) {
        continue;
      }

      risks.push({
        id: `name-phonetic-${start}`,
        text: match[0],
        category: 'name',
        severity: 'high',
        reason: `Name "${name}" contains non-intuitive phoneme mapping that frequently causes pronunciation errors in standard TTS engines.`,
        start,
        end,
        confidence: 'HIGH',
        ruleMatched: 'PHONETIC_NAME_DICTIONARY',
      });
    }
  }

  return risks;
}
