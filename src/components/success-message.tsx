'use client';

import { CheckCircle2, Download } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export function SuccessMessage() {
  return (
    <Card className="border-evelan-teal/30 dark:border-evelan-gold/30 bg-evelan-teal/5 dark:bg-evelan-gold/5 glow-teal dark:glow-gold">
      <CardContent className="flex items-center gap-4 py-6">
        <div className="rounded-full bg-evelan-teal/10 dark:bg-evelan-gold/20 p-3">
          <CheckCircle2 className="w-8 h-8 text-evelan-teal dark:text-evelan-gold" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-evelan-petrol dark:text-evelan-gold-light">
            Konvertierung erfolgreich!
          </h3>
          <p className="text-sm text-evelan-teal dark:text-foreground/80 mt-1">
            Die Datei wurde konvertiert und automatisch heruntergeladen.
          </p>
          <p className="text-xs text-evelan-teal/80 dark:text-evelan-gold/80 mt-2 flex items-center gap-1">
            <Download className="w-3 h-3" />
            Sie können die Datei jetzt in LexOffice importieren.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
