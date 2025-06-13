import React from 'react';
import { render, screen, fireEvent } from '@/tests/test-utils/test-utils';
import { Button } from './Button';

describe('Button Component', () => {
  it('renders a button with default props', () => {
    render(<Button>Click me</Button>);
    
    const button = screen.getByRole('button', { name: /click me/i });
    
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('sc-'); // Styled component class
    expect(button).toHaveStyle('background-color: #2563eb'); // Default primary color
    expect(button).toHaveStyle('color: white');
    expect(button).not.toBeDisabled();
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    
    render(<Button onClick={handleClick}>Click me</Button>);
    
    const button = screen.getByRole('button', { name: /click me/i });
    fireEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('shows a loading spinner when isLoading is true', () => {
    render(<Button isLoading>Loading</Button>);
    
    const button = screen.getByRole('button');
    const loader = button.querySelector('span[aria-hidden="true"]');
    
    expect(button).toBeDisabled();
    expect(loader).toBeInTheDocument();
  });

  it('applies the correct styles for different variants', () => {
    const { rerender } = render(<Button variant="primary">Primary</Button>);
    expect(screen.getByRole('button')).toHaveStyle('background-color: #2563eb');
    
    rerender(<Button variant="secondary">Secondary</Button>);
    expect(screen.getByRole('button')).toHaveStyle('background-color: #e5e7eb');
    
    rerender(<Button variant="danger">Danger</Button>);
    expect(screen.getByRole('button')).toHaveStyle('background-color: #dc2626');
  });

  it('applies the correct styles for different sizes', () => {
    const { rerender } = render(<Button size="small">Small</Button>);
    expect(screen.getByRole('button')).toHaveStyle('padding: 6px 12px');
    
    rerender(<Button size="medium">Medium</Button>);
    expect(screen.getByRole('button')).toHaveStyle('padding: 8px 16px');
    
    rerender(<Button size="large">Large</Button>);
    expect(screen.getByRole('button')).toHaveStyle('padding: 12px 24px');
  });

  it('renders as full width when fullWidth is true', () => {
    render(<Button fullWidth>Full Width</Button>);
    
    expect(screen.getByRole('button')).toHaveStyle('width: 100%');
  });

  it('forwards ref to the button element', () => {
    const ref = React.createRef<HTMLButtonElement>();
    
    render(<Button ref={ref}>With Ref</Button>);
    
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    expect(ref.current?.textContent).toBe('With Ref');
  });

  it('applies additional className and other HTML attributes', () => {
    render(
      <Button 
        className="custom-class" 
        data-testid="custom-button"
        aria-label="Custom button"
      >
        Custom
      </Button>
    );
    
    const button = screen.getByTestId('custom-button');
    
    expect(button).toHaveClass('custom-class');
    expect(button).toHaveAttribute('aria-label', 'Custom button');
  });
});
