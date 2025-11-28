import type { WiseRow, LexOfficeRow } from './converter';

/**
 * Date range filter options
 */
export interface DateRange {
  start: Date | null;
  end: Date | null;
}

/**
 * Filter options for transaction data
 */
export interface FilterOptions {
  search: string;
  dateRange: DateRange;
  transactionType: 'all' | 'DEBIT' | 'CREDIT';
  minAmount: number | null;
  maxAmount: number | null;
}

/**
 * Default filter options
 */
export const DEFAULT_FILTER_OPTIONS: FilterOptions = {
  search: '',
  dateRange: { start: null, end: null },
  transactionType: 'all',
  minAmount: null,
  maxAmount: null,
};

/**
 * Parse Wise date string (dd-mm-yyyy) to Date object
 */
export function parseWiseDate(dateString: string): Date | null {
  if (!dateString) return null;

  const match = dateString.match(/^(\d{2})-(\d{2})-(\d{4})$/);
  if (!match) return null;

  const [, day, month, year] = match;
  return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
}

/**
 * Format Date object to Wise date string (dd-mm-yyyy)
 */
export function formatToWiseDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

/**
 * Format Date object to German display format (dd.mm.yyyy)
 */
export function formatToDisplayDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}

/**
 * Check if a row matches the search query
 * Searches across multiple fields
 */
function matchesSearch(row: WiseRow, searchQuery: string): boolean {
  if (!searchQuery.trim()) return true;

  const query = searchQuery.toLowerCase();
  const searchableFields = [
    row['TransferWise ID'],
    row.Description,
    row['Payment Reference'],
    row['Payer Name'],
    row['Payee Name'],
    row.Merchant,
    row.Note,
    row.Amount,
    row.Currency,
  ];

  return searchableFields.some(
    (field) => field && field.toLowerCase().includes(query)
  );
}

/**
 * Check if a row falls within the date range
 */
function matchesDateRange(row: WiseRow, dateRange: DateRange): boolean {
  if (!dateRange.start && !dateRange.end) return true;

  const rowDate = parseWiseDate(row.Date);
  if (!rowDate) return true; // Include rows with invalid dates (they'll show validation errors)

  if (dateRange.start && rowDate < dateRange.start) return false;
  if (dateRange.end && rowDate > dateRange.end) return false;

  return true;
}

/**
 * Check if a row matches the transaction type filter
 */
function matchesTransactionType(
  row: WiseRow,
  type: 'all' | 'DEBIT' | 'CREDIT'
): boolean {
  if (type === 'all') return true;
  return row['Transaction Type'] === type;
}

/**
 * Check if a row matches the amount range
 */
function matchesAmountRange(
  row: WiseRow,
  minAmount: number | null,
  maxAmount: number | null
): boolean {
  const amount = parseFloat(row.Amount);
  if (isNaN(amount)) return true; // Include rows with invalid amounts

  const absAmount = Math.abs(amount);

  if (minAmount !== null && absAmount < minAmount) return false;
  if (maxAmount !== null && absAmount > maxAmount) return false;

  return true;
}

/**
 * Filter Wise data based on filter options
 */
export function filterWiseData(
  data: WiseRow[],
  options: FilterOptions
): WiseRow[] {
  return data.filter((row) => {
    if (!matchesSearch(row, options.search)) return false;
    if (!matchesDateRange(row, options.dateRange)) return false;
    if (!matchesTransactionType(row, options.transactionType)) return false;
    if (!matchesAmountRange(row, options.minAmount, options.maxAmount))
      return false;
    return true;
  });
}

/**
 * Get unique values for a field (for filter dropdowns)
 */
export function getUniqueValues<K extends keyof WiseRow>(
  data: WiseRow[],
  field: K
): string[] {
  const values = new Set<string>();
  data.forEach((row) => {
    const value = row[field];
    if (value && typeof value === 'string' && value.trim()) {
      values.add(value.trim());
    }
  });
  return Array.from(values).sort();
}

/**
 * Get date range from data
 */
