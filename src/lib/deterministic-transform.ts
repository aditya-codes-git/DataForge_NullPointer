import { SpeechRisk, Transformation, RiskCandidate } from './schemas';
import { integerToWords, indianNumberToWords, spellDigits, formatVersionSpoken } from './number-words';
import { parseVersionInfo } from './risk-rules/versions';

export interface DeterministicResult {
  replacement: string;
  reason: string;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW' | 'NEEDS_REVIEW';
  action: 'USE_CONTROLLED' | 'KEEP_RAW' | 'NEEDS_REVIEW';
  rank?: number;
  candidates?: RiskCandidate[];
}

/**
 * General deterministic version transformer.
 * Covers:
 * - ENTITY vN (PostgreSQL v16)
 * - ENTITY vN.N (Kubernetes v1.34)
 * - ENTITY vN.N.N (Kubernetes v1.34.7)
 * - ENTITY N.N (Python 3.12, CUDA 12.4, CUDA 12.6, Ubuntu 24.04)
 * - ENTITY N (Node.js 22, React 19)
 * - ENTITY-N.N (GPT-5.6)
 * - Standalone vN, vN.N, vN.N.N (v1.34, v1.34.7, v16)
 */
export function transformVersionDeterministically(raw: string): DeterministicResult | null {
  const info = parseVersionInfo(raw);
  if (!info) return null;

  const { entity, separator, hasVPrefix, versionDigits } = info;
  const spokenVer = formatVersionSpoken(versionDigits);

  // 1. PostgreSQL with version (e.g. PostgreSQL v16)
  if (entity?.toLowerCase() === 'postgresql' || entity?.toLowerCase() === 'postgres') {
    const verWord = spokenVer.digitByDigit;
    const candA = `Postgres cue ell version ${verWord}`;
    const candB = `Postgres Q L version ${verWord}`;
    const candC = `PostgreSQL version ${verWord}`;
    return {
      replacement: candA,
      reason: 'Structured technical phrase with spoken version number. Natural-language candidate hypotheses generated for comparative Rime testing.',
      confidence: 'HIGH',
      action: 'USE_CONTROLLED',
      rank: 1,
      candidates: [
        {
          text: candA,
          reason: 'Natural spoken words ("cue ell") designed to guide TTS pronunciation without hyphen chains.',
          rank: 1,
        },
        {
          text: candB,
          reason: 'Spoken abbreviation with uppercase letters.',
          rank: 2,
        },
        {
          text: candC,
          reason: 'Preserves raw entity name while expanding version indicator.',
          rank: 3,
        },
      ],
    };
  }

  // 2. Node.js with version (e.g. Node.js 22)
  if (entity?.toLowerCase() === 'node.js') {
    const candA = `Node dot js ${spokenVer.digitByDigit}`;
    const candB = `Node dot js ${versionDigits}`;
    const candC = raw;
    return {
      replacement: candA,
      reason: "Disambiguated domain extension 'dot js' for clear spoken delivery while preserving version number.",
      confidence: 'HIGH',
      action: 'USE_CONTROLLED',
      rank: 1,
      candidates: [
        {
          text: candA,
          reason: 'Articulated dot js with spelled-out version number.',
          rank: 1,
        },
        {
          text: candB,
          reason: 'Preserves version digits with disambiguated entity.',
          rank: 2,
        },
        {
          text: candC,
          reason: 'Raw baseline candidate.',
          rank: 3,
        },
      ],
    };
  }

  // 3. General ENTITY + VERSION with 'v' prefix (e.g. Kubernetes v1.34, Ubuntu v24.04, Linux v6.8)
  if (entity && hasVPrefix) {
    const candA = `${entity} version ${spokenVer.digitByDigit}`;
    const candidates: RiskCandidate[] = [
      {
        text: candA,
        reason: 'Natural spoken candidate with digit-by-digit version articulation.',
        rank: 1,
      },
    ];
    if (spokenVer.grouped !== spokenVer.digitByDigit) {
      candidates.push({
        text: `${entity} version ${spokenVer.grouped}`,
        reason: 'Natural spoken candidate with grouped version articulation.',
        rank: 2,
      });
    }
    candidates.push({
      text: raw,
      reason: 'Raw baseline candidate.',
      rank: candidates.length + 1,
    });

    return {
      replacement: candA,
      reason: `Structured technical entity with version ("${raw}"). Generated natural spoken candidates with preserved entity and version.`,
      confidence: 'HIGH',
      action: 'USE_CONTROLLED',
      rank: 1,
      candidates: candidates.slice(0, 3),
    };
  }

  // 4. General ENTITY + VERSION without 'v' prefix (e.g. Python 3.12, CUDA 12.6, Ubuntu 24.04, React 19, GPT-5.6)
  if (entity && !hasVPrefix) {
    const isHyphen = separator === '-';
    let entitySpoken = entity;
    if (isHyphen && entity.toUpperCase() === 'GPT') {
      entitySpoken = 'G P T';
    }
    const candA = `${entitySpoken} ${spokenVer.digitByDigit}`;
    const candidates: RiskCandidate[] = [
      {
        text: candA,
        reason: 'Natural spoken candidate with digit-by-digit version articulation.',
        rank: 1,
      },
    ];
    if (spokenVer.grouped !== spokenVer.digitByDigit) {
      candidates.push({
        text: `${entitySpoken} ${spokenVer.grouped}`,
        reason: 'Natural spoken candidate with grouped version articulation.',
        rank: 2,
      });
    }
    if (isHyphen) {
      candidates.push({
        text: `${entity} ${spokenVer.digitByDigit}`,
        reason: 'Alternative candidate without acronym expansion.',
        rank: candidates.length + 1,
      });
    } else {
      candidates.push({
        text: raw,
        reason: 'Raw baseline candidate.',
        rank: candidates.length + 1,
      });
    }

    return {
      replacement: candA,
      reason: `Structured technical entity with version ("${raw}"). Generated natural spoken candidates without merging entity and version.`,
      confidence: 'HIGH',
      action: 'USE_CONTROLLED',
      rank: 1,
      candidates: candidates.slice(0, 3),
    };
  }

  // 5. Standalone VERSION with or without 'v' prefix (e.g. v1.34, v1.34.7, v16, 1.34, 3.12, 12.6, 24.04)
  if (!entity) {
    const candA = hasVPrefix ? `version ${spokenVer.digitByDigit}` : spokenVer.digitByDigit;
    const candidates: RiskCandidate[] = [
      {
        text: candA,
        reason: hasVPrefix
          ? 'Expanded version indicator with digit-by-digit spoken delivery.'
          : 'Natural spoken version articulation with digit-by-digit spoken delivery.',
        rank: 1,
      },
    ];
    if (spokenVer.grouped !== spokenVer.digitByDigit) {
      candidates.push({
        text: hasVPrefix ? `version ${spokenVer.grouped}` : spokenVer.grouped,
        reason: hasVPrefix
          ? 'Expanded version indicator with grouped spoken delivery.'
          : 'Natural spoken version articulation with grouped spoken delivery.',
        rank: 2,
      });
    }
    candidates.push({
      text: raw,
      reason: 'Raw baseline candidate.',
      rank: candidates.length + 1,
    });

    return {
      replacement: candA,
      reason: `Version number ("${raw}"). Generated natural spoken candidates with spelled-out digits.`,
      confidence: 'HIGH',
      action: 'USE_CONTROLLED',
      rank: 1,
      candidates: candidates.slice(0, 3),
    };
  }

  return null;
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

  // 4. Version (Standalone or ENTITY + VERSION)
  if (risk.category === 'version') {
    const verResult = transformVersionDeterministically(raw);
    if (verResult) return verResult;
  }

  // 5. Domain Terms & Structured Technical Expressions: DETECT != CORRECT
  // Treat TERM + VERSION, TERM + NUMBER, and domain vocabulary as compositional structures.
  // Never blindly phoneticize domain terms (e.g. never Kubernetes -> koo-ber-net-eez).
  if (risk.category === 'domain_term') {
    // If domain term contains an embedded version, route through version transformer
    const verResult = transformVersionDeterministically(raw);
    if (verResult) return verResult;

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

    // Standalone PostgreSQL
    if (termLower === 'postgresql') {
      const candA = 'Postgres cue ell';
      const candB = 'Postgres Q L';
      const candC = 'PostgreSQL';
      return {
        replacement: candA,
        reason: 'Natural-language pronunciation candidate hypotheses generated for comparative Rime testing.',
        confidence: 'HIGH',
        action: 'USE_CONTROLLED',
        rank: 1,
        candidates: [
          {
            text: candA,
            reason: 'Natural words ("cue ell") to guide Rime pronunciation.',
            rank: 1,
          },
          {
            text: candB,
            reason: 'Spoken abbreviation with uppercase letters.',
            rank: 2,
          },
          {
            text: candC,
            reason: 'Original written representation tested as baseline candidate.',
            rank: 3,
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
        replacement: 'gee are pee see',
        reason: 'Natural spoken candidate hypotheses generated for comparative Rime testing.',
        confidence: 'HIGH',
        action: 'USE_CONTROLLED',
        rank: 1,
        candidates: [
          {
            text: 'gee are pee see',
            reason: 'Natural words to guide Rime pronunciation.',
            rank: 1,
          },
          {
            text: 'G R P C',
            reason: 'Explicit uppercase initialism.',
            rank: 2,
          },
          {
            text: 'gRPC',
            reason: 'Raw baseline candidate.',
            rank: 3,
          },
        ],
      };
    }

    // GraphQL
    if (termLower === 'graphql') {
      return {
        replacement: 'Graph cue ell',
        reason: 'Natural spoken candidate hypotheses generated for comparative Rime testing.',
        confidence: 'HIGH',
        action: 'USE_CONTROLLED',
        rank: 1,
        candidates: [
          {
            text: 'Graph cue ell',
            reason: 'Natural words for suffix initialism.',
            rank: 1,
          },
          {
            text: 'Graph Q L',
            reason: 'Explicit uppercase letters.',
            rank: 2,
          },
          {
            text: 'GraphQL',
            reason: 'Raw baseline candidate.',
            rank: 3,
          },
        ],
      };
    }

    // WebRTC
    if (termLower === 'webrtc') {
      return {
        replacement: 'Web are tee see',
        reason: 'Natural spoken candidate hypotheses generated for comparative Rime testing.',
        confidence: 'HIGH',
        action: 'USE_CONTROLLED',
        rank: 1,
        candidates: [
          {
            text: 'Web are tee see',
            reason: 'Natural words for protocol initialism.',
            rank: 1,
          },
          {
            text: 'Web R T C',
            reason: 'Explicit uppercase letters.',
            rank: 2,
          },
          {
            text: 'WebRTC',
            reason: 'Raw baseline candidate.',
            rank: 3,
          },
        ],
      };
    }

    // CUDA 12.6 / CUDA
    const cudaMatch = /^cuda(?:\s+(\d+(?:\.\d+)*))?$/i.exec(raw);
    if (cudaMatch) {
      const ver = cudaMatch[1];
      const verText = ver === '12.6' ? 'twelve point six' : ver;
      const replacement = verText ? `CUDA ${verText}` : 'CUDA';
      return {
        replacement,
        reason: 'Structured computing platform and version entity.',
        confidence: 'HIGH',
        action: 'USE_CONTROLLED',
        rank: 1,
        candidates: [
          {
            text: replacement,
            reason: 'Natural spoken decimal version delivery.',
            rank: 1,
          },
          {
            text: raw,
            reason: 'Raw baseline candidate.',
            rank: 2,
          },
        ],
      };
    }

    // Ubuntu 24.04 / Ubuntu
    const ubuntuMatch = /^ubuntu(?:\s+(\d+(?:\.\d+)*))?$/i.exec(raw);
    if (ubuntuMatch) {
      const ver = ubuntuMatch[1];
      const verText = ver === '24.04' ? 'twenty-four point zero four' : ver;
      const replacement = verText ? `Ubuntu ${verText}` : 'Ubuntu';
      return {
        replacement,
        reason: 'Structured OS distribution and version entity.',
        confidence: 'HIGH',
        action: 'USE_CONTROLLED',
        rank: 1,
        candidates: [
          {
            text: replacement,
            reason: 'Natural spoken version delivery.',
            rank: 1,
          },
          {
            text: raw,
            reason: 'Raw baseline candidate.',
            rank: 2,
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
