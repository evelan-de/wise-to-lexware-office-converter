'use client';

import { useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Play, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ErrorAlert } from '@/components/error-alert';
import { SuccessMessage } from '@/components/success-message';
import { BatchUpload, FileQueue, MergeSettings, BatchStatsCard } from '@/components/batch';
import { generateLexOfficeCSV, downloadCSV, generateFilename } from '@/lib/csv-utils';
import { trackFileUpload, trackConversionSuccess, trackConversionError } from '@/lib/analytics';
import { ERROR_MESSAGES } from '@/lib/constants';
import {
  type BatchFile,
  type BatchStats,
  type BatchProcessingOptions,
  type FileStatus,
  type FileProcessingResult,
  DEFAULT_BATCH_OPTIONS,
  createBatchFile,
  processFilesInParallel,
  mergeResults,
  calculateBatchStats,
} from '@/lib/batch-processor';

type BatchStatus = 'idle' | 'processing' | 'success' | 'error';

interface BatchState {
  status: BatchStatus;
  files: BatchFile[];
  error: string | null;
  stats: BatchStats | null;
  options: BatchProcessingOptions;
  mergedCSV: string | null;
}

export default function BatchConverterPage() {
  const [state, setState] = useState<BatchState>({
    status: 'idle',
    files: [],
    error: null,
    stats: null,
    options: DEFAULT_BATCH_OPTIONS,
    mergedCSV: null,
  });
  const processingRef = useRef(false);

  const handleFilesSelect = useCallback((newFiles: File[]) => {
    const batchFiles = newFiles.map(createBatchFile);
    setState((prev) => ({
      ...prev,
      files: [...prev.files, ...batchFiles],
      error: null,
    }));
  }, []);

  const handleError = useCallback((error: string) => {
    setState((prev) => ({
      ...prev,
      error,
    }));
  }, []);

  const handleRemoveFile = useCallback((fileId: string) => {
    setState((prev) => ({
      ...prev,
      files: prev.files.filter((f) => f.id !== fileId),
    }));
  }, []);

  const handleRetryFile = useCallback((fileId: string) => {
    setState((prev) => ({
      ...prev,
      files: prev.files.map((f) =>
        f.id === fileId ? { ...f, status: 'pending' as FileStatus, error: undefined, progress: 0 } : f
      ),
    }));
  }, []);

  const handleCancelFile = useCallback((fileId: string) => {
    setState((prev) => ({
      ...prev,
      files: prev.files.map((f) =>
        f.id === fileId ? { ...f, status: 'cancelled' as FileStatus } : f
      ),
    }));
  }, []);

  const handleClearCompleted = useCallback(() => {
    setState((prev) => ({
      ...prev,
      files: prev.files.filter((f) => f.status !== 'completed'),
    }));
  }, []);

  const handleClearAll = useCallback(() => {
    setState((prev) => ({
      ...prev,
      files: [],
      status: 'idle',
      stats: null,
      mergedCSV: null,
    }));
  }, []);

  const handleOptionsChange = useCallback((options: BatchProcessingOptions) => {
    setState((prev) => ({
      ...prev,
      options,
    }));
  }, []);

  const handleProgressUpdate = useCallback(
    (fileId: string, progress: number, status: FileStatus, result?: FileProcessingResult) => {
      setState((prev) => ({
        ...prev,
        files: prev.files.map((f) =>
          f.id === fileId
            ? {
                ...f,
                status,
                progress,
                error: result?.error,
                wiseData: result?.wiseData,
                lexOfficeData: result?.lexOfficeData,
                stats: result?.stats,
                processedAt: status === 'completed' ? new Date() : undefined,
              }
            : f
        ),
      }));
    },
    []
  );

  const handleStartProcessing = useCallback(async () => {
    if (processingRef.current) return;
    processingRef.current = true;

    const pendingFiles = state.files.filter(
      (f) => f.status === 'pending' || f.status === 'error'
    );

    if (pendingFiles.length === 0) {
      handleError(ERROR_MESSAGES.NO_FILES_SELECTED);
      processingRef.current = false;
      return;
    }

    setState((prev) => ({
      ...prev,
      status: 'processing',
      error: null,
    }));

    // Track file uploads
    pendingFiles.forEach((f) => trackFileUpload(f.file.size));

    try {
      // Process files
      const results = await processFilesInParallel(
        pendingFiles,
        state.options,
        handleProgressUpdate
      );

      // Convert results to array
      const resultsArray = Array.from(results.values());
      const successfulResults = resultsArray.filter((r) => r.success);

      if (successfulResults.length === 0) {
        trackConversionError('all-files-failed');
        setState((prev) => ({
          ...prev,
          status: 'error',
          error: ERROR_MESSAGES.ALL_FILES_FAILED,
        }));
        processingRef.current = false;
        return;
      }

      // Merge results
      const { mergedData, duplicatesRemoved } = mergeResults(
        successfulResults,
        state.options
      );

      if (mergedData.length === 0) {
        trackConversionError('no-valid-transactions');
        setState((prev) => ({
          ...prev,
          status: 'error',
          error: ERROR_MESSAGES.NO_VALID_TRANSACTIONS,
        }));
        processingRef.current = false;
        return;
      }

      // Generate CSV
      const csvContent = generateLexOfficeCSV(mergedData);

      // Calculate batch stats
      const batchStats = calculateBatchStats(resultsArray, duplicatesRemoved);

      // Track success
      trackConversionSuccess(batchStats.totalTransactions);

      // Auto-download
      const filename = generateFilename();
      downloadCSV(csvContent, filename);

      setState((prev) => ({
        ...prev,
        status: 'success',
        stats: batchStats,
        mergedCSV: csvContent,
        error:
          resultsArray.length !== successfulResults.length
            ? ERROR_MESSAGES.SOME_FILES_FAILED
            : null,
      }));
    } catch (error) {
      trackConversionError('batch-processing-failed');
      setState((prev) => ({
        ...prev,
        status: 'error',
        error:
          error instanceof Error
            ? error.message
            : ERROR_MESSAGES.BATCH_PROCESSING_FAILED,
      }));
    }

    processingRef.current = false;
  }, [state.files, state.options, handleProgressUpdate, handleError]);

  const handleDownloadAgain = useCallback(() => {
    if (state.mergedCSV) {
      const filename = generateFilename();
      downloadCSV(state.mergedCSV, filename);
    }
  }, [state.mergedCSV]);

  const handleReset = useCallback(() => {
    setState({
      status: 'idle',
      files: [],
      error: null,
      stats: null,
      options: DEFAULT_BATCH_OPTIONS,
      mergedCSV: null,
    });
  }, []);

  const currentTotalSize = state.files.reduce((sum, f) => sum + f.file.size, 0);
  const hasFilesToProcess = state.files.some(
    (f) => f.status === 'pending' || f.status === 'error'
  );
  const isProcessing = state.status === 'processing';

  return (
    <>
      {/* Header */}
      <header className="text-center mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Zurück zur Einzeldatei-Konvertierung
        </Link>
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          Stapelverarbeitung
        </h1>
        <p className="text-lg text-gray-600 mb-2">
          Mehrere Wise CSV-Dateien auf einmal konvertieren und zusammenführen
        </p>
        <div className="flex items-center justify-center gap-4 text-sm">
          <span className="text-green-600 font-medium">
            Automatische Duplikaterkennung
          </span>
          <span className="text-gray-300">|</span>
          <span className="text-green-600 font-medium">
            Chronologische Sortierung
          </span>
        </div>
      </header>

      {/* Main Content */}
      <div className="space-y-6">
        {/* Info Box - Only when idle and no files */}
        {state.status === 'idle' && state.files.length === 0 && (
          <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-blue-900 mb-2">
                  So funktioniert die Stapelverarbeitung
                </h3>
                <ol className="list-decimal list-inside space-y-1 text-blue-800 text-sm">
                  <li>
                    Laden Sie mehrere Wise CSV-Exportdateien gleichzeitig hoch
                  </li>
                  <li>
                    Passen Sie die Zusammenführungsoptionen nach Bedarf an
                  </li>
                  <li>
                    Starten Sie die Verarbeitung - alle Dateien werden konvertiert
                  </li>
                  <li>
                    Die zusammengeführte Datei wird automatisch heruntergeladen
                  </li>
                </ol>
                <p className="mt-3 text-xs text-blue-700">
                  <strong>Tipp:</strong> Duplikate werden automatisch erkannt und
                  entfernt, basierend auf der eindeutigen Wise-Transaktions-ID.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* File Upload */}
        <BatchUpload
          onFilesSelect={handleFilesSelect}
          onError={handleError}
          isProcessing={isProcessing}
          currentFileCount={state.files.length}
          currentTotalSize={currentTotalSize}
        />

        {/* Error Alert */}
        {state.error && (
          <ErrorAlert
            message={state.error}
            onDismiss={() => setState((prev) => ({ ...prev, error: null }))}
          />
        )}

        {/* File Queue */}
        <FileQueue
          files={state.files}
          onRemoveFile={handleRemoveFile}
          onRetryFile={handleRetryFile}
          onCancelFile={handleCancelFile}
          onClearCompleted={handleClearCompleted}
          onClearAll={handleClearAll}
          isProcessing={isProcessing}
        />

        {/* Merge Settings - Only when files are added */}
        {state.files.length > 0 && state.status !== 'success' && (
          <MergeSettings
            options={state.options}
            onOptionsChange={handleOptionsChange}
            disabled={isProcessing}
          />
        )}

        {/* Start Processing Button */}
        {hasFilesToProcess && !isProcessing && state.status !== 'success' && (
          <div className="flex justify-center pt-2">
            <Button
              onClick={handleStartProcessing}
              size="lg"
              className="px-8 py-3 text-lg"
            >
              <Play className="w-5 h-5 mr-2" />
              Verarbeitung starten ({state.files.filter((f) => f.status === 'pending' || f.status === 'error').length} Dateien)
            </Button>
          </div>
        )}

        {/* Success Message */}
        {state.status === 'success' && <SuccessMessage />}

        {/* Batch Statistics */}
        {state.status === 'success' && state.stats && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Stapelverarbeitungsstatistik
            </h2>
            <BatchStatsCard stats={state.stats} />
          </div>
        )}

        {/* Action Buttons */}
        {state.status === 'success' && (
          <div className="flex justify-center gap-4 pt-4">
            <Button onClick={handleDownloadAgain} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Erneut herunterladen
            </Button>
            <Button onClick={handleReset}>
              Neue Stapelverarbeitung starten
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
