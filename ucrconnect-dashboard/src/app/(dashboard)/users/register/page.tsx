'use client';

import { useState } from 'react';

export default function RegisterUser() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Fetch API to register user
    console.log(formData);
  };

  return (
    <div>
      <h2 className="mt-2 text-gray-600">Registrar nuevo usuario</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-gray-800">
        <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700"> Nombre </label>
            <input
            id="name"
            name="name"
            type="text"
            placeholder="Nombre"
            value={formData.name}
            onChange={handleChange}
            required
            className="mt-1 block px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
        </div>
        <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700"> Correo electrónico </label>
            <input
            id="email"
            name="email"
            type="email"
            placeholder="Correo electrónico"
            value={formData.email}
            onChange={handleChange}
            required
            className="mt-1 block px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
        </div>
        <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700"> Contraseña </label>  
            <input
            id="password"
            name="password"
            type="password"
            placeholder="Contraseña"
            value={formData.password}
            onChange={handleChange}
            required
            className="mt-1 block px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
        </div>

        <button type="submit" className="w-auto py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          Registrarse
        </button>
      </form>
    </div>
  );
}