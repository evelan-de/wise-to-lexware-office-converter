import {
  generateFileId,
  createBatchFile,
  processFile,
  sortTransactions,
  mergeResults,
  calculateBatchStats,
  getStatusText,
  getStatusColor,
  DEFAULT_BATCH_OPTIONS,
  type BatchFile,
  type FileProcessingResult,
  type MergeStrategy,
} from '../batch-processor';
import type { LexOfficeRow, WiseRow } from '../converter';

// Mock csv-utils to avoid file system dependencies
jest.mock('../csv-utils', () => ({
  parseWiseCSV: jest.fn(),
}));

// Import the mocked module
import { parseWiseCSV } from '../csv-utils';

const mockParseWiseCSV = parseWiseCSV as jest.MockedFunction<typeof parseWiseCSV>;

describe('batch-processor', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('generateFileId', () => {
    it('should generate unique IDs', () => {
      const id1 = generateFileId();
      const id2 = generateFileId();

      expect(id1).not.toBe(id2);
      expect(id1).toMatch(/^file-\d+-[a-z0-9]+$/);
      expect(id2).toMatch(/^file-\d+-[a-z0-9]+$/);
    });

    it('should start with "file-" prefix', () => {
      const id = generateFileId();
      expect(id.startsWith('file-')).toBe(true);
    });
  });

  describe('createBatchFile', () => {
    it('should create a batch file with correct properties', () => {
      const mockFile = new File(['test content'], 'test.csv', { type: 'text/csv' });

      const batchFile = createBatchFile(mockFile);

      expect(batchFile.file).toBe(mockFile);
      expect(batchFile.status).toBe('pending');
      expect(batchFile.progress).toBe(0);
      expect(batchFile.id).toMatch(/^file-\d+-[a-z0-9]+$/);
    });
  });

  describe('processFile', () => {
    it('should process a valid file successfully', async () => {
      const mockWiseData: WiseRow[] = [
        {
          'TransferWise ID': 'TEST-123',
          Date: '15-03-2024',
          'Date Time': '15-03-2024 10:00:00',
          Amount: '-100.00',
          Currency: 'EUR',
          Description: 'Test payment',
          'Payment Reference': 'REF123',
          'Running Balance': '1000.00',
          'Transaction Type': 'DEBIT',
          'Transaction Details Type': 'TRANSFER',
        },
      ];

      mockParseWiseCSV.mockReturnValue(mockWiseData);

      // Create a proper mock file with text() method
      const csvContent = 'TransferWise ID,Date,...';
      const mockFile = {
        text: jest.fn().mockResolvedValue(csvContent),
        name: 'test.csv',
        size: csvContent.length,
        type: 'text/csv',
      } as unknown as File;

      const result = await processFile(mockFile);

      expect(result.success).toBe(true);
      expect(result.wiseData).toHaveLength(1);
      expect(result.lexOfficeData).toHaveLength(1);
      expect(result.stats).toBeDefined();
      expect(result.stats?.total).toBe(1);
    });

    it('should return error for invalid file', async () => {
      mockParseWiseCSV.mockImplementation(() => {
        throw new Error('Invalid CSV format');
      });

      const mockFile = {
        text: jest.fn().mockResolvedValue('invalid content'),
        name: 'test.csv',
        size: 100,
        type: 'text/csv',
      } as unknown as File;

      const result = await processFile(mockFile);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid CSV format');
    });
  });

  describe('sortTransactions', () => {
    const mockLexOfficeData: LexOfficeRow[] = [
      {
        Buchungstag: '15.03.2024',
        Valuta: '15.03.2024',
        'Auftraggeber/Zahlungsempfänger': 'Test 1',
        'Empfänger/Zahlungspflichtiger': 'Kontoinhaber',
        'Vorgang/Verwendungszweck': 'Payment 1',
        Betrag: '100,00',
        'Zusatzinfo (optional)': 'Wise ID: TEST-001',
      },
      {
        Buchungstag: '10.01.2024',
        Valuta: '10.01.2024',
        'Auftraggeber/Zahlungsempfänger': 'Test 2',
        'Empfänger/Zahlungspflichtiger': 'Kontoinhaber',
        'Vorgang/Verwendungszweck': 'Payment 2',
        Betrag: '200,00',
        'Zusatzinfo (optional)': 'Wise ID: TEST-002',
      },
      {
        Buchungstag: '20.05.2024',
        Valuta: '20.05.2024',
        'Auftraggeber/Zahlungsempfänger': 'Test 3',
        'Empfänger/Zahlungspflichtiger': 'Kontoinhaber',
        'Vorgang/Verwendungszweck': 'Payment 3',
        Betrag: '300,00',
        'Zusatzinfo (optional)': 'Wise ID: TEST-003',
      },
    ];

    it('should sort chronologically (oldest first)', () => {
      const sorted = sortTransactions([...mockLexOfficeData], 'chronological');

      expect(sorted[0].Buchungstag).toBe('10.01.2024');
      expect(sorted[1].Buchungstag).toBe('15.03.2024');
      expect(sorted[2].Buchungstag).toBe('20.05.2024');
    });

    it('should sort reverse-chronologically (newest first)', () => {
      const sorted = sortTransactions([...mockLexOfficeData], 'reverse-chronological');

      expect(sorted[0].Buchungstag).toBe('20.05.2024');
      expect(sorted[1].Buchungstag).toBe('15.03.2024');
      expect(sorted[2].Buchungstag).toBe('10.01.2024');
    });

    it('should preserve file order when strategy is file-order', () => {
      const sorted = sortTransactions([...mockLexOfficeData], 'file-order');

      expect(sorted[0].Buchungstag).toBe('15.03.2024');
      expect(sorted[1].Buchungstag).toBe('10.01.2024');
      expect(sorted[2].Buchungstag).toBe('20.05.2024');
    });
  });

  describe('mergeResults', () => {
    it('should merge results from multiple files', () => {
      const results: FileProcessingResult[] = [
        {
          id: 'file-1',
          success: true,
          wiseData: [
            {
              'TransferWise ID': 'TEST-001',
              Date: '15-03-2024',
              'Date Time': '15-03-2024 10:00:00',
              Amount: '-100.00',
              Currency: 'EUR',
              Description: 'Payment 1',
              'Payment Reference': '',
              'Running Balance': '900.00',
              'Transaction Type': 'DEBIT',
              'Transaction Details Type': 'TRANSFER',
            },
          ],
          lexOfficeData: [
            {
              Buchungstag: '15.03.2024',
              Valuta: '15.03.2024',
              'Auftraggeber/Zahlungsempfänger': 'Kontoinhaber',
              'Empfänger/Zahlungspflichtiger': 'Test',
              'Vorgang/Verwendungszweck': 'Payment 1',
              Betrag: '-100,00',
              'Zusatzinfo (optional)': 'Wise ID: TEST-001',
            },
          ],
          stats: { total: 1, debit: 1, credit: 0, totalAmount: -100, currency: 'EUR' },
        },
        {
          id: 'file-2',
          success: true,
          wiseData: [
            {
              'TransferWise ID': 'TEST-002',
              Date: '20-03-2024',
              'Date Time': '20-03-2024 10:00:00',
              Amount: '200.00',
              Currency: 'EUR',
              Description: 'Payment 2',
              'Payment Reference': '',
              'Running Balance': '1100.00',
              'Transaction Type': 'CREDIT',
              'Transaction Details Type': 'TRANSFER',
              'Payer Name': 'Sender',
            },
          ],
          lexOfficeData: [
            {
              Buchungstag: '20.03.2024',
              Valuta: '20.03.2024',
              'Auftraggeber/Zahlungsempfänger': 'Sender',
              'Empfänger/Zahlungspflichtiger': 'Kontoinhaber',
              'Vorgang/Verwendungszweck': 'Payment 2',
              Betrag: '200,00',
              'Zusatzinfo (optional)': 'Wise ID: TEST-002',
            },
          ],
          stats: { total: 1, debit: 0, credit: 1, totalAmount: 200, currency: 'EUR' },
        },
      ];

      const { mergedData, duplicatesRemoved } = mergeResults(results, {
        ...DEFAULT_BATCH_OPTIONS,
        removeDuplicates: false,
      });

      expect(mergedData).toHaveLength(2);
      expect(duplicatesRemoved).toBe(0);
    });

    it('should remove duplicates when enabled', () => {
      const results: FileProcessingResult[] = [
        {
          id: 'file-1',
          success: true,
          wiseData: [
            {
              'TransferWise ID': 'TEST-001',
              Date: '15-03-2024',
              'Date Time': '15-03-2024 10:00:00',
              Amount: '-100.00',
              Currency: 'EUR',
              Description: 'Payment 1',
              'Payment Reference': '',
              'Running Balance': '900.00',
              'Transaction Type': 'DEBIT',
              'Transaction Details Type': 'TRANSFER',
            },
          ],
          lexOfficeData: [
            {
              Buchungstag: '15.03.2024',
              Valuta: '15.03.2024',
              'Auftraggeber/Zahlungsempfänger': 'Kontoinhaber',
              'Empfänger/Zahlungspflichtiger': 'Test',
              'Vorgang/Verwendungszweck': 'Payment 1',
              Betrag: '-100,00',
              'Zusatzinfo (optional)': 'Wise ID: TEST-001',
            },
          ],
          stats: { total: 1, debit: 1, credit: 0, totalAmount: -100, currency: 'EUR' },
        },
        {
          id: 'file-2',
          success: true,
          wiseData: [
            {
              'TransferWise ID': 'TEST-001', // Same ID - duplicate
              Date: '15-03-2024',
              'Date Time': '15-03-2024 10:00:00',
              Amount: '-100.00',
              Currency: 'EUR',
              Description: 'Payment 1',
              'Payment Reference': '',
              'Running Balance': '900.00',
              'Transaction Type': 'DEBIT',
              'Transaction Details Type': 'TRANSFER',
            },
          ],
          lexOfficeData: [
            {
              Buchungstag: '15.03.2024',
              Valuta: '15.03.2024',
              'Auftraggeber/Zahlungsempfänger': 'Kontoinhaber',
              'Empfänger/Zahlungspflichtiger': 'Test',
              'Vorgang/Verwendungszweck': 'Payment 1',
              Betrag: '-100,00',
              'Zusatzinfo (optional)': 'Wise ID: TEST-001',
            },
          ],
          stats: { total: 1, debit: 1, credit: 0, totalAmount: -100, currency: 'EUR' },
        },
      ];

      const { mergedData, duplicatesRemoved } = mergeResults(results, {
        ...DEFAULT_BATCH_OPTIONS,
        removeDuplicates: true,
      });

      expect(mergedData).toHaveLength(1);
      expect(duplicatesRemoved).toBe(1);
    });

    it('should skip failed results', () => {
      const results: FileProcessingResult[] = [
        {
          id: 'file-1',
          success: true,
          wiseData: [
            {
              'TransferWise ID': 'TEST-001',
              Date: '15-03-2024',
              'Date Time': '15-03-2024 10:00:00',
              Amount: '-100.00',
              Currency: 'EUR',
              Description: 'Payment 1',
              'Payment Reference': '',
              'Running Balance': '900.00',
              'Transaction Type': 'DEBIT',
              'Transaction Details Type': 'TRANSFER',
            },
          ],
          lexOfficeData: [
            {
              Buchungstag: '15.03.2024',
              Valuta: '15.03.2024',
              'Auftraggeber/Zahlungsempfänger': 'Kontoinhaber',
              'Empfänger/Zahlungspflichtiger': 'Test',
              'Vorgang/Verwendungszweck': 'Payment 1',
              Betrag: '-100,00',
              'Zusatzinfo (optional)': 'Wise ID: TEST-001',
            },
          ],
          stats: { total: 1, debit: 1, credit: 0, totalAmount: -100, currency: 'EUR' },
        },
        {
          id: 'file-2',
          success: false,
          error: 'Invalid file',
        },
      ];

      const { mergedData } = mergeResults(results, DEFAULT_BATCH_OPTIONS);

      expect(mergedData).toHaveLength(1);
    });
  });

  describe('calculateBatchStats', () => {
    it('should calculate correct statistics', () => {
      const results: FileProcessingResult[] = [
        {
          id: 'file-1',
          success: true,
          stats: { total: 5, debit: 3, credit: 2, totalAmount: -500, currency: 'EUR' },
        },
        {
          id: 'file-2',
          success: true,
          stats: { total: 3, debit: 1, credit: 2, totalAmount: 300, currency: 'EUR' },
        },
        {
          id: 'file-3',
          success: false,
          error: 'Failed',
        },
      ];

      const stats = calculateBatchStats(results, 2);

      expect(stats.totalFiles).toBe(3);
      expect(stats.completedFiles).toBe(2);
      expect(stats.failedFiles).toBe(1);
      expect(stats.totalTransactions).toBe(6); // 8 - 2 duplicates removed
      expect(stats.totalDebit).toBe(4);
      expect(stats.totalCredit).toBe(4);
      expect(stats.totalAmount).toBe(-200);
      expect(stats.currency).toBe('EUR');
      expect(stats.duplicatesRemoved).toBe(2);
    });

    it('should handle empty results', () => {
      const stats = calculateBatchStats([]);

      expect(stats.totalFiles).toBe(0);
      expect(stats.completedFiles).toBe(0);
      expect(stats.totalTransactions).toBe(0);
    });
  });

  describe('getStatusText', () => {
    it('should return correct German text for each status', () => {
      expect(getStatusText('pending')).toBe('Wartend');
      expect(getStatusText('processing')).toBe('Verarbeitung...');
      expect(getStatusText('completed')).toBe('Abgeschlossen');
      expect(getStatusText('error')).toBe('Fehler');
      expect(getStatusText('cancelled')).toBe('Abgebrochen');
    });
  });

  describe('getStatusColor', () => {
    it('should return correct color classes for each status', () => {
      expect(getStatusColor('pending')).toBe('text-gray-500');
      expect(getStatusColor('processing')).toBe('text-blue-500');
      expect(getStatusColor('completed')).toBe('text-green-500');
      expect(getStatusColor('error')).toBe('text-red-500');
      expect(getStatusColor('cancelled')).toBe('text-yellow-500');
    });
  });

  describe('DEFAULT_BATCH_OPTIONS', () => {
    it('should have sensible defaults', () => {
      expect(DEFAULT_BATCH_OPTIONS.removeDuplicates).toBe(true);
      expect(DEFAULT_BATCH_OPTIONS.mergeStrategy).toBe('chronological');
      expect(DEFAULT_BATCH_OPTIONS.parallelProcessing).toBe(true);
      expect(DEFAULT_BATCH_OPTIONS.maxParallelFiles).toBe(3);
    });
  });
});
