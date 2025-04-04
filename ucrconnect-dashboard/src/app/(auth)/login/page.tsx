'use client';

import Link from 'next/link';

export default function Login() {
  return (
    <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-blue-950">UCRConnect</h1>
        <p className="mt-2 text-gray-600">Inicia sesión en tu cuenta</p>
      </div>
        
      <form className="mt-8 space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700"> Correo electrónico </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
          
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700"> Contraseña </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
          
        <div>
          <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Iniciar sesión
          </button>
        </div>
      </form>
        
        <div className="text-center mt-4">
          <Link href="/" className="text-sm text-blue-600 hover:text-blue-800">
            Ir al dashboard
          </Link>
        </div>
    </div>
  );
} 