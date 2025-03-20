
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

type UserType = 'company' | 'candidate' | null;

interface UserContextType {
  userType: UserType;
  setUserType: (type: UserType) => void;
  isAuthenticated: boolean;
  login: (email: string, password: string, type: UserType) => Promise<void>;
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
    // In a real app, this would make an API call to verify credentials
    // For demo purposes, we'll simulate success and set mock data
    
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
          
          // Save to localStorage
          localStorage.setItem('userType', type);
          localStorage.setItem('user', JSON.stringify(mockUser));
          
          resolve();
        } catch (error) {
          reject(error);
        }
      }, 1000);
    });
  };
  
  const logout = () => {
    setUser(null);
    setUserType(null);
    setIsAuthenticated(false);
    localStorage.removeItem('userType');
    localStorage.removeItem('user');
    navigate('/login');
  };
  
  return (
    <UserContext.Provider value={{ 
      userType, 
      setUserType, 
      isAuthenticated, 
      login, 
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
