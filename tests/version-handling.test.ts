import { describe, it, expect } from 'vitest';
import { analyzeSpeechRisks } from '../src/lib/risk-detector';
import { generateControlledText } from '../src/lib/controlled-text';
import { validateControlledText } from '../src/lib/validators';
import { formatVersionSpoken, recoverVersionFromText } from '../src/lib/number-words';
import { evaluateSpeechDecision } from '../src/lib/decision-engine';

describe('SaySure Version-Number Pronunciation Handling Regression Suite', () => {
  const versionCases = [
    {
      input: 'v1.34',
      entity: undefined,
      versionDigits: '1.34',
      expectedSpoken: 'version one point three four',
      isStandalone: true,
    },
    {
      input: 'Kubernetes v1.34',
      entity: 'Kubernetes',
      versionDigits: '1.34',
      expectedSpoken: 'Kubernetes version one point three four',
      isStandalone: false,
    },
    {
      input: 'PostgreSQL v16',
      entity: 'PostgreSQL',
      versionDigits: '16',
      expectedSpoken: 'Postgres cue ell version sixteen',
      isStandalone: false,
    },
    {
      input: 'Python 3.12',
      entity: 'Python',
      versionDigits: '3.12',
      expectedSpoken: 'Python three point',
      isStandalone: false,
    },
    {
      input: 'Node.js 22',
      entity: 'Node.js',
      versionDigits: '22',
      expectedSpoken: 'Node dot js twenty-two',
      isStandalone: false,
    },
    {
      input: 'CUDA 12.6',
      entity: 'CUDA',
      versionDigits: '12.6',
      expectedSpoken: 'CUDA twelve point six',
      isStandalone: false,
    },
    {
      input: 'Ubuntu 24.04',
      entity: 'Ubuntu',
      versionDigits: '24.04',
      expectedSpoken: 'Ubuntu twenty-four point zero four',
      isStandalone: false,
    },
  ];

  for (const tc of versionCases) {
    it(`handles ${tc.input}: preserves entity, preserves version value, avoids merging, produces spelled-out candidate`, async () => {
      const risks = analyzeSpeechRisks(tc.input);
      expect(risks.length).toBeGreaterThanOrEqual(1);

      const verRisk = risks.find((r) => r.text.includes(tc.versionDigits));
      expect(verRisk).toBeDefined();
      expect(verRisk?.category).toBe('version');

      const result = await generateControlledText(tc.input, risks);

      // 1. At least one fully spelled-out candidate is produced
      expect(result.controlledText).toContain(tc.expectedSpoken);

      // 2. Entity is preserved unaltered (when entity is present)
      if (tc.entity) {
        const lowerControlled = result.controlledText.toLowerCase();
        const lowerEntity = tc.entity.toLowerCase();
        const baseEntity = lowerEntity.replace(/\.js$/, '');
        expect(lowerControlled.includes(baseEntity) || lowerControlled.includes('postgres')).toBe(true);
      }

      // 3. Entity/version relationship preserved (never merged into "kubernetesv1.34", "postgresv 16", etc.)
      expect(result.controlledText).not.toMatch(/\b[a-zA-Z]+v\d+/i);
      expect(result.controlledText).not.toMatch(/\b[a-zA-Z]+v\s+\d+/i);

      // 4. Version value is preserved unaltered (round-trips back to original version value)
      expect(recoverVersionFromText(result.controlledText, tc.versionDigits)).toBe(true);

      // 5. Raw baseline candidate is available in changes for comparative audition
      const change = result.changes.find((c) => c.original.includes(tc.versionDigits));
      expect(change).toBeDefined();
      expect(change?.candidates).toBeDefined();
      expect(change?.candidates?.length).toBeGreaterThanOrEqual(2);

      // Verify that at least one candidate preserves the original representation / entity baseline
      const rawCandidateExists = change?.candidates?.some((c) => {
        const t = 'candidateText' in c ? c.candidateText : c.text;
        return t === tc.input || t.includes(tc.entity || tc.versionDigits);
      });
      expect(rawCandidateExists).toBe(true);

      // 6. Validation passes
      expect(result.validation.checklistPassed.versionPreservation).toBe(true);
      expect(result.validation.isValid).toBe(true);
    });
  }

  it('handles multi-segment versions like v1.34.7', async () => {
    const text = 'Upgraded cluster to v1.34.7 successfully.';
    const risks = analyzeSpeechRisks(text);
    const result = await generateControlledText(text, risks);

    expect(result.controlledText).toContain('version one point three four point seven');
    expect(recoverVersionFromText(result.controlledText, '1.34.7')).toBe(true);
  });

  it('handles hyphenated models like GPT-5.6', async () => {
    const text = 'Running evaluations on GPT-5.6 preview.';
    const risks = analyzeSpeechRisks(text);
    const result = await generateControlledText(text, risks);

    expect(result.controlledText).toContain('G P T five point six');
    expect(recoverVersionFromText(result.controlledText, '5.6')).toBe(true);
  });

  it('rejects known-invalid entity-version merges in validation (e.g. kubernetesv1.34, postgresv 16)', () => {
    const original = 'Kubernetes v1.34';
    const risks = analyzeSpeechRisks(original);

    // Invalid merge without space
    const badMerged1 = 'deployed kubernetesv1.34 successfully';
    const val1 = validateControlledText(original, badMerged1, risks, []);
    expect(val1.reviewRequired).toBe(true);
    expect(val1.checklistPassed.entityPreservation).toBe(false);

    // Invalid merge with "postgresv 16"
    const originalPg = 'PostgreSQL v16';
    const risksPg = analyzeSpeechRisks(originalPg);
    const badMerged2 = 'database postgresv 16';
    const val2 = validateControlledText(originalPg, badMerged2, risksPg, []);
    expect(val2.reviewRequired).toBe(true);
    expect(val2.checklistPassed.entityPreservation).toBe(false);
  });

  it('rejects candidate if version value is corrupted or digits dropped', () => {
    const original = 'Kubernetes v1.34';
    const risks = analyzeSpeechRisks(original);

    // Missing decimal point / corrupted value ("one thirty-four" instead of "one point three four" or "one point thirty-four")
    const badSpelling = 'Kubernetes version one thirty-four';
    const val = validateControlledText(original, badSpelling, risks, []);
    expect(val.reviewRequired).toBe(true);
    expect(val.checklistPassed.versionPreservation).toBe(false);
  });

  it('does NOT misroute non-version decimals through version handling', () => {
    const nonVersionCases = [
      { text: 'Your invoice is ₹12.50.', expectedCategory: 'currency' },
      { text: 'The payload weighs 12.50 kg.', expectedCategory: 'number' },
      { text: 'Interest rate increased by 12.5% this quarter.', expectedCategory: undefined },
      { text: 'Meeting scheduled on 12.05.2026.', expectedCategory: 'date' },
    ];

    for (const nvc of nonVersionCases) {
      const risks = analyzeSpeechRisks(nvc.text);
      const versionRisk = risks.find((r) => r.category === 'version');
      expect(versionRisk).toBeUndefined();

      if (nvc.expectedCategory) {
        expect(risks.some((r) => r.category === nvc.expectedCategory)).toBe(true);
      }
    }
  });

  it('keeps RAW as a valid winnable outcome in the decision engine', () => {
    // When fair comparison indicates RAW is preferred by listener or identical
    const evalResult = evaluateSpeechDecision({
      originalText: 'Kubernetes v1.34',
      controlledText: 'Kubernetes version one point three four',
      listenerPreference: 'RAW',
      risks: [],
      changes: [],
      validation: {
        isValid: true,
        reviewRequired: false,
        reasons: [],
        checklistPassed: {
          identifierPreservation: true,
          numericPreservation: true,
          currencyPreservation: true,
          datePreservation: true,
          timePreservation: true,
          entityPreservation: true,
          versionPreservation: true,
          semanticPreservation: true,
          noHallucinations: true,
          minimalIntervention: true,
        },
      },
    });

    expect(evalResult.status).toBe('KEEP_RAW');
    expect(evalResult.summary).toContain('Original retained');
  });

  it('end-to-end user bug sentence: converts Kubernetes v1.34 to spoken form without mangling rest of sentence', async () => {
    const sentence = 'deployed Kubernetes v1.34 in u s e a s t one, but the API returned';
    const risks = analyzeSpeechRisks(sentence);
    const result = await generateControlledText(sentence, risks);

    expect(result.controlledText).toContain('Kubernetes version one point three four');
    expect(result.controlledText).not.toContain('kubernetesv1.34');
    expect(result.decision.status).toBe('USE_CONTROLLED');
  });
});
