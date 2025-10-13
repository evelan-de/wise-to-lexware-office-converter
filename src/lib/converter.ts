import { ACCOUNT_HOLDER } from './constants';

/**
 * Sanitize CSV field to prevent formula injection
 * Escapes fields starting with =, +, -, @, tab, or carriage return
 * These characters can be interpreted as formulas by Excel/LexOffice
 */
function sanitizeCSVField(value: string): string {
  if (!value) return '';

  const trimmed = value.trim();

  // Check if field starts with dangerous characters
  const dangerousChars = ['=', '+', '-', '@', '\t', '\r'];
  if (dangerousChars.some((char) => trimmed.startsWith(char))) {
    // Prefix with single quote to prevent formula execution
    return `'${trimmed}`;
  }

  return trimmed;
}

// Types - Keep close to where they're used
export interface WiseRow {
  'TransferWise ID': string;
  Date: string;
  'Date Time': string;
  Amount: string;
  Currency: string;
  Description: string;
  'Payment Reference': string;
  'Running Balance': string;
  'Exchange From'?: string;
  'Exchange To'?: string;
  'Exchange Rate'?: string;
  'Exchange To Amount'?: string;
  'Payer Name'?: string;
  'Payee Name'?: string;
  'Payee Account Number'?: string;
  Merchant?: string;
  'Card Last Four Digits'?: string;
  'Card Holder Full Name'?: string;
  Attachment?: string;
  Note?: string;
  'Total fees'?: string;
  'Transaction Type': 'DEBIT' | 'CREDIT';
  'Transaction Details Type': string;
}

export interface LexOfficeRow {
  Buchungstag: string;
  Valuta: string;
  'Auftraggeber/Zahlungsempfänger': string;
  'Empfänger/Zahlungspflichtiger': string;
  'Vorgang/Verwendungszweck': string;
  Betrag: string;
  'Zusatzinfo (optional)': string;
}

export interface ConversionStats {
  total: number;
  debit: number;
  credit: number;
  totalAmount: number;
  currency: string;
}

/**
 * Convert date from Wise format (dd-mm-yyyy) to LexOffice format (dd.mm.yyyy)
 * Uses regex to avoid timezone issues with Date object
 */
export function convertDate(date: string): string {
  if (!date) return '';

  // Match dd-mm-yyyy format
  const match = date.match(/^(\d{2})-(\d{2})-(\d{4})$/);
  if (!match) {
    // If the format doesn't match, return as-is (fail gracefully)
    console.warn(`Invalid date format: ${date}`);
    return date;
  }

  const [, day, month, year] = match;
  return `${day}.${month}.${year}`;
}

/**
 * Convert amount from Wise format (1234.56) to LexOffice format (1234,56)
 * Preserves negative sign and handles edge cases
 */
export function convertAmount(amount: string): string {
  if (!amount) return '0,00';

  // Parse as float and handle NaN
  const num = parseFloat(amount);
  if (isNaN(num)) {
    console.warn(`Invalid amount: ${amount}`);
    return '0,00';
  }

  // Format using German locale (comma as decimal separator, no thousands separator)
  const formatter = new Intl.NumberFormat('de-DE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    useGrouping: false, // No thousands separator for LexOffice
  });

  return formatter.format(num);
}

/**
 * Determine Auftraggeber based on transaction type
 * DEBIT: Kontoinhaber is paying (Auftraggeber)
 * CREDIT: External party is paying (use Payer Name)
 */
function getAuftraggeber(row: WiseRow): string {
  if (row['Transaction Type'] === 'DEBIT') {
    return ACCOUNT_HOLDER;
  }
  return sanitizeCSVField(row['Payer Name'] || '');
}

/**
 * Determine Empfänger based on transaction type
 * DEBIT: External party is receiving (use Payee Name)
 * CREDIT: Kontoinhaber is receiving
 */
function getEmpfaenger(row: WiseRow): string {
  if (row['Transaction Type'] === 'DEBIT') {
    return sanitizeCSVField(row['Payee Name'] || '');
  }
  return ACCOUNT_HOLDER;
}

/**
 * Build Verwendungszweck from Description and Payment Reference
 * Format: "Description | Ref: Payment Reference"
 */
function buildVerwendungszweck(row: WiseRow): string {
  const parts: string[] = [];

  if (row.Description) {
    parts.push(sanitizeCSVField(row.Description));
  }

  if (row['Payment Reference']) {
    parts.push(`Ref: ${sanitizeCSVField(row['Payment Reference'])}`);
  }

  return parts.join(' | ');
}

/**
 * Build Zusatzinfo with exchange rate information and Wise ID
 * Format: "Fremdbetrag: 1234,56 USD | Wise ID: TRANSFER-123"
 */
function buildZusatzinfo(row: WiseRow): string {
  const parts: string[] = [];

  // Add exchange information if present
  if (row['Exchange To Amount'] && row['Exchange To']) {
    const exchangeAmount = convertAmount(row['Exchange To Amount']);
    parts.push(`Fremdbetrag: ${exchangeAmount} ${row['Exchange To']}`);
  }

  // Always add Wise ID for traceability
  if (row['TransferWise ID']) {
    parts.push(`Wise ID: ${row['TransferWise ID']}`);
  }

  return parts.join(' | ');
}

/**
 * Validate a single row to ensure required fields are present
 */
export function validateRow(row: WiseRow): string[] {
  const errors: string[] = [];

  if (!row.Date) errors.push('Missing Date');
  if (!row.Amount) errors.push('Missing Amount');
  if (!row['Transaction Type']) errors.push('Missing Transaction Type');
  if (!['DEBIT', 'CREDIT'].includes(row['Transaction Type'])) {
    errors.push(`Invalid Transaction Type: ${row['Transaction Type']}`);
  }

  return errors;
}

/**
 * Main conversion function: Transform Wise data to LexOffice format
 */
export function convertWiseToLexOffice(wiseData: WiseRow[]): LexOfficeRow[] {
  return wiseData
    .filter((row) => {
      // Skip rows with validation errors
      const errors = validateRow(row);
      if (errors.length > 0) {
        console.warn(`Skipping row with errors:`, errors, row);
        return false;
      }
      return true;
    })
    .map((row) => ({
      Buchungstag: convertDate(row.Date),
      Valuta: convertDate(row.Date),
      'Auftraggeber/Zahlungsempfänger': getAuftraggeber(row),
      'Empfänger/Zahlungspflichtiger': getEmpfaenger(row),
      'Vorgang/Verwendungszweck': buildVerwendungszweck(row),
      Betrag: convertAmount(row.Amount),
      'Zusatzinfo (optional)': buildZusatzinfo(row),
    }));
}

/**
 * Calculate statistics from Wise data
 */
export function calculateStats(wiseData: WiseRow[]): ConversionStats {
  const stats: ConversionStats = {
    total: wiseData.length,
    debit: 0,
    credit: 0,
    totalAmount: 0,
    currency: wiseData[0]?.Currency || 'EUR',
  };

  wiseData.forEach((row) => {
    const amount = parseFloat(row.Amount);

    if (row['Transaction Type'] === 'DEBIT') {
      stats.debit++;
    } else if (row['Transaction Type'] === 'CREDIT') {
      stats.credit++;
    }

    if (!isNaN(amount)) {
      stats.totalAmount += amount;
    }
  });

  return stats;
}
