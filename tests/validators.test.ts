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

  it('generates speech-ready controlled text for Case 2 (HTTP 429 + Kubernetes)', async () => {
    const original = 'HTTP 429 occurred while connecting to Kubernetes.';
    const risks = analyzeSpeechRisks(original);
    const result = await generateControlledText(original, risks);

    expect(result.controlledText).toContain('HTTP four two nine');
    expect(result.controlledText).toContain('koo-ber-net-eez');
    expect(result.reviewRequired).toBe(false);
  });

  it('leaves clean text untouched and produces zero changes', async () => {
    const original = 'Hello, how are you today?';
    const risks = analyzeSpeechRisks(original);
    const result = await generateControlledText(original, risks);

    expect(result.controlledText).toBe(original);
    expect(result.changes).toHaveLength(0);
    expect(result.reviewRequired).toBe(false);
  });

  it('flags reviewRequired when an ambiguous token like XyloQ is encountered', async () => {
    const original = 'Product XyloQ is ready.';
    const risks = analyzeSpeechRisks(original);
    const result = await generateControlledText(original, risks);

    expect(result.reviewRequired).toBe(true);
    expect(result.reviewReasons.some(r => r.includes('XyloQ') || r.includes('Ambiguous'))).toBe(true);
  });

  it('fails validation if an identifier is corrupted or truncated', () => {
    const original = 'Code A12B9X7';
    const risks = analyzeSpeechRisks(original);
    const badControlled = 'Code corrupted';
    const validation = validateControlledText(original, badControlled, risks, []);

    expect(validation.reviewRequired).toBe(true);
    expect(validation.reasons.some(r => r.includes('A12B9X7'))).toBe(true);
  });
});
