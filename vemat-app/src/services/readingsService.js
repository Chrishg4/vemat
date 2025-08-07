// src/services/readingsService.js
import fetchClient from '@/api/fetchClient';

/**
 * Obtiene todas las lecturas de datos desde la API
 * @returns {Promise} - Promesa con los datos de lecturas
 */
export const getAllReadings = async () => {
  try {
    const response = await fetchClient.get();
    return response;
  } catch (error) {
    console.error('Error al obtener lecturas:', error);
    throw error;
  }
};

/**
 * Obtiene la última lectura de datos
 * @returns {Promise} - Promesa con la última lectura
 */
export const getLatestReading = async () => {
  try {
    const response = await fetchClient.get();
    if (Array.isArray(response.data) && response.data.length > 0) {
      return response.data[response.data.length - 1];
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
 * @returns {Promise} - Promesa con las lecturas filtradas
 */
export const getReadingsByDateRange = async (startDate, endDate) => {
  try {
    const response = await fetchClient.get();
    if (Array.isArray(response.data)) {
      return response.data.filter(reading => {
        const readingDate = new Date(reading.date);
        return readingDate >= new Date(startDate) && readingDate <= new Date(endDate);
      });
    }
    return [];
  } catch (error) {
    console.error('Error al obtener lecturas por rango de fecha:', error);
    throw error;
  }
};