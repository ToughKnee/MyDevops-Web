import { render, screen, fireEvent, act } from '@testing-library/react';
import Header from '../header';
import '@testing-library/jest-dom';

// Mock next/navigation
jest.mock('next/navigation', () => ({
    usePathname: jest.fn(),
}));

// Mock next/link
jest.mock('next/link', () => {
    return ({ children, href }: { children: React.ReactNode; href: string }) => {
        return <a href={href}>{children}</a>;
    };
});

describe('Header Component', () => {
    beforeEach(() => {
        // Reset mocks before each test
        jest.clearAllMocks();

        // Mock setTimeout and clearTimeout
        jest.useFakeTimers();

        // Default mock for usePathname
        const { usePathname } = require('next/navigation');
        usePathname.mockReturnValue('/');
    });

    afterEach(() => {
        // Restore timers after each test
        jest.useRealTimers();
    });

    it('displays different section titles based on pathname', () => {
        const { usePathname } = require('next/navigation');

        // Test different paths
        const pathsToTest = [
            { path: '/users', title: 'Usuarios' },
            { path: '/content', title: 'Contenido' },
            { path: '/analytics', title: 'Anal\u00EDticas' },
            { path: '/settings', title: 'Configuraci\u00F3n' },
        ];

        for (const { path, title } of pathsToTest) {
            usePathname.mockReturnValue(path);
            const { unmount } = render(<Header />);
            expect(screen.getByText(title)).toBeInTheDocument();
            unmount();
        }
    });

    it('opens and closes settings dropdown when settings button is clicked', async () => {
        render(<Header />);

        // Settings should not be visible initially
        expect(screen.queryByText('Configuraciones')).not.toBeInTheDocument();

        // Click settings button
        fireEvent.click(screen.getByAltText('Settings'));

        // Fast-forward timers to trigger visibility
        act(() => {
            jest.advanceTimersByTime(50);
        });

        // Settings should now be visible
        expect(screen.getByText('Configuraciones')).toBeInTheDocument();
        expect(screen.getByText('Editar configuraciones')).toBeInTheDocument();

        // Click settings button again to close
        fireEvent.click(screen.getByAltText('Settings'));

        // Fast-forward timers to trigger closing animation
        act(() => {
            jest.advanceTimersByTime(150);
        });

        // Settings should no longer be visible
        expect(screen.queryByText('Configuraciones')).not.toBeInTheDocument();
    });

    it('opens and closes notifications dropdown when notifications button is clicked', async () => {
        render(<Header />);

        // Notifications should not be visible initially
        expect(screen.queryByText('Notifications')).not.toBeInTheDocument();

        // Click notifications button
        fireEvent.click(screen.getByAltText('Notifications'));

        // Fast-forward timers to trigger visibility
        act(() => {
            jest.advanceTimersByTime(50);
        });

        // Notifications should now be visible
        expect(screen.getByText('Notifications')).toBeInTheDocument();
        expect(screen.getByText('Sin notificaciones.')).toBeInTheDocument();

        // Click notifications button again to close
        fireEvent.click(screen.getByAltText('Notifications'));

        // Fast-forward timers to trigger closing animation
        act(() => {
            jest.advanceTimersByTime(150);
        });

        // Notifications should no longer be visible
        expect(screen.queryByText('Notifications')).not.toBeInTheDocument();
    });

    it('closes settings when notifications button is clicked', async () => {
        render(<Header />);

        // Click settings button to open settings
        fireEvent.click(screen.getByAltText('Settings'));

        // Fast-forward timers
        act(() => {
            jest.advanceTimersByTime(50);
        });

        // Settings should be visible
        expect(screen.getByText('Configuraciones')).toBeInTheDocument();

        // Click notifications button
        fireEvent.click(screen.getByAltText('Notifications'));

        // Fast-forward timers for closing settings
        act(() => {
            jest.advanceTimersByTime(150);
        });

        // Fast-forward timers for opening notifications
        act(() => {
            jest.advanceTimersByTime(50);
        });

        // Settings should be closed and notifications should be open
        expect(screen.queryByText('Configuraciones')).not.toBeInTheDocument();
        expect(screen.getByText('Notifications')).toBeInTheDocument();
    });

    it('closes notifications when settings button is clicked', async () => {
        render(<Header />);

        // Click notifications button to open notifications
        fireEvent.click(screen.getByAltText('Notifications'));

        // Fast-forward timers
        act(() => {
            jest.advanceTimersByTime(50);
        });

        // Notifications should be visible
        expect(screen.getByText('Notifications')).toBeInTheDocument();

        // Click settings button
        fireEvent.click(screen.getByAltText('Settings'));

        // Fast-forward timers for closing notifications
        act(() => {
            jest.advanceTimersByTime(150);
        });

        // Fast-forward timers for opening settings
        act(() => {
            jest.advanceTimersByTime(50);
        });

        // Notifications should be closed and settings should be open
        expect(screen.queryByText('Sin notificaciones.')).not.toBeInTheDocument();
        expect(screen.getByText('Configuraciones')).toBeInTheDocument();
    });

    it('has functioning link to profile page', () => {
        render(<Header />);
        const profileLink = screen.getByAltText('profile').closest('a');
        expect(profileLink).toHaveAttribute('href', '/profile');
    });

    it('cleans up timeouts when unmounted', () => {
        const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');

        const { unmount } = render(<Header />);

        // Click both buttons to create timeouts
        fireEvent.click(screen.getByAltText('Settings'));
        fireEvent.click(screen.getByAltText('Notifications'));

        // Unmount component
        unmount();

        // Should clean up timeouts
        expect(clearTimeoutSpy).toHaveBeenCalled();
    });
});