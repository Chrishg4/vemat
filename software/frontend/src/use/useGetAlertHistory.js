// src/use/useGetAlertHistory.js
import { useState, useEffect } from 'react';
import { getAlertHistory, checkAndGenerateFavorableConditionsAlert } from '../services/alertsService';
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
      const response = await getAlertHistory(); 
      if (response && response.data) {
        const rawReadings = response.data; // Assuming response.data is an array of raw reading objects
        const processedAlerts = [];

        // Iterate through raw readings and generate alerts
        // We need to pass all readings to checkAndGenerateFavorableConditionsAlert
        // This might require fetching all readings if getAlertHistory only returns a subset
        // For now, let's assume rawReadings contains enough context or we'll adjust
        
        // A more robust solution would involve the backend returning pre-processed alerts
        // or a dedicated endpoint for historical alerts.
        // For now, we'll re-process on the frontend based on the current logic.

        // To correctly check the last 9 measurements for each reading,
        // we need to pass the full array of readings to checkAndGenerateFavorableConditionsAlert.
        // This means we need to ensure rawReadings is sorted by date.
        const sortedReadings = [...rawReadings].sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());

        for (let i = 0; i < sortedReadings.length; i++) {
          // For each reading, consider it as the latest and check the preceding 8 readings
          const relevantReadings = sortedReadings.slice(Math.max(0, i - 8), i + 1);
          const favorableAlertMessage = checkAndGenerateFavorableConditionsAlert(relevantReadings);

          if (favorableAlertMessage) {
            processedAlerts.push({
              fecha: sortedReadings[i].fecha, // Use the date of the reading that triggered the alert
              tipo: 'Condiciones Favorables',
              valor: favorableAlertMessage,
              rangoNormal: 'Ver detalles', // Or a more descriptive text
              estado: 'enviado'
            });
          }
        }
        setAlertHistory(processedAlerts);
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