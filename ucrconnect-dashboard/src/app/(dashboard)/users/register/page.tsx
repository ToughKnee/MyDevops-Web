'use client';

import { useState } from 'react';
import { useEffect } from 'react';

export default function RegisterUser() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [emailAvailable, setEmailAvailable] = useState<boolean | null>(null);

  const isFormValid =
  formData.name.trim() !== '' &&
  formData.password !== '' &&
  formData.confirmPassword !== '' &&
  formData.password === formData.confirmPassword &&
  emailAvailable === true;

  // Check if email is available
  useEffect(() => {
    setEmailAvailable(null);
    const timeoutId = setTimeout(async () => {
      if (!formData.email) return;
  
      try {
        // Uncomment and adapt the following lines to use the actual API endpoint
          //const res = await fetch(`/api/users/check-email?email=${formData.email}`);
          //const data = await res.json();
          //setEmailAvailable(data.available);

        // Simulating an API call with a timeout
        const res = await new Promise<{ available: boolean }>((resolve) => {
          const yaRegistrados = ['admin@ejemplo.com', 'usuario@correo.com'];
          setTimeout(() => {
            resolve({ available: !yaRegistrados.includes(formData.email.toLowerCase()) });
          }, 500);
        });
  
        setEmailAvailable(res.available);
        //---------------------------------------

      } catch (error) {
        console.error("Error al verificar el correo", error);
        setEmailAvailable(null);
      }
    }, 500); // wait 500ms after the last keystroke
  
    return () => clearTimeout(timeoutId);
  }, [formData.email]);

  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if ((name === "password" || name === "confirmPassword")) {
      const otherPassword = name === "password" ? formData.confirmPassword : formData.password;
  
      if (value && otherPassword && value !== otherPassword) {
        setError("Las contraseñas no coinciden");
      } else {
        setError("");
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }
    try {
      
      // Fetch API to register user
      console.log(formData);
      setSuccessMessage("Usuario registrado correctamente.");
      setFormData({ name: '', email: '', password: '', confirmPassword: '' });
      setError('');

      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (err) {
      setError("Ocurrió un error al registrar el usuario.");
    }
    
  };

  return (
    <div>
      <h2 className="mt-2 text-gray-600">Registrar nuevo usuario</h2>
      <div className="mt-10 w-full sm:w-11/12 md:w-3/4 lg:w-1/3">
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
              className="mt-1 w-full block px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
              className="mt-1 w-full block px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            {formData.email && (
              <p className={`text-sm ${emailAvailable === true ? 'text-green-500' : 'text-red-500'}`}>
                {emailAvailable === true
                  ? 'Correo disponible'
                  : emailAvailable === false
                  ? 'Este correo ya está registrado'
                  : ''}
              </p>
            )}
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
              className="mt-1 w-full block px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirmar Contraseña</label>
            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              placeholder="Confirmar contraseña"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="mt-1 w-full block px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            {error && (
              <p className="text-red-500 text-sm mt-1">{error}</p>
            )}
          </div>

          <div className="flex justify-center">
            <button 
              type="submit" 
              className="mt-2 w-auto py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 cursor-pointer hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!isFormValid}
              title={!isFormValid ? 'Asegurese de completar todos los campos correctamente' : ''}
            >
              Registrar usuario
            </button>
          </div>
          {successMessage && <p className="text-green-600 text-sm mt-2">{successMessage}</p>}
        </form>
      </div>
    </div>
  );
}