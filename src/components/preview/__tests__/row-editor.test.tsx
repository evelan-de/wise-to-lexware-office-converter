import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { RowEditor } from '../row-editor';
import type { WiseRow } from '@/lib/converter';

// Helper to create a WiseRow
function createWiseRow(overrides: Partial<WiseRow> = {}): WiseRow {
  return {
    'TransferWise ID': 'TRANSFER-123',
    Date: '29-09-2025',
    'Date Time': '29-09-2025 16:02:46.004',
    Amount: '-553.76',
    Currency: 'EUR',
    Description: 'Test payment',
    'Payment Reference': 'Invoice 22',
    'Running Balance': '4315.50',
    'Payer Name': '',
    'Payee Name': 'John Doe',
    'Transaction Type': 'DEBIT',
    'Transaction Details Type': 'TRANSFER',
    ...overrides,
  };
}

describe('RowEditor', () => {
  const mockRow = createWiseRow();
  const mockOnSave = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render with row data', () => {
    render(
      <RowEditor
        row={mockRow}
        rowIndex={0}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByText(/Transaktion bearbeiten \(Zeile 1\)/)).toBeInTheDocument();
    expect(screen.getByDisplayValue('29-09-2025')).toBeInTheDocument();
    expect(screen.getByDisplayValue('-553.76')).toBeInTheDocument();
  });

  it('should show validation status for valid row', () => {
    render(
      <RowEditor
        row={mockRow}
        rowIndex={0}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByText(/Transaktion ist gültig/)).toBeInTheDocument();
  });

  it('should show validation error for invalid data', async () => {
    const invalidRow = createWiseRow({ Date: '' });

    render(
      <RowEditor
        row={invalidRow}
        rowIndex={0}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
      />
    );

    await waitFor(() => {
      expect(screen.getByText(/Bitte korrigieren Sie die Fehler/)).toBeInTheDocument();
    });
  });

  it('should call onCancel when cancel button is clicked', () => {
    render(
      <RowEditor
        row={mockRow}
        rowIndex={0}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
      />
    );

    fireEvent.click(screen.getByText('Abbrechen'));
    expect(mockOnCancel).toHaveBeenCalled();
  });

  it('should call onCancel when X button is clicked', () => {
    render(
      <RowEditor
        row={mockRow}
        rowIndex={0}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
      />
    );

    const closeButtons = screen.getAllByRole('button');
    const closeButton = closeButtons.find(btn => btn.querySelector('svg.lucide-x'));

    if (closeButton) {
      fireEvent.click(closeButton);
      expect(mockOnCancel).toHaveBeenCalled();
    }
  });

  it('should enable save button when changes are made', async () => {
    render(
      <RowEditor
        row={mockRow}
        rowIndex={0}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
      />
    );

    const descriptionInput = screen.getByDisplayValue('Test payment');
    fireEvent.change(descriptionInput, { target: { value: 'Updated payment' } });

    await waitFor(() => {
      const saveButton = screen.getByText('Speichern').closest('button');
      expect(saveButton).not.toBeDisabled();
    });
  });

  it('should call onSave with updated data when save is clicked', async () => {
    render(
      <RowEditor
        row={mockRow}
        rowIndex={0}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
      />
    );

    const descriptionInput = screen.getByDisplayValue('Test payment');
    fireEvent.change(descriptionInput, { target: { value: 'Updated payment' } });

    await waitFor(() => {
      const saveButton = screen.getByText('Speichern').closest('button');
      expect(saveButton).not.toBeDisabled();
    });

    fireEvent.click(screen.getByText('Speichern'));

    expect(mockOnSave).toHaveBeenCalledWith(0, expect.objectContaining({
      Description: 'Updated payment',
    }));
  });

  it('should disable save button when no changes are made', () => {
    render(
      <RowEditor
        row={mockRow}
        rowIndex={0}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
      />
    );

    const saveButton = screen.getByText('Speichern').closest('button');
    expect(saveButton).toBeDisabled();
  });

  it('should disable save button when data is invalid', async () => {
    render(
      <RowEditor
        row={mockRow}
        rowIndex={0}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
      />
    );

    const dateInput = screen.getByDisplayValue('29-09-2025');
    fireEvent.change(dateInput, { target: { value: '' } });

    await waitFor(() => {
      const saveButton = screen.getByText('Speichern').closest('button');
      expect(saveButton).toBeDisabled();
    });
  });

  it('should show field labels', () => {
    render(
      <RowEditor
        row={mockRow}
        rowIndex={0}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByText('Datum')).toBeInTheDocument();
    expect(screen.getByText('Betrag')).toBeInTheDocument();
    expect(screen.getByText('Beschreibung')).toBeInTheDocument();
    expect(screen.getByText('Transaktionstyp')).toBeInTheDocument();
  });

  it('should show transaction type dropdown', () => {
    render(
      <RowEditor
        row={mockRow}
        rowIndex={0}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByText('Ausgabe (DEBIT)')).toBeInTheDocument();
  });

  it('should show read-only information', () => {
    render(
      <RowEditor
        row={mockRow}
        rowIndex={0}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByText(/Wise ID: TRANSFER-123/)).toBeInTheDocument();
    expect(screen.getByText(/Kontostand: 4315.50/)).toBeInTheDocument();
  });

  it('should update validation on field change', async () => {
    render(
      <RowEditor
        row={mockRow}
        rowIndex={0}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
      />
    );

    // Initial state: valid
    expect(screen.getByText(/Transaktion ist gültig/)).toBeInTheDocument();

    // Make invalid
    const dateInput = screen.getByDisplayValue('29-09-2025');
    fireEvent.change(dateInput, { target: { value: 'invalid-date' } });

    await waitFor(() => {
      expect(screen.getByText(/Bitte korrigieren Sie die Fehler/)).toBeInTheDocument();
    });
  });
});
