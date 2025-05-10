"use client";

import { useEffect } from 'react';
import { initLocalUser } from '@/lib/localUser';

// This component initializes the local user ID when the app loads
export default function LocalUserProvider({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  useEffect(() => {
    // Initialize the local user ID
    initLocalUser();
  }, []);

  return <>{children}</>;
}
