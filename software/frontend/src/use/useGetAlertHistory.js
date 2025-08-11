// src/use/useGetAlertHistory.js
import { useState, useEffect } from 'react';
import { getAlertHistory } from '../services/alertsService';
import { useErrorHandler } from '../hooks/useErrorHandler';

/**
 * Hook para obtener y manejar el historial de alertas
 * @returns {Object} - Estado y funciones para el historial de alertas
 */
export const useGetAlertHistory = () => {
  const [alertHistory, setAlertHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const { error, handleApiError, clearError } = useErrorHandler();

  /**
   * Carga el historial de alertas desde la API
   */
  const fetchAlertHistory = async () => {
    clearError();
    setLoading(true);
    
    try {
      const data = await getAlertHistory();
      if (data && data.data) {
        const allReadings = data.data;
        const allGeneratedAlerts = [];

        // Generate alerts for each reading, including favorable conditions
        allReadings.forEach((reading, index) => {
          const alertsForReading = generateAlertMessage(reading, allReadings);
          alertsForReading.forEach(alertMsg => {
            allGeneratedAlerts.push({
              fecha: reading.fecha,
              tipo: 'custom', // Or a more specific type if needed
              valor: alertMsg,
              estado: 'enviado'
            });
          });
        });
        
        setAlertHistory(allGeneratedAlerts);
      }
    } catch (err) {
      handleApiError(err);
    } finally {
      setLoading(false);
    }
  };

  // Cargar datos al montar el componente
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