import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { Footer } from "@/components/footer";
import { Analytics } from "@/components/analytics";
import { ClientWrapper } from "@/components/client-wrapper";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#4F46E5",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://wise-lexware-convert.evelan.de"),
  title: {
    default: "Wise zu Lexware Office CSV-Konverter",
    template: "%s | Wise-Lexware Konverter",
  },
  description: "Wandeln Sie Wise CSV-Exporte in das Lexware Office Bankimport-Format um. Für: Banking → Konten → Transaktionen importieren. 100% Datenschutz - alle Daten bleiben in Ihrem Browser.",
  keywords: [
    "Wise",
    "Lexware Office",
    "LexOffice",
    "CSV",
    "Konverter",
    "Bankimport",
    "TransferWise",
    "Banking",
    "Buchhaltung",
    "CSV Export",
    "CSV Import",
    "Kontoumsätze",
    "Finanzen",
    "Deutschland",
    "Freelancer",
    "Selbstständige",
    "Internationale Zahlungen",
    "Offline-Konto",
    "Drittbank",
    "Neobank",
  ],
  authors: [
    {
      name: "Evelan GmbH",
      url: "https://evelan.de",
    },
  ],
  creator: "Evelan GmbH",
  publisher: "Evelan GmbH",
  applicationName: "WISE zu Lexware Office Konverter",
  category: "Finance",

  // Open Graph
  openGraph: {
    type: "website",
    locale: "de_DE",
    url: "https://wise-lexware-convert.evelan.de",
    siteName: "WISE zu Lexware Office Konverter",
    title: "WISE zu Lexware Office Konverter - Bankimport CSV Konvertierung",
    description: "Wandeln Sie Wise CSV-Exporte in das Lexware Office Bankimport-Format um. 100% Datenschutz - alle Daten bleiben in Ihrem Browser.",
    images: [
      {
        url: "/icon.svg",
        width: 512,
        height: 512,
        alt: "WISE zu Lexware Office Konverter Logo",
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: "summary",
    title: "WISE zu Lexware Office Konverter",
    description: "Wandeln Sie Wise CSV-Exporte in das Lexware Office Bankimport-Format um. 100% Datenschutz.",
    images: ["/icon.svg"],
  },

  // Icons
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },

  // Manifest
  manifest: "/manifest.json",

  // Robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Verification (optional - add when you have accounts)
  // verification: {
  //   google: "your-google-verification-code",
  //   yandex: "your-yandex-verification-code",
  // },

  // Alternates
  alternates: {
    canonical: "https://wise-lexware-convert.evelan.de",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const baseUrl = "https://wise-lexware-convert.evelan.de";

  // WebSite structured data for site-wide SEO
  const websiteStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${baseUrl}/#website`,
    name: "WISE zu Lexware Office Konverter",
    url: baseUrl,
    description: "Wandeln Sie Wise CSV-Exporte in das Lexware Office Bankimport-Format um. 100% Datenschutz - alle Daten bleiben in Ihrem Browser.",
    inLanguage: "de-DE",
    publisher: {
      "@id": `${baseUrl}/#organization`,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${baseUrl}/blog?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  // Organization structured data
  const organizationStructuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${baseUrl}/#organization`,
    name: "Evelan GmbH",
    legalName: "Evelan GmbH",
    url: "https://evelan.de",
    logo: {
      "@type": "ImageObject",
      url: `${baseUrl}/icon.svg`,
      width: 512,
      height: 512,
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: "Ballindamm 39",
      addressLocality: "Hamburg",
      postalCode: "20095",
      addressCountry: "DE",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+49-40-88215940",
      contactType: "customer service",
      email: "kontakt@evelan.de",
      availableLanguage: ["German", "English"],
    },
    vatID: "DE315030550",
  };

  // SoftwareApplication structured data
  const softwareStructuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${baseUrl}/#software`,
    name: "WISE zu Lexware Office Konverter",
    applicationCategory: "FinanceApplication",
    applicationSubCategory: "CSV Converter",
    operatingSystem: "Web Browser",
    description: "Wandeln Sie Wise CSV-Exporte in das Lexware Office Bankimport-Format um. 100% Datenschutz - alle Daten bleiben in Ihrem Browser.",
    url: baseUrl,
    author: {
      "@id": `${baseUrl}/#organization`,
    },
    publisher: {
      "@id": `${baseUrl}/#organization`,
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
    },
    inLanguage: "de-DE",
    softwareVersion: "2.0.0",
    releaseNotes: "Vorschau-Funktion, Transaktions-Bearbeitung, verbesserte Validierung",
    featureList: [
      "CSV Konvertierung von Wise zu Lexware Office",
      "100% Client-side Verarbeitung",
      "Datenschutz ohne Server-Uploads",
      "Transaktions-Vorschau vor Konvertierung",
      "Fehlerhafte Transaktionen bearbeiten",
      "Deutsche Fehlermeldungen",
      "Offline-fähig (PWA)",
    ],
    screenshot: `${baseUrl}/icon.svg`,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "5",
      ratingCount: "1",
      bestRating: "5",
      worstRating: "1",
    },
  };

  // Combined structured data as array
  const structuredData = [
    websiteStructuredData,
    organizationStructuredData,
    softwareStructuredData,
  ];

  return (
    <html lang="de" suppressHydrationWarning>
      <head>
        {/* Structured Data */}
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />

        {/* Umami Analytics */}
        <Analytics />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen flex flex-col">
            <div className="flex-1 bg-gradient-to-br from-evelan-ice via-white to-evelan-ice/50 dark:from-evelan-petrol dark:via-evelan-petrol dark:to-evelan-petrol-alt">
              <div className="max-w-4xl mx-auto px-4 py-12">
                <ClientWrapper>{children}</ClientWrapper>
              </div>
            </div>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}