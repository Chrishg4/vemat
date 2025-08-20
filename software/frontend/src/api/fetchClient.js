// src/api/fetchClient.js

const API_URL = import.meta.env.PROD
  ? 'https://vemat.onrender.com/api/datosLectura'
  : '/api/datosLectura';

/**
 * Cliente fetch para realizar peticiones HTTP
 */
const fetchClient = {
  /**
   * Realiza una petición GET
   * @param {string} url - URL relativa a la base
   * @returns {Promise} - Promesa con los datos de la respuesta
   */
  get: async () => {
    try {
      
  const response = await fetch(`${API_URL}?limit=1000`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error en la petición API:', error);
      throw error;
    }
  },
  
  /**
   * Realiza una petición POST
   * @param {string} url - URL relativa a la base
   * @param {Object} data - Datos a enviar
   * @returns {Promise} - Promesa con los datos de la respuesta
   */
  post: async (data) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error en la petición API:', error);
      throw error;
    }
  },
};

export default fetchClient;

export const obtenerDatosGeo = async () => {
  const API_URL_GEO = 'https://vemat.onrender.com/api/datosGeo';
  try {
    const response = await fetch(API_URL_GEO, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error en la petición API para datos geo:', error);
    throw error;
  }
};