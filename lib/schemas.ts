export type RiskCategory =
  // Deterministic / Structural (12)
  | 'identifier'
  | 'currency'
  | 'number'
  | 'date'
  | 'time'
  | 'acronym'
  | 'url'
  | 'email'
  | 'abbreviation'
  | 'unit'
  | 'version'
  | 'symbol'
  // Contextual (6)
  | 'name'
  | 'address'
  | 'domain_term'
  | 'brand'
  | 'ambiguous'
  | 'code_switched';

export type RiskSeverity = 'high' | 'medium' | 'low';

export type DetectionMethod = 'deterministic' | 'contextual';

export type ConfidenceLevel = 'HIGH' | 'MEDIUM' | 'LOW' | 'NEEDS_REVIEW';

export type DecisionStatus =
  | 'USE_CONTROLLED'
  | 'KEEP_RAW'
  | 'SAME_AS_RAW'
  | 'NEEDS_REVIEW'
  | 'ERROR';

export type TokenAction = 'USE_CONTROLLED' | 'KEEP_RAW' | 'NEEDS_REVIEW';

export type RiskDecision =
  | 'NO_INTERVENTION'
  | 'INVESTIGATE'
  | 'GENERATE_CANDIDATE'
  | 'NEEDS_REVIEW'
  | 'KEEP_ORIGINAL'
  | 'PROPOSE_CONTROLLED';

export interface SpeechCandidate {
  candidateText: string;
  text?: string;
  reason: string;
  source: 'deterministic' | 'knowledge_base' | 'contextual_llm';
  confidenceState: 'high' | 'medium' | 'low';
  requiresVerification: boolean;
  rank: number;
}

// Backwards-compatible alias for existing components
export type RiskCandidate = {
  text: string;
  reason: string;
  rank: number;
};

export interface SpeechRisk {
  id: string;
  text: string;
  start: number;
  end: number;
  category: RiskCategory;
  severity: RiskSeverity;
  detectionMethod?: DetectionMethod;
  reason: string;
  contextualHints?: string[];
  interventionRecommended?: boolean;
  investigationRequired?: boolean;
  confidence: ConfidenceLevel;
  ruleMatched?: string;
  decision?: RiskDecision;
  candidates?: SpeechCandidate[];
}

export interface Transformation {
  original: string;
  replacement: string;
  category: RiskCategory;
  reason: string;
  confidence: ConfidenceLevel;
  evidenceStatus: 'tested' | 'untested' | 'verified';
  action: TokenAction;
  rank?: number;
  candidates?: SpeechCandidate[] | RiskCandidate[];
}

export interface CandidateItem {
  type: 'raw' | 'controlled';
  label: string;
  text: string;
}

export interface InvestigationDecision {
  status: DecisionStatus;
  summary: string;
  reason: string;
}

export interface RimeConfigPublic {
  provider: 'Rime';
  model: string;
  voice: string;
  language: string;
  format: string;
  status: 'connected' | 'unconfigured' | 'error';
}

export interface PronunciationEntry {
  term: string;
  canonicalSpokenForm: string;
  alternatives?: string[];
  domain: string;
  language: string;
  locale?: string;
  notes?: string;
  source: 'verified_catalog' | 'user_feedback' | 'contextual_inference';
  verificationStatus: 'known' | 'verified' | 'unverified';
  preferredTtsRepresentations?: string[];
  voicePreferences?: Record<string, string>;
  history?: Array<{
    date: string;
    action: string;
    note: string;
  }>;
}

export interface EvidenceRecord {
  id: string;
  term: string;
  originalText: string;
  riskCategory: RiskCategory;
  candidate: string;
  rimeConfig: {
    model: string;
    voice: string;
    language: string;
    format: string;
  };
  timestamp: string;
  evaluationMethod: 'human_comparison' | 'deterministic_rules' | 'knowledge_match';
  humanResult?: 'raw_preferred' | 'controlled_preferred' | 'same' | 'not_sure';
  decision: DecisionStatus;
  verificationStatus: 'observed' | 'verified' | 'unconfirmed';
  benchmarkVersion: string;
}

export interface VerificationSubmission {
  comparisonId: string;
  preference: 'RAW' | 'CONTROLLED' | 'CANDIDATE_A' | 'CANDIDATE_B' | 'SAME' | 'NOT_SURE';
  notes?: string;
  timestamp?: string;
}

export interface ComparisonResult {
  originalText: string;
  controlledText: string;
  candidates: CandidateItem[];
  rankedCandidates?: SpeechCandidate[];
  risks: SpeechRisk[];
  transformations: Transformation[];
  changes?: Transformation[];
  decision: InvestigationDecision;
  reviewRequired: boolean;
  reviewReasons?: string[];
  safetyWarning?: string | null;
  evidenceId?: string;
  rawAudio?: {
    available: boolean;
    dataUri?: string;
    mimeType: string;
    latencyMs: number;
    error?: string;
  };
  controlledAudio?: {
    available: boolean;
    dataUri?: string;
    mimeType: string;
    latencyMs: number;
    error?: string;
  };
  rime: RimeConfigPublic;
  timing: {
    analysisMs: number;
    rawAudioMs: number;
    controlledAudioMs: number;
    totalMs: number;
  };
}

export interface AnalysisResponse {
  text: string;
  risks: SpeechRisk[];
  investigation: Array<{
    term: string;
    category: RiskCategory;
    decision: RiskDecision;
    reason: string;
    candidates: SpeechCandidate[];
  }>;
  candidates: SpeechCandidate[];
  reviewRequired: boolean;
  safetyWarning?: string | null;
}

export interface APIErrorResponse {
  error: {
    code: string;
    message: string;
  };
}
