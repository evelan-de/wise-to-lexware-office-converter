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
      className={`relative overflow-hidden upload-zone rounded-2xl transition-all duration-300 ${
        isProcessing
          ? 'border-primary/60 bg-primary/5'
          : 'cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background'
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
      {/* Background gradient mesh */}
      <div className="absolute inset-0 mesh-gradient opacity-50 pointer-events-none" />

      <CardContent className="relative flex flex-col items-center justify-center py-16 px-6">
        {isProcessing ? (
          <>
            <div className="relative">
              {/* Outer glow ring */}
              <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
              <div className="relative rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 p-5 glow-teal">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
              </div>
            </div>
            <p className="mt-6 text-lg font-semibold text-foreground">
              Datei wird verarbeitet...
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Bitte warten Sie einen Moment
            </p>
          </>
        ) : (
          <>
            {/* Upload icon with glow */}
            <div className="relative group">
              <div className="absolute inset-0 rounded-full bg-primary/10 blur-xl group-hover:bg-primary/20 transition-all duration-500" />
              <div className="relative rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 p-5 border border-primary/20 group-hover:border-primary/40 transition-all duration-300 group-hover:glow-teal">
                <Upload className="w-10 h-10 text-primary icon-glow" />
              </div>
            </div>

            <p className="mt-6 text-lg font-semibold text-foreground">
              CSV-Datei hier ablegen oder{' '}
              <span className="text-primary">klicken</span>
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Nur Wise Export CSV-Dateien
            </p>
            <p className="text-xs text-muted-foreground/60 mt-2 px-4 py-1 rounded-full bg-muted/50 border border-border/50">
              Max. {MAX_FILE_SIZE_MB} MB
            </p>

            {/* Decorative dots */}
            <div className="absolute top-4 left-4 flex gap-1.5">
              <div className="w-2 h-2 rounded-full bg-primary/40" />
              <div className="w-2 h-2 rounded-full bg-accent/40" />
              <div className="w-2 h-2 rounded-full bg-secondary/40" />
            </div>
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
