import { SpeechRisk } from '../schemas';

// Matches date formats like 03/15/2026, 2026-09-09, 15-08-2024, 12.05.2026
const DATE_REGEX = /\b(?:\d{1,2}[/.-]\d{1,2}[/.-]\d{2,4}|\d{4}[/.-]\d{1,2}[/.-]\d{1,2})\b/g;

export function detectDates(text: string): SpeechRisk[] {
  const risks: SpeechRisk[] = [];
  let match: RegExpExecArray | null;

  while ((match = DATE_REGEX.exec(text)) !== null) {
    const matchedText = match[0];
    risks.push({
      id: `date-${match.index}`,
      text: matchedText,
      category: 'date',
      severity: 'medium',
      reason: 'Numeric date format can cause Day/Month ambiguity (US vs International) and should be expanded into natural spoken month and ordinal day.',
      start: match.index,
      end: match.index + matchedText.length,
      confidence: 'HIGH',
      ruleMatched: 'DATE_FORMAT',
    });
  }

  return risks;
}
