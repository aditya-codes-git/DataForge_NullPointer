import { describe, it, expect } from 'vitest';

/**
 * Route protection specification for SaySure Single-Page Application
 */
function isProtectedRoute(pathname: string): boolean {
  return pathname.startsWith('/dashboard') || pathname.startsWith('/account');
}

function getLoginRedirectUrl(currentPath: string, search = ''): string {
  const fullPath = search ? `${currentPath}${search}` : currentPath;
  return `/login?callbackUrl=${encodeURIComponent(fullPath)}`;
}

describe('SaySure Auth & Route Protection Specification', () => {
  it('identifies /dashboard and nested routes as protected', () => {
    expect(isProtectedRoute('/dashboard')).toBe(true);
    expect(isProtectedRoute('/dashboard/analyze')).toBe(true);
    expect(isProtectedRoute('/dashboard/history')).toBe(true);
    expect(isProtectedRoute('/dashboard/account')).toBe(true);
    expect(isProtectedRoute('/dashboard/settings')).toBe(true);
  });

  it('identifies public landing and auth routes as unprotected', () => {
    expect(isProtectedRoute('/')).toBe(false);
    expect(isProtectedRoute('/login')).toBe(false);
    expect(isProtectedRoute('/signup')).toBe(false);
    expect(isProtectedRoute('/forgot-password')).toBe(false);
    expect(isProtectedRoute('/reset-password')).toBe(false);
    expect(isProtectedRoute('/auth/callback')).toBe(false);
  });

  it('generates callback URL redirecting unauthenticated users to /login', () => {
    const redirectUrl = getLoginRedirectUrl('/dashboard');
    expect(redirectUrl).toBe('/login?callbackUrl=%2Fdashboard');
  });

  it('preserves query parameters in login redirect callbackUrl', () => {
    const redirectUrl = getLoginRedirectUrl('/dashboard/analyze', '?text=PostgreSQL%20v16');
    expect(redirectUrl).toBe('/login?callbackUrl=%2Fdashboard%2Fanalyze%3Ftext%3DPostgreSQL%2520v16');
  });
});
