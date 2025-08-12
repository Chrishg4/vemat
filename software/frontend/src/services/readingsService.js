// src/services/readingsService.js
import fetchClient from '@/api/fetchClient';

/**
 * Obtiene todas las lecturas de datos desde la API
 * @returns {Promise<Array>} - Promesa con el array de lecturas
 */
export const getAllReadings = async () => {
  try {
    const response = await fetchClient.get();
    return response.data || []; // Devuelve el array de datos o un array vacío
  } catch (error) {
    console.error('Error al obtener lecturas:', error);
    throw error;
  }
};

/**
 * Obtiene la última lectura de datos
 * @returns {Promise<Object|null>} - Promesa con la última lectura o null
 */
export const getLatestReading = async () => {
  try {
    const response = await fetchClient.get();
    const readings = response.data || [];
    if (Array.isArray(readings) && readings.length > 0) {
      // Ordenar los datos por fecha de forma descendente para obtener la más reciente
      const sortedData = [...readings].sort((a, b) => {
        return new Date(b.fecha).getTime() - new Date(a.fecha).getTime();
      });
      return sortedData[0];
    }
    return null;
  } catch (error) {
    console.error('Error al obtener última lectura:', error);
    throw error;
  }
};

/**
 * Obtiene lecturas filtradas por fecha
 * @param {string} startDate - Fecha de inicio (formato ISO)
 * @param {string} endDate - Fecha de fin (formato ISO)
 * @returns {Promise<Array>} - Promesa con las lecturas filtradas
 */
export const getReadingsByDateRange = async (startDate, endDate) => {
  try {
    const response = await fetchClient.get();
    const readings = response.data || [];
    if (Array.isArray(readings)) {
      return readings.filter(reading => {
        const readingDate = new Date(reading.fecha);
        return readingDate >= new Date(startDate) && readingDate <= new Date(endDate);
      });
    }
    return [];
  } catch (error) {
    console.error('Error al obtener lecturas por rango de fecha:', error);
    throw error;
  }
};