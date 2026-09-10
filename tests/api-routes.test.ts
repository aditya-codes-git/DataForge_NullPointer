import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { app } from '../server/index';
import type { Server } from 'http';

describe('SaySure Express Production API Routes', () => {
  let server: Server;
  let baseUrl: string;

  beforeAll(async () => {
    await new Promise<void>((resolve) => {
      server = app.listen(0, () => {
        const address = server.address();
        if (typeof address === 'object' && address !== null) {
          baseUrl = `http://localhost:${address.port}`;
        }
        resolve();
      });
    });
  });

  afterAll(async () => {
    await new Promise<void>((resolve) => {
      server.close(() => resolve());
    });
  });

  it('GET /api/config returns Rime and Groq status', async () => {
    const res = await fetch(`${baseUrl}/api/config`);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.rime).toBeDefined();
    expect(data.groq).toBeDefined();
    expect(data.groq.provider).toBe('Groq');
  });

  it('POST /api/analyze returns structured analysis with investigation and candidates', async () => {
    const res = await fetch(`${baseUrl}/api/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: 'The database uses PostgreSQL v16.',
        domain: 'software',
      }),
    });

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.text).toBe('The database uses PostgreSQL v16.');
    expect(data.risks.length).toBeGreaterThanOrEqual(1);
    expect(data.investigation.length).toBeGreaterThanOrEqual(1);
    expect(data.candidates.length).toBeGreaterThanOrEqual(1);
    expect(data.candidates[0].candidateText).toContain('Postgres cue ell');
  });

  it('POST /api/analyze returns 400 for empty text payload', async () => {
    const res = await fetch(`${baseUrl}/api/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: '   ' }),
    });

    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error.code).toBe('INVALID_INPUT');
  });

  it('POST /api/compare handles comparison and returns evidenceId', async () => {
    const res = await fetch(`${baseUrl}/api/compare`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: 'Kubernetes is deployed.',
      }),
    });

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.originalText).toBe('Kubernetes is deployed.');
    expect(data.evidenceId).toBeDefined();
    expect(data.evidenceId).toMatch(/^ev-/);
    expect(data.candidates).toHaveLength(2);
    expect(data.decision.status).toBe('KEEP_RAW');
  }, 20000);

  it('POST /api/verify records listener preference', async () => {
    const res = await fetch(`${baseUrl}/api/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        comparisonId: 'ev-test-12345',
        preference: 'RAW',
        notes: 'Sounded natural in raw',
      }),
    });

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.preference).toBe('RAW');
  });

  it('POST /api/verify rejects invalid preferences', async () => {
    const res = await fetch(`${baseUrl}/api/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        comparisonId: 'ev-test-12345',
        preference: 'INVALID_PREFERENCE',
      }),
    });

    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error.code).toBe('INVALID_PREFERENCE');
  });
});
