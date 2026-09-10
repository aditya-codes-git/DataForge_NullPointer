import { PronunciationEntry } from './schemas';

/**
 * Pronunciation Knowledge Layer
 *
 * CRITICAL THREE-WAY ARCHITECTURAL DISTINCTION:
 * 1. ORIGINAL WRITTEN FORM (e.g. "PostgreSQL v16")
 * 2. CANONICAL SPOKEN FORM (e.g. "Postgres cue ell", what humans say)
 * 3. TTS SPONEN REPRESENTATION (e.g. "Postgres cue ell version sixteen", "Postgres Q L version sixteen", "PostgreSQL version sixteen")
 *
 * The canonical spoken form is NOT automatically the correct TTS input.
 * A TTS representation is a natural hypothesis that must be verified through actual Rime synthesis.
 */

const PRONUNCIATION_CATALOG: PronunciationEntry[] = [
  // 1. PostgreSQL & Versioned Variants
  {
    term: 'PostgreSQL',
    canonicalSpokenForm: 'Postgres cue ell',
    alternatives: ['Postgres', 'PostgreSql'],
    domain: 'software',
    language: 'en',
    notes: 'Conventional industry pronunciation articulates "Postgres" followed by letters "Q L" or natural "cue ell".',
    source: 'verified_catalog',
    verificationStatus: 'known',
    ttsRepresentations: ['Postgres cue ell', 'Postgres Q L', 'PostgreSQL'],
    preferredTtsRepresentations: ['Postgres cue ell', 'Postgres Q L', 'PostgreSQL'],
    voicePreferences: {
      default: 'Postgres cue ell',
    },
  },
  {
    term: 'PostgreSQL v16',
    canonicalSpokenForm: 'Postgres cue ell version sixteen',
    alternatives: ['PostgreSQL 16', 'Postgres v16'],
    domain: 'software',
    language: 'en',
    notes: 'Structured technical entity with version. Must never be merged into malformed "postgresv 16".',
    source: 'verified_catalog',
    verificationStatus: 'known',
    ttsRepresentations: [
      'Postgres cue ell version sixteen',
      'Postgres Q L version sixteen',
      'PostgreSQL version sixteen',
    ],
    preferredTtsRepresentations: [
      'Postgres cue ell version sixteen',
      'Postgres Q L version sixteen',
      'PostgreSQL version sixteen',
    ],
    voicePreferences: {
      default: 'Postgres cue ell version sixteen',
    },
  },

  // 2. Kubernetes
  {
    term: 'Kubernetes',
    canonicalSpokenForm: 'koo-ber-net-eez',
    alternatives: ['k8s'],
    domain: 'software',
    language: 'en',
    notes: 'Native Rime synthesis pronounces Kubernetes accurately without artificial phonetic respelling.',
    source: 'verified_catalog',
    verificationStatus: 'verified',
    ttsRepresentations: ['Kubernetes'],
    preferredTtsRepresentations: ['Kubernetes'],
    voicePreferences: {
      default: 'Kubernetes',
    },
  },
  {
    term: 'Kubernetes v1.34',
    canonicalSpokenForm: 'Kubernetes version one point three four',
    alternatives: ['Kubernetes 1.34'],
    domain: 'software',
    language: 'en',
    notes: 'Structured container orchestration platform and release version.',
    source: 'verified_catalog',
    verificationStatus: 'known',
    ttsRepresentations: [
      'Kubernetes version one point three four',
      'Kubernetes version one point thirty-four',
      'Kubernetes v1.34',
    ],
    preferredTtsRepresentations: [
      'Kubernetes version one point three four',
      'Kubernetes version one point thirty-four',
      'Kubernetes v1.34',
    ],
  },

  // 3. SQL
  {
    term: 'SQL',
    canonicalSpokenForm: 'sequel',
    alternatives: ['S Q L'],
    domain: 'software',
    language: 'en',
    notes: 'Both "sequel" and letter-by-letter "S Q L" are common industry conventions.',
    source: 'verified_catalog',
    verificationStatus: 'known',
    ttsRepresentations: ['sequel', 'S Q L', 'SQL'],
    preferredTtsRepresentations: ['sequel', 'S Q L', 'SQL'],
    voicePreferences: {
      default: 'sequel',
    },
  },

  // 4. GraphQL
  {
    term: 'GraphQL',
    canonicalSpokenForm: 'Graph-Q-L',
    alternatives: ['graph Q L'],
    domain: 'software',
    language: 'en',
    notes: 'Spoken as "Graph" followed by "Q L" or natural "cue ell".',
    source: 'verified_catalog',
    verificationStatus: 'known',
    ttsRepresentations: ['Graph cue ell', 'Graph Q L', 'GraphQL'],
    preferredTtsRepresentations: ['Graph cue ell', 'Graph Q L', 'GraphQL'],
  },

  // 5. gRPC
  {
    term: 'gRPC',
    canonicalSpokenForm: 'G-R-P-C',
    alternatives: ['gee are pee see'],
    domain: 'software',
    language: 'en',
    notes: 'Articulated letter-by-letter to prevent slurred pronunciation of the initial lowercase g.',
    source: 'verified_catalog',
    verificationStatus: 'known',
    ttsRepresentations: ['gee are pee see', 'G R P C', 'gRPC'],
    preferredTtsRepresentations: ['gee are pee see', 'G R P C', 'gRPC'],
  },

  // 6. WebRTC
  {
    term: 'WebRTC',
    canonicalSpokenForm: 'Web-R-T-C',
    alternatives: ['web are tee see'],
    domain: 'software',
    language: 'en',
    notes: 'Articulated as "Web" followed by initialism "R T C".',
    source: 'verified_catalog',
    verificationStatus: 'known',
    ttsRepresentations: ['Web are tee see', 'Web R T C', 'WebRTC'],
    preferredTtsRepresentations: ['Web are tee see', 'Web R T C', 'WebRTC'],
  },

  // 7. Nginx
  {
    term: 'Nginx',
    canonicalSpokenForm: 'engine-X',
    alternatives: ['engine X'],
    domain: 'software',
    language: 'en',
    notes: 'Spoken as "engine-X"; tested against native Rime synthesis before phonetic substitution.',
    source: 'verified_catalog',
    verificationStatus: 'known',
    ttsRepresentations: ['Nginx', 'engine X'],
    preferredTtsRepresentations: ['Nginx', 'engine X'],
  },

  // 8. CUDA & Versioned
  {
    term: 'CUDA',
    canonicalSpokenForm: 'coo-duh',
    alternatives: ['cuda'],
    domain: 'software',
    language: 'en',
    notes: 'NVIDIA parallel computing platform.',
    source: 'verified_catalog',
    verificationStatus: 'known',
    ttsRepresentations: ['CUDA', 'coo duh'],
    preferredTtsRepresentations: ['CUDA', 'coo duh'],
  },
  {
    term: 'CUDA 12.6',
    canonicalSpokenForm: 'CUDA twelve point six',
    alternatives: ['CUDA v12.6'],
    domain: 'software',
    language: 'en',
    notes: 'Structured platform and version entity.',
    source: 'verified_catalog',
    verificationStatus: 'known',
    ttsRepresentations: ['CUDA twelve point six', 'CUDA 12.6'],
    preferredTtsRepresentations: ['CUDA twelve point six', 'CUDA 12.6'],
  },

  // 9. Ubuntu & Versioned
  {
    term: 'Ubuntu',
    canonicalSpokenForm: 'oo-boon-too',
    alternatives: ['ubuntu'],
    domain: 'software',
    language: 'en',
    notes: 'Linux distribution.',
    source: 'verified_catalog',
    verificationStatus: 'known',
    ttsRepresentations: ['Ubuntu', 'oo boon too'],
    preferredTtsRepresentations: ['Ubuntu', 'oo boon too'],
  },
  {
    term: 'Ubuntu 24.04',
    canonicalSpokenForm: 'Ubuntu twenty-four point zero four',
    alternatives: ['Ubuntu 24.04 LTS'],
    domain: 'software',
    language: 'en',
    notes: 'Structured OS distribution and decimal release version.',
    source: 'verified_catalog',
    verificationStatus: 'known',
    ttsRepresentations: ['Ubuntu twenty-four point zero four', 'Ubuntu 24.04'],
    preferredTtsRepresentations: ['Ubuntu twenty-four point zero four', 'Ubuntu 24.04'],
  },

  // 10. Node.js 22 & Python 3.12
  {
    term: 'Node.js 22',
    canonicalSpokenForm: 'Node dot J S twenty-two',
    alternatives: ['Node.js v22', 'Nodejs 22'],
    domain: 'software',
    language: 'en',
    notes: 'Runtime name with disambiguated dot extension and version.',
    source: 'verified_catalog',
    verificationStatus: 'known',
    ttsRepresentations: ['Node dot js twenty-two', 'Node dot js 22', 'Node.js 22'],
    preferredTtsRepresentations: ['Node dot js twenty-two', 'Node dot js 22', 'Node.js 22'],
  },
  {
    term: 'Python 3.12',
    canonicalSpokenForm: 'Python three point twelve',
    alternatives: ['Python v3.12'],
    domain: 'software',
    language: 'en',
    notes: 'Programming language and decimal version.',
    source: 'verified_catalog',
    verificationStatus: 'known',
    ttsRepresentations: ['Python three point one two', 'Python three point twelve', 'Python 3.12'],
    preferredTtsRepresentations: ['Python three point one two', 'Python three point twelve', 'Python 3.12'],
  },

  // 11. NumPy
  {
    term: 'NumPy',
    canonicalSpokenForm: 'num-pie',
    alternatives: ['numpy', 'Numpy'],
    domain: 'machine_learning',
    language: 'en',
    notes: 'Python scientific computing package pronounced "num-pie".',
    source: 'verified_catalog',
    verificationStatus: 'known',
    ttsRepresentations: ['Num-pie', 'NumPy'],
    preferredTtsRepresentations: ['Num-pie', 'NumPy'],
  },

  // 12. OAuth & JWT
  {
    term: 'OAuth',
    canonicalSpokenForm: 'O-auth',
    alternatives: ['oauth', 'OAuth 2.0'],
    domain: 'software',
    language: 'en',
    notes: 'Open authorization standard.',
    source: 'verified_catalog',
    verificationStatus: 'known',
    ttsRepresentations: ['O-auth', 'OAuth'],
    preferredTtsRepresentations: ['O-auth', 'OAuth'],
  },
  {
    term: 'JWT',
    canonicalSpokenForm: 'jot',
    alternatives: ['jwt'],
    domain: 'software',
    language: 'en',
    notes: 'JSON Web Token, colloquially spoken as "jot" or initialism "J W T".',
    source: 'verified_catalog',
    verificationStatus: 'known',
    ttsRepresentations: ['jot', 'J W T', 'JWT'],
    preferredTtsRepresentations: ['jot', 'J W T', 'JWT'],
  },

  // 13. Protocols & Architectures: HTTP/2, IPv6, AMD64
  {
    term: 'HTTP/2',
    canonicalSpokenForm: 'H T T P two',
    alternatives: ['http/2'],
    domain: 'networking',
    language: 'en',
    notes: 'Protocol specification with slash separator.',
    source: 'verified_catalog',
    verificationStatus: 'known',
    ttsRepresentations: ['HTTP two', 'HTTP/2'],
    preferredTtsRepresentations: ['HTTP two', 'HTTP/2'],
  },
  {
    term: 'IPv6',
    canonicalSpokenForm: 'I P V six',
    alternatives: ['ipv6'],
    domain: 'networking',
    language: 'en',
    notes: 'Internet Protocol version 6.',
    source: 'verified_catalog',
    verificationStatus: 'known',
    ttsRepresentations: ['I P V six', 'IPv6'],
    preferredTtsRepresentations: ['I P V six', 'IPv6'],
  },
  {
    term: 'AMD64',
    canonicalSpokenForm: 'A M D sixty-four',
    alternatives: ['amd64', 'x86-64'],
    domain: 'hardware',
    language: 'en',
    notes: '64-bit architecture designation combining initialism and number.',
    source: 'verified_catalog',
    verificationStatus: 'known',
    ttsRepresentations: ['A M D sixty-four', 'AMD64'],
    preferredTtsRepresentations: ['A M D sixty-four', 'AMD64'],
  },

  // 14. ML Frameworks & Brands: OpenAI, PyTorch, MongoDB, Neo4j
  {
    term: 'OpenAI',
    canonicalSpokenForm: 'open A I',
    alternatives: ['openai'],
    domain: 'machine_learning',
    language: 'en',
    notes: 'Brand combining "open" and initialism "A I".',
    source: 'verified_catalog',
    verificationStatus: 'known',
    ttsRepresentations: ['OpenAI', 'Open A I'],
    preferredTtsRepresentations: ['OpenAI', 'Open A I'],
  },
  {
    term: 'PyTorch',
    canonicalSpokenForm: 'pie-torch',
    alternatives: ['py torch', 'pytorch'],
    domain: 'machine_learning',
    language: 'en',
    notes: 'Machine learning framework combining "pie" and "torch".',
    source: 'verified_catalog',
    verificationStatus: 'known',
    ttsRepresentations: ['PyTorch', 'pie torch'],
    preferredTtsRepresentations: ['PyTorch', 'pie torch'],
  },
  {
    term: 'MongoDB',
    canonicalSpokenForm: 'Mongo-D-B',
    alternatives: ['mongodb'],
    domain: 'software',
    language: 'en',
    notes: 'Spoken as "Mongo" followed by initialism "D B".',
    source: 'verified_catalog',
    verificationStatus: 'known',
    ttsRepresentations: ['Mongo D B', 'MongoDB'],
    preferredTtsRepresentations: ['Mongo D B', 'MongoDB'],
  },
  {
    term: 'Neo4j',
    canonicalSpokenForm: 'neo-four-J',
    alternatives: ['neo4j'],
    domain: 'software',
    language: 'en',
    notes: 'Graph database name with embedded digit.',
    source: 'verified_catalog',
    verificationStatus: 'known',
    ttsRepresentations: ['neo four J', 'Neo4j'],
    preferredTtsRepresentations: ['neo four J', 'Neo4j'],
  },
];

/**
 * Retrieve pronunciation knowledge for a given term.
 */
export function lookupPronunciationKnowledge(
  term: string,
  options?: { domain?: string; voice?: string }
): PronunciationEntry | null {
  const normalized = term.trim().toLowerCase();

  const found = PRONUNCIATION_CATALOG.find((entry) => {
    if (entry.term.toLowerCase() === normalized) return true;
    if (entry.alternatives?.some((alt) => alt.toLowerCase() === normalized)) return true;
    return false;
  });

  if (!found) return null;

  return found;
}

/**
 * Get all known catalog terms.
 */
export function getAllKnowledgeTerms(): PronunciationEntry[] {
  return [...PRONUNCIATION_CATALOG];
}
