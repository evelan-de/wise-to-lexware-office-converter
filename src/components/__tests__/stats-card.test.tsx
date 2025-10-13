import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { StatsCard } from '../stats-card';
import type { ConversionStats } from '@/lib/converter';

describe('StatsCard', () => {
  const mockStats: ConversionStats = {
    total: 15,
    debit: 10,
    credit: 5,
    totalAmount: 1234.56,
    currency: 'EUR',
  };

  it('should render total transactions count', () => {
    render(<StatsCard stats={mockStats} />);

    expect(screen.getByText('Gesamt Transaktionen')).toBeInTheDocument();
    expect(screen.getByText('15')).toBeInTheDocument();
  });

  it('should render debit and credit breakdown', () => {
    render(<StatsCard stats={mockStats} />);

    expect(screen.getByText('10 Ausgaben, 5 Eingänge')).toBeInTheDocument();
  });

  it('should render debit transactions section', () => {
    render(<StatsCard stats={mockStats} />);

    expect(screen.getByText('Ausgaben')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('DEBIT Transaktionen')).toBeInTheDocument();
  });

  it('should render credit transactions section', () => {
    render(<StatsCard stats={mockStats} />);

    expect(screen.getByText('Eingänge')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('CREDIT Transaktionen')).toBeInTheDocument();
  });

  it('should format total amount with German locale', () => {
    render(<StatsCard stats={mockStats} />);

    expect(screen.getByText('Gesamtbetrag')).toBeInTheDocument();
    // German locale formatting: 1.234,56 €
    expect(screen.getByText('1.234,56 €')).toBeInTheDocument();
  });

  it('should handle different currencies', () => {
    const usdStats: ConversionStats = {
      total: 5,
      debit: 3,
      credit: 2,
      totalAmount: 500.00,
      currency: 'USD',
    };

    render(<StatsCard stats={usdStats} />);

    // USD formatting in German locale: 500,00 $
    expect(screen.getByText('500,00 $')).toBeInTheDocument();
  });

  it('should handle zero values', () => {
    const zeroStats: ConversionStats = {
      total: 0,
      debit: 0,
      credit: 0,
      totalAmount: 0.00,
      currency: 'EUR',
    };

    render(<StatsCard stats={zeroStats} />);

    // Check for the breakdown text which contains zeros
    expect(screen.getByText('0 Ausgaben, 0 Eingänge')).toBeInTheDocument();
    expect(screen.getByText('0,00 €')).toBeInTheDocument();
  });

  it('should handle negative total amounts', () => {
    const negativeStats: ConversionStats = {
      total: 10,
      debit: 10,
      credit: 0,
      totalAmount: -1500.75,
      currency: 'EUR',
    };

    render(<StatsCard stats={negativeStats} />);

    // Negative value with German locale formatting
    expect(screen.getByText('-1.500,75 €')).toBeInTheDocument();
  });

  it('should render all card sections', () => {
    const { container } = render(<StatsCard stats={mockStats} />);

    // Should have 4 cards: total, debit, credit, and total amount
    const cards = container.querySelectorAll('[data-slot="card"]');
    expect(cards.length).toBe(4);
  });

  it('should display helper text for total amount', () => {
    render(<StatsCard stats={mockStats} />);

    expect(screen.getByText('Netto-Betrag aller Transaktionen')).toBeInTheDocument();
  });
});
