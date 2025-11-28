import type { WiseRow, LexOfficeRow } from './converter';

/**
 * Information about a detected duplicate
 */
export interface DuplicateInfo {
  wiseId: string;
  date: string;
  amount: string;
  description: string;
  occurrences: number;
  firstIndex: number;
}

/**
 * Result of duplicate detection
 */
export interface DeduplicationResult {
  uniqueRows: WiseRow[];
  duplicates: DuplicateInfo[];
  totalDuplicatesRemoved: number;
}

/**
 * Generate a unique hash/key for a Wise transaction
 * Primary key: TransferWise ID
 * Secondary key (fallback): Date + Amount + Description combination
 */
export function generateTransactionKey(row: WiseRow): string {
  // Primary key: Wise ID (most reliable)
  if (row['TransferWise ID']) {
    return `wise:${row['TransferWise ID']}`;
  }

  // Fallback: combination of date, amount, and description
  const date = row.Date || '';
  const amount = row.Amount || '';
  const description = (row.Description || '').toLowerCase().trim();
  const payee = (row['Payee Name'] || row['Payer Name'] || '').toLowerCase().trim();

  return `hash:${date}|${amount}|${description}|${payee}`;
}

/**
 * Detect duplicates in a set of Wise rows
 */
export function detectDuplicates(rows: WiseRow[]): Map<string, number[]> {
  const keyToIndices = new Map<string, number[]>();

  rows.forEach((row, index) => {
    const key = generateTransactionKey(row);
    const existing = keyToIndices.get(key) || [];
    existing.push(index);
    keyToIndices.set(key, existing);
  });

  // Filter to only include duplicates (more than one occurrence)
  const duplicates = new Map<string, number[]>();
  keyToIndices.forEach((indices, key) => {
    if (indices.length > 1) {
      duplicates.set(key, indices);
    }
  });

  return duplicates;
}

/**
 * Remove duplicates from Wise data, keeping the first occurrence
 */
export function removeDuplicates(rows: WiseRow[]): DeduplicationResult {
  const seenKeys = new Set<string>();
  const uniqueRows: WiseRow[] = [];
  const duplicateInfoMap = new Map<string, DuplicateInfo>();

  rows.forEach((row, index) => {
    const key = generateTransactionKey(row);

    if (seenKeys.has(key)) {
      // Update duplicate info
      const existing = duplicateInfoMap.get(key);
      if (existing) {
        existing.occurrences++;
      }
      return; // Skip duplicate
    }

    seenKeys.add(key);
    uniqueRows.push(row);

    // Track first occurrence for potential duplicate info
    duplicateInfoMap.set(key, {
      wiseId: row['TransferWise ID'] || '',
      date: row.Date,
      amount: row.Amount,
      description: row.Description || '',
      occurrences: 1,
      firstIndex: index,
    });
  });

  // Get only items that had duplicates
  const duplicates: DuplicateInfo[] = [];
  duplicateInfoMap.forEach((info) => {
    if (info.occurrences > 1) {
      duplicates.push(info);
    }
  });

  return {
    uniqueRows,
    duplicates,
    totalDuplicatesRemoved: rows.length - uniqueRows.length,
  };
}

/**
 * Check if two transactions are potential duplicates
 * (for manual review scenarios)
 */
export function arePotentialDuplicates(row1: WiseRow, row2: WiseRow): boolean {
  // Same Wise ID = definitely duplicate
  if (row1['TransferWise ID'] && row1['TransferWise ID'] === row2['TransferWise ID']) {
    return true;
  }

  // Same date, amount, and similar description = likely duplicate
  if (row1.Date === row2.Date && row1.Amount === row2.Amount) {
    const desc1 = (row1.Description || '').toLowerCase().trim();
    const desc2 = (row2.Description || '').toLowerCase().trim();

    // Exact match
    if (desc1 === desc2) {
      return true;
    }

    // Similar descriptions (one contains the other)
    if (desc1.includes(desc2) || desc2.includes(desc1)) {
      return true;
    }

    // Same payee/payer
    const party1 = (row1['Payee Name'] || row1['Payer Name'] || '').toLowerCase();
    const party2 = (row2['Payee Name'] || row2['Payer Name'] || '').toLowerCase();
    if (party1 && party1 === party2) {
      return true;
    }
  }

  return false;
}

/**
 * Find potential duplicates between two sets of Wise data
 * Useful for comparing new import with existing data
 */
export function findCrossFileDuplicates(
  existingRows: WiseRow[],
  newRows: WiseRow[]
): { duplicateIndices: number[]; duplicateCount: number } {
  const existingKeys = new Set<string>();

  existingRows.forEach((row) => {
    existingKeys.add(generateTransactionKey(row));
  });

  const duplicateIndices: number[] = [];

  newRows.forEach((row, index) => {
    const key = generateTransactionKey(row);
    if (existingKeys.has(key)) {
      duplicateIndices.push(index);
    }
  });

  return {
    duplicateIndices,
    duplicateCount: duplicateIndices.length,
  };
}

/**
 * Merge multiple Wise row arrays and remove duplicates
 */
export function mergeAndDeduplicate(...rowArrays: WiseRow[][]): DeduplicationResult {
  const allRows: WiseRow[] = [];
  rowArrays.forEach((rows) => {
    allRows.push(...rows);
  });

  return removeDuplicates(allRows);
}

/**
 * Get duplicate summary for display to user
 */
export function getDuplicateSummary(duplicates: DuplicateInfo[]): string {
  if (duplicates.length === 0) {
    return 'Keine Duplikate gefunden.';
  }

  const totalRemoved = duplicates.reduce((sum, d) => sum + (d.occurrences - 1), 0);

  if (duplicates.length === 1) {
    return `1 doppelte Transaktion gefunden (${totalRemoved} Einträge entfernt).`;
  }

  return `${duplicates.length} verschiedene doppelte Transaktionen gefunden (${totalRemoved} Einträge entfernt).`;
}

/**
 * Remove duplicates from LexOffice data based on Zusatzinfo (contains Wise ID)
 */
export function removeLexOfficeDuplicates(
  rows: LexOfficeRow[]
): { uniqueRows: LexOfficeRow[]; duplicatesRemoved: number } {
  const seenIds = new Set<string>();
  const uniqueRows: LexOfficeRow[] = [];
  let duplicatesRemoved = 0;

  rows.forEach((row) => {
    // Extract Wise ID from Zusatzinfo
    const zusatzinfo = row['Zusatzinfo (optional)'] || '';
    const wiseIdMatch = zusatzinfo.match(/Wise ID: ([^\s|]+)/);
    const wiseId = wiseIdMatch ? wiseIdMatch[1] : null;

    if (wiseId) {
      if (seenIds.has(wiseId)) {
        duplicatesRemoved++;
        return; // Skip duplicate
      }
      seenIds.add(wiseId);
    }

    // For rows without Wise ID, create a hash based on content
    if (!wiseId) {
      const hash = `${row.Buchungstag}|${row.Betrag}|${row['Vorgang/Verwendungszweck']}`;
      if (seenIds.has(hash)) {
        duplicatesRemoved++;
        return;
      }
      seenIds.add(hash);
    }

    uniqueRows.push(row);
  });

  return { uniqueRows, duplicatesRemoved };
}
