import { PronunciationEntry } from './schemas';

/**
 * Pronunciation Knowledge Layer
 *
 * CRITICAL ARCHITECTURAL DISTINCTION:
 * Canonical human pronunciation (what human speakers intend to say)
 * IS NOT THE SAME AS
 * Best TTS spoken representation (the exact text string that prompts Rime to produce that sound).
 *
 * This layer maintains both concepts separately.
 */

const PRONUNCIATION_CATALOG: PronunciationEntry[] = [
  {
    term: 'Kubernetes',
    canonicalSpokenForm: 'koo-ber-net-eez',
    alternatives: ['k8s'],
    domain: 'software',
    language: 'en',
    notes: 'Native Rime synthesis pronounces Kubernetes accurately without artificial phonetic respelling.',
    source: 'verified_catalog',
    verificationStatus: 'verified',
    preferredTtsRepresentations: ['Kubernetes'],
    voicePreferences: {
      default: 'Kubernetes',
    },
  },
  {
    term: 'PostgreSQL',
    canonicalSpokenForm: 'Post-Gres-Q-L',
    alternatives: ['Postgres'],
    domain: 'software',
    language: 'en',
    notes: 'Standard technical pronunciation articulates "Post-Gres" followed by "Q-L".',
    source: 'verified_catalog',
    verificationStatus: 'known',
    preferredTtsRepresentations: ['Post-Gres-Q-L', 'Postgres Q L', 'PostgreSQL'],
    voicePreferences: {
      default: 'Post-Gres-Q-L',
    },
  },
  {
    term: 'SQL',
    canonicalSpokenForm: 'sequel',
    alternatives: ['S Q L'],
    domain: 'software',
    language: 'en',
    notes: 'Both "sequel" and "S Q L" are common industry conventions depending on team context.',
    source: 'verified_catalog',
    verificationStatus: 'known',
    preferredTtsRepresentations: ['sequel', 'S Q L'],
    voicePreferences: {
      default: 'sequel',
    },
  },
  {
    term: 'GraphQL',
    canonicalSpokenForm: 'Graph-Q-L',
    alternatives: ['graph Q L'],
    domain: 'software',
    language: 'en',
    notes: 'Spoken as "Graph" followed by the initialism "Q L".',
    source: 'verified_catalog',
    verificationStatus: 'known',
    preferredTtsRepresentations: ['Graph Q L'],
  },
  {
    term: 'gRPC',
    canonicalSpokenForm: 'G-R-P-C',
    alternatives: ['gee are pee see'],
    domain: 'software',
    language: 'en',
    notes: 'Articulated letter-by-letter to prevent slurred pronunciation of the initial lowercase g.',
    source: 'verified_catalog',
    verificationStatus: 'known',
    preferredTtsRepresentations: ['G R P C'],
  },
  {
    term: 'WebRTC',
    canonicalSpokenForm: 'Web-R-T-C',
    alternatives: ['web are tee see'],
    domain: 'software',
    language: 'en',
    notes: 'Articulated as "Web" followed by initialism "R T C".',
    source: 'verified_catalog',
    verificationStatus: 'known',
    preferredTtsRepresentations: ['Web R T C'],
  },
  {
    term: 'Nginx',
    canonicalSpokenForm: 'engine-X',
    alternatives: ['engine X'],
    domain: 'software',
    language: 'en',
    notes: 'Spoken as "engine-X"; tested against native Rime synthesis before phonetic substitution.',
    source: 'verified_catalog',
    verificationStatus: 'known',
    preferredTtsRepresentations: ['Nginx', 'engine X'],
  },
  {
    term: 'MongoDB',
    canonicalSpokenForm: 'Mongo-D-B',
    alternatives: ['mongo dee bee'],
    domain: 'software',
    language: 'en',
    notes: 'Spoken as "Mongo" followed by initialism "D B".',
    source: 'verified_catalog',
    verificationStatus: 'known',
    preferredTtsRepresentations: ['Mongo D B', 'MongoDB'],
  },
  {
    term: 'Neo4j',
    canonicalSpokenForm: 'neo-four-J',
    alternatives: ['neo 4 J'],
    domain: 'software',
    language: 'en',
    notes: 'Graph database name with embedded digit.',
    source: 'verified_catalog',
    verificationStatus: 'known',
    preferredTtsRepresentations: ['neo four J'],
  },
  {
    term: 'PyTorch',
    canonicalSpokenForm: 'pie-torch',
    alternatives: ['py torch'],
    domain: 'machine_learning',
    language: 'en',
    notes: 'Machine learning framework combining "pie" and "torch".',
    source: 'verified_catalog',
    verificationStatus: 'known',
    preferredTtsRepresentations: ['PyTorch', 'pie torch'],
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
