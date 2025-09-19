import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import * as SecureStore from 'expo-secure-store';

type User = { id: string; name: string; email: string } | null;
type AuthState = { user: User; accessToken: string | null; loading: boolean; };

type AuthContextType = {
  state: AuthState;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>({} as any);

const TOKEN_KEY = 'auth/token';
const USER_KEY = 'auth/user';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({ user: null, accessToken: null, loading: true });

  useEffect(() => {
    let alive = true;
  (async () => {
    try {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      const userJson = await SecureStore.getItemAsync(USER_KEY);
      if (!alive) return;
      setState({
        user: userJson ? JSON.parse(userJson) : null,
        accessToken: token,
        loading: false,
      });
    } catch {
      if (alive) setState({ user: null, accessToken: null, loading: false });
    }
  })();
  return () => { alive = false; };
}, []);

  const signIn = useCallback(async (email: string, password: string) => {
    // Preparando a estrutura para quando o matheus terminar java, devo criar const res = await api.post('/auth/login', { email, password });
    // const { accessToken, user } = res.data;
    const accessToken = 'mock-token';
    const user = { id: '1', name: 'Usuário', email };

    await SecureStore.setItemAsync(TOKEN_KEY, accessToken);
    await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
    setState({ user, accessToken, loading: false });
  }, []);

  const signUp = useCallback(async (name: string, email: string, password: string) => {
    // Colocar depois await api.post('/auth/signup', { name, email, password });
    // Em seguida, opcionalmente logar automaticamente:
    await signIn(email, password);
  }, [signIn]);

  const signOut = useCallback(async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await SecureStore.deleteItemAsync(USER_KEY);
    setState({ user: null, accessToken: null, loading: false });
  }, []);

  const value = useMemo(() => ({ state, signIn, signUp, signOut }), [state, signIn, signUp, signOut]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
