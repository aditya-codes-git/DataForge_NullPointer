import { describe, it, expect } from 'vitest';
import { evaluateSpeechDecision } from '../src/lib/decision-engine';
import { recordEvidence, recordHumanVerification, getEvidenceById, getVerifiedPreference } from '../src/lib/evidence-memory';
import { validateControlledText } from '../src/lib/validators';

describe('Decision Engine and Evidence Memory', () => {
  it('prioritizes safety warnings above all else in decision hierarchy', () => {
    const val = validateControlledText('Test', 'Test', [], []);
    const decision = evaluateSpeechDecision({
      originalText: 'Test ghp_1234567890abcdefghijklmnopqrstuvwxyz',
      controlledText: 'Test',
      risks: [],
      changes: [],
      validation: val,
      safetyWarning: 'Sensitive-looking credential detected. Avoid sending real secrets to speech synthesis.',
    });

    expect(decision.status).toBe('NEEDS_REVIEW');
    expect(decision.summary).toBe('Security review required');
    expect(decision.reason).toContain('Sensitive-looking credential detected');
  });

  it('honors human listener preference when recorded', () => {
    const val = validateControlledText('Kubernetes', 'Kubernetes', [], []);
    const decision = evaluateSpeechDecision({
      originalText: 'Kubernetes',
      controlledText: 'Kubernetes',
      risks: [],
      changes: [{ original: 'Kubernetes', replacement: 'Kubernetes', category: 'domain_term', reason: 'Test', confidence: 'HIGH', evidenceStatus: 'tested', action: 'KEEP_RAW' }],
      validation: val,
      listenerPreference: 'RAW',
    });

    expect(decision.status).toBe('KEEP_RAW');
    expect(decision.summary).toContain('Listener verified');
  });

  it('records comparison provenance with unique evidence ID', () => {
    const record = recordEvidence({
      term: 'PostgreSQL',
      originalText: 'PostgreSQL database',
      riskCategory: 'domain_term',
      candidate: 'Post-Gres-Q-L database',
      rimeConfig: { model: 'mistv3', voice: 'astra', language: 'en', format: 'audio/mpeg' },
      evaluationMethod: 'deterministic_rules',
      decision: 'USE_CONTROLLED',
      verificationStatus: 'verified',
      benchmarkVersion: 'v1.0',
    });

    expect(record.id).toMatch(/^ev-\d+/);
    const retrieved = getEvidenceById(record.id);
    expect(retrieved).not.toBeNull();
    expect(retrieved?.candidate).toBe('Post-Gres-Q-L database');
  });

  it('records human listener verification and updates memory store', () => {
    const record = recordEvidence({
      term: 'SQL',
      originalText: 'SQL query',
      riskCategory: 'acronym',
      candidate: 'S Q L query',
      rimeConfig: { model: 'mistv3', voice: 'astra', language: 'en', format: 'audio/mpeg' },
      evaluationMethod: 'human_comparison',
      decision: 'USE_CONTROLLED',
      verificationStatus: 'observed',
      benchmarkVersion: 'v1.0',
    });

    recordHumanVerification({
      comparisonId: record.id,
      preference: 'CONTROLLED',
    });

    const updated = getEvidenceById(record.id);
    expect(updated?.humanResult).toBe('controlled_preferred');
  });

  it('allows RAW to win without forcing a controlled candidate', () => {
    const val = validateControlledText('Kubernetes', 'Kubernetes', [], []);
    const decision = evaluateSpeechDecision({
      originalText: 'Kubernetes cluster',
      controlledText: 'Kubernetes cluster',
      risks: [],
      changes: [{
        original: 'Kubernetes',
        replacement: 'Kubernetes',
        category: 'domain_term',
        reason: 'Native Rime speech delivers Kubernetes clearly',
        confidence: 'HIGH',
        evidenceStatus: 'tested',
        action: 'KEEP_RAW',
      }],
      validation: val,
    });

    expect(decision.status).toBe('KEEP_RAW');
    expect(decision.summary).toContain('Original retained');
  });

  it('enforces voice-specific evidence isolation across voices', () => {
    // Record verified preference for voice "astra"
    recordEvidence({
      term: 'PostgreSQL',
      originalText: 'PostgreSQL',
      riskCategory: 'domain_term',
      benchmarkVersion: 'v1.0',
      candidate: 'Postgres cue ell',
      candidateRepresentation: 'Postgres cue ell',
      rimeConfig: { model: 'mistv3', voice: 'astra', language: 'en', format: 'audio/mpeg' },
      evaluationMethod: 'human_comparison',
      decision: 'USE_CONTROLLED',
      verificationStatus: 'verified',
    });

    // Check preference for astra
    const astraPref = getVerifiedPreference('PostgreSQL', 'astra');
    expect(astraPref).toBe('Postgres cue ell');

    // Different voice "marina" must NOT inherit astra's preference without evidence
    const marinaPref = getVerifiedPreference('PostgreSQL', 'marina');
    expect(marinaPref).toBeNull();
  });
});

