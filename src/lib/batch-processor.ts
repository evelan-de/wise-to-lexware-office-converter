import type { WiseRow, LexOfficeRow, ConversionStats } from './converter';
import { convertWiseToLexOffice, calculateStats } from './converter';
import { parseWiseCSV } from './csv-utils';

/**
 * Status of a file in the batch queue
 */
export type FileStatus = 'pending' | 'processing' | 'completed' | 'error' | 'cancelled';

/**
 * Represents a file in the batch processing queue
 */
export interface BatchFile {
  id: string;
  file: File;
  status: FileStatus;
  progress: number;
  error?: string;
  wiseData?: WiseRow[];
  lexOfficeData?: LexOfficeRow[];
  stats?: ConversionStats;
  processedAt?: Date;
}

/**
 * Overall batch processing statistics
 */
export interface BatchStats {
  totalFiles: number;
  completedFiles: number;
  failedFiles: number;
  totalTransactions: number;
  totalDebit: number;
  totalCredit: number;
  totalAmount: number;
  currency: string;
  duplicatesRemoved: number;
}

/**
 * Merge strategy for combining multiple files
 */
export type MergeStrategy = 'chronological' | 'file-order' | 'reverse-chronological';

/**
 * Options for batch processing
 */
export interface BatchProcessingOptions {
  removeDuplicates: boolean;
  mergeStrategy: MergeStrategy;
  parallelProcessing: boolean;
  maxParallelFiles: number;
}

/**
 * Default batch processing options
 */
export const DEFAULT_BATCH_OPTIONS: BatchProcessingOptions = {
  removeDuplicates: true,
  mergeStrategy: 'chronological',
  parallelProcessing: true,
  maxParallelFiles: 3,
};

/**
 * Result of processing a single file
 */
export interface FileProcessingResult {
  id: string;
  success: boolean;
  wiseData?: WiseRow[];
  lexOfficeData?: LexOfficeRow[];
  stats?: ConversionStats;
  error?: string;
}

/**
 * Generate a unique ID for a batch file
 */
