'use client';

import { ThemeSwitcher } from '@/components/theme-switcher';

export function HeroSection() {
  return (
    <>
      {/* Theme Switcher */}
      <div className="absolute top-4 right-4 z-10">
        <ThemeSwitcher />
      </div>

      {/* Modern Dark Hero with Neon Glows */}
      <header className="relative -mx-4 -mt-12 mb-12 px-4 py-20 section-dark overflow-hidden">
        {/* Animated Glow Orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="glow-orb glow-orb-teal w-[600px] h-[600px] -top-40 -right-40 animate-pulse-glow" />
          <div className="glow-orb glow-orb-amber w-[500px] h-[500px] -bottom-40 -left-40 animate-pulse-glow" style={{ animationDelay: '1s' }} />
          <div className="glow-orb glow-orb-teal w-[400px] h-[400px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-30" />
        </div>

        {/* Grid Pattern Overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(94, 234, 212, 0.5) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(94, 234, 212, 0.5) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
        />

        <div className="relative max-w-4xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text Content */}
          <div className="space-y-6">
            {/* Badges with Glow */}
            <div className="flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 backdrop-blur-sm animate-border-glow" style={{ '--glow-primary': 'rgba(52, 211, 153, 0.4)', '--glow-subtle': 'rgba(52, 211, 153, 0.1)' } as React.CSSProperties}>
                <svg className="w-3.5 h-3.5 icon-glow" style={{ '--glow-primary': 'rgba(52, 211, 153, 0.6)' } as React.CSSProperties} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
                100% Datenschutz
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/30 backdrop-blur-sm">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse glow-amber" style={{ boxShadow: '0 0 8px rgba(251, 191, 36, 0.8)' }} />
                Open Source
              </span>
            </div>

            {/* Headline with Gradient */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white">
              WISE zu{' '}
              <span className="gradient-text text-glow">
                Lexware Office
              </span>{' '}
              <span className="block mt-1">Konverter</span>
            </h1>

            {/* Description */}
            <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
              Wandle deine Wise CSV-Exporte in Sekundenschnelle in das Lexware Office Bankimport-Format um. Komplett im Browser - keine Daten verlassen deinen Computer.
            </p>

            {/* Features with Glow Icons */}
            <div className="space-y-3 pt-2">
              {[
                'Keine Server-Uploads - alles lokal',
                'Vorschau vor dem Download',
                'Fehlerhafte Einträge bearbeiten'
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-muted-foreground group">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center group-hover:glow-teal transition-all duration-300">
                    <svg className="w-3.5 h-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </div>
                  <span className="group-hover:text-foreground transition-colors">{feature}</span>
                </div>
              ))}
            </div>

            {/* CTA with Glow */}
            <a
              href="/hilfe"
              className="inline-flex items-center gap-2 text-sm font-semibold text-accent hover:text-accent/80 transition-all group"
            >
              <span className="text-glow-amber">Anleitung lesen</span>
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </a>
          </div>

          {/* Right: Visual Flow Cards */}
          <div className="relative">
            <div className="space-y-5">
              {/* Step 1: Wise CSV - Glass Card */}
              <div className="animate-float glass-card rounded-2xl p-5 relative overflow-hidden">
                {/* Subtle shimmer effect */}
                <div className="absolute inset-0 animate-shimmer opacity-50" />

                <div className="relative flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#9fe870] to-[#6dd13d] flex items-center justify-center shadow-lg" style={{ boxShadow: '0 4px 20px rgba(159, 232, 112, 0.3)' }}>
                    <span className="text-xl font-black text-black">W</span>
                  </div>
                  <div>
                    <p className="font-bold text-foreground">Wise Export</p>
                    <p className="text-xs text-muted-foreground">wise-statement.csv</p>
                  </div>
                </div>
                <div className="font-mono text-xs bg-muted/50 dark:bg-black/30 rounded-lg p-3 text-muted-foreground border border-border/50">
                  <div className="truncate opacity-80">TransferWise ID,Date,Amount...</div>
                  <div className="truncate text-primary">TRANSFER-123,29-09-2025,-553.76...</div>
                </div>
              </div>

              {/* Arrow with Glow */}
              <div className="flex justify-center">
                <div className="w-14 h-14 rounded-full btn-amber flex items-center justify-center animate-bounce">
                  <svg className="w-7 h-7 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
                  </svg>
                </div>
              </div>

              {/* Step 2: Lexware Office - Glass Card with Neon Border */}
              <div className="animate-float glass-card rounded-2xl p-5 relative overflow-hidden" style={{ animationDelay: '0.5s' }}>
                {/* Gradient border glow */}
                <div className="absolute inset-0 rounded-2xl neon-border opacity-50" />

                <div className="relative flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary to-primary flex items-center justify-center shadow-lg glow-teal">
                    <span className="text-xl font-black text-white">L</span>
                  </div>
                  <div>
                    <p className="font-bold text-foreground">Lexware Office Format</p>
                    <p className="text-xs text-muted-foreground">lexware-import.csv</p>
                  </div>
                </div>
                <div className="font-mono text-xs bg-muted/50 dark:bg-black/30 rounded-lg p-3 text-muted-foreground border border-border/50">
                  <div className="truncate opacity-80">Buchungstag;Valuta;Auftraggeber...</div>
                  <div className="truncate text-primary">29.09.2025;29.09.2025;Kontoinhaber...</div>
                </div>

                {/* Success Badge */}
                <div className="absolute -top-3 -right-3">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 backdrop-blur-md shadow-lg" style={{ boxShadow: '0 4px 15px rgba(52, 211, 153, 0.3)' }}>
                    <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    Bereit
                  </span>
                </div>
              </div>
            </div>

            {/* Decorative Corners with Glow */}
            <div className="absolute -top-6 -right-6 w-28 h-28 border-2 border-dashed border-primary/30 rounded-2xl -z-10 animate-pulse" style={{ animationDuration: '3s' }} />
            <div className="absolute -bottom-6 -left-6 w-28 h-28 border-2 border-dashed border-accent/30 rounded-2xl -z-10 animate-pulse" style={{ animationDuration: '4s' }} />
          </div>
        </div>
      </header>
    </>
  );
}
