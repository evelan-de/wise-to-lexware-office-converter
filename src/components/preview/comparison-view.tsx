'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  ArrowRight,
  Download,
  Search,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import type { WiseRow, LexOfficeRow } from '@/lib/converter';
import { convertWiseToLexOffice } from '@/lib/converter';
import {
  filterWiseData,
  paginateData,
  type FilterOptions,
  DEFAULT_FILTER_OPTIONS,
} from '@/lib/filters';
import { generateLexOfficeCSV, downloadCSV, generateFilename } from '@/lib/csv-utils';

interface ComparisonViewProps {
  wiseData: WiseRow[];
  onDownloadFiltered?: (data: LexOfficeRow[]) => void;
}

function formatAmount(amount: string): string {
  const num = parseFloat(amount);
  if (isNaN(num)) return amount;
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
}

// Single row comparison card
function ComparisonRow({
  wiseRow,
  lexOfficeRow,
}: {
  wiseRow: WiseRow;
  lexOfficeRow: LexOfficeRow;
}) {
  const isNegative = parseFloat(wiseRow.Amount) < 0;
  const amountClass = isNegative ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400';

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="grid grid-cols-[1fr,auto,1fr] divide-x divide-border">
          {/* Source (Wise) */}
          <div className="p-4 bg-gray-50 dark:bg-evelan-petrol-alt">
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="outline" className="text-xs">Quelle</Badge>
              <span className="text-xs text-muted-foreground">Wise Export</span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Datum:</span>
                <span className="font-mono text-foreground">{wiseRow.Date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Betrag:</span>
                <span className={`font-mono font-medium ${amountClass}`}>
                  {formatAmount(wiseRow.Amount)} {wiseRow.Currency}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground flex-shrink-0">Beschreibung:</span>
                <span className="text-right break-words text-foreground">{wiseRow.Description || '-'}</span>
              </div>
              {wiseRow['Payment Reference'] && (
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground flex-shrink-0">Referenz:</span>
                  <span className="text-right break-words text-foreground">{wiseRow['Payment Reference']}</span>
                </div>
              )}
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground flex-shrink-0">
                  {wiseRow['Transaction Type'] === 'DEBIT' ? 'Empfänger:' : 'Zahler:'}
                </span>
                <span className="text-right text-foreground">
                  {wiseRow['Transaction Type'] === 'DEBIT'
                    ? wiseRow['Payee Name'] || '-'
                    : wiseRow['Payer Name'] || '-'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Typ:</span>
                <span className="text-foreground">{wiseRow['Transaction Type'] === 'DEBIT' ? 'Ausgabe' : 'Einnahme'}</span>
              </div>
            </div>
          </div>

          {/* Arrow */}
          <div className="flex items-center justify-center px-3 bg-white dark:bg-evelan-petrol">
            <div className="bg-evelan-gold text-evelan-petrol rounded-full p-2">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* Target (LexOffice) */}
          <div className="p-4 bg-evelan-ice dark:bg-evelan-petrol-alt/80">
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="default" className="text-xs bg-evelan-gold text-evelan-petrol">Ziel</Badge>
              <span className="text-xs text-muted-foreground">Lexware Office</span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Buchungstag:</span>
                <span className="font-mono text-foreground">{lexOfficeRow.Buchungstag}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Betrag:</span>
                <span className={`font-mono font-medium ${amountClass}`}>
                  {lexOfficeRow.Betrag} EUR
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground flex-shrink-0">Verwendungszweck:</span>
                <span className="text-right break-words text-foreground">{lexOfficeRow['Vorgang/Verwendungszweck']}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground flex-shrink-0">Auftraggeber:</span>
                <span className="text-right text-foreground">{lexOfficeRow['Auftraggeber/Zahlungsempfänger']}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground flex-shrink-0">Empfänger:</span>
                <span className="text-right text-foreground">{lexOfficeRow['Empfänger/Zahlungspflichtiger']}</span>
              </div>
              {lexOfficeRow['Zusatzinfo (optional)'] && (
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground flex-shrink-0">Zusatzinfo:</span>
                  <span className="text-right text-xs text-muted-foreground break-words">
                    {lexOfficeRow['Zusatzinfo (optional)']}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
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

  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Konvertierungsvorschau</h3>
          <p className="text-sm text-muted-foreground">
            Vergleich zwischen Wise-Daten und Lexware Office-Format
          </p>
        </div>
        <Button size="sm" onClick={handleDownloadFiltered} className="gap-2 btn-evelan-gradient">
          <Download className="w-4 h-4" />
          Gefilterte herunterladen
        </Button>
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Suchen..."
            value={filters.search}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <select
          className="h-9 rounded-md border border-input bg-background text-foreground px-3 text-sm"
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

      {/* Transformation Legend */}
      <Card className="bg-evelan-ice/50 dark:bg-evelan-petrol-alt border-evelan-teal/20 dark:border-evelan-gold/20">
        <CardContent className="py-3">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
            <span className="font-medium text-evelan-teal dark:text-evelan-gold">Transformationen:</span>
            <div className="flex items-center gap-1.5">
              <code className="bg-white dark:bg-evelan-petrol px-1.5 py-0.5 rounded text-xs text-foreground">dd-mm-yyyy</code>
              <ArrowRight className="w-3 h-3 text-evelan-gold" />
              <code className="bg-white dark:bg-evelan-petrol px-1.5 py-0.5 rounded text-xs text-foreground">dd.mm.yyyy</code>
            </div>
            <div className="flex items-center gap-1.5">
              <code className="bg-white dark:bg-evelan-petrol px-1.5 py-0.5 rounded text-xs text-foreground">1234.56</code>
              <ArrowRight className="w-3 h-3 text-evelan-gold" />
              <code className="bg-white dark:bg-evelan-petrol px-1.5 py-0.5 rounded text-xs text-foreground">1234,56</code>
            </div>
            <div className="flex items-center gap-1.5">
              <code className="bg-white dark:bg-evelan-petrol px-1.5 py-0.5 rounded text-xs text-foreground">CSV</code>
              <ArrowRight className="w-3 h-3 text-evelan-gold" />
              <span className="text-evelan-teal dark:text-evelan-gold">Semikolon, UTF-8 BOM</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comparison Cards */}
      <div className="space-y-4">
        {processedData.data.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground border border-border rounded-lg">
            Keine Transaktionen gefunden
          </div>
        ) : (
          processedData.data.map((wiseRow, idx) => (
            <ComparisonRow
              key={`comparison-${idx}`}
              wiseRow={wiseRow}
              lexOfficeRow={convertedData[idx]}
            />
          ))
        )}
      </div>

      {/* Pagination */}
      {processedData.totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-sm text-muted-foreground">
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
