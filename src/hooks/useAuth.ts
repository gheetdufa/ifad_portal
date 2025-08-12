import { useState, useEffect, createContext, useContext } from 'react';
import { User } from '../types';
import { apiService } from '../services/api';

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

export const useAuthProvider = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeFromToken = async () => {
      try {
        const token = localStorage.getItem('ifad_token');
        console.log('[auth] init: token present?', !!token);
        if (!token) {
          setIsLoading(false);
          return;
        }
        // Try to load from backend; if it fails, fall back to cached user
        const result = await apiService.getCurrentUser();
        console.log('[auth] init: getCurrentUser result.success', result.success);
        if (result.success && result.data) {
          const backendUser = result.data;
          const normalizedUser: User = {
            id: backendUser.userId || backendUser.id,
            userId: backendUser.userId || backendUser.id,
            email: backendUser.email,
            firstName: backendUser.firstName,
            lastName: backendUser.lastName,
            role: backendUser.role,
          };
          setUser(normalizedUser);
          localStorage.setItem('ifad_user', JSON.stringify(normalizedUser));
          console.log('[auth] init: user set from backend', normalizedUser);
        } else {
          const cached = localStorage.getItem('ifad_user');
          if (cached) {
            setUser(JSON.parse(cached));
            console.log('[auth] init: user set from cache');
          } else {
            localStorage.removeItem('ifad_token');
            setUser(null);
            console.warn('[auth] init: clearing token, no user found');
          }
        }
      } catch {
        const cached = localStorage.getItem('ifad_user');
        if (cached) {
          setUser(JSON.parse(cached));
          console.log('[auth] init: exception path, using cached user');
        } else {
          localStorage.removeItem('ifad_token');
          setUser(null);
          console.warn('[auth] init: exception path, clearing token');
        }
      } finally {
        setIsLoading(false);
        console.log('[auth] init: isLoading=false');
      }
    };
    initializeFromToken();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await apiService.login(email, password);
      if (!response.success) {
        console.error('[auth] login failed:', response.message);
        throw new Error(response.message || 'Login failed');
      }

      const { token, user: userData } = response.data;
      const normalizedUser: User = {
        id: userData.userId || userData.id,
        userId: userData.userId || userData.id,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role,
      };

      localStorage.setItem('ifad_token', token);
      localStorage.setItem('ifad_user', JSON.stringify(normalizedUser));
      setUser(normalizedUser);
      console.log('[auth] login success; user set:', normalizedUser);
      return normalizedUser;
    } finally {
      setIsLoading(false);
      console.log('[auth] login: isLoading=false');
    }
  };

  const register = async (userData: any) => {
    setIsLoading(true);
    try {
      const response = await apiService.register(userData);
      if (!response.success) {
        throw new Error(response.message || 'Registration failed');
      }
      // Do not auto-login; require admin approval in many flows
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await apiService.logout();
    } finally {
      localStorage.removeItem('ifad_user');
      localStorage.removeItem('ifad_token');
      setUser(null);
    }
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