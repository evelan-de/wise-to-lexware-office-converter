import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WISE zu Lexware Office Konverter - Bankimport CSV Konvertierung",
  description: "Wandeln Sie Wise CSV-Exporte in das Lexware Office Bankimport-Format um. Für: Banking → Konten → Transaktionen importieren. 100% Datenschutz - alle Daten bleiben in Ihrem Browser.",
  keywords: ["Wise", "Lexware Office", "LexOffice", "CSV", "Konverter", "Bankimport", "TransferWise", "Banking"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
