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
    <div className="py-4">
      <div className="flex items-center justify-center gap-1 sm:gap-2 md:gap-3">
        {steps.map((step, index) => (
          <div key={step.title} className="flex items-center">
            {/* Step */}
            <div className="flex flex-col items-center text-center min-w-[48px] sm:min-w-[64px]">
              <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center mb-1.5 overflow-hidden">
                {'logo' in step && step.logo ? (
                  <Image
                    src={step.logo}
                    alt=""
                    width={44}
                    height={44}
                    className="w-full h-full"
                  />
                ) : 'icon' in step && step.icon ? (
                  <step.icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                ) : null}
              </div>
              <span className="text-[10px] sm:text-xs font-medium text-foreground leading-tight">
                {step.title}
              </span>
              <span className="text-[9px] sm:text-[10px] text-muted-foreground hidden md:block leading-tight">
                {step.description}
              </span>
            </div>

            {/* Arrow (except after last step) */}
            {index < steps.length - 1 && (
              <div className="mx-0.5 sm:mx-1.5 md:mx-2 text-muted-foreground/40">
                <svg
                  className="w-3 h-3 sm:w-4 sm:h-4"
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
