import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Datenschutzerklärung - WISE zu Lexware Office Konverter',
  description: 'Datenschutzerklärung für den WISE zu Lexware Office Konverter von Evelan GmbH',
};

export default function DatenschutzPage() {
  return (
    <>
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
          Datenschutzerklärung
        </h1>
        <p className="text-lg text-gray-600">
          Informationen zur Datenverarbeitung
        </p>
      </header>

      {/* Main Content */}
      <div className="space-y-8">
        {/* Privacy by Design */}
        <section className="bg-green-50 rounded-xl shadow-sm p-6 border border-green-100">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-green-900 mb-2">
                100% Datenschutz durch lokale Verarbeitung
              </h2>
              <p className="text-green-800">
                Dieser Konverter arbeitet ausschließlich lokal in Ihrem Browser. Es werden <strong>keine Daten</strong> an unsere Server oder Dritte übertragen. Ihre CSV-Dateien bleiben vollständig auf Ihrem Gerät.
              </p>
            </div>
          </div>
        </section>

        {/* Company Information */}
        <section className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            1. Verantwortlicher
          </h2>
          <div className="text-gray-700 space-y-2">
            <p className="font-semibold text-lg">Evelan GmbH</p>
            <p>Ballindamm 39</p>
            <p>20095 Hamburg</p>
            <p className="mt-4">
              <strong>Telefon:</strong>{' '}
              <a href="tel:+4940882159400" className="text-primary hover:underline">
                +49 40 88215940
              </a>
            </p>
            <p>
              <strong>E-Mail:</strong>{' '}
              <a href="mailto:datenschutz@evelan.de" className="text-primary hover:underline">
                datenschutz@evelan.de
              </a>
            </p>
          </div>
        </section>

        {/* Data Protection Officer */}
        <section className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            2. Datenschutzbeauftragter
          </h2>
          <div className="text-gray-700 space-y-2">
            <p className="font-semibold">heyData GmbH</p>
            <p>Schützenstr. 5</p>
            <p>10117 Berlin</p>
            <p className="mt-4">
              <strong>E-Mail:</strong>{' '}
              <a href="mailto:info@heydata.eu" className="text-primary hover:underline">
                info@heydata.eu
              </a>
            </p>
          </div>
        </section>

        {/* Data Processing */}
        <section className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            3. Datenverarbeitung bei Nutzung des Konverters
          </h2>
          <div className="text-gray-700 space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Keine Übertragung von CSV-Daten
              </h3>
              <p>
                Die Konvertierung Ihrer Wise CSV-Dateien erfolgt vollständig in Ihrem Browser mittels JavaScript. Es findet <strong>keine Übertragung</strong> Ihrer Finanzdaten an unsere Server oder Dritte statt.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Technische Funktionsweise
              </h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Ihre CSV-Datei wird lokal im Browser gelesen</li>
                <li>Die Konvertierung erfolgt clientseitig mittels JavaScript</li>
                <li>Die konvertierte Datei wird direkt auf Ihr Gerät heruntergeladen</li>
                <li>Keine Daten werden auf Servern gespeichert oder verarbeitet</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Rechtsgrundlage
              </h3>
              <p>
                Da keine personenbezogenen Daten verarbeitet werden, ist keine Rechtsgrundlage nach DSGVO erforderlich.
              </p>
            </div>
          </div>
        </section>

        {/* Website Usage */}
        <section className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            4. Datenverarbeitung beim Website-Besuch
          </h2>
          <div className="text-gray-700 space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Server-Logfiles
              </h3>
              <p>
                Beim Besuch dieser Website werden automatisch Informationen erfasst, die Ihr Browser an unseren Server übermittelt:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                <li>IP-Adresse (anonymisiert)</li>
                <li>Datum und Uhrzeit der Anfrage</li>
                <li>Browsertyp und Browserversion</li>
                <li>Verwendetes Betriebssystem</li>
                <li>Referrer URL</li>
                <li>Zugriffsstatus/HTTP-Statuscode</li>
              </ul>
              <p className="mt-2">
                <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an der Bereitstellung einer funktionsfähigen Website)
              </p>
              <p className="mt-2">
                <strong>Speicherdauer:</strong> Die Logfiles werden nach 7 Tagen automatisch gelöscht.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Hosting
              </h3>
              <p>
                Diese Website wird gehostet bei:
              </p>
              <p className="mt-2">
                <strong>Vercel Inc.</strong><br />
                440 N Barranca Ave #4133<br />
                Covina, CA 91723, USA
              </p>
              <p className="mt-2">
                Vercel erfüllt die Anforderungen der DSGVO durch entsprechende Standardvertragsklauseln.
              </p>
            </div>
          </div>
        </section>

        {/* SSL Encryption */}
        <section className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            5. SSL/TLS-Verschlüsselung
          </h2>
          <div className="text-gray-700">
            <p>
              Diese Website nutzt aus Sicherheitsgründen und zum Schutz der Übertragung eine SSL/TLS-Verschlüsselung. Eine verschlüsselte Verbindung erkennen Sie daran, dass die Adresszeile des Browsers von &quot;http://&quot; auf &quot;https://&quot; wechselt und an dem Schloss-Symbol in Ihrer Browserzeile.
            </p>
          </div>
        </section>

        {/* No Cookies */}
        <section className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            6. Cookies und Tracking
          </h2>
          <div className="text-gray-700">
            <p>
              Diese Website verwendet <strong>keine Cookies</strong> und setzt <strong>keine Tracking-Tools</strong> ein. Es erfolgt keine Analyse Ihres Nutzerverhaltens.
            </p>
          </div>
        </section>

        {/* Your Rights */}
        <section className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            7. Ihre Rechte
          </h2>
          <div className="text-gray-700 space-y-3">
            <p>
              Sie haben das Recht auf:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Auskunft über Ihre gespeicherten personenbezogenen Daten (Art. 15 DSGVO)</li>
              <li>Berichtigung unrichtiger Daten (Art. 16 DSGVO)</li>
              <li>Löschung Ihrer Daten (Art. 17 DSGVO)</li>
              <li>Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
              <li>Datenübertragbarkeit (Art. 20 DSGVO)</li>
              <li>Widerspruch gegen die Verarbeitung (Art. 21 DSGVO)</li>
              <li>Beschwerde bei einer Aufsichtsbehörde (Art. 77 DSGVO)</li>
            </ul>
            <p className="mt-4">
              <strong>Hinweis:</strong> Da bei der Nutzung des Konverters keine personenbezogenen Daten verarbeitet werden, können diese Rechte nur in Bezug auf die beim Website-Besuch erfassten Daten geltend gemacht werden.
            </p>
          </div>
        </section>

        {/* Updates */}
        <section className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            8. Änderungen dieser Datenschutzerklärung
          </h2>
          <div className="text-gray-700">
            <p>
              Wir behalten uns vor, diese Datenschutzerklärung anzupassen, damit sie stets den aktuellen rechtlichen Anforderungen entspricht oder um Änderungen unserer Leistungen umzusetzen. Für Ihren erneuten Besuch gilt dann die neue Datenschutzerklärung.
            </p>
            <p className="mt-3 text-sm text-gray-600">
              <strong>Stand:</strong> Oktober 2025
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
