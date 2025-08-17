// URL de la API de BigDataCloud para geocodificación inversa
const BIGDATA_API_URL = 'https://api.bigdatacloud.net/data/reverse-geocode-client';

// Caché en memoria para los resultados de geocodificación
const geocodingCache = new Map();

export const obtenerCiudadDeCoordenadas = async (lat, lon) => {
  if (!lat || !lon) {
    return 'Coordenadas no válidas';
  }

  const cacheKey = `${lat.toFixed(5)},${lon.toFixed(5)}`;
  if (geocodingCache.has(cacheKey)) {
    return geocodingCache.get(cacheKey);
  }

  try {
    // Llamada a la API de BigDataCloud
    const response = await fetch(`${BIGDATA_API_URL}?latitude=${lat}&longitude=${lon}&localityLanguage=es`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error de la API de BigDataCloud: ${response.status}`, errorText);
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const data = await response.json();

    // Extraer la ciudad o la localidad principal
    const result = data.city || data.locality || 'Ubicación no encontrada';
    
    geocodingCache.set(cacheKey, result);
    return result;

  } catch (error) {
    console.error('Error detallado al obtener la ciudad de las coordenadas:', error);
    return 'Error al cargar ubicación';
  }
};