import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import Login from '../page';

// Mock Firebase auth
jest.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: jest.fn(),
}));

// Mock the auth object
jest.mock('@/lib/firebase', () => ({
  auth: {},
}));

describe('Login Page', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('renders login form correctly', () => {
    render(<Login />);
    
    // Check if all elements are present
    expect(screen.getByPlaceholderText('Correo electrónico')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Contraseña')).toBeInTheDocument();
    expect(screen.getByText('Ingresar')).toBeInTheDocument();
  });

  it('handles successful login', async () => {
    // Mock successful Firebase authentication
    const mockUser = {
      uid: 'test-uid',
      email: 'test@example.com',
      displayName: 'Test User',
      getIdToken: jest.fn().mockResolvedValue('mock-token'),
    };
    
    (signInWithEmailAndPassword as jest.Mock).mockResolvedValue({
      user: mockUser,
    });

    // Mock fetch for the API call
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ message: 'Login successful' }),
    });

    render(<Login />);

    // Fill in the form
    fireEvent.change(screen.getByPlaceholderText('Correo electrónico'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Contraseña'), {
      target: { value: 'password123' },
    });

    // Submit the form
    fireEvent.click(screen.getByText('Ingresar'));

    // Wait for the loading state
    await waitFor(() => {
      expect(screen.getByText('Ingresando...')).toBeInTheDocument();
    });

    // Verify Firebase auth was called
    expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
      auth,
      'test@example.com',
      'password123'
    );

    // Verify API call was made
    expect(global.fetch).toHaveBeenCalledWith('/api/admin/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer mock-token',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        full_name: 'Test User',
        auth_id: 'test-uid',
        auth_token: 'mock-token',
      }),
    });
  });

  it('handles login error', async () => {
    // Mock Firebase authentication error
    (signInWithEmailAndPassword as jest.Mock).mockRejectedValue(
      new Error('Invalid credentials')
    );

    render(<Login />);

    // Fill in the form
    fireEvent.change(screen.getByPlaceholderText('Correo electrónico'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Contraseña'), {
      target: { value: 'wrongpassword' },
    });

    // Submit the form
    fireEvent.click(screen.getByText('Ingresar'));

    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText('Ha ocurrido un error durante el inicio de sesión.')).toBeInTheDocument();
    });
  });

  it('handles API error', async () => {
    // Mock successful Firebase authentication
    const mockUser = {
      uid: 'test-uid',
      email: 'test@example.com',
      displayName: 'Test User',
      getIdToken: jest.fn().mockResolvedValue('mock-token'),
    };
    
    (signInWithEmailAndPassword as jest.Mock).mockResolvedValue({
      user: mockUser,
    });

    // Mock failed API response
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ message: 'Invalid request', details: 'Missing required fields' }),
    });

    render(<Login />);

    // Fill in the form
    fireEvent.change(screen.getByPlaceholderText('Correo electrónico'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Contraseña'), {
      target: { value: 'password123' },
    });

    // Submit the form
    fireEvent.click(screen.getByText('Ingresar'));

    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText('Ha ocurrido un error durante el inicio de sesión.')).toBeInTheDocument();
    });
  });
}); 