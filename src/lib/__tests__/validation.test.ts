import {
  validateWiseRow,
  validateWiseData,
  getValidationStatus,
  filterResultsBySeverity,
  type RowValidationResult,
  type ValidationSummary,
} from '../validation';
import type { WiseRow } from '../converter';

// Helper to create a valid WiseRow
function createValidWiseRow(overrides: Partial<WiseRow> = {}): WiseRow {
  return {
    'TransferWise ID': 'TRANSFER-123',
    Date: '29-09-2025',
    'Date Time': '29-09-2025 16:02:46.004',
    Amount: '-553.76',
    Currency: 'EUR',
    Description: 'Test payment',
    'Payment Reference': 'Invoice 22',
    'Running Balance': '4315.50',
    'Payer Name': '',
    'Payee Name': 'John Doe',
    'Transaction Type': 'DEBIT',
    'Transaction Details Type': 'TRANSFER',
    ...overrides,
  };
}

describe('validateWiseRow', () => {
  describe('valid rows', () => {
    it('should return valid result for a complete DEBIT row', () => {
      const row = createValidWiseRow();
      const result = validateWiseRow(row, 0);

      expect(result.isValid).toBe(true);
      expect(result.rowIndex).toBe(0);
      expect(result.issues.filter((i) => i.severity === 'error')).toHaveLength(0);
    });

    it('should return valid result for a complete CREDIT row', () => {
      const row = createValidWiseRow({
        'Transaction Type': 'CREDIT',
        Amount: '1000.00',
        'Payer Name': 'Jane Doe',
        'Payee Name': '',
      });
      const result = validateWiseRow(row, 0);

      expect(result.isValid).toBe(true);
    });
  });

  describe('date validation', () => {
    it('should detect missing date', () => {
      const row = createValidWiseRow({ Date: '' });
      const result = validateWiseRow(row, 0);

      expect(result.isValid).toBe(false);
      expect(result.issues.some((i) => i.field === 'Date' && i.severity === 'error')).toBe(true);
    });

    it('should detect invalid date format', () => {
      const row = createValidWiseRow({ Date: '2025-09-29' }); // Wrong format
      const result = validateWiseRow(row, 0);

      expect(result.isValid).toBe(false);
      expect(result.issues.some((i) => i.field === 'Date' && i.message.toLowerCase().includes('ungültig'))).toBe(true);
    });

    it('should detect invalid date values', () => {
      const row = createValidWiseRow({ Date: '32-13-2025' }); // Invalid day and month
      const result = validateWiseRow(row, 0);

      expect(result.isValid).toBe(false);
    });

    it('should warn about future dates', () => {
      // Create a date 1 year in the future
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      const day = String(futureDate.getDate()).padStart(2, '0');
      const month = String(futureDate.getMonth() + 1).padStart(2, '0');
      const year = futureDate.getFullYear();

      const row = createValidWiseRow({ Date: `${day}-${month}-${year}` });
      const result = validateWiseRow(row, 0);

      expect(result.isValid).toBe(true); // Still valid (warning only)
      expect(result.hasWarnings).toBe(true);
      expect(result.issues.some((i) => i.field === 'Date' && i.severity === 'warning')).toBe(true);
    });
  });

  describe('amount validation', () => {
    it('should detect missing amount', () => {
      const row = createValidWiseRow({ Amount: '' });
      const result = validateWiseRow(row, 0);

      expect(result.isValid).toBe(false);
      expect(result.issues.some((i) => i.field === 'Amount' && i.severity === 'error')).toBe(true);
    });

    it('should detect invalid amount format', () => {
      const row = createValidWiseRow({ Amount: 'abc' });
      const result = validateWiseRow(row, 0);

      expect(result.isValid).toBe(false);
      expect(result.issues.some((i) => i.field === 'Amount' && i.message.toLowerCase().includes('ungültig'))).toBe(true);
    });

    it('should warn about zero amounts', () => {
      const row = createValidWiseRow({ Amount: '0' });
      const result = validateWiseRow(row, 0);

      expect(result.isValid).toBe(true); // Valid but with warning
      expect(result.hasWarnings).toBe(true);
      expect(result.issues.some((i) => i.field === 'Amount' && i.severity === 'warning')).toBe(true);
    });

    it('should accept valid negative amounts', () => {
      const row = createValidWiseRow({ Amount: '-123.45' });
      const result = validateWiseRow(row, 0);

      expect(result.isValid).toBe(true);
    });

    it('should accept valid positive amounts', () => {
      const row = createValidWiseRow({ Amount: '123.45', 'Transaction Type': 'CREDIT' });
      const result = validateWiseRow(row, 0);

      expect(result.isValid).toBe(true);
    });
  });

  describe('transaction type validation', () => {
    it('should detect missing transaction type', () => {
      const row = createValidWiseRow({ 'Transaction Type': '' as 'DEBIT' | 'CREDIT' });
      const result = validateWiseRow(row, 0);

      expect(result.isValid).toBe(false);
      expect(result.issues.some((i) => i.field === 'Transaction Type' && i.severity === 'error')).toBe(true);
    });

    it('should detect invalid transaction type', () => {
      const row = createValidWiseRow({ 'Transaction Type': 'INVALID' as 'DEBIT' | 'CREDIT' });
      const result = validateWiseRow(row, 0);

      expect(result.isValid).toBe(false);
      expect(result.issues.some((i) => i.field === 'Transaction Type' && i.message.toLowerCase().includes('ungültig'))).toBe(true);
    });

    it('should accept DEBIT', () => {
      const row = createValidWiseRow({ 'Transaction Type': 'DEBIT' });
      const result = validateWiseRow(row, 0);

      expect(result.issues.filter((i) => i.field === 'Transaction Type' && i.severity === 'error')).toHaveLength(0);
    });

    it('should accept CREDIT', () => {
      const row = createValidWiseRow({ 'Transaction Type': 'CREDIT', 'Payer Name': 'Sender' });
      const result = validateWiseRow(row, 0);

      expect(result.issues.filter((i) => i.field === 'Transaction Type' && i.severity === 'error')).toHaveLength(0);
    });
  });

  describe('TransferWise ID validation', () => {
    it('should warn about missing Wise ID', () => {
      const row = createValidWiseRow({ 'TransferWise ID': '' });
      const result = validateWiseRow(row, 0);

      expect(result.isValid).toBe(true); // Valid but with warning
      expect(result.issues.some((i) => i.field === 'TransferWise ID' && i.severity === 'warning')).toBe(true);
    });
  });

  describe('party validation', () => {
    it('should warn about missing Payee Name for DEBIT', () => {
      const row = createValidWiseRow({ 'Transaction Type': 'DEBIT', 'Payee Name': '' });
      const result = validateWiseRow(row, 0);

      expect(result.hasWarnings).toBe(true);
      expect(result.issues.some((i) => i.field === 'Payee Name' && i.severity === 'warning')).toBe(true);
    });

    it('should warn about missing Payer Name for CREDIT', () => {
      const row = createValidWiseRow({ 'Transaction Type': 'CREDIT', 'Payer Name': '' });
      const result = validateWiseRow(row, 0);

      expect(result.hasWarnings).toBe(true);
      expect(result.issues.some((i) => i.field === 'Payer Name' && i.severity === 'warning')).toBe(true);
    });
  });

  describe('description validation', () => {
    it('should warn about missing description and reference', () => {
      const row = createValidWiseRow({ Description: '', 'Payment Reference': '' });
      const result = validateWiseRow(row, 0);

      expect(result.hasWarnings).toBe(true);
      expect(result.issues.some((i) => i.field === 'Description' && i.severity === 'warning')).toBe(true);
    });

    it('should not warn if Description is present', () => {
      const row = createValidWiseRow({ Description: 'Test', 'Payment Reference': '' });
      const result = validateWiseRow(row, 0);

      expect(result.issues.filter((i) => i.field === 'Description')).toHaveLength(0);
    });

    it('should not warn if Payment Reference is present', () => {
      const row = createValidWiseRow({ Description: '', 'Payment Reference': 'REF-123' });
      const result = validateWiseRow(row, 0);

      expect(result.issues.filter((i) => i.field === 'Description')).toHaveLength(0);
    });
  });
});

