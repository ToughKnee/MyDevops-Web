import React from 'react';
import { render } from '@testing-library/react';
import Home from '../page';

// Mock the next/navigation redirect function
jest.mock('next/navigation', () => ({
    redirect: jest.fn()
}));

describe('Home Component', () => {
    test('redirects to dashboard page', () => {
        const { redirect } = require('next/navigation');

        // Render the Home component
        render(<Home />);

        // Check if redirect was called with the correct path
        expect(redirect).toHaveBeenCalledTimes(1);
        expect(redirect).toHaveBeenCalledWith('/dashboard');
        // Note: change the dashboard path to login when changed in the page.tsx
    });
});