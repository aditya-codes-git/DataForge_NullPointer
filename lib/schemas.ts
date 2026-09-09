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
}

export interface Transformation {
  original: string;
  replacement: string;
  reason: string;
  type: RiskCategory;
  confidence: ConfidenceLevel;
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
  risks: SpeechRisk[];
  changes: Transformation[];
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
