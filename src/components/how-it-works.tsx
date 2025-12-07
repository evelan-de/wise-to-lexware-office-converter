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
    <div className="py-6 px-4 -mx-4 bg-gradient-to-r from-transparent via-[#3C777B]/5 to-transparent dark:via-[#3C777B]/10 rounded-xl">
      <div className="flex items-center justify-center gap-1 sm:gap-2 md:gap-3">
        {steps.map((step, index) => (
          <div key={step.title} className="flex items-center group">
            {/* Step */}
            <div className="flex flex-col items-center text-center min-w-[48px] sm:min-w-[64px]">
              <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-full bg-[#3C777B]/10 dark:bg-[#3C777B]/20 flex items-center justify-center mb-1.5 overflow-hidden transition-all duration-300 group-hover:bg-[#3C777B]/20 dark:group-hover:bg-[#3C777B]/30 group-hover:shadow-md">
                {'logo' in step && step.logo ? (
                  <Image
                    src={step.logo}
                    alt=""
                    width={44}
                    height={44}
                    className="w-full h-full"
                  />
                ) : 'icon' in step && step.icon ? (
                  <step.icon className="w-4 h-4 sm:w-5 sm:h-5 text-[#3C777B] dark:text-[#6AABAF]" />
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
              <div className="mx-0.5 sm:mx-1.5 md:mx-2 text-[#DDA95B]/50">
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
