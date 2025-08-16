// src/components/formularioInicioSesion.jsx
import React, { useState, useEffect } from 'react';
import { useInicioSesion } from '../use/useInicioSesion';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { MdCheckCircle, MdError } from 'react-icons/md';

export default function FormularioInicioSesion() {
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
  } = useInicioSesion();

  // Toaster state
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState(''); // 'success' | 'error'
  const [toastMsg, setToastMsg] = useState('');

  useEffect(() => {
    if (loginExitoso) {
      setToastType('success');
      setToastMsg('¡Login exitoso! Cargando sistema...');
      setShowToast(true);
    } else if (error) {
      setToastType('error');
      setToastMsg(error);
      setShowToast(true);
    }
  }, [loginExitoso, error]);
  return (
    <div className="flex items-center justify-center min-h-screen">
      {/* Toaster flotante arriba derecha */}
      {showToast && (
        <div className={`fixed top-6 right-8 z-50 min-w-[260px] p-3 rounded-xl shadow-xl flex items-center gap-3 ${toastType === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'} animate-fade-in`}>
          <span className="text-2xl">
            {toastType === 'success' ? <MdCheckCircle /> : <MdError />}
          </span>
          <span className="font-semibold text-base">{toastMsg}</span>
          <button
            className="ml-auto text-white text-lg font-bold bg-transparent hover:text-red-400 focus:outline-none"
            onClick={() => setShowToast(false)}
            aria-label="Cerrar notificación"
          >×</button>
        </div>
      )}
      <div className="relative py-10 px-12 rounded-3xl shadow-2xl w-full max-w-xl text-gray-200 bg-white/10 backdrop-blur-lg border border-white/20 flex flex-col justify-center">
  <div className="flex flex-row items-center justify-between mb-2">
          <div className="text-left">
            <p className="text-4xl font-bold text-black-400 mb-0 mt-0">¡Bienvenido!</p>
            <p className="text-base text-gray-400 mt-0 mb-0">Accede al sistema de monitoreo</p>
          </div>
          <div className="flex-shrink-0 ml-4">
            <img src="/vemat3.png" alt="Logo VEMAT" style={{ width: '170px', height: 'auto' }} />
          </div>
        </div>

  {/* Mensajes ahora se muestran como toaster flotante */}

        <form onSubmit={handleLogin} className="mt-8">
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
          <div className="flex items-center justify-between mb-6 text-sm">
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
            className="w-full bg-blue-500/70 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-300"
          >
            Iniciar Sesión
          </button>

        </form>
      </div>
    </div>
  );
}
