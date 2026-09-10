import { SpeechRisk } from '../schemas';

// Matches currencies:
// ₹, $, €, £, ¥, Rs., INR, USD, EUR, GBP followed by formatted numbers
const CURRENCY_REGEX = /(?:[₹$€£¥]|(?:Rs\.?|INR|USD|EUR|GBP)\s*)\d+(?:[.,]\d+)*(?:\s*(?:lakh|crore|million|billion|k))?/gi;

export function detectCurrency(text: string): SpeechRisk[] {
  const risks: SpeechRisk[] = [];
  let match: RegExpExecArray | null;

  while ((match = CURRENCY_REGEX.exec(text)) !== null) {
    const matchedText = match[0].trim();
    
    // Check if it includes Indian Lakh formatting (e.g., 1,25,000)
    const isIndianGrouping = /\b\d{1,2},\d{2},\d{3}\b/.test(matchedText);
    const isRupee = /[₹]|Rs\.?|INR/i.test(matchedText);

    let reason = 'Currency formatting requires explicit spoken denomination to avoid ambiguous reading.';
    if (isIndianGrouping || isRupee) {
      reason = 'Indian numbering format (lakhs/crores) or rupee symbol is frequently misread by English TTS without phonetic normalization.';
    }

    risks.push({
      id: `curr-${match.index}`,
      text: matchedText,
      category: 'currency',
      severity: 'medium',
      reason,
      start: match.index,
      end: match.index + matchedText.length,
      confidence: 'HIGH',
      ruleMatched: isIndianGrouping ? 'INDIAN_CURRENCY_GROUPING' : 'CURRENCY_FORMAT',
    });
  }

  return risks;
}
