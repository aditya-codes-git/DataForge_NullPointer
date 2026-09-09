import { SpeechRisk } from '../schemas';

// Matches times: e.g. 14:30 EST, 9:00 AM, 11:45pm PST, 08:30 UTC
const TIME_REGEX = /\b(?:[01]?\d|2[0-3]):[0-5]\d(?::[0-5]\d)?(?:\s*(?:AM|PM|am|pm))?(?:\s*(?:EST|PST|CST|MST|EDT|PDT|CDT|MDT|UTC|GMT|IST))?\b/g;

export function detectTimes(text: string): SpeechRisk[] {
  const risks: SpeechRisk[] = [];
  let match: RegExpExecArray | null;

  while ((match = TIME_REGEX.exec(text)) !== null) {
    const matchedText = match[0];
    
    // Skip if it looks like a ratio or bible verse without time context
    if (!/(?:am|pm|est|pst|cst|mst|utc|gmt|ist)/i.test(matchedText) && !/^[0-2]?\d:[0-5]\d$/.test(matchedText)) {
      continue;
    }

    risks.push({
      id: `time-${match.index}`,
      text: matchedText,
      category: 'time',
      severity: 'medium',
      reason: 'Colon time format and timezone acronyms sound smoother when converted to conversational spoken phrasing.',
      start: match.index,
      end: match.index + matchedText.length,
      confidence: 'HIGH',
      ruleMatched: 'TIME_FORMAT',
    });
  }

  return risks;
}
