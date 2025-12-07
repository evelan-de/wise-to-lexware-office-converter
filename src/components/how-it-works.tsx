import { Upload, CheckCircle, Download, Building2 } from 'lucide-react';

const steps = [
  {
    icon: Upload,
    title: 'Hochladen',
    description: 'Wise CSV',
  },
  {
    icon: CheckCircle,
    title: 'Prüfen',
    description: 'Vorschau & Bearbeiten',
  },
  {
    icon: Download,
    title: 'Download',
    description: 'Lexware-Format',
  },
  {
    icon: Building2,
    title: 'Importieren',
    description: 'In Lexware Office',
  },
];

export function HowItWorks() {
  return (
    <div className="py-4">
      <div className="flex items-center justify-center gap-2 sm:gap-4">
        {steps.map((step, index) => (
          <div key={step.title} className="flex items-center">
            {/* Step */}
            <div className="flex flex-col items-center text-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center mb-2">
                <step.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
              </div>
              <span className="text-xs sm:text-sm font-medium text-foreground">
                {step.title}
              </span>
              <span className="text-[10px] sm:text-xs text-muted-foreground hidden sm:block">
                {step.description}
              </span>
            </div>

            {/* Arrow (except after last step) */}
            {index < steps.length - 1 && (
              <div className="mx-2 sm:mx-4 text-muted-foreground/50">
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

      {/* Subtle hint about duplicates */}
      <p className="text-center text-xs text-muted-foreground mt-4">
        Tipp: Lexware Office prüft nicht auf Duplikate beim Import
      </p>
    </div>
  );
}
