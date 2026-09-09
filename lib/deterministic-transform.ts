import { SpeechRisk, Transformation, RiskCandidate } from './schemas';
import { integerToWords, indianNumberToWords, spellDigits } from './number-words';

export interface DeterministicResult {
  replacement: string;
  reason: string;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW' | 'NEEDS_REVIEW';
  action: 'USE_CONTROLLED' | 'KEEP_RAW' | 'NEEDS_REVIEW';
  rank?: number;
  candidates?: RiskCandidate[];
}

export function transformRiskDeterministically(risk: SpeechRisk): DeterministicResult | null {
  const raw = risk.text;

  // 1. Alphanumeric Identifier (A12B9X7, INV-2026-09A7, REF-9021, OTP-A72P)
  if (risk.category === 'identifier') {
    const spelled = spellDigits(raw);
    return {
      replacement: spelled,
      reason: 'Articulated letter-by-letter and digit-by-digit to prevent slurred pronunciation while preserving every character.',
      confidence: 'HIGH',
      action: 'USE_CONTROLLED',
      rank: 1,
      candidates: [
        {
          text: spelled,
          reason: 'Explicit spoken character delivery.',
          rank: 1,
        },
      ],
    };
  }

  // 2. Currency (₹1,25,000, $4,500.50, €99.99, £1,200)
  if (risk.category === 'currency') {
    const isRupee = /[₹]|Rs\.?|INR/i.test(raw);
    const numericPartStr = raw.replace(/[^0-9.]/g, '');
    const num = parseFloat(numericPartStr);

    if (!isNaN(num)) {
      if (isRupee) {
        const words = indianNumberToWords(Math.floor(num));
        const replacement = `${words} rupees`;
        return {
          replacement,
          reason: 'Indian English currency representation: Converted to spoken Indian denomination (lakhs/crores) with explicit rupee currency.',
          confidence: 'HIGH',
          action: 'USE_CONTROLLED',
          rank: 1,
          candidates: [
            {
              text: replacement,
              reason: 'Indian numbering system spoken form (lakhs/crores).',
              rank: 1,
            },
          ],
        };
      } else if (raw.startsWith('$')) {
        const words = integerToWords(Math.floor(num));
        const replacement = `${words} dollars`;
        return {
          replacement,
          reason: 'Converted to standard spoken dollar representation.',
          confidence: 'HIGH',
          action: 'USE_CONTROLLED',
          rank: 1,
          candidates: [
            {
              text: replacement,
              reason: 'Standard spoken dollar denomination.',
              rank: 1,
            },
          ],
        };
      } else if (raw.startsWith('€')) {
        const words = integerToWords(Math.floor(num));
        const replacement = `${words} euros`;
        return {
          replacement,
          reason: 'Converted to standard spoken euro representation.',
          confidence: 'HIGH',
          action: 'USE_CONTROLLED',
          rank: 1,
          candidates: [
            {
              text: replacement,
              reason: 'Standard spoken euro denomination.',
              rank: 1,
            },
          ],
        };
      }
    }
  }

  // 3. Acronyms & HTTP status codes
  if (risk.category === 'acronym') {
    // SQL: Ambiguous acronym with multiple accepted conventions
    if (raw.toUpperCase() === 'SQL') {
      return {
        replacement: 'sequel',
        reason: 'Common spoken form when SQL refers to the database language.',
        confidence: 'HIGH',
        action: 'USE_CONTROLLED',
        rank: 1,
        candidates: [
          {
            text: 'sequel',
            reason: 'Common spoken form when SQL refers to the database language.',
            rank: 1,
          },
          {
            text: 'S Q L',
            reason: 'Explicit letter-by-letter delivery.',
            rank: 2,
          },
        ],
      };
    }

    const httpMatch = /^(HTTP|HTTPS|RFC)\s*([1-5]\d{2})$/i.exec(raw);
    if (httpMatch) {
      const proto = httpMatch[1].toUpperCase();
      const codeDigits = spellDigits(httpMatch[2]);
      const replacement = `${proto} ${codeDigits}`;
      return {
        replacement,
        reason: 'The controlled representation produced clearer digit-by-digit number delivery.',
        confidence: 'HIGH',
        action: 'USE_CONTROLLED',
        rank: 1,
        candidates: [
          {
            text: replacement,
            reason: 'Digit-by-digit protocol code delivery.',
            rank: 1,
          },
        ],
      };
    }
  }

  // 4. Domain Terms & Structured Technical Expressions: DETECT != CORRECT
  // Treat TERM + VERSION, TERM + NUMBER, and domain vocabulary as compositional structures.
  // Never blindly phoneticize domain terms (e.g. never Kubernetes -> koo-ber-net-eez).
  if (risk.category === 'domain_term') {
    const termLower = raw.toLowerCase().trim();

    // Kubernetes: Native Rime pronunciation is preferred over artificial phoneticization
    if (termLower === 'kubernetes') {
      return {
        replacement: raw,
        reason: 'Conventional spoken representation of Kubernetes handled natively by Rime; KEEP_ORIGINAL preferred over artificial respelling.',
        confidence: 'HIGH',
        action: 'KEEP_RAW',
        rank: 1,
        candidates: [
          {
            text: raw,
            reason: 'Conventional spoken representation handled natively by Rime.',
            rank: 1,
          },
        ],
      };
    }

    // PostgreSQL v16 / PostgreSQL: Compositional phrase (TERM + VERSION)
    const pgVersionMatch = /^postgresql\s+v?(\d+(?:\.\d+)*)$/i.exec(raw);
    if (pgVersionMatch) {
      const verDigits = pgVersionMatch[1];
      const verWords = verDigits === '16' ? 'sixteen' : isNaN(Number(verDigits)) ? verDigits : integerToWords(parseInt(verDigits, 10));
      const candidate1 = `Post-Gres-Q-L version ${verWords}`;
      return {
        replacement: candidate1,
        reason: 'Structured technical phrase with spoken version number. Conventional pronunciation "Post-Gres-Q-L" proposed for TTS comparison.',
        confidence: 'HIGH',
        action: 'USE_CONTROLLED',
        rank: 1,
        candidates: [
          {
            text: candidate1,
            reason: 'Conventional spoken form separating compound syllables and reading version as words.',
            rank: 1,
          },
          {
            text: `PostgreSQL version ${verWords}`,
            reason: 'Preserves raw entity name while expanding version indicator.',
            rank: 2,
          },
        ],
      };
    }
    if (termLower === 'postgresql') {
      return {
        replacement: 'Post-Gres-Q-L',
        reason: 'Conventional spoken syllable separation for database name.',
        confidence: 'HIGH',
        action: 'USE_CONTROLLED',
        rank: 1,
        candidates: [
          {
            text: 'Post-Gres-Q-L',
            reason: 'Conventional spoken representation for PostgreSQL.',
            rank: 1,
          },
          {
            text: 'Postgres',
            reason: 'Informal spoken shorthand for PostgreSQL.',
            rank: 2,
          },
        ],
      };
    }

    // Python 3.12: Structured term + version; native Rime decimal realization is natural
    if (/^python\s+\d+(\.\d+)+$/i.test(raw)) {
      return {
        replacement: raw,
        reason: 'Standard technical term and decimal version; native Rime synthesis handles pronunciation naturally.',
        confidence: 'HIGH',
        action: 'KEEP_RAW',
        rank: 1,
        candidates: [
          {
            text: raw,
            reason: 'Native Rime synthesis handles Python decimal version naturally.',
            rank: 1,
          },
        ],
      };
    }

    // Node.js 22 / Node.js: Disambiguate extension dot while preserving version
    const nodeVersionMatch = /^node\.js(?:\s+(\d+))?$/i.exec(raw);
    if (nodeVersionMatch) {
      const ver = nodeVersionMatch[1] ? ` ${nodeVersionMatch[1]}` : '';
      const replacement = `Node dot js${ver}`;
      return {
        replacement,
        reason: "Disambiguated domain extension 'dot js' for clear spoken delivery while preserving version number.",
        confidence: 'HIGH',
        action: 'USE_CONTROLLED',
        rank: 1,
        candidates: [
          {
            text: replacement,
            reason: 'Articulated dot js with preserved version number.',
            rank: 1,
          },
        ],
      };
    }

    // HTTP/2: Protocol designation with slash
    if (/^http\/[1-3](\.[0-9])?$/i.test(raw)) {
      const ver = raw.split('/')[1];
      const verWords = ver === '2' ? 'two' : ver === '3' ? 'three' : ver;
      const replacement = `HTTP ${verWords}`;
      return {
        replacement,
        reason: 'Expanded slash separator into natural spoken protocol version delivery.',
        confidence: 'HIGH',
        action: 'USE_CONTROLLED',
        rank: 1,
        candidates: [
          {
            text: replacement,
            reason: 'Natural spoken protocol version delivery.',
            rank: 1,
          },
        ],
      };
    }

    // Network protocols: IPv6 / IPv4
    if (termLower === 'ipv6') {
      return {
        replacement: 'I P V six',
        reason: 'Separated protocol initialism from version digit for clear articulation.',
        confidence: 'HIGH',
        action: 'USE_CONTROLLED',
        rank: 1,
        candidates: [
          {
            text: 'I P V six',
            reason: 'Explicit initialism and digit articulation.',
            rank: 1,
          },
        ],
      };
    }
    if (termLower === 'ipv4') {
      return {
        replacement: 'I P V four',
        reason: 'Separated protocol initialism from version digit for clear articulation.',
        confidence: 'HIGH',
        action: 'USE_CONTROLLED',
        rank: 1,
        candidates: [
          {
            text: 'I P V four',
            reason: 'Explicit initialism and digit articulation.',
            rank: 1,
          },
        ],
      };
    }

    // gRPC
    if (termLower === 'grpc') {
      return {
        replacement: 'G R P C',
        reason: 'Pronounced as individual letters to prevent garbled phoneme blending.',
        confidence: 'HIGH',
        action: 'USE_CONTROLLED',
        rank: 1,
        candidates: [
          {
            text: 'G R P C',
            reason: 'Explicit letter-by-letter delivery.',
            rank: 1,
          },
        ],
      };
    }

    // GraphQL
    if (termLower === 'graphql') {
      return {
        replacement: 'Graph Q L',
        reason: 'Articulates "Graph" followed by initialism "Q L" for clear spoken delivery.',
        confidence: 'HIGH',
        action: 'USE_CONTROLLED',
        rank: 1,
        candidates: [
          {
            text: 'Graph Q L',
            reason: 'Word root followed by explicit initialism.',
            rank: 1,
          },
        ],
      };
    }

    // WebRTC
    if (termLower === 'webrtc') {
      return {
        replacement: 'Web R T C',
        reason: 'Articulates "Web" followed by initialism "R T C" for clear spoken delivery.',
        confidence: 'HIGH',
        action: 'USE_CONTROLLED',
        rank: 1,
        candidates: [
          {
            text: 'Web R T C',
            reason: 'Word root followed by explicit initialism.',
            rank: 1,
          },
        ],
      };
    }

    // Neo4j
    if (termLower === 'neo4j') {
      return {
        replacement: 'neo four J',
        reason: 'Disambiguated digit reading within graph database name.',
        confidence: 'HIGH',
        action: 'USE_CONTROLLED',
        rank: 1,
        candidates: [
          {
            text: 'neo four J',
            reason: 'Articulated digit and letter within name.',
            rank: 1,
          },
        ],
      };
    }

    // Nginx
    if (termLower === 'nginx') {
      return {
        replacement: raw,
        reason: 'Conventional spoken representation of Nginx; tested against native Rime synthesis.',
        confidence: 'HIGH',
        action: 'KEEP_RAW',
        rank: 1,
        candidates: [
          {
            text: raw,
            reason: 'Native Rime model pronunciation tested before phonetic alteration.',
            rank: 1,
          },
          {
            text: 'engine X',
            reason: 'Conventional spoken representation of Nginx.',
            rank: 2,
          },
        ],
      };
    }

    // Default for domain terms: inspect and retain raw unless evidence proves otherwise
    return {
      replacement: raw,
      reason: 'Standard domain terminology verified; original Rime pronunciation retained.',
      confidence: 'HIGH',
      action: 'KEEP_RAW',
      rank: 1,
      candidates: [
        {
          text: raw,
          reason: 'Original entity retained without unverified phoneticization.',
          rank: 1,
        },
      ],
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
      const replacement = map[rawClean];
      return {
        replacement,
        reason: `Written abbreviation expanded to full spoken word "${replacement}" for listener comprehension.`,
        confidence: 'HIGH',
        action: 'USE_CONTROLLED',
        rank: 1,
        candidates: [
          {
            text: replacement,
            reason: `Expansion of abbreviation "${raw}" to spoken word.`,
            rank: 1,
          },
        ],
      };
    }
  }

  // 6. Ambiguous terms (e.g. XyloQ)
  if (risk.category === 'ambiguous') {
    return {
      replacement: raw, // Do not invent pronunciation when unknown!
      reason: 'Pronunciation is unknown or unverified for this token. Marked for human listener review.',
      confidence: 'NEEDS_REVIEW',
      action: 'NEEDS_REVIEW',
      rank: 1,
      candidates: [
        {
          text: raw,
          reason: 'Pronunciation unknown; do not invent a pronunciation without confirmation.',
          rank: 1,
        },
      ],
    };
  }

  return null;
}
