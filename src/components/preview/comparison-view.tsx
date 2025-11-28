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
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ArrowRight,
  Download,
  Search,
  ChevronLeft,
  ChevronRight,
  FileSpreadsheet,
} from 'lucide-react';
import type { WiseRow, LexOfficeRow } from '@/lib/converter';
import { convertWiseToLexOffice } from '@/lib/converter';
import {
  filterWiseData,
  paginateData,
  downloadAsExcel,
  type FilterOptions,
  DEFAULT_FILTER_OPTIONS,
} from '@/lib/filters';
import { generateLexOfficeCSV, downloadCSV, generateFilename } from '@/lib/csv-utils';

interface ComparisonViewProps {
  wiseData: WiseRow[];
  onDownloadFiltered?: (data: LexOfficeRow[]) => void;
}

function formatAmount(amount: string, isGerman: boolean = false): string {
  const num = parseFloat(amount);
  if (isNaN(num)) return amount;
  return new Intl.NumberFormat(isGerman ? 'de-DE' : 'en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    useGrouping: !isGerman, // German format for LexOffice doesn't use grouping
  }).format(num);
}

function convertDate(date: string): string {
  if (!date) return '';
  const match = date.match(/^(\d{2})-(\d{2})-(\d{4})$/);
  if (!match) return date;
  const [, day, month, year] = match;
  return `${day}.${month}.${year}`;
}

export function ComparisonView({ wiseData }: ComparisonViewProps) {
  const [filters, setFilters] = useState<FilterOptions>(DEFAULT_FILTER_OPTIONS);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Filter and paginate data
  const processedData = useMemo(() => {
    const filtered = filterWiseData(wiseData, filters);
    return paginateData(filtered, currentPage, pageSize);
  }, [wiseData, filters, currentPage]);

  // Convert filtered data to LexOffice format
  const convertedData = useMemo(() => {
    return convertWiseToLexOffice(processedData.data);
  }, [processedData.data]);

  const handleSearch = (search: string) => {
    setFilters((prev) => ({ ...prev, search }));
    setCurrentPage(1);
  };

  const handleDownloadFiltered = () => {
    const allFiltered = filterWiseData(wiseData, filters);
    const converted = convertWiseToLexOffice(allFiltered);
    const csvContent = generateLexOfficeCSV(converted);
    const filename = generateFilename();
    downloadCSV(csvContent, filename);
  };

  const handleExportExcel = () => {
    const allFiltered = filterWiseData(wiseData, filters);
    const timestamp = new Date().toISOString().slice(0, 10);
    downloadAsExcel(allFiltered, `wise_export_${timestamp}.xls`);
  };

  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">Konvertierungsvorschau</h3>
          <p className="text-sm text-gray-500">
            Vergleich zwischen Wise-Daten und Lexware Office-Format
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportExcel}
            className="gap-2"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Als Excel
          </Button>
          <Button size="sm" onClick={handleDownloadFiltered} className="gap-2">
            <Download className="w-4 h-4" />
            Gefilterte herunterladen
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Suchen..."
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

      {/* Comparison Table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Wise Data (Source) */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Badge variant="outline">Quelle</Badge>
              Wise Export
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-auto max-h-[400px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Datum</TableHead>
                    <TableHead>Betrag</TableHead>
                    <TableHead>Beschreibung</TableHead>
                    <TableHead>Zahler/Empfänger</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {processedData.data.map((row, idx) => (
                    <TableRow key={`wise-${idx}`}>
                      <TableCell className="font-mono text-sm">
                        {row.Date}
                      </TableCell>
                      <TableCell
                        className={`font-mono text-sm ${
                          parseFloat(row.Amount) < 0
                            ? 'text-red-600'
                            : 'text-green-600'
                        }`}
                      >
                        {formatAmount(row.Amount)} {row.Currency}
                      </TableCell>
                      <TableCell className="text-sm max-w-[200px] truncate">
                        {row.Description || '-'}
                      </TableCell>
                      <TableCell className="text-sm">
                        {row['Transaction Type'] === 'DEBIT'
                          ? row['Payee Name'] || '-'
                          : row['Payer Name'] || '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Arrow indicator */}
        <div className="hidden lg:flex items-center justify-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="bg-primary text-white rounded-full p-2">
            <ArrowRight className="w-5 h-5" />
          </div>
        </div>

        {/* LexOffice Data (Target) */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Badge variant="default">Ziel</Badge>
              Lexware Office Format
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-auto max-h-[400px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Buchungstag</TableHead>
                    <TableHead>Betrag</TableHead>
                    <TableHead>Verwendungszweck</TableHead>
                    <TableHead>Auftraggeber/Empfänger</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {convertedData.map((row, idx) => (
                    <TableRow key={`lex-${idx}`}>
                      <TableCell className="font-mono text-sm">
                        {row.Buchungstag}
                      </TableCell>
                      <TableCell
                        className={`font-mono text-sm ${
                          row.Betrag.startsWith('-')
                            ? 'text-red-600'
                            : 'text-green-600'
                        }`}
                      >
                        {row.Betrag} EUR
                      </TableCell>
                      <TableCell className="text-sm max-w-[200px] truncate">
                        {row['Vorgang/Verwendungszweck']}
                      </TableCell>
                      <TableCell className="text-sm">
                        {row['Auftraggeber/Zahlungsempfänger'] === 'Kontoinhaber'
                          ? row['Empfänger/Zahlungspflichtiger']
                          : row['Auftraggeber/Zahlungsempfänger']}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transformation Legend */}
      <Card className="bg-gray-50">
        <CardContent className="py-4">
          <h4 className="font-medium mb-3 text-sm">Transformationsregeln:</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="font-mono">dd-mm-yyyy</Badge>
              <ArrowRight className="w-3 h-3 text-gray-400" />
              <Badge variant="secondary" className="font-mono">dd.mm.yyyy</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="font-mono">1234.56</Badge>
              <ArrowRight className="w-3 h-3 text-gray-400" />
              <Badge variant="secondary" className="font-mono">1234,56</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">DEBIT</Badge>
              <ArrowRight className="w-3 h-3 text-gray-400" />
              <span className="text-gray-600">Kontoinhaber → Empfänger</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">CREDIT</Badge>
              <ArrowRight className="w-3 h-3 text-gray-400" />
              <span className="text-gray-600">Zahler → Kontoinhaber</span>
            </div>
            <div className="flex items-center gap-2 col-span-2">
              <Badge variant="outline">CSV</Badge>
              <ArrowRight className="w-3 h-3 text-gray-400" />
              <span className="text-gray-600">Semikolon-Trennzeichen, UTF-8 BOM, CRLF</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      {processedData.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Zeige {(processedData.currentPage - 1) * pageSize + 1} bis{' '}
            {Math.min(
              processedData.currentPage * pageSize,
              processedData.totalItems
            )}{' '}
            von {processedData.totalItems}
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={!processedData.hasPreviousPage}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="px-3 text-sm">
              Seite {processedData.currentPage} von {processedData.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage((p) => Math.min(processedData.totalPages, p + 1))
              }
              disabled={!processedData.hasNextPage}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
