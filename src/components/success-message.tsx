'use client';

import { CheckCircle2, Download } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export function SuccessMessage() {
  return (
    <Card className="border-green-200 bg-green-50">
      <CardContent className="flex items-center gap-4 py-6">
        <div className="rounded-full bg-green-100 p-3">
          <CheckCircle2 className="w-8 h-8 text-green-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-green-900">
            Konvertierung erfolgreich!
          </h3>
          <p className="text-sm text-green-700 mt-1">
            Die Datei wurde konvertiert und automatisch heruntergeladen.
          </p>
          <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
            <Download className="w-3 h-3" />
            Sie können die Datei jetzt in LexOffice importieren.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
