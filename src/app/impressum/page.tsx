import Link from 'next/link';
import Script from 'next/script';
import type { Metadata } from 'next';
import { ArrowLeft } from 'lucide-react';
import { ThemeSwitcher } from '@/components/theme-switcher';

const baseUrl = 'https://wise-lexware-convert.evelan.de';

export const metadata: Metadata = {
  title: 'Impressum',
  description: 'Impressum und rechtliche Informationen für den WISE zu Lexware Office Konverter. Anbieter: Evelan GmbH, Hamburg.',
  keywords: [
    'Impressum',
    'Evelan GmbH',
    'Kontakt',
    'Rechtliche Informationen',
    'Hamburg',
    'Wise Konverter',
  ],
  openGraph: {
    title: 'Impressum - WISE zu Lexware Office Konverter',
    description: 'Rechtliche Informationen und Kontaktdaten. Anbieter: Evelan GmbH, Hamburg.',
    type: 'website',
    url: `${baseUrl}/impressum`,
  },
  alternates: {
    canonical: `${baseUrl}/impressum`,
  },
  robots: {
    index: true,
    follow: true,
  },
};

// Organization structured data (provides rich results for company info)
const organizationStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${baseUrl}/#organization`,
  name: 'Evelan GmbH',
  legalName: 'Evelan GmbH',
  url: 'https://evelan.de',
  logo: `${baseUrl}/icon.svg`,
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Ballindamm 39',
    addressLocality: 'Hamburg',
    postalCode: '20095',
    addressCountry: 'DE',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+49-40-88215940',
    contactType: 'customer service',
    email: 'kontakt@evelan.de',
    availableLanguage: ['German', 'English'],
  },
  vatID: 'DE315030550',
  sameAs: [
    'https://evelan.de',
  ],
};

// WebPage structured data
const webPageStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': `${baseUrl}/impressum`,
  name: 'Impressum',
  description: 'Impressum und rechtliche Informationen für den WISE zu Lexware Office Konverter.',
  url: `${baseUrl}/impressum`,
  inLanguage: 'de-DE',
  isPartOf: {
    '@type': 'WebSite',
    '@id': `${baseUrl}/#website`,
    name: 'WISE zu Lexware Office Konverter',
    url: baseUrl,
  },
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
      name: 'Impressum',
      item: `${baseUrl}/impressum`,
    },
  ],
};

export default function ImpressumPage() {
  return (
    <>
      {/* Structured Data - Organization */}
      <Script
        id="organization-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationStructuredData) }}
      />

      {/* Structured Data - WebPage */}
      <Script
        id="webpage-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageStructuredData) }}
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
            Impressum
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
            Impressum
          </h1>
          <p className="text-lg text-muted-foreground">
            Angaben gemäß § 5 TMG
          </p>
        </header>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Company Information */}
          <section className="bg-card rounded-xl shadow-sm p-6 border border-border">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Anbieter
            </h2>
            <div className="text-foreground space-y-2">
              <p className="font-semibold text-lg text-foreground">Evelan GmbH</p>
              <p>Ballindamm 39</p>
              <p>20095 Hamburg</p>
              <p className="mt-4">
                <strong className="text-foreground">Handelsregister:</strong> HRB149325
              </p>
              <p>
                <strong className="text-foreground">Registergericht:</strong> Hamburg
              </p>
              <p className="mt-4">
                <strong className="text-foreground">Vertreten durch:</strong> Andreas Straub
              </p>
            </div>
          </section>

          {/* Contact Information */}
          <section className="bg-card rounded-xl shadow-sm p-6 border border-border">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Kontakt
            </h2>
            <div className="text-foreground space-y-2">
              <p>
                <strong className="text-foreground">Telefon:</strong>{' '}
                <a href="tel:+4940882159400" className="text-primary hover:underline">
                  +49 40 88215940
                </a>
              </p>
              <p>
                <strong className="text-foreground">E-Mail:</strong>{' '}
                <a href="mailto:kontakt@evelan.de" className="text-primary hover:underline">
                  kontakt@evelan.de
                </a>
              </p>
            </div>
          </section>

          {/* Tax Information */}
          <section className="bg-card rounded-xl shadow-sm p-6 border border-border">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Umsatzsteuer-ID
            </h2>
            <div className="text-foreground">
              <p>
                <strong className="text-foreground">Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:</strong>
              </p>
              <p className="mt-2">DE315030550</p>
            </div>
          </section>

          {/* Dispute Resolution */}
          <section className="bg-card rounded-xl shadow-sm p-6 border border-border">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Verbraucherstreitbeilegung / Universalschlichtungsstelle
            </h2>
            <div className="text-foreground space-y-3">
              <p>
                Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer
                Verbraucherschlichtungsstelle teilzunehmen.
              </p>
              <p>
                <strong className="text-foreground">Plattform der EU-Kommission zur Online-Streitbeilegung:</strong>
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
          <section className="bg-card rounded-xl shadow-sm p-6 border border-border">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Zentrale Kontaktstelle nach dem Digital Services Act (DSA)
            </h2>
            <div className="text-foreground space-y-3">
              <p>
                Unsere zentrale Kontaktstelle für Nutzer und Behörden nach Art. 11, 12 DSA erreichen Sie wie folgt:
              </p>
              <p>
                <strong className="text-foreground">E-Mail:</strong>{' '}
                <a href="mailto:kontakt@evelan.de" className="text-primary hover:underline">
                  kontakt@evelan.de
                </a>
              </p>
              <p>
                <strong className="text-foreground">Kontaktsprachen:</strong> Deutsch, Englisch
              </p>
            </div>
          </section>

          {/* Copyright */}
          <section className="bg-card rounded-xl shadow-sm p-6 border border-border">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Urheberrecht
            </h2>
            <div className="text-foreground space-y-3">
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
    </>
  );
}
