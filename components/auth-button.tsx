"use client";

import * as React from 'react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { LogOut, User } from "lucide-react";
import { useRouter } from 'next/navigation';
import { useVisitTracking } from "@/hooks/use-visit-tracking";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function AuthButton() {
  const { data: session, status } = useSession();
  const [mounted, setMounted] = React.useState(false);
  const router = useRouter();
  
  const handleSignOut = async () => {
    try {
      // Clear any client-side tokens first
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
      }

      // Then clear the auth_token cookie
      try {
        await fetch('/api/auth/clear-token', {
          method: 'POST',
          credentials: 'same-origin',
        });
      } catch (error) {
        console.warn('Failed to clear auth token:', error);
        // Continue with sign out even if this fails
      }
      
      // Finally, sign out with NextAuth
      try {
        await signOut({ redirect: false });
      } catch (error) {
        console.warn('Error during sign out:', error);
        // Continue with redirect even if signOut fails
      }
      
      // Force a full page reload to clear all states
      window.location.href = '/';
      window.location.reload();
    } catch (error) {
      console.error('Unexpected error during sign out:', error);
      // Ensure we still redirect to home even if something fails
      window.location.href = '/';
    }
  };
  
  // Extract user from session
  const user = session?.user || session as any;
  
  // Set mounted state after component mounts
  React.useEffect(() => {
    setMounted(true);
  }, []);
  
  // Debug logging - only in development
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const timer = setTimeout(() => {
        console.log('AuthButton - Status:', status);
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [status]);
  
  // Use the visit tracking hook - must be called unconditionally at the top level
  const { hasVisitedBefore, isLoading: isVisitLoading } = useVisitTracking();
  
  // Show skeleton loader while loading
  if (!mounted || status === 'loading') {
    return (
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-4">
          <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
          <div className="space-y-2">
            <div className="h-4 w-20 bg-muted rounded animate-pulse" />
            <div className="h-3 w-16 bg-muted/50 rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }
  
  // Check if we have user data directly in session or in session.user
  const hasUserData = (user?.name || user?.email) || (session && (session as any).name);
  
  if (hasUserData) {
    const displayName = user?.name || (session as any)?.name || user?.email || 'User';
    const displayEmail = user?.email || (session as any)?.email;
    const displayRole = user?.role || (session as any)?.role;
    
    console.log('Rendering user menu for:', { displayName, displayEmail, displayRole });
    console.log('Rendering user menu for:', user);
    
    const name = user?.name || (session as any)?.name || '';
    const initials = name
      ?.split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.image || ""} alt={displayName} />
              <AvatarFallback className="text-xs bg-primary/10">
                {initials || <User className="h-4 w-4" />}
              </AvatarFallback>
            </Avatar>
            <span className="hidden sm:inline">{displayName.split(" ")[0]}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link href="/profile" className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sign out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Show a simple loading state while we check visit status or session
  if (isVisitLoading || !mounted) {
    return (
      <div className="h-10 w-24 animate-pulse bg-muted rounded-md" />
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Button asChild>
        <Link href="/auth/signin" className="whitespace-nowrap">
          {hasVisitedBefore ? 'Login' : 'Get Started'}
        </Link>
      </Button>
      {status === 'authenticated' && (session || user) && (
        <div className="text-xs text-muted-foreground">
          {user?.name || (session as any)?.name || user?.email || (session as any)?.email}
          {(user?.role || (session as any)?.role) && ` • ${user?.role || (session as any)?.role}`}
        </div>
      )}
    </div>
  );
}
