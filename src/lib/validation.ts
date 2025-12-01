import type { WiseRow } from './converter';

/**
 * Validation issue severity
 */
export type ValidationSeverity = 'error' | 'warning';

/**
 * Individual validation issue for a field
 */
export interface ValidationIssue {
  field: string;
  message: string;
  severity: ValidationSeverity;
}

/**
 * Validation result for a single row
 */
export interface RowValidationResult {
  rowIndex: number;
  isValid: boolean;
  hasWarnings: boolean;
  issues: ValidationIssue[];
}

/**
 * Validation summary for entire dataset
 */
export interface ValidationSummary {
  totalRows: number;
  validRows: number;
  rowsWithErrors: number;
  rowsWithWarnings: number;
  results: RowValidationResult[];
}

/**
 * Date pattern for Wise format: dd-mm-yyyy
 */
const WISE_DATE_PATTERN = /^\d{2}-\d{2}-\d{4}$/;

/**
 * Amount pattern: optional minus, digits, dot, digits
 */
const AMOUNT_PATTERN = /^-?\d+(\.\d+)?$/;

/**
 * Valid transaction types
 */
const VALID_TRANSACTION_TYPES = ['DEBIT', 'CREDIT'] as const;

/**
 * Validate date format and value
 */
function validateDate(date: string): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  if (!date || date.trim() === '') {
    issues.push({
      field: 'Date',
      message: 'Datum fehlt',
      severity: 'error',
    });
    return issues;
  }

  if (!WISE_DATE_PATTERN.test(date)) {
    issues.push({
      field: 'Date',
      message: `Ungültiges Datumsformat: "${date}" (erwartet: dd-mm-yyyy)`,
      severity: 'error',
    });
    return issues;
  }

  // Parse and validate date components
  const [day, month, year] = date.split('-').map(Number);
  const dateObj = new Date(year, month - 1, day);

  if (
    dateObj.getDate() !== day ||
    dateObj.getMonth() !== month - 1 ||
    dateObj.getFullYear() !== year
  ) {
    issues.push({
      field: 'Date',
      message: `Ungültiges Datum: "${date}"`,
      severity: 'error',
    });
  }

  // Check for future dates (warning)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (dateObj > today) {
    issues.push({
      field: 'Date',
      message: 'Datum liegt in der Zukunft',
      severity: 'warning',
    });
  }

  return issues;
}

/**
 * Validate amount format and value
 */
function validateAmount(amount: string): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  if (!amount || amount.trim() === '') {
    issues.push({
      field: 'Amount',
      message: 'Betrag fehlt',
      severity: 'error',
    });
    return issues;
  }

  if (!AMOUNT_PATTERN.test(amount.trim())) {
    issues.push({
      field: 'Amount',
      message: `Ungültiges Betragsformat: "${amount}"`,
      severity: 'error',
    });
    return issues;
  }

  const numAmount = parseFloat(amount);
  if (isNaN(numAmount)) {
    issues.push({
      field: 'Amount',
      message: `Betrag konnte nicht geparst werden: "${amount}"`,
      severity: 'error',
    });
    return issues;
  }

  // Zero amount warning
  if (numAmount === 0) {
    issues.push({
      field: 'Amount',
      message: 'Betrag ist 0',
      severity: 'warning',
    });
  }

  return issues;
}

/**
 * Validate transaction type
 */
function validateTransactionType(type: string): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  if (!type || type.trim() === '') {
    issues.push({
      field: 'Transaction Type',
      message: 'Transaktionstyp fehlt',
      severity: 'error',
    });
    return issues;
  }

  if (!VALID_TRANSACTION_TYPES.includes(type.trim() as typeof VALID_TRANSACTION_TYPES[number])) {
    issues.push({
      field: 'Transaction Type',
      message: `Ungültiger Transaktionstyp: "${type}" (erwartet: DEBIT oder CREDIT)`,
      severity: 'error',
    });
  }

  return issues;
}

/**
 * Validate TransferWise ID
 */
function validateTransferWiseId(id: string): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  if (!id || id.trim() === '') {
    issues.push({
      field: 'TransferWise ID',
      message: 'Wise ID fehlt',
      severity: 'warning',
    });
  }

  return issues;
}

/**
 * Validate transaction parties based on type
 */
function validateParties(row: WiseRow): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const type = row['Transaction Type'];

  if (type === 'DEBIT' && !row['Payee Name']?.trim()) {
    issues.push({
      field: 'Payee Name',
      message: 'Empfängername fehlt für Ausgabe',
      severity: 'warning',
    });
  }

  if (type === 'CREDIT' && !row['Payer Name']?.trim()) {
    issues.push({
      field: 'Payer Name',
      message: 'Absendername fehlt für Einnahme',
      severity: 'warning',
    });
  }

  return issues;
}

/**
 * Validate description and purpose
 */
function validateDescription(row: WiseRow): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  // Check if we have at least description or payment reference
  if (!row.Description?.trim() && !row['Payment Reference']?.trim()) {
    issues.push({
      field: 'Description',
      message: 'Verwendungszweck fehlt (Beschreibung und Referenz leer)',
      severity: 'warning',
    });
  }

  return issues;
}

/**
 * Validate a single Wise row with detailed issues
 */
export function validateWiseRow(row: WiseRow, rowIndex: number): RowValidationResult {
  const issues: ValidationIssue[] = [
    ...validateDate(row.Date),
    ...validateAmount(row.Amount),
    ...validateTransactionType(row['Transaction Type']),
    ...validateTransferWiseId(row['TransferWise ID']),
    ...validateParties(row),
    ...validateDescription(row),
  ];

  const hasErrors = issues.some((issue) => issue.severity === 'error');
  const hasWarnings = issues.some((issue) => issue.severity === 'warning');

  return {
    rowIndex,
    isValid: !hasErrors,
    hasWarnings,
    issues,
  };
}

/**
 * Validate entire dataset
 */
export function validateWiseData(data: WiseRow[]): ValidationSummary {
  const results = data.map((row, index) => validateWiseRow(row, index));

  return {
    totalRows: data.length,
    validRows: results.filter((r) => r.isValid).length,
    rowsWithErrors: results.filter((r) => !r.isValid).length,
    rowsWithWarnings: results.filter((r) => r.hasWarnings).length,
    results,
  };
}

/**
 * Get validation status for display
 */
export function getValidationStatus(result: RowValidationResult): 'valid' | 'warning' | 'error' {
  if (!result.isValid) return 'error';
  if (result.hasWarnings) return 'warning';
  return 'valid';
}

/**
 * Filter validation results by severity
 */
export function filterResultsBySeverity(
  summary: ValidationSummary,
  severity: ValidationSeverity | 'all'
): RowValidationResult[] {
  if (severity === 'all') {
    return summary.results.filter((r) => r.issues.length > 0);
  }
  return summary.results.filter((r) =>
    r.issues.some((issue) => issue.severity === severity)
  );
}
