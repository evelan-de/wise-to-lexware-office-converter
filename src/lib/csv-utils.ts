import Papa from 'papaparse';
import type { WiseRow, LexOfficeRow } from './converter';
import {
  REQUIRED_WISE_HEADERS,
  LEXOFFICE_HEADERS,
  ERROR_MESSAGES,
} from './constants';

/**
 * Parse CSV file content and validate headers
 */
export function parseWiseCSV(csvContent: string): WiseRow[] {
  // Remove UTF-8 BOM if present (Excel sometimes adds this)
  const cleanContent = csvContent.replace(/^\uFEFF/, '');

  const result = Papa.parse<WiseRow>(cleanContent, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header: string) => {
      // Trim whitespace from headers
      return header.trim();
    },
  });

  if (result.errors.length > 0) {
    console.error('CSV parsing errors:', result.errors);

    // Provide user-friendly error messages based on error type
    const firstError = result.errors[0];
    const errorCode = firstError.code;

    // Check for field count errors
    if (errorCode === 'TooManyFields') {
      throw new Error(
        'Die CSV-Datei enthält zu viele Spalten. Bitte stellen Sie sicher, dass Sie eine unveränderte Wise-Exportdatei verwenden.'
      );
    }

    if (errorCode === 'TooFewFields') {
      throw new Error(
        'Die CSV-Datei enthält zu wenige Spalten. Bitte stellen Sie sicher, dass Sie eine vollständige Wise-Exportdatei verwenden.'
      );
    }

    // Check for delimiter and quote errors (different type in Papaparse)
    if (
      errorCode === 'UndetectableDelimiter' ||
      errorCode === 'MissingQuotes' ||
      errorCode === 'InvalidQuotes'
    ) {
      throw new Error(
        'Die CSV-Datei hat ein ungültiges Format. Möglicherweise wurde die Datei verändert oder ist beschädigt.'
      );
    }

    // Generic error message for other parsing issues
    throw new Error(
      `Die CSV-Datei konnte nicht gelesen werden: ${firstError.message || 'Unbekannter Fehler'}. Bitte prüfen Sie, ob es sich um eine gültige Wise-Exportdatei handelt.`
    );
  }

  if (!result.data || result.data.length === 0) {
    throw new Error(ERROR_MESSAGES.EMPTY_FILE);
  }

  // Validate headers
  const headers = result.meta.fields || [];
  validateWiseHeaders(headers);

  return result.data;
}

/**
 * Validate that CSV has required Wise headers
 */
function validateWiseHeaders(headers: string[]): void {
  const missingHeaders = REQUIRED_WISE_HEADERS.filter(
    (required) => !headers.includes(required)
  );

  if (missingHeaders.length > 0) {
    console.error('Missing required headers:', missingHeaders);
    console.error('Found headers:', headers);

    // Provide detailed error message
    const missingHeadersList = missingHeaders.map((h) => `"${h}"`).join(', ');
    throw new Error(
      `Die CSV-Datei ist keine gültige Wise-Exportdatei. Folgende erforderliche Spalten fehlen: ${missingHeadersList}. Bitte exportieren Sie die Daten direkt aus Ihrem Wise-Konto.`
    );
  }
}

/**
 * Generate CSV content from LexOffice data
 */
export function generateLexOfficeCSV(data: LexOfficeRow[]): string {
  return Papa.unparse(data, {
    columns: LEXOFFICE_HEADERS as unknown as string[],
    delimiter: ';', // LexOffice uses semicolon
    header: true,
    newline: '\r\n', // Windows line endings for better compatibility
  });
}

/**
 * Trigger browser download of CSV file
 */
export function downloadCSV(content: string, filename: string): void {
  // Create blob with UTF-8 BOM for proper Excel encoding
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + content], {
    type: 'text/csv;charset=utf-8;',
  });

  // Create download link
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Clean up
  URL.revokeObjectURL(url);
}

/**
 * Generate a filename for the converted CSV
 */
export function generateFilename(): string {
  const timestamp = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  return `lexoffice_import_${timestamp}.csv`;
}
