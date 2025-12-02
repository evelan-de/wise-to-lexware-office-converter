import Link from 'next/link';
import Image from 'next/image';
import Script from 'next/script';
import type { Metadata } from 'next';
import { ArrowLeft, FileUp, CheckCircle, Download, Upload, AlertCircle, ExternalLink } from 'lucide-react';
import { ThemeSwitcher } from '@/components/theme-switcher';

const baseUrl = 'https://wise-lexware-convert.evelan.de';

export const metadata: Metadata = {
  title: 'Anleitung: Wise CSV für Lexware Office konvertieren',
  description: 'Schritt-für-Schritt Anleitung mit Screenshots: So exportieren Sie Wise-Transaktionen als CSV und importieren sie in Lexware Office. Kostenlos & ohne Registrierung.',
  keywords: [
    'Wise Anleitung',
    'Lexware Office Import',
    'CSV Konvertierung Tutorial',
    'Wise Export Anleitung',
    'Bankimport Anleitung',
    'TransferWise zu Lexware',
    'Wise CSV exportieren',
    'Lexware Office Transaktionen importieren',
    'Kontoauszug importieren',
    'Banking CSV Import',
  ],
  openGraph: {
    title: 'Anleitung: Wise CSV für Lexware Office konvertieren',
    description: 'Schritt-für-Schritt Anleitung mit Screenshots: Wise CSV-Exporte für Lexware Office konvertieren.',
    type: 'article',
    url: `${baseUrl}/hilfe`,
  },
  twitter: {
    card: 'summary',
    title: 'Anleitung: Wise zu Lexware Office',
    description: 'So konvertieren Sie Wise CSV-Exporte für Lexware Office.',
  },
  alternates: {
    canonical: `${baseUrl}/hilfe`,
  },
};

// HowTo structured data for SEO
const howToStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'Wise CSV-Exporte für Lexware Office konvertieren',
  description: 'Schritt-für-Schritt Anleitung: So exportieren Sie Wise-Transaktionen als CSV und importieren sie in Lexware Office.',
  image: `${baseUrl}/icon.svg`,
  totalTime: 'PT5M',
  estimatedCost: {
    '@type': 'MonetaryAmount',
    currency: 'EUR',
    value: '0',
  },
  tool: [
    {
      '@type': 'HowToTool',
      name: 'Wise-Konto',
    },
    {
      '@type': 'HowToTool',
      name: 'Lexware Office-Konto',
    },
    {
      '@type': 'HowToTool',
      name: 'WISE zu Lexware Office Konverter',
    },
  ],
  step: [
    {
      '@type': 'HowToStep',
      name: 'Wise CSV-Export herunterladen',
      text: 'Melden Sie sich bei Wise an, navigieren Sie zu Transaktionen > Kontoauszüge und Berichte, wählen Sie einen Zeitraum und exportieren Sie die Daten als CSV-Datei.',
      url: `${baseUrl}/hilfe#schritt-1`,
    },
    {
      '@type': 'HowToStep',
      name: 'CSV-Datei hochladen',
      text: 'Öffnen Sie den Konverter und laden Sie Ihre Wise CSV-Datei per Drag & Drop oder durch Klicken auf den Upload-Bereich hoch.',
      url: `${baseUrl}/hilfe#schritt-2`,
    },
    {
      '@type': 'HowToStep',
      name: 'Daten überprüfen',
      text: 'Prüfen Sie die Vorschau Ihrer Transaktionen und korrigieren Sie bei Bedarf fehlerhafte Einträge.',
      url: `${baseUrl}/hilfe#schritt-3`,
    },
    {
      '@type': 'HowToStep',
      name: 'Konvertierte Datei herunterladen',
      text: 'Klicken Sie auf Konvertieren. Die Lexware Office-kompatible CSV-Datei wird automatisch heruntergeladen.',
      url: `${baseUrl}/hilfe#schritt-4`,
    },
    {
      '@type': 'HowToStep',
      name: 'In Lexware Office importieren',
      text: 'Öffnen Sie Lexware Office, navigieren Sie zu Banking > Konten, wählen Sie Ihr Konto und importieren Sie die CSV-Datei über Transaktionen importieren.',
      url: `${baseUrl}/hilfe#schritt-5`,
    },
  ],
};

