import { render, screen } from '@testing-library/react';
import Users from '@/app/(dashboard)/users/page';
import '@testing-library/jest-dom';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

test('shows title and button with correct link', () => {
  render(<Users />);

  // Title
  expect(screen.getByRole('heading', { name: /users/i })).toBeInTheDocument();

  // Button
  const button = screen.getByRole('button', { name: /registrar nuevo usuario/i });
  expect(button).toBeInTheDocument();

  // Link
  const link = button.closest('a');
  expect(link).toHaveAttribute('href', '/users/register');
});
