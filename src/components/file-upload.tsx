'use client';

import { useRef } from 'react';
import { Upload, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { MAX_FILE_SIZE, MAX_FILE_SIZE_MB } from '@/lib/constants';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  onError: (error: string) => void;
  isProcessing: boolean;
}

export function FileUpload({ onFileSelect, onError, isProcessing }: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): boolean => {
    // Check file type
    if (!file.name.endsWith('.csv')) {
      onError('Bitte wählen Sie eine CSV-Datei aus.');
      return false;
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      onError(`Datei ist zu groß. Maximale Größe: ${MAX_FILE_SIZE_MB} MB`);
      return false;
    }

    return true;
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];

    if (!file) return;

    if (validateFile(file)) {
      onFileSelect(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (validateFile(file)) {
      onFileSelect(file);
    } else {
      // Reset input on validation failure
      e.target.value = '';
    }
  };


  return (
    <Card
      className={`border-2 border-dashed transition-all duration-200 ${
        isProcessing
          ? 'border-primary/50 bg-primary/5'
          : 'border-gray-300 hover:border-primary cursor-pointer'
      }`}
      onClick={() => !isProcessing && inputRef.current?.click()}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <CardContent className="flex flex-col items-center justify-center py-12 px-6">
        {isProcessing ? (
          <>
            <Loader2 className="w-12 h-12 text-primary mb-4 animate-spin" />
            <p className="text-lg font-medium text-gray-900">
              Datei wird verarbeitet...
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Bitte warten Sie einen Moment
            </p>
          </>
        ) : (
          <>
            <div className="rounded-full bg-primary/10 p-4 mb-4">
              <Upload className="w-8 h-8 text-primary" />
            </div>
            <p className="text-lg font-medium text-gray-900">
              CSV-Datei hier ablegen oder klicken
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Nur Wise Export CSV-Dateien
            </p>
            <p className="text-xs text-gray-400 mt-1">
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
