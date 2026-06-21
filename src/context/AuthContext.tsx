'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter, usePathname } from 'next/navigation';

export interface Profile {
  id: string;
  full_name: string;
  phone: string | null;
  date_of_birth: string | null;
  gender: string | null;
  state: string | null;
  city: string | null;
  address: string | null;
  next_of_kin_name: string | null;
  next_of_kin_phone: string | null;
  next_of_kin_relationship: string | null;
  beneficiary_name: string | null;
  beneficiary_phone: string | null;
  beneficiary_relationship: string | null;
  profile_completion_percent: number;
  status: 'pending_registration' | 'active_basic' | 'profile_incomplete' | 'pending_approval' | 'approved' | 'suspended';
  role: 'user' | 'admin';
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: any | null;
  profile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const router = useRouter();
  const pathname = usePathname();

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        // PGRST116 = no rows found (new user, profile not yet created) — not a real error
        // 42P01 = table doesn't exist yet
        if (error.code !== 'PGRST116' && error.code !== '42P01') {
          console.error('Error fetching profile:', error.message);
        }
        setProfile(null);
      } else {
        setProfile(data as Profile);
      }
    } catch (err) {
      console.error('Unexpected error in fetchProfile:', err);
      setProfile(null);
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      // 1. Get initial session
      const { data: { session } } = await supabase.auth.getSession();
      if (isMounted) {
        if (session?.user) {
          setUser(session.user);
          await fetchProfile(session.user.id);
        } else {
          setUser(null);
          setProfile(null);
        }
        setLoading(false);
      }
    };

    initializeAuth();

    // 2. Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;

      setLoading(true);
      if (session?.user) {
        setUser(session.user);
        await fetchProfile(session.user.id);
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);

      // Handle simple navigation checks on state change
      if (event === 'SIGNED_IN') {
        // Let pages handle redirect to /welcome or /dashboard
      } else if (event === 'SIGNED_OUT') {
        router.push('/');
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Handle route protection client-side
  useEffect(() => {
    if (loading) return;

    const publicRoutes = ['/', '/login', '/signup', '/forgot-password', '/reset-password', '/terms'];
    const isPublicRoute = publicRoutes.includes(pathname) || pathname === '/terms';

    if (!user && !isPublicRoute) {
      router.push('/login');
    }

    if (user && profile) {
      // If user is suspended, force block them on dashboard or custom lockout page
      if (profile.status === 'suspended' && pathname !== '/dashboard' && pathname !== '/login') {
        router.push('/dashboard');
      }
    }
  }, [user, profile, pathname, loading]);

  const signOut = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setLoading(false);
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signOut, refreshProfile }}>
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
