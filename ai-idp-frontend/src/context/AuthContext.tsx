import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthContextType, User } from '../types';
import { loginUser, registerUser, logoutUser, getCurrentUser, setAuthToken, getAuthToken, setCurrentUser, clearAuth } from '../services/authService';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedToken = getAuthToken();
    const storedUser = getCurrentUser();

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(storedUser);
    }

    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await loginUser({ username, password });

      setAuthToken(response.access_token);
      setToken(response.access_token);

      // Create user object from response
      const userData: User = {
        id: response.user_id || 0,
        username,
      };
      setCurrentUser(userData);
      setUser(userData);
    } catch (error) {
      clearAuth();
      setToken(null);
      setUser(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = (): void => {
    logoutUser();
    setToken(null);
    setUser(null);
  };

  const register = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      await registerUser({ email, password });
      
      // Auto-login after successful registration
      const loginResponse = await loginUser({ username: email, password });
      
      setAuthToken(loginResponse.access_token);
      setToken(loginResponse.access_token);
      
      const userData: User = {
        id: loginResponse.user_id || 0,
        username: email,
        email,
      };
      setCurrentUser(userData);
      setUser(userData);
    } catch (error) {
      clearAuth();
      setToken(null);
      setUser(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
