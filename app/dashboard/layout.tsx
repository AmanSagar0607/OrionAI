'use client';

import { Button } from '@/components/ui/button';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await signOut({ 
        redirect: false,
        callbackUrl: 'http://localhost:3000/auth/signin'
      });
      window.location.href = 'http://localhost:3000/auth/signin';
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar will be rendered by the page component */}
      <div className="flex-1 flex flex-col">
        {/* Main content */}
        <main className="flex-1">
          <div className="h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}