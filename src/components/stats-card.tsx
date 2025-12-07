'use client';

import { useMemo } from 'react';
import { TrendingUp, TrendingDown, FileCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { ConversionStats } from '@/lib/converter';

interface StatsCardProps {
  stats: ConversionStats;
}

export function StatsCard({ stats }: StatsCardProps) {
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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Total Transactions */}
      <Card className="border-evelan-teal/20 dark:border-evelan-teal/30 card-glow">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Gesamt Transaktionen
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-foreground">{stats.total}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.debit} Ausgaben, {stats.credit} Eingänge
              </p>
            </div>
            <div className="rounded-full bg-evelan-teal/10 dark:bg-evelan-teal/20 p-3">
              <FileCheck className="w-6 h-6 text-evelan-teal" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Debit Transactions */}
      <Card className="border-red-200/50 dark:border-red-800/50 card-glow">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Ausgaben
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-foreground">{stats.debit}</p>
              <p className="text-xs text-muted-foreground mt-1">DEBIT Transaktionen</p>
            </div>
            <div className="rounded-full bg-red-50 dark:bg-red-950/50 p-3">
              <TrendingDown className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Credit Transactions */}
      <Card className="border-evelan-gold/20 dark:border-evelan-gold/30 card-glow">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Eingänge
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-foreground">{stats.credit}</p>
              <p className="text-xs text-muted-foreground mt-1">CREDIT Transaktionen</p>
            </div>
            <div className="rounded-full bg-evelan-gold/10 dark:bg-evelan-gold/20 p-3">
              <TrendingUp className="w-6 h-6 text-evelan-gold dark:text-evelan-gold-light" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Total Amount - Full Width */}
      <Card className="md:col-span-3 border-evelan-teal/20 dark:border-evelan-gold/20 card-glow">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Gesamtbetrag
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold bg-gradient-to-r from-evelan-teal to-evelan-gold bg-clip-text text-transparent">
            {formatAmount(stats.totalAmount)}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Netto-Betrag aller Transaktionen
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
