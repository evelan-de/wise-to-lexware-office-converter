import {
  parseWiseCSV,
  generateLexOfficeCSV,
  downloadCSV,
  generateFilename,
} from '../csv-utils';
import type { LexOfficeRow } from '../converter';

describe('csv-utils', () => {
  describe('parseWiseCSV', () => {
    const validCSV = `TransferWise ID,Date,Date Time,Amount,Currency,Description,Payment Reference,Running Balance,Exchange From,Exchange To,Exchange Rate,Payer Name,Payee Name,Payee Account Number,Merchant,Card Last Four Digits,Card Holder Full Name,Attachment,Note,Total fees,Exchange To Amount,Transaction Type,Transaction Details Type
TRANSFER-123,29-09-2025,29-09-2025 16:02:46.004,-553.76,EUR,Test payment,Invoice 22,4315.50,,,,,,,,,,,,,,DEBIT,TRANSFER`;

    it('should parse valid Wise CSV correctly', () => {
      const result = parseWiseCSV(validCSV);

      expect(result).toHaveLength(1);
      expect(result[0]['TransferWise ID']).toBe('TRANSFER-123');
      expect(result[0].Date).toBe('29-09-2025');
      expect(result[0].Amount).toBe('-553.76');
      expect(result[0]['Transaction Type']).toBe('DEBIT');
    });

    it('should handle UTF-8 BOM', () => {
      const csvWithBOM = '\uFEFF' + validCSV;
      const result = parseWiseCSV(csvWithBOM);

      expect(result).toHaveLength(1);
      expect(result[0]['TransferWise ID']).toBe('TRANSFER-123');
    });

    it('should trim whitespace from headers', () => {
      const csvWithSpaces = `TransferWise ID , Date , Amount ,Currency,Transaction Type,Transaction Details Type
TRANSFER-123,29-09-2025,-553.76,EUR,DEBIT,TRANSFER`;

      const result = parseWiseCSV(csvWithSpaces);

      expect(result).toHaveLength(1);
      expect(result[0]['TransferWise ID']).toBe('TRANSFER-123');
    });

    it('should throw error for TooManyFields', () => {
      const invalidCSV = `TransferWise ID,Date,Amount
TRANSFER-123,29-09-2025,-553.76,EXTRA_FIELD`;

      expect(() => parseWiseCSV(invalidCSV)).toThrow(
        'Die CSV-Datei enthält zu viele Spalten'
      );
    });

    it('should throw error for missing required headers', () => {
      const csvMissingHeaders = `TransferWise ID,Date,Amount
TRANSFER-123,29-09-2025,-553.76`;

      expect(() => parseWiseCSV(csvMissingHeaders)).toThrow(
        'Folgende erforderliche Spalten fehlen'
      );
      expect(() => parseWiseCSV(csvMissingHeaders)).toThrow('Transaction Type');
    });

    it('should throw error for empty file', () => {
      const emptyCSV = `TransferWise ID,Date,Date Time,Amount,Currency,Description,Payment Reference,Running Balance,Exchange From,Exchange To,Exchange Rate,Payer Name,Payee Name,Payee Account Number,Merchant,Card Last Four Digits,Card Holder Full Name,Attachment,Note,Total fees,Exchange To Amount,Transaction Type,Transaction Details Type`;

      expect(() => parseWiseCSV(emptyCSV)).toThrow(
        'Die Datei enthält keine Transaktionen'
      );
    });

    it('should skip empty lines', () => {
      const csvWithEmptyLines = `TransferWise ID,Date,Date Time,Amount,Currency,Description,Payment Reference,Running Balance,Exchange From,Exchange To,Exchange Rate,Payer Name,Payee Name,Payee Account Number,Merchant,Card Last Four Digits,Card Holder Full Name,Attachment,Note,Total fees,Exchange To Amount,Transaction Type,Transaction Details Type
TRANSFER-123,29-09-2025,29-09-2025 16:02:46.004,-553.76,EUR,Test payment,Invoice 22,4315.50,,,,,,,,,,,,,,DEBIT,TRANSFER

TRANSFER-456,30-09-2025,30-09-2025 10:00:00.000,100.00,EUR,Test payment 2,,4415.50,,,,,,,,,,,,,,CREDIT,TRANSFER`;

      const result = parseWiseCSV(csvWithEmptyLines);

      expect(result).toHaveLength(2);
    });

    it('should handle quoted fields with commas', () => {
      const csvWithQuotedFields = `TransferWise ID,Date,Date Time,Amount,Currency,Description,Payment Reference,Running Balance,Exchange From,Exchange To,Exchange Rate,Payer Name,Payee Name,Payee Account Number,Merchant,Card Last Four Digits,Card Holder Full Name,Attachment,Note,Total fees,Exchange To Amount,Transaction Type,Transaction Details Type
TRANSFER-123,29-09-2025,29-09-2025 16:02:46.004,-553.76,EUR,"Payment with, comma",Invoice 22,4315.50,,,,,,,,,,,,,,DEBIT,TRANSFER`;

      const result = parseWiseCSV(csvWithQuotedFields);

      expect(result).toHaveLength(1);
      expect(result[0].Description).toBe('Payment with, comma');
    });
  });

  describe('generateLexOfficeCSV', () => {
    it('should generate valid LexOffice CSV', () => {
      const data: LexOfficeRow[] = [
        {
          Buchungstag: '29.09.2025',
          Valuta: '29.09.2025',
          'Auftraggeber/Zahlungsempfänger': 'Kontoinhaber',
          'Empfänger/Zahlungspflichtiger': 'John Doe',
          'Vorgang/Verwendungszweck': 'Test payment',
          Betrag: '-553,76',
          'Zusatzinfo (optional)': 'Wise ID: TRANSFER-123',
        },
      ];

      const csv = generateLexOfficeCSV(data);

      expect(csv).toContain('Buchungstag;Valuta');
      expect(csv).toContain('29.09.2025;29.09.2025');
      expect(csv).toContain('Kontoinhaber');
      expect(csv).toContain('John Doe');
      expect(csv).toContain('-553,76');
      expect(csv).toContain('TRANSFER-123');
    });

    it('should use semicolon as delimiter', () => {
      const data: LexOfficeRow[] = [
        {
          Buchungstag: '29.09.2025',
          Valuta: '29.09.2025',
          'Auftraggeber/Zahlungsempfänger': 'Test',
          'Empfänger/Zahlungspflichtiger': 'Test',
          'Vorgang/Verwendungszweck': 'Test',
          Betrag: '100,00',
          'Zusatzinfo (optional)': '',
        },
      ];

      const csv = generateLexOfficeCSV(data);

      // Should contain semicolons, not commas as delimiters
      const lines = csv.split('\r\n');
      expect(lines[0]).toContain(';');
      expect(lines[1]).toContain(';');
    });

    it('should use Windows line endings (CRLF)', () => {
      const data: LexOfficeRow[] = [
        {
          Buchungstag: '29.09.2025',
          Valuta: '29.09.2025',
          'Auftraggeber/Zahlungsempfänger': 'Test',
          'Empfänger/Zahlungspflichtiger': 'Test',
          'Vorgang/Verwendungszweck': 'Test',
          Betrag: '100,00',
          'Zusatzinfo (optional)': '',
        },
      ];

      const csv = generateLexOfficeCSV(data);

      expect(csv).toContain('\r\n');
    });

    it('should include all required LexOffice headers', () => {
      const data: LexOfficeRow[] = [
        {
          Buchungstag: '01.01.2025',
          Valuta: '01.01.2025',
          'Auftraggeber/Zahlungsempfänger': 'Test',
          'Empfänger/Zahlungspflichtiger': 'Test',
          'Vorgang/Verwendungszweck': 'Test',
          Betrag: '0,00',
          'Zusatzinfo (optional)': '',
        },
      ];
      const csv = generateLexOfficeCSV(data);

      expect(csv).toContain('Buchungstag');
      expect(csv).toContain('Valuta');
      expect(csv).toContain('Auftraggeber/Zahlungsempfänger');
      expect(csv).toContain('Empfänger/Zahlungspflichtiger');
      expect(csv).toContain('Vorgang/Verwendungszweck');
      expect(csv).toContain('Betrag');
      expect(csv).toContain('Zusatzinfo (optional)');
    });

    it('should handle multiple rows', () => {
      const data: LexOfficeRow[] = [
        {
          Buchungstag: '29.09.2025',
          Valuta: '29.09.2025',
          'Auftraggeber/Zahlungsempfänger': 'Person 1',
          'Empfänger/Zahlungspflichtiger': 'Person 2',
          'Vorgang/Verwendungszweck': 'Payment 1',
          Betrag: '-100,00',
          'Zusatzinfo (optional)': 'ID-1',
        },
        {
          Buchungstag: '30.09.2025',
          Valuta: '30.09.2025',
          'Auftraggeber/Zahlungsempfänger': 'Person 3',
          'Empfänger/Zahlungspflichtiger': 'Person 4',
          'Vorgang/Verwendungszweck': 'Payment 2',
          Betrag: '200,00',
          'Zusatzinfo (optional)': 'ID-2',
        },
      ];

      const csv = generateLexOfficeCSV(data);
      const lines = csv.split('\r\n').filter(line => line.trim());

      expect(lines.length).toBe(3); // Header + 2 data rows
    });
  });

  describe('downloadCSV', () => {
    let createElementSpy: jest.SpyInstance;
    let mockLink: HTMLAnchorElement;

    beforeEach(() => {
      mockLink = {
        setAttribute: jest.fn(),
        click: jest.fn(),
        style: {},
      } as unknown as HTMLAnchorElement;

      createElementSpy = jest.spyOn(document, 'createElement').mockReturnValue(mockLink);
      jest.spyOn(document.body, 'appendChild').mockImplementation(() => mockLink);
      jest.spyOn(document.body, 'removeChild').mockImplementation(() => mockLink);
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should trigger file download with correct filename', () => {
      const content = 'test,csv,content';
      const filename = 'test-file.csv';

      downloadCSV(content, filename);

      expect(mockLink.setAttribute).toHaveBeenCalledWith('download', filename);
      expect(mockLink.click).toHaveBeenCalled();
    });

    it('should create blob with UTF-8 BOM', () => {
      const content = 'test content';
      const filename = 'test.csv';

      const blobSpy = jest.spyOn(global, 'Blob');

      downloadCSV(content, filename);

      expect(blobSpy).toHaveBeenCalledWith(
        ['\uFEFF' + content],
        { type: 'text/csv;charset=utf-8;' }
      );
    });

    it('should clean up object URL', () => {
      const content = 'test content';
      const filename = 'test.csv';

      downloadCSV(content, filename);

      expect(global.URL.createObjectURL).toHaveBeenCalled();

      // Fast-forward timers to trigger cleanup
      jest.runAllTimers();

      expect(global.URL.revokeObjectURL).toHaveBeenCalledWith('mock-url');
    });

    it('should append and remove link from DOM', () => {
      const content = 'test content';
      const filename = 'test.csv';

      downloadCSV(content, filename);

      expect(document.body.appendChild).toHaveBeenCalledWith(mockLink);
      expect(document.body.removeChild).toHaveBeenCalledWith(mockLink);
    });
  });

  describe('generateFilename', () => {
    it('should generate filename with current date', () => {
      const mockDate = new Date('2025-10-12T10:00:00.000Z');
      jest.spyOn(global, 'Date').mockImplementation((() => mockDate) as any);

      const filename = generateFilename();

      expect(filename).toBe('lexoffice_import_2025-10-12.csv');
    });

    it('should always return CSV extension', () => {
      const filename = generateFilename();

      expect(filename).toMatch(/\.csv$/);
    });

    it('should use lexoffice_import prefix', () => {
      const filename = generateFilename();

      expect(filename).toMatch(/^lexoffice_import_/);
    });
  });
});
