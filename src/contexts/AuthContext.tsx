import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { User, UserRole, AuthState } from '@/types/auth';

interface AuthContextType extends AuthState {
  login: (militaryId: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demonstration
const MOCK_USERS: Record<string, { password: string; user: User }> = {
  'HQ001': {
    password: 'admin123',
    user: {
      id: '1',
      militaryId: 'HQ001',
      name: '김철수',
      rank: '대령',
      unit: '육군본부 군사경찰실',
      role: 'ROLE_HQ',
    },
  },
  'DIV001': {
    password: 'admin123',
    user: {
      id: '2',
      militaryId: 'DIV001',
      name: '이영희',
      rank: '준장',
      unit: '제1사단',
      role: 'ROLE_DIV',
    },
  },
  'BN001': {
    password: 'admin123',
    user: {
      id: '3',
      militaryId: 'BN001',
      name: '박민수',
      rank: '중령',
      unit: '제1대대',
      role: 'ROLE_BN',
    },
  },
};

// 테스트를 위해 기본적으로 ROLE_HQ 사용자로 설정
const DEFAULT_TEST_USER: User = {
  id: '1',
  militaryId: 'HQ001',
  name: '김철수',
  rank: '대령',
  unit: '육군본부 군사경찰실',
  role: 'ROLE_HQ',
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: DEFAULT_TEST_USER,
    isAuthenticated: true,
    isLoading: false,
  });

  const login = useCallback(async (militaryId: string, password: string): Promise<boolean> => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const mockUser = MOCK_USERS[militaryId];
    
    if (mockUser && mockUser.password === password) {
      setAuthState({
        user: mockUser.user,
        isAuthenticated: true,
        isLoading: false,
      });
      return true;
    }
    
    setAuthState(prev => ({ ...prev, isLoading: false }));
    return false;
  }, []);

  const logout = useCallback(() => {
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  }, []);

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
