import {
  convertDate,
  convertAmount,
  validateRow,
  convertWiseToLexOffice,
  calculateStats,
  type WiseRow,
  type ConversionStats,
} from '../converter';

describe('converter', () => {
  describe('convertDate', () => {
    it('should convert valid Wise date format to LexOffice format', () => {
      expect(convertDate('29-09-2025')).toBe('29.09.2025');
      expect(convertDate('01-01-2024')).toBe('01.01.2024');
      expect(convertDate('31-12-2023')).toBe('31.12.2023');
    });

    it('should return empty string for empty input', () => {
      expect(convertDate('')).toBe('');
    });

    it('should return original value for invalid date format', () => {
      expect(convertDate('2025-09-29')).toBe('2025-09-29');
      expect(convertDate('invalid')).toBe('invalid');
      expect(convertDate('29/09/2025')).toBe('29/09/2025');
    });
  });

  describe('convertAmount', () => {
    it('should convert positive amounts with comma as decimal separator', () => {
      expect(convertAmount('1234.56')).toBe('1234,56');
      expect(convertAmount('100.00')).toBe('100,00');
      expect(convertAmount('0.50')).toBe('0,50');
    });

    it('should convert negative amounts correctly', () => {
      expect(convertAmount('-553.76')).toBe('-553,76');
      expect(convertAmount('-1234.50')).toBe('-1234,50');
    });

    it('should format to 2 decimal places', () => {
      expect(convertAmount('100')).toBe('100,00');
      expect(convertAmount('99.9')).toBe('99,90');
      expect(convertAmount('1234.567')).toBe('1234,57'); // Rounds
    });

    it('should return "0,00" for empty or invalid input', () => {
      expect(convertAmount('')).toBe('0,00');
      expect(convertAmount('invalid')).toBe('0,00');
      expect(convertAmount('abc')).toBe('0,00');
    });

    it('should not use thousands separator', () => {
      expect(convertAmount('10000.50')).toBe('10000,50');
      expect(convertAmount('1000000.99')).toBe('1000000,99');
    });
  });

  describe('validateRow', () => {
    const validRow: WiseRow = {
      'TransferWise ID': 'TRANSFER-123',
      Date: '29-09-2025',
      'Date Time': '29-09-2025 16:02:46.004',
      Amount: '-553.76',
      Currency: 'EUR',
      Description: 'Test payment',
      'Payment Reference': 'Invoice 1',
      'Running Balance': '4315.50',
      'Transaction Type': 'DEBIT',
      'Transaction Details Type': 'TRANSFER',
    };

    it('should return empty array for valid row', () => {
      expect(validateRow(validRow)).toEqual([]);
    });

    it('should detect missing Date', () => {
      const invalidRow = { ...validRow, Date: '' };
      const errors = validateRow(invalidRow);
      expect(errors).toContain('Missing Date');
    });

    it('should detect missing Amount', () => {
      const invalidRow = { ...validRow, Amount: '' };
      const errors = validateRow(invalidRow);
      expect(errors).toContain('Missing Amount');
    });

    it('should detect missing Transaction Type', () => {
      const invalidRow = { ...validRow, 'Transaction Type': '' as 'DEBIT' | 'CREDIT' };
      const errors = validateRow(invalidRow);
      expect(errors).toContain('Missing Transaction Type');
    });

    it('should detect invalid Transaction Type', () => {
      const invalidRow = { ...validRow, 'Transaction Type': 'INVALID' as 'DEBIT' | 'CREDIT' };
      const errors = validateRow(invalidRow);
      expect(errors.some(e => e.includes('Invalid Transaction Type'))).toBe(true);
    });

    it('should return multiple errors if multiple fields are missing', () => {
      const invalidRow = { ...validRow, Date: '', Amount: '' };
      const errors = validateRow(invalidRow);
      expect(errors.length).toBeGreaterThanOrEqual(2);
      expect(errors).toContain('Missing Date');
      expect(errors).toContain('Missing Amount');
    });
  });

  describe('convertWiseToLexOffice', () => {
    it('should convert DEBIT transaction correctly', () => {
      const wiseData: WiseRow[] = [
        {
          'TransferWise ID': 'TRANSFER-123',
          Date: '29-09-2025',
          'Date Time': '29-09-2025 16:02:46.004',
          Amount: '-553.76',
          Currency: 'EUR',
          Description: 'Payment to John',
          'Payment Reference': 'Invoice 22',
          'Running Balance': '4315.50',
          'Payee Name': 'John Doe',
          'Transaction Type': 'DEBIT',
          'Transaction Details Type': 'TRANSFER',
        },
      ];

      const result = convertWiseToLexOffice(wiseData);

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        Buchungstag: '29.09.2025',
        Valuta: '29.09.2025',
        'Auftraggeber/Zahlungsempfänger': 'Kontoinhaber',
        'Empfänger/Zahlungspflichtiger': 'John Doe',
        'Vorgang/Verwendungszweck': 'Payment to John | Ref: Invoice 22',
        Betrag: '-553,76',
      });
      expect(result[0]['Zusatzinfo (optional)']).toContain('TRANSFER-123');
    });

    it('should convert CREDIT transaction correctly', () => {
      const wiseData: WiseRow[] = [
        {
          'TransferWise ID': 'TRANSFER-456',
          Date: '01-10-2025',
          'Date Time': '01-10-2025 10:00:00.000',
          Amount: '1000.00',
          Currency: 'EUR',
          Description: 'Payment received',
          'Payment Reference': '',
          'Running Balance': '5315.50',
          'Payer Name': 'Jane Smith',
          'Transaction Type': 'CREDIT',
          'Transaction Details Type': 'TRANSFER',
        },
      ];

      const result = convertWiseToLexOffice(wiseData);

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        Buchungstag: '01.10.2025',
        Valuta: '01.10.2025',
        'Auftraggeber/Zahlungsempfänger': 'Jane Smith',
        'Empfänger/Zahlungspflichtiger': 'Kontoinhaber',
        Betrag: '1000,00',
      });
    });

    it('should include exchange information in Zusatzinfo', () => {
      const wiseData: WiseRow[] = [
        {
          'TransferWise ID': 'TRANSFER-789',
          Date: '02-10-2025',
          'Date Time': '02-10-2025 12:00:00.000',
          Amount: '-500.00',
          Currency: 'EUR',
          Description: 'International payment',
          'Payment Reference': 'INV-001',
          'Running Balance': '4815.50',
          'Exchange From': 'EUR',
          'Exchange To': 'USD',
          'Exchange Rate': '1.10',
          'Exchange To Amount': '550.00',
          'Payee Name': 'US Company',
          'Transaction Type': 'DEBIT',
          'Transaction Details Type': 'TRANSFER',
        },
      ];

      const result = convertWiseToLexOffice(wiseData);

      expect(result[0]['Zusatzinfo (optional)']).toContain('Fremdbetrag: 550,00 USD');
      expect(result[0]['Zusatzinfo (optional)']).toContain('Wise ID: TRANSFER-789');
    });

    it('should skip rows with validation errors', () => {
      const wiseData: WiseRow[] = [
        {
          'TransferWise ID': 'TRANSFER-123',
          Date: '29-09-2025',
          'Date Time': '29-09-2025 16:02:46.004',
          Amount: '-553.76',
          Currency: 'EUR',
          Description: 'Valid payment',
          'Payment Reference': 'Invoice 22',
          'Running Balance': '4315.50',
          'Transaction Type': 'DEBIT',
          'Transaction Details Type': 'TRANSFER',
        },
        {
          'TransferWise ID': 'TRANSFER-456',
          Date: '', // Missing date - invalid
          'Date Time': '30-09-2025 16:02:46.004',
          Amount: '100.00',
          Currency: 'EUR',
          Description: 'Invalid payment',
          'Payment Reference': '',
          'Running Balance': '4415.50',
          'Transaction Type': 'CREDIT',
          'Transaction Details Type': 'TRANSFER',
        },
      ];

      const result = convertWiseToLexOffice(wiseData);

      expect(result).toHaveLength(1); // Only valid row
      expect(result[0]['Vorgang/Verwendungszweck']).toContain('Valid payment');
    });

    it('should sanitize CSV fields to prevent formula injection', () => {
      const wiseData: WiseRow[] = [
        {
          'TransferWise ID': 'TRANSFER-999',
          Date: '03-10-2025',
          'Date Time': '03-10-2025 14:00:00.000',
          Amount: '-100.00',
          Currency: 'EUR',
          Description: '=SUM(A1:A10)', // Potential formula injection
          'Payment Reference': '+MALICIOUS',
          'Running Balance': '4215.50',
          'Payee Name': '-DANGEROUS',
          'Transaction Type': 'DEBIT',
          'Transaction Details Type': 'TRANSFER',
        },
      ];

      const result = convertWiseToLexOffice(wiseData);

      // Fields should be prefixed with single quote to prevent formula execution
      expect(result[0]['Vorgang/Verwendungszweck']).toContain("'=SUM(A1:A10)");
      expect(result[0]['Vorgang/Verwendungszweck']).toContain("'+MALICIOUS");
      expect(result[0]['Empfänger/Zahlungspflichtiger']).toBe("'-DANGEROUS");
    });
  });

  describe('calculateStats', () => {
    it('should calculate statistics correctly', () => {
      const wiseData: WiseRow[] = [
        {
          'TransferWise ID': 'TRANSFER-1',
          Date: '29-09-2025',
          'Date Time': '29-09-2025 16:02:46.004',
          Amount: '-100.00',
          Currency: 'EUR',
          Description: 'Payment 1',
          'Payment Reference': '',
          'Running Balance': '900.00',
          'Transaction Type': 'DEBIT',
          'Transaction Details Type': 'TRANSFER',
        },
        {
          'TransferWise ID': 'TRANSFER-2',
          Date: '30-09-2025',
          'Date Time': '30-09-2025 10:00:00.000',
          Amount: '500.00',
          Currency: 'EUR',
          Description: 'Payment 2',
          'Payment Reference': '',
          'Running Balance': '1400.00',
          'Transaction Type': 'CREDIT',
          'Transaction Details Type': 'TRANSFER',
        },
        {
          'TransferWise ID': 'TRANSFER-3',
          Date: '01-10-2025',
          'Date Time': '01-10-2025 12:00:00.000',
          Amount: '-50.00',
          Currency: 'EUR',
          Description: 'Payment 3',
          'Payment Reference': '',
          'Running Balance': '1350.00',
          'Transaction Type': 'DEBIT',
          'Transaction Details Type': 'TRANSFER',
        },
      ];

      const stats: ConversionStats = calculateStats(wiseData);

      expect(stats.total).toBe(3);
      expect(stats.debit).toBe(2);
      expect(stats.credit).toBe(1);
      expect(stats.totalAmount).toBe(350.00); // -100 + 500 - 50
      expect(stats.currency).toBe('EUR');
    });

    it('should handle empty data array', () => {
      const stats = calculateStats([]);

      expect(stats.total).toBe(0);
      expect(stats.debit).toBe(0);
      expect(stats.credit).toBe(0);
      expect(stats.totalAmount).toBe(0);
      expect(stats.currency).toBe('EUR'); // Default
    });

    it('should handle invalid amounts gracefully', () => {
      const wiseData: WiseRow[] = [
        {
          'TransferWise ID': 'TRANSFER-1',
          Date: '29-09-2025',
          'Date Time': '29-09-2025 16:02:46.004',
          Amount: 'invalid',
          Currency: 'EUR',
          Description: 'Payment 1',
          'Payment Reference': '',
          'Running Balance': '1000.00',
          'Transaction Type': 'DEBIT',
          'Transaction Details Type': 'TRANSFER',
        },
      ];

      const stats = calculateStats(wiseData);

      expect(stats.total).toBe(1);
      expect(stats.debit).toBe(1);
      expect(stats.totalAmount).toBe(0); // Invalid amount treated as 0
    });
  });
});
