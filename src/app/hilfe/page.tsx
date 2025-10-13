import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, FileUp, CheckCircle, Download, Upload, AlertCircle, ExternalLink } from 'lucide-react';
import { EvelanBadge } from '@/components/evelan-badge';

export default function HilfePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Zurück zum Konverter
        </Link>

        {/* Header */}
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Anleitung zur Verwendung
          </h1>
          <p className="text-lg text-gray-600">
            So konvertieren Sie Ihre Wise-Transaktionen für Lexware Office
          </p>
        </header>

        {/* Main Content */}
        <div className="space-y-8">
          {/* What is this tool */}
          <section className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Was macht dieses Tool?
            </h2>
            <p className="text-gray-700 mb-4">
              Dieser Konverter wandelt Wise CSV-Exporte in das spezifische Format um, das von{' '}
              <strong>Lexware Offices Funktion &quot;Elektronischer Kontoauszug über CSV-Datei importieren&quot;</strong> benötigt wird.
            </p>
            <div className="mb-4">
              <a
                href="https://help.lexware.de/de-form/articles/9555940-import-elektronischer-kontoauszug-uber-csv-datei"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-medium"
              >
                <ExternalLink className="w-4 h-4" />
                Offizielle Lexware Office-Dokumentation zum CSV-Import
              </a>
            </div>
            <p className="text-gray-700">
              Das Tool ist nützlich, wenn Sie:
            </p>
            <ul className="list-disc list-inside space-y-2 mt-3 text-gray-700">
              <li>Historische Wise-Transaktionen in Lexware Office importieren möchten</li>
              <li>Die automatische Bankverbindung nicht verfügbar oder nicht funktionsfähig ist</li>
              <li>Bestimmte Wise-Transaktionen manuell zu Lexware Office hinzufügen müssen</li>
            </ul>
          </section>

          {/* Step by Step */}
          <section className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Schritt-für-Schritt Anleitung
            </h2>

            <div className="space-y-6">
              {/* Step 1 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-semibold">
                  1
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <Download className="w-5 h-5 text-primary" />
                    Wise CSV-Export herunterladen
                  </h3>
                  <div className="text-gray-700 space-y-3">
                    <p>1. Melden Sie sich in Ihrem Wise-Konto an, klicken Sie auf <strong>Transaktionen</strong> und dann auf <strong>Kontoauszüge und Berichte</strong></p>
                    <div className="rounded-lg border border-gray-200 overflow-hidden">
                      <Image
                        src="/screenshots/wise-step1.png"
                        alt="Wise - Transaktionen und Kontoauszüge öffnen"
                        width={800}
                        height={450}
                        className="w-full h-auto"
                      />
                    </div>
                    <p>2. Klicken Sie auf <strong>Auszüge</strong></p>
                    <div className="rounded-lg border border-gray-200 overflow-hidden">
                      <Image
                        src="/screenshots/wise-step2.png"
                        alt="Wise - Auszüge öffnen"
                        width={800}
                        height={450}
                        className="w-full h-auto"
                      />
                    </div>
                    <p>3. Klicken Sie auf <strong>Benutzerdefiniert</strong> und dann auf <strong>Erstelle einen Auszug</strong></p>
                    <div className="rounded-lg border border-gray-200 overflow-hidden">
                      <Image
                        src="/screenshots/wise-step3.png"
                        alt="Wise - Benutzerdefiniert und Auszug erstellen"
                        width={800}
                        height={450}
                        className="w-full h-auto"
                      />
                    </div>
                    <p>4. Wählen Sie das Format <strong>CSV</strong> und klicken Sie auf <strong>Kontoauszug erstellen</strong></p>
                    <div className="rounded-lg border border-gray-200 overflow-hidden">
                      <Image
                        src="/screenshots/wise-step4.png"
                        alt="Wise - CSV-Format auswählen und herunterladen"
                        width={800}
                        height={450}
                        className="w-full h-auto"
                      />
                    </div>
                    <p>5. Die CSV-Datei wird automatisch heruntergeladen</p>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-semibold">
                  2
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <FileUp className="w-5 h-5 text-primary" />
                    CSV-Datei hochladen
                  </h3>
                  <div className="text-gray-700 space-y-2">
                    <p>1. Gehen Sie zurück zur <Link href="/" className="text-primary hover:underline">Hauptseite</Link></p>
                    <p>2. Ziehen Sie Ihre Wise CSV-Datei in den Upload-Bereich</p>
                    <p>3. Oder klicken Sie auf den Bereich, um die Datei auszuwählen</p>
                    <p className="text-sm text-gray-600">
                      <strong>Hinweis:</strong> Maximale Dateigröße: 5 MB
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-semibold">
                  3
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-primary" />
                    Automatische Konvertierung
                  </h3>
                  <div className="text-gray-700 space-y-2">
                    <p>Die Datei wird automatisch validiert und konvertiert:</p>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      <li>Prüfung der CSV-Struktur und erforderlichen Felder</li>
                      <li>Umwandlung der Datumsformate (DD-MM-YYYY → DD.MM.YYYY)</li>
                      <li>Umwandlung der Betragsformate (1234.56 → 1234,56)</li>
                      <li>Zuordnung von Sender/Empfänger basierend auf Transaktionstyp</li>
                    </ul>
                    <p className="mt-3">Sie sehen Live-Statistiken während der Verarbeitung.</p>
                  </div>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-semibold">
                  4
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <Download className="w-5 h-5 text-primary" />
                    Datei wird automatisch heruntergeladen
                  </h3>
                  <div className="text-gray-700 space-y-2">
                    <p>Die konvertierte Datei wird automatisch heruntergeladen:</p>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      <li>Dateiname: <code className="bg-gray-100 px-2 py-0.5 rounded text-sm">lexoffice_import_YYYY-MM-DD.csv</code></li>
                      <li>Format: Lexware Office-kompatible CSV-Datei</li>
                      <li>Bereit für den direkten Import in Lexware Office</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Step 5 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-semibold">
                  5
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <Upload className="w-5 h-5 text-primary" />
                    In Lexware Office importieren
                  </h3>
                  <div className="text-gray-700 space-y-3">
                    <p>1. Melden Sie sich in Ihrem Lexware Office-Konto an</p>
                    <p>2. Navigieren Sie zu <strong>Banking → Konten</strong></p>
                    <p>3. Wählen Sie Ihr Bankkonto aus</p>
                    <p>4. Klicken Sie auf <strong>&quot;Transaktionen importieren&quot;</strong></p>
                    <div className="rounded-lg border border-gray-200 overflow-hidden">
                      <Image
                        src="/screenshots/lexoffice-upload.png"
                        alt="Lexware Office - CSV-Datei hochladen"
                        width={800}
                        height={450}
                        className="w-full h-auto"
                      />
                    </div>
                    <p>5. Laden Sie die konvertierte CSV-Datei hoch</p>
                    <p>6. Überprüfen Sie die Spaltenzuordnung (sollte automatisch erkannt werden)</p>
                    <p>7. Bestätigen Sie den Import</p>
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-sm text-blue-800">
                        <strong>Hinweis:</strong> Detaillierte Informationen zum Import-Prozess finden Sie in der{' '}
                        <a
                          href="https://help.lexware.de/de-form/articles/9555940-import-elektronischer-kontoauszug-uber-csv-datei"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:text-primary/80 underline inline-flex items-center gap-1"
                        >
                          offiziellen Lexware Office-Dokumentation
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Important Warning */}
          <section className="bg-amber-50 rounded-xl border-2 border-amber-200 p-6">
            <div className="flex gap-3">
              <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-lg font-semibold text-amber-900 mb-2">
                  Wichtiger Hinweis zu Duplikaten
                </h3>
                <p className="text-amber-800 mb-3">
                  <strong>Lexware Office prüft beim CSV-Import nicht automatisch auf Duplikate.</strong>{' '}
                  Vor dem Import sollten Sie:
                </p>
                <ul className="list-disc list-inside space-y-1 text-amber-800 ml-4">
                  <li>Ihr Lexware Office-Konto auf bereits vorhandene Transaktionen aus dem Zeitraum prüfen</li>
                  <li>Nur Transaktionen importieren, die noch nicht vorhanden sind</li>
                  <li>Den Überblick behalten, welche Zeiträume Sie bereits importiert haben</li>
                </ul>

                <div className="mt-4 p-4 bg-white rounded-lg border border-amber-200">
                  <p className="font-semibold text-amber-900 mb-2">Empfohlener Workflow:</p>
                  <ol className="list-decimal list-inside space-y-1 text-amber-800 text-sm">
                    <li>Notieren Sie das Datum der letzten Transaktion in Lexware Office</li>
                    <li>Exportieren Sie Wise-Transaktionen ab dem Folgetag</li>
                    <li>Konvertieren und importieren Sie die neuen Transaktionen</li>
                    <li>Aktualisieren Sie Ihre Aufzeichnungen mit dem neuen letzten Transaktionsdatum</li>
                  </ol>
                </div>
              </div>
            </div>
          </section>

          {/* Technical Details */}
          <section className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Technische Details
            </h2>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Was wird validiert?</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                  <li>Dateityp (muss .csv sein)</li>
                  <li>Dateigröße (maximal 5 MB)</li>
                  <li>CSV-Struktur (korrekte Spalten)</li>
                  <li>Pflichtfelder (Datum, Betrag, Transaktionstyp)</li>
                  <li>Datenformat (gültige Datumsangaben, Zahlen, Typen)</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Welche Transformationen werden durchgeführt?</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                  <li>Datumsformat: <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">29-09-2025</code> → <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">29.09.2025</code></li>
                  <li>Betragsformat: <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">1318.79</code> → <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">1318,79</code></li>
                  <li>Trennzeichen: Komma → Semikolon</li>
                  <li>Zeilenenden: Windows-Format (CRLF)</li>
                  <li>Kodierung: UTF-8 mit BOM</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Datenschutz & Sicherheit</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                  <li>✅ Alle Verarbeitungen erfolgen lokal in Ihrem Browser</li>
                  <li>✅ Keine Datenübertragung an Server</li>
                  <li>✅ Keine Datenspeicherung (Dateien nur temporär im Speicher)</li>
                  <li>✅ Keine Analysetools oder Tracking</li>
                  <li>✅ CSV-Injection-Prävention für sichere Ausgabe</li>
                  <li>✅ Open Source - Code ist öffentlich einsehbar</li>
                </ul>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Häufig gestellte Fragen
            </h2>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Werden meine Daten hochgeladen?</h3>
                <p className="text-gray-700">
                  Nein, Ihre Daten verlassen niemals Ihren Browser. Die gesamte Konvertierung erfolgt lokal auf Ihrem Gerät.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Welches CSV-Format benötige ich von Wise?</h3>
                <p className="text-gray-700">
                  Sie benötigen den Standard-CSV-Export aus Wise (Kontoverlauf & Dokumente → Kontoauszug herunterladen → CSV).
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Was passiert, wenn meine Datei einen Fehler hat?</h3>
                <p className="text-gray-700">
                  Das Tool zeigt detaillierte Fehlermeldungen auf Deutsch an. Diese erklären genau, was falsch ist und wie Sie es beheben können.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Kann ich mehrere Dateien gleichzeitig konvertieren?</h3>
                <p className="text-gray-700">
                  Aktuell nicht, aber diese Funktion ist für eine zukünftige Version geplant. Sie können aber schnell nacheinander mehrere Dateien konvertieren.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Funktioniert das Tool offline?</h3>
                <p className="text-gray-700">
                  Ja, nach dem ersten Laden der Webseite kann das Tool auch offline verwendet werden (dank Progressive Web App Technologie).
                </p>
              </div>
            </div>
          </section>

          {/* Back to Converter Button */}
          <div className="flex justify-center pt-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Zurück zum Konverter
            </Link>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
          <div className="flex flex-col items-center">
            <EvelanBadge />
          </div>
        </footer>
      </div>
    </div>
  );
}
