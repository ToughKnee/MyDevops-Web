'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function RecoverPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar el correo
    const emailRegex = /^[^\s@]+@ucr\.ac\.cr$/;
    if (!emailRegex.test(email)) {
      setError('Por favor, ingresa un correo válido.');
      return;
    }

    setError(''); 

    try {
      // TODO: Usar endpoint real
      const response = await fetch('/api/recover-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setMessage('Correo enviado exitosamente.');
      } else {
        setError('Hubo un problema al enviar el correo.');
      }
    } catch (err) {
      setError('Error al conectar con el servidor.');
    }
  };

  return (
    <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-blue-950">UCRConnect</h1>
        <p className="mt-2 text-gray-600">Recupera tu contraseña</p>
      </div>

      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Correo electrónico
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
        {message && <p className="text-sm text-green-600">{message}</p>}

        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Recuperar contraseña
          </button>
        </div>
      </form>

      <div className="text-center mt-4">
        <Link href="/login" className="text-sm text-blue-600 hover:text-blue-800">
          Ir al dashboard
        </Link>
      </div>
    </div>
  );
}