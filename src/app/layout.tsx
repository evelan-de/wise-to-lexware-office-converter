import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
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
    default: "WISE zu Lexware Office Konverter - Bankimport CSV Konvertierung",
    template: "%s | WISE zu Lexware Office Konverter",
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
  // Structured Data (JSON-LD) for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "WISE zu Lexware Office Konverter",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web Browser",
    description: "Wandeln Sie Wise CSV-Exporte in das Lexware Office Bankimport-Format um. 100% Datenschutz - alle Daten bleiben in Ihrem Browser.",
    url: "https://wise-lexware-convert.evelan.de",
    author: {
      "@type": "Organization",
      name: "Evelan GmbH",
      url: "https://evelan.de",
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
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "EUR",
    },
    inLanguage: "de-DE",
    softwareVersion: "1.0.0",
    featureList: [
      "CSV Konvertierung",
      "Wise zu Lexware Office",
      "Client-side Verarbeitung",
      "Datenschutz",
      "Keine Server-Uploads",
    ],
    screenshot: "https://wise-lexware-convert.evelan.de/icon.svg",
  };

  return (
    <html lang="de">
      <head>
        {/* Structured Data */}
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}