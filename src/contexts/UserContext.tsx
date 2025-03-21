
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js'; 

type UserType = 'company' | 'candidate' | null;

interface UserContextType {
  userType: UserType;
  setUserType: (type: UserType) => void;
  isAuthenticated: boolean;
  login: (email: string, password: string, type: UserType) => Promise<void>;
  signup: (email: string, password: string, name: string, type: UserType) => Promise<void>;
  logout: () => void;
  user: {
    id: string;
    name: string;
    email: string;
    profilePicture?: string;
  } | null;
  loading: boolean;
  session: Session | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userType, setUserType] = useState<UserType>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<UserContextType['user']>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Check for existing session on initial load
  useEffect(() => {
    const initializeAuth = async () => {
      setLoading(true);
      
      try {
        // Set up auth state listener FIRST
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, sessionData) => {
            console.log('Auth state changed:', event, sessionData);
            setSession(sessionData);
            
            if (sessionData) {
              const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', sessionData.user.id)
                .single();
                
              if (profileError) {
                console.error('Error fetching profile:', profileError);
                setUser(null);
                setUserType(null);
                setIsAuthenticated(false);
                return;
              }
              
              // Set user type based on profile
              const type = profileData.user_type as UserType;
              setUserType(type);
              
              // Get user details based on type
              let userData;
              if (type === 'company') {
                const { data, error } = await supabase
                  .from('companies')
                  .select('*')
                  .eq('id', sessionData.user.id)
                  .single();
                  
                if (error) {
                  console.error('Error fetching company:', error);
                  return;
                }
                
                userData = { 
                  id: sessionData.user.id, 
                  name: data.name || 'Company',
                  email: sessionData.user.email || '',
                  profilePicture: data.logo 
                };
              } else {
                userData = { 
                  id: sessionData.user.id, 
                  name: `${profileData.first_name || ''} ${profileData.last_name || ''}`.trim() || 'User',
                  email: sessionData.user.email || '',
                  profilePicture: profileData.profile_image 
                };
              }
              
              setUser(userData);
              setIsAuthenticated(true);
            } else {
              setUser(null);
              setUserType(null);
              setIsAuthenticated(false);
            }
          }
        );
        
        // THEN check for existing session
        const { data: { session: existingSession } } = await supabase.auth.getSession();
        console.log('Existing session:', existingSession);
        
        if (existingSession) {
          setSession(existingSession);
          
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', existingSession.user.id)
            .single();
            
          if (profileError) {
            console.error('Error fetching profile:', profileError);
            return;
          }
          
          // Set user type based on profile
          const type = profileData.user_type as UserType;
          setUserType(type);
          
          // Get user details based on type
          let userData;
          if (type === 'company') {
            const { data, error } = await supabase
              .from('companies')
              .select('*')
              .eq('id', existingSession.user.id)
              .single();
              
            if (error) {
              console.error('Error fetching company:', error);
              return;
            }
            
            userData = { 
              id: existingSession.user.id, 
              name: data.name || 'Company',
              email: existingSession.user.email || '',
              profilePicture: data.logo 
            };
          } else {
            userData = { 
              id: existingSession.user.id, 
              name: `${profileData.first_name || ''} ${profileData.last_name || ''}`.trim() || 'User',
              email: existingSession.user.email || '',
              profilePicture: profileData.profile_image 
            };
          }
          
          setUser(userData);
          setIsAuthenticated(true);
        }
        
        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Error checking authentication:', error);
        // Reset auth state if there's an error
        setUser(null);
        setUserType(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    
    initializeAuth();
  }, []);
  
  const login = async (email: string, password: string, type: UserType): Promise<void> => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      if (!data.user || !data.session) {
        throw new Error('Login failed. No user or session returned.');
      }
      
      // Profile should be created by the trigger we set up in SQL
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();
        
      if (profileError) {
        throw profileError;
      }
      
      // If we're trying to log in as a different user type than what's in the database
      if (type !== profileData.user_type) {
        await supabase.auth.signOut();
        throw new Error(`This account is registered as a ${profileData.user_type}, not a ${type}`);
      }
      
      setUserType(type);
      setSession(data.session);
      
      // Get user details based on type
      let userData;
      if (type === 'company') {
        const { data: companyData, error: companyError } = await supabase
          .from('companies')
          .select('*')
          .eq('id', data.user.id)
          .single();
          
        if (companyError) {
          throw companyError;
        }
        
        userData = { 
          id: data.user.id, 
          name: companyData.name || 'Company',
          email: data.user.email || '',
          profilePicture: companyData.logo 
        };
      } else {
        userData = { 
          id: data.user.id, 
          name: `${profileData.first_name || ''} ${profileData.last_name || ''}`.trim() || 'User',
          email: data.user.email || '',
          profilePicture: profileData.profile_image 
        };
      }
      
      setUser(userData);
      setIsAuthenticated(true);
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${userData.name}!`,
      });
      
    } catch (error) {
      console.error('Login error:', error);
      let errorMessage = "An error occurred during login. Please try again.";
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Login failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  const signup = async (email: string, password: string, name: string, type: UserType): Promise<void> => {
    try {
      setLoading(true);
      
      // For company, name is company name
      // For candidate, name is split into first and last name
      let firstName = '';
      let lastName = '';
      
      if (type === 'candidate') {
        const nameParts = name.split(' ');
        firstName = nameParts[0] || '';
        lastName = nameParts.slice(1).join(' ') || '';
      }
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            company_name: type === 'company' ? name : undefined,
            user_type: type
          }
        }
      });
      
      if (error) throw error;
      
      if (!data.user) {
        throw new Error('User creation failed');
      }
      
      // The trigger will create the profile and type-specific record
      
      const userData = { 
        id: data.user.id, 
        name: type === 'company' ? name : `${firstName} ${lastName}`.trim(),
        email: data.user.email || '',
      };
      
      setSession(data.session);
      setUser(userData);
      setUserType(type);
      setIsAuthenticated(true);
      
      toast({
        title: "Account created",
        description: `Welcome to Intervue, ${name}!`,
      });
      
    } catch (error) {
      console.error('Signup error:', error);
      let errorMessage = "An error occurred during signup. Please try again.";
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Signup failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  const logout = async () => {
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      setUser(null);
      setUserType(null);
      setIsAuthenticated(false);
      setSession(null);
      
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
      
      navigate('/login');
      
    } catch (error) {
      console.error('Logout error:', error);
      
      toast({
        title: "Logout failed",
        description: "There was a problem logging out. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <UserContext.Provider value={{ 
      userType, 
      setUserType, 
      isAuthenticated, 
      login,
      signup, 
      logout,
      user,
      loading,
      session
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
