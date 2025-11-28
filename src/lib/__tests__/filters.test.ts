import {
  parseWiseDate,
  formatToWiseDate,
  formatToDisplayDate,
  filterWiseData,
  getUniqueValues,
  getDateRangeFromData,
  getAmountRangeFromData,
  filterByIndices,
  sortWiseData,
  paginateData,
  exportToExcel,
  type FilterOptions,
  DEFAULT_FILTER_OPTIONS,
} from '../filters';
import type { WiseRow } from '../converter';

// Helper to create a WiseRow
function createWiseRow(overrides: Partial<WiseRow> = {}): WiseRow {
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

describe('Date utilities', () => {
  describe('parseWiseDate', () => {
    it('should parse valid Wise date format', () => {
      const date = parseWiseDate('29-09-2025');
      expect(date).not.toBeNull();
      expect(date!.getDate()).toBe(29);
      expect(date!.getMonth()).toBe(8); // September (0-indexed)
      expect(date!.getFullYear()).toBe(2025);
    });

    it('should return null for empty string', () => {
      expect(parseWiseDate('')).toBeNull();
    });

    it('should return null for invalid format', () => {
      expect(parseWiseDate('2025-09-29')).toBeNull();
      expect(parseWiseDate('29/09/2025')).toBeNull();
      expect(parseWiseDate('invalid')).toBeNull();
    });
  });

  describe('formatToWiseDate', () => {
    it('should format Date to Wise format', () => {
      const date = new Date(2025, 8, 29); // September 29, 2025
      expect(formatToWiseDate(date)).toBe('29-09-2025');
    });

    it('should pad single digit days and months', () => {
      const date = new Date(2025, 0, 5); // January 5, 2025
      expect(formatToWiseDate(date)).toBe('05-01-2025');
    });
  });

  describe('formatToDisplayDate', () => {
    it('should format Date to German display format', () => {
      const date = new Date(2025, 8, 29);
      expect(formatToDisplayDate(date)).toBe('29.09.2025');
    });
  });
});

describe('filterWiseData', () => {
  const testData: WiseRow[] = [
    createWiseRow({
      'TransferWise ID': 'TRX-001',
      Date: '01-09-2025',
      Amount: '-100.00',
      Description: 'Payment to John',
      'Transaction Type': 'DEBIT',
      'Payee Name': 'John Smith',
      'Payment Reference': 'REF-A',
    }),
    createWiseRow({
      'TransferWise ID': 'TRX-002',
      Date: '15-09-2025',
      Amount: '500.00',
      Description: 'Salary from Company',
      'Transaction Type': 'CREDIT',
      'Payer Name': 'Company Inc',
      'Payee Name': '',
      'Payment Reference': 'REF-B',
    }),
    createWiseRow({
      'TransferWise ID': 'TRX-003',
      Date: '30-09-2025',
      Amount: '-250.00',
      Description: 'Rent payment',
      'Transaction Type': 'DEBIT',
      'Payee Name': 'Landlord LLC',
      'Payment Reference': 'REF-C',
    }),
  ];

  it('should return all data with default filters', () => {
    const filtered = filterWiseData(testData, DEFAULT_FILTER_OPTIONS);
    expect(filtered).toHaveLength(3);
  });

  describe('search filter', () => {
    it('should filter by description', () => {
      const options: FilterOptions = { ...DEFAULT_FILTER_OPTIONS, search: 'John' };
      const filtered = filterWiseData(testData, options);
      expect(filtered).toHaveLength(1);
      expect(filtered[0]['TransferWise ID']).toBe('TRX-001');
    });

    it('should filter by TransferWise ID', () => {
      const options: FilterOptions = { ...DEFAULT_FILTER_OPTIONS, search: 'TRX-002' };
      const filtered = filterWiseData(testData, options);
      expect(filtered).toHaveLength(1);
      expect(filtered[0]['TransferWise ID']).toBe('TRX-002');
    });

    it('should be case insensitive', () => {
      const options: FilterOptions = { ...DEFAULT_FILTER_OPTIONS, search: 'company' };
      const filtered = filterWiseData(testData, options);
      expect(filtered).toHaveLength(1);
    });

    it('should return empty for no matches', () => {
      const options: FilterOptions = { ...DEFAULT_FILTER_OPTIONS, search: 'nonexistent' };
      const filtered = filterWiseData(testData, options);
      expect(filtered).toHaveLength(0);
    });
  });

  describe('transaction type filter', () => {
    it('should filter DEBIT transactions', () => {
      const options: FilterOptions = { ...DEFAULT_FILTER_OPTIONS, transactionType: 'DEBIT' };
      const filtered = filterWiseData(testData, options);
      expect(filtered).toHaveLength(2);
      expect(filtered.every((r) => r['Transaction Type'] === 'DEBIT')).toBe(true);
    });

    it('should filter CREDIT transactions', () => {
      const options: FilterOptions = { ...DEFAULT_FILTER_OPTIONS, transactionType: 'CREDIT' };
      const filtered = filterWiseData(testData, options);
      expect(filtered).toHaveLength(1);
      expect(filtered[0]['Transaction Type']).toBe('CREDIT');
    });
  });

  describe('date range filter', () => {
    it('should filter by start date', () => {
      const options: FilterOptions = {
        ...DEFAULT_FILTER_OPTIONS,
        dateRange: { start: new Date(2025, 8, 10), end: null },
      };
      const filtered = filterWiseData(testData, options);
      expect(filtered).toHaveLength(2);
    });

    it('should filter by end date', () => {
      const options: FilterOptions = {
        ...DEFAULT_FILTER_OPTIONS,
        dateRange: { start: null, end: new Date(2025, 8, 20) },
      };
      const filtered = filterWiseData(testData, options);
      expect(filtered).toHaveLength(2);
    });

    it('should filter by date range', () => {
      const options: FilterOptions = {
        ...DEFAULT_FILTER_OPTIONS,
        dateRange: { start: new Date(2025, 8, 10), end: new Date(2025, 8, 20) },
      };
      const filtered = filterWiseData(testData, options);
      expect(filtered).toHaveLength(1);
      expect(filtered[0]['TransferWise ID']).toBe('TRX-002');
    });
  });

  describe('amount range filter', () => {
    it('should filter by minimum amount', () => {
      const options: FilterOptions = { ...DEFAULT_FILTER_OPTIONS, minAmount: 200 };
      const filtered = filterWiseData(testData, options);
      expect(filtered).toHaveLength(2);
    });

    it('should filter by maximum amount', () => {
      const options: FilterOptions = { ...DEFAULT_FILTER_OPTIONS, maxAmount: 200 };
      const filtered = filterWiseData(testData, options);
      expect(filtered).toHaveLength(1);
    });

    it('should filter by amount range', () => {
      const options: FilterOptions = { ...DEFAULT_FILTER_OPTIONS, minAmount: 100, maxAmount: 300 };
      const filtered = filterWiseData(testData, options);
      expect(filtered).toHaveLength(2);
    });
  });

  describe('combined filters', () => {
    it('should apply multiple filters', () => {
      const options: FilterOptions = {
        ...DEFAULT_FILTER_OPTIONS,
        transactionType: 'DEBIT',
        minAmount: 200,
      };
      const filtered = filterWiseData(testData, options);
      expect(filtered).toHaveLength(1);
      expect(filtered[0]['TransferWise ID']).toBe('TRX-003');
    });
  });
});

describe('getUniqueValues', () => {
  const testData: WiseRow[] = [
    createWiseRow({ Currency: 'EUR' }),
    createWiseRow({ Currency: 'USD' }),
    createWiseRow({ Currency: 'EUR' }),
    createWiseRow({ Currency: 'GBP' }),
  ];

  it('should return unique sorted values', () => {
    const values = getUniqueValues(testData, 'Currency');
    expect(values).toEqual(['EUR', 'GBP', 'USD']);
  });

  it('should filter empty values', () => {
    const data: WiseRow[] = [
      createWiseRow({ 'Payer Name': 'John' }),
      createWiseRow({ 'Payer Name': '' }),
      createWiseRow({ 'Payer Name': 'Jane' }),
    ];
    const values = getUniqueValues(data, 'Payer Name');
    expect(values).toEqual(['Jane', 'John']);
  });
});

describe('getDateRangeFromData', () => {
  it('should return date range from data', () => {
    const data: WiseRow[] = [
      createWiseRow({ Date: '15-09-2025' }),
      createWiseRow({ Date: '01-09-2025' }),
      createWiseRow({ Date: '30-09-2025' }),
    ];

    const range = getDateRangeFromData(data);
    expect(range.start).toEqual(new Date(2025, 8, 1));
    expect(range.end).toEqual(new Date(2025, 8, 30));
  });

  it('should handle empty data', () => {
    const range = getDateRangeFromData([]);
    expect(range.start).toBeNull();
    expect(range.end).toBeNull();
  });
});

describe('getAmountRangeFromData', () => {
  it('should return amount range from data', () => {
    const data: WiseRow[] = [
      createWiseRow({ Amount: '-100.00' }),
      createWiseRow({ Amount: '500.00' }),
      createWiseRow({ Amount: '-250.00' }),
    ];

    const range = getAmountRangeFromData(data);
    expect(range.min).toBe(100);
    expect(range.max).toBe(500);
  });

  it('should handle empty data', () => {
    const range = getAmountRangeFromData([]);
    expect(range.min).toBe(0);
    expect(range.max).toBe(0);
  });
});

describe('filterByIndices', () => {
  it('should filter data by indices', () => {
    const data = ['a', 'b', 'c', 'd', 'e'];
    const filtered = filterByIndices(data, [1, 3]);
    expect(filtered).toEqual(['b', 'd']);
  });

  it('should handle empty indices', () => {
    const data = ['a', 'b', 'c'];
    const filtered = filterByIndices(data, []);
    expect(filtered).toEqual([]);
  });
});

describe('sortWiseData', () => {
  const testData: WiseRow[] = [
    createWiseRow({ 'TransferWise ID': '2', Date: '15-09-2025', Amount: '500.00' }),
    createWiseRow({ 'TransferWise ID': '1', Date: '01-09-2025', Amount: '-100.00' }),
    createWiseRow({ 'TransferWise ID': '3', Date: '30-09-2025', Amount: '-250.00' }),
  ];

  it('should sort by date ascending', () => {
    const sorted = sortWiseData(testData, 'Date', 'asc');
    expect(sorted[0]['TransferWise ID']).toBe('1');
    expect(sorted[2]['TransferWise ID']).toBe('3');
  });

  it('should sort by date descending', () => {
    const sorted = sortWiseData(testData, 'Date', 'desc');
    expect(sorted[0]['TransferWise ID']).toBe('3');
    expect(sorted[2]['TransferWise ID']).toBe('1');
  });

  it('should sort by amount ascending', () => {
    const sorted = sortWiseData(testData, 'Amount', 'asc');
    expect(sorted[0].Amount).toBe('-250.00');
    expect(sorted[2].Amount).toBe('500.00');
  });

  it('should sort by amount descending', () => {
    const sorted = sortWiseData(testData, 'Amount', 'desc');
    expect(sorted[0].Amount).toBe('500.00');
    expect(sorted[2].Amount).toBe('-250.00');
  });

  it('should not modify original array', () => {
    const original = [...testData];
    sortWiseData(testData, 'Date', 'asc');
    expect(testData).toEqual(original);
  });
});

describe('paginateData', () => {
  const testData = Array.from({ length: 25 }, (_, i) => ({ id: i + 1 }));

  it('should return correct page of data', () => {
    const result = paginateData(testData, 1, 10);
    expect(result.data).toHaveLength(10);
    expect(result.data[0]).toEqual({ id: 1 });
    expect(result.currentPage).toBe(1);
    expect(result.totalPages).toBe(3);
    expect(result.hasNextPage).toBe(true);
    expect(result.hasPreviousPage).toBe(false);
  });

  it('should return correct last page', () => {
    const result = paginateData(testData, 3, 10);
    expect(result.data).toHaveLength(5);
    expect(result.data[0]).toEqual({ id: 21 });
    expect(result.hasNextPage).toBe(false);
    expect(result.hasPreviousPage).toBe(true);
  });

  it('should handle page out of range', () => {
    const result = paginateData(testData, 10, 10);
    expect(result.currentPage).toBe(3);
  });

  it('should handle empty data', () => {
    const result = paginateData([], 1, 10);
    expect(result.data).toHaveLength(0);
    expect(result.totalPages).toBe(0);
    expect(result.currentPage).toBe(1);
  });
});

describe('exportToExcel', () => {
  it('should export data to TSV format', () => {
    const data: WiseRow[] = [
      createWiseRow({
        'TransferWise ID': 'TEST-1',
        Date: '29-09-2025',
        Amount: '-100.00',
        Currency: 'EUR',
        Description: 'Test',
        'Payment Reference': 'REF-1',
        'Payer Name': '',
        'Payee Name': 'John',
        'Transaction Type': 'DEBIT',
      }),
    ];

    const content = exportToExcel(data);
    const lines = content.split('\n');

    expect(lines[0]).toBe('TransferWise ID\tDate\tAmount\tCurrency\tDescription\tPayment Reference\tPayer Name\tPayee Name\tTransaction Type');
    expect(lines[1]).toContain('TEST-1');
    expect(lines[1]).toContain('29-09-2025');
    expect(lines[1]).toContain('-100.00');
  });
});