export function generateFileId(): string {
  return `file-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

/**
 * Create a BatchFile object from a File
 */
export function createBatchFile(file: File): BatchFile {
  return {
    id: generateFileId(),
    file,
    status: 'pending',
    progress: 0,
  };
}

/**
 * Process a single file and return the result
 */
export async function processFile(file: File): Promise<FileProcessingResult> {
  const id = generateFileId();

  try {
    // Read file content
    const text = await file.text();

    // Parse Wise CSV
    const wiseData = parseWiseCSV(text);

    // Convert to LexOffice format
    const lexOfficeData = convertWiseToLexOffice(wiseData);

    // Calculate statistics
    const stats = calculateStats(wiseData);

    return {
      id,
      success: true,
      wiseData,
      lexOfficeData,
      stats,
    };
  } catch (error) {
    return {
      id,
      success: false,
      error: error instanceof Error ? error.message : 'Unbekannter Fehler',
    };
  }
}

/**
 * Process multiple files in parallel with a concurrency limit
 */
export async function processFilesInParallel(
  files: BatchFile[],
  options: BatchProcessingOptions,
  onProgress: (fileId: string, progress: number, status: FileStatus, result?: FileProcessingResult) => void
): Promise<Map<string, FileProcessingResult>> {
  const results = new Map<string, FileProcessingResult>();
  const pendingFiles = [...files.filter(f => f.status === 'pending' || f.status === 'error')];
  const maxParallel = options.parallelProcessing ? options.maxParallelFiles : 1;

  async function processNext(): Promise<void> {
    const batchFile = pendingFiles.shift();
    if (!batchFile) return;

    onProgress(batchFile.id, 10, 'processing');

    try {
      const text = await batchFile.file.text();
      onProgress(batchFile.id, 30, 'processing');

      const wiseData = parseWiseCSV(text);
      onProgress(batchFile.id, 60, 'processing');

      const lexOfficeData = convertWiseToLexOffice(wiseData);
      onProgress(batchFile.id, 80, 'processing');

      const stats = calculateStats(wiseData);
      onProgress(batchFile.id, 100, 'processing');

      const result: FileProcessingResult = {
        id: batchFile.id,
        success: true,
        wiseData,
        lexOfficeData,
        stats,
      };

      results.set(batchFile.id, result);
      onProgress(batchFile.id, 100, 'completed', result);
    } catch (error) {
      const result: FileProcessingResult = {
        id: batchFile.id,
        success: false,
        error: error instanceof Error ? error.message : 'Unbekannter Fehler',
      };
      results.set(batchFile.id, result);
      onProgress(batchFile.id, 0, 'error', result);
    }

    // Process next file
    await processNext();
  }

  // Start parallel processing
  const workers = Array(Math.min(maxParallel, pendingFiles.length))
    .fill(null)
    .map(() => processNext());

  await Promise.all(workers);

  return results;
}

/**
 * Parse date from Wise format (dd-mm-yyyy) to Date object
 */
function parseDateFromWise(dateStr: string): Date {
  const match = dateStr.match(/^(\d{2})-(\d{2})-(\d{4})$/);
  if (!match) {
    return new Date(0); // Return epoch for invalid dates
  }
  const [, day, month, year] = match;
  return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
}

/**
 * Sort transactions based on merge strategy
 */
export function sortTransactions(
  data: LexOfficeRow[],
  strategy: MergeStrategy,
  originalWiseData?: WiseRow[]
): LexOfficeRow[] {
  if (strategy === 'file-order') {
    return data;
  }

  // Create a map of original dates for sorting
  const dateMap = new Map<number, Date>();
  if (originalWiseData) {
    originalWiseData.forEach((row, index) => {
      dateMap.set(index, parseDateFromWise(row.Date));
    });
  }

  const sortedWithIndices = data.map((row, index) => ({
    row,
    date: dateMap.get(index) || parseDateFromLexOffice(row.Buchungstag),
  }));

  sortedWithIndices.sort((a, b) => {
    const diff = a.date.getTime() - b.date.getTime();
    return strategy === 'reverse-chronological' ? -diff : diff;
  });

  return sortedWithIndices.map(item => item.row);
}

/**
 * Parse date from LexOffice format (dd.mm.yyyy) to Date object
 */
function parseDateFromLexOffice(dateStr: string): Date {
  const match = dateStr.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
  if (!match) {
    return new Date(0);
  }
  const [, day, month, year] = match;
  return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
}

/**
 * Merge multiple LexOffice data sets into one
 */
export function mergeResults(
  results: FileProcessingResult[],
  options: BatchProcessingOptions
): { mergedData: LexOfficeRow[]; mergedWiseData: WiseRow[]; duplicatesRemoved: number } {
  // Collect all data
  const allLexOfficeData: LexOfficeRow[] = [];
  const allWiseData: WiseRow[] = [];

  results.forEach(result => {
    if (result.success && result.lexOfficeData && result.wiseData) {
      allLexOfficeData.push(...result.lexOfficeData);
      allWiseData.push(...result.wiseData);
    }
  });

  // Sort based on strategy
  let sortedData = sortTransactions(allLexOfficeData, options.mergeStrategy, allWiseData);
  let duplicatesRemoved = 0;

  // Remove duplicates if enabled
  if (options.removeDuplicates) {
    const { deduplicatedData, removedCount } = removeDuplicatesFromLexOffice(sortedData, allWiseData);
    sortedData = deduplicatedData;
    duplicatesRemoved = removedCount;
  }

  return {
    mergedData: sortedData,
    mergedWiseData: allWiseData,
    duplicatesRemoved,
  };
}

/**
 * Remove duplicates from LexOffice data based on Wise ID
 */
function removeDuplicatesFromLexOffice(
  data: LexOfficeRow[],
  wiseData: WiseRow[]
): { deduplicatedData: LexOfficeRow[]; removedCount: number } {
  // Create a map to track unique Wise IDs
  const seenIds = new Set<string>();
  const deduplicatedData: LexOfficeRow[] = [];
  let removedCount = 0;

  data.forEach((row, index) => {
    // Extract Wise ID from Zusatzinfo field
    const zusatzinfo = row['Zusatzinfo (optional)'] || '';
    const wiseIdMatch = zusatzinfo.match(/Wise ID: ([^\s|]+)/);
    const wiseId = wiseIdMatch ? wiseIdMatch[1] : null;

    // Also check original Wise data if available
    const originalWiseId = wiseData[index]?.['TransferWise ID'];
    const idToCheck = wiseId || originalWiseId;

    if (idToCheck) {
      if (seenIds.has(idToCheck)) {
        removedCount++;
        return; // Skip duplicate
      }
      seenIds.add(idToCheck);
    }

    deduplicatedData.push(row);
  });

  return { deduplicatedData, removedCount };
}

/**
 * Calculate aggregated statistics from batch results
 */
export function calculateBatchStats(
  results: FileProcessingResult[],
  duplicatesRemoved: number = 0
): BatchStats {
  const successfulResults = results.filter(r => r.success && r.stats);

  const stats: BatchStats = {
    totalFiles: results.length,
    completedFiles: successfulResults.length,
    failedFiles: results.filter(r => !r.success).length,
    totalTransactions: 0,
    totalDebit: 0,
    totalCredit: 0,
    totalAmount: 0,
    currency: 'EUR',
    duplicatesRemoved,
  };

  successfulResults.forEach(result => {
    if (result.stats) {
      stats.totalTransactions += result.stats.total;
      stats.totalDebit += result.stats.debit;
      stats.totalCredit += result.stats.credit;
      stats.totalAmount += result.stats.totalAmount;
      // Use the first non-EUR currency found, or default to EUR
      if (result.stats.currency && result.stats.currency !== 'EUR') {
        stats.currency = result.stats.currency;
      }
    }
  });

  // Adjust for duplicates removed
  stats.totalTransactions -= duplicatesRemoved;

  return stats;
}

/**
 * Get human-readable status text in German
 */
export function getStatusText(status: FileStatus): string {
  const statusTexts: Record<FileStatus, string> = {
    pending: 'Wartend',
    processing: 'Verarbeitung...',
    completed: 'Abgeschlossen',
    error: 'Fehler',
    cancelled: 'Abgebrochen',
  };
  return statusTexts[status];
}

/**
 * Get status color for UI
 */
export function getStatusColor(status: FileStatus): string {
  const statusColors: Record<FileStatus, string> = {
    pending: 'text-gray-500',
    processing: 'text-blue-500',
    completed: 'text-green-500',
    error: 'text-red-500',
    cancelled: 'text-yellow-500',
  };
  return statusColors[status];
}
