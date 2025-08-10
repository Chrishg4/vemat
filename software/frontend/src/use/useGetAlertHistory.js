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
        // Procesamos los datos para identificar alertas
        const alertas = [];
        
        data.data.forEach(reading => {
          // Usar directamente la fecha de la lectura para mantener consistencia con la tabla de lecturas
          ['temperatura', 'humedad', 'co2'].forEach(tipo => {
            // Usar los umbrales correctos según el tipo
            const min = tipo === 'temperatura' ? 20 : 
                       tipo === 'humedad' ? 30 : 300;
            const max = tipo === 'temperatura' ? 30 : 
                       tipo === 'humedad' ? 80 : 1000;
                       
            if (reading[tipo] < min || reading[tipo] > max) {
              alertas.push({
                fecha: reading.fecha, // Usar la misma fecha que en las lecturas
                tipo,
                valor: reading[tipo],
                rangoNormal: tipo === 'temperatura' ? '20-30°C' : 
                             tipo === 'humedad' ? '30-80%' : 
                             '300-1000ppm',
                estado: 'enviado'
              });
            }
          });
        });
        
        setAlertHistory(alertas);
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