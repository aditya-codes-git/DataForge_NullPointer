import { SpeechRisk } from '../schemas';

// Matches standalone numbers with commas, decimals, or phone/serial style:
// e.g. 1,299 or 3.14159 or 007 or +1-800-555-0199
const FORMATTED_NUMBER_REGEX = /\b(?:\+?\d{1,3}[-.\s])?\(?\d{3}\)?[-.\s]\d{3}[-.\s]\d{4}\b|\b\d{1,3}(?:,\d{3})+(?:\.\d+)?\b|\b\d+\.\d{2,}\b|\b0\d{2,}\b/g;

export function detectNumbers(text: string): SpeechRisk[] {
  const risks: SpeechRisk[] = [];
  let match: RegExpExecArray | null;

  while ((match = FORMATTED_NUMBER_REGEX.exec(text)) !== null) {
    const matchedText = match[0];
    
    let reason = 'Formatted numerical digits can be spoken in multiple ways (cardinal vs digit-by-digit vs phone format).';
    let severity: 'high' | 'medium' | 'low' = 'medium';

    if (/^0\d+/.test(matchedText)) {
      reason = 'Leading zero number should be articulated digit-by-digit rather than as a standard mathematical integer.';
      severity = 'high';
    } else if (/[-.\s]\d{3}[-.\s]/.test(matchedText)) {
      reason = 'Phone or serial format requires explicit rhythmic cadence and digit grouping for listener comprehension.';
      severity = 'medium';
    }

    risks.push({
      id: `num-${match.index}`,
      text: matchedText,
      category: 'number',
      severity,
      reason,
      start: match.index,
      end: match.index + matchedText.length,
      confidence: 'HIGH',
      ruleMatched: 'NUMBER_FORMAT',
    });
  }

  return risks;
}
