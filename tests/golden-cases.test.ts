import { describe, it, expect } from 'vitest';
import { analyzeSpeechRisks, detectSensitiveCredentials } from '../lib/risk-detector';
import { generateControlledText } from '../lib/controlled-text';
import { lookupPronunciationKnowledge } from '../lib/pronunciation-knowledge';

describe('SaySure Production Golden Test Cases', () => {
  // Case 1: Kubernetes
  it('Golden Case 1: "Kubernetes is deployed successfully." -> detects domain term but keeps original (KEEP_RAW)', async () => {
    const text = 'Kubernetes is deployed successfully.';
    const risks = analyzeSpeechRisks(text);

    expect(risks.length).toBeGreaterThanOrEqual(1);
    const k8sRisk = risks.find((r) => r.text.toLowerCase() === 'kubernetes');
    expect(k8sRisk).toBeDefined();
    expect(k8sRisk?.category).toBe('domain_term');
    expect(k8sRisk?.detectionMethod).toBe('contextual');

    const result = await generateControlledText(text, risks);
    expect(result.controlledText).toBe(text);
    expect(result.controlledText).not.toContain('koo-ber-net-eez');
    expect(result.decision.status).toBe('KEEP_RAW');
    expect(result.reviewRequired).toBe(false);
  });

  // Case 2: PostgreSQL v16
  it('Golden Case 2: "The database uses PostgreSQL v16." -> structured technical expression without mangling', async () => {
    const text = 'The database uses PostgreSQL v16.';
    const risks = analyzeSpeechRisks(text);

    expect(risks.length).toBeGreaterThanOrEqual(1);
    const pgRisk = risks.find((r) => r.text.includes('PostgreSQL'));
    expect(pgRisk).toBeDefined();

    const result = await generateControlledText(text, risks);
    // Entity and version preserved, no corruptions like "postgresv 16"
    expect(result.controlledText).toContain('Postgres cue ell version sixteen');
    expect(result.controlledText).not.toContain('postgresv 16');
    expect(result.changes[0].action).toBe('USE_CONTROLLED');
    expect(result.changes[0].candidates).toBeDefined();
    const candidateTexts = result.changes[0].candidates?.map((c) => ('candidateText' in c ? c.candidateText : c.text));
    expect(candidateTexts).toContain('Postgres cue ell version sixteen');
    expect(candidateTexts).toContain('Postgres Q L version sixteen');
    expect(candidateTexts).toContain('PostgreSQL version sixteen');
  });

  // Case 2b: Standalone PostgreSQL
  it('Golden Case 2b: "PostgreSQL" -> generates natural candidates including Postgres cue ell, Postgres Q L, and PostgreSQL', async () => {
    const text = 'PostgreSQL';
    const risks = analyzeSpeechRisks(text);

    expect(risks.length).toBe(1);
    expect(risks[0].text).toBe('PostgreSQL');

    const result = await generateControlledText(text, risks);
    expect(result.changes[0].candidates).toBeDefined();
    const candidateTexts = result.changes[0].candidates?.map((c) => ('candidateText' in c ? c.candidateText : c.text));
    expect(candidateTexts).toContain('Postgres cue ell');
    expect(candidateTexts).toContain('Postgres Q L');
    expect(candidateTexts).toContain('PostgreSQL');
  });

  // Case 2c: Sentence-level context test
  it('Golden Case 2c: "The deployment is running on PostgreSQL v16 with gRPC over HTTP/2." -> handles structured entities in sentence context without mangling', async () => {
    const text = 'The deployment is running on PostgreSQL v16 with gRPC over HTTP/2.';
    const risks = analyzeSpeechRisks(text);

    // Should detect PostgreSQL v16, gRPC, and HTTP/2
    expect(risks.length).toBeGreaterThanOrEqual(3);
    expect(risks.some((r) => r.text.includes('PostgreSQL'))).toBe(true);
    expect(risks.some((r) => r.text.toLowerCase() === 'grpc')).toBe(true);
    expect(risks.some((r) => r.text.includes('HTTP/2'))).toBe(true);

    const result = await generateControlledText(text, risks);

    // Entity & version relationships preserved; no malformed concatenations
    expect(result.controlledText).not.toContain('postgresv 16');
    expect(result.controlledText).not.toContain('postgresv');
    expect(result.controlledText).toContain('Postgres cue ell version sixteen');

    // Validation passes: entity, version, and numbers are preserved
    expect(result.validation.checklistPassed.versionPreservation).toBe(true);
    expect(result.validation.checklistPassed.numericPreservation).toBe(true);
    expect(result.validation.checklistPassed.entityPreservation).toBe(true);
    expect(result.validation.isValid).toBe(true);
  });

  // Case 3: SQL
  it('Golden Case 3: "The query is written in SQL." -> provides ranked candidates ("sequel" & "S Q L")', async () => {
    const text = 'The query is written in SQL.';
    const risks = analyzeSpeechRisks(text);

    expect(risks.some((r) => r.text === 'SQL')).toBe(true);

    const result = await generateControlledText(text, risks);
    const sqlChange = result.changes.find((c) => c.original === 'SQL');

    expect(sqlChange).toBeDefined();
    expect(sqlChange?.candidates).toBeDefined();
    expect(sqlChange?.candidates?.length).toBeGreaterThanOrEqual(2);

    const texts = sqlChange?.candidates?.map((c) => ('candidateText' in c ? c.candidateText : c.text));
    expect(texts).toContain('sequel');
    expect(texts).toContain('S Q L');
  });

  // Case 4: Identifier A12B9X7
  it('Golden Case 4: "Your verification code is A12B9X7." -> preserves every character explicitly', async () => {
    const text = 'Your verification code is A12B9X7.';
    const risks = analyzeSpeechRisks(text);

    const idRisk = risks.find((r) => r.category === 'identifier');
    expect(idRisk).toBeDefined();
    expect(idRisk?.detectionMethod).toBe('deterministic');

    const result = await generateControlledText(text, risks);
    expect(result.controlledText).toContain('A one two B nine X seven');
    expect(result.validation.checklistPassed.identifierPreservation).toBe(true);
  });

  // Case 5: Currency ₹1,25,000
  it('Golden Case 5: "Your total is ₹1,25,000." -> preserves exact monetary value in Indian numbering', async () => {
    const text = 'Your total is ₹1,25,000.';
    const risks = analyzeSpeechRisks(text);

    const curRisk = risks.find((r) => r.category === 'currency');
    expect(curRisk).toBeDefined();

    const result = await generateControlledText(text, risks);
    expect(result.controlledText).toContain('one lakh twenty-five thousand rupees');
    expect(result.validation.checklistPassed.currencyPreservation).toBe(true);
  });

  // Case 6: Clean speech-ready text
  it('Golden Case 6: "Hello, how are you today?" -> no unnecessary intervention (SAME_AS_RAW)', async () => {
    const text = 'Hello, how are you today?';
    const risks = analyzeSpeechRisks(text);

    expect(risks.length).toBe(0);
    const result = await generateControlledText(text, risks);
    expect(result.controlledText).toBe(text);
    expect(result.decision.status).toBe('SAME_AS_RAW');
    expect(result.changes).toHaveLength(0);
  });

  // Case 7: Ambiguous token XyloQ
  it('Golden Case 7: "The customer requested a refund for XyloQ." -> flags NEEDS_REVIEW without inventing pronunciation', async () => {
    const text = 'The customer requested a refund for XyloQ.';
    const risks = analyzeSpeechRisks(text);

    const ambRisk = risks.find((r) => r.text === 'XyloQ');
    expect(ambRisk).toBeDefined();
    expect(ambRisk?.category).toBe('ambiguous');

    const result = await generateControlledText(text, risks);
    expect(result.reviewRequired).toBe(true);
    expect(result.decision.status).toBe('NEEDS_REVIEW');
    // Does not invent bizarre pronunciation; preserves token for review
    expect(result.controlledText).toContain('XyloQ');
  });

  // Security Case: Sensitive Credential Detection
  it('Security Case: detects secret-like credentials and warns user', () => {
    const secretInput = 'Using secret token ghp_1234567890abcdefghijklmnopqrstuvwx to connect.';
    const warning = detectSensitiveCredentials(secretInput);

    expect(warning).not.toBeNull();
    expect(warning).toContain('Sensitive-looking credential detected');
  });
});
