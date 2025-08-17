import React, { useState, useEffect } from 'react';
import { obtenerCiudadDeCoordenadas } from '../services/serviciodegeocodificación';
import { FaMapMarkerAlt } from 'react-icons/fa';

export default function UbicacionFromCoordenadas({ lat, lon }) {
  const [ciudad, setCiudad] = useState('Cargando...');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retries, setRetries] = useState(0);

  useEffect(() => {
    // Reiniciar estado cuando cambian las coordenadas
    if (lat && lon) {
      setLoading(true);
      setError(false);
      fetchCiudad();
    } else {
      setCiudad('N/A');
      setLoading(false);
      setError(false);
    }
    
    // Función para obtener la ciudad
    async function fetchCiudad() {
      try {
        const result = await obtenerCiudadDeCoordenadas(lat, lon);
        
        // Verificar si el resultado indica un error o es coordenadas
        if (result.startsWith('Error') || result.startsWith('Lat:')) {
          // Si es un error pero tenemos las coordenadas, mostrarlas
          if (result.startsWith('Lat:')) {
            setCiudad(result); // Mostrar las coordenadas como respaldo
          } else {
            setCiudad('Ubicación no disponible');
          }
          // Marcar como error para posible estilo diferente
          setError(true);
        } else {
          setCiudad(result);
          setError(false);
        }
      } catch (err) {
        console.error('Error en componente de ubicación:', err);
        setCiudad('Ubicación no disponible');
        setError(true);
        
        // Intentar nuevamente si hay menos de 2 reintentos
        if (retries < 2) {
          setRetries(prev => prev + 1);
          setTimeout(() => fetchCiudad(), 2000); // Reintento después de 2 segundos
          return;
        }
      } finally {
        setLoading(false);
      }
    }
  }, [lat, lon]);

  return (
    <span className={`flex items-center ${error ? 'text-gray-400' : 'text-gray-300'}`}>
      <FaMapMarkerAlt className="mr-1 text-blue-400" />
      {loading ? 'Cargando ubicación...' : ciudad}
    </span>
  );
}