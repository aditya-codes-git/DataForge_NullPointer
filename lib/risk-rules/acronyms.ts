import { SpeechRisk } from '../schemas';

// Matches HTTP status codes like "HTTP 429", "HTTP 500", "HTTP 200"
const HTTP_CODE_REGEX = /\b(HTTP|HTTPS|RFC)\s*([1-5]\d{2})\b/gi;

// Matches standalone uppercase acronyms (2 to 6 letters, e.g. AWS, JSON, API, SaaS, OAuth)
const ACRONYM_REGEX = /\b([A-Z]{2,6}|SaaS|OAuth|VoIP|NoSQL)\b/g;

// Common words in uppercase that shouldn't be flagged as technical acronyms
const COMMON_UPPER_WORDS = new Set(['I', 'A', 'OK', 'AM', 'PM', 'US', 'UK', 'EU', 'ID', 'IN', 'ON', 'AT', 'TO', 'BY', 'FOR', 'AND', 'OR', 'NOT']);

export function detectAcronyms(text: string): SpeechRisk[] {
  const risks: SpeechRisk[] = [];
  const claimedRanges: Array<[number, number]> = [];

  // First check HTTP codes
  let match: RegExpExecArray | null;
  while ((match = HTTP_CODE_REGEX.exec(text)) !== null) {
    const matchedText = match[0];
    const start = match.index;
    const end = start + matchedText.length;
    claimedRanges.push([start, end]);

    risks.push({
      id: `acronym-http-${start}`,
      text: matchedText,
      category: 'acronym',
      severity: 'high',
      reason: 'HTTP protocol status code should be read digit-by-digit (e.g., "four two nine") rather than as a single large number.',
      start,
      end,
      confidence: 'HIGH',
      ruleMatched: 'HTTP_STATUS_CODE',
    });
  }

  // Next check standalone acronyms
  while ((match = ACRONYM_REGEX.exec(text)) !== null) {
    const matchedText = match[0];
    const start = match.index;
    const end = start + matchedText.length;

    // Check if already covered by HTTP regex
    if (claimedRanges.some(([s, e]) => start >= s && end <= e)) {
      continue;
    }

    if (COMMON_UPPER_WORDS.has(matchedText)) {
      continue;
    }

    risks.push({
      id: `acronym-${start}`,
      text: matchedText,
      category: 'acronym',
      severity: 'medium',
      reason: 'Acronym pronunciation varies between letter-by-letter spelling (initialism) or whole-word phonation.',
      start,
      end,
      confidence: 'HIGH',
      ruleMatched: 'UPPERCASE_ACRONYM',
    });
  }

  return risks;
}
