beforeAll(() => {
  global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PostsChart, ReportsChart, UsersChart } from '../charts';

global.fetch = jest.fn();

const mockFetch = (data: any) => {
  (fetch as jest.Mock).mockResolvedValueOnce({
    json: async () => data,
  });
};

describe('Charts Component Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // POSTS CHART
  it('PostsChart - should display loading initially', () => {
    (fetch as jest.Mock).mockImplementation(() => new Promise(() => {}));
    render(<PostsChart />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('PostsChart - should display error on fetch failure', async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('API failed'));
    render(<PostsChart />);
    await waitFor(() =>
      expect(screen.getByText('Failed to load data')).toBeInTheDocument()
    );
  });

  it('PostsChart - should show empty message for no data', async () => {
    mockFetch({ dataPosts: [] });
    render(<PostsChart />);
    await waitFor(() =>
      expect(screen.getByText('No data available')).toBeInTheDocument()
    );
  });

  // REPORTS CHART
  it('ReportsChart - should display loading initially', () => {
    (fetch as jest.Mock).mockImplementation(() => new Promise(() => {}));
    render(<ReportsChart />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('ReportsChart - should display error on fetch failure', async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('API failed'));
    render(<ReportsChart />);
    await waitFor(() =>
      expect(screen.getByText('Failed to load data')).toBeInTheDocument()
    );
  });

  it('ReportsChart - should show empty message for no data', async () => {
    mockFetch({ dataReports: [] });
    render(<ReportsChart />);
    await waitFor(() =>
      expect(screen.getByText('No data available')).toBeInTheDocument()
    );
  });

  // USERS CHART
  it('UsersChart - should display loading initially', () => {
    (fetch as jest.Mock).mockImplementation(() => new Promise(() => {}));
    render(<UsersChart />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('UsersChart - should display error on fetch failure', async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('API failed'));
    render(<UsersChart />);
    await waitFor(() =>
      expect(screen.getByText('Failed to load data')).toBeInTheDocument()
    );
  });

  it('UsersChart - should show empty message for no data', async () => {
    mockFetch({ dataUsers: [] });
    render(<UsersChart />);
    await waitFor(() =>
      expect(screen.getByText('No data available')).toBeInTheDocument()
    );
  });
});
