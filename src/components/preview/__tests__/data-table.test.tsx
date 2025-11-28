import { render, screen, fireEvent } from '@testing-library/react';
import { DataTable } from '../data-table';
import type { WiseRow } from '@/lib/converter';
import type { ValidationSummary } from '@/lib/validation';

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

// Create mock validation data
function createValidation(data: WiseRow[]): ValidationSummary {
  return {
    totalRows: data.length,
    validRows: data.length,
    rowsWithErrors: 0,
    rowsWithWarnings: 0,
    results: data.map((_, index) => ({
      rowIndex: index,
      isValid: true,
      hasWarnings: false,
      issues: [],
    })),
  };
}

describe('DataTable', () => {
  const mockData: WiseRow[] = [
    createWiseRow({ 'TransferWise ID': '1', Description: 'Payment 1', Amount: '-100.00' }),
    createWiseRow({ 'TransferWise ID': '2', Description: 'Payment 2', Amount: '500.00', 'Transaction Type': 'CREDIT' }),
    createWiseRow({ 'TransferWise ID': '3', Description: 'Payment 3', Amount: '-250.00' }),
  ];

  const mockValidation = createValidation(mockData);

  it('should render table with data', () => {
    render(<DataTable data={mockData} validation={mockValidation} />);

    // Both mobile and desktop views are rendered, so use getAllByText
    expect(screen.getAllByText('Payment 1').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Payment 2').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Payment 3').length).toBeGreaterThanOrEqual(1);
  });

  it('should display column headers in desktop view', () => {
    render(<DataTable data={mockData} validation={mockValidation} />);

    expect(screen.getByText('Datum')).toBeInTheDocument();
    expect(screen.getByText('Betrag')).toBeInTheDocument();
    expect(screen.getByText('Währung')).toBeInTheDocument();
    expect(screen.getByText('Beschreibung')).toBeInTheDocument();
  });

  it('should display validation summary', () => {
    render(<DataTable data={mockData} validation={mockValidation} />);

    expect(screen.getByText(/3 gültig/)).toBeInTheDocument();
  });

  it('should format amounts correctly', () => {
    render(<DataTable data={mockData} validation={mockValidation} />);

    // German format with comma - check that formatted amounts exist
    expect(screen.getAllByText('-100,00').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('500,00').length).toBeGreaterThanOrEqual(1);
  });

  it('should display transaction types in German in desktop view', () => {
    render(<DataTable data={mockData} validation={mockValidation} />);

    // Desktop table shows Ausgabe/Einnahme
    expect(screen.getAllByText('Ausgabe').length).toBeGreaterThanOrEqual(2);
    expect(screen.getAllByText('Einnahme').length).toBeGreaterThanOrEqual(1);
  });

  it('should show search input when showSearch is true', () => {
    render(<DataTable data={mockData} validation={mockValidation} showSearch={true} />);

    expect(screen.getByPlaceholderText(/Suchen/)).toBeInTheDocument();
  });

  it('should filter data when searching', () => {
    render(<DataTable data={mockData} validation={mockValidation} showSearch={true} />);

    const searchInput = screen.getByPlaceholderText(/Suchen/);
    fireEvent.change(searchInput, { target: { value: 'Payment 1' } });

    expect(screen.getAllByText('Payment 1').length).toBeGreaterThanOrEqual(1);
    expect(screen.queryByText('Payment 2')).not.toBeInTheDocument();
    expect(screen.queryByText('Payment 3')).not.toBeInTheDocument();
  });

  it('should filter by transaction type', () => {
    render(<DataTable data={mockData} validation={mockValidation} />);

    const typeSelect = screen.getByRole('combobox');
    fireEvent.change(typeSelect, { target: { value: 'CREDIT' } });

    expect(screen.queryByText('Payment 1')).not.toBeInTheDocument();
    expect(screen.getAllByText('Payment 2').length).toBeGreaterThanOrEqual(1);
    expect(screen.queryByText('Payment 3')).not.toBeInTheDocument();
  });

  it('should show edit button when onEditRow is provided', () => {
    const mockOnEdit = jest.fn();
    render(<DataTable data={mockData} validation={mockValidation} onEditRow={mockOnEdit} />);

    // Both mobile and desktop views have edit buttons
    const editButtons = screen.getAllByTitle('Zeile bearbeiten');
    expect(editButtons.length).toBeGreaterThanOrEqual(3);
  });

  it('should call onEditRow when edit button is clicked', () => {
    const mockOnEdit = jest.fn();
    render(<DataTable data={mockData} validation={mockValidation} onEditRow={mockOnEdit} />);

    const editButtons = screen.getAllByTitle('Zeile bearbeiten');
    fireEvent.click(editButtons[0]);

    expect(mockOnEdit).toHaveBeenCalledWith(0, mockData[0]);
  });

  it('should display empty state when no data matches', () => {
    render(<DataTable data={mockData} validation={mockValidation} showSearch={true} />);

    const searchInput = screen.getByPlaceholderText(/Suchen/);
    fireEvent.change(searchInput, { target: { value: 'nonexistent' } });

    // Both mobile and desktop show empty state
    expect(screen.getAllByText('Keine Transaktionen gefunden').length).toBeGreaterThanOrEqual(1);
  });

  it('should limit preview rows when maxPreviewRows is set', () => {
    const manyRows = Array.from({ length: 20 }, (_, i) =>
      createWiseRow({ 'TransferWise ID': String(i + 1), Description: `Payment ${i + 1}` })
    );
    const validation = createValidation(manyRows);

    render(<DataTable data={manyRows} validation={validation} maxPreviewRows={5} />);

    expect(screen.getByText(/Vorschau: erste 5 von 20 Zeilen/)).toBeInTheDocument();
  });

  describe('pagination', () => {
    const manyRows = Array.from({ length: 100 }, (_, i) =>
      createWiseRow({ 'TransferWise ID': String(i + 1), Description: `Payment ${i + 1}` })
    );
    const validation = createValidation(manyRows);

    it('should show pagination when data exceeds page size', () => {
      render(<DataTable data={manyRows} validation={validation} pageSize={50} />);

      expect(screen.getByText(/Seite 1 von 2/)).toBeInTheDocument();
    });

    it('should navigate to next page', () => {
      render(<DataTable data={manyRows} validation={validation} pageSize={50} />);

      const nextButton = screen.getAllByRole('button').find(
        (btn) => btn.querySelector('svg.lucide-chevron-right')
      );

      if (nextButton) {
        fireEvent.click(nextButton);
        expect(screen.getByText(/Seite 2 von 2/)).toBeInTheDocument();
      }
    });
  });

  describe('validation display', () => {
    it('should show error count in summary', () => {
      const validationWithError: ValidationSummary = {
        ...mockValidation,
        rowsWithErrors: 1,
        validRows: 2,
        results: [
          { rowIndex: 0, isValid: false, hasWarnings: false, issues: [{ field: 'Date', message: 'Error', severity: 'error' }] },
          { rowIndex: 1, isValid: true, hasWarnings: false, issues: [] },
          { rowIndex: 2, isValid: true, hasWarnings: false, issues: [] },
        ],
      };

      render(<DataTable data={mockData} validation={validationWithError} />);

      expect(screen.getByText(/1 mit Fehlern/)).toBeInTheDocument();
    });

    it('should show warning count in summary', () => {
      const validationWithWarning: ValidationSummary = {
        ...mockValidation,
        rowsWithWarnings: 1,
        results: [
          { rowIndex: 0, isValid: true, hasWarnings: true, issues: [{ field: 'ID', message: 'Warning', severity: 'warning' }] },
          { rowIndex: 1, isValid: true, hasWarnings: false, issues: [] },
          { rowIndex: 2, isValid: true, hasWarnings: false, issues: [] },
        ],
      };

      render(<DataTable data={mockData} validation={validationWithWarning} />);

      expect(screen.getByText(/1 mit Warnungen/)).toBeInTheDocument();
    });
  });

  describe('default page size', () => {
    it('should use 50 as default page size', () => {
      const fiftyOneRows = Array.from({ length: 51 }, (_, i) =>
        createWiseRow({ 'TransferWise ID': String(i + 1), Description: `Payment ${i + 1}` })
      );
      const validation = createValidation(fiftyOneRows);

      render(<DataTable data={fiftyOneRows} validation={validation} />);

      // With 51 rows and page size 50, we should have 2 pages
      expect(screen.getByText(/Seite 1 von 2/)).toBeInTheDocument();
    });
  });
});
