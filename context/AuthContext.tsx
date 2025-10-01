import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut as firebaseSignOut, updateProfile, User } from 'firebase/auth';
import { doc, getFirestore, setDoc, getDoc } from 'firebase/firestore';
import { app } from '../services/firebaseConfig';

type UserType = { id: string; name: string | null; email: string | null };
type AuthState = { user: UserType | null; accessToken: string | null; loading: boolean };

type AuthContextType = {
  state: AuthState;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>({} as any);

const TOKEN_KEY = 'auth/token';
const USER_KEY = 'auth/user';

const auth = getAuth(app);
const db = getFirestore(app);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({ user: null, accessToken: null, loading: true });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: User | null) => {
      if (firebaseUser) {
        const accessToken = await firebaseUser.getIdToken();
        let userData: UserType = {
          id: firebaseUser.uid,
          name: firebaseUser.displayName,
          email: firebaseUser.email
        };

        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            userData = {
              id: data.id,
              name: data.name ?? null,
              email: data.email ?? null
            };
          }
        } catch (error) {
          console.log('Erro ao buscar dados do Firestore:', error);
        }

        setState({ user: userData, accessToken, loading: false });
        await SecureStore.setItemAsync(TOKEN_KEY, accessToken);
        await SecureStore.setItemAsync(USER_KEY, JSON.stringify(userData));
      } else {
        setState({ user: null, accessToken: null, loading: false });
        await SecureStore.deleteItemAsync(TOKEN_KEY);
        await SecureStore.deleteItemAsync(USER_KEY);
      }
    });
    return unsubscribe;
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      const accessToken = await firebaseUser.getIdToken();

      let userData: UserType = {
        id: firebaseUser.uid,
        name: firebaseUser.displayName,
        email: firebaseUser.email
      };

      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        userData = {
          id: data.id,
          name: data.name ?? null,
          email: data.email ?? null
        };
      }

      setState({ user: userData, accessToken, loading: false });
      await SecureStore.setItemAsync(TOKEN_KEY, accessToken);
      await SecureStore.setItemAsync(USER_KEY, JSON.stringify(userData));
    } catch (error) {
      throw error;
    }
  }, []);

  const signUp = useCallback(async (name: string, email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      await updateProfile(firebaseUser, { displayName: name });

      await setDoc(doc(db, 'users', firebaseUser.uid), { id: firebaseUser.uid, name, email });

      await signIn(email, password);
    } catch (error) {
      throw error;
    }
  }, [signIn]);

  const signOut = useCallback(async () => {
    await firebaseSignOut(auth);
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await SecureStore.deleteItemAsync(USER_KEY);
    setState({ user: null, accessToken: null, loading: false });
  }, []);

  const value = useMemo(() => ({ state, signIn, signUp, signOut }), [state, signIn, signUp, signOut]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
