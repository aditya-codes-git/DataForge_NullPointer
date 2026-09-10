import { SpeechRisk } from '../schemas';

const ABBREVIATIONS: Record<string, string> = {
  'approx.': 'approximately',
  'approx': 'approximately',
  'vs.': 'versus',
  'vs': 'versus',
  'dept.': 'department',
  'qty.': 'quantity',
  'avg.': 'average',
  'min.': 'minimum',
  'max.': 'maximum',
  'no.': 'number',
  'misc.': 'miscellaneous',
  'temp.': 'temperature',
};

export function detectAbbreviations(text: string): SpeechRisk[] {
  const risks: SpeechRisk[] = [];

  for (const [abbr, expansion] of Object.entries(ABBREVIATIONS)) {
    const escaped = abbr.replace('.', '\\.');
    const regex = new RegExp(`\\b${escaped}\\b`, 'gi');
    let match: RegExpExecArray | null;

    while ((match = regex.exec(text)) !== null) {
      risks.push({
        id: `abbr-${match.index}`,
        text: match[0],
        category: 'abbreviation',
        severity: 'low',
        reason: `Written abbreviation "${match[0]}" sounds clearer expanded to "${expansion}".`,
        start: match.index,
        end: match.index + match[0].length,
        confidence: 'HIGH',
        ruleMatched: 'COMMON_ABBREVIATION',
      });
    }
  }

  return risks;
}
