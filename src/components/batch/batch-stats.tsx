'use client';

import { useMemo } from 'react';
import { TrendingUp, TrendingDown, FileCheck, Files, AlertTriangle, Copy } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { BatchStats } from '@/lib/batch-processor';

interface BatchStatsCardProps {
  stats: BatchStats;
}

export function BatchStatsCard({ stats }: BatchStatsCardProps) {
  // Memoize formatter to avoid recreation on every render
  const formatAmount = useMemo(() => {
    const formatter = new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: stats.currency,
      minimumFractionDigits: 2,
    });
    return (amount: number) => formatter.format(amount);
  }, [stats.currency]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Files Processed */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-gray-600">
            Verarbeitete Dateien
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-gray-900">
                {stats.completedFiles}/{stats.totalFiles}
              </p>
              {stats.failedFiles > 0 && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  {stats.failedFiles} fehlgeschlagen
                </p>
              )}
            </div>
            <div className="rounded-full bg-primary/10 p-3">
              <Files className="w-6 h-6 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Total Transactions */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-gray-600">
            Gesamt Transaktionen
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-gray-900">{stats.totalTransactions}</p>
              <p className="text-xs text-gray-500 mt-1">
                {stats.totalDebit} Ausgaben, {stats.totalCredit} Eingänge
              </p>
            </div>
            <div className="rounded-full bg-primary/10 p-3">
              <FileCheck className="w-6 h-6 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Debit Transactions */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-gray-600">
            Ausgaben
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-gray-900">{stats.totalDebit}</p>
              <p className="text-xs text-gray-500 mt-1">DEBIT Transaktionen</p>
            </div>
            <div className="rounded-full bg-red-50 p-3">
              <TrendingDown className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Credit Transactions */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-gray-600">
            Eingänge
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-gray-900">{stats.totalCredit}</p>
              <p className="text-xs text-gray-500 mt-1">CREDIT Transaktionen</p>
            </div>
            <div className="rounded-full bg-green-50 p-3">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Duplicates Removed - Full Width if there are any */}
      {stats.duplicatesRemoved > 0 && (
        <Card className="md:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Duplikate entfernt
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-yellow-600">{stats.duplicatesRemoved}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Doppelte Transaktionen wurden automatisch entfernt
                </p>
              </div>
              <div className="rounded-full bg-yellow-50 p-3">
                <Copy className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Total Amount - Full Width */}
      <Card className={stats.duplicatesRemoved > 0 ? 'md:col-span-2' : 'md:col-span-4'}>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-gray-600">
            Gesamtbetrag
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold text-gray-900">
            {formatAmount(stats.totalAmount)}
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Netto-Betrag aller Transaktionen aus {stats.completedFiles} Datei{stats.completedFiles !== 1 ? 'en' : ''}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
