"use client";
import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import { useUserStore } from "@/lib/store";
import type { User } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string, name: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { user: storeUser, setUser: setStoreUser } = useUserStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user ?? null;
      setStoreUser(user);
      setLoading(false);
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_OUT') {
          setStoreUser(null);
        } else if (session) {
          setStoreUser(session.user);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, [setStoreUser]);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Sign in error:', error);
        
        // Handle specific error cases
        if (error.message.includes('Invalid login credentials')) {
          return { error: "Retpoŝto aŭ pasvorto malĝustas. Bonvolu kontroli kaj reprovi." };
        }
        if (error.message.includes('Email not confirmed')) {
          return { error: "Retpoŝto ne konfirmita. Bonvolu kontroli vian retpoŝton kaj klaki la konfirman ligilon." };
        }
        if (error.message.includes('rate limit') || error.message.includes('Too Many Requests')) {
          return { error: 'Tro da provoj. Bonvolu atendi kelkajn minutojn antaŭ reprovi.' };
        }
        console.log('Unknown sign in error:', error);
        return { error: "Retpoŝto aŭ pasvorto malĝustas. Bonvolu reprovi." };
      }

      return {};
    } catch (error) {
      console.error('Unexpected sign in error:', error);
      return { error: "Okazis neesperita eraro. Bonvolu reprovi." };
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: name,
          }
        }
      });

      if (error) {
        console.error('Sign up error:', error);
        
        // Handle specific error cases
        if (error.message.includes('already registered')) {
          return { error: 'Ĉi tiu retpoŝto jam estas registrita.' };
        }
        if (error.message.includes('invalid') || error.message.includes('Invalid email')) {
          return { error: 'La retpoŝtadreso ne validas. Bonvolu kontroli la formon.' };
        }
        if (error.message.includes('weak password')) {
          return { error: 'La pasvorto estas tro malforta. Bonvolu uzi pli fortan pasvorton.' };
        }
        if (error.message.includes('rate limit') || error.message.includes('Too Many Requests')) {
          return { error: 'Tro da provoj. Bonvolu atendi kelkajn minutojn antaŭ reprovi.' };
        }
        
        return { error: 'Okazis eraro dum registrado. Bonvolu reprovi.' };
      }

      return {};
    } catch (error) {
      console.error('Unexpected sign up error:', error);
      return { error: 'Okazis neesperita eraro. Bonvolu reprovi.' };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setStoreUser(null);
  };

  return (
    <AuthContext.Provider value={{ user: storeUser, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
