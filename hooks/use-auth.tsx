"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";

type AuthContextType = {
  user: User | null;
  profile: any | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signInWithGoogle: () => Promise<{ error: any }>;
  signUp: (email: string, password: string, name: string) => Promise<{ error: any, user: User | null }>;
  signOut: () => Promise<{ error: any }>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  updatePassword: (password: string) => Promise<{ error: any }>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  // Function to generate a unique username
  const generateUniqueUsername = async (name: string): Promise<string> => {
    const cleanName = name.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
    let userName = cleanName;
    let counter = 1;
    
    while (await isUsernameTaken(userName)) {
      userName = `${cleanName}${counter}`;
      counter++;
    }
    
    return userName;
  };

  const isUsernameTaken = async (userName: string): Promise<boolean> => {
    const { data, error } = await supabase
      .from("profiles")
      .select("userName")
      .eq("userName", userName)
      .single();
    
    return !error && !!data;
  };

  const handleUserProfile = async (user: User) => {
    try {
      const { data: existingProfile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      const { name, full_name, avatar_url } = user.user_metadata || {};
      const displayName = full_name || name || user.email?.split('@')[0] || 'User';
      
      if (!profileError && existingProfile) {
        const needsUpdate = 
          displayName !== existingProfile.fullName || 
          !existingProfile.userName || 
          (avatar_url && avatar_url !== existingProfile.profileImage);
        
        if (needsUpdate) {
          let userName = existingProfile.userName;
          if (!userName) {
            userName = await generateUniqueUsername(displayName);
          }
          
          const { data: updatedProfile, error: updateError } = await supabase
            .from('profiles')
            .update({
              fullName: displayName,
              userName: userName,
              ...(avatar_url && { profileImage: avatar_url })
            })
            .eq('id', user.id)
            .select()
            .single();
            
          if (!updateError && updatedProfile) {
            setProfile(updatedProfile);
            return;
          }
        }

        setProfile(existingProfile);
      } else {
        const userName = await generateUniqueUsername(displayName);
        
        const { data: newProfile, error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            email: user.email,
            fullName: displayName,
            userName: userName,
            profileImage: avatar_url || null,
            createdAt: new Date().toISOString(),
            onboardingCompleted: false
          })
          .select()
          .single();
          
        if (!insertError && newProfile) {
          setProfile(newProfile);
        } else {
          console.error('Error creating profile:', insertError);
          
          const { data: fetchedProfile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
            
          if (fetchedProfile) {
            setProfile(fetchedProfile);
          }
        }
      }
    } catch (error) {
      console.error('Error handling user profile:', error);
    }
  };

  useEffect(() => {
    // Initialize auth state immediately from localStorage if available
    const cachedUser = localStorage.getItem('auth_user');
    const cachedProfile = localStorage.getItem('auth_profile');
    
    if (cachedUser) {
      try {
        setUser(JSON.parse(cachedUser));
        if (cachedProfile) {
          setProfile(JSON.parse(cachedProfile));
        }
        // Still loading but we have something to show
        setLoading(true);
      } catch (e) {
        console.error('Error parsing cached auth data:', e);
      }
    }

    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          setUser(session.user);
          // Cache user in localStorage
          localStorage.setItem('auth_user', JSON.stringify(session.user));
          
          // Fetch profile
          await handleUserProfile(session.user);
        } else {
          setUser(null);
          setProfile(null);
          // Clear cache
          localStorage.removeItem('auth_user');
          localStorage.removeItem('auth_profile');
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.id);
        
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          if (session?.user) {
            setUser(session.user);
            // Cache user in localStorage
            localStorage.setItem('auth_user', JSON.stringify(session.user));
            
            await handleUserProfile(session.user);
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setProfile(null);
          // Clear cache
          localStorage.removeItem('auth_user');
          localStorage.removeItem('auth_profile');
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Cache profile when it changes
  useEffect(() => {
    if (profile) {
      localStorage.setItem('auth_profile', JSON.stringify(profile));
    }
  }, [profile]);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { error };
    } catch (error) {
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      // Always redirect to the auth callback route
      const redirectTo = `${window.location.origin}/auth/callback`;
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });
      return { error };
    } catch (error) {
      return { error };
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { 
            name,
            full_name: name 
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      
      if (data?.user && !error) {
        await handleUserProfile(data.user);
      }
      
      return { error, user: data?.user || null };
    } catch (error) {
      return { error, user: null };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      setUser(null);
      setProfile(null);
      
      // Clear cache
      localStorage.removeItem('auth_user');
      localStorage.removeItem('auth_profile');
      
      const { error } = await supabase.auth.signOut();
      return { error };
    } catch (error) {
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
      return { error };
    } catch (error) {
      return { error };
    }
  };

  const updatePassword = async (password: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password,
      });
      return { error };
    } catch (error) {
      return { error };
    }
  };

  const value = {
    user,
    profile,
    loading,
    signIn,
    signInWithGoogle,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
  };

  // Always render children, but with potentially cached data
  // This prevents the blank screen issue
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}; 