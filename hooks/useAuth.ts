import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { decodeToken, getStoredToken, isTokenExpired, clearToken } from '@/lib/jwt';

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const checkAuth = useCallback(async () => {
    const token = getStoredToken();
    
    if (!token || isTokenExpired(token)) {
      clearToken();
      setUser(null);
      setLoading(false);
      return null;
    }

    const decoded = decodeToken(token);
    if (decoded) {
      setUser({
        id: decoded.id,
        email: decoded.email,
        name: decoded.name,
        role: decoded.role
      });
    }
    
    setLoading(false);
    return decoded;
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const { token } = await response.json();
      localStorage.setItem('auth_token', token);
      await checkAuth();
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Login failed' };
    }
  };

  const logout = () => {
    clearToken();
    setUser(null);
    router.push('/auth/login');
  };

  return {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
    checkAuth,
  };
}