// FAQPage structured data
const faqStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Werden meine Daten beim Konvertieren hochgeladen?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Nein, Ihre Daten verlassen niemals Ihren Browser. Die gesamte Konvertierung erfolgt lokal auf Ihrem Gerät. Es werden keine Daten an Server übertragen.',
      },
    },
    {
      '@type': 'Question',
      name: 'Welches CSV-Format benötige ich von Wise?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Sie benötigen den Standard-CSV-Export aus Wise. Navigieren Sie zu Transaktionen > Kontoauszüge und Berichte > Auszüge und wählen Sie CSV als Format.',
      },
    },
    {
      '@type': 'Question',
      name: 'Was passiert, wenn meine Datei einen Fehler hat?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Das Tool zeigt detaillierte Fehlermeldungen auf Deutsch an. Diese erklären genau, was falsch ist und wie Sie es beheben können.',
      },
    },
    {
      '@type': 'Question',
      name: 'Kann ich mehrere Dateien gleichzeitig konvertieren?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Aktuell nicht, aber Sie können schnell nacheinander mehrere Dateien konvertieren. Die Funktion für Batch-Verarbeitung ist für eine zukünftige Version geplant.',
      },
    },
    {
      '@type': 'Question',
      name: 'Funktioniert das Tool auch offline?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Ja, nach dem ersten Laden der Webseite kann das Tool auch offline verwendet werden, dank Progressive Web App Technologie.',
      },
    },
  ],
};

// BreadcrumbList structured data
const breadcrumbStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Startseite',
      item: baseUrl,
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Anleitung',
      item: `${baseUrl}/hilfe`,
    },
  ],
};

