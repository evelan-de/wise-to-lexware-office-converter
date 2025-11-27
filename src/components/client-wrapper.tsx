'use client';

import { ReactNode } from 'react';
import { ErrorBoundary } from './error-boundary';

interface ClientWrapperProps {
  children: ReactNode;
}

/**
 * Client-side wrapper that provides error boundary protection
 * for the application's main content
 */
export function ClientWrapper({ children }: ClientWrapperProps) {
  return <ErrorBoundary>{children}</ErrorBoundary>;
}
