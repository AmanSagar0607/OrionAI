'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getStoredToken, isTokenExpired } from '@/lib/jwt';
import { Loader2 } from 'lucide-react';

export function ProtectedRoute({ children, requiredRole }: { children: React.ReactNode; requiredRole?: string }) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      const token = getStoredToken();
      
      if (!token || isTokenExpired(token)) {
        setIsAuthorized(false);
        router.push('/auth/login');
        return;
      }

      // Decode token to check role if needed
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUserRole(payload.role);
      
      if (requiredRole && payload.role !== requiredRole) {
        setIsAuthorized(false);
        router.push('/unauthorized');
        return;
      }
      
      setIsAuthorized(true);
    };

    checkAuth();
  }, [requiredRole, router]);

  if (isAuthorized === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}
