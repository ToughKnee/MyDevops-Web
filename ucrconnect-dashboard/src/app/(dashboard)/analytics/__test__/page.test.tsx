import React from 'react';
import { render, screen } from '@testing-library/react';
import Analytics from '../page';

describe('Analytics Component', () => {
    test('renders the Analytics component with correct heading', () => {
        // Render the component
        render(<Analytics />);

        // Check if the heading with text is in the document
        const headingElement = screen.getByText(/analytics/i);
        expect(headingElement).toBeInTheDocument();

        // Additional test to verify it's an h1 element
        expect(headingElement.tagName).toBe('H1');

        // Verify the className for styling is applied correctly
        expect(headingElement).toHaveClass('text-gray-800');
    });
});