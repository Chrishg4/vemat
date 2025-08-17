const NOMINATIM_API_URL = 'https://nominatim.openstreetmap.org/reverse';

// Simple in-memory cache for geocoding results
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
    const response = await fetch(`${NOMINATIM_API_URL}?format=json&lat=${lat}&lon=${lon}&accept-language=es`);
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error de la API de Nominatim: ${response.status}`, errorText);
      throw new Error(`Error HTTP: ${response.status}`);
    }
    const data = await response.json();

    let result = 'Ubicación no encontrada';
    if (data.address) {
      result = data.address.city || data.address.town || data.address.village || data.address.county || data.address.state || 'Ubicación desconocida';
    }
    geocodingCache.set(cacheKey, result);
    return result;
  } catch (error) {
    console.error('Error detallado al obtener la ciudad de las coordenadas:', error);
    return 'Error al cargar ubicación';
  }
};