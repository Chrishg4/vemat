// src/use/useGetReadings.js
import { useState, useEffect } from 'react';
import { getAllReadings, getLatestReading } from '../services/servicioLecturas';
import { useManejadorErrores } from '../hooks/useManejadorErrores';
import { sendAlertEmail } from '../services/servicioAlertas';

/**
 * Hook para obtener y manejar las lecturas de datos
 * @param {boolean} autoRefresh - Si debe refrescar automáticamente
 * @param {number} refreshInterval - Intervalo de refresco en ms
 * @returns {Object} - Estado y funciones para las lecturas
 */
export const useObtenerLecturas = (autoRefresh = true, refreshInterval = 3600000) => { // Aumentado a 1 hora
  const [latest, setLatest] = useState({});
  const [data, setData] = useState([]);
  const [alertHistory, setAlertHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastProcessedId, setLastProcessedId] = useState(null); // Para rastrear la última lectura procesada
  const { error, handleApiError, clearError } = useManejadorErrores();

  /**
   * Verifica y envía alertas si es necesario
   * @param {Object} reading - Lectura a verificar
   * @param {Array} allReadings - Todas las lecturas disponibles
   */
  const checkAndSendAlerts = async (reading, allReadings) => {
    // Verificar si esta lectura ya ha sido procesada para alertas
    if (reading.id === lastProcessedId) {
      console.log('Esta lectura ya fue procesada para alertas');
      return;
    }
    
    try {
      await sendAlertEmail(reading, allReadings);
      
      // Actualizar el historial de alertas (assuming sendAlertEmail returns something useful or we just log success)
      // For now, just log success or handle error
      console.log('Alerta de condiciones favorables procesada.');
      
    } catch (error) {
      console.error('Error al procesar alerta de condiciones favorables:', error);
    }
    
    // Marcar esta lectura como procesada
    setLastProcessedId(reading.id);
  };

  /**
   * Carga los datos desde la API
   */
  const fetchData = async () => {
    clearError();
    setLoading(true);
    
    try {
      const allReadings = await getAllReadings();
      const latestReading = await getLatestReading();
      let processedAllReadings = []; // Initialize here
      
      // Expects 'id_nodo' to be present in each reading object from the API.
      // If 'id_nodo' is not displayed, verify the API response structure.
      if (Array.isArray(allReadings) && allReadings.length > 0) {
        // Determinar el año más reciente en los datos
        const latestYear = Math.max(...allReadings.map(reading => new Date(reading.fecha).getFullYear()));

        // Filtrar los datos para incluir solo el año más reciente
        const filteredReadings = allReadings.filter(reading => new Date(reading.fecha).getFullYear() === latestYear);

        processedAllReadings = filteredReadings.map(reading => ({
          ...reading,
          acustica: reading.sonido // Map 'sonido' from API to 'acustica'
        }));
        setData([...processedAllReadings].reverse()); // orden descendente
      }
      
      if (latestReading) {
        // Create a new object with 'acustica' property
        const processedLatestReading = {
          ...latestReading,
          acustica: latestReading.sonido // Map 'sonido' from API to 'acustica'
        };

        // Verificar si hay una nueva lectura comparando con la actual
        const isNewReading = !latest.id || latest.id !== processedLatestReading.id;
        
        setLatest(processedLatestReading);
        
        // Solo enviar alertas si es una nueva lectura
        if (isNewReading) {
          await checkAndSendAlerts(processedLatestReading, processedAllReadings);
        }
      }
    } catch (err) {
      handleApiError(err);
    } finally {
      setLoading(false);
    }
  };

  // Configurar refresco automático
  useEffect(() => {
    fetchData(); // llamada inicial

    let interval;
    if (autoRefresh) {
      interval = setInterval(() => {
        fetchData();
      }, refreshInterval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh, refreshInterval]);

  return {
    latest,
    data,
    alertHistory,
    loading,
    error,
    refreshData: fetchData
  };
};