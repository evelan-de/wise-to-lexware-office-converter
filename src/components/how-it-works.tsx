import Image from 'next/image';
import { Upload, Search, ArrowRightLeft } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type Step = {
  title: string;
  description: string;
} & (
  | { icon: LucideIcon; logo?: never }
  | { logo: string; icon?: never }
);

const steps: Step[] = [
  {
    logo: '/wise-logo.svg',
    title: 'Exportieren',
    description: 'CSV aus Wise',
  },
  {
    icon: Upload,
    title: 'Hochladen',
    description: 'Datei hier ablegen',
  },
  {
    icon: Search,
    title: 'Prüfen',
    description: 'Vorschau & Bearbeiten',
  },
  {
    icon: ArrowRightLeft,
    title: 'Konvertieren',
    description: 'Download startet',
  },
  {
    logo: '/lexware-logo.svg',
    title: 'Importieren',
    description: 'In Lexware Office',
  },
];

export function HowItWorks() {
  return (
    <div className="relative py-8 px-6 -mx-4 rounded-2xl glass-card overflow-hidden">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 mesh-gradient opacity-30 pointer-events-none" />

      <div className="relative flex items-center justify-center gap-2 sm:gap-3 md:gap-4">
        {steps.map((step, index) => (
          <div key={step.title} className="flex items-center group">
            {/* Step */}
            <div className="flex flex-col items-center text-center min-w-[50px] sm:min-w-[70px]">
              <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20 flex items-center justify-center mb-2 overflow-hidden transition-all duration-300 group-hover:border-primary/40 group-hover:glow-teal">
                {'logo' in step && step.logo ? (
                  <Image
                    src={step.logo}
                    alt=""
                    width={56}
                    height={56}
                    className="w-full h-full"
                  />
                ) : 'icon' in step && step.icon ? (
                  <step.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                ) : null}
              </div>
              <span className="text-[10px] sm:text-xs font-semibold text-foreground leading-tight">
                {step.title}
              </span>
              <span className="text-[8px] sm:text-[10px] text-muted-foreground hidden md:block leading-tight mt-0.5">
                {step.description}
              </span>
            </div>

            {/* Arrow (except after last step) */}
            {index < steps.length - 1 && (
              <div className="mx-1 sm:mx-2 md:mx-3 text-accent/60">
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
