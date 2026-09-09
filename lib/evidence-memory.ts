import { EvidenceRecord, VerificationSubmission, DecisionStatus, RiskCategory } from './schemas';

// In-memory provenance evidence store
const EVIDENCE_STORE = new Map<string, EvidenceRecord>();

// Verified preferences: key format: "term:domain:voice" or "term::"
const VERIFIED_PREFERENCES = new Map<string, { preference: string; count: number; lastUpdated: string }>();

/**
 * Record a comparison provenance entry into the evidence store
 */
export function recordEvidence(
  entry: Omit<EvidenceRecord, 'id' | 'timestamp'>
): EvidenceRecord {
  const id = `ev-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const record: EvidenceRecord = {
    ...entry,
    id,
    timestamp: new Date().toISOString(),
  };

  EVIDENCE_STORE.set(id, record);
  return record;
}

/**
 * Retrieve evidence record by ID
 */
export function getEvidenceById(id: string): EvidenceRecord | null {
  return EVIDENCE_STORE.get(id) || null;
}

/**
 * Record a human verification decision from a listener test
 */
export function recordHumanVerification(submission: VerificationSubmission): boolean {
  const evidence = EVIDENCE_STORE.get(submission.comparisonId);
  if (!evidence) {
    // If not found, create a lightweight record
    const id = submission.comparisonId;
    EVIDENCE_STORE.set(id, {
      id,
      term: 'session_comparison',
      originalText: '',
      riskCategory: 'domain_term',
      candidate: '',
      rimeConfig: { model: 'default', voice: 'default', language: 'en', format: 'audio/mpeg' },
      timestamp: submission.timestamp || new Date().toISOString(),
      evaluationMethod: 'human_comparison',
      humanResult:
        submission.preference === 'RAW'
          ? 'raw_preferred'
          : submission.preference === 'CONTROLLED' || submission.preference === 'CANDIDATE_A'
          ? 'controlled_preferred'
          : submission.preference === 'SAME'
          ? 'same'
          : 'not_sure',
      decision: submission.preference === 'RAW' ? 'KEEP_RAW' : 'USE_CONTROLLED',
      verificationStatus: 'observed',
      benchmarkVersion: 'v1.0',
    });
    return true;
  }

  // Update record with listener outcome
  evidence.humanResult =
    submission.preference === 'RAW'
      ? 'raw_preferred'
      : submission.preference === 'CONTROLLED' || submission.preference === 'CANDIDATE_A'
      ? 'controlled_preferred'
      : submission.preference === 'SAME'
      ? 'same'
      : 'not_sure';
  evidence.verificationStatus = 'observed';

  // If verified term exists, update memory store for this specific voice
  if (evidence.term && evidence.term !== 'session_comparison') {
    const memoryKey = `${evidence.term.toLowerCase()}:${evidence.rimeConfig.voice.toLowerCase()}`;
    const existing = VERIFIED_PREFERENCES.get(memoryKey);
    const prefText = submission.preference === 'RAW' ? evidence.originalText : evidence.candidate;

    VERIFIED_PREFERENCES.set(memoryKey, {
      preference: prefText,
      count: (existing?.count || 0) + 1,
      lastUpdated: new Date().toISOString(),
    });
  }

  return true;
}

/**
 * Lookup verified preference for a term under a specific voice/domain configuration
 */
export function getVerifiedPreference(
  term: string,
  context?: { voice?: string; domain?: string }
): string | null {
  const voice = context?.voice?.toLowerCase() || 'default';
  const specificKey = `${term.toLowerCase()}:${voice}`;

  const specificPref = VERIFIED_PREFERENCES.get(specificKey);
  if (specificPref && specificPref.count >= 2) {
    return specificPref.preference;
  }

  return null;
}
