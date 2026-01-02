import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Button from '../Button';

describe('Button Component', () => {
  it('debe renderizar el texto correctamente', () => {
    render(<Button>Hacer Click</Button>);
    
    const buttonElement = screen.getByText(/Hacer Click/i);
    expect(buttonElement).toBeInTheDocument();
  });

  it('debe ejecutar la función onClick cuando se hace click', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Acción</Button>);

    const buttonElement = screen.getByRole('button', { name: /Acción/i });
    fireEvent.click(buttonElement);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});