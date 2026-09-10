import { describe, it, expect } from 'vitest';
import { lookupPronunciationKnowledge, getAllKnowledgeTerms } from '../src/lib/pronunciation-knowledge';

describe('Pronunciation Knowledge Layer — Three-Way Representation Model', () => {
  it('explicitly separates canonical human pronunciation from TTS spoken representation for Kubernetes', () => {
    const k8s = lookupPronunciationKnowledge('Kubernetes');
    expect(k8s).toBeDefined();
    // 1. Original written form: Kubernetes
    expect(k8s?.term).toBe('Kubernetes');
    // 2. Canonical pronunciation: human spoken intent
    expect(k8s?.canonicalSpokenForm).toBe('koo-ber-net-eez');
    // 3. TTS representation: actual text tested with Rime
    expect(k8s?.ttsRepresentations).toContain('Kubernetes');
    expect(k8s?.verificationStatus).toBe('verified');
  });

  it('provides natural-language candidate seeds for PostgreSQL without forcing hyphen chains', () => {
    const pg = lookupPronunciationKnowledge('PostgreSQL');
    expect(pg).toBeDefined();
    // Human canonical pronunciation
    expect(pg?.canonicalSpokenForm).toBe('Postgres cue ell');
    // Natural candidate representations
    expect(pg?.ttsRepresentations).toContain('Postgres cue ell');
    expect(pg?.ttsRepresentations).toContain('Postgres Q L');
    expect(pg?.ttsRepresentations).toContain('PostgreSQL');
  });

  it('supports structured phrase with version for PostgreSQL v16', () => {
    const pg16 = lookupPronunciationKnowledge('PostgreSQL v16');
    expect(pg16).toBeDefined();
    expect(pg16?.canonicalSpokenForm).toBe('Postgres cue ell version sixteen');
    expect(pg16?.ttsRepresentations).toContain('Postgres cue ell version sixteen');
    expect(pg16?.ttsRepresentations).toContain('Postgres Q L version sixteen');
    expect(pg16?.ttsRepresentations).toContain('PostgreSQL version sixteen');
  });

  it('supports multiple common spoken forms for SQL', () => {
    const sql = lookupPronunciationKnowledge('SQL');
    expect(sql).toBeDefined();
    expect(sql?.canonicalSpokenForm).toBe('sequel');
    expect(sql?.ttsRepresentations).toContain('sequel');
    expect(sql?.ttsRepresentations).toContain('S Q L');
    expect(sql?.ttsRepresentations).toContain('SQL');
  });

  it('provides generalized domain entries for CUDA 12.6, Ubuntu 24.04, NumPy, OAuth, JWT', () => {
    const cuda = lookupPronunciationKnowledge('CUDA 12.6');
    expect(cuda).toBeDefined();
    expect(cuda?.ttsRepresentations).toContain('CUDA twelve point six');

    const ubuntu = lookupPronunciationKnowledge('Ubuntu 24.04');
    expect(ubuntu).toBeDefined();
    expect(ubuntu?.ttsRepresentations).toContain('Ubuntu twenty-four point zero four');

    const numpy = lookupPronunciationKnowledge('NumPy');
    expect(numpy).toBeDefined();
    expect(numpy?.ttsRepresentations).toContain('Num-pie');

    const oauth = lookupPronunciationKnowledge('OAuth');
    expect(oauth).toBeDefined();
    expect(oauth?.ttsRepresentations).toContain('O-auth');

    const jwt = lookupPronunciationKnowledge('JWT');
    expect(jwt).toBeDefined();
    expect(jwt?.ttsRepresentations).toContain('jot');
  });

  it('returns null for unknown arbitrary tokens without hallucinating', () => {
    const unknown = lookupPronunciationKnowledge('NonExistentToken999');
    expect(unknown).toBeNull();
  });
});
