import { POST } from '../route';
import { NextResponse } from 'next/server';

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
    const response = await POST(mockRequest({
      auth_id: 'test-uid',
      auth_token: 'test-token',
    }));

    expect(response.status).toBe(200);
    expect(response).toEqual(expect.objectContaining({
      message: 'Login successful',
    }));
  });

  it('handles missing required fields', async () => {
    const response = await POST(mockRequest({}));

    expect(response.status).toBe(400);
    expect(response).toEqual(expect.objectContaining({
      message: 'Invalid request',
      details: 'Missing required fields: auth_id and auth_token',
    }));
  });

  it('handles missing auth_id', async () => {
    const response = await POST(mockRequest({
      auth_token: 'test-token',
    }));

    expect(response.status).toBe(400);
    expect(response).toEqual(expect.objectContaining({
      message: 'Invalid request',
      details: 'Missing required fields: auth_id and auth_token',
    }));
  });

  it('handles missing auth_token', async () => {
    const response = await POST(mockRequest({
      auth_id: 'test-uid',
    }));

    expect(response.status).toBe(400);
    expect(response).toEqual(expect.objectContaining({
      message: 'Invalid request',
      details: 'Missing required fields: auth_id and auth_token',
    }));
  });
}); 