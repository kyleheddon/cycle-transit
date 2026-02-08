'use client';

import { useEffect } from 'react';
import { setupGlobalErrorHandlers } from '@/lib/client-logger';

export function ErrorLogger() {
  useEffect(() => {
    setupGlobalErrorHandlers();
  }, []);

  return null;
}
