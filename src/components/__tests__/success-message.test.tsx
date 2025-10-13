import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { SuccessMessage } from '../success-message';

describe('SuccessMessage', () => {
  it('should render success title', () => {
    render(<SuccessMessage />);

    expect(screen.getByText('Konvertierung erfolgreich!')).toBeInTheDocument();
  });

  it('should render success description', () => {
    render(<SuccessMessage />);

    expect(
      screen.getByText('Die Datei wurde konvertiert und automatisch heruntergeladen.')
    ).toBeInTheDocument();
  });

  it('should render import instruction', () => {
    render(<SuccessMessage />);

    expect(
      screen.getByText('Sie können die Datei jetzt in LexOffice importieren.')
    ).toBeInTheDocument();
  });

  it('should render with green styling', () => {
    const { container } = render(<SuccessMessage />);

    const card = container.querySelector('[data-slot="card"]');
    expect(card).toHaveClass('border-green-200');
    expect(card).toHaveClass('bg-green-50');
  });

  it('should render CheckCircle2 icon', () => {
    const { container } = render(<SuccessMessage />);

    // Check for the SVG icon with green color
    const checkIcon = container.querySelector('.w-8.h-8.text-green-600');
    expect(checkIcon).toBeInTheDocument();
  });

  it('should render Download icon', () => {
    const { container } = render(<SuccessMessage />);

    // Check for the SVG icon with the lucide-download class
    const downloadIcon = container.querySelector('.lucide-download');
    expect(downloadIcon).toBeInTheDocument();
  });

  it('should have proper semantic structure', () => {
    const { container } = render(<SuccessMessage />);

    // Should have h3 heading
    const heading = container.querySelector('h3');
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveClass('text-lg', 'font-semibold', 'text-green-900');

    // Should have paragraph elements
    const paragraphs = container.querySelectorAll('p');
    expect(paragraphs.length).toBeGreaterThanOrEqual(2);
  });

  it('should display elements in correct layout structure', () => {
    const { container } = render(<SuccessMessage />);

    // Check for flex container with icon and content
    const flexContainer = container.querySelector('.flex.items-center.gap-4');
    expect(flexContainer).toBeInTheDocument();

    // Check for rounded icon background
    const iconBackground = container.querySelector('.rounded-full.bg-green-100');
    expect(iconBackground).toBeInTheDocument();
  });
});
