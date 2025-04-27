import { NextResponse } from 'next/server';
import { POST } from '../route';
import { TextEncoder, TextDecoder } from 'text-encoding';

// Set up TextEncoder and TextDecoder in the global scope
if (typeof global.TextEncoder === 'undefined') {
    global.TextEncoder = TextEncoder;
    global.TextDecoder = TextDecoder;
}

// Mock console.error
global.console.error = jest.fn();

// Mock NextResponse
jest.mock('next/server', () => ({
    NextResponse: {
        json: jest.fn().mockImplementation((data, options) => {
            const response = {
                ...data,
                status: options?.status || 200
            };
            
            // Only add cookies property for successful responses
            if (options?.status !== 500) {
                response.cookies = {
                    set: jest.fn()
                };
            }
            
            return response;
        })
    }
}));

describe('Logout API Route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully logout and clear the access token cookie', async () => {
    const response = await POST();
    
    // Verify the response message
    expect(response).toEqual({
      message: 'Logged out successfully',
      cookies: expect.any(Object),
      status: 200
    });

    // Verify the cookie was set with correct options
    expect(response.cookies.set).toHaveBeenCalledWith('access_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 0
    });
  });

  it('should handle errors and return 500 status', async () => {
    // Mock NextResponse.json to throw an error
    jest.spyOn(NextResponse, 'json').mockImplementationOnce(() => {
      throw new Error('Test error');
    });

    const response = await POST();
    
    // Verify error response
    expect(response).toEqual({
      message: 'Internal server error',
      status: 500
    });

    // Verify console.error was called with the error
    expect(console.error).toHaveBeenCalledWith('Error in logout route:', expect.any(Error));
  });

  describe('Cookie Security Settings', () => {
    const originalEnv = process.env;

    beforeEach(() => {
      jest.resetModules();
      process.env = { ...originalEnv };
    });

    afterEach(() => {
      process.env = originalEnv;
    });

    it('should set secure cookie in production environment', async () => {
      process.env = { ...originalEnv, NODE_ENV: 'production' };
      
      const response = await POST();
      
      expect(response.cookies.set).toHaveBeenCalledWith(
        'access_token',
        '',
        expect.objectContaining({
          secure: true
        })
      );
    });

    it('should not set secure cookie in development environment', async () => {
      process.env = { ...originalEnv, NODE_ENV: 'development' };
      
      const response = await POST();
      
      expect(response.cookies.set).toHaveBeenCalledWith(
        'access_token',
        '',
        expect.objectContaining({
          secure: false
        })
      );
    });
  });
}); 