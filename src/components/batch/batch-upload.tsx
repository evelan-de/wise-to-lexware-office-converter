'use client';

import { useRef, useCallback } from 'react';
import { Upload, Loader2, FolderPlus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import {
  MAX_FILE_SIZE,
  MAX_FILE_SIZE_MB,
  MAX_BATCH_FILES,
  MAX_TOTAL_BATCH_SIZE,
  MAX_TOTAL_BATCH_SIZE_MB,
  ERROR_MESSAGES,
} from '@/lib/constants';

interface BatchUploadProps {
  onFilesSelect: (files: File[]) => void;
  onError: (error: string) => void;
  isProcessing: boolean;
  currentFileCount: number;
  currentTotalSize: number;
}

export function BatchUpload({
  onFilesSelect,
  onError,
  isProcessing,
  currentFileCount,
  currentTotalSize,
}: BatchUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const resetInput = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  }, []);

  const validateFiles = useCallback(
    (files: FileList | File[]): File[] => {
      const fileArray = Array.from(files);
      const validFiles: File[] = [];
      const errors: string[] = [];

      // Check total file count
      const totalCount = currentFileCount + fileArray.length;
      if (totalCount > MAX_BATCH_FILES) {
        onError(ERROR_MESSAGES.TOO_MANY_FILES);
        return [];
      }

      // Calculate total size including current files
      let newTotalSize = currentTotalSize;

      for (const file of fileArray) {
        // Check file type
        if (!file.name.endsWith('.csv')) {
          errors.push(`${file.name}: ${ERROR_MESSAGES.INVALID_FILE_TYPE}`);
          continue;
        }

        // Check individual file size
        if (file.size > MAX_FILE_SIZE) {
          errors.push(`${file.name}: ${ERROR_MESSAGES.FILE_TOO_LARGE}`);
          continue;
        }

        // Check total size
        if (newTotalSize + file.size > MAX_TOTAL_BATCH_SIZE) {
          errors.push(ERROR_MESSAGES.BATCH_TOO_LARGE);
          break;
        }

        newTotalSize += file.size;
        validFiles.push(file);
      }

      if (errors.length > 0) {
        onError(errors[0]); // Show first error
        return validFiles; // Return valid files anyway
      }

      return validFiles;
    },
    [currentFileCount, currentTotalSize, onError]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (isProcessing) return;

      const droppedFiles = e.dataTransfer.files;
      if (!droppedFiles || droppedFiles.length === 0) return;

      resetInput();
      const validFiles = validateFiles(droppedFiles);
      if (validFiles.length > 0) {
        onFilesSelect(validFiles);
      }
    },
    [isProcessing, validateFiles, onFilesSelect, resetInput]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = e.target.files;
      if (!selectedFiles || selectedFiles.length === 0) return;

      const validFiles = validateFiles(selectedFiles);
      if (validFiles.length > 0) {
        onFilesSelect(validFiles);
      }
      // Reset input to allow selecting same files again
      e.target.value = '';
    },
    [validateFiles, onFilesSelect]
  );

  const handleClick = useCallback(() => {
    if (!isProcessing) {
      inputRef.current?.click();
    }
  }, [isProcessing]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if ((e.key === 'Enter' || e.key === ' ') && !isProcessing) {
        e.preventDefault();
        inputRef.current?.click();
      }
    },
    [isProcessing]
  );

  const remainingFiles = MAX_BATCH_FILES - currentFileCount;
  const remainingSize = MAX_TOTAL_BATCH_SIZE - currentTotalSize;
  const remainingSizeMB = (remainingSize / (1024 * 1024)).toFixed(1);

  return (
    <Card
      className={`border-2 border-dashed transition-all duration-200 ${
        isProcessing
          ? 'border-primary/50 bg-primary/5'
          : 'border-gray-300 hover:border-primary cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'
      }`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      role="button"
      tabIndex={isProcessing ? -1 : 0}
      aria-label={
        isProcessing
          ? 'Dateien werden verarbeitet'
          : 'Mehrere CSV-Dateien hochladen'
      }
      aria-disabled={isProcessing}
    >
      <CardContent className="flex flex-col items-center justify-center py-12 px-6">
        {isProcessing ? (
          <>
            <Loader2 className="w-12 h-12 text-primary mb-4 animate-spin" />
            <p className="text-lg font-medium text-gray-900">
              Dateien werden verarbeitet...
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Bitte warten Sie einen Moment
            </p>
          </>
        ) : (
          <>
            <div className="rounded-full bg-primary/10 p-4 mb-4">
              <FolderPlus className="w-8 h-8 text-primary" />
            </div>
            <p className="text-lg font-medium text-gray-900">
              CSV-Dateien hier ablegen oder klicken
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Mehrere Wise Export CSV-Dateien auswählen
            </p>
            <div className="flex flex-col items-center gap-1 mt-3 text-xs text-gray-400">
              <p>
                Max. {MAX_FILE_SIZE_MB} MB pro Datei, {MAX_TOTAL_BATCH_SIZE_MB} MB insgesamt
              </p>
              <p>
                {remainingFiles > 0 ? (
                  <span className="text-green-600">
                    Noch {remainingFiles} Dateien verfügbar ({remainingSizeMB} MB)
                  </span>
                ) : (
                  <span className="text-red-600">
                    Maximale Anzahl an Dateien erreicht
                  </span>
                )}
              </p>
            </div>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept=".csv"
          multiple
          className="hidden"
          onChange={handleFileChange}
          disabled={isProcessing}
        />
      </CardContent>
    </Card>
  );
}
