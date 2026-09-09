import { SpeechRisk } from './schemas';
import { detectIdentifiers } from './risk-rules/identifiers';
import { detectCurrency } from './risk-rules/currency';
import { detectNumbers } from './risk-rules/numbers';
import { detectAcronyms } from './risk-rules/acronyms';
import { detectDomainTerms } from './risk-rules/domain-terms';
import { detectDates } from './risk-rules/dates';
import { detectTimes } from './risk-rules/times';
import { detectUrls } from './risk-rules/urls';
import { detectEmails } from './risk-rules/emails';
import { detectAbbreviations } from './risk-rules/abbreviations';
import { detectAddresses } from './risk-rules/addresses';
import { detectNames } from './risk-rules/names';
import { detectAmbiguousTerms } from './risk-rules/ambiguous';

export function analyzeSpeechRisks(text: string): SpeechRisk[] {
  if (!text || text.trim().length === 0) {
    return [];
  }

  // Gather all detections across Level A (deterministic) and Level B (contextual)
  const allDetections: SpeechRisk[] = [
    // Level A - Deterministic
    ...detectIdentifiers(text),
    ...detectCurrency(text),
    ...detectDates(text),
    ...detectTimes(text),
    ...detectUrls(text),
    ...detectEmails(text),
    ...detectAcronyms(text),
    ...detectNumbers(text),
    ...detectAbbreviations(text),
    
    // Level B - Contextual & Lexicon
    ...detectDomainTerms(text),
    ...detectAddresses(text),
    ...detectNames(text),
    ...detectAmbiguousTerms(text),
  ];

  // Resolve overlaps: Priority goes to higher severity, longer span, or earlier start
  const sorted = allDetections.sort((a, b) => {
    if (a.start !== b.start) return a.start - b.start;
    const severityWeight = { high: 3, medium: 2, low: 1 };
    return severityWeight[b.severity] - severityWeight[a.severity];
  });

  const nonOverlapping: SpeechRisk[] = [];
  let lastEnd = -1;

  for (const risk of sorted) {
    if (risk.start >= lastEnd) {
      nonOverlapping.push(risk);
      lastEnd = risk.end;
    }
  }

  return nonOverlapping;
}
