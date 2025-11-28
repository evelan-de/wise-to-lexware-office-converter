import { render, screen } from '@testing-library/react';
import { BatchStatsCard } from '../batch-stats';
import type { BatchStats } from '@/lib/batch-processor';

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  TrendingUp: () => <span data-testid="trending-up">Up</span>,
  TrendingDown: () => <span data-testid="trending-down">Down</span>,
  FileCheck: () => <span data-testid="file-check">FileCheck</span>,
  Files: () => <span data-testid="files">Files</span>,
  AlertTriangle: () => <span data-testid="alert">Alert</span>,
  Copy: () => <span data-testid="copy">Copy</span>,
}));

describe('BatchStatsCard', () => {
  const createMockStats = (overrides: Partial<BatchStats> = {}): BatchStats => ({
    totalFiles: 5,
    completedFiles: 4,
    failedFiles: 1,
    totalTransactions: 100,
    totalDebit: 60,
    totalCredit: 40,
    totalAmount: -5000.5,
    currency: 'EUR',
    duplicatesRemoved: 0,
    ...overrides,
  });

  it('renders files processed stats', () => {
    const stats = createMockStats();
    render(<BatchStatsCard stats={stats} />);

    expect(screen.getByText('Verarbeitete Dateien')).toBeInTheDocument();
    expect(screen.getByText('4/5')).toBeInTheDocument();
    expect(screen.getByText('1 fehlgeschlagen')).toBeInTheDocument();
  });

  it('renders total transactions stats', () => {
    const stats = createMockStats();
    render(<BatchStatsCard stats={stats} />);

    expect(screen.getByText('Gesamt Transaktionen')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText('60 Ausgaben, 40 Eingänge')).toBeInTheDocument();
  });

  it('renders debit transactions stats', () => {
    const stats = createMockStats();
    render(<BatchStatsCard stats={stats} />);

    expect(screen.getByText('Ausgaben')).toBeInTheDocument();
    expect(screen.getByText('60')).toBeInTheDocument();
    expect(screen.getByText('DEBIT Transaktionen')).toBeInTheDocument();
  });

  it('renders credit transactions stats', () => {
    const stats = createMockStats();
    render(<BatchStatsCard stats={stats} />);

    expect(screen.getByText('Eingänge')).toBeInTheDocument();
    expect(screen.getByText('40')).toBeInTheDocument();
    expect(screen.getByText('CREDIT Transaktionen')).toBeInTheDocument();
  });

  it('renders total amount in German format', () => {
    const stats = createMockStats({ totalAmount: -5000.5 });
    render(<BatchStatsCard stats={stats} />);

    expect(screen.getByText('Gesamtbetrag')).toBeInTheDocument();
    // German format: -5.000,50 €
    expect(screen.getByText(/-5\.000,50\s*€/)).toBeInTheDocument();
  });

  it('shows duplicates removed when there are duplicates', () => {
    const stats = createMockStats({ duplicatesRemoved: 10 });
    render(<BatchStatsCard stats={stats} />);

    expect(screen.getByText('Duplikate entfernt')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(
      screen.getByText('Doppelte Transaktionen wurden automatisch entfernt')
    ).toBeInTheDocument();
  });

  it('does not show duplicates section when no duplicates', () => {
    const stats = createMockStats({ duplicatesRemoved: 0 });
    render(<BatchStatsCard stats={stats} />);

    expect(screen.queryByText('Duplikate entfernt')).not.toBeInTheDocument();
  });

  it('does not show failed files warning when all succeeded', () => {
    const stats = createMockStats({ failedFiles: 0 });
    render(<BatchStatsCard stats={stats} />);

    expect(screen.queryByText(/fehlgeschlagen/)).not.toBeInTheDocument();
  });

  it('uses correct currency for formatting', () => {
    const stats = createMockStats({ totalAmount: 1000, currency: 'USD' });
    render(<BatchStatsCard stats={stats} />);

    // Should use USD formatting
    expect(screen.getByText(/\$|USD/)).toBeInTheDocument();
  });

  it('shows singular file text for single file', () => {
    const stats = createMockStats({ completedFiles: 1 });
    render(<BatchStatsCard stats={stats} />);

    expect(
      screen.getByText(/netto-betrag aller transaktionen aus 1 datei$/i)
    ).toBeInTheDocument();
  });

  it('shows plural files text for multiple files', () => {
    const stats = createMockStats({ completedFiles: 3 });
    render(<BatchStatsCard stats={stats} />);

    expect(
      screen.getByText(/netto-betrag aller transaktionen aus 3 dateien/i)
    ).toBeInTheDocument();
  });

  it('handles zero values gracefully', () => {
    const stats = createMockStats({
      totalFiles: 0,
      completedFiles: 0,
      failedFiles: 0,
      totalTransactions: 0,
      totalDebit: 0,
      totalCredit: 0,
      totalAmount: 0,
    });

    render(<BatchStatsCard stats={stats} />);

    expect(screen.getByText('0/0')).toBeInTheDocument();
    // Check for zero values in transaction cards (totalTransactions, debit, credit)
    expect(screen.getAllByText('0')).toHaveLength(3);
  });

  it('handles positive total amount', () => {
    const stats = createMockStats({ totalAmount: 10000 });
    render(<BatchStatsCard stats={stats} />);

    expect(screen.getByText(/10\.000,00\s*€/)).toBeInTheDocument();
  });
});
