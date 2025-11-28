import { render, screen, fireEvent } from '@testing-library/react';
import { MergeSettings } from '../merge-settings';
import { DEFAULT_BATCH_OPTIONS, type BatchProcessingOptions } from '@/lib/batch-processor';

describe('MergeSettings', () => {
  const mockOnOptionsChange = jest.fn();

  const defaultProps = {
    options: DEFAULT_BATCH_OPTIONS,
    onOptionsChange: mockOnOptionsChange,
    disabled: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the settings card with title', () => {
    render(<MergeSettings {...defaultProps} />);

    expect(screen.getByText('Zusammenführungsoptionen')).toBeInTheDocument();
  });

  it('renders duplicate removal checkbox', () => {
    render(<MergeSettings {...defaultProps} />);

    const checkbox = screen.getByRole('checkbox', {
      name: /duplikate automatisch entfernen/i,
    });
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).toBeChecked();
  });

  it('toggles duplicate removal option', () => {
    render(<MergeSettings {...defaultProps} />);

    const checkbox = screen.getByRole('checkbox', {
      name: /duplikate automatisch entfernen/i,
    });
    fireEvent.click(checkbox);

    expect(mockOnOptionsChange).toHaveBeenCalledWith({
      ...DEFAULT_BATCH_OPTIONS,
      removeDuplicates: false,
    });
  });

  it('renders merge strategy select', () => {
    render(<MergeSettings {...defaultProps} />);

    const select = screen.getByRole('combobox', { name: /sortierung/i });
    expect(select).toBeInTheDocument();
    expect(select).toHaveValue('chronological');
  });

  it('changes merge strategy', () => {
    render(<MergeSettings {...defaultProps} />);

    const select = screen.getByRole('combobox', { name: /sortierung/i });
    fireEvent.change(select, { target: { value: 'reverse-chronological' } });

    expect(mockOnOptionsChange).toHaveBeenCalledWith({
      ...DEFAULT_BATCH_OPTIONS,
      mergeStrategy: 'reverse-chronological',
    });
  });

  it('renders parallel processing checkbox', () => {
    render(<MergeSettings {...defaultProps} />);

    const checkbox = screen.getByRole('checkbox', {
      name: /parallele verarbeitung/i,
    });
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).toBeChecked();
  });

  it('toggles parallel processing option', () => {
    render(<MergeSettings {...defaultProps} />);

    const checkbox = screen.getByRole('checkbox', {
      name: /parallele verarbeitung/i,
    });
    fireEvent.click(checkbox);

    expect(mockOnOptionsChange).toHaveBeenCalledWith({
      ...DEFAULT_BATCH_OPTIONS,
      parallelProcessing: false,
    });
  });

  it('displays info box', () => {
    render(<MergeSettings {...defaultProps} />);

    expect(
      screen.getByText(/alle dateien werden zu einer einzigen csv-datei zusammengeführt/i)
    ).toBeInTheDocument();
  });

  it('disables all inputs when disabled prop is true', () => {
    render(<MergeSettings {...defaultProps} disabled={true} />);

    const checkboxes = screen.getAllByRole('checkbox');
    const select = screen.getByRole('combobox');

    checkboxes.forEach((checkbox) => {
      expect(checkbox).toBeDisabled();
    });
    expect(select).toBeDisabled();
  });

  it('shows strategy descriptions', () => {
    render(<MergeSettings {...defaultProps} />);

    expect(
      screen.getByText(/sortiert alle transaktionen nach datum, beginnend mit der ältesten/i)
    ).toBeInTheDocument();
  });

  it('updates strategy description when strategy changes', () => {
    const { rerender } = render(<MergeSettings {...defaultProps} />);

    // Initially shows chronological description
    expect(
      screen.getByText(/sortiert alle transaktionen nach datum, beginnend mit der ältesten/i)
    ).toBeInTheDocument();

    // Change to reverse-chronological
    rerender(
      <MergeSettings
        {...defaultProps}
        options={{ ...DEFAULT_BATCH_OPTIONS, mergeStrategy: 'reverse-chronological' }}
      />
    );

    expect(
      screen.getByText(/sortiert alle transaktionen nach datum, beginnend mit der neuesten/i)
    ).toBeInTheDocument();
  });

  it('shows max parallel files count', () => {
    render(<MergeSettings {...defaultProps} />);

    expect(
      screen.getByText(/verarbeitet bis zu 3 dateien gleichzeitig/i)
    ).toBeInTheDocument();
  });
});
