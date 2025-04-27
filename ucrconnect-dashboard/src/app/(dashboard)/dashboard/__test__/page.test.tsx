import React, { act } from 'react'; // Import act from react instead of react-dom
import { render, screen, waitFor } from '@testing-library/react';
import Dashboard from '../page';

// Mock the components used in Dashboard
jest.mock('../../../components/statCard', () => {
    return function MockStatCard({ title, value, change, bgStyle }) {
        return (
            <div data-testid="stat-card" className={bgStyle || 'default-bg'}>
                <div data-testid="stat-title">{title}</div>
                <div data-testid="stat-value">{value}</div>
                <div data-testid="stat-change">{change}</div>
            </div>
        );
    };
});

jest.mock('next/link', () => {
    return function MockLink({ href, children, passHref }) {
        return (
            <a href={href} data-testid="next-link">
                {children}
            </a>
        );
    };
});

jest.mock('../../../components/charts', () => ({
    PostsChart: () => <div data-testid="posts-chart">Posts Chart</div>,
    ReportsChart: () => <div data-testid="reports-chart">Reports Chart</div>,
    UsersChart: () => <div data-testid="users-chart">Users Chart</div>
}));

// Mock fetch API
const mockDashboardData = [
    { title: 'Usuarios', value: '5,234', change: '+12%', route: '/users' },
    { title: 'Posts', value: '1,234', change: '+5%', route: '/posts' },
    { title: 'Reportes', value: '56', change: '-2%', route: '/reports' }
];

global.fetch = jest.fn(() =>
    Promise.resolve({
        json: () => Promise.resolve(mockDashboardData)
    })
) as jest.Mock;

describe('Dashboard Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders dashboard layout with charts', async () => {
        await act(async () => {
            render(<Dashboard />);
        });

        // Check if the main layout renders
        expect(screen.getByText('Posts por categor\u00EDa')).toBeInTheDocument();
        expect(screen.getByText('Crecimiento de usuarios por mes')).toBeInTheDocument();

        // Check if charts are rendered
        expect(screen.getByTestId('posts-chart')).toBeInTheDocument();
        expect(screen.getByTestId('reports-chart')).toBeInTheDocument();
        expect(screen.getByTestId('users-chart')).toBeInTheDocument();
    });

    test('fetches and displays dashboard stats', async () => {
        await act(async () => {
            render(<Dashboard />);
        });

        // Check if fetch was called
        expect(global.fetch).toHaveBeenCalledWith('/data/dashboardData.json');

        // Wait for stats to be loaded and rendered
        await waitFor(() => {
            const statCards = screen.getAllByTestId('stat-card');
            expect(statCards).toHaveLength(3);
        });

        // Check if stat cards have correct data
        const titles = screen.getAllByTestId('stat-title');
        expect(titles[0]).toHaveTextContent('Usuarios');
        expect(titles[1]).toHaveTextContent('Posts');
        expect(titles[2]).toHaveTextContent('Reportes');

        const values = screen.getAllByTestId('stat-value');
        expect(values[0]).toHaveTextContent('5,234');
        expect(values[1]).toHaveTextContent('1,234');
        expect(values[2]).toHaveTextContent('56');

        const changes = screen.getAllByTestId('stat-change');
        expect(changes[0]).toHaveTextContent('+12%');
        expect(changes[1]).toHaveTextContent('+5%');
        expect(changes[2]).toHaveTextContent('-2%');
    });

    test('applies custom background style to Usuarios card', async () => {
        await act(async () => {
            render(<Dashboard />);
        });

        await waitFor(() => {
            const statCards = screen.getAllByTestId('stat-card');
            // The Usuarios card should have the custom background style
            expect(statCards[0]).toHaveClass('bg-gradient-to-tr');
            expect(statCards[0]).toHaveClass('from-[#249DD8]');
            expect(statCards[0]).toHaveClass('to-[#41ADE7BF]');
            expect(statCards[0]).toHaveClass('text-white');

            // Other cards should have default styling
            expect(statCards[1]).toHaveClass('default-bg');
            expect(statCards[2]).toHaveClass('default-bg');
        });
    });

    test('wraps stat cards with links pointing to correct routes', async () => {
        await act(async () => {
            render(<Dashboard />);
        });

        await waitFor(() => {
            const links = screen.getAllByTestId('next-link');
            expect(links).toHaveLength(3);

            expect(links[0]).toHaveAttribute('href', '/users');
            expect(links[1]).toHaveAttribute('href', '/posts');
            expect(links[2]).toHaveAttribute('href', '/reports');
        });
    });

    test('handles fetch error gracefully', async () => {
        // Mock console.error to prevent test output noise
        const originalConsoleError = console.error;
        console.error = jest.fn();

        // Mock fetch to reject
        global.fetch = jest.fn(() => Promise.reject('API error')) as jest.Mock;

        await act(async () => {
            render(<Dashboard />);
        });

        // Check if error was logged
        expect(console.error).toHaveBeenCalledWith('Error al cargar los datos:', 'API error');

        // Restore console.error
        console.error = originalConsoleError;
    });
});