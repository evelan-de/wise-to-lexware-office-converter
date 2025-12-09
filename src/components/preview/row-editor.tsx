'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Save, AlertCircle, AlertTriangle, CheckCircle2 } from 'lucide-react';
import type { WiseRow } from '@/lib/converter';
import { validateWiseRow, type RowValidationResult, type ValidationIssue } from '@/lib/validation';

interface RowEditorProps {
  row: WiseRow;
  rowIndex: number;
  onSave: (rowIndex: number, updatedRow: WiseRow) => void;
  onCancel: () => void;
}

type EditableField = {
  key: keyof WiseRow;
  label: string;
  type: 'text' | 'date' | 'number' | 'select';
  options?: { value: string; label: string }[];
  required?: boolean;
  helpText?: string;
};

const EDITABLE_FIELDS: EditableField[] = [
  {
    key: 'Date',
    label: 'Datum',
    type: 'text',
    required: true,
    helpText: 'Format: dd-mm-yyyy (z.B. 29-09-2025)',
  },
  {
    key: 'Amount',
    label: 'Betrag',
    type: 'text',
    required: true,
    helpText: 'Negative Werte für Ausgaben (z.B. -123.45)',
  },
  {
    key: 'Currency',
    label: 'Währung',
    type: 'text',
    helpText: '3-stelliger Währungscode (z.B. EUR, USD)',
  },
  {
    key: 'Transaction Type',
    label: 'Transaktionstyp',
    type: 'select',
    required: true,
    options: [
      { value: 'DEBIT', label: 'Ausgabe (DEBIT)' },
      { value: 'CREDIT', label: 'Einnahme (CREDIT)' },
    ],
  },
  {
    key: 'Description',
    label: 'Beschreibung',
    type: 'text',
    helpText: 'Beschreibung der Transaktion',
  },
  {
    key: 'Payment Reference',
    label: 'Referenz',
    type: 'text',
    helpText: 'Zahlungsreferenz oder Rechnungsnummer',
  },
  {
    key: 'Payer Name',
    label: 'Absendername',
    type: 'text',
    helpText: 'Name des Zahlenden (für Einnahmen)',
  },
  {
    key: 'Payee Name',
    label: 'Empfängername',
    type: 'text',
    helpText: 'Name des Empfängers (für Ausgaben)',
  },
];

function getFieldIssues(field: string, issues: ValidationIssue[]): ValidationIssue[] {
  return issues.filter((issue) => issue.field === field);
}

function getFieldStatus(
  field: string,
  issues: ValidationIssue[]
): 'valid' | 'warning' | 'error' {
  const fieldIssues = getFieldIssues(field, issues);
  if (fieldIssues.some((i) => i.severity === 'error')) return 'error';
  if (fieldIssues.some((i) => i.severity === 'warning')) return 'warning';
  return 'valid';
}

export function RowEditor({ row, rowIndex, onSave, onCancel }: RowEditorProps) {
  const [editedRow, setEditedRow] = useState<WiseRow>({ ...row });

  // Validate on every change using useMemo instead of useEffect
  const validation = useMemo(() => {
    return validateWiseRow(editedRow, rowIndex);
  }, [editedRow, rowIndex]);

  // Check for changes using useMemo instead of useEffect
  const hasChanges = useMemo(() => {
    return Object.keys(row).some(
      (key) => row[key as keyof WiseRow] !== editedRow[key as keyof WiseRow]
    );
  }, [row, editedRow]);

  const handleFieldChange = (field: keyof WiseRow, value: string) => {
    setEditedRow((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    if (validation && validation.isValid) {
      onSave(rowIndex, editedRow);
    }
  };

  const canSave = validation?.isValid && hasChanges;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg font-medium">
          Transaktion bearbeiten (Zeile {rowIndex + 1})
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <X className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Validation Summary */}
        {validation && (
          <div className="flex items-center gap-4 p-3 rounded-lg bg-muted">
            {validation.isValid ? (
              <>
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span className="text-sm text-green-700 dark:text-green-400">
                  Transaktion ist gültig
                  {validation.hasWarnings && ' (mit Warnungen)'}
                </span>
              </>
            ) : (
              <>
                <AlertCircle className="w-5 h-5 text-red-500" />
                <span className="text-sm text-red-700 dark:text-red-400">
                  Bitte korrigieren Sie die Fehler
                </span>
              </>
            )}
          </div>
        )}

        {/* Edit Fields */}
        <div className="grid gap-4">
          {EDITABLE_FIELDS.map((field) => {
            const fieldStatus = validation
              ? getFieldStatus(field.key, validation.issues)
              : 'valid';
            const fieldIssues = validation
              ? getFieldIssues(field.key, validation.issues)
              : [];

            return (
              <div key={field.key} className="space-y-1">
                <label className="flex items-center gap-2 text-sm font-medium">
                  {field.label}
                  {field.required && (
                    <span className="text-red-500">*</span>
                  )}
                  {fieldStatus === 'error' && (
                    <AlertCircle className="w-4 h-4 text-red-500" />
                  )}
                  {fieldStatus === 'warning' && (
                    <AlertTriangle className="w-4 h-4 text-yellow-500" />
                  )}
                </label>
                {field.type === 'select' ? (
                  <select
                    className={`w-full h-9 rounded-md border px-3 text-sm bg-background text-foreground ${
                      fieldStatus === 'error'
                        ? 'border-red-500 bg-red-50 dark:bg-red-950/30'
                        : fieldStatus === 'warning'
                        ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950/30'
                        : 'border-input'
                    }`}
                    value={editedRow[field.key] as string}
                    onChange={(e) => handleFieldChange(field.key, e.target.value)}
                  >
                    {field.options?.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <Input
                    type={field.type}
                    value={(editedRow[field.key] as string) || ''}
                    onChange={(e) => handleFieldChange(field.key, e.target.value)}
                    className={
                      fieldStatus === 'error'
                        ? 'border-red-500 bg-red-50 dark:bg-red-950/30'
                        : fieldStatus === 'warning'
                        ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950/30'
                        : ''
                    }
                    placeholder={field.helpText}
                  />
                )}
                {field.helpText && fieldStatus === 'valid' && (
                  <p className="text-xs text-muted-foreground">{field.helpText}</p>
                )}
                {fieldIssues.length > 0 && (
                  <div className="space-y-1">
                    {fieldIssues.map((issue, idx) => (
                      <p
                        key={idx}
                        className={`text-xs ${
                          issue.severity === 'error'
                            ? 'text-red-600 dark:text-red-400'
                            : 'text-yellow-600 dark:text-yellow-400'
                        }`}
                      >
                        {issue.message}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Read-only Info */}
        <div className="pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground mb-2">Weitere Informationen (nur lesen):</p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">
              Wise ID: {row['TransferWise ID'] || '-'}
            </Badge>
            {row['Running Balance'] && (
              <Badge variant="outline">
                Kontostand: {row['Running Balance']}
              </Badge>
            )}
            {row['Exchange Rate'] && (
              <Badge variant="outline">
                Wechselkurs: {row['Exchange Rate']}
              </Badge>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-4 border-t border-border">
          <Button variant="outline" onClick={onCancel} className="border-evelan-teal/30 hover:border-evelan-teal dark:border-evelan-gold/30 dark:hover:border-evelan-gold">
            Abbrechen
          </Button>
          <Button
            onClick={handleSave}
            disabled={!canSave}
            className="gap-2 btn-evelan-gradient disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            Speichern
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
