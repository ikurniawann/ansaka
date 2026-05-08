import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) loadProfile(session.user.id);
      else setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) loadProfile(session.user.id);
      else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function loadProfile(uid) {
    setLoading(true);
    const { data, error } = await supabase
      .from('users')
      .select('id, organization_id, role, full_name, email, credit_balance, organizations(*)')
      .eq('id', uid)
      .maybeSingle();
    if (error) console.error('[Auth] loadProfile error:', error);
    setProfile(data);
    setLoading(false);
  }

  async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  }

  async function signUp({ email, password, fullName, organizationName, industry, sizeRange }) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });
    if (error) throw error;

    if (data.user) {
      // Create org
      const { data: org, error: orgErr } = await supabase
        .from('organizations')
        .insert({ name: organizationName, industry, size_range: sizeRange })
        .select()
        .single();
      if (orgErr) throw orgErr;

      // Create user profile
      const { error: usrErr } = await supabase.from('users').insert({
        id: data.user.id,
        organization_id: org.id,
        role: 'corporate_admin',
        full_name: fullName,
        email,
      });
      if (usrErr) throw usrErr;
    }
    return data;
  }

  async function signOut() {
    await supabase.auth.signOut();
    setProfile(null);
  }

  const value = {
    session,
    user: session?.user || null,
    profile,
    loading,
    isAuthenticated: !!session?.user,
    isSuperAdmin: profile?.role === 'super_admin',
    isCorporateAdmin: profile?.role === 'corporate_admin',
    signIn,
    signUp,
    signOut,
    reloadProfile: () => session?.user && loadProfile(session.user.id),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
