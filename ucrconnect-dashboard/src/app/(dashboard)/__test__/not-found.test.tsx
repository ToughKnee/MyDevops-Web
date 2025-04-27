import React from 'react';
import { render, screen } from '@testing-library/react';
import NotFound from '../not-found';

// Mock Next.js Link component
jest.mock('next/link', () => {
    return function MockLink({ children, href, className }) {
        return (
            <a href={href} className={className} data-testid="mock-link">
                {children}
            </a>
        );
    };
});

describe('NotFound Component', () => {
    test('renders the not found page with correct content', () => {
        render(<NotFound />);

        // Check if heading is rendered
        const heading = screen.getByRole('heading', { level: 2 });
        expect(heading).toBeInTheDocument();
        expect(heading).toHaveTextContent('P\u00E1gina no encontrada');

        // Check if description text is rendered
        const description = screen.getByText('Lo sentimos, la p\u00E1gina que est\u00E1s buscando no existe.');
        expect(description).toBeInTheDocument();

        // Check if the link back to dashboard is rendered correctly
        const link = screen.getByTestId('mock-link');
        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute('href', '/dashboard');
        expect(link).toHaveTextContent('Volver al inicio');

        // Check if link has the correct styling classes
        expect(link).toHaveClass('px-4');
        expect(link).toHaveClass('py-2');
        expect(link).toHaveClass('bg-blue-600');
        expect(link).toHaveClass('text-white');
        expect(link).toHaveClass('rounded-md');
        expect(link).toHaveClass('hover:bg-blue-700');
        expect(link).toHaveClass('transition-colors');
    });
});