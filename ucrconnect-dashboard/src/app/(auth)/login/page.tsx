'use client';

import Link from 'next/link';

export default function Login() {
  return (
    <div className="relative w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-md">
      <div className="absolute -top-20 left-0 right-0 flex justify-center items-center h-32">
        <img src="/images/logos/login.svg" alt="UCRConnect" className="w-24 h-24 object-contain" />
      </div>
      <div className="text-center pt-8">
        <h1 className="text-3xl font-bold text-[#204C6F]">UCRConnect</h1>
        <p className="mt-2 text-blue-DEFAULT">Inicie sesión en su cuenta</p>
      </div>
        
      <form className="mt-8 space-y-6">
        <div>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Correo electrónico"
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-[#2980B9] focus:border-[#2980B9]"
          />
        </div>
          
        <div>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Contraseña"
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-[#2980B9] focus:border-[#2980B9]"
          />
        </div>
          
        <div>
          <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-gradient-to-r from-[#204C6F] to-[#2980B9] hover:from-[#1a3d58] hover:to-[#226a96] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Ingresar
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