export function getDateRangeFromData(data: WiseRow[]): DateRange {
  let start: Date | null = null;
  let end: Date | null = null;

  data.forEach((row) => {
    const date = parseWiseDate(row.Date);
    if (!date) return;

    if (!start || date < start) start = date;
    if (!end || date > end) end = date;
  });

  return { start, end };
}

/**
 * Get amount range from data
 */
export function getAmountRangeFromData(
  data: WiseRow[]
): { min: number; max: number } {
  let min = Infinity;
  let max = -Infinity;

  data.forEach((row) => {
    const amount = parseFloat(row.Amount);
    if (isNaN(amount)) return;

    const absAmount = Math.abs(amount);
    if (absAmount < min) min = absAmount;
    if (absAmount > max) max = absAmount;
  });

  return {
    min: min === Infinity ? 0 : min,
    max: max === -Infinity ? 0 : max,
  };
}

/**
 * Filter by row indices (for selecting specific rows)
 */
export function filterByIndices<T>(data: T[], indices: number[]): T[] {
  const indexSet = new Set(indices);
  return data.filter((_, index) => indexSet.has(index));
}

/**
 * Sort data by field
 */
export type SortDirection = 'asc' | 'desc';

export function sortWiseData(
  data: WiseRow[],
  field: keyof WiseRow,
  direction: SortDirection
): WiseRow[] {
  return [...data].sort((a, b) => {
    let aValue = a[field];
    let bValue = b[field];

    // Handle null/undefined
    if (aValue == null && bValue == null) return 0;
    if (aValue == null) return direction === 'asc' ? 1 : -1;
    if (bValue == null) return direction === 'asc' ? -1 : 1;

    // Handle amounts numerically
    if (field === 'Amount') {
      const aNum = parseFloat(aValue as string);
      const bNum = parseFloat(bValue as string);
      return direction === 'asc' ? aNum - bNum : bNum - aNum;
    }

    // Handle dates
    if (field === 'Date') {
      const aDate = parseWiseDate(aValue as string);
      const bDate = parseWiseDate(bValue as string);
      if (!aDate && !bDate) return 0;
      if (!aDate) return direction === 'asc' ? 1 : -1;
      if (!bDate) return direction === 'asc' ? -1 : 1;
      return direction === 'asc'
        ? aDate.getTime() - bDate.getTime()
        : bDate.getTime() - aDate.getTime();
    }

    // String comparison
    const aStr = String(aValue).toLowerCase();
    const bStr = String(bValue).toLowerCase();
    return direction === 'asc'
      ? aStr.localeCompare(bStr, 'de')
      : bStr.localeCompare(aStr, 'de');
  });
}

/**
 * Paginate data
 */
export interface PaginationResult<T> {
  data: T[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export function paginateData<T>(
  data: T[],
  page: number,
  pageSize: number
): PaginationResult<T> {
  const totalItems = data.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const currentPage = Math.max(1, Math.min(page, totalPages || 1));
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  return {
    data: data.slice(startIndex, endIndex),
    totalItems,
    totalPages,
    currentPage,
    pageSize,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1,
  };
}

/**
 * Export filtered data to Excel-compatible format (tab-separated)
 */
export function exportToExcel(data: WiseRow[]): string {
  const headers = [
    'TransferWise ID',
    'Date',
    'Amount',
    'Currency',
    'Description',
    'Payment Reference',
    'Payer Name',
    'Payee Name',
    'Transaction Type',
  ];

  const rows = data.map((row) => [
    row['TransferWise ID'] || '',
    row.Date || '',
    row.Amount || '',
    row.Currency || '',
    row.Description || '',
    row['Payment Reference'] || '',
    row['Payer Name'] || '',
    row['Payee Name'] || '',
    row['Transaction Type'] || '',
  ]);

  // Create TSV (tab-separated values) which Excel handles well
  const tsvContent = [
    headers.join('\t'),
    ...rows.map((row) => row.join('\t')),
  ].join('\n');

  return tsvContent;
}

/**
 * Download data as Excel-compatible file
 */
export function downloadAsExcel(data: WiseRow[], filename: string): void {
  const content = exportToExcel(data);
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + content], {
    type: 'application/vnd.ms-excel;charset=utf-8;',
  });

  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename.replace('.csv', '.xls'));
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}
