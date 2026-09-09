import { describe, it, expect } from 'vitest';
import { NextRequest } from 'next/server';
import { POST as analyzeHandler } from '../app/api/analyze/route';
import { POST as compareHandler } from '../app/api/compare/route';
import { POST as verifyHandler } from '../app/api/verify/route';

describe('SaySure Production API Routes', () => {
  it('POST /api/analyze returns structured analysis with investigation and candidates', async () => {
    const req = new NextRequest('http://localhost:3000/api/analyze', {
      method: 'POST',
      body: JSON.stringify({
        text: 'The database uses PostgreSQL v16.',
        domain: 'software',
      }),
    });

    const res = await analyzeHandler(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.text).toBe('The database uses PostgreSQL v16.');
    expect(data.risks.length).toBeGreaterThanOrEqual(1);
    expect(data.investigation.length).toBeGreaterThanOrEqual(1);
    expect(data.candidates.length).toBeGreaterThanOrEqual(1);
    expect(data.candidates[0].candidateText).toContain('Postgres cue ell');
  });

  it('POST /api/analyze returns 400 for empty text payload', async () => {
    const req = new NextRequest('http://localhost:3000/api/analyze', {
      method: 'POST',
      body: JSON.stringify({ text: '   ' }),
    });

    const res = await analyzeHandler(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error.code).toBe('INVALID_INPUT');
  });

  it('POST /api/compare handles comparison and returns evidenceId', async () => {
    const req = new NextRequest('http://localhost:3000/api/compare', {
      method: 'POST',
      body: JSON.stringify({
        text: 'Kubernetes is deployed.',
      }),
    });

    const res = await compareHandler(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.originalText).toBe('Kubernetes is deployed.');
    expect(data.evidenceId).toBeDefined();
    expect(data.evidenceId).toMatch(/^ev-/);
    expect(data.candidates).toHaveLength(2);
    expect(data.decision.status).toBe('KEEP_RAW');
  });

  it('POST /api/verify records listener preference', async () => {
    const req = new NextRequest('http://localhost:3000/api/verify', {
      method: 'POST',
      body: JSON.stringify({
        comparisonId: 'ev-test-12345',
        preference: 'RAW',
        notes: 'Sounded natural in raw',
      }),
    });

    const res = await verifyHandler(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.preference).toBe('RAW');
  });

  it('POST /api/verify rejects invalid preferences', async () => {
    const req = new NextRequest('http://localhost:3000/api/verify', {
      method: 'POST',
      body: JSON.stringify({
        comparisonId: 'ev-test-12345',
        preference: 'INVALID_PREFERENCE',
      }),
    });

    const res = await verifyHandler(req);
    expect(res.status).toBe(400);
  });
});
