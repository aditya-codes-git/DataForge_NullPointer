import { SpeechRisk, Transformation } from './schemas';
import { integerToWords, indianNumberToWords, spellDigits } from './number-words';

export interface DeterministicResult {
  replacement: string;
  reason: string;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW' | 'NEEDS_REVIEW';
}

export function transformRiskDeterministically(risk: SpeechRisk): DeterministicResult | null {
  const raw = risk.text;

  // 1. Alphanumeric Identifier
  if (risk.category === 'identifier') {
    const spelled = spellDigits(raw);
    return {
      replacement: spelled,
      reason: 'Articulated letter-by-letter and digit-by-digit to prevent slurred pronunciation.',
      confidence: 'HIGH',
    };
  }

  // 2. Currency
  if (risk.category === 'currency') {
    const isRupee = /[₹]|Rs\.?|INR/i.test(raw);
    const numericPartStr = raw.replace(/[^0-9.]/g, '');
    const num = parseFloat(numericPartStr);

    if (!isNaN(num)) {
      if (isRupee) {
        const words = indianNumberToWords(Math.floor(num));
        return {
          replacement: `${words} rupees`,
          reason: 'Converted to natural Indian spoken denomination (lakhs/crores) with explicit rupee currency.',
          confidence: 'HIGH',
        };
      } else if (raw.startsWith('$')) {
        const words = integerToWords(Math.floor(num));
        return {
          replacement: `${words} dollars`,
          reason: 'Converted to standard spoken dollar representation.',
          confidence: 'HIGH',
        };
      } else if (raw.startsWith('€')) {
        const words = integerToWords(Math.floor(num));
        return {
          replacement: `${words} euros`,
          reason: 'Converted to standard spoken euro representation.',
          confidence: 'HIGH',
        };
      }
    }
  }

  // 3. HTTP status codes
  if (risk.category === 'acronym') {
    const httpMatch = /^(HTTP|HTTPS|RFC)\s*([1-5]\d{2})$/i.exec(raw);
    if (httpMatch) {
      const proto = httpMatch[1].toUpperCase();
      const codeDigits = spellDigits(httpMatch[2]);
      return {
        replacement: `${proto} ${codeDigits}`,
        reason: 'HTTP protocol status code expanded into individual spoken digits for listener clarity.',
        confidence: 'HIGH',
      };
    }
  }

  // 4. Domain Terms
  if (risk.category === 'domain_term') {
    const termLower = raw.toLowerCase();
    if (termLower === 'kubernetes') {
      return {
        replacement: 'koo-ber-net-eez',
        reason: 'Normalized to standard technical phonetic realization (koo-ber-net-eez).',
        confidence: 'HIGH',
      };
    }
    if (termLower === 'postgresql') {
      return {
        replacement: 'Post-gres-Q-L',
        reason: 'Separated into clear syllabic cadence (Post-gres-Q-L).',
        confidence: 'HIGH',
      };
    }
    if (termLower === 'ipv6') {
      return {
        replacement: 'I P V six',
        reason: 'Pronounced as initialism with spoken version digit.',
        confidence: 'HIGH',
      };
    }
    if (termLower === 'neo4j') {
      return {
        replacement: 'neo four J',
        reason: 'Disambiguated digit reading within brand name.',
        confidence: 'HIGH',
      };
    }
    if (termLower === 'grpc') {
      return {
        replacement: 'G R P C',
        reason: 'Pronounced as individual letters rather than a garbled syllable.',
        confidence: 'HIGH',
      };
    }
  }

  // 5. Abbreviations
  if (risk.category === 'abbreviation') {
    const rawClean = raw.toLowerCase().trim();
    const map: Record<string, string> = {
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
    };
    if (map[rawClean]) {
      return {
        replacement: map[rawClean],
        reason: `Written abbreviation expanded to full word "${map[rawClean]}" for listener comprehension.`,
        confidence: 'HIGH',
      };
    }
  }

  // 6. Ambiguous terms
  if (risk.category === 'ambiguous') {
    return {
      replacement: raw, // Do not change if uncertain!
      reason: 'Pronunciation could not be verified automatically; requires human review.',
      confidence: 'NEEDS_REVIEW',
    };
  }

  return null;
}
