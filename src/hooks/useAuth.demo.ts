import { useState, useEffect, createContext, useContext } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Demo mode authentication (no backend required)
export const useAuthProvider = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session (demo mode)
    const checkStoredAuth = () => {
      const storedUser = localStorage.getItem('ifad_user');
      
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (error) {
          console.error('Invalid stored user data:', error);
          localStorage.removeItem('ifad_user');
        }
      }
      setIsLoading(false);
    };

    checkStoredAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Demo login logic - determine role based on email
    let role = 'student';
    if (email.includes('admin') || email === 'admin@umd.edu') {
      role = 'admin';
    } else if (email.includes('host') || email.endsWith('@company.com')) {
      role = 'host';
    }

    const userData: User = {
      id: Math.random().toString(36).substr(2, 9),
      userId: Math.random().toString(36).substr(2, 9),
      email,
      firstName: email.split('@')[0].split('.')[0] || 'Demo',
      lastName: email.split('@')[0].split('.')[1] || 'User',
      role: role as 'student' | 'host' | 'admin',
    };

    localStorage.setItem('ifad_user', JSON.stringify(userData));
    setUser(userData);
    setIsLoading(false);
  };

  const register = async (userData: any) => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Demo registration - just create a user and log them in
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      userId: Math.random().toString(36).substr(2, 9),
      email: userData.workEmail || userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      role: userData.role || 'host',
    };

    localStorage.setItem('ifad_user', JSON.stringify(newUser));
    setUser(newUser);
    setIsLoading(false);
  };

  const logout = () => {
    localStorage.removeItem('ifad_user');
    setUser(null);
  };

  return {
    user,
    login,
    register,
    logout,
    isLoading,
  };
};

export { AuthContext };