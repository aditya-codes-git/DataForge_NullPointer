export type RiskCategory =
  | 'identifier'
  | 'currency'
  | 'number'
  | 'acronym'
  | 'domain_term'
  | 'name'
  | 'date'
  | 'time'
  | 'url'
  | 'email'
  | 'address'
  | 'abbreviation'
  | 'ambiguous';

export type RiskSeverity = 'high' | 'medium' | 'low';

export type ConfidenceLevel = 'HIGH' | 'MEDIUM' | 'LOW' | 'NEEDS_REVIEW';

export type DecisionStatus =
  | 'USE_CONTROLLED'
  | 'KEEP_RAW'
  | 'SAME_AS_RAW'
  | 'NEEDS_REVIEW'
  | 'ERROR';

export type TokenAction = 'USE_CONTROLLED' | 'KEEP_RAW' | 'NEEDS_REVIEW';

export interface RiskCandidate {
  text: string;
  reason: string;
  rank: number;
}

export interface SpeechRisk {
  id: string;
  text: string;
  category: RiskCategory;
  severity: RiskSeverity;
  reason: string;
  start: number;
  end: number;
  confidence: ConfidenceLevel;
  ruleMatched?: string;
  decision?: 'KEEP_ORIGINAL' | 'PROPOSE_CONTROLLED' | 'NEEDS_REVIEW';
  candidates?: RiskCandidate[];
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
  candidates?: RiskCandidate[];
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

export interface ComparisonResult {
  originalText: string;
  controlledText: string;
  candidates: CandidateItem[];
  risks: SpeechRisk[];
  transformations: Transformation[];
  changes?: Transformation[];
  decision: InvestigationDecision;
  reviewRequired: boolean;
  reviewReasons?: string[];
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

export interface APIErrorResponse {
  error: {
    code: string;
    message: string;
  };
}
