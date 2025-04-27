import { NextRequest, NextResponse } from 'next/server';
import { middleware } from '../middleware';

// Mock NextResponse
jest.mock('next/server', () => ({
  NextResponse: {
    redirect: jest.fn((url) => ({ url })),
    next: jest.fn(() => ({})),
  },
}));

describe('Middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should redirect to login when accessing protected route without token', () => {
    const request = {
      nextUrl: { pathname: '/dashboard' },
      cookies: { get: jest.fn().mockReturnValue(null) },
      url: 'http://localhost:3000/dashboard',
    } as unknown as NextRequest;

    middleware(request);

    expect(NextResponse.redirect).toHaveBeenCalledWith(
      new URL('/login', 'http://localhost:3000/dashboard')
    );
  });

  it('should allow access to protected route with valid token', () => {
    const request = {
      nextUrl: { pathname: '/dashboard' },
      cookies: { get: jest.fn().mockReturnValue({ value: 'valid-token' }) },
      url: 'http://localhost:3000/dashboard',
    } as unknown as NextRequest;

    middleware(request);

    expect(NextResponse.next).toHaveBeenCalled();
  });

  it('should redirect to dashboard when accessing login with valid token', () => {
    const request = {
      nextUrl: { pathname: '/login' },
      cookies: { get: jest.fn().mockReturnValue({ value: 'valid-token' }) },
      url: 'http://localhost:3000/login',
    } as unknown as NextRequest;

    middleware(request);

    expect(NextResponse.redirect).toHaveBeenCalledWith(
      new URL('/', 'http://localhost:3000/login')
    );
  });

  it('should allow access to login page without token', () => {
    const request = {
      nextUrl: { pathname: '/login' },
      cookies: { get: jest.fn().mockReturnValue(null) },
      url: 'http://localhost:3000/login',
    } as unknown as NextRequest;

    middleware(request);

    expect(NextResponse.next).toHaveBeenCalled();
  });

  it('should allow access to public routes without token', () => {
    const request = {
      nextUrl: { pathname: '/public-route' },
      cookies: { get: jest.fn().mockReturnValue(null) },
      url: 'http://localhost:3000/public-route',
    } as unknown as NextRequest;

    middleware(request);

    expect(NextResponse.next).toHaveBeenCalled();
  });
}); 