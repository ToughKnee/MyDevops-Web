import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Request body:', body);
    
    // Validate required fields
    if (!body.auth_id || !body.auth_token) {
      return NextResponse.json(
        { 
          message: 'Invalid request',
          details: 'Missing required fields: auth_id and auth_token'
        },
        { status: 400 }
      );
    }

    const successResponse = NextResponse.json({ message: 'Login successful' });
    
    // Set the Firebase token as an HTTP-only cookie
    successResponse.cookies.set('access_token', body.auth_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 // 24 hours
    });

    return successResponse;
  } catch (error) {
    console.error('Error in login route:', error);
    return NextResponse.json(
      { 
        message: 'Internal server error', 
        error: error instanceof Error ? error.message : 'Unknown error',
        details: 'An unexpected error occurred while processing your request'
      },
      { status: 500 }
    );
  }
} 