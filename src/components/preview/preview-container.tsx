'use client';

import { useState, useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  ArrowRight,
  Download,
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Eye,
  GitCompare,
  Edit,
  X,
} from 'lucide-react';
import type { WiseRow, LexOfficeRow } from '@/lib/converter';
import { convertWiseToLexOffice, calculateStats } from '@/lib/converter';
import { validateWiseData, type ValidationSummary } from '@/lib/validation';
import { generateLexOfficeCSV, downloadCSV, generateFilename } from '@/lib/csv-utils';
import { DataTable } from './data-table';
import { RowEditor } from './row-editor';
import { ComparisonView } from './comparison-view';

type PreviewStep = 'source' | 'comparison';

interface PreviewContainerProps {
  wiseData: WiseRow[];
  onDataChange: (data: WiseRow[]) => void;
  onConvert: () => void;
  onCancel: () => void;
}

export function PreviewContainer({
  wiseData,
  onDataChange,
  onConvert,
  onCancel,
}: PreviewContainerProps) {
  const [step, setStep] = useState<PreviewStep>('source');
  const [editingRow, setEditingRow] = useState<{
    index: number;
    row: WiseRow;
  } | null>(null);

  // Validate data
  const validation = useMemo(() => {
    return validateWiseData(wiseData);
  }, [wiseData]);

  // Convert data preview
  const convertedData = useMemo(() => {
    return convertWiseToLexOffice(wiseData);
  }, [wiseData]);

  // Stats
  const stats = useMemo(() => {
    return calculateStats(wiseData);
  }, [wiseData]);

  const handleEditRow = useCallback((index: number, row: WiseRow) => {
    setEditingRow({ index, row });
  }, []);

  const handleSaveRow = useCallback(
    (index: number, updatedRow: WiseRow) => {
      const newData = [...wiseData];
      newData[index] = updatedRow;
      onDataChange(newData);
      setEditingRow(null);
    },
    [wiseData, onDataChange]
  );

  const handleCancelEdit = useCallback(() => {
    setEditingRow(null);
  }, []);

  const handleDownload = useCallback(() => {
    const csvContent = generateLexOfficeCSV(convertedData);
    const filename = generateFilename();
    downloadCSV(csvContent, filename);
    onConvert();
  }, [convertedData, onConvert]);

  const canConvert = validation.rowsWithErrors === 0 && convertedData.length > 0;

  // If editing, show editor
  if (editingRow) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={handleCancelEdit} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Zurück zur Vorschau
        </Button>
        <RowEditor
          row={editingRow.row}
          rowIndex={editingRow.index}
          onSave={handleSaveRow}
          onCancel={handleCancelEdit}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">
            Datenvorschau & Validierung
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Prüfen Sie Ihre Daten vor der Konvertierung
          </p>
        </div>
        <Button variant="outline" onClick={onCancel} className="gap-2">
          <X className="w-4 h-4" />
          Abbrechen
        </Button>
      </div>

      {/* Step Tabs */}
      <div className="flex gap-2 border-b pb-2">
        <Button
          variant={step === 'source' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setStep('source')}
          className="gap-2"
        >
          <Eye className="w-4 h-4" />
          Quelldaten
        </Button>
        <Button
          variant={step === 'comparison' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setStep('comparison')}
          className="gap-2"
        >
          <GitCompare className="w-4 h-4" />
          Vergleichsansicht
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-foreground">{wiseData.length}</div>
            <div className="text-sm text-muted-foreground">Transaktionen</div>
          </CardContent>
        </Card>
        <Card className={validation.rowsWithErrors > 0 ? 'border-red-200 bg-red-50' : ''}>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              {validation.rowsWithErrors > 0 ? (
                <AlertCircle className="w-5 h-5 text-red-500" />
              ) : (
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              )}
              <span className="text-2xl font-bold">
                {validation.rowsWithErrors}
              </span>
            </div>
            <div className="text-sm text-muted-foreground">Fehler</div>
          </CardContent>
        </Card>
        <Card className={validation.rowsWithWarnings > 0 ? 'border-yellow-200 bg-yellow-50' : ''}>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              {validation.rowsWithWarnings > 0 && (
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
              )}
              <span className="text-2xl font-bold">
                {validation.rowsWithWarnings}
              </span>
            </div>
            <div className="text-sm text-muted-foreground">Warnungen</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-foreground">{convertedData.length}</div>
            <div className="text-sm text-muted-foreground">Konvertierbar</div>
          </CardContent>
        </Card>
      </div>

      {/* Validation Alert */}
      {validation.rowsWithErrors > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="py-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
              <div>
                <h4 className="font-medium text-red-800">
                  {validation.rowsWithErrors} Transaktion(en) mit Fehlern
                </h4>
                <p className="text-sm text-red-700 mt-1">
                  Diese Transaktionen können nicht konvertiert werden. Bitte
                  korrigieren Sie die Fehler oder die fehlerhaften Zeilen werden
                  übersprungen.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2 gap-2"
                  onClick={() => setStep('source')}
                >
                  <Edit className="w-4 h-4" />
                  Fehler anzeigen
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Content based on step */}
      {step === 'source' ? (
        <DataTable
          data={wiseData}
          validation={validation}
          onEditRow={handleEditRow}
          maxPreviewRows={100}
        />
      ) : (
        <ComparisonView wiseData={wiseData} />
      )}

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-4 border-t">
        <div className="text-sm text-muted-foreground">
          {canConvert ? (
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
              {convertedData.length} Transaktionen bereit zur Konvertierung
            </span>
          ) : (
            <span className="flex items-center gap-2 text-red-600">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              Bitte korrigieren Sie zuerst alle Fehler
            </span>
          )}
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          {step === 'source' && (
            <Button
              variant="outline"
              onClick={() => setStep('comparison')}
              className="gap-2"
            >
              Vergleichen
              <ArrowRight className="w-4 h-4" />
            </Button>
          )}
          <Button
            onClick={handleDownload}
            disabled={!canConvert}
            className="gap-2 whitespace-nowrap"
          >
            <Download className="w-4 h-4 flex-shrink-0" />
            Konvertieren & Herunterladen
          </Button>
        </div>
      </div>
    </div>
  );
}
