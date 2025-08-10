// src/use/useGetReadings.js
import { useState, useEffect } from 'react';
import { getAllReadings, getLatestReading } from '../services/readingsService';
import { useErrorHandler } from '../hooks/useErrorHandler';
import { sendAlertEmail, isOutOfRange } from '../services/alertsService';

/**
 * Hook para obtener y manejar las lecturas de datos
 * @param {boolean} autoRefresh - Si debe refrescar automáticamente
 * @param {number} refreshInterval - Intervalo de refresco en ms
 * @returns {Object} - Estado y funciones para las lecturas
 */
export const useGetReadings = (autoRefresh = true, refreshInterval = 3600000) => { // Aumentado a 1 hora
  const [latest, setLatest] = useState({});
  const [data, setData] = useState([]);
  const [alertHistory, setAlertHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastProcessedId, setLastProcessedId] = useState(null); // Para rastrear la última lectura procesada
  const { error, handleApiError, clearError } = useErrorHandler();

  /**
   * Verifica y envía alertas si es necesario
   * @param {Object} reading - Lectura a verificar
   */
  const checkAndSendAlerts = async (reading) => {
    // Verificar si esta lectura ya ha sido procesada para alertas
    if (reading.id === lastProcessedId) {
      console.log('Esta lectura ya fue procesada para alertas');
      return;
    }
    
    // Usar los umbrales correctos para cada tipo
    const alertsToSend = ['temperatura', 'humedad', 'co2']
      .filter(type => isOutOfRange(reading[type], type))
      .map(type => {
        return {
          fecha: reading.fecha, // Usar la misma fecha que en las lecturas
          tipo: type,
          valor: reading[type],
          rangoNormal: type === 'temperatura' ? '20-30°C' : 
                      type === 'humedad' ? '30-80%' : 
                      '300-1000ppm',
          estado: 'pendiente'
        };
      });

    if (alertsToSend.length > 0) {
      try {
        await sendAlertEmail(reading);
        
        // Actualizar el estado de las alertas a 'enviado'
        const alertasConEstado = alertsToSend.map(alerta => ({
          ...alerta,
          estado: 'enviado'
        }));

        // Actualizar el historial de alertas
        setAlertHistory(prev => [...alertasConEstado, ...prev]);
      } catch (error) {
        const alertasConError = alertsToSend.map(alerta => ({
          ...alerta,
          estado: 'error'
        }));
        
        setAlertHistory(prev => [...alertasConError, ...prev]);
      }
      
      // Marcar esta lectura como procesada
      setLastProcessedId(reading.id);
    }
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
      
      if (Array.isArray(allReadings) && allReadings.length > 0) {
        setData([...allReadings].reverse()); // orden descendente
      }
      
      if (latestReading) {
        // Verificar si hay una nueva lectura comparando con la actual
        const isNewReading = !latest.id || latest.id !== latestReading.id;
        
        setLatest(latestReading);
        
        // Solo enviar alertas si es una nueva lectura
        if (isNewReading) {
          await checkAndSendAlerts(latestReading);
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