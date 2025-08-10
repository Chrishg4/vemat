// src/components/LoginForm.jsx
import React from 'react';
import { useLogin } from '../use/useLogin';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function LoginForm() {
  const {
    usuario,
    setUsuario,
    contrasena,
    setContrasena,
    error,
    loginExitoso,
    mostrarContrasena,
    handleLogin,
    toggleMostrarContrasena
  } = useLogin();

  return (
    <div className="flex items-center justify-center p-4">
      <div className="relative p-8 rounded-xl shadow-2xl w-full max-w-xl text-gray-200 bg-white/10 backdrop-blur-lg border border-white/20">
        
        <div className="text-center mb-10">
          <p className="text-xl mt-2">Vigilancia Ecológica</p>
          <p className="text-base text-gray-400">Accede al sistema de monitoreo</p>
        </div>

        {loginExitoso && (
          <div className="p-3 mb-4 rounded text-center text-sm font-medium bg-green-600 text-white">
            ¡Login exitoso! Cargando sistema...
          </div>
        )}

        {error && (
          <div className="p-3 mb-4 rounded text-center text-sm font-medium bg-red-600 text-white">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="usuario" className="block text-sm font-medium mb-2">Usuario o Email</label>
            <input
              type="text"
              id="usuario"
              className="w-full p-3 rounded-md bg-white/5 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              required
            />
          </div>
          <div className="mb-4 relative">
            <label htmlFor="contrasena" className="block text-sm font-medium mb-2">Contraseña</label>
            <input
              type={mostrarContrasena ? 'text' : 'password'}
              id="contrasena"
              className="w-full p-3 rounded-md bg-white/5 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              required
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400"
              onClick={toggleMostrarContrasena}
              style={{ top: '60%' }}
            >
              {mostrarContrasena ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <div className="flex items-center justify-between mb-10 text-sm">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="rememberMe"
                className="h-4 w-4 text-blue-500 rounded border-white/20 focus:ring-blue-500 bg-white/5"
              />
              <label htmlFor="rememberMe" className="ml-2">Recordarme</label>
            </div>
            <a href="#" className="text-blue-400 hover:underline">¿Olvidaste tu contraseña?</a>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500/70 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md transition duration-300"
          >
            Iniciar Sesión
          </button>
        </form>

        <div className="mt-12 text-center text-gray-400 text-sm">
          <p className="mb-2 text-gray-300">ITI UTN</p>
          <p>Credenciales de prueba:</p>
          <ul className="list-disc list-inside text-left mx-auto max-w-fit">
            <li>admin@vemat.com / admin123</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
