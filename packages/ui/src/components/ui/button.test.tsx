import { render, screen } from '@testing-library/react';
import { Button } from '../components/ui/button';
import { describe, it, expect } from 'vitest';

describe('Button', () => {
  it('renders correctly with children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('applies default classes', () => {
    const { container } = render(<Button>Test</Button>);
    expect(container.firstChild).toHaveClass('inline-flex');
  });
});
