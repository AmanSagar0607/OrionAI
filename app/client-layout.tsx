'use client';

import { usePathname } from 'next/navigation';
import { SessionProvider, useSession } from 'next-auth/react';
// import { MainNav } from "@/components/main-nav";
import { Container } from "@/components/container";
import { Footer } from "@/components/footer";
import { ThemeProvider } from "@/components/providers";
import { DebugSession } from "@/components/debug-session";
import { useEffect } from 'react';
import { Toaster } from "@/components/ui/sonner";

function AuthContent({ children }: { children: React.ReactNode }) {
  const { data: session, status, update } = useSession();
  const pathname = usePathname();
  const isAuthPage = pathname?.startsWith('/auth') || false;
  
  // Debug logging
  useEffect(() => {
    console.log('AuthContent - Status:', status);
    console.log('AuthContent - Session:', session);
    console.log('AuthContent - Pathname:', pathname);
    
    // Try to refresh the session if we're not authenticated
    if (status === 'unauthenticated' && !isAuthPage) {
      console.log('Attempting to refresh session...');
      update().then(updatedSession => {
        console.log('Session after refresh:', updatedSession);
      }).catch(err => {
        console.error('Error refreshing session:', err);
      });
    }
  }, [session, status, pathname, update, isAuthPage]);
  
  // if (status === 'loading') {
  //   return (
  //     <div className="flex items-center justify-center min-h-screen">
  //       <div className="animate-pulse">
  //         <div className="text-center">
  //           <div className="text-2xl font-semibold mb-2">Loading your session</div>
  //           <div className="text-sm text-muted-foreground">Please wait while we verify your authentication status...</div>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }
  
  return (
    <>
      {isAuthPage ? (
        <>{children}</>
      ) : (
        <>
          {/* <MainNav /> */}
          <main className="flex-1">
            <Container>
              {children}
            </Container>
          </main>
          {/* <Footer /> */}
        </>
      )}
      <Toaster position="top-center" richColors closeButton />
    </>
  );
}

export function ClientLayout({ children }: { children: React.ReactNode }) {
  // Clean up browser extension attributes after hydration
  useEffect(() => {
    const cleanupAttributes = () => {
      if (typeof document !== 'undefined') {
        document.body.removeAttribute('cz-shortcut-listen');
        document.body.removeAttribute('data-new-gr-c-s-check-loaded');
        document.body.removeAttribute('data-gr-ext-installed');
      }
    };

    // Run cleanup after a small delay to ensure hydration is complete
    const timer = setTimeout(cleanupAttributes, 0);
    return () => clearTimeout(timer);
  }, []);
  return (
    <SessionProvider
      refetchInterval={5 * 60} // Refetch session every 5 minutes
      refetchOnWindowFocus={true}
      // Don't pass session={null} as it will override the session
    >
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <AuthContent>{children}</AuthContent>
        {/* <DebugSession /> */}
      </ThemeProvider>
    </SessionProvider>
  );
}
