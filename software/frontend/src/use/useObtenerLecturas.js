// src/use/useGetReadings.js
import { useState, useEffect, useRef } from 'react';
import { getAllReadings, getLatestReading } from '../services/servicioLecturas';
import { useManejadorErrores } from '../hooks/useManejadorErrores';
import { sendAlertEmail } from '../services/servicioAlertas';

/**
 * Hook para obtener y manejar las lecturas de datos
 * @param {boolean} autoRefresh - Si debe refrescar automáticamente
 * @param {number} refreshInterval - Intervalo de refresco en ms
 * @returns {Object} - Estado y funciones para las lecturas
 */
export const useObtenerLecturas = (autoRefresh = true, refreshInterval = 10000) => { // Intervalo de 10 segundos para verificar datos nuevos
  const [latest, setLatest] = useState({});
  const [data, setData] = useState([]);
  const [alertHistory, setAlertHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastProcessedId, setLastProcessedId] = useState(null); // Para rastrear la última lectura procesada
  const [lastUpdateTime, setLastUpdateTime] = useState(null); // Para rastrear la última actualización de UI
  const [hasNewData, setHasNewData] = useState(false); // Indicador de datos nuevos
  const { error, handleApiError, clearError } = useManejadorErrores();
  
  // Referencia para almacenar el último ID conocido
  const lastKnownIdRef = useRef(null);

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
   * Verifica si hay datos nuevos en la API sin actualizar la UI
   */
  const checkForNewData = async () => {
    try {
      // Solo obtenemos la última lectura para verificar si hay cambios
      const latestReading = await getLatestReading();
      
      if (latestReading && lastKnownIdRef.current) {
        // Verificar si hay una nueva lectura comparando con la referencia
        // Solo consideramos que hay datos nuevos si ya tenemos un ID de referencia
        // y el nuevo ID es diferente
        const isNewReading = lastKnownIdRef.current !== latestReading.id;
        
        if (isNewReading) {
          console.log('Se detectaron nuevos datos en la API');
          setHasNewData(true);
          // No actualizamos lastKnownIdRef aquí, solo cuando se carga completamente
        }
        return isNewReading;
      }
      return false;
    } catch (err) {
      console.error('Error al verificar nuevos datos:', err);
      return false;
    }
  };

  /**
   * Carga los datos completos desde la API y actualiza la UI
   */
  const fetchData = async (force = false) => {
    // Si no hay datos nuevos y no es forzado, no hacemos nada
    if (!hasNewData && !force) {
      return;
    }
    
    clearError();
    setLoading(true);
    
    try {
      const allReadings = await getAllReadings();
      const latestReading = await getLatestReading();
      let processedAllReadings = []; // Initialize here
      
      if (Array.isArray(allReadings) && allReadings.length > 0) {
        processedAllReadings = allReadings.map(reading => ({
          ...reading,
          acustica: reading.sonido 
        }));
        setData([...processedAllReadings].reverse()); 
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
        
        // Actualizar la referencia del último ID conocido
        // Esto es importante para que checkForNewData pueda comparar correctamente
        lastKnownIdRef.current = processedLatestReading.id;
        console.log('ID de referencia actualizado:', lastKnownIdRef.current);
        
        // Solo enviar alertas si es una nueva lectura
        if (isNewReading) {
          await checkAndSendAlerts(processedLatestReading, processedAllReadings);
        }
        
        // Actualizar timestamp de última actualización
        setLastUpdateTime(new Date());
        // Resetear el indicador de datos nuevos
        setHasNewData(false);
      }
    } catch (err) {
      handleApiError(err);
    } finally {
      setLoading(false);
    }
  };

  // Configurar verificación periódica de datos nuevos
  useEffect(() => {
    // Carga inicial forzada para mostrar los datos existentes
    fetchData(true);

    let checkInterval;
    let updateInterval;
    let initialDelay;
    
    if (autoRefresh) {
      // Retraso inicial para comenzar la verificación de datos nuevos
      // después de que se hayan mostrado los datos existentes
      initialDelay = setTimeout(() => {
        // Intervalo para verificar si hay datos nuevos (cada 10 segundos)
        checkInterval = setInterval(() => {
          checkForNewData();
        }, refreshInterval);
        
        // Intervalo para actualizar la UI cuando hay datos nuevos (cada 1 minuto como máximo)
        updateInterval = setInterval(() => {
          if (hasNewData) {
            console.log('Actualizando UI con nuevos datos');
            fetchData();
          }
        }, 60000); // 1 minuto máximo entre actualizaciones de UI
      }, 5000); // Esperar 5 segundos antes de comenzar a verificar datos nuevos
    }

    return () => {
      if (checkInterval) clearInterval(checkInterval);
      if (updateInterval) clearInterval(updateInterval);
      if (initialDelay) clearTimeout(initialDelay);
    };
  }, [autoRefresh, refreshInterval]);
  
  // Efecto para actualizar cuando se detectan datos nuevos
  useEffect(() => {
    if (hasNewData) {
      // Si no ha habido actualización en el último minuto, actualizamos inmediatamente
      const shouldUpdateNow = !lastUpdateTime || 
        (new Date().getTime() - lastUpdateTime.getTime() > 60000);
        
      if (shouldUpdateNow) {
        console.log('Actualizando inmediatamente con nuevos datos');
        fetchData();
      }
    }
  }, [hasNewData]);

  return {
    latest,
    data,
    alertHistory,
    loading,
    error,
    hasNewData,
    lastUpdateTime,
    refreshData: () => fetchData(true) // Forzar actualización cuando se llama manualmente
  };
};