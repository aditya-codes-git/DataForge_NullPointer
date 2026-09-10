import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthProvider';

interface ProtectedRouteProps {
  children?: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-mono text-neutral-400">Loading workspace...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    const callbackUrl = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?callbackUrl=${callbackUrl}`} replace />;
  }

  return <>{children}</>;
}
