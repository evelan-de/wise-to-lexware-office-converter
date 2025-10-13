'use client';

import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface ErrorAlertProps {
  message: string;
  onDismiss?: () => void;
}

export function ErrorAlert({ message, onDismiss }: ErrorAlertProps) {
  return (
    <Alert variant="destructive" className="border-red-200 bg-red-50">
      <AlertCircle className="h-4 w-4 text-red-600" />
      <AlertTitle className="text-red-900 font-semibold">Fehler</AlertTitle>
      <AlertDescription className="text-red-800">{message}</AlertDescription>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="absolute top-3 right-3 text-red-600 hover:text-red-800"
        >
          ×
        </button>
      )}
    </Alert>
  );
}
