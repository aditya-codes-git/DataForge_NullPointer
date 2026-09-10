import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase/client';

export function AuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const next = searchParams.get('next') || '/dashboard';
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function handleAuth() {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        if (data.session && mounted) {
          navigate(next.startsWith('/') ? next : '/dashboard', { replace: true });
          return;
        }

        // Also listen for signed in event
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
          if (session && mounted) {
            navigate(next.startsWith('/') ? next : '/dashboard', { replace: true });
          }
        });

        // Timeout fallback after 3 seconds
        const timer = setTimeout(() => {
          if (mounted) {
            navigate('/dashboard', { replace: true });
          }
        }, 3000);

        return () => {
          clearTimeout(timer);
          subscription.unsubscribe();
        };
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Authentication failed';
        if (mounted) {
          setError(msg);
          setTimeout(() => navigate('/login?error=auth_callback_failed', { replace: true }), 1500);
        }
      }
    }

    handleAuth();

    return () => {
      mounted = false;
    };
  }, [navigate, next]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-neutral-900">
      <div className="text-center space-y-3">
        <div className="w-8 h-8 mx-auto border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-mono uppercase tracking-wider text-neutral-500">
          {error ? `Authentication error: ${error}` : 'Completing sign in to SaySure...'}
        </p>
      </div>
    </div>
  );
}
