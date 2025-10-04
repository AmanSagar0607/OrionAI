'use client';

import { useSession } from 'next-auth/react';

export function DebugSession() {
  const { data: session, status } = useSession();
  
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-0 right-0 p-4 bg-gray-900 text-white text-xs max-w-xs z-50">
      <div className="font-bold mb-2">Session Debug</div>
      <div className="mb-1">Status: <span className="font-mono">{status}</span></div>
      <div className="font-bold mt-2 mb-1">Session Data:</div>
      <pre className="text-xs overflow-auto max-h-40 bg-gray-800 p-2 rounded">
        {JSON.stringify(session, null, 2) || 'No session data'}
      </pre>
    </div>
  );
}
