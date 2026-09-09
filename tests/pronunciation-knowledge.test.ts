import { describe, it, expect } from 'vitest';
import { lookupPronunciationKnowledge, getAllKnowledgeTerms } from '../lib/pronunciation-knowledge';

describe('Pronunciation Knowledge Layer', () => {
  it('explicitly separates canonical human pronunciation from TTS spoken representation', () => {
    const k8s = lookupPronunciationKnowledge('Kubernetes');
    expect(k8s).toBeDefined();
    // Canonical pronunciation is the human spoken intent
    expect(k8s?.canonicalSpokenForm).toBe('koo-ber-net-eez');
    // But TTS representation is what Rime takes as input
    expect(k8s?.preferredTtsRepresentations).toContain('Kubernetes');
    expect(k8s?.verificationStatus).toBe('verified');
  });

  it('provides TTS candidates for PostgreSQL preserving technical identity', () => {
    const pg = lookupPronunciationKnowledge('PostgreSQL');
    expect(pg).toBeDefined();
    expect(pg?.canonicalSpokenForm).toBe('Post-Gres-Q-L');
    expect(pg?.preferredTtsRepresentations).toContain('Post-Gres-Q-L');
    expect(pg?.preferredTtsRepresentations).toContain('Postgres Q L');
  });

  it('supports multiple common spoken forms for SQL', () => {
    const sql = lookupPronunciationKnowledge('SQL');
    expect(sql).toBeDefined();
    expect(sql?.preferredTtsRepresentations).toContain('sequel');
    expect(sql?.preferredTtsRepresentations).toContain('S Q L');
  });

  it('retrieves entries case-insensitively', () => {
    const grpc = lookupPronunciationKnowledge('grpc');
    expect(grpc).toBeDefined();
    expect(grpc?.preferredTtsRepresentations).toContain('G R P C');
  });

  it('returns null for unknown arbitrary tokens without hallucinating', () => {
    const unknown = lookupPronunciationKnowledge('NonExistentToken999');
    expect(unknown).toBeNull();
  });
});
