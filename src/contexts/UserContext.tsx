
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

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
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userType, setUserType] = useState<UserType>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<UserContextType['user']>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Check local storage on initial load
  useEffect(() => {
    const storedUserType = localStorage.getItem('userType');
    const storedUser = localStorage.getItem('user');
    
    if (storedUserType) {
      setUserType(storedUserType as UserType);
    }
    
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);
  
  const login = async (email: string, password: string, type: UserType): Promise<void> => {
    try {
      // In a real app with Supabase, we would use:
      // const { data, error } = await supabase.auth.signInWithPassword({
      //   email,
      //   password,
      // });
      // if (error) throw error;
      
      // For demo purposes, we'll simulate success
      // This would be replaced with Supabase authentication
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          try {
            // Mock successful login
            const mockUser = {
              id: type === 'company' ? 'comp_123456' : 'cand_123456',
              name: type === 'company' ? 'Acme Corporation' : 'John Doe',
              email: email,
              profilePicture: type === 'company' ? undefined : 'https://i.pravatar.cc/300'
            };
            
            setUser(mockUser);
            setUserType(type);
            setIsAuthenticated(true);
            
            // Save to localStorage (would be handled by Supabase session)
            localStorage.setItem('userType', type);
            localStorage.setItem('user', JSON.stringify(mockUser));
            
            toast({
              title: "Login successful",
              description: `Welcome back, ${mockUser.name}!`,
            });
            
            resolve();
          } catch (error) {
            toast({
              title: "Login failed",
              description: "An error occurred during login. Please try again.",
              variant: "destructive",
            });
            reject(error);
          }
        }, 1000);
      });
    } catch (error) {
      toast({
        title: "Login failed",
        description: "An error occurred during login. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };
  
  const signup = async (email: string, password: string, name: string, type: UserType): Promise<void> => {
    try {
      // In a real app with Supabase, we would use:
      // const { data, error } = await supabase.auth.signUp({
      //   email,
      //   password,
      //   options: {
      //     data: {
      //       name,
      //       user_type: type
      //     }
      //   }
      // });
      // if (error) throw error;
      
      // For demo purposes, we'll simulate success
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          try {
            // Mock successful signup
            const mockUser = {
              id: type === 'company' ? `comp_${Date.now()}` : `cand_${Date.now()}`,
              name: name,
              email: email,
              profilePicture: type === 'company' ? undefined : 'https://i.pravatar.cc/300'
            };
            
            setUser(mockUser);
            setUserType(type);
            setIsAuthenticated(true);
            
            // Save to localStorage (would be handled by Supabase session)
            localStorage.setItem('userType', type);
            localStorage.setItem('user', JSON.stringify(mockUser));
            
            toast({
              title: "Account created",
              description: `Welcome to Intervue, ${name}!`,
            });
            
            resolve();
          } catch (error) {
            toast({
              title: "Signup failed",
              description: "An error occurred during signup. Please try again.",
              variant: "destructive",
            });
            reject(error);
          }
        }, 1000);
      });
    } catch (error) {
      toast({
        title: "Signup failed",
        description: "An error occurred during signup. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };
  
  const logout = () => {
    // In a real app with Supabase, we would use:
    // await supabase.auth.signOut();
    
    setUser(null);
    setUserType(null);
    setIsAuthenticated(false);
    localStorage.removeItem('userType');
    localStorage.removeItem('user');
    
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    
    navigate('/login');
  };
  
  return (
    <UserContext.Provider value={{ 
      userType, 
      setUserType, 
      isAuthenticated, 
      login,
      signup, 
      logout,
      user
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
