// src/use/useLogin.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContextoAuth } from '../context/contextoAuth';
import { login } from '../services/servicioAuth';
import { useManejadorErrores } from '../hooks/useManejadorErrores';

/**
 * Hook para manejar la lógica de inicio de sesión
 * @returns {Object} - Estado y funciones para el proceso de login
 */
export const useInicioSesion = () => {
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [loginExitoso, setLoginExitoso] = useState(false);
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const navigate = useNavigate();
  const { login: authLogin } = useContextoAuth();
  const { error, handleError, clearError } = useManejadorErrores();

  /**
   * Maneja el envío del formulario de login
   * @param {Event} e - Evento del formulario
   */
  const handleLogin = async (e) => {
    e.preventDefault();
    clearError();
    setLoginExitoso(false);

    try {
      const user = await login(usuario, contrasena);
      setLoginExitoso(true);
      authLogin(user.username);
      
      // Redirigir después de un breve delay para mostrar el mensaje de éxito
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (error) {
      handleError(error.message);
    }
  };

  /**
   * Alterna la visibilidad de la contraseña
   */
  const toggleMostrarContrasena = () => {
    setMostrarContrasena(!mostrarContrasena);
  };

  return {
    usuario,
    setUsuario,
    contrasena,
    setContrasena,
    error,
    loginExitoso,
    mostrarContrasena,
    handleLogin,
    toggleMostrarContrasena
  };
};