import { useState, useEffect } from 'react';

const isClient = typeof window !== 'undefined';

export function useVisitTracking() {
  const [hasVisitedBefore, setHasVisitedBefore] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // This effect only runs on the client side
    if (!isClient) return;

    const visited = localStorage.getItem('has_visited_before');
    const hasVisited = !!visited;
    
    setHasVisitedBefore(hasVisited);
    
    if (!visited) {
      localStorage.setItem('has_visited_before', 'true');
    }
    
    setIsLoading(false);
  }, []);

  return { hasVisitedBefore, isLoading };
}
