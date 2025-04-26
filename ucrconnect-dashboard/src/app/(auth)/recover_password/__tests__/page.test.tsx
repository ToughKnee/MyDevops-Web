import { render, screen, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RecoverPassword from '@/app/(auth)/recover_password/page'; // ✅ updated path alias

describe('RecoverPassword Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the recover password form', () => {
    render(<RecoverPassword />);

    expect(screen.getByText('UCR Connect')).toBeInTheDocument();
    expect(screen.getByText('Recupera tu contraseña')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Correo electrónico')).toBeInTheDocument();
    expect(screen.getByText('Recuperar contraseña')).toBeInTheDocument();
    expect(screen.getByText('Volver al inicio de sesión')).toBeInTheDocument();
  });

  it('shows an error message for invalid email', async () => {
    render(<RecoverPassword />);

    const emailInput = screen.getByPlaceholderText('Correo electrónico');
    const submitButton = screen.getByText('Recuperar contraseña');

    await act(async () => {
      await userEvent.type(emailInput, 'invalid-email@mail.com');
      await userEvent.click(submitButton);
    });

    expect(await screen.findByText('Por favor, ingresa un correo válido.')).toBeInTheDocument();
  });

  it('shows a success message when the email is valid and the API call succeeds', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      })
    ) as jest.Mock;

    render(<RecoverPassword />);

    const emailInput = screen.getByPlaceholderText('Correo electrónico');
    const submitButton = screen.getByText('Recuperar contraseña');

    await act(async () => {
      await userEvent.type(emailInput, 'test@ucr.ac.cr');
      fireEvent.click(submitButton);
    });

    expect(await screen.findByText('Correo enviado exitosamente.')).toBeInTheDocument();
  });

  it('shows an error message when the API call fails', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
      })
    ) as jest.Mock;

    render(<RecoverPassword />);

    const emailInput = screen.getByPlaceholderText('Correo electrónico');
    const submitButton = screen.getByText('Recuperar contraseña');

    await act(async () => {
      await userEvent.type(emailInput, 'test@ucr.ac.cr');
      fireEvent.click(submitButton);
    });

    expect(await screen.findByText('Hubo un problema al enviar el correo.')).toBeInTheDocument();
  });

  it('shows a server error message when fetch throws an error', async () => {
    global.fetch = jest.fn(() => Promise.reject(new Error('Server error'))) as jest.Mock;

    render(<RecoverPassword />);

    const emailInput = screen.getByPlaceholderText('Correo electrónico');
    const submitButton = screen.getByText('Recuperar contraseña');

    await act(async () => {
      await userEvent.type(emailInput, 'test@ucr.ac.cr');
      fireEvent.click(submitButton);
    });

    expect(await screen.findByText('Error al conectar con el servidor.')).toBeInTheDocument();
  });
});
