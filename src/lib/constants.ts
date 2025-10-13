// CSV Headers - MUST match exactly with Wise export format
export const WISE_HEADERS = [
  'TransferWise ID',
  'Date',
  'Date Time',
  'Amount',
  'Currency',
  'Description',
  'Payment Reference',
  'Running Balance',
  'Exchange From',
  'Exchange To',
  'Exchange Rate',
  'Payer Name',
  'Payee Name',
  'Payee Account Number',
  'Merchant',
  'Card Last Four Digits',
  'Card Holder Full Name',
  'Attachment',
  'Note',
  'Total fees',
  'Exchange To Amount',
  'Transaction Type',
  'Transaction Details Type',
] as const;

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
  INVALID_FILE: 'Bitte wählen Sie eine CSV-Datei aus',
  INVALID_WISE_FORMAT:
    'Die Datei entspricht nicht dem Wise-Export-Format. Bitte stellen Sie sicher, dass Sie eine Wise CSV-Exportdatei hochladen.',
  EMPTY_FILE: 'Die Datei enthält keine Transaktionen',
  CONVERSION_FAILED: 'Fehler bei der Konvertierung',
  INVALID_DATE: 'Ungültiges Datumsformat gefunden',
  INVALID_AMOUNT: 'Ungültiger Betrag gefunden',
  MISSING_REQUIRED_FIELD: 'Erforderliches Feld fehlt',
} as const;

// Success messages in German
export const SUCCESS_MESSAGES = {
  CONVERSION_COMPLETE: 'Konvertierung erfolgreich abgeschlossen',
  FILE_DOWNLOADED: 'Datei wurde heruntergeladen',
} as const;

// Account holder constant for German format
export const ACCOUNT_HOLDER = 'Kontoinhaber' as const;

// File size limits
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
export const MAX_FILE_SIZE_MB = 5;
