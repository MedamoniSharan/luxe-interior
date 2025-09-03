import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

type AuthUser = {
  id: string;
  email: string;
  phone?: string;
  name?: string;
  location?: string;
} | null;

type SignupData = {
  name: string;
  email: string;
  phone: string;
  location: string;
  password: string;
};

type AuthContextType = {
  user: AuthUser;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (identifier: string, password: string) => Promise<{ error: any } | undefined>;
  signup: (data: SignupData) => Promise<{ error: any } | undefined>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => undefined,
  signup: async () => undefined,
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session and listen for auth changes
  useEffect(() => {
    let mounted = true;

    // Get initial session
    const getInitialSession = async () => {
      try {
        console.log('🔍 Checking for existing session...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ Error getting session:', error);
          if (mounted) {
            setIsLoading(false);
          }
          return;
        }

        if (session?.user && mounted) {
          console.log('✅ Found existing session for:', session.user.email);
          await loadUserProfile(session.user);
        } else if (mounted) {
          // No session found, set loading to false
          setIsLoading(false);
        }
      } catch (error) {
        console.error('💥 Unexpected error getting session:', error);
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    getInitialSession();

    // Add a timeout fallback to prevent infinite loading
    const timeoutId = setTimeout(() => {
      if (mounted && isLoading) {
        console.log('⏰ Loading timeout reached, setting isLoading to false');
        setIsLoading(false);
      }
    }, 10000); // 10 second timeout

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 Auth state changed:', event);
      
      if (!mounted) return;

      if (event === 'SIGNED_IN' && session?.user) {
        console.log('👤 User signed in:', session.user.email);
        setIsLoading(true); // Set loading while profile loads
        await loadUserProfile(session.user);
        // Note: loadUserProfile now handles setting isLoading to false
      } else if (event === 'SIGNED_OUT') {
        console.log('👋 User signed out');
        setUser(null);
        setIsLoading(false);
      } else if (event === 'TOKEN_REFRESHED') {
        // Token refreshed, ensure loading is false
        setIsLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
      clearTimeout(timeoutId);
    };
  }, []);

  const loadUserProfile = async (authUser: User) => {
    try {
      console.log('📋 Loading user profile for:', authUser.id);
      
      const { data: profile, error } = await supabase
        .from('users')
        .select('name, phone, location')
        .eq('id', authUser.id)
        .maybeSingle();

      if (error) {
        console.error('❌ Error loading user profile:', error);
        // Still set basic user info even if profile loading fails
        setUser({
          id: authUser.id,
          email: authUser.email || '',
        });
        console.log('✅ Set basic user info despite profile error');
        setIsLoading(false); // Ensure loading is set to false
        return;
      }

      console.log('✅ User profile loaded:', profile);
      setUser({
        id: authUser.id,
        email: authUser.email || '',
        phone: profile?.phone,
        name: profile?.name,
        location: profile?.location,
      });
      console.log('✅ Complete user profile set successfully');
      setIsLoading(false); // Ensure loading is set to false
    } catch (error) {
      console.error('💥 Unexpected error loading user profile:', error);
      // Fallback to basic user info
      setUser({
        id: authUser.id,
        email: authUser.email || '',
      });
      console.log('✅ Set fallback user info after error');
      setIsLoading(false); // Ensure loading is set to false
    }
  };

  const isEmail = (identifier: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);
  };

  const login = async (identifier: string, password: string) => {
    console.log('🔐 AuthProvider: Login attempt started for:', identifier);
    
    try {
      setIsLoading(true); // Set loading at start of login
      
      let result;
      
      if (isEmail(identifier)) {
        console.log('📧 AuthProvider: Attempting email login...');
        result = await supabase.auth.signInWithPassword({
          email: identifier,
          password: password,
        });
      } else {
        console.log('📱 AuthProvider: Attempting phone login...');
        const formattedPhone = identifier.startsWith('+91') ? identifier : `+91${identifier}`;
        result = await supabase.auth.signInWithPassword({
          phone: formattedPhone,
          password: password,
        });
      }

      if (result.error) {
        console.error('❌ AuthProvider: Login failed:', result.error.message);
        setIsLoading(false); // Reset loading on error
        return { success: false, error: result.error };
      }

      console.log('✅ AuthProvider: Login successful');
      // Don't set loading to false here - let the auth state change handler manage it
      return { success: true, error: null };
    } catch (error) {
      console.error('💥 AuthProvider: Unexpected login error:', error);
      setIsLoading(false); // Reset loading on error
      return { success: false, error };
    }
  };

  const signup = async (data: SignupData) => {
    console.log('📝 Signup attempt started for:', data.email);
    
    try {
      // Format phone number
      const formattedPhone = data.phone.startsWith('+91') ? data.phone : `+91${data.phone}`;
      
      // Create auth user
      console.log('🔐 Creating auth user...');
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
            phone: formattedPhone,
            location: data.location,
          }
        }
      });

      if (authError) {
        console.error('❌ Auth signup failed:', authError.message);
        
        // Handle specific error cases
        if (authError.message === 'User already registered' || 
            authError.message.includes('user_already_exists') ||
            authError.message.includes('already registered')) {
          return { 
            error: { 
              ...authError, 
              message: 'A user with this email already exists. Please try logging in instead.' 
            } 
          };
        }
        
        return { error: authError };
      }

      console.log('✅ Auth user created successfully');
      
      // Create user profile in database
      if (authData.user) {
        console.log('👤 Creating user profile...');
        
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            id: authData.user.id,
            name: data.name,
            email: data.email,
            phone: formattedPhone,
            location: data.location,
          });

        if (profileError) {
          console.error('❌ Error creating user profile:', profileError);
          // Don't return error here as auth user is already created
          // The profile will be created with basic info when they log in
        } else {
          console.log('✅ User profile created successfully');
        }
      }

      return { error: null };
    } catch (error) {
      console.error('💥 Unexpected signup error:', error);
      return { error };
    }
  };

  const logout = async () => {
    console.log('👋 Logging out...');
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('❌ Logout error:', error);
      } else {
        console.log('✅ Logout successful');
      }
      setUser(null);
    } catch (error) {
      console.error('💥 Unexpected logout error:', error);
      setUser(null); // Clear user state anyway
    }
  };



  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};