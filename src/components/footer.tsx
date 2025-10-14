import Image from 'next/image';
import Link from 'next/link';
import { EvelanBadge } from '@/components/evelan-badge';

export function Footer() {
  return (
    <footer className="bg-gradient-to-b from-slate-100 via-slate-50 to-white pt-12 pb-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="space-y-10">
          {/* Feature Boxes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Security Box */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 text-center border border-green-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-center mb-3">
                <svg className="w-12 h-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div className="text-xl font-bold text-gray-900 mb-2">Note A</div>
              <div className="text-sm text-gray-600">Sicherheit</div>
            </div>

            {/* Privacy Box */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 text-center border border-blue-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-center mb-3">
                <svg className="w-12 h-12 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div className="text-xl font-bold text-gray-900 mb-2">100% Lokal</div>
              <div className="text-sm text-gray-600">Datenschutz</div>
            </div>

            {/* Open Source Box */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 text-center border border-purple-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-center mb-3">
                <svg className="w-12 h-12 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <div className="text-xl font-bold text-gray-900 mb-2">Open Source</div>
              <div className="text-sm text-gray-600">Quellcode offen</div>
            </div>
          </div>

          {/* ImmuniWeb Badge with Explanation */}
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
                className="mx-auto hover:opacity-90 transition-opacity"
              />
            </a>
            <p className="mt-3 text-xs text-gray-600 max-w-2xl mx-auto">
              Geprüfte Sicherheit durch unabhängige Zertifizierung von ImmuniWeb.<br />
              Diese Website erfüllt höchste Standards für Web-Sicherheit, Datenschutz und SSL/TLS-Verschlüsselung.
            </p>
          </div>

          {/* Legal Links */}
          <div className="pt-8">
            <nav className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-sm mb-4">
              <Link
                href="/impressum"
                className="text-gray-600 hover:text-primary transition-colors"
              >
                Impressum
              </Link>
              <Link
                href="/datenschutz"
                className="text-gray-600 hover:text-primary transition-colors"
              >
                Datenschutz
              </Link>
              <a
                href="https://github.com/evelan-de/wise-to-lexware-office-converter"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-primary transition-colors inline-flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
                GitHub
              </a>
            </nav>

            {/* Made by and Copyright */}
            <div className="text-center space-y-2">
              <div className="flex justify-center">
                <EvelanBadge />
              </div>
              <div className="text-xs text-gray-500">
                © {new Date().getFullYear()} Evelan GmbH. Alle Rechte vorbehalten.
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
