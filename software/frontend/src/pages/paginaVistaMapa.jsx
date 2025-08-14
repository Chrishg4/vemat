import React, { useState, useEffect } from 'react';
import VistaMapa from '../components/vistaMapa';
import { obtenerDatosGeo } from '../api/fetchClient'; // Asegúrate de que la ruta sea correcta

export default function PaginaVistaMapa() {
  const [coordenadas, setCoordenadas] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCoordenadas = async () => {
      try {
        const datos = await obtenerDatosGeo();
        if (datos.success && datos.data.length > 0) {
          const { latitud, longitud } = datos.data[0];
          setCoordenadas({ lat: latitud, lng: longitud });
        } else {
          throw new Error('No se encontraron coordenadas en los datos recibidos.');
        }
      } catch (err) {
        setError(err.message);
        console.error("Error al obtener las coordenadas:", err);
      }
    };

    fetchCoordenadas();
  }, []);

  if (error) {
    return <div className="text-red-500">Error al cargar el mapa: {error}</div>;
  }

  if (!coordenadas) {
    return <div>Cargando mapa...</div>;
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-white mb-4">Mapa de Ubicación del Dispositivo</h2>
      <VistaMapa coordenadas={coordenadas} />
    </div>
  );
}