describe('validateWiseData', () => {
  it('should validate all rows and return summary', () => {
    const data: WiseRow[] = [
      createValidWiseRow(),
      createValidWiseRow({ Date: '' }), // Error (also has warnings due to missing Date)
      createValidWiseRow({ 'TransferWise ID': '' }), // Warning only
    ];

    const summary = validateWiseData(data);

    expect(summary.totalRows).toBe(3);
    expect(summary.validRows).toBe(2);
    expect(summary.rowsWithErrors).toBe(1);
    expect(summary.rowsWithWarnings).toBe(1); // Only the third row has warnings (missing ID)
    expect(summary.results).toHaveLength(3);
  });

  it('should handle empty data', () => {
    const summary = validateWiseData([]);

    expect(summary.totalRows).toBe(0);
    expect(summary.validRows).toBe(0);
    expect(summary.results).toHaveLength(0);
  });
});

describe('getValidationStatus', () => {
  it('should return error for invalid rows', () => {
    const result: RowValidationResult = {
      rowIndex: 0,
      isValid: false,
      hasWarnings: true,
      issues: [{ field: 'Date', message: 'Missing', severity: 'error' }],
    };

    expect(getValidationStatus(result)).toBe('error');
  });

  it('should return warning for valid rows with warnings', () => {
    const result: RowValidationResult = {
      rowIndex: 0,
      isValid: true,
      hasWarnings: true,
      issues: [{ field: 'TransferWise ID', message: 'Missing', severity: 'warning' }],
    };

    expect(getValidationStatus(result)).toBe('warning');
  });

  it('should return valid for rows without issues', () => {
    const result: RowValidationResult = {
      rowIndex: 0,
      isValid: true,
      hasWarnings: false,
      issues: [],
    };

    expect(getValidationStatus(result)).toBe('valid');
  });
});

describe('filterResultsBySeverity', () => {
  const summary: ValidationSummary = {
    totalRows: 3,
    validRows: 2,
    rowsWithErrors: 1,
    rowsWithWarnings: 1,
    results: [
      { rowIndex: 0, isValid: true, hasWarnings: false, issues: [] },
      { rowIndex: 1, isValid: false, hasWarnings: false, issues: [{ field: 'Date', message: 'Error', severity: 'error' }] },
      { rowIndex: 2, isValid: true, hasWarnings: true, issues: [{ field: 'ID', message: 'Warning', severity: 'warning' }] },
    ],
  };

  it('should filter by error severity', () => {
    const filtered = filterResultsBySeverity(summary, 'error');
    expect(filtered).toHaveLength(1);
    expect(filtered[0].rowIndex).toBe(1);
  });

  it('should filter by warning severity', () => {
    const filtered = filterResultsBySeverity(summary, 'warning');
    expect(filtered).toHaveLength(1);
    expect(filtered[0].rowIndex).toBe(2);
  });

  it('should return all rows with issues when severity is all', () => {
    const filtered = filterResultsBySeverity(summary, 'all');
    expect(filtered).toHaveLength(2);
  });
});
