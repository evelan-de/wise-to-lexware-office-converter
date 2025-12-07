'use client';

import { ThemeSwitcher } from '@/components/theme-switcher';

export function HeroSection() {
  return (
    <>
      {/* Theme Switcher */}
      <div className="absolute top-4 right-4 z-10">
        <ThemeSwitcher />
      </div>

      <header className="relative mb-16 pt-8">
        {/* Background with Evelan colors */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-evelan-gold/15 dark:bg-evelan-gold/10 rounded-full blur-[100px] animate-pulse-glow" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-evelan-teal/20 dark:bg-evelan-teal/15 rounded-full blur-[100px]" />
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text Content */}
          <div className="space-y-6">
            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-evelan-teal/10 dark:bg-evelan-teal/20 text-evelan-teal dark:text-evelan-ice border border-evelan-teal/20 dark:border-evelan-teal/30">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
                100% Datenschutz
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-evelan-gold/10 dark:bg-evelan-gold/20 text-evelan-gold-dark dark:text-evelan-gold border border-evelan-gold/20 dark:border-evelan-gold/30">
                <span className="w-1.5 h-1.5 rounded-full bg-evelan-gold animate-pulse" />
                Open Source
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground">
              WISE zu{' '}
              <span className="bg-gradient-to-r from-evelan-teal to-evelan-gold bg-clip-text text-transparent">
                Lexware Office
              </span>{' '}
              Konverter
            </h1>

            {/* Description */}
            <p className="text-lg text-muted-foreground max-w-lg">
              Wandle deine Wise CSV-Exporte in Sekundenschnelle in das Lexware Office Bankimport-Format um. Komplett im Browser - keine Daten verlassen deinen Computer.
            </p>

            {/* Features */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-evelan-teal/10 dark:bg-evelan-teal/20 flex items-center justify-center">
                  <svg className="w-3 h-3 text-evelan-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <span>Keine Server-Uploads - alles lokal</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-evelan-teal/10 dark:bg-evelan-teal/20 flex items-center justify-center">
                  <svg className="w-3 h-3 text-evelan-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <span>Vorschau vor dem Download</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-evelan-teal/10 dark:bg-evelan-teal/20 flex items-center justify-center">
                  <svg className="w-3 h-3 text-evelan-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <span>Fehlerhafte Einträge bearbeiten</span>
              </div>
            </div>

            {/* CTA */}
            <a
              href="/hilfe"
              className="inline-flex items-center gap-2 text-sm font-medium text-evelan-teal hover:text-evelan-gold transition-colors"
            >
              Anleitung lesen
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </a>
          </div>

          {/* Right: Visual Flow */}
          <div className="relative">
            <div className="space-y-4">
              {/* Step 1: Wise CSV */}
              <div className="animate-float relative bg-card dark:bg-card rounded-xl border border-evelan-teal/20 dark:border-evelan-teal/30 shadow-lg p-4 card-glow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-[#9fe870] flex items-center justify-center glow-teal">
                    <span className="text-lg font-bold text-black">W</span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">Wise Export</p>
                    <p className="text-xs text-muted-foreground">wise-statement.csv</p>
                  </div>
                </div>
                <div className="font-mono text-xs bg-evelan-ice dark:bg-evelan-petrol rounded p-2 text-muted-foreground overflow-hidden">
                  <div className="truncate">TransferWise ID,Date,Amount...</div>
                  <div className="truncate">TRANSFER-123,29-09-2025,-553.76...</div>
                </div>
              </div>

              {/* Arrow */}
              <div className="flex justify-center">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-evelan-teal to-evelan-gold flex items-center justify-center shadow-lg animate-bounce glow-gold">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
                  </svg>
                </div>
              </div>

              {/* Step 2: Lexware Office CSV */}
              <div className="animate-float-delayed relative bg-card dark:bg-card rounded-xl border border-evelan-gold/20 dark:border-evelan-gold/30 shadow-lg p-4 card-glow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-evelan-gold-light to-evelan-gold-dark flex items-center justify-center glow-gold">
                    <span className="text-lg font-bold text-evelan-petrol">L</span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">Lexware Office Format</p>
                    <p className="text-xs text-muted-foreground">lexware-import.csv</p>
                  </div>
                </div>
                <div className="font-mono text-xs bg-evelan-ice dark:bg-evelan-petrol rounded p-2 text-muted-foreground overflow-hidden">
                  <div className="truncate">Buchungstag;Valuta;Auftraggeber...</div>
                  <div className="truncate">29.09.2025;29.09.2025;Kontoinhaber...</div>
                </div>
                <div className="absolute -top-2 -right-2">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-evelan-teal/10 dark:bg-evelan-teal/20 text-evelan-teal dark:text-evelan-ice border border-evelan-teal/30 dark:border-evelan-teal/40">
                    Bereit zum Import
                  </span>
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-20 h-20 border-2 border-dashed border-evelan-gold/30 dark:border-evelan-gold/20 rounded-xl -z-10" />
            <div className="absolute -bottom-4 -left-4 w-20 h-20 border-2 border-dashed border-evelan-teal/30 dark:border-evelan-teal/20 rounded-xl -z-10" />
          </div>
        </div>
      </header>
    </>
  );
}
