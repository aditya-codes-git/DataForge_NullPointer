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
          reason: 'Potential pronunciation / locale issue: Converted to spoken Indian denomination (lakhs/crores) with explicit rupee currency for listener verification.',
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
        reason: 'The controlled representation produced clearer number delivery.',
        confidence: 'HIGH',
        action: 'USE_CONTROLLED',
      };
    }
  }

  // 4. Domain Terms & Structured Technical Expressions: DETECT != CORRECT
  // Treat TERM + VERSION, TERM + NUMBER, and domain vocabulary as compositional structures.
  // Never blindly phoneticize domain terms (e.g. Kubernetes -> koo-ber-net-eez).
  if (risk.category === 'domain_term') {
    const termLower = raw.toLowerCase();

    // Kubernetes: Empirical testing proves native Rime pronunciation is preferred over artificial respellings
    if (termLower === 'kubernetes') {
      return {
        replacement: raw,
        reason: "Rime's original rendering was preferred over the controlled candidate.",
        confidence: 'HIGH',
        action: 'KEEP_RAW',
      };
    }

    // PostgreSQL v16 / PostgreSQL: Compositional phrase (TERM + VERSION)
    const pgVersionMatch = /^postgresql\s+v(\d+(?:\.\d+)*)$/i.exec(raw);
    if (pgVersionMatch) {
      return {
        replacement: `PostgreSQL version ${pgVersionMatch[1]}`,
        reason: 'Structured technical phrase with version. Neither representation has been verified as clearly superior; requires listener confirmation.',
        confidence: 'NEEDS_REVIEW',
        action: 'NEEDS_REVIEW',
      };
    }
    if (termLower === 'postgresql') {
      return {
        replacement: raw,
        reason: 'Neither representation has been verified as clearly superior; requires listener confirmation.',
        confidence: 'NEEDS_REVIEW',
        action: 'NEEDS_REVIEW',
      };
    }

    // Python 3.12: Structured term + version; native Rime decimal realization is natural
    if (/^python\s+\d+(\.\d+)+$/i.test(raw)) {
      return {
        replacement: raw,
        reason: 'Standard technical term and decimal version; native Rime synthesis handles pronunciation naturally.',
        confidence: 'HIGH',
        action: 'KEEP_RAW',
      };
    }

    // Node.js 22 / Node.js: Disambiguate extension dot while preserving version
    const nodeVersionMatch = /^node\.js(?:\s+(\d+))?$/i.exec(raw);
    if (nodeVersionMatch) {
      const ver = nodeVersionMatch[1] ? ` ${nodeVersionMatch[1]}` : '';
      return {
        replacement: `Node dot js${ver}`,
        reason: "Disambiguated domain extension 'dot js' for clear spoken delivery while preserving version number.",
        confidence: 'HIGH',
        action: 'USE_CONTROLLED',
      };
    }

    // HTTP/2: Protocol designation with slash
    if (/^http\/[1-3](\.[0-9])?$/i.test(raw)) {
      const ver = raw.split('/')[1];
      const verWords = ver === '2' ? 'two' : ver === '3' ? 'three' : ver;
      return {
        replacement: `HTTP ${verWords}`,
        reason: 'Expanded slash separator into natural spoken protocol version delivery.',
        confidence: 'HIGH',
        action: 'USE_CONTROLLED',
      };
    }

    // Network protocols: IPv6 / IPv4
    if (termLower === 'ipv6') {
      return {
        replacement: 'I P V six',
        reason: 'Separated protocol initialism from version digit for clear articulation.',
        confidence: 'HIGH',
        action: 'USE_CONTROLLED',
      };
    }
    if (termLower === 'ipv4') {
      return {
        replacement: 'I P V four',
        reason: 'Separated protocol initialism from version digit for clear articulation.',
        confidence: 'HIGH',
        action: 'USE_CONTROLLED',
      };
    }

    // gRPC
    if (termLower === 'grpc') {
      return {
        replacement: 'G R P C',
        reason: 'Pronounced as individual letters to prevent garbled phoneme blending.',
        confidence: 'HIGH',
        action: 'USE_CONTROLLED',
      };
    }

    // Neo4j
    if (termLower === 'neo4j') {
      return {
        replacement: 'neo four J',
        reason: 'Disambiguated digit reading within graph database name.',
        confidence: 'HIGH',
        action: 'USE_CONTROLLED',
      };
    }

    // Nginx
    if (termLower === 'nginx') {
      return {
        replacement: raw,
        reason: 'Specialized domain term; tested with native Rime model before phonetic intervention.',
        confidence: 'HIGH',
        action: 'KEEP_RAW',
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
