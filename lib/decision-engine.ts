import { InvestigationDecision, DecisionStatus, SpeechRisk, Transformation } from './schemas';
import { ValidationResult } from './validators';

export interface DecisionEngineInput {
  originalText: string;
  controlledText: string;
  risks: SpeechRisk[];
  changes: Transformation[];
  validation: ValidationResult;
  safetyWarning?: string | null;
  listenerPreference?: string;
  hasAudioErrors?: boolean;
}

/**
 * Comparison / Decision Engine
 *
 * Implements strict decision hierarchy:
 * 1. Safety & Credential check
 * 2. Semantic & Entity preservation (Validation)
 * 3. Verified pronunciation knowledge & voice preferences
 * 4. Actual TTS rendering evidence
 * 5. Human listener preference
 * 6. Plausibility & minimality of change
 *
 * Strictly rejects fake audio scores (e.g. no "Pronunciation score = 97").
 */
export function evaluateSpeechDecision(input: DecisionEngineInput): InvestigationDecision {
  const { originalText, controlledText, risks, changes, validation, safetyWarning, listenerPreference, hasAudioErrors } = input;

  // 1. Safety Check
  if (safetyWarning) {
    return {
      status: 'NEEDS_REVIEW',
      summary: 'Security review required',
      reason: safetyWarning,
    };
  }

  // 2. Audio Error handling
  if (hasAudioErrors) {
    return {
      status: 'ERROR',
      summary: 'TTS synthesis error',
      reason: 'One or more audio streams could not be synthesized by the TTS provider.',
    };
  }

  // 3. Validation Failures
  if (!validation.isValid || validation.reviewRequired) {
    return {
      status: 'NEEDS_REVIEW',
      summary: 'Human review recommended',
      reason: validation.reasons.length > 0
        ? validation.reasons.join(' ')
        : 'One or more tokens require human verification before synthetic deployment.',
    };
  }

  // 4. Human Listener Preference (if available from previous verification)
  if (listenerPreference) {
    if (listenerPreference === 'RAW') {
      return {
        status: 'KEEP_RAW',
        summary: 'Original retained (Listener verified)',
        reason: 'Human listener evaluation determined original text produced clearer spoken delivery.',
      };
    }
    if (listenerPreference === 'CONTROLLED' || listenerPreference === 'CANDIDATE_A') {
      return {
        status: 'USE_CONTROLLED',
        summary: 'Controlled candidate recommended (Listener verified)',
        reason: 'Human listener evaluation determined controlled representation produced clearer spoken delivery.',
      };
    }
    if (listenerPreference === 'SAME') {
      return {
        status: 'SAME_AS_RAW',
        summary: 'Equally clear in both versions',
        reason: 'Human listener evaluation observed identical or equivalent clarity.',
      };
    }
  }

  // 5. Clean text with no modifications
  if (risks.length === 0 || changes.length === 0 || controlledText.trim() === originalText.trim()) {
    const hasKeepRaw = changes.some((c) => c.action === 'KEEP_RAW');
    if (hasKeepRaw) {
      return {
        status: 'KEEP_RAW',
        summary: 'Original retained — No change recommended',
        reason: 'Original Rime rendering was retained because native synthesis handles the terms naturally without artificial respelling.',
      };
    }
    return {
      status: 'SAME_AS_RAW',
      summary: 'Original speech-ready',
      reason: 'No pronunciation or delivery risks detected; raw text is directly speech-ready.',
    };
  }

  // 6. Token Actions
  const hasNeedsReview = changes.some((c) => c.action === 'NEEDS_REVIEW');
  if (hasNeedsReview) {
    return {
      status: 'NEEDS_REVIEW',
      summary: 'Human review recommended',
      reason: 'Uncertain pronunciation identified for one or more terms. Rime comparison recommended for listener confirmation.',
    };
  }

  const hasUseControlled = changes.some((c) => c.action === 'USE_CONTROLLED');
  if (hasUseControlled) {
    return {
      status: 'USE_CONTROLLED',
      summary: 'Controlled candidate recommended',
      reason: 'Targeted adjustments improve spoken clarity for specific tokens while preserving naturally synthesized entities.',
    };
  }

  return {
    status: 'KEEP_RAW',
    summary: 'Original retained — No change recommended',
    reason: 'The original Rime rendering was retained because no candidate showed a clear advantage.',
  };
}
