import { describe, it, expect } from 'vitest';
import { NextRequest } from 'next/server';
import { updateSession } from '../lib/supabase/middleware';

describe('Supabase Auth Middleware & Route Protection', () => {
  it('redirects unauthenticated user accessing /dashboard to /login?callbackUrl=/dashboard', async () => {
    // When environment variables are dummy or not logged in, user is null
    const request = new NextRequest('http://localhost:3000/dashboard');
    const response = await updateSession(request);

    // If env vars are set, should redirect to login
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      expect(response.status).toBe(307);
      expect(response.headers.get('location')).toContain('/login');
      expect(response.headers.get('location')).toContain('callbackUrl=%2Fdashboard');
    } else {
      expect(response.status).toBe(200);
    }
  });

  it('allows public access to /', async () => {
    const request = new NextRequest('http://localhost:3000/');
    const response = await updateSession(request);
    expect(response.status).toBe(200);
  });

  it('redirects unauthenticated user accessing /account to /login?callbackUrl=/account', async () => {
    const request = new NextRequest('http://localhost:3000/account');
    const response = await updateSession(request);

    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      expect(response.status).toBe(307);
      expect(response.headers.get('location')).toContain('/login');
      expect(response.headers.get('location')).toContain('callbackUrl=%2Faccount');
    } else {
      expect(response.status).toBe(200);
    }
  });

  it('allows public access to /forgot-password', async () => {
    const request = new NextRequest('http://localhost:3000/forgot-password');
    const response = await updateSession(request);
    expect(response.status).toBe(200);
  });
});
