'use client';

import { useRef, useCallback } from 'react';
import { Upload, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { MAX_FILE_SIZE, MAX_FILE_SIZE_MB, ERROR_MESSAGES } from '@/lib/constants';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  onError: (error: string) => void;
  isProcessing: boolean;
}

export function FileUpload({ onFileSelect, onError, isProcessing }: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const resetInput = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  }, []);

  const validateFile = useCallback((file: File): boolean => {
    // Check file type
    if (!file.name.endsWith('.csv')) {
      onError(ERROR_MESSAGES.INVALID_FILE_TYPE);
      return false;
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      onError(ERROR_MESSAGES.FILE_TOO_LARGE);
      return false;
    }

    return true;
  }, [onError]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (isProcessing) return;

    const file = e.dataTransfer.files[0];
    if (!file) return;

    // Reset input to allow re-dropping same file
    resetInput();

    if (validateFile(file)) {
      onFileSelect(file);
    }
  }, [isProcessing, validateFile, onFileSelect, resetInput]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (validateFile(file)) {
      onFileSelect(file);
    } else {
      // Reset input on validation failure
      e.target.value = '';
    }
  }, [validateFile, onFileSelect]);

  const handleClick = useCallback(() => {
    if (!isProcessing) {
      inputRef.current?.click();
    }
  }, [isProcessing]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if ((e.key === 'Enter' || e.key === ' ') && !isProcessing) {
      e.preventDefault();
      inputRef.current?.click();
    }
  }, [isProcessing]);


  return (
    <Card
      className={`border-2 border-dashed transition-all duration-200 ${
        isProcessing
          ? 'border-primary/50 bg-primary/5'
          : 'border-border hover:border-primary cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-background'
      }`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      role="button"
      tabIndex={isProcessing ? -1 : 0}
      aria-label={isProcessing ? 'Datei wird verarbeitet' : 'CSV-Datei hochladen'}
      aria-disabled={isProcessing}
    >
      <CardContent className="flex flex-col items-center justify-center py-12 px-6">
        {isProcessing ? (
          <>
            <Loader2 className="w-12 h-12 text-primary mb-4 animate-spin" />
            <p className="text-lg font-medium text-foreground">
              Datei wird verarbeitet...
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Bitte warten Sie einen Moment
            </p>
          </>
        ) : (
          <>
            <div className="rounded-full bg-primary/10 p-4 mb-4">
              <Upload className="w-8 h-8 text-primary" />
            </div>
            <p className="text-lg font-medium text-foreground">
              CSV-Datei hier ablegen oder klicken
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Nur Wise Export CSV-Dateien
            </p>
            <p className="text-xs text-muted-foreground/70 mt-1">
              Maximale Dateigröße: {MAX_FILE_SIZE_MB} MB
            </p>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept=".csv"
          className="hidden"
          onChange={handleFileChange}
          disabled={isProcessing}
        />
      </CardContent>
    </Card>
  );
}
