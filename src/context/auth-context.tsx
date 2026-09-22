import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { getCurrentUserRequest, loginRequest, ApiError, type AuthUser } from '@/lib/api';
import { clearSession, getStoredSession, saveSession } from '@/lib/token-storage';

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

export type Session = {
  accessToken: string;
  refreshToken: string;
};

type AuthContextValue = {
  status: AuthStatus;
  user: AuthUser | null;
  session: Session | null;
  isAuthenticated: boolean;
  signIn: (username: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>('loading');
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function rehydrate() {
      try {
        const stored = await getStoredSession();
        if (!stored) {
          if (!cancelled) setStatus('unauthenticated');
          return;
        }

        const me = await getCurrentUserRequest(stored.accessToken);
        if (cancelled) return;

        setSession(stored);
        setUser(me);
        setStatus('authenticated');
      } catch (error) {
        if (cancelled) return;

        if (error instanceof ApiError && error.status === 401) {
          await clearSession();
        }

        setSession(null);
        setUser(null);
        setStatus('unauthenticated');
      }
    }

    rehydrate();

    return () => {
      cancelled = true;
    };
  }, []);

  const signIn = useCallback(async (username: string, password: string) => {
    const result = await loginRequest(username, password);
    const nextSession = {
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    };

    await saveSession(nextSession);

    setSession(nextSession);
    setUser({
      id: result.id,
      username: result.username,
      email: result.email,
      firstName: result.firstName,
      lastName: result.lastName,
      gender: result.gender,
      image: result.image,
    });
    setStatus('authenticated');
  }, []);

  const signOut = useCallback(async () => {
    await clearSession();
    setSession(null);
    setUser(null);
    setStatus('unauthenticated');
  }, []);

  const value = useMemo(
    () => ({
      status,
      user,
      session,
      isAuthenticated: status === 'authenticated',
      signIn,
      signOut,
    }),
    [status, user, session, signIn, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}