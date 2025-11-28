'use client';

import { useCallback } from 'react';
import { X, FileText, CheckCircle, AlertCircle, Loader2, Clock, Trash2, RotateCcw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { BatchFile, FileStatus } from '@/lib/batch-processor';
import { getStatusText, getStatusColor } from '@/lib/batch-processor';

interface FileQueueProps {
  files: BatchFile[];
  onRemoveFile: (fileId: string) => void;
  onRetryFile: (fileId: string) => void;
  onCancelFile: (fileId: string) => void;
  onClearCompleted: () => void;
  onClearAll: () => void;
  isProcessing: boolean;
}

/**
 * Get icon component for file status
 */
function getStatusIcon(status: FileStatus) {
  switch (status) {
    case 'pending':
      return <Clock className="w-4 h-4 text-gray-400" />;
    case 'processing':
      return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />;
    case 'completed':
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    case 'error':
      return <AlertCircle className="w-4 h-4 text-red-500" />;
    case 'cancelled':
      return <X className="w-4 h-4 text-yellow-500" />;
  }
}

/**
 * Format file size for display
 */
function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Progress bar component
 */
function ProgressBar({ progress }: { progress: number }) {
  return (
    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
      <div
        className="bg-primary h-1.5 rounded-full transition-all duration-300"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

/**
 * Single file item in the queue
 */
function FileQueueItem({
  file,
  onRemove,
  onRetry,
  onCancel,
  isProcessing,
}: {
  file: BatchFile;
  onRemove: () => void;
  onRetry: () => void;
  onCancel: () => void;
  isProcessing: boolean;
}) {
  const canRetry = file.status === 'error' || file.status === 'cancelled';
  const canCancel = file.status === 'pending' && isProcessing;
  const canRemove = !isProcessing || file.status === 'completed' || file.status === 'error' || file.status === 'cancelled';

  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-lg border ${
        file.status === 'error'
          ? 'bg-red-50 border-red-200'
          : file.status === 'completed'
          ? 'bg-green-50 border-green-200'
          : file.status === 'processing'
          ? 'bg-blue-50 border-blue-200'
          : 'bg-gray-50 border-gray-200'
      }`}
    >
      {/* File icon */}
      <div className="flex-shrink-0">
        <FileText className="w-5 h-5 text-gray-500" />
      </div>

      {/* File info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-gray-900 truncate">
            {file.file.name}
          </p>
          <span className="text-xs text-gray-500">
            ({formatFileSize(file.file.size)})
          </span>
        </div>

        {/* Status and progress */}
        <div className="flex items-center gap-2 mt-1">
          {getStatusIcon(file.status)}
          <span className={`text-xs ${getStatusColor(file.status)}`}>
            {getStatusText(file.status)}
          </span>
          {file.stats && (
            <span className="text-xs text-gray-500">
              - {file.stats.total} Transaktionen
            </span>
          )}
        </div>

        {/* Error message */}
        {file.error && (
          <p className="text-xs text-red-600 mt-1 truncate" title={file.error}>
            {file.error}
          </p>
        )}

        {/* Progress bar */}
        {file.status === 'processing' && (
          <ProgressBar progress={file.progress} />
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1">
        {canRetry && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onRetry}
            className="h-7 w-7 p-0"
            title="Erneut versuchen"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        )}
        {canCancel && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="h-7 w-7 p-0 hover:text-yellow-600"
            title="Abbrechen"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
        {canRemove && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onRemove}
            className="h-7 w-7 p-0 hover:text-red-600"
            title="Entfernen"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

export function FileQueue({
  files,
  onRemoveFile,
  onRetryFile,
  onCancelFile,
  onClearCompleted,
  onClearAll,
  isProcessing,
}: FileQueueProps) {
  const handleRemove = useCallback(
    (fileId: string) => () => onRemoveFile(fileId),
    [onRemoveFile]
  );

  const handleRetry = useCallback(
    (fileId: string) => () => onRetryFile(fileId),
    [onRetryFile]
  );

  const handleCancel = useCallback(
    (fileId: string) => () => onCancelFile(fileId),
    [onCancelFile]
  );

  const completedCount = files.filter((f) => f.status === 'completed').length;
  const errorCount = files.filter((f) => f.status === 'error').length;
  const pendingCount = files.filter((f) => f.status === 'pending').length;
  const processingCount = files.filter((f) => f.status === 'processing').length;

  if (files.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">
            Dateiwarteschlange ({files.length})
          </CardTitle>
          <div className="flex items-center gap-2">
            {completedCount > 0 && !isProcessing && (
              <Button
                variant="outline"
                size="sm"
                onClick={onClearCompleted}
                className="text-xs"
              >
                Abgeschlossene entfernen
              </Button>
            )}
            {files.length > 0 && !isProcessing && (
              <Button
                variant="outline"
                size="sm"
                onClick={onClearAll}
                className="text-xs text-red-600 hover:text-red-700"
              >
                Alle entfernen
              </Button>
            )}
          </div>
        </div>

        {/* Summary */}
        <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
          {completedCount > 0 && (
            <span className="flex items-center gap-1">
              <CheckCircle className="w-3 h-3 text-green-500" />
              {completedCount} abgeschlossen
            </span>
          )}
          {processingCount > 0 && (
            <span className="flex items-center gap-1">
              <Loader2 className="w-3 h-3 text-blue-500 animate-spin" />
              {processingCount} in Bearbeitung
            </span>
          )}
          {pendingCount > 0 && (
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-gray-400" />
              {pendingCount} wartend
            </span>
          )}
          {errorCount > 0 && (
            <span className="flex items-center gap-1">
              <AlertCircle className="w-3 h-3 text-red-500" />
              {errorCount} fehlgeschlagen
            </span>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-2 max-h-80 overflow-y-auto">
          {files.map((file) => (
            <FileQueueItem
              key={file.id}
              file={file}
              onRemove={handleRemove(file.id)}
              onRetry={handleRetry(file.id)}
              onCancel={handleCancel(file.id)}
              isProcessing={isProcessing}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
