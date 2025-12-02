'use client';

import { useState, useCallback, useRef } from 'react';
import { FileUpload } from '@/components/file-upload';
import { StatsCard } from '@/components/stats-card';
import { ErrorAlert } from '@/components/error-alert';
import { SuccessMessage } from '@/components/success-message';
import { PreviewContainer } from '@/components/preview/preview-container';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { parseWiseCSV } from '@/lib/csv-utils';
import { calculateStats } from '@/lib/converter';
import { trackFileUpload, trackConversionSuccess, trackConversionError } from '@/lib/analytics';
import { ERROR_MESSAGES } from '@/lib/constants';
import type { ConversionStats, WiseRow } from '@/lib/converter';

// Timeout for file processing (30 seconds)
const PROCESSING_TIMEOUT_MS = 30000;

type AppStatus = 'idle' | 'processing' | 'preview' | 'success' | 'error';

interface AppState {
  status: AppStatus;
  file: File | null;
  error: string | null;
  stats: ConversionStats | null;
  wiseData: WiseRow[];
}

/**
 * Categorize error type for privacy-friendly analytics
 * (no personal/financial data, only error categories)
 */
function getErrorType(errorMessage: string): string {
  const msg = errorMessage.toLowerCase();

  if (msg.includes('spalten fehlen') || msg.includes('header')) return 'missing-columns';
  if (msg.includes('validierung') || msg.includes('ungültig')) return 'validation-error';
  if (msg.includes('parse') || msg.includes('format')) return 'parse-error';
  if (msg.includes('keine') && msg.includes('transaktionen')) return 'empty-file';
  if (msg.includes('zu viele') || msg.includes('zu wenige')) return 'column-count-error';
  if (msg.includes('delimiter')) return 'delimiter-error';

  return 'unknown-error';
}

export default function ConverterPage() {
  const [state, setState] = useState<AppState>({
    status: 'idle',
    file: null,
    error: null,
    stats: null,
    wiseData: [],
  });
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleFileError = useCallback((error: string) => {
    setState({
      status: 'error',
      file: null,
      error,
      stats: null,
      wiseData: [],
    });
  }, []);

  const handleFileSelect = useCallback(async (file: File) => {
    // Reset state and start processing
    setState({
      status: 'processing',
      file,
      error: null,
      stats: null,
      wiseData: [],
    });

    // Set up timeout for long-running operations
    const timeoutPromise = new Promise<never>((_, reject) => {
      timeoutRef.current = setTimeout(() => {
        reject(new Error('Die Verarbeitung hat zu lange gedauert. Bitte versuchen Sie es mit einer kleineren Datei.'));
      }, PROCESSING_TIMEOUT_MS);
    });

    try {
      // Race between actual processing and timeout
      await Promise.race([
        (async () => {
          // Read file content
          const text = await file.text();

          // Track file upload (privacy-friendly - only file size category)
          trackFileUpload(file.size);

          // Parse Wise CSV
          const wiseData = parseWiseCSV(text);

          if (wiseData.length === 0) {
            throw new Error(ERROR_MESSAGES.EMPTY_FILE);
          }

          // Clear timeout on success
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }

          // Update state to preview mode
          setState({
            status: 'preview',
            file,
            error: null,
            stats: null,
            wiseData,
          });
        })(),
        timeoutPromise,
      ]);
    } catch (error) {
      // Clear timeout on error
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Track conversion error (only error type, no personal data)
      const errorMessage = error instanceof Error ? error.message : 'unknown';
      const errorType = getErrorType(errorMessage);
      trackConversionError(errorType);

      setState({
        status: 'error',
        file,
        error: error instanceof Error ? error.message : ERROR_MESSAGES.UNKNOWN_ERROR,
        stats: null,
        wiseData: [],
      });
    }
  }, []);

  const handleDataChange = useCallback((newData: WiseRow[]) => {
    setState((prev) => ({
      ...prev,
      wiseData: newData,
    }));
  }, []);

  const handleConvert = useCallback(() => {
    // Calculate statistics
    const stats = calculateStats(state.wiseData);

    // Track successful conversion (privacy-friendly - only transaction count category)
    trackConversionSuccess(stats.total);

    // Update state to success
    setState((prev) => ({
      ...prev,
      status: 'success',
      stats,
    }));
  }, [state.wiseData]);

  const handleReset = useCallback(() => {
    // Clear any pending timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setState({
      status: 'idle',
      file: null,
      error: null,
      stats: null,
      wiseData: [],
    });
  }, []);

  const handleCancelPreview = useCallback(() => {
    handleReset();
  }, [handleReset]);

  // Preview mode - show the preview container
  if (state.status === 'preview') {
    return (
      <PreviewContainer
        wiseData={state.wiseData}
        onDataChange={handleDataChange}
        onConvert={handleConvert}
        onCancel={handleCancelPreview}
      />
    );
  }

  return (
    <>
      {/* Theme Switcher */}
      <div className="absolute top-4 right-4">
        <ThemeSwitcher />
      </div>

      {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-3">
            WISE zu Lexware Office Konverter
          </h1>
          <p className="text-lg text-foreground mb-2">
            Wandeln Sie Wise CSV-Exporte in das Lexware Office Bankimport-Format um
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            Für Lexware Office: Banking → Konten → Transaktionen importieren
          </p>
          <div className="flex items-center justify-center gap-4 text-sm">
            <span className="text-green-600 dark:text-green-400 font-medium">
              ✓ 100% Datenschutz
            </span>
            <span className="text-muted-foreground/50">•</span>
            <span className="text-green-600 dark:text-green-400 font-medium">
              ✓ Keine Server-Uploads
            </span>
            <span className="text-muted-foreground/50">•</span>
            <a
              href="/hilfe"
              className="text-primary hover:text-primary/80 font-medium transition-colors underline"
            >
              Anleitung ansehen
            </a>
          </div>
        </header>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Info Box */}
          {state.status === 'idle' && (
            <div className="bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-200 dark:border-blue-800 p-6">
              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                    So funktioniert&apos;s
                  </h3>
                  <ol className="list-decimal list-inside space-y-1 text-blue-800 dark:text-blue-200 text-sm">
                    <li>Laden Sie Ihre Wise CSV-Exportdatei hoch (max. 5 MB)</li>
                    <li><strong>Neu:</strong> Vorschau und Validierung Ihrer Daten</li>
                    <li>Bearbeiten Sie fehlerhafte Transaktionen direkt</li>
                    <li>Vergleichen Sie Quell- und Zielformat</li>
                    <li>Laden Sie die konvertierte Datei herunter</li>
                  </ol>
                  <p className="mt-3 text-xs text-blue-700 dark:text-blue-300">
                    <strong>Hinweis:</strong> Lexware Office prüft nicht auf Duplikate. Stellen Sie sicher, dass Sie nur neue Transaktionen importieren.{' '}
                    <a href="/hilfe" className="underline hover:text-blue-900 dark:hover:text-blue-100">Mehr erfahren</a>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* File Upload */}
          <FileUpload
            onFileSelect={handleFileSelect}
            onError={handleFileError}
            isProcessing={state.status === 'processing'}
          />

          {/* Error Alert */}
          {state.status === 'error' && state.error && (
            <ErrorAlert message={state.error} onDismiss={handleReset} />
          )}

          {/* Success Message */}
          {state.status === 'success' && <SuccessMessage />}

          {/* Statistics */}
          {state.status === 'success' && state.stats && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                Konvertierungsstatistik
              </h2>
              <StatsCard stats={state.stats} />
            </div>
          )}

          {/* Reset/New Conversion Button */}
          {(state.status === 'success' || state.status === 'error') && (
            <div className="flex justify-center pt-4">
              <button
                onClick={handleReset}
                className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                Neue Konvertierung starten
              </button>
            </div>
          )}
        </div>
    </>
  );
}
