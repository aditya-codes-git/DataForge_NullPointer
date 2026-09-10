import { SpeechRisk } from '../schemas';

const EMAIL_REGEX = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g;

export function detectEmails(text: string): SpeechRisk[] {
  const risks: SpeechRisk[] = [];
  let match: RegExpExecArray | null;

  while ((match = EMAIL_REGEX.exec(text)) !== null) {
    const matchedText = match[0];
    risks.push({
      id: `email-${match.index}`,
      text: matchedText,
      category: 'email',
      severity: 'medium',
      reason: 'Email addresses require explicit vocalization of "@" (at) and "." (dot) symbols.',
      start: match.index,
      end: match.index + matchedText.length,
      confidence: 'HIGH',
      ruleMatched: 'EMAIL_FORMAT',
    });
  }

  return risks;
}
