'use client';

import { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Edit2,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import type { WiseRow } from '@/lib/converter';
import type { RowValidationResult, ValidationSummary } from '@/lib/validation';
import { getValidationStatus } from '@/lib/validation';
import {
  filterWiseData,
  sortWiseData,
  paginateData,
  type FilterOptions,
  type SortDirection,
  DEFAULT_FILTER_OPTIONS,
} from '@/lib/filters';

interface DataTableProps {
  data: WiseRow[];
  validation: ValidationSummary;
  onEditRow?: (rowIndex: number, row: WiseRow) => void;
  showSearch?: boolean;
  pageSize?: number;
  maxPreviewRows?: number;
}

type SortConfig = {
  field: keyof WiseRow | null;
  direction: SortDirection;
};

// Columns for desktop view
const DISPLAY_COLUMNS: { key: keyof WiseRow; label: string; width?: string; hideOnMobile?: boolean }[] = [
  { key: 'Date', label: 'Datum', width: 'w-28' },
  { key: 'Amount', label: 'Betrag', width: 'w-28' },
  { key: 'Currency', label: 'Währung', width: 'w-20', hideOnMobile: true },
  { key: 'Transaction Type', label: 'Typ', width: 'w-24', hideOnMobile: true },
  { key: 'Description', label: 'Beschreibung' },
  { key: 'Payer Name', label: 'Zahler', width: 'w-36', hideOnMobile: true },
  { key: 'Payee Name', label: 'Empfänger', width: 'w-36', hideOnMobile: true },
];

function getStatusIcon(status: 'valid' | 'warning' | 'error') {
  switch (status) {
    case 'error':
      return <AlertCircle className="w-5 h-5 text-red-500" />;
    case 'warning':
      return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
    case 'valid':
      return <CheckCircle2 className="w-5 h-5 text-green-500" />;
  }
}

function getTooltipText(
  status: 'valid' | 'warning' | 'error',
  issues: { message: string }[]
): string {
  if (status === 'valid') return 'Keine Probleme';
  return issues.map((i) => i.message).join('\n');
}

function formatAmount(amount: string): string {
  const num = parseFloat(amount);
  if (isNaN(num)) return amount;
  return new Intl.NumberFormat('de-DE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
}

function getSortIcon(
  currentField: keyof WiseRow | null,
  targetField: keyof WiseRow,
  direction: SortDirection
) {
  if (currentField !== targetField) {
    return <ArrowUpDown className="w-4 h-4 opacity-50" />;
  }
  return direction === 'asc' ? (
    <ArrowUp className="w-4 h-4" />
  ) : (
    <ArrowDown className="w-4 h-4" />
  );
}

// Mobile card component for each row
function MobileRowCard({
  row,
  status,
  tooltipText,
  onEdit,
  originalIndex,
}: {
  row: WiseRow;
  status: 'valid' | 'warning' | 'error';
  tooltipText: string;
  onEdit?: () => void;
  originalIndex: number;
}) {
  const isNegative = parseFloat(row.Amount) < 0;

  return (
    <div
      className={`p-4 border rounded-lg ${
        status === 'error'
          ? 'bg-red-50 border-red-200'
          : status === 'warning'
          ? 'bg-yellow-50 border-yellow-200'
          : 'bg-white border-gray-200'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="mt-0.5 flex-shrink-0">
                  {getStatusIcon(status)}
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{tooltipText}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm text-gray-500">{row.Date}</span>
              <span
                className={`font-semibold ${
                  isNegative ? 'text-red-600' : 'text-green-600'
                }`}
              >
                {formatAmount(row.Amount)} {row.Currency}
              </span>
            </div>
            <p className="text-sm font-medium mt-1 truncate">
              {row.Description || row['Payment Reference'] || '-'}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              {row['Transaction Type'] === 'DEBIT' ? 'An: ' : 'Von: '}
              {row['Transaction Type'] === 'DEBIT'
                ? row['Payee Name'] || '-'
                : row['Payer Name'] || '-'}
            </p>
          </div>
        </div>
        {onEdit && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onEdit}
            className="flex-shrink-0"
          >
            <Edit2 className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

export function DataTable({
  data,
  validation,
  onEditRow,
  showSearch = true,
  pageSize = 50,
  maxPreviewRows,
}: DataTableProps) {
  const [filters, setFilters] = useState<FilterOptions>(DEFAULT_FILTER_OPTIONS);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    field: null,
    direction: 'asc',
  });
  const [currentPage, setCurrentPage] = useState(1);

  // Create a map of row index to validation result
  const validationMap = useMemo(() => {
    const map = new Map<number, RowValidationResult>();
    validation.results.forEach((result) => {
      map.set(result.rowIndex, result);
    });
    return map;
  }, [validation]);

  // Apply filters, sorting, and pagination
  const processedData = useMemo(() => {
    // First filter
    let filtered = filterWiseData(data, filters);

    // Apply max preview rows if set
    if (maxPreviewRows && filtered.length > maxPreviewRows) {
      filtered = filtered.slice(0, maxPreviewRows);
    }

    // Then sort if a sort field is selected
    if (sortConfig.field) {
      filtered = sortWiseData(filtered, sortConfig.field, sortConfig.direction);
    }

    // Finally paginate
    return paginateData(filtered, currentPage, pageSize);
  }, [data, filters, sortConfig, currentPage, pageSize, maxPreviewRows]);

  // Get original indices for validation lookup
  const getOriginalIndex = (row: WiseRow): number => {
    return data.findIndex(
      (r) =>
        r['TransferWise ID'] === row['TransferWise ID'] && r.Date === row.Date
    );
  };

  const handleSort = (field: keyof WiseRow) => {
    setSortConfig((prev) => ({
      field,
      direction:
        prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
    setCurrentPage(1);
  };

  const handleSearch = (search: string) => {
    setFilters((prev) => ({ ...prev, search }));
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="space-y-4">
      {/* Search and Filter Bar */}
      {showSearch && (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Suchen in Transaktionen..."
              value={filters.search}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <select
            className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
            value={filters.transactionType}
            onChange={(e) => {
              setFilters((prev) => ({
                ...prev,
                transactionType: e.target.value as 'all' | 'DEBIT' | 'CREDIT',
              }));
              setCurrentPage(1);
            }}
          >
            <option value="all">Alle Typen</option>
            <option value="DEBIT">Ausgaben</option>
            <option value="CREDIT">Einnahmen</option>
          </select>
        </div>
      )}

      {/* Validation Summary */}
      <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm">
        <span className="flex items-center gap-1">
          <CheckCircle2 className="w-4 h-4 text-green-500" />
          {validation.validRows} gültig
        </span>
        {validation.rowsWithWarnings > 0 && (
          <span className="flex items-center gap-1">
            <AlertTriangle className="w-4 h-4 text-yellow-500" />
            {validation.rowsWithWarnings} mit Warnungen
          </span>
        )}
        {validation.rowsWithErrors > 0 && (
          <span className="flex items-center gap-1">
            <AlertCircle className="w-4 h-4 text-red-500" />
            {validation.rowsWithErrors} mit Fehlern
          </span>
        )}
        {maxPreviewRows && data.length > maxPreviewRows && (
          <span className="text-gray-500">
            (Vorschau: erste {maxPreviewRows} von {data.length} Zeilen)
          </span>
        )}
      </div>

      {/* Mobile View - Card Layout */}
      <div className="block md:hidden space-y-3">
        {processedData.data.length === 0 ? (
          <div className="text-center py-8 text-gray-500 border rounded-lg">
            Keine Transaktionen gefunden
          </div>
        ) : (
          processedData.data.map((row) => {
            const originalIndex = getOriginalIndex(row);
            const validationResult = validationMap.get(originalIndex);
            const status = validationResult
              ? getValidationStatus(validationResult)
              : 'valid';
            const tooltipText = getTooltipText(
              status,
              validationResult?.issues || []
            );

            return (
              <MobileRowCard
                key={`mobile-${row['TransferWise ID']}-${originalIndex}`}
                row={row}
                status={status}
                tooltipText={tooltipText}
                originalIndex={originalIndex}
                onEdit={
                  onEditRow ? () => onEditRow(originalIndex, row) : undefined
                }
              />
            );
          })
        )}
      </div>

      {/* Desktop View - Table */}
      <div className="hidden md:block border rounded-lg overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">Status</TableHead>
              {DISPLAY_COLUMNS.map((col) => (
                <TableHead
                  key={col.key}
                  className={`${col.width || ''} ${
                    col.hideOnMobile ? 'hidden lg:table-cell' : ''
                  } cursor-pointer select-none`}
                  onClick={() => handleSort(col.key)}
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    {getSortIcon(sortConfig.field, col.key, sortConfig.direction)}
                  </div>
                </TableHead>
              ))}
              {onEditRow && <TableHead className="w-16">Aktion</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {processedData.data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={DISPLAY_COLUMNS.length + (onEditRow ? 2 : 1)}
                  className="text-center py-8 text-gray-500"
                >
                  Keine Transaktionen gefunden
                </TableCell>
              </TableRow>
            ) : (
              processedData.data.map((row) => {
                const originalIndex = getOriginalIndex(row);
                const validationResult = validationMap.get(originalIndex);
                const status = validationResult
                  ? getValidationStatus(validationResult)
                  : 'valid';
                const tooltipText = getTooltipText(
                  status,
                  validationResult?.issues || []
                );

                return (
                  <TableRow
                    key={`${row['TransferWise ID']}-${originalIndex}`}
                    className={
                      status === 'error'
                        ? 'bg-red-50'
                        : status === 'warning'
                        ? 'bg-yellow-50'
                        : ''
                    }
                  >
                    <TableCell>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button className="flex items-center justify-center">
                              {getStatusIcon(status)}
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{tooltipText}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    {DISPLAY_COLUMNS.map((col) => (
                      <TableCell
                        key={col.key}
                        className={`${
                          col.hideOnMobile ? 'hidden lg:table-cell' : ''
                        } ${
                          col.key === 'Amount'
                            ? parseFloat(row.Amount) < 0
                              ? 'text-red-600 font-medium'
                              : 'text-green-600 font-medium'
                            : ''
                        }`}
                      >
                        {col.key === 'Amount'
                          ? formatAmount(row[col.key])
                          : col.key === 'Transaction Type'
                          ? row[col.key] === 'DEBIT'
                            ? 'Ausgabe'
                            : 'Einnahme'
                          : row[col.key] || '-'}
                      </TableCell>
                    ))}
                    {onEditRow && (
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEditRow(originalIndex, row)}
                          title="Zeile bearbeiten"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {processedData.totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-sm text-gray-500 text-center sm:text-left">
            Zeige {(processedData.currentPage - 1) * pageSize + 1} bis{' '}
            {Math.min(
              processedData.currentPage * pageSize,
              processedData.totalItems
            )}{' '}
            von {processedData.totalItems} Transaktionen
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(1)}
              disabled={!processedData.hasPreviousPage}
            >
              <ChevronsLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(processedData.currentPage - 1)}
              disabled={!processedData.hasPreviousPage}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="px-3 text-sm whitespace-nowrap">
              Seite {processedData.currentPage} von {processedData.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(processedData.currentPage + 1)}
              disabled={!processedData.hasNextPage}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(processedData.totalPages)}
              disabled={!processedData.hasNextPage}
            >
              <ChevronsRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
