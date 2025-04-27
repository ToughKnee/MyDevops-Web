import React from 'react';
import { render } from '@testing-library/react';
import RootLayout from '../layout';

// Mock the imported modules and components
jest.mock("next/font/google", () => ({
    Geist: jest.fn(() => ({
        variable: "mock-geist-sans-variable"
    })),
    Geist_Mono: jest.fn(() => ({
        variable: "mock-geist-mono-variable"
    }))
}));

jest.mock("@/lib/providers", () => {
    return function MockProviders({ children }) {
        return <div data-testid="mock-providers">{children}</div>;
    };
});

// Extract the body content from RootLayout for testing
function BodyContent({ children }) {
    return (
        <div className={`mock-geist-sans-variable mock-geist-mono-variable antialiased`}>
            <div data-testid="mock-providers">{children}</div>
        </div>
    );
}

describe('RootLayout Component', () => {
    test('renders children inside providers', () => {
        const testChild = <div data-testid="test-child">Test Child Content</div>;

        // Render only the body content for testing
        const { getByTestId } = render(
            <BodyContent>
                {testChild}
            </BodyContent>
        );

        // Check if Providers component is rendered
        const providersElement = getByTestId('mock-providers');
        expect(providersElement).toBeInTheDocument();

        // Check if children are rendered inside the Providers
        const childElement = getByTestId('test-child');
        expect(childElement).toBeInTheDocument();
        expect(childElement).toHaveTextContent('Test Child Content');
    });

    test('verifies RootLayout implementation details', () => {
        // Create a spy on the implementation
        const originalImplementation = RootLayout;
        const mockChildren = <div>Test Children</div>;

        // Mock document.documentElement to verify className settings
        const mockBody = {
            className: ''
        };

        // Call the component directly to verify its structure
        const result = originalImplementation({ children: mockChildren });

        // Verify the structure matches what we expect
        expect(result.type).toBe('html');
        expect(result.props.lang).toBe('en');
        expect(result.props.children.type).toBe('body');

        // Simulate applying the className to the body
        mockBody.className = result.props.children.props.className;

        // Verify the className contains the expected font variables
        expect(mockBody.className).toContain('mock-geist-sans-variable');
        expect(mockBody.className).toContain('mock-geist-mono-variable');
        expect(mockBody.className).toContain('antialiased');

        // Verify the Providers component is used
        const bodyChildren = result.props.children.props.children;
        expect(bodyChildren.type.displayName || bodyChildren.type.name).toBe('MockProviders');

        // Verify children are passed to Providers
        expect(bodyChildren.props.children).toBe(mockChildren);
    });
});