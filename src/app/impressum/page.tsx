import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { EvelanBadge } from '@/components/evelan-badge';

export const metadata = {
  title: 'Impressum - WISE zu Lexware Office Konverter',
  description: 'Impressum und rechtliche Informationen für den WISE zu Lexware Office Konverter von Evelan GmbH',
};

export default function ImpressumPage() {
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
            Impressum
          </h1>
          <p className="text-lg text-gray-600">
            Angaben gemäß § 5 TMG
          </p>
        </header>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Company Information */}
          <section className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Anbieter
            </h2>
            <div className="text-gray-700 space-y-2">
              <p className="font-semibold text-lg">Evelan GmbH</p>
              <p>Ballindamm 39</p>
              <p>20095 Hamburg</p>
              <p className="mt-4">
                <strong>Handelsregister:</strong> HRB149325
              </p>
              <p>
                <strong>Registergericht:</strong> Hamburg
              </p>
              <p className="mt-4">
                <strong>Vertreten durch:</strong> Andreas Straub
              </p>
            </div>
          </section>

          {/* Contact Information */}
          <section className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Kontakt
            </h2>
            <div className="text-gray-700 space-y-2">
              <p>
                <strong>Telefon:</strong>{' '}
                <a href="tel:+4940882159400" className="text-primary hover:underline">
                  +49 40 88215940
                </a>
              </p>
              <p>
                <strong>E-Mail:</strong>{' '}
                <a href="mailto:kontakt@evelan.de" className="text-primary hover:underline">
                  kontakt@evelan.de
                </a>
              </p>
            </div>
          </section>

          {/* Tax Information */}
          <section className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Umsatzsteuer-ID
            </h2>
            <div className="text-gray-700">
              <p>
                <strong>Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:</strong>
              </p>
              <p className="mt-2">DE315030550</p>
            </div>
          </section>

          {/* Dispute Resolution */}
          <section className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Verbraucherstreitbeilegung / Universalschlichtungsstelle
            </h2>
            <div className="text-gray-700 space-y-3">
              <p>
                Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer
                Verbraucherschlichtungsstelle teilzunehmen.
              </p>
              <p>
                <strong>Plattform der EU-Kommission zur Online-Streitbeilegung:</strong>
              </p>
              <p>
                <a
                  href="https://ec.europa.eu/consumers/odr/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline break-all"
                >
                  https://ec.europa.eu/consumers/odr/
                </a>
              </p>
            </div>
          </section>

          {/* Digital Services Act */}
          <section className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Zentrale Kontaktstelle nach dem Digital Services Act (DSA)
            </h2>
            <div className="text-gray-700 space-y-3">
              <p>
                Unsere zentrale Kontaktstelle für Nutzer und Behörden nach Art. 11, 12 DSA erreichen Sie wie folgt:
              </p>
              <p>
                <strong>E-Mail:</strong>{' '}
                <a href="mailto:kontakt@evelan.de" className="text-primary hover:underline">
                  kontakt@evelan.de
                </a>
              </p>
              <p>
                <strong>Kontaktsprachen:</strong> Deutsch, Englisch
              </p>
            </div>
          </section>

          {/* Copyright */}
          <section className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Urheberrecht
            </h2>
            <div className="text-gray-700 space-y-3">
              <p>
                Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen
                dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art
                der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen
                Zustimmung des jeweiligen Autors bzw. Erstellers.
              </p>
              <p>
                Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet.
              </p>
            </div>
          </section>
        </div>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-gray-200 text-center">
          <EvelanBadge />
        </footer>
      </div>
    </div>
  );
}
