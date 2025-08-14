import React, { useState, useEffect } from 'react';
import { obtenerCiudadDeCoordenadas } from '../services/serviciodegeocodificación';

export default function UbicacionFromCoordenadas({ lat, lon }) {
  const [ciudad, setCiudad] = useState('Cargando...');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCiudad = async () => {
      setLoading(true);
      const result = await obtenerCiudadDeCoordenadas(lat, lon);
      setCiudad(result);
      setLoading(false);
    };

    if (lat && lon) {
      fetchCiudad();
    } else {
      setCiudad('N/A');
      setLoading(false);
    }
  }, [lat, lon]);

  return (
    <span className="text-gray-300">
      {loading ? 'Cargando...' : ciudad}
    </span>
  );
}