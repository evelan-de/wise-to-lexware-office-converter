import {
  generateTransactionKey,
  detectDuplicates,
  removeDuplicates,
  arePotentialDuplicates,
  findCrossFileDuplicates,
  mergeAndDeduplicate,
  getDuplicateSummary,
  removeLexOfficeDuplicates,
} from '../deduplication';
import type { WiseRow, LexOfficeRow } from '../converter';

// Helper function to create a mock WiseRow
function createMockWiseRow(overrides: Partial<WiseRow> = {}): WiseRow {
  return {
    'TransferWise ID': 'TEST-001',
    Date: '15-03-2024',
    'Date Time': '15-03-2024 10:00:00',
    Amount: '-100.00',
    Currency: 'EUR',
    Description: 'Test payment',
    'Payment Reference': 'REF123',
    'Running Balance': '1000.00',
    'Transaction Type': 'DEBIT',
    'Transaction Details Type': 'TRANSFER',
    ...overrides,
  };
}

describe('deduplication', () => {
  describe('generateTransactionKey', () => {
    it('should use Wise ID as primary key when available', () => {
      const row = createMockWiseRow({ 'TransferWise ID': 'WISE-12345' });
      const key = generateTransactionKey(row);

      expect(key).toBe('wise:WISE-12345');
    });

    it('should generate hash key when Wise ID is missing', () => {
      const row = createMockWiseRow({ 'TransferWise ID': '' });
      const key = generateTransactionKey(row);

      expect(key).toMatch(/^hash:/);
      expect(key).toContain('15-03-2024');
      expect(key).toContain('-100.00');
    });

    it('should generate different keys for different transactions', () => {
      const row1 = createMockWiseRow({ 'TransferWise ID': 'WISE-001' });
      const row2 = createMockWiseRow({ 'TransferWise ID': 'WISE-002' });

      expect(generateTransactionKey(row1)).not.toBe(generateTransactionKey(row2));
    });

    it('should generate same key for same Wise ID', () => {
      const row1 = createMockWiseRow({ 'TransferWise ID': 'WISE-001' });
      const row2 = createMockWiseRow({ 'TransferWise ID': 'WISE-001', Amount: '-200.00' });

      expect(generateTransactionKey(row1)).toBe(generateTransactionKey(row2));
    });
  });

  describe('detectDuplicates', () => {
    it('should detect duplicate transactions', () => {
      const rows: WiseRow[] = [
        createMockWiseRow({ 'TransferWise ID': 'WISE-001' }),
        createMockWiseRow({ 'TransferWise ID': 'WISE-002' }),
        createMockWiseRow({ 'TransferWise ID': 'WISE-001' }), // Duplicate
      ];

      const duplicates = detectDuplicates(rows);

      expect(duplicates.size).toBe(1);
      expect(duplicates.get('wise:WISE-001')).toEqual([0, 2]);
    });

    it('should return empty map when no duplicates', () => {
      const rows: WiseRow[] = [
        createMockWiseRow({ 'TransferWise ID': 'WISE-001' }),
        createMockWiseRow({ 'TransferWise ID': 'WISE-002' }),
        createMockWiseRow({ 'TransferWise ID': 'WISE-003' }),
      ];

      const duplicates = detectDuplicates(rows);

      expect(duplicates.size).toBe(0);
    });

    it('should detect multiple duplicates', () => {
      const rows: WiseRow[] = [
        createMockWiseRow({ 'TransferWise ID': 'WISE-001' }),
        createMockWiseRow({ 'TransferWise ID': 'WISE-002' }),
        createMockWiseRow({ 'TransferWise ID': 'WISE-001' }),
        createMockWiseRow({ 'TransferWise ID': 'WISE-002' }),
        createMockWiseRow({ 'TransferWise ID': 'WISE-001' }),
      ];

      const duplicates = detectDuplicates(rows);

      expect(duplicates.size).toBe(2);
      expect(duplicates.get('wise:WISE-001')).toEqual([0, 2, 4]);
      expect(duplicates.get('wise:WISE-002')).toEqual([1, 3]);
    });
  });

  describe('removeDuplicates', () => {
    it('should keep first occurrence and remove duplicates', () => {
      const rows: WiseRow[] = [
        createMockWiseRow({ 'TransferWise ID': 'WISE-001', Description: 'First' }),
        createMockWiseRow({ 'TransferWise ID': 'WISE-002', Description: 'Second' }),
        createMockWiseRow({ 'TransferWise ID': 'WISE-001', Description: 'First again' }), // Duplicate
      ];

      const result = removeDuplicates(rows);

      expect(result.uniqueRows).toHaveLength(2);
      expect(result.uniqueRows[0].Description).toBe('First');
      expect(result.uniqueRows[1].Description).toBe('Second');
      expect(result.totalDuplicatesRemoved).toBe(1);
    });

    it('should return all rows when no duplicates', () => {
      const rows: WiseRow[] = [
        createMockWiseRow({ 'TransferWise ID': 'WISE-001' }),
        createMockWiseRow({ 'TransferWise ID': 'WISE-002' }),
        createMockWiseRow({ 'TransferWise ID': 'WISE-003' }),
      ];

      const result = removeDuplicates(rows);

      expect(result.uniqueRows).toHaveLength(3);
      expect(result.totalDuplicatesRemoved).toBe(0);
      expect(result.duplicates).toHaveLength(0);
    });

    it('should track duplicate info', () => {
      const rows: WiseRow[] = [
        createMockWiseRow({ 'TransferWise ID': 'WISE-001' }),
        createMockWiseRow({ 'TransferWise ID': 'WISE-001' }),
        createMockWiseRow({ 'TransferWise ID': 'WISE-001' }),
      ];

      const result = removeDuplicates(rows);

      expect(result.duplicates).toHaveLength(1);
      expect(result.duplicates[0].wiseId).toBe('WISE-001');
      expect(result.duplicates[0].occurrences).toBe(3);
    });
  });

  describe('arePotentialDuplicates', () => {
    it('should return true for same Wise ID', () => {
      const row1 = createMockWiseRow({ 'TransferWise ID': 'WISE-001' });
      const row2 = createMockWiseRow({ 'TransferWise ID': 'WISE-001', Description: 'Different' });

      expect(arePotentialDuplicates(row1, row2)).toBe(true);
    });

    it('should return true for same date and amount with similar description', () => {
      const row1 = createMockWiseRow({
        'TransferWise ID': '',
        Date: '15-03-2024',
        Amount: '-100.00',
        Description: 'Payment to vendor',
      });
      const row2 = createMockWiseRow({
        'TransferWise ID': '',
        Date: '15-03-2024',
        Amount: '-100.00',
        Description: 'Payment to vendor',
      });

      expect(arePotentialDuplicates(row1, row2)).toBe(true);
    });

    it('should return false for different amounts', () => {
      const row1 = createMockWiseRow({
        'TransferWise ID': '',
        Date: '15-03-2024',
        Amount: '-100.00',
      });
      const row2 = createMockWiseRow({
        'TransferWise ID': '',
        Date: '15-03-2024',
        Amount: '-200.00',
      });

      expect(arePotentialDuplicates(row1, row2)).toBe(false);
    });

    it('should return false for different dates', () => {
      const row1 = createMockWiseRow({
        'TransferWise ID': '',
        Date: '15-03-2024',
        Amount: '-100.00',
      });
      const row2 = createMockWiseRow({
        'TransferWise ID': '',
        Date: '16-03-2024',
        Amount: '-100.00',
      });

      expect(arePotentialDuplicates(row1, row2)).toBe(false);
    });

    it('should return true when same payee with same date and amount', () => {
      const row1 = createMockWiseRow({
        'TransferWise ID': '',
        Date: '15-03-2024',
        Amount: '-100.00',
        Description: 'Something',
        'Payee Name': 'John Doe',
      });
      const row2 = createMockWiseRow({
        'TransferWise ID': '',
        Date: '15-03-2024',
        Amount: '-100.00',
        Description: 'Different',
        'Payee Name': 'John Doe',
      });

      expect(arePotentialDuplicates(row1, row2)).toBe(true);
    });
  });

  describe('findCrossFileDuplicates', () => {
    it('should find duplicates between two sets of rows', () => {
      const existingRows: WiseRow[] = [
        createMockWiseRow({ 'TransferWise ID': 'WISE-001' }),
        createMockWiseRow({ 'TransferWise ID': 'WISE-002' }),
      ];

      const newRows: WiseRow[] = [
        createMockWiseRow({ 'TransferWise ID': 'WISE-002' }), // Duplicate
        createMockWiseRow({ 'TransferWise ID': 'WISE-003' }),
        createMockWiseRow({ 'TransferWise ID': 'WISE-001' }), // Duplicate
      ];

      const result = findCrossFileDuplicates(existingRows, newRows);

      expect(result.duplicateCount).toBe(2);
      expect(result.duplicateIndices).toEqual([0, 2]);
    });

    it('should return empty when no cross-file duplicates', () => {
      const existingRows: WiseRow[] = [
        createMockWiseRow({ 'TransferWise ID': 'WISE-001' }),
      ];

      const newRows: WiseRow[] = [
        createMockWiseRow({ 'TransferWise ID': 'WISE-002' }),
        createMockWiseRow({ 'TransferWise ID': 'WISE-003' }),
      ];

      const result = findCrossFileDuplicates(existingRows, newRows);

      expect(result.duplicateCount).toBe(0);
      expect(result.duplicateIndices).toEqual([]);
    });
  });

  describe('mergeAndDeduplicate', () => {
    it('should merge multiple arrays and remove duplicates', () => {
      const array1: WiseRow[] = [
        createMockWiseRow({ 'TransferWise ID': 'WISE-001' }),
        createMockWiseRow({ 'TransferWise ID': 'WISE-002' }),
      ];

      const array2: WiseRow[] = [
        createMockWiseRow({ 'TransferWise ID': 'WISE-002' }), // Duplicate
        createMockWiseRow({ 'TransferWise ID': 'WISE-003' }),
      ];

      const array3: WiseRow[] = [
        createMockWiseRow({ 'TransferWise ID': 'WISE-003' }), // Duplicate
        createMockWiseRow({ 'TransferWise ID': 'WISE-004' }),
      ];

      const result = mergeAndDeduplicate(array1, array2, array3);

      expect(result.uniqueRows).toHaveLength(4);
      expect(result.totalDuplicatesRemoved).toBe(2);
    });
  });

  describe('getDuplicateSummary', () => {
    it('should return message for no duplicates', () => {
      const summary = getDuplicateSummary([]);
      expect(summary).toBe('Keine Duplikate gefunden.');
    });

    it('should return singular message for one duplicate type', () => {
      const duplicates = [
        { wiseId: 'WISE-001', date: '15-03-2024', amount: '-100.00', description: 'Test', occurrences: 2, firstIndex: 0 },
      ];
      const summary = getDuplicateSummary(duplicates);
      expect(summary).toBe('1 doppelte Transaktion gefunden (1 Einträge entfernt).');
    });

    it('should return plural message for multiple duplicate types', () => {
      const duplicates = [
        { wiseId: 'WISE-001', date: '15-03-2024', amount: '-100.00', description: 'Test 1', occurrences: 3, firstIndex: 0 },
        { wiseId: 'WISE-002', date: '16-03-2024', amount: '-200.00', description: 'Test 2', occurrences: 2, firstIndex: 1 },
      ];
      const summary = getDuplicateSummary(duplicates);
      expect(summary).toBe('2 verschiedene doppelte Transaktionen gefunden (3 Einträge entfernt).');
    });
  });

  describe('removeLexOfficeDuplicates', () => {
    it('should remove duplicates based on Wise ID in Zusatzinfo', () => {
      const rows: LexOfficeRow[] = [
        {
          Buchungstag: '15.03.2024',
          Valuta: '15.03.2024',
          'Auftraggeber/Zahlungsempfänger': 'Kontoinhaber',
          'Empfänger/Zahlungspflichtiger': 'Test',
          'Vorgang/Verwendungszweck': 'Payment 1',
          Betrag: '-100,00',
          'Zusatzinfo (optional)': 'Wise ID: WISE-001',
        },
        {
          Buchungstag: '16.03.2024',
          Valuta: '16.03.2024',
          'Auftraggeber/Zahlungsempfänger': 'Kontoinhaber',
          'Empfänger/Zahlungspflichtiger': 'Test',
          'Vorgang/Verwendungszweck': 'Payment 2',
          Betrag: '-200,00',
          'Zusatzinfo (optional)': 'Wise ID: WISE-002',
        },
        {
          Buchungstag: '15.03.2024',
          Valuta: '15.03.2024',
          'Auftraggeber/Zahlungsempfänger': 'Kontoinhaber',
          'Empfänger/Zahlungspflichtiger': 'Test',
          'Vorgang/Verwendungszweck': 'Payment 1 copy',
          Betrag: '-100,00',
          'Zusatzinfo (optional)': 'Wise ID: WISE-001', // Duplicate
        },
      ];

      const result = removeLexOfficeDuplicates(rows);

      expect(result.uniqueRows).toHaveLength(2);
      expect(result.duplicatesRemoved).toBe(1);
    });

    it('should use hash for rows without Wise ID', () => {
      const rows: LexOfficeRow[] = [
        {
          Buchungstag: '15.03.2024',
          Valuta: '15.03.2024',
          'Auftraggeber/Zahlungsempfänger': 'Kontoinhaber',
          'Empfänger/Zahlungspflichtiger': 'Test',
          'Vorgang/Verwendungszweck': 'Payment 1',
          Betrag: '-100,00',
          'Zusatzinfo (optional)': '',
        },
        {
          Buchungstag: '15.03.2024',
          Valuta: '15.03.2024',
          'Auftraggeber/Zahlungsempfänger': 'Kontoinhaber',
          'Empfänger/Zahlungspflichtiger': 'Test',
          'Vorgang/Verwendungszweck': 'Payment 1',
          Betrag: '-100,00',
          'Zusatzinfo (optional)': '', // Same as above - duplicate by hash
        },
      ];

      const result = removeLexOfficeDuplicates(rows);

      expect(result.uniqueRows).toHaveLength(1);
      expect(result.duplicatesRemoved).toBe(1);
    });

    it('should keep all rows when no duplicates', () => {
      const rows: LexOfficeRow[] = [
        {
          Buchungstag: '15.03.2024',
          Valuta: '15.03.2024',
          'Auftraggeber/Zahlungsempfänger': 'Kontoinhaber',
          'Empfänger/Zahlungspflichtiger': 'Test',
          'Vorgang/Verwendungszweck': 'Payment 1',
          Betrag: '-100,00',
          'Zusatzinfo (optional)': 'Wise ID: WISE-001',
        },
        {
          Buchungstag: '16.03.2024',
          Valuta: '16.03.2024',
          'Auftraggeber/Zahlungsempfänger': 'Kontoinhaber',
          'Empfänger/Zahlungspflichtiger': 'Test',
          'Vorgang/Verwendungszweck': 'Payment 2',
          Betrag: '-200,00',
          'Zusatzinfo (optional)': 'Wise ID: WISE-002',
        },
      ];

      const result = removeLexOfficeDuplicates(rows);

      expect(result.uniqueRows).toHaveLength(2);
      expect(result.duplicatesRemoved).toBe(0);
    });
  });
});
