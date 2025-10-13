'use client';

import { useState, useCallback } from 'react';
import { FileUpload } from '@/components/file-upload';
import { StatsCard } from '@/components/stats-card';
import { ErrorAlert } from '@/components/error-alert';
import { SuccessMessage } from '@/components/success-message';
import { EvelanBadge } from '@/components/evelan-badge';
import { parseWiseCSV, generateLexOfficeCSV, downloadCSV, generateFilename } from '@/lib/csv-utils';
import { convertWiseToLexOffice, calculateStats } from '@/lib/converter';
import type { ConversionStats } from '@/lib/converter';

type AppStatus = 'idle' | 'processing' | 'success' | 'error';

interface AppState {
  status: AppStatus;
  file: File | null;
  error: string | null;
  stats: ConversionStats | null;
}

export default function ConverterPage() {
  const [state, setState] = useState<AppState>({
    status: 'idle',
    file: null,
    error: null,
    stats: null,
  });

  const handleFileError = useCallback((error: string) => {
    setState({
      status: 'error',
      file: null,
      error,
      stats: null,
    });
  }, []);

  const handleFileSelect = useCallback(async (file: File) => {
    // Reset state and start processing
    setState({
      status: 'processing',
      file,
      error: null,
      stats: null,
    });

    try {
      // Read file content
      const text = await file.text();

      // Parse Wise CSV
      const wiseData = parseWiseCSV(text);

      // Convert to LexOffice format
      const lexOfficeData = convertWiseToLexOffice(wiseData);

      if (lexOfficeData.length === 0) {
        throw new Error('Keine gültigen Transaktionen zum Konvertieren gefunden.');
      }

      // Generate CSV content
      const csvContent = generateLexOfficeCSV(lexOfficeData);

      // Auto-download
      const filename = generateFilename();
      downloadCSV(csvContent, filename);

      // Calculate statistics
      const stats = calculateStats(wiseData);

      // Update state to success
      setState({
        status: 'success',
        file,
        error: null,
        stats,
      });
    } catch (error) {
      console.error('Conversion error:', error);
      setState({
        status: 'error',
        file,
        error: error instanceof Error ? error.message : 'Ein unbekannter Fehler ist aufgetreten.',
        stats: null,
      });
    }
  }, []);

  const handleReset = useCallback(() => {
    setState({
      status: 'idle',
      file: null,
      error: null,
      stats: null,
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            WISE zu Lexware Office Konverter
          </h1>
          <p className="text-lg text-gray-600 mb-2">
            Wandeln Sie Wise CSV-Exporte in das Lexware Office Bankimport-Format um
          </p>
          <p className="text-sm text-gray-500 mb-4">
            Für Lexware Office: Banking → Konten → Transaktionen importieren
          </p>
          <div className="flex items-center justify-center gap-4 text-sm">
            <span className="text-green-600 font-medium">
              ✓ 100% Datenschutz
            </span>
            <span className="text-gray-300">•</span>
            <span className="text-green-600 font-medium">
              ✓ Keine Server-Uploads
            </span>
            <span className="text-gray-300">•</span>
            <a
              href="/hilfe"
              className="text-primary hover:text-primary/80 font-medium transition-colors underline"
            >
              📖 Anleitung ansehen
            </a>
          </div>
        </header>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Info Box */}
          {state.status === 'idle' && (
            <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">
                    So funktioniert&apos;s
                  </h3>
                  <ol className="list-decimal list-inside space-y-1 text-blue-800 text-sm">
                    <li>Laden Sie Ihre Wise CSV-Exportdatei hoch (max. 5 MB)</li>
                    <li>Die Datei wird automatisch validiert und konvertiert</li>
                    <li>Die konvertierte Datei wird automatisch heruntergeladen</li>
                    <li>Importieren Sie die Datei in Lexware Office unter <strong>Banking → Konten → Transaktionen importieren</strong></li>
                  </ol>
                  <p className="mt-3 text-xs text-blue-700">
                    <strong>Hinweis:</strong> Lexware Office prüft nicht auf Duplikate. Stellen Sie sicher, dass Sie nur neue Transaktionen importieren.{' '}
                    <a href="/hilfe" className="underline hover:text-blue-900">Mehr erfahren</a>
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
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
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

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
          <div className="flex flex-col items-center gap-4">
            <EvelanBadge />
            <p>
              Ihre Daten werden nicht hochgeladen oder gespeichert. Die gesamte Verarbeitung erfolgt lokal in Ihrem Browser.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
