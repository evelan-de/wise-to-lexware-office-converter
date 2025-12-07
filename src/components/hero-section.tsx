'use client';

import { ThemeSwitcher } from '@/components/theme-switcher';

export type HeroVariant = 'gradient' | 'split';

interface HeroSectionProps {
  variant?: HeroVariant;
}

function GradientHero() {
  return (
    <header className="relative text-center mb-16 pt-8">
      {/* Animated gradient background blur */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full blur-3xl opacity-20 dark:opacity-15 animate-gradient animate-pulse-glow" />
        <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full blur-3xl opacity-15 dark:opacity-10 animate-gradient" style={{ animationDelay: '2s' }} />
      </div>

      {/* Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-primary/10 dark:bg-primary/20 border border-primary/20 dark:border-primary/30 animate-float">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
        </span>
        <span className="text-sm font-medium text-primary">Kostenlos & Open Source</span>
      </div>

      {/* Main Headline */}
      <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight mb-6">
        <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 dark:from-indigo-400 dark:via-purple-400 dark:to-indigo-400 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
          WISE
        </span>
        <span className="text-foreground"> zu </span>
        <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 dark:from-purple-400 dark:via-pink-400 dark:to-purple-400 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
          Lexware Office
        </span>
      </h1>

      {/* Subtitle */}
      <p className="text-xl sm:text-2xl text-muted-foreground mb-4 max-w-2xl mx-auto">
        CSV-Konverter für Bankimport
      </p>
      <p className="text-base text-muted-foreground/80 mb-8">
        Banking → Konten → Transaktionen importieren
      </p>

      {/* Trust Badges */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <div className="animate-float inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800">
          <svg className="w-4 h-4 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
          </svg>
          <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">100% Datenschutz</span>
        </div>

        <div className="animate-float-delayed inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800">
          <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" />
          </svg>
          <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Keine Server-Uploads</span>
        </div>

        <a
          href="/hilfe"
          className="animate-float inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-50 dark:bg-violet-950/50 border border-violet-200 dark:border-violet-800 hover:bg-violet-100 dark:hover:bg-violet-900/50 transition-colors"
          style={{ animationDelay: '0.25s' }}
        >
          <svg className="w-4 h-4 text-violet-600 dark:text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
          </svg>
          <span className="text-sm font-medium text-violet-700 dark:text-violet-300">Anleitung</span>
        </a>
      </div>
    </header>
  );
}

function SplitHero() {
  return (
    <header className="relative mb-16 pt-8">
      {/* Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px]" />
      </div>

      <div className="grid lg:grid-cols-2 gap-12 items-center">
        {/* Left: Text Content */}
        <div className="space-y-6">
          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
              100% Datenschutz
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
              Open Source
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground">
            WISE zu{' '}
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
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
              <div className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
                <svg className="w-3 h-3 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <span>Keine Server-Uploads - alles lokal</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <div className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
                <svg className="w-3 h-3 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <span>Vorschau vor dem Download</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <div className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
                <svg className="w-3 h-3 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <span>Fehlerhafte Einträge bearbeiten</span>
            </div>
          </div>

          {/* CTA */}
          <a
            href="/hilfe"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
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
            <div className="animate-float relative bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-[#9fe870] flex items-center justify-center">
                  <span className="text-lg font-bold text-black">W</span>
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">Wise Export</p>
                  <p className="text-xs text-muted-foreground">wise-statement.csv</p>
                </div>
              </div>
              <div className="font-mono text-xs bg-slate-100 dark:bg-slate-900 rounded p-2 text-muted-foreground overflow-hidden">
                <div className="truncate">TransferWise ID,Date,Amount...</div>
                <div className="truncate">TRANSFER-123,29-09-2025,-553.76...</div>
              </div>
            </div>

            {/* Arrow */}
            <div className="flex justify-center">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg animate-bounce">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
                </svg>
              </div>
            </div>

            {/* Step 2: Lexware Office CSV */}
            <div className="animate-float-delayed relative bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                  <span className="text-lg font-bold text-white">L</span>
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">Lexware Office Format</p>
                  <p className="text-xs text-muted-foreground">lexware-import.csv</p>
                </div>
              </div>
              <div className="font-mono text-xs bg-slate-100 dark:bg-slate-900 rounded p-2 text-muted-foreground overflow-hidden">
                <div className="truncate">Buchungstag;Valuta;Auftraggeber...</div>
                <div className="truncate">29.09.2025;29.09.2025;Kontoinhaber...</div>
              </div>
              <div className="absolute -top-2 -right-2">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  Bereit zum Import
                </span>
              </div>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute -top-4 -right-4 w-20 h-20 border-2 border-dashed border-indigo-200 dark:border-indigo-800 rounded-xl -z-10" />
          <div className="absolute -bottom-4 -left-4 w-20 h-20 border-2 border-dashed border-purple-200 dark:border-purple-800 rounded-xl -z-10" />
        </div>
      </div>
    </header>
  );
}

export function HeroSection({ variant = 'gradient' }: HeroSectionProps) {
  return (
    <>
      {/* Theme Switcher */}
      <div className="absolute top-4 right-4 z-10">
        <ThemeSwitcher />
      </div>

      {variant === 'gradient' && <GradientHero />}
      {variant === 'split' && <SplitHero />}
    </>
  );
}
