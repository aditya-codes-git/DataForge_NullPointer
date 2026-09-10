import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase/client';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  userName: string | null;
  userEmail: string | null;
  userAvatar: string | null;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  userName: null,
  userEmail: null,
  userAvatar: null,
  signOut: async () => {},
  refreshUser: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    // Fetch initial session from browser client
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (mounted) {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    });

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const refreshUser = async () => {
    try {
      const {
        data: { user: updatedUser },
      } = await supabase.auth.getUser();
      if (updatedUser) {
        setUser(updatedUser);
      }
    } catch (err) {
      console.error('[RefreshUser Error]:', err);
    }
  };

  const signOut = async () => {
    // Immediate optimistic state transition & client navigation
    setUser(null);
    setSession(null);
    navigate('/');
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error('[SignOut Error]:', err);
    }
  };

  const userName = useMemo(() => {
    if (!user) return null;
    return (
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      user.user_metadata?.user_name ||
      user.email?.split('@')[0] ||
      'User'
    );
  }, [user]);

  const userEmail = user?.email ?? null;

  const userAvatar = useMemo(() => {
    if (!user) return null;
    return (
      user.user_metadata?.avatar_url ||
      user.user_metadata?.picture ||
      null
    );
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        userName,
        userEmail,
        userAvatar,
        signOut,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
