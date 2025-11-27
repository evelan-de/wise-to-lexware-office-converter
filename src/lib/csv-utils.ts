import Papa from 'papaparse';
import type { WiseRow, LexOfficeRow } from './converter';
import {
  REQUIRED_WISE_HEADERS,
  LEXOFFICE_HEADERS,
  ERROR_MESSAGES,
  getMissingHeadersError,
  getCSVReadError,
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
    // Provide user-friendly error messages based on error type
    const firstError = result.errors[0];
    const errorCode = firstError.code;

    // Check for field count errors
    if (errorCode === 'TooManyFields') {
      throw new Error(ERROR_MESSAGES.TOO_MANY_COLUMNS);
    }

    if (errorCode === 'TooFewFields') {
      throw new Error(ERROR_MESSAGES.TOO_FEW_COLUMNS);
    }

    // Check for delimiter and quote errors (different type in Papaparse)
    if (
      errorCode === 'UndetectableDelimiter' ||
      errorCode === 'MissingQuotes' ||
      errorCode === 'InvalidQuotes'
    ) {
      throw new Error(ERROR_MESSAGES.INVALID_CSV_FORMAT);
    }

    // Generic error message for other parsing issues
    throw new Error(getCSVReadError(firstError.message));
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
    throw new Error(getMissingHeadersError(missingHeaders));
  }
}

/**
 * Generate CSV content from LexOffice data
 */
export function generateLexOfficeCSV(data: LexOfficeRow[]): string {
  return Papa.unparse(data, {
    columns: [...LEXOFFICE_HEADERS], // Spread to convert readonly tuple to string[]
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
