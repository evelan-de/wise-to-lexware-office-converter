// File size limits
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
export const MAX_FILE_SIZE_MB = 5;

export const LEXOFFICE_HEADERS = [
  'Buchungstag',
  'Valuta',
  'Auftraggeber/Zahlungsempfänger',
  'Empfänger/Zahlungspflichtiger',
  'Vorgang/Verwendungszweck',
  'Betrag',
  'Zusatzinfo (optional)',
] as const;

// Required headers for validation
export const REQUIRED_WISE_HEADERS = [
  'TransferWise ID',
  'Date',
  'Amount',
  'Transaction Type',
] as const;

// Error messages in German for UX consistency
export const ERROR_MESSAGES = {
  // File validation errors
  INVALID_FILE_TYPE: 'Bitte wählen Sie eine CSV-Datei aus.',
  FILE_TOO_LARGE: `Datei ist zu groß. Maximale Größe: ${MAX_FILE_SIZE_MB} MB`,
  EMPTY_FILE: 'Die Datei enthält keine Transaktionen',

  // CSV parsing errors
  TOO_MANY_COLUMNS: 'Die CSV-Datei enthält zu viele Spalten. Bitte stellen Sie sicher, dass Sie eine unveränderte Wise-Exportdatei verwenden.',
  TOO_FEW_COLUMNS: 'Die CSV-Datei enthält zu wenige Spalten. Bitte stellen Sie sicher, dass Sie eine vollständige Wise-Exportdatei verwenden.',
  INVALID_CSV_FORMAT: 'Die CSV-Datei hat ein ungültiges Format. Möglicherweise wurde die Datei verändert oder ist beschädigt.',

  // Conversion errors
  NO_VALID_TRANSACTIONS: 'Keine gültigen Transaktionen zum Konvertieren gefunden.',
  UNKNOWN_ERROR: 'Ein unbekannter Fehler ist aufgetreten.',
} as const;

/**
 * Generate error message for missing headers
 */
export function getMissingHeadersError(missingHeaders: readonly string[]): string {
  const missingHeadersList = missingHeaders.map((h) => `"${h}"`).join(', ');
  return `Die CSV-Datei ist keine gültige Wise-Exportdatei. Folgende erforderliche Spalten fehlen: ${missingHeadersList}. Bitte exportieren Sie die Daten direkt aus Ihrem Wise-Konto.`;
}

/**
 * Generate error message for generic CSV read errors
 */
export function getCSVReadError(message: string): string {
  return `Die CSV-Datei konnte nicht gelesen werden: ${message || 'Unbekannter Fehler'}. Bitte prüfen Sie, ob es sich um eine gültige Wise-Exportdatei handelt.`;
}

// Account holder constant for German format
export const ACCOUNT_HOLDER = 'Kontoinhaber' as const;
