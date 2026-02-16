import React, { createContext, useState, useContext, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { supabase } from '../services/supabase';

interface AuthContextType {
  user: any;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleSession = async (session: any) => {
      if (session) {
        setToken(session.access_token);
        setUser(session.user);
        // Mirror to SecureStore for background task
        await SecureStore.setItemAsync('rider_token', session.access_token);
        await SecureStore.setItemAsync('rider_user', JSON.stringify(session.user));
      } else {
        setToken(null);
        setUser(null);
        // Clear SecureStore
        await SecureStore.deleteItemAsync('rider_token');
        await SecureStore.deleteItemAsync('rider_user');
      }
    };

    // Check active session
    // Check active session safely
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        // If user is valid, get the session which contains the token
        supabase.auth.getSession().then(({ data: { session } }) => {
            handleSession(session);
            setLoading(false);
        });
      } else {
        setLoading(false);
      }
    }).catch(() => setLoading(false));

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      handleSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
