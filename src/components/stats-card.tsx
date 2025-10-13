'use client';

import { TrendingUp, TrendingDown, FileCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { ConversionStats } from '@/lib/converter';

interface StatsCardProps {
  stats: ConversionStats;
}

export function StatsCard({ stats }: StatsCardProps) {
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: stats.currency,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-xs text-gray-500 mt-1">
                {stats.debit} Ausgaben, {stats.credit} Eingänge
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
              <p className="text-3xl font-bold text-gray-900">{stats.debit}</p>
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
              <p className="text-3xl font-bold text-gray-900">{stats.credit}</p>
              <p className="text-xs text-gray-500 mt-1">CREDIT Transaktionen</p>
            </div>
            <div className="rounded-full bg-green-50 p-3">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Total Amount - Full Width */}
      <Card className="md:col-span-3">
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
            Netto-Betrag aller Transaktionen
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
