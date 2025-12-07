import Image from 'next/image';
import Link from 'next/link';
import { EvelanBadge } from '@/components/evelan-badge';

export function Footer() {
  return (
    <footer className="relative -mx-4 mt-16 px-4 pt-20 pb-10 section-dark overflow-hidden">
      {/* Animated Glow Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="glow-orb glow-orb-teal w-[500px] h-[500px] -bottom-60 right-0 animate-pulse-glow" />
        <div className="glow-orb glow-orb-amber w-[400px] h-[400px] -top-40 -left-40 animate-pulse-glow" style={{ animationDelay: '1.5s' }} />
      </div>

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(94, 234, 212, 0.5) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(94, 234, 212, 0.5) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      <div className="relative max-w-4xl mx-auto">
        <div className="space-y-12">
          {/* Feature Boxes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Security Box */}
            <div className="glass-card rounded-2xl p-6 text-center group">
              <div className="flex justify-center mb-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 border border-emerald-500/30 flex items-center justify-center group-hover:glow-teal transition-all duration-300" style={{ '--glow-primary': 'rgba(52, 211, 153, 0.4)' } as React.CSSProperties}>
                  <svg className="w-7 h-7 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
              </div>
              <div className="text-xl font-bold text-foreground mb-1">Note A</div>
              <div className="text-sm text-muted-foreground">Sicherheit</div>
            </div>

            {/* Privacy Box */}
            <div className="glass-card rounded-2xl p-6 text-center group">
              <div className="flex justify-center mb-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/30 flex items-center justify-center group-hover:glow-teal transition-all duration-300">
                  <svg className="w-7 h-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>
              <div className="text-xl font-bold text-foreground mb-1">100% Lokal</div>
              <div className="text-sm text-muted-foreground">Datenschutz</div>
            </div>

            {/* Open Source Box */}
            <div className="glass-card rounded-2xl p-6 text-center group">
              <div className="flex justify-center mb-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent/20 to-orange-500/20 border border-accent/30 flex items-center justify-center group-hover:glow-amber transition-all duration-300">
                  <svg className="w-7 h-7 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
              </div>
              <div className="text-xl font-bold text-foreground mb-1">Open Source</div>
              <div className="text-sm text-muted-foreground">Quellcode offen</div>
            </div>
          </div>

          {/* ImmuniWeb Badge */}
          <div className="text-center">
            <a
              href="https://www.immuniweb.com/websec/wise-lexware-convert.evelan.de/pKyRciC5/"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-block"
              title="ImmuniWeb Website Security Test - Details ansehen"
            >
              <Image
                src="/iw_websec_large_light.png"
                alt="ImmuniWeb Website Security Test - Grade A"
                width={300}
                height={100}
                className="mx-auto hover:opacity-90 transition-opacity brightness-110"
              />
            </a>
            <p className="mt-4 text-xs text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Geprüfte Sicherheit durch unabhängige Zertifizierung von ImmuniWeb.<br />
              Diese Website erfüllt höchste Standards für Web-Sicherheit und SSL/TLS-Verschlüsselung.
            </p>
          </div>

          {/* Divider with glow */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border/30" />
            </div>
            <div className="relative flex justify-center">
              <div className="w-20 h-1 rounded-full bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
            </div>
          </div>

          {/* Legal Links */}
          <div>
            <nav className="flex flex-wrap justify-center items-center gap-x-8 gap-y-3 text-sm mb-8">
              <Link
                href="/blog"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Blog
              </Link>
              <Link
                href="/hilfe"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Anleitung
              </Link>
              <Link
                href="/impressum"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Impressum
              </Link>
              <Link
                href="/datenschutz"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Datenschutz
              </Link>
              <a
                href="https://github.com/evelan-de/wise-to-lexware-office-converter"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1.5"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
                GitHub
              </a>
            </nav>

            {/* Made by and Copyright */}
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <EvelanBadge />
              </div>
              <div className="text-xs text-muted-foreground/60">
                © {new Date().getFullYear()} Evelan GmbH. Alle Rechte vorbehalten.
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
