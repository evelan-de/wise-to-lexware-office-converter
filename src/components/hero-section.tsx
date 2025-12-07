'use client';

import { ThemeSwitcher } from '@/components/theme-switcher';

export function HeroSection() {
  return (
    <>
      {/* Theme Switcher */}
      <div className="absolute top-4 right-4 z-10">
        <ThemeSwitcher />
      </div>

      {/* Dark Hero Section - Always dark petrol background */}
      <header className="relative -mx-4 -mt-12 mb-12 px-4 py-16 bg-gradient-to-br from-[#08292E] via-[#0A3538] to-[#08292E] overflow-hidden">
        {/* Glowing background orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#3C777B]/20 rounded-full blur-[120px] animate-pulse-glow" />
          <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-[#DDA95B]/15 rounded-full blur-[100px] animate-pulse-glow" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#3C777B]/10 rounded-full blur-[80px]" />
        </div>

        <div className="relative max-w-4xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text Content */}
          <div className="space-y-6">
            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
                100% Datenschutz
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#3C777B]/20 text-[#6AABAF] border border-[#3C777B]/30">
                <span className="w-1.5 h-1.5 rounded-full bg-[#DDA95B] animate-pulse" />
                Open Source
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
              WISE zu{' '}
              <span className="bg-gradient-to-r from-[#DDA95B] to-[#F3C079] bg-clip-text text-transparent text-glow">
                Lexware Office
              </span>{' '}
              Konverter
            </h1>

            {/* Description */}
            <p className="text-lg text-[#A0C4C7] max-w-lg">
              Wandle deine Wise CSV-Exporte in Sekundenschnelle in das Lexware Office Bankimport-Format um. Komplett im Browser - keine Daten verlassen deinen Computer.
            </p>

            {/* Features */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-[#8AB8BB]">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[#3C777B]/30 flex items-center justify-center">
                  <svg className="w-3 h-3 text-[#6AABAF]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <span>Keine Server-Uploads - alles lokal</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-[#8AB8BB]">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[#3C777B]/30 flex items-center justify-center">
                  <svg className="w-3 h-3 text-[#6AABAF]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <span>Vorschau vor dem Download</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-[#8AB8BB]">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[#3C777B]/30 flex items-center justify-center">
                  <svg className="w-3 h-3 text-[#6AABAF]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <span>Fehlerhafte Einträge bearbeiten</span>
              </div>
            </div>

            {/* CTA */}
            <a
              href="/hilfe"
              className="inline-flex items-center gap-2 text-sm font-medium text-[#DDA95B] hover:text-[#F3C079] transition-colors"
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
              <div className="animate-float relative bg-white/95 dark:bg-[#0A2D32] rounded-xl border border-white/20 shadow-xl p-4 card-glow backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-[#9fe870] flex items-center justify-center shadow-md">
                    <span className="text-lg font-bold text-black">W</span>
                  </div>
                  <div>
                    <p className="font-semibold text-[#08292E] dark:text-white text-sm">Wise Export</p>
                    <p className="text-xs text-[#555] dark:text-[#8AB8BB]">wise-statement.csv</p>
                  </div>
                </div>
                <div className="font-mono text-xs bg-[#F5F5F5] dark:bg-[#041518] rounded p-2 text-[#555] dark:text-[#8AB8BB] overflow-hidden">
                  <div className="truncate">TransferWise ID,Date,Amount...</div>
                  <div className="truncate">TRANSFER-123,29-09-2025,-553.76...</div>
                </div>
              </div>

              {/* Arrow */}
              <div className="flex justify-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#F3C079] to-[#C88F44] flex items-center justify-center shadow-lg animate-bounce glow-gold">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
                  </svg>
                </div>
              </div>

              {/* Step 2: Lexware Office CSV */}
              <div className="animate-float-delayed relative bg-white/95 dark:bg-[#0A2D32] rounded-xl border border-white/20 shadow-xl p-4 card-glow backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#08292E] to-[#3C777B] flex items-center justify-center shadow-md glow-teal-sm">
                    <span className="text-lg font-bold text-white">L</span>
                  </div>
                  <div>
                    <p className="font-semibold text-[#08292E] dark:text-white text-sm">Lexware Office Format</p>
                    <p className="text-xs text-[#555] dark:text-[#8AB8BB]">lexware-import.csv</p>
                  </div>
                </div>
                <div className="font-mono text-xs bg-[#F5F5F5] dark:bg-[#041518] rounded p-2 text-[#555] dark:text-[#8AB8BB] overflow-hidden">
                  <div className="truncate">Buchungstag;Valuta;Auftraggeber...</div>
                  <div className="truncate">29.09.2025;29.09.2025;Kontoinhaber...</div>
                </div>
                <div className="absolute -top-2 -right-2">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 backdrop-blur-sm">
                    Bereit zum Import
                  </span>
                </div>
              </div>
            </div>

            {/* Decorative elements with glow */}
            <div className="absolute -top-4 -right-4 w-24 h-24 border-2 border-dashed border-[#3C777B]/40 rounded-xl -z-10" />
            <div className="absolute -bottom-4 -left-4 w-24 h-24 border-2 border-dashed border-[#DDA95B]/40 rounded-xl -z-10" />
          </div>
        </div>
      </header>
    </>
  );
}
