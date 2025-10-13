import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { FileUpload } from '../file-upload';

describe('FileUpload', () => {
  const mockOnFileSelect = jest.fn();
  const mockOnError = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render upload area with correct text', () => {
    render(
      <FileUpload
        onFileSelect={mockOnFileSelect}
        onError={mockOnError}
        isProcessing={false}
      />
    );

    expect(screen.getByText(/CSV-Datei hier ablegen oder klicken/i)).toBeInTheDocument();
    expect(screen.getByText(/Nur Wise Export CSV-Dateien/i)).toBeInTheDocument();
    expect(screen.getByText(/Maximale Dateigröße: 10 MB/i)).toBeInTheDocument();
  });

  it('should show processing state when isProcessing is true', () => {
    render(
      <FileUpload
        onFileSelect={mockOnFileSelect}
        onError={mockOnError}
        isProcessing={true}
      />
    );

    expect(screen.getByText(/Datei wird verarbeitet/i)).toBeInTheDocument();
    expect(screen.getByText(/Bitte warten Sie einen Moment/i)).toBeInTheDocument();
  });

  it('should call onFileSelect with valid CSV file', () => {
    const { container } = render(
      <FileUpload
        onFileSelect={mockOnFileSelect}
        onError={mockOnError}
        isProcessing={false}
      />
    );

    const file = new File(['test content'], 'test.csv', { type: 'text/csv' });
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;

    Object.defineProperty(input, 'files', {
      value: [file],
      writable: false,
    });

    fireEvent.change(input);

    expect(mockOnFileSelect).toHaveBeenCalledWith(file);
    expect(mockOnError).not.toHaveBeenCalled();
  });

  it('should call onError for non-CSV file', () => {
    const { container } = render(
      <FileUpload
        onFileSelect={mockOnFileSelect}
        onError={mockOnError}
        isProcessing={false}
      />
    );

    const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;

    Object.defineProperty(input, 'files', {
      value: [file],
      writable: false,
    });

    fireEvent.change(input);

    expect(mockOnFileSelect).not.toHaveBeenCalled();
    expect(mockOnError).toHaveBeenCalledWith('Bitte wählen Sie eine CSV-Datei aus.');
  });

  it('should call onError for file exceeding size limit', () => {
    const { container } = render(
      <FileUpload
        onFileSelect={mockOnFileSelect}
        onError={mockOnError}
        isProcessing={false}
      />
    );

    // Create file larger than 10MB
    const largeContent = 'x'.repeat(11 * 1024 * 1024);
    const file = new File([largeContent], 'large.csv', { type: 'text/csv' });

    const input = container.querySelector('input[type="file"]') as HTMLInputElement;

    Object.defineProperty(input, 'files', {
      value: [file],
      writable: false,
    });

    fireEvent.change(input);

    expect(mockOnFileSelect).not.toHaveBeenCalled();
    expect(mockOnError).toHaveBeenCalledWith('Datei ist zu groß. Maximale Größe: 10 MB');
  });

  it('should accept files with .csv extension', () => {
    const { container } = render(
      <FileUpload
        onFileSelect={mockOnFileSelect}
        onError={mockOnError}
        isProcessing={false}
      />
    );

    const input = container.querySelector('input[type="file"]') as HTMLInputElement;

    expect(input).toHaveAttribute('accept', '.csv');
  });

  it('should disable input when processing', () => {
    const { container } = render(
      <FileUpload
        onFileSelect={mockOnFileSelect}
        onError={mockOnError}
        isProcessing={true}
      />
    );

    const input = container.querySelector('input[type="file"]') as HTMLInputElement;

    expect(input).toBeDisabled();
  });

  it('should handle drag and drop', () => {
    const { container } = render(
      <FileUpload
        onFileSelect={mockOnFileSelect}
        onError={mockOnError}
        isProcessing={false}
      />
    );

    const dropZone = container.firstChild as HTMLElement;
    const file = new File(['test content'], 'test.csv', { type: 'text/csv' });

    const dropEvent = new Event('drop', { bubbles: true });
    Object.defineProperty(dropEvent, 'dataTransfer', {
      value: { files: [file] },
    });

    fireEvent(dropZone, dropEvent);

    expect(mockOnFileSelect).toHaveBeenCalledWith(file);
  });

  it('should reset input value on validation error', () => {
    const { container } = render(
      <FileUpload
        onFileSelect={mockOnFileSelect}
        onError={mockOnError}
        isProcessing={false}
      />
    );

    const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;

    Object.defineProperty(input, 'files', {
      value: [file],
      writable: false,
    });

    // Mock the value property to be settable
    Object.defineProperty(input, 'value', {
      value: 'test.txt',
      writable: true,
      configurable: true,
    });

    fireEvent.change(input);

    expect(input.value).toBe('');
  });

  it('should not process files when already processing', () => {
    const { rerender } = render(
      <FileUpload
        onFileSelect={mockOnFileSelect}
        onError={mockOnError}
        isProcessing={false}
      />
    );

    rerender(
      <FileUpload
        onFileSelect={mockOnFileSelect}
        onError={mockOnError}
        isProcessing={true}
      />
    );

    const dropZone = screen.getByText(/Datei wird verarbeitet/i).closest('div');

    // Should not be clickable when processing
    expect(dropZone?.parentElement).toHaveClass('border-primary/50');
  });
});
