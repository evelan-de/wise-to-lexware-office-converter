'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { BatchProcessingOptions, MergeStrategy } from '@/lib/batch-processor';

interface MergeSettingsProps {
  options: BatchProcessingOptions;
  onOptionsChange: (options: BatchProcessingOptions) => void;
  disabled?: boolean;
}

const mergeStrategyLabels: Record<MergeStrategy, { label: string; description: string }> = {
  chronological: {
    label: 'Chronologisch (älteste zuerst)',
    description: 'Sortiert alle Transaktionen nach Datum, beginnend mit der ältesten',
  },
  'reverse-chronological': {
    label: 'Umgekehrt chronologisch (neueste zuerst)',
    description: 'Sortiert alle Transaktionen nach Datum, beginnend mit der neuesten',
  },
  'file-order': {
    label: 'Dateireihenfolge',
    description: 'Behält die Reihenfolge der Dateien bei, wie sie hinzugefügt wurden',
  },
};

export function MergeSettings({
  options,
  onOptionsChange,
  disabled = false,
}: MergeSettingsProps) {
  const handleRemoveDuplicatesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onOptionsChange({
      ...options,
      removeDuplicates: e.target.checked,
    });
  };

  const handleMergeStrategyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onOptionsChange({
      ...options,
      mergeStrategy: e.target.value as MergeStrategy,
    });
  };

  const handleParallelProcessingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onOptionsChange({
      ...options,
      parallelProcessing: e.target.checked,
    });
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Zusammenführungsoptionen
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Duplicate Detection */}
        <div className="flex items-start gap-3">
          <div className="flex items-center h-5">
            <input
              id="removeDuplicates"
              type="checkbox"
              checked={options.removeDuplicates}
              onChange={handleRemoveDuplicatesChange}
              disabled={disabled}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary disabled:opacity-50"
            />
          </div>
          <div>
            <label
              htmlFor="removeDuplicates"
              className={`text-sm font-medium ${disabled ? 'text-gray-400' : 'text-gray-900'}`}
            >
              Duplikate automatisch entfernen
            </label>
            <p className="text-xs text-gray-500 mt-0.5">
              Erkennt und entfernt doppelte Transaktionen basierend auf der Wise-ID
            </p>
          </div>
        </div>

        {/* Merge Strategy */}
        <div>
          <label
            htmlFor="mergeStrategy"
            className={`block text-sm font-medium mb-1.5 ${disabled ? 'text-gray-400' : 'text-gray-900'}`}
          >
            Sortierung
          </label>
          <select
            id="mergeStrategy"
            value={options.mergeStrategy}
            onChange={handleMergeStrategyChange}
            disabled={disabled}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50 disabled:bg-gray-100"
          >
            {Object.entries(mergeStrategyLabels).map(([value, { label }]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">
            {mergeStrategyLabels[options.mergeStrategy].description}
          </p>
        </div>

        {/* Parallel Processing */}
        <div className="flex items-start gap-3">
          <div className="flex items-center h-5">
            <input
              id="parallelProcessing"
              type="checkbox"
              checked={options.parallelProcessing}
              onChange={handleParallelProcessingChange}
              disabled={disabled}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary disabled:opacity-50"
            />
          </div>
          <div>
            <label
              htmlFor="parallelProcessing"
              className={`text-sm font-medium ${disabled ? 'text-gray-400' : 'text-gray-900'}`}
            >
              Parallele Verarbeitung
            </label>
            <p className="text-xs text-gray-500 mt-0.5">
              Verarbeitet bis zu {options.maxParallelFiles} Dateien gleichzeitig für schnellere Ergebnisse
            </p>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 rounded-lg border border-blue-200 p-3 mt-4">
          <p className="text-xs text-blue-800">
            <strong>Hinweis:</strong> Alle Dateien werden zu einer einzigen CSV-Datei zusammengeführt.
            Die Duplikaterkennung basiert auf der eindeutigen Wise-Transaktions-ID.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
