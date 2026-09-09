import { describe, it, expect } from 'vitest';
import { generateCandidatesForRisks } from '../lib/candidate-generator';
import { analyzeSpeechRisks } from '../lib/risk-detector';

describe('Candidate Generator Engine', () => {
  it('generates between 1 and 3 natural-language candidates for PostgreSQL with metadata', () => {
    const text = 'PostgreSQL';
    const risks = analyzeSpeechRisks(text);
    expect(risks.length).toBe(1);

    const result = generateCandidatesForRisks(text, risks);
    const candidates = result.itemCandidates.get('PostgreSQL');

    expect(candidates).toBeDefined();
    expect(candidates!.length).toBeGreaterThanOrEqual(1);
    expect(candidates!.length).toBeLessThanOrEqual(3);

    // Each candidate has required metadata
    candidates!.forEach((c) => {
      expect(c.candidateText).toBeDefined();
      expect(c.reason).toBeDefined();
      expect(c.source).toBeDefined();
      expect(c.confidenceState).toBeDefined();
      expect(typeof c.requiresVerification).toBe('boolean');
      expect(c.rank).toBeGreaterThanOrEqual(1);
    });

    const texts = candidates!.map((c) => c.candidateText);
    expect(texts).toContain('Postgres cue ell');
    expect(texts).toContain('Postgres Q L');
    // Raw is kept as candidate hypothesis
    expect(texts).toContain('PostgreSQL');

    // No arbitrary hyphenation chains or forced letter-by-letter
    texts.forEach((t) => {
      expect(t).not.toContain('P O S T G R E S Q L');
      expect(t).not.toContain('Post-Gres-Q-L');
    });
  });

  it('generates natural-language candidates for PostgreSQL v16 preserving structured entity', () => {
    const text = 'PostgreSQL v16';
    const risks = analyzeSpeechRisks(text);
    expect(risks.length).toBe(1);

    const result = generateCandidatesForRisks(text, risks);
    const candidates = result.itemCandidates.get('PostgreSQL v16');

    expect(candidates).toBeDefined();
    const texts = candidates!.map((c) => c.candidateText);

    expect(texts).toContain('Postgres cue ell version sixteen');
    expect(texts).toContain('Postgres Q L version sixteen');
    expect(texts).toContain('PostgreSQL version sixteen');

    // Strictly no malformed concatenations
    texts.forEach((t) => {
      expect(t).not.toContain('postgresv 16');
      expect(t).not.toContain('postgresv');
    });
  });

  it('handles multiple domain terms in sentence context', () => {
    const text = 'The deployment is running on PostgreSQL v16 with gRPC over HTTP/2.';
    const risks = analyzeSpeechRisks(text);
    const result = generateCandidatesForRisks(text, risks);

    // Should have candidates for each identified entity
    expect(result.changes.length).toBeGreaterThanOrEqual(2);
    expect(result.primaryControlledText).toContain('Postgres cue ell version sixteen');
    expect(result.primaryControlledText).not.toContain('postgresv 16');
  });

  it('generates natural candidate for gRPC without forced single-letter spacing', () => {
    const text = 'gRPC';
    const risks = analyzeSpeechRisks(text);
    const result = generateCandidatesForRisks(text, risks);
    const candidates = result.itemCandidates.get('gRPC');

    expect(candidates).toBeDefined();
    const texts = candidates!.map((c) => c.candidateText);
    expect(texts).toContain('gee are pee see');
  });

  it('generates natural candidate for GraphQL', () => {
    const text = 'GraphQL';
    const risks = analyzeSpeechRisks(text);
    const result = generateCandidatesForRisks(text, risks);
    const candidates = result.itemCandidates.get('GraphQL');

    expect(candidates).toBeDefined();
    const texts = candidates!.map((c) => c.candidateText);
    expect(texts).toContain('Graph cue ell');
  });
});
