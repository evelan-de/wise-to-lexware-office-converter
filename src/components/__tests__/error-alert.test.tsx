import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorAlert } from '../error-alert';

describe('ErrorAlert', () => {
  const mockOnDismiss = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render error message', () => {
    render(<ErrorAlert message="Test error message" onDismiss={mockOnDismiss} />);

    expect(screen.getByText('Fehler')).toBeInTheDocument();
    expect(screen.getByText('Test error message')).toBeInTheDocument();
  });

  it('should call onDismiss when close button is clicked', () => {
    render(<ErrorAlert message="Test error" onDismiss={mockOnDismiss} />);

    const closeButton = screen.getByRole('button');
    fireEvent.click(closeButton);

    expect(mockOnDismiss).toHaveBeenCalledTimes(1);
  });

  it('should render with custom error styling', () => {
    const { container } = render(<ErrorAlert message="Error" onDismiss={mockOnDismiss} />);

    // Check for custom error styling classes
    const alert = container.querySelector('[data-slot="alert"]');
    expect(alert).toHaveClass('border-red-200');
    expect(alert).toHaveClass('bg-red-50');
  });
});
