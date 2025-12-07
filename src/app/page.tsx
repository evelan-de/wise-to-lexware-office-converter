'use client';

import { useState, useCallback, useRef } from 'react';
import { FileUpload } from '@/components/file-upload';
import { StatsCard } from '@/components/stats-card';
import { ErrorAlert } from '@/components/error-alert';
import { SuccessMessage } from '@/components/success-message';
import { PreviewContainer } from '@/components/preview/preview-container';
import { HeroSection } from '@/components/hero-section';
import { HowItWorks } from '@/components/how-it-works';
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
      <HeroSection />

        {/* Main Content */}
        <div className="space-y-6">
          {/* How It Works */}
          {state.status === 'idle' && <HowItWorks />}

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
                className="px-6 py-3 rounded-lg font-semibold transition-all duration-300 btn-evelan-gradient"
              >
                Neue Konvertierung starten
              </button>
            </div>
          )}
        </div>
    </>
  );
}
