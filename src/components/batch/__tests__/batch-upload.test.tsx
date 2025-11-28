import { render, screen, fireEvent } from '@testing-library/react';
import { BatchUpload } from '../batch-upload';
import { MAX_FILE_SIZE, MAX_BATCH_FILES } from '@/lib/constants';

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Upload: () => <span data-testid="upload-icon">Upload</span>,
  Loader2: () => <span data-testid="loader-icon">Loading</span>,
  FolderPlus: () => <span data-testid="folder-icon">Folder</span>,
}));

describe('BatchUpload', () => {
  const mockOnFilesSelect = jest.fn();
  const mockOnError = jest.fn();

  const defaultProps = {
    onFilesSelect: mockOnFilesSelect,
    onError: mockOnError,
    isProcessing: false,
    currentFileCount: 0,
    currentTotalSize: 0,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const createMockFile = (name: string, size: number = 1000): File => {
    const content = 'x'.repeat(size);
    return new File([content], name, { type: 'text/csv' });
  };

  it('renders upload area with instructions', () => {
    render(<BatchUpload {...defaultProps} />);

    expect(
      screen.getByText('CSV-Dateien hier ablegen oder klicken')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Mehrere Wise Export CSV-Dateien auswählen')
    ).toBeInTheDocument();
  });

  it('shows file input that accepts multiple CSV files', () => {
    render(<BatchUpload {...defaultProps} />);

    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('accept', '.csv');
    expect(input).toHaveAttribute('multiple');
  });

  it('shows remaining file count', () => {
    render(<BatchUpload {...defaultProps} currentFileCount={5} />);

    expect(
      screen.getByText(`Noch ${MAX_BATCH_FILES - 5} Dateien verfügbar`, { exact: false })
    ).toBeInTheDocument();
  });

  it('shows max files reached message when at limit', () => {
    render(<BatchUpload {...defaultProps} currentFileCount={MAX_BATCH_FILES} />);

    expect(
      screen.getByText('Maximale Anzahl an Dateien erreicht')
    ).toBeInTheDocument();
  });

  it('shows processing state', () => {
    render(<BatchUpload {...defaultProps} isProcessing={true} />);

    expect(screen.getByText('Dateien werden verarbeitet...')).toBeInTheDocument();
    expect(screen.getByText('Bitte warten Sie einen Moment')).toBeInTheDocument();
  });

  it('calls onFilesSelect when valid files are selected', () => {
    render(<BatchUpload {...defaultProps} />);

    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    const file = createMockFile('test.csv');

    Object.defineProperty(input, 'files', { value: [file] });
    fireEvent.change(input);

    expect(mockOnFilesSelect).toHaveBeenCalledWith([file]);
  });

  it('rejects non-CSV files', () => {
    render(<BatchUpload {...defaultProps} />);

    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(['test'], 'test.txt', { type: 'text/plain' });

    Object.defineProperty(input, 'files', { value: [file] });
    fireEvent.change(input);

    expect(mockOnError).toHaveBeenCalled();
    expect(mockOnFilesSelect).not.toHaveBeenCalled();
  });

  it('rejects files that are too large', () => {
    render(<BatchUpload {...defaultProps} />);

    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    const largeFile = createMockFile('large.csv', MAX_FILE_SIZE + 1);

    Object.defineProperty(input, 'files', { value: [largeFile] });
    fireEvent.change(input);

    expect(mockOnError).toHaveBeenCalled();
  });

  it('rejects when too many files are selected', () => {
    render(<BatchUpload {...defaultProps} currentFileCount={MAX_BATCH_FILES - 1} />);

    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    const files = [createMockFile('test1.csv'), createMockFile('test2.csv')];

    Object.defineProperty(input, 'files', { value: files });
    fireEvent.change(input);

    expect(mockOnError).toHaveBeenCalled();
  });

  it('accepts valid files via drag and drop', () => {
    render(<BatchUpload {...defaultProps} />);

    const dropzone = screen.getByRole('button');
    const file = createMockFile('test.csv');

    const dataTransfer = {
      files: [file],
    };

    fireEvent.drop(dropzone, { dataTransfer });

    expect(mockOnFilesSelect).toHaveBeenCalledWith([file]);
  });

  it('prevents drop when processing', () => {
    render(<BatchUpload {...defaultProps} isProcessing={true} />);

    const dropzone = screen.getByRole('button');
    const file = createMockFile('test.csv');

    const dataTransfer = {
      files: [file],
    };

    fireEvent.drop(dropzone, { dataTransfer });

    expect(mockOnFilesSelect).not.toHaveBeenCalled();
  });

  it('handles keyboard navigation', () => {
    render(<BatchUpload {...defaultProps} />);

    const dropzone = screen.getByRole('button');
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;

    // Mock the click method
    const clickMock = jest.fn();
    input.click = clickMock;

    fireEvent.keyDown(dropzone, { key: 'Enter' });
    expect(clickMock).toHaveBeenCalled();

    clickMock.mockClear();

    fireEvent.keyDown(dropzone, { key: ' ' });
    expect(clickMock).toHaveBeenCalled();
  });

  it('has correct aria attributes', () => {
    render(<BatchUpload {...defaultProps} />);

    const dropzone = screen.getByRole('button');
    expect(dropzone).toHaveAttribute('aria-label', 'Mehrere CSV-Dateien hochladen');
    expect(dropzone).toHaveAttribute('aria-disabled', 'false');
  });

  it('updates aria attributes when processing', () => {
    render(<BatchUpload {...defaultProps} isProcessing={true} />);

    const dropzone = screen.getByRole('button');
    expect(dropzone).toHaveAttribute('aria-label', 'Dateien werden verarbeitet');
    expect(dropzone).toHaveAttribute('aria-disabled', 'true');
  });

  it('filters valid files from mix of valid and invalid', () => {
    render(<BatchUpload {...defaultProps} />);

    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    const validFile = createMockFile('valid.csv');
    const invalidFile = new File(['test'], 'invalid.txt', { type: 'text/plain' });

    Object.defineProperty(input, 'files', { value: [validFile, invalidFile] });
    fireEvent.change(input);

    // Should call onError for invalid file
    expect(mockOnError).toHaveBeenCalled();
    // Should still call onFilesSelect with valid file
    expect(mockOnFilesSelect).toHaveBeenCalledWith([validFile]);
  });
});