export default function HilfePage() {
  return (
    <>
      {/* Structured Data - HowTo */}
      <Script
        id="howto-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToStructuredData) }}
      />

      {/* Structured Data - FAQ */}
      <Script
        id="faq-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />

      {/* Structured Data - Breadcrumb */}
      <Script
        id="breadcrumb-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }}
      />

      {/* Theme Switcher */}
      <div className="absolute top-4 right-4">
        <ThemeSwitcher />
      </div>

      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex items-center gap-2 text-sm text-muted-foreground">
          <li>
            <Link href="/" className="hover:text-primary transition-colors">
              Startseite
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-foreground font-medium" aria-current="page">
            Anleitung
          </li>
        </ol>
      </nav>

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
          <h1 className="text-4xl font-bold text-foreground mb-3">
            Anleitung zur Verwendung
          </h1>
          <p className="text-lg text-muted-foreground">
            So konvertieren Sie Ihre Wise-Transaktionen für Lexware Office
          </p>
        </header>

        {/* Main Content */}
        <div className="space-y-8">
          {/* What is this tool */}
          <section className="bg-card rounded-xl shadow-sm p-6 border border-border">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Was macht dieses Tool?
            </h2>
            <p className="text-foreground mb-4">
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
            <p className="text-foreground">
              Das Tool ist nützlich, wenn Sie:
            </p>
            <ul className="list-disc list-outside ml-6 space-y-2 mt-3 text-foreground">
              <li>Historische Wise-Transaktionen in Lexware Office importieren möchten</li>
              <li>Die automatische Bankverbindung nicht verfügbar oder nicht funktionsfähig ist</li>
              <li>Bestimmte Wise-Transaktionen manuell zu Lexware Office hinzufügen müssen</li>
            </ul>
          </section>

          {/* Step by Step */}
          <section className="bg-card rounded-xl shadow-sm p-6 border border-border">
            <h2 className="text-2xl font-semibold text-foreground mb-6">
              Schritt-für-Schritt Anleitung
            </h2>

            <div className="space-y-8">
              {/* Step 1 */}
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-semibold">
                    1
                  </div>
                  <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <Download className="w-5 h-5 text-primary" />
                    Wise CSV-Export herunterladen
                  </h3>
                </div>
                <div className="text-foreground space-y-3">
                    <ol className="list-decimal list-outside ml-6 space-y-3">
                      <li>
                        Melden Sie sich in Ihrem Wise-Konto an, klicken Sie auf <strong className="text-foreground">Transaktionen</strong> und dann auf <strong className="text-foreground">Kontoauszüge und Berichte</strong>
                        <div className="rounded-lg border border-border overflow-hidden mt-2">
                          <Image
                            src="/screenshots/wise-step1.png"
                            alt="Wise - Transaktionen und Kontoauszüge öffnen"
                            width={800}
                            height={450}
                            className="w-full h-auto"
                          />
                        </div>
                      </li>
                      <li>
                        Klicken Sie auf <strong className="text-foreground">Auszüge</strong>
                        <div className="rounded-lg border border-border overflow-hidden mt-2">
                          <Image
                            src="/screenshots/wise-step2.png"
                            alt="Wise - Auszüge öffnen"
                            width={800}
                            height={450}
                            className="w-full h-auto"
                          />
                        </div>
                      </li>
                      <li>
                        Klicken Sie auf <strong className="text-foreground">Benutzerdefiniert</strong> und dann auf <strong className="text-foreground">Erstelle einen Auszug</strong>
                        <div className="rounded-lg border border-border overflow-hidden mt-2">
                          <Image
                            src="/screenshots/wise-step3.png"
                            alt="Wise - Benutzerdefiniert und Auszug erstellen"
                            width={800}
                            height={450}
                            className="w-full h-auto"
                          />
                        </div>
                      </li>
                      <li>
                        Wählen Sie das Format <strong className="text-foreground">CSV</strong> und klicken Sie auf <strong className="text-foreground">Kontoauszug erstellen</strong>
                        <div className="rounded-lg border border-border overflow-hidden mt-2">
                          <Image
                            src="/screenshots/wise-step4.png"
                            alt="Wise - CSV-Format auswählen und herunterladen"
                            width={800}
                            height={450}
                            className="w-full h-auto"
                          />
                        </div>
                      </li>
                      <li>Die CSV-Datei wird automatisch heruntergeladen</li>
                    </ol>
                </div>
              </div>

              {/* Step 2 */}
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-semibold">
                    2
                  </div>
                  <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <FileUp className="w-5 h-5 text-primary" />
                    CSV-Datei hochladen
                  </h3>
                </div>
                <div className="text-foreground space-y-2">
                  <ol className="list-decimal list-outside ml-6 space-y-1">
                    <li>Gehen Sie zurück zur <Link href="/" className="text-primary hover:underline">Hauptseite</Link></li>
                    <li>Ziehen Sie Ihre Wise CSV-Datei in den Upload-Bereich</li>
                    <li>Oder klicken Sie auf den Bereich, um die Datei auszuwählen</li>
                  </ol>
                  <p className="text-sm text-muted-foreground mt-2">
                    <strong className="text-foreground">Hinweis:</strong> Maximale Dateigröße: 5 MB
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-semibold">
                    3
                  </div>
                  <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-primary" />
                    Automatische Konvertierung
                  </h3>
                </div>
                <div className="text-foreground space-y-2">
                  <p>Die Datei wird automatisch validiert und konvertiert:</p>
                  <ul className="list-disc list-outside ml-6 space-y-1">
                    <li>Prüfung der CSV-Struktur und erforderlichen Felder</li>
                    <li>Umwandlung der Datumsformate (DD-MM-YYYY → DD.MM.YYYY)</li>
                    <li>Umwandlung der Betragsformate (1234.56 → 1234,56)</li>
                    <li>Zuordnung von Sender/Empfänger basierend auf Transaktionstyp</li>
                  </ul>
                  <p className="mt-3">Sie sehen Live-Statistiken während der Verarbeitung.</p>
                </div>
              </div>

              {/* Step 4 */}
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-semibold">
                    4
                  </div>
                  <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <Download className="w-5 h-5 text-primary" />
                    Datei wird automatisch heruntergeladen
                  </h3>
                </div>
                <div className="text-foreground space-y-2">
                  <p>Die konvertierte Datei wird automatisch heruntergeladen:</p>
                  <ul className="list-disc list-outside ml-6 space-y-1">
                    <li>Dateiname: <code className="bg-muted px-2 py-0.5 rounded text-sm text-foreground">lexoffice_import_YYYY-MM-DD.csv</code></li>
                    <li>Format: Lexware Office-kompatible CSV-Datei</li>
                    <li>Bereit für den direkten Import in Lexware Office</li>
                  </ul>
                </div>
              </div>

              {/* Step 5 */}
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-semibold">
                    5
                  </div>
                  <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <Upload className="w-5 h-5 text-primary" />
                    In Lexware Office importieren
                  </h3>
                </div>
                <div className="text-foreground space-y-3">
                  <ol className="list-decimal list-outside ml-6 space-y-2">
                    <li>Melden Sie sich in Ihrem Lexware Office-Konto an</li>
                    <li>Navigieren Sie zu <strong className="text-foreground">Banking → Konten</strong></li>
                    <li>Wählen Sie Ihr Bankkonto aus</li>
                    <li>
                      Klicken Sie auf <strong className="text-foreground">&quot;Transaktionen importieren&quot;</strong>
                      <div className="rounded-lg border border-border overflow-hidden mt-2">
                        <Image
                          src="/screenshots/lexoffice-upload.png"
                          alt="Lexware Office - CSV-Datei hochladen"
                          width={800}
                          height={450}
                          className="w-full h-auto"
                        />
                      </div>
                    </li>
                    <li>Laden Sie die konvertierte CSV-Datei hoch</li>
                    <li>Überprüfen Sie die Spaltenzuordnung (sollte automatisch erkannt werden)</li>
                    <li>Bestätigen Sie den Import</li>
                  </ol>
                  <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/40 rounded-lg border border-blue-200 dark:border-blue-800">
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      <strong className="text-blue-900 dark:text-blue-100">Hinweis:</strong> Detaillierte Informationen zum Import-Prozess finden Sie in der{' '}
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
          </section>

          {/* Important Warning */}
          <section className="bg-amber-50 dark:bg-amber-950/40 rounded-xl border-2 border-amber-200 dark:border-amber-800 p-6">
            <div className="flex gap-3">
              <AlertCircle className="w-6 h-6 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-lg font-semibold text-amber-900 dark:text-amber-100 mb-2">
                  Wichtiger Hinweis zu Duplikaten
                </h3>
                <p className="text-amber-800 dark:text-amber-200 mb-3">
                  <strong className="text-amber-900 dark:text-amber-100">Lexware Office prüft beim CSV-Import nicht automatisch auf Duplikate.</strong>{' '}
                  Vor dem Import sollten Sie:
                </p>
                <ul className="list-disc list-outside ml-6 space-y-1 text-amber-800 dark:text-amber-200">
                  <li>Ihr Lexware Office-Konto auf bereits vorhandene Transaktionen aus dem Zeitraum prüfen</li>
                  <li>Nur Transaktionen importieren, die noch nicht vorhanden sind</li>
                  <li>Den Überblick behalten, welche Zeiträume Sie bereits importiert haben</li>
                </ul>

                <div className="mt-4 p-4 bg-white dark:bg-amber-900/30 rounded-lg border border-amber-200 dark:border-amber-700">
                  <p className="font-semibold text-amber-900 dark:text-amber-100 mb-2">Empfohlener Workflow:</p>
                  <ol className="list-decimal list-outside ml-6 space-y-1 text-amber-800 dark:text-amber-200 text-sm">
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
          <section className="bg-card rounded-xl shadow-sm p-6 border border-border">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Technische Details
            </h2>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-foreground mb-2">Was wird validiert?</h3>
                <ul className="list-disc list-outside ml-6 space-y-1 text-foreground">
                  <li>Dateityp (muss .csv sein)</li>
                  <li>Dateigröße (maximal 5 MB)</li>
                  <li>CSV-Struktur (korrekte Spalten)</li>
                  <li>Pflichtfelder (Datum, Betrag, Transaktionstyp)</li>
                  <li>Datenformat (gültige Datumsangaben, Zahlen, Typen)</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">Welche Transformationen werden durchgeführt?</h3>
                <ul className="list-disc list-outside ml-6 space-y-1 text-foreground">
                  <li>Datumsformat: <code className="bg-muted px-1.5 py-0.5 rounded text-sm text-foreground">29-09-2025</code> → <code className="bg-muted px-1.5 py-0.5 rounded text-sm text-foreground">29.09.2025</code></li>
                  <li>Betragsformat: <code className="bg-muted px-1.5 py-0.5 rounded text-sm text-foreground">1318.79</code> → <code className="bg-muted px-1.5 py-0.5 rounded text-sm text-foreground">1318,79</code></li>
                  <li>Trennzeichen: Komma → Semikolon</li>
                  <li>Zeilenenden: Windows-Format (CRLF)</li>
                  <li>Kodierung: UTF-8 mit BOM</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">Datenschutz & Sicherheit</h3>
                <ul className="list-disc list-outside ml-6 space-y-1 text-foreground">
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
          <section className="bg-card rounded-xl shadow-sm p-6 border border-border">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Häufig gestellte Fragen
            </h2>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-foreground mb-1">Werden meine Daten hochgeladen?</h3>
                <p className="text-foreground">
                  Nein, Ihre Daten verlassen niemals Ihren Browser. Die gesamte Konvertierung erfolgt lokal auf Ihrem Gerät.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-1">Welches CSV-Format benötige ich von Wise?</h3>
                <p className="text-foreground">
                  Sie benötigen den Standard-CSV-Export aus Wise (Kontoverlauf & Dokumente → Kontoauszug herunterladen → CSV).
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-1">Was passiert, wenn meine Datei einen Fehler hat?</h3>
                <p className="text-foreground">
                  Das Tool zeigt detaillierte Fehlermeldungen auf Deutsch an. Diese erklären genau, was falsch ist und wie Sie es beheben können.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-1">Kann ich mehrere Dateien gleichzeitig konvertieren?</h3>
                <p className="text-foreground">
                  Aktuell nicht, aber diese Funktion ist für eine zukünftige Version geplant. Sie können aber schnell nacheinander mehrere Dateien konvertieren.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-1">Funktioniert das Tool offline?</h3>
                <p className="text-foreground">
                  Ja, nach dem ersten Laden der Webseite kann das Tool auch offline verwendet werden (dank Progressive Web App Technologie).
                </p>
              </div>
            </div>
          </section>

          {/* Back to Converter Button */}
          <div className="flex justify-center pt-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Zurück zum Konverter
            </Link>
          </div>
        </div>
    </>
  );
}
