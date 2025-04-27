import React from 'react';
import { render } from '@testing-library/react';
import AuthLayout from '../layout';

describe('AuthLayout Component', () => {
    test('renders with correct structure and styling', () => {
        const testChild = <div data-testid="test-child">Test Child Content</div>;

        const { getByTestId, container } = render(
            <AuthLayout>
                {testChild}
            </AuthLayout>
        );

        // Check if the main container div has the correct classes
        const mainDiv = container.firstChild as HTMLElement;
        expect(mainDiv).toHaveClass('min-h-screen');
        expect(mainDiv).toHaveClass('flex');
        expect(mainDiv).toHaveClass('items-center');
        expect(mainDiv).toHaveClass('justify-center');
        expect(mainDiv).toHaveClass('p-4');
        expect(mainDiv).toHaveClass('sm:p-6');

        // Check if children are rendered
        const childElement = getByTestId('test-child');
        expect(childElement).toBeInTheDocument();
        expect(childElement).toHaveTextContent('Test Child Content');
    });

    test('passes children prop correctly', () => {
        // Create multiple children to test proper rendering
        const testChildren = (
            <>
                <div data-testid="child-1">First Child</div>
                <div data-testid="child-2">Second Child</div>
            </>
        );

        const { getByTestId } = render(
            <AuthLayout>
                {testChildren}
            </AuthLayout>
        );

        // Verify both children are rendered
        const firstChild = getByTestId('child-1');
        const secondChild = getByTestId('child-2');

        expect(firstChild).toBeInTheDocument();
        expect(firstChild).toHaveTextContent('First Child');
        expect(secondChild).toBeInTheDocument();
        expect(secondChild).toHaveTextContent('Second Child');
    });
});