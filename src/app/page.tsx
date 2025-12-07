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
      <div className="absolute top-4 right-4 z-10">
        <ThemeSwitcher />
      </div>

      {/* Hero Section */}
      <header className="relative text-center mb-16 pt-8">
        {/* Animated gradient background blur */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full blur-3xl opacity-20 dark:opacity-15 animate-gradient animate-pulse-glow" />
          <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full blur-3xl opacity-15 dark:opacity-10 animate-gradient" style={{ animationDelay: '2s' }} />
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-primary/10 dark:bg-primary/20 border border-primary/20 dark:border-primary/30 animate-float">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          <span className="text-sm font-medium text-primary">Kostenlos & Open Source</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight mb-6">
          <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 dark:from-indigo-400 dark:via-purple-400 dark:to-indigo-400 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
            WISE
          </span>
          <span className="text-foreground"> zu </span>
          <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 dark:from-purple-400 dark:via-pink-400 dark:to-purple-400 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
            Lexware Office
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-xl sm:text-2xl text-muted-foreground mb-4 max-w-2xl mx-auto">
          CSV-Konverter für Bankimport
        </p>
        <p className="text-base text-muted-foreground/80 mb-8">
          Banking → Konten → Transaktionen importieren
        </p>

        {/* Trust Badges */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <div className="animate-float inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800">
            <svg className="w-4 h-4 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
            <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">100% Datenschutz</span>
          </div>

          <div className="animate-float-delayed inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800">
            <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" />
            </svg>
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Keine Server-Uploads</span>
          </div>

          <a
            href="/hilfe"
            className="animate-float inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-50 dark:bg-violet-950/50 border border-violet-200 dark:border-violet-800 hover:bg-violet-100 dark:hover:bg-violet-900/50 transition-colors"
            style={{ animationDelay: '0.25s' }}
          >
            <svg className="w-4 h-4 text-violet-600 dark:text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
            </svg>
            <span className="text-sm font-medium text-violet-700 dark:text-violet-300">Anleitung</span>
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
                  <ol className="list-decimal list-outside ml-6 space-y-1 text-blue-800 dark:text-blue-200 text-sm">
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
