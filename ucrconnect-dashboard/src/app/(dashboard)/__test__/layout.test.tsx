import React from 'react';
import { render, screen } from '@testing-library/react';
import DashboardLayout from '../layout';

// Mock the imported components
jest.mock("@/app/components/sidebar", () => {
    return function MockSidebar() {
        return <div data-testid="mock-sidebar">Sidebar Content</div>;
    };
});

jest.mock("@/app/components/header", () => {
    return function MockHeader() {
        return <div data-testid="mock-header">Header Content</div>;
    };
});

describe('DashboardLayout Component', () => {
    test('renders the layout with sidebar, header and children', () => {
        const testChild = <div data-testid="test-child">Test Child Content</div>;

        render(
            <DashboardLayout>
                {testChild}
            </DashboardLayout>
        );

        // Check if sidebar is rendered
        expect(screen.getByTestId('mock-sidebar')).toBeInTheDocument();

        // Check if header is rendered
        expect(screen.getByTestId('mock-header')).toBeInTheDocument();

        // Check if children are rendered
        expect(screen.getByTestId('test-child')).toBeInTheDocument();
        expect(screen.getByText('Test Child Content')).toBeInTheDocument();

        // Verify main content wrapper is present with correct classes
        const mainElement = screen.getByRole('main');
        expect(mainElement).toHaveClass('flex-1');
        expect(mainElement).toHaveClass('p-4');
    });
});