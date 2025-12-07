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
        {/* Vibrant Background with Multiple Layers */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          {/* Primary glow - Gold */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-evelan-gold/30 via-evelan-gold/20 to-transparent rounded-full blur-[120px] animate-pulse-glow" />
          {/* Secondary glow - Teal */}
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-evelan-teal/35 via-evelan-teal/20 to-transparent rounded-full blur-[120px] animate-pulse-glow" style={{ animationDelay: '1s' }} />
          {/* Accent glow - Center */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-evelan-teal/10 via-evelan-gold/15 to-evelan-teal/10 rounded-full blur-[150px] animate-gradient bg-[length:200%_200%]" />
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text Content */}
          <div className="space-y-6">
            {/* Badges - More Vibrant */}
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-evelan-teal/15 to-evelan-teal/25 dark:from-evelan-teal/25 dark:to-evelan-teal/35 text-evelan-teal dark:text-evelan-ice border border-evelan-teal/30 dark:border-evelan-teal/40 shadow-sm glow-teal">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
                100% Datenschutz
              </span>
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-evelan-gold/15 to-evelan-gold/30 dark:from-evelan-gold/25 dark:to-evelan-gold/40 text-evelan-gold-dark dark:text-evelan-gold border border-evelan-gold/30 dark:border-evelan-gold/40 shadow-sm glow-gold">
                <span className="w-2 h-2 rounded-full bg-gradient-to-r from-evelan-gold-light to-evelan-gold animate-pulse" />
                Open Source
              </span>
            </div>

            {/* Headline - Vibrant Gradient */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground">
              WISE zu{' '}
              <span className="text-gradient-vibrant">
                Lexware Office
              </span>{' '}
              Konverter
            </h1>

            {/* Description */}
            <p className="text-lg text-muted-foreground max-w-lg">
              Wandle deine Wise CSV-Exporte in Sekundenschnelle in das Lexware Office Bankimport-Format um. Komplett im Browser - keine Daten verlassen deinen Computer.
            </p>

            {/* Features - Enhanced */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-muted-foreground group">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-evelan-teal/20 to-evelan-teal/30 dark:from-evelan-teal/30 dark:to-evelan-teal/40 flex items-center justify-center border border-evelan-teal/30 group-hover:glow-teal transition-all">
                  <svg className="w-3.5 h-3.5 text-evelan-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <span className="group-hover:text-foreground transition-colors">Keine Server-Uploads - alles lokal</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground group">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-evelan-teal/20 to-evelan-teal/30 dark:from-evelan-teal/30 dark:to-evelan-teal/40 flex items-center justify-center border border-evelan-teal/30 group-hover:glow-teal transition-all">
                  <svg className="w-3.5 h-3.5 text-evelan-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <span className="group-hover:text-foreground transition-colors">Vorschau vor dem Download</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground group">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-evelan-teal/20 to-evelan-teal/30 dark:from-evelan-teal/30 dark:to-evelan-teal/40 flex items-center justify-center border border-evelan-teal/30 group-hover:glow-teal transition-all">
                  <svg className="w-3.5 h-3.5 text-evelan-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <span className="group-hover:text-foreground transition-colors">Fehlerhafte Einträge bearbeiten</span>
              </div>
            </div>

            {/* CTA - More Vibrant */}
            <a
              href="/hilfe"
              className="inline-flex items-center gap-2 text-sm font-semibold text-evelan-teal hover:text-evelan-gold transition-all duration-300 group"
            >
              <span className="border-b-2 border-evelan-teal/50 group-hover:border-evelan-gold pb-0.5">Anleitung lesen</span>
              <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </a>
          </div>

          {/* Right: Visual Flow */}
          <div className="relative">
            <div className="space-y-4">
              {/* Step 1: Wise CSV */}
              <div className="animate-float relative rounded-xl shadow-xl p-5 card-glow border-2 border-transparent hover:border-evelan-teal/40 transition-all duration-300">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#9fe870] to-[#7dd654] flex items-center justify-center shadow-lg glow-teal animate-vibrant-pulse">
                    <span className="text-xl font-black text-[#1a3d0f]">W</span>
                  </div>
                  <div>
                    <p className="font-bold text-foreground">Wise Export</p>
                    <p className="text-xs text-muted-foreground">wise-statement.csv</p>
                  </div>
                </div>
                <div className="font-mono text-xs bg-gradient-to-br from-evelan-ice to-evelan-ice/80 dark:from-evelan-petrol dark:to-evelan-petrol-alt rounded-lg p-3 text-muted-foreground overflow-hidden border border-evelan-teal/10 dark:border-evelan-teal/20">
                  <div className="truncate">TransferWise ID,Date,Amount...</div>
                  <div className="truncate opacity-70">TRANSFER-123,29-09-2025,-553.76...</div>
                </div>
              </div>

              {/* Arrow - More Vibrant */}
              <div className="flex justify-center">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-evelan-teal via-evelan-gold to-evelan-teal bg-[length:200%_200%] animate-gradient flex items-center justify-center shadow-xl glow-gold-strong">
                  <svg className="w-6 h-6 text-white drop-shadow-lg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
                  </svg>
                </div>
              </div>

              {/* Step 2: Lexware Office CSV */}
              <div className="animate-float-delayed relative rounded-xl shadow-xl p-5 card-glow border-2 border-transparent hover:border-evelan-gold/40 transition-all duration-300">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-evelan-gold-light via-evelan-gold to-evelan-gold-dark flex items-center justify-center shadow-lg glow-gold animate-vibrant-pulse">
                    <span className="text-xl font-black text-evelan-petrol">L</span>
                  </div>
                  <div>
                    <p className="font-bold text-foreground">Lexware Office Format</p>
                    <p className="text-xs text-muted-foreground">lexware-import.csv</p>
                  </div>
                </div>
                <div className="font-mono text-xs bg-gradient-to-br from-evelan-ice to-evelan-ice/80 dark:from-evelan-petrol dark:to-evelan-petrol-alt rounded-lg p-3 text-muted-foreground overflow-hidden border border-evelan-gold/10 dark:border-evelan-gold/20">
                  <div className="truncate">Buchungstag;Valuta;Auftraggeber...</div>
                  <div className="truncate opacity-70">29.09.2025;29.09.2025;Kontoinhaber...</div>
                </div>
                <div className="absolute -top-3 -right-3">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-evelan-teal/20 to-evelan-teal/30 dark:from-evelan-teal/30 dark:to-evelan-teal/40 text-evelan-teal dark:text-evelan-ice border border-evelan-teal/40 dark:border-evelan-teal/50 shadow-sm glow-teal">
                    Bereit zum Import
                  </span>
                </div>
              </div>
            </div>

            {/* Decorative elements - More Vibrant */}
            <div className="absolute -top-6 -right-6 w-24 h-24 border-2 border-dashed border-evelan-gold/40 dark:border-evelan-gold/30 rounded-xl -z-10 animate-pulse-glow" />
            <div className="absolute -bottom-6 -left-6 w-24 h-24 border-2 border-dashed border-evelan-teal/40 dark:border-evelan-teal/30 rounded-xl -z-10 animate-pulse-glow" style={{ animationDelay: '1.5s' }} />
            {/* Extra glow orb */}
            <div className="absolute top-1/2 -right-12 w-24 h-24 bg-gradient-to-r from-evelan-gold/20 to-evelan-teal/20 rounded-full blur-2xl -z-10 animate-pulse-glow" />
          </div>
        </div>
      </header>
    </>
  );
}
