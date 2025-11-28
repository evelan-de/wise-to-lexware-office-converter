import { render, screen, fireEvent } from '@testing-library/react';
import { FileQueue } from '../file-queue';
import type { BatchFile } from '@/lib/batch-processor';

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  X: () => <span data-testid="x-icon">X</span>,
  FileText: () => <span data-testid="file-icon">File</span>,
  CheckCircle: () => <span data-testid="check-icon">Check</span>,
  AlertCircle: () => <span data-testid="alert-icon">Alert</span>,
  Loader2: () => <span data-testid="loader-icon">Loading</span>,
  Clock: () => <span data-testid="clock-icon">Clock</span>,
  Trash2: () => <span data-testid="trash-icon">Trash</span>,
  RotateCcw: () => <span data-testid="retry-icon">Retry</span>,
}));

describe('FileQueue', () => {
  const mockOnRemoveFile = jest.fn();
  const mockOnRetryFile = jest.fn();
  const mockOnCancelFile = jest.fn();
  const mockOnClearCompleted = jest.fn();
  const mockOnClearAll = jest.fn();

  const defaultProps = {
    files: [],
    onRemoveFile: mockOnRemoveFile,
    onRetryFile: mockOnRetryFile,
    onCancelFile: mockOnCancelFile,
    onClearCompleted: mockOnClearCompleted,
    onClearAll: mockOnClearAll,
    isProcessing: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const createMockFile = (overrides: Partial<BatchFile> = {}): BatchFile => ({
    id: 'test-file-1',
    file: new File(['test content'], 'test.csv', { type: 'text/csv' }),
    status: 'pending',
    progress: 0,
    ...overrides,
  });

  it('renders nothing when there are no files', () => {
    const { container } = render(<FileQueue {...defaultProps} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders file list when files are present', () => {
    const files: BatchFile[] = [
      createMockFile({ id: 'file-1' }),
      createMockFile({ id: 'file-2' }),
    ];

    render(<FileQueue {...defaultProps} files={files} />);

    expect(screen.getByText('Dateiwarteschlange (2)')).toBeInTheDocument();
    expect(screen.getAllByText('test.csv')).toHaveLength(2);
  });

  it('shows correct status for pending files', () => {
    const files: BatchFile[] = [createMockFile({ status: 'pending' })];

    render(<FileQueue {...defaultProps} files={files} />);

    expect(screen.getByText('Wartend')).toBeInTheDocument();
    expect(screen.getByText('1 wartend')).toBeInTheDocument();
  });

  it('shows correct status for processing files', () => {
    const files: BatchFile[] = [createMockFile({ status: 'processing', progress: 50 })];

    render(<FileQueue {...defaultProps} files={files} />);

    expect(screen.getByText('Verarbeitung...')).toBeInTheDocument();
    expect(screen.getByText('1 in Bearbeitung')).toBeInTheDocument();
  });

  it('shows correct status for completed files', () => {
    const files: BatchFile[] = [
      createMockFile({
        status: 'completed',
        stats: { total: 10, debit: 6, credit: 4, totalAmount: 500, currency: 'EUR' },
      }),
    ];

    render(<FileQueue {...defaultProps} files={files} />);

    expect(screen.getByText('Abgeschlossen')).toBeInTheDocument();
    expect(screen.getByText('- 10 Transaktionen')).toBeInTheDocument();
    expect(screen.getByText('1 abgeschlossen')).toBeInTheDocument();
  });

  it('shows correct status for error files', () => {
    const files: BatchFile[] = [
      createMockFile({ status: 'error', error: 'Test error message' }),
    ];

    render(<FileQueue {...defaultProps} files={files} />);

    expect(screen.getByText('Fehler')).toBeInTheDocument();
    expect(screen.getByText('Test error message')).toBeInTheDocument();
    expect(screen.getByText('1 fehlgeschlagen')).toBeInTheDocument();
  });

  it('shows retry button for error files', () => {
    const files: BatchFile[] = [createMockFile({ status: 'error' })];

    render(<FileQueue {...defaultProps} files={files} />);

    const retryButton = screen.getByTitle('Erneut versuchen');
    fireEvent.click(retryButton);

    expect(mockOnRetryFile).toHaveBeenCalledWith('test-file-1');
  });

  it('shows remove button for completed files', () => {
    const files: BatchFile[] = [createMockFile({ status: 'completed' })];

    render(<FileQueue {...defaultProps} files={files} />);

    const removeButton = screen.getByTitle('Entfernen');
    fireEvent.click(removeButton);

    expect(mockOnRemoveFile).toHaveBeenCalledWith('test-file-1');
  });

  it('shows cancel button for pending files during processing', () => {
    const files: BatchFile[] = [createMockFile({ status: 'pending' })];

    render(<FileQueue {...defaultProps} files={files} isProcessing={true} />);

    const cancelButton = screen.getByTitle('Abbrechen');
    fireEvent.click(cancelButton);

    expect(mockOnCancelFile).toHaveBeenCalledWith('test-file-1');
  });

  it('calls onClearCompleted when clicking clear completed button', () => {
    const files: BatchFile[] = [createMockFile({ status: 'completed' })];

    render(<FileQueue {...defaultProps} files={files} />);

    const clearButton = screen.getByText('Abgeschlossene entfernen');
    fireEvent.click(clearButton);

    expect(mockOnClearCompleted).toHaveBeenCalled();
  });

  it('calls onClearAll when clicking clear all button', () => {
    const files: BatchFile[] = [createMockFile({ status: 'pending' })];

    render(<FileQueue {...defaultProps} files={files} />);

    const clearAllButton = screen.getByText('Alle entfernen');
    fireEvent.click(clearAllButton);

    expect(mockOnClearAll).toHaveBeenCalled();
  });

  it('does not show clear buttons during processing', () => {
    const files: BatchFile[] = [createMockFile({ status: 'completed' })];

    render(<FileQueue {...defaultProps} files={files} isProcessing={true} />);

    expect(screen.queryByText('Abgeschlossene entfernen')).not.toBeInTheDocument();
    expect(screen.queryByText('Alle entfernen')).not.toBeInTheDocument();
  });

  it('formats file size correctly', () => {
    const files: BatchFile[] = [
      createMockFile({
        file: new File(['x'.repeat(1500)], 'test.csv', { type: 'text/csv' }),
      }),
    ];

    render(<FileQueue {...defaultProps} files={files} />);

    expect(screen.getByText(/1\.5 KB/)).toBeInTheDocument();
  });
});
