/**
 * useAuth hook — handles authentication state
 * Uses localStorage in demo mode, Supabase when configured
 */

import { useState, useEffect, createContext, useContext } from 'react';
import * as storage from '../lib/storage';
import { isSupabaseConfigured } from '../lib/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const currentUser = storage.getCurrentUser();
    setUser(currentUser);
    setLoading(false);

    // Listen for auth changes (in Supabase mode)
    if (isSupabaseConfigured()) {
      // Would set up Supabase auth listener here
    }
  }, []);

  const signUp = async (email, password) => {
    const result = await storage.signUp(email, password);
    if (result.data) {
      setUser(result.data.user);
    }
    return result;
  };

  const signIn = async (email, password) => {
    const result = await storage.signIn(email, password);
    if (result.data) {
      setUser(result.data.user);
    }
    return result;
  };

  const signOut = async () => {
    await storage.signOut();
    setUser(null);
  };

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
