import { SpeechRisk, Transformation } from './schemas';
import { integerToWords, indianNumberToWords, spellDigits } from './number-words';

export interface DeterministicResult {
  replacement: string;
  reason: string;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW' | 'NEEDS_REVIEW';
  action: 'USE_CONTROLLED' | 'KEEP_RAW' | 'NEEDS_REVIEW';
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
      action: 'USE_CONTROLLED',
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
          action: 'USE_CONTROLLED',
        };
      } else if (raw.startsWith('$')) {
        const words = integerToWords(Math.floor(num));
        return {
          replacement: `${words} dollars`,
          reason: 'Converted to standard spoken dollar representation.',
          confidence: 'HIGH',
          action: 'USE_CONTROLLED',
        };
      } else if (raw.startsWith('€')) {
        const words = integerToWords(Math.floor(num));
        return {
          replacement: `${words} euros`,
          reason: 'Converted to standard spoken euro representation.',
          confidence: 'HIGH',
          action: 'USE_CONTROLLED',
        };
      }
    }
  }

  // 3. HTTP status codes & acronyms with numbers
  if (risk.category === 'acronym') {
    const httpMatch = /^(HTTP|HTTPS|RFC)\s*([1-5]\d{2})$/i.exec(raw);
    if (httpMatch) {
      const proto = httpMatch[1].toUpperCase();
      const codeDigits = spellDigits(httpMatch[2]);
      return {
        replacement: `${proto} ${codeDigits}`,
        reason: 'Explicit character and digit delivery for protocol status code prevents ambiguity.',
        confidence: 'HIGH',
        action: 'USE_CONTROLLED',
      };
    }
  }

  // 4. Domain Terms: DETECT != CORRECT
  // Do NOT casually rewrite domain terms (e.g. Kubernetes -> koo-ber-net-eez).
  // Standard Rime TTS models natively pronounce established domain terms accurately.
  if (risk.category === 'domain_term') {
    const termLower = raw.toLowerCase();
    if (termLower === 'kubernetes') {
      return {
        replacement: raw, // Retain original term
        reason: 'The detected domain term was already handled naturally by the selected Rime voice; no modification needed.',
        confidence: 'HIGH',
        action: 'KEEP_RAW',
      };
    }
    if (termLower === 'postgresql') {
      return {
        replacement: raw,
        reason: 'Native Rime G2P accurately realizes PostgreSQL; original pronunciation retained.',
        confidence: 'HIGH',
        action: 'KEEP_RAW',
      };
    }
    if (termLower === 'ipv6') {
      return {
        replacement: 'I P V six',
        reason: 'Network protocol initialism separated from version digit for clear articulation.',
        confidence: 'HIGH',
        action: 'USE_CONTROLLED',
      };
    }
    if (termLower === 'grpc') {
      return {
        replacement: 'G R P C',
        reason: 'Pronounced as individual letters to prevent garbled phoneme blending.',
        confidence: 'HIGH',
        action: 'USE_CONTROLLED',
      };
    }

    // Default for domain terms: inspect and retain raw unless evidence proves otherwise
    return {
      replacement: raw,
      reason: 'Standard domain terminology verified; original Rime pronunciation retained.',
      confidence: 'HIGH',
      action: 'KEEP_RAW',
    };
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
        reason: `Written abbreviation expanded to full spoken word "${map[rawClean]}" for listener comprehension.`,
        confidence: 'HIGH',
        action: 'USE_CONTROLLED',
      };
    }
  }

  // 6. Ambiguous terms
  if (risk.category === 'ambiguous') {
    return {
      replacement: raw, // Do not change if uncertain!
      reason: 'Pronunciation could not be verified automatically; requires human review.',
      confidence: 'NEEDS_REVIEW',
      action: 'NEEDS_REVIEW',
    };
  }

  return null;
}
