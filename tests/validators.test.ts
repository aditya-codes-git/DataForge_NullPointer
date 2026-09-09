import { describe, it, expect } from 'vitest';
import { validateControlledText } from '../lib/validators';
import { generateControlledText } from '../lib/controlled-text';
import { analyzeSpeechRisks } from '../lib/risk-detector';

describe('Validation and Controlled Text Engine', () => {
  it('generates speech-ready controlled text for Case 1 (Identifier + Currency)', async () => {
    const original = 'Your verification code is A12B9X7 and your total is ₹1,25,000.';
    const risks = analyzeSpeechRisks(original);
    const result = await generateControlledText(original, risks);

    expect(result.controlledText).toContain('A one two B nine X seven');
    expect(result.controlledText).toContain('one lakh twenty-five thousand rupees');
    expect(result.changes.length).toBeGreaterThanOrEqual(2);
    expect(result.reviewRequired).toBe(false);
  });

  it('generates speech-ready controlled text for Case 2 (HTTP 429 + Kubernetes - Kubernetes kept raw)', async () => {
    const original = 'HTTP 429 occurred while connecting to Kubernetes.';
    const risks = analyzeSpeechRisks(original);
    const result = await generateControlledText(original, risks);

    // HTTP 429 should be expanded for clarity
    expect(result.controlledText).toContain('HTTP four two nine');
    // Kubernetes must NOT be casually phoneticized; raw rendering is retained
    expect(result.controlledText).toContain('Kubernetes');
    expect(result.controlledText).not.toContain('koo-ber-net-eez');

    const k8sChange = result.changes.find((c) => c.original === 'Kubernetes');
    expect(k8sChange?.action).toBe('KEEP_RAW');
    expect(k8sChange?.replacement).toBe('Kubernetes');

    const httpChange = result.changes.find((c) => c.original === 'HTTP 429');
    expect(httpChange?.action).toBe('USE_CONTROLLED');
    expect(httpChange?.replacement).toBe('HTTP four two nine');

    expect(result.decision.status).toBe('USE_CONTROLLED');
    expect(result.reviewRequired).toBe(false);
  });

  it('specifically tests Kubernetes alone: retains original (KEEP_RAW outcome)', async () => {
    const original = 'Connecting to Kubernetes cluster.';
    const risks = analyzeSpeechRisks(original);
    const result = await generateControlledText(original, risks);

    expect(result.controlledText).toBe(original);
    expect(result.decision.status).toBe('KEEP_RAW');
    expect(result.decision.summary).toContain('Original retained');
    expect(result.changes[0].action).toBe('KEEP_RAW');
  });

  it('leaves clean text untouched and produces zero changes (SAME_AS_RAW)', async () => {
    const original = 'Hello, how are you today?';
    const risks = analyzeSpeechRisks(original);
    const result = await generateControlledText(original, risks);

    expect(result.controlledText).toBe(original);
    expect(result.changes).toHaveLength(0);
    expect(result.decision.status).toBe('SAME_AS_RAW');
    expect(result.reviewRequired).toBe(false);
  });

  it('flags reviewRequired when an ambiguous token like XyloQ is encountered (NEEDS_REVIEW)', async () => {
    const original = 'Product XyloQ is ready.';
    const risks = analyzeSpeechRisks(original);
    const result = await generateControlledText(original, risks);

    expect(result.reviewRequired).toBe(true);
    expect(result.decision.status).toBe('NEEDS_REVIEW');
    expect(result.reviewReasons.some((r) => r.includes('XyloQ') || r.includes('Ambiguous'))).toBe(true);
  });

  it('handles PostgreSQL v16 as a structured phrase without mangling (Case 2 regression)', async () => {
    const original = 'Your PostgreSQL v16 migration completed successfully.';
    const risks = analyzeSpeechRisks(original);
    const result = await generateControlledText(original, risks);

    expect(result.controlledText).toContain('PostgreSQL');
    expect(result.controlledText).toContain('16');
    expect(result.reviewRequired).toBe(true);
    expect(result.decision.status).toBe('NEEDS_REVIEW');
    const pgChange = result.changes.find((c) => c.original.includes('PostgreSQL'));
    expect(pgChange?.action).toBe('NEEDS_REVIEW');
  });

  it('handles Python 3.12 and Node.js 22 as structured technical expressions (Case 7)', async () => {
    const original = 'Python 3.12 is installed on Node.js 22.';
    const risks = analyzeSpeechRisks(original);
    const result = await generateControlledText(original, risks);

    // Python 3.12 retained intact
    expect(result.controlledText).toContain('Python 3.12');
    // Node.js 22 expanded to dot js 22
    expect(result.controlledText).toContain('Node dot js 22');
    expect(result.decision.status).toBe('USE_CONTROLLED');
  });

  it('handles IPv6 support as explicit initialism (Case 8)', async () => {
    const original = 'IPv6 support is enabled.';
    const risks = analyzeSpeechRisks(original);
    const result = await generateControlledText(original, risks);

    expect(result.controlledText).toBe('I P V six support is enabled.');
    expect(result.decision.status).toBe('USE_CONTROLLED');
  });

  it('fails validation if an identifier is corrupted or truncated', () => {
    const original = 'Code A12B9X7';
    const risks = analyzeSpeechRisks(original);
    const badControlled = 'Code corrupted';
    const validation = validateControlledText(original, badControlled, risks, []);

    expect(validation.reviewRequired).toBe(true);
    expect(validation.reasons.some((r) => r.includes('A12B9X7'))).toBe(true);
  });
});
