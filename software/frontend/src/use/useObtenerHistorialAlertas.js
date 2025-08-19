// src/use/useObtenerHistorialAlertas.js
import { useState, useEffect } from 'react';

import { useManejadorErrores } from '../hooks/useManejadorErrores';

export const useObtenerHistorialAlertas = () => {
  const [alertHistory, setAlertHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const { error, handleApiError, clearError } = useManejadorErrores();

  const fetchAlertHistory = async () => {
    clearError();
    setLoading(true);
    try {
      const response = await fetch('/api/datosAlertas');
      if (!response.ok) throw new Error('Error al obtener historial de alertas');
      const data = await response.json();
      // El backend responde { success, data, total }
      setAlertHistory(Array.isArray(data?.data) ? data.data : []);
    } catch (err) {
      handleApiError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlertHistory();
  }, []);

  return {
    alertHistory,
    loading,
    error,
    refreshAlertHistory: fetchAlertHistory
  };
};
