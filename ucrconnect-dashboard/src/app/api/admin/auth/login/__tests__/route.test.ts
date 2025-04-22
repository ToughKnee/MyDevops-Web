import { POST } from '../route';
import { getDbClient } from '@/lib/db';

// Mock console methods
const originalConsole = { ...console };
beforeAll(() => {
  console.log = jest.fn();
  console.error = jest.fn();
});

afterAll(() => {
  console.log = originalConsole.log;
  console.error = originalConsole.error;
});

// Mock the database client
jest.mock('@/lib/db', () => ({
  getDbClient: jest.fn(),
}));

// Mock the NextResponse
jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn().mockImplementation((data, options) => ({
      ...data,
      status: options?.status || 200,
      cookies: {
        set: jest.fn(),
        get: jest.fn(),
      },
    })),
  },
}));

describe('Login API Route', () => {
  const mockRequest = (body: any) => {
    return {
      json: () => Promise.resolve(body),
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      url: 'http://localhost:3000/api/admin/auth/login',
      method: 'POST',
      // Add other required properties
      cache: 'default' as RequestCache,
      credentials: 'same-origin' as RequestCredentials,
      destination: '' as RequestDestination,
      integrity: '',
      keepalive: false,
      mode: 'cors' as RequestMode,
      redirect: 'follow' as RequestRedirect,
      referrer: '',
      referrerPolicy: 'no-referrer' as ReferrerPolicy,
      signal: new AbortController().signal,
      body: null,
      bodyUsed: false,
      clone: jest.fn(),
      arrayBuffer: jest.fn(),
      blob: jest.fn(),
      formData: jest.fn(),
      text: jest.fn(),
      bytes: jest.fn(),
    };
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('handles successful login', async () => {
    // Mock database query result
    const mockQuery = jest.fn().mockResolvedValue({
      rows: [{ id: 'user-123' }],
    });

    (getDbClient as jest.Mock).mockResolvedValue({
      query: mockQuery,
    });

    const response = await POST(mockRequest({
      auth_id: 'firebase-uid',
      auth_token: 'firebase-token',
    }));

    expect(response.status).toBe(200);
    expect(response).toEqual(expect.objectContaining({
      message: 'Login successful',
    }));
  });

  it('handles user not found', async () => {
    // Mock database query result with no rows
    const mockQuery = jest.fn().mockResolvedValue({
      rows: [],
    });

    (getDbClient as jest.Mock).mockResolvedValue({
      query: mockQuery,
    });

    const response = await POST(mockRequest({
      auth_id: 'non-existent-uid',
      auth_token: 'firebase-token',
    }));

    expect(response.status).toBe(404);
    expect(response).toEqual(expect.objectContaining({
      message: 'User not found',
      details: 'User must be created in the database first',
    }));
  });

  it('handles database error', async () => {
    // Mock database error
    const mockQuery = jest.fn().mockRejectedValue(new Error('Database connection failed'));

    (getDbClient as jest.Mock).mockResolvedValue({
      query: mockQuery,
    });

    const response = await POST(mockRequest({
      auth_id: 'firebase-uid',
      auth_token: 'firebase-token',
    }));

    expect(response.status).toBe(500);
    expect(response).toEqual(expect.objectContaining({
      message: 'Database error',
      details: 'Failed to process authentication',
    }));
  });

  it('handles undefined database result', async () => {
    // Mock database query to return undefined
    const mockQuery = jest.fn().mockResolvedValue(undefined);

    (getDbClient as jest.Mock).mockResolvedValue({
      query: mockQuery,
    });

    const response = await POST(mockRequest({
      auth_id: 'firebase-uid',
      auth_token: 'firebase-token',
    }));

    expect(response.status).toBe(404);
    expect(response).toEqual(expect.objectContaining({
      message: 'User not found',
      details: 'User must be created in the database first',
    }));
  });

  it('handles missing required fields', async () => {
    // Mock database client to not be called
    (getDbClient as jest.Mock).mockResolvedValue({
      query: jest.fn(),
    });

    const response = await POST(mockRequest({}));

    expect(response.status).toBe(400);
    expect(response).toEqual(expect.objectContaining({
      message: 'Invalid request',
      details: 'Missing required fields: auth_id and auth_token',
    }));
  });

  it('handles missing auth_id', async () => {
    // Mock database client to not be called
    (getDbClient as jest.Mock).mockResolvedValue({
      query: jest.fn(),
    });

    const response = await POST(mockRequest({
      auth_token: 'firebase-token',
    }));

    expect(response.status).toBe(400);
    expect(response).toEqual(expect.objectContaining({
      message: 'Invalid request',
      details: 'Missing required fields: auth_id and auth_token',
    }));
  });

  it('handles missing auth_token', async () => {
    // Mock database client to not be called
    (getDbClient as jest.Mock).mockResolvedValue({
      query: jest.fn(),
    });

    const response = await POST(mockRequest({
      auth_id: 'firebase-uid',
    }));

    expect(response.status).toBe(400);
    expect(response).toEqual(expect.objectContaining({
      message: 'Invalid request',
      details: 'Missing required fields: auth_id and auth_token',
    }));
  });
}); 