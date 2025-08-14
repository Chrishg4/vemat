// src/hooks/useErrorHandler.js
import { useState } from 'react';

/**
 * Hook para manejar errores de forma consistente en la aplicación
 * @returns {Object} Objeto con estado de error y funciones para manejarlo
 */
export const useManejadorErrores = () => {
  const [error, setError] = useState(null);

  /**
   * Establece un mensaje de error
   * @param {string} message - Mensaje de error
   */
  const handleError = (message) => {
    setError(message);
    console.error(message);
  };

  /**
   * Limpia el estado de error
   */
  const clearError = () => {
    setError(null);
  };

  /**
   * Maneja errores de peticiones API
   * @param {Error} error - Objeto de error
   */
  const handleApiError = (error) => {
    const message = error.response?.data?.message || error.message || 'Error desconocido';
    handleError(message);
  };

  return {
    error,
    handleError,
    clearError,
    handleApiError
  };
};