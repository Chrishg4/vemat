// software/frontend/src/components/ComponenteDeAlertas.jsx
import React, { useState, useEffect } from 'react';
import { getAllReadings } from '../services/servicioLecturas';
import { validarLecturasParaAlerta } from '../utils/utilidadesValidacion';

const ComponenteDeAlertas = () => {
  const [gruposDeAlerta, setGruposDeAlerta] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const obtenerYValidarLecturas = async () => {
      try {
        setLoading(true);
        const todasLasLecturas = await getAllReadings();

        // Criterios de validación actualizados
        const criterios = [
          { campo: 'temperatura', operador: 'entre', umbral: 26, umbralMax: 30 },
          { campo: 'humedad', operador: '>=', umbral: 65 },
          { campo: 'co2', operador: 'entre', umbral: 50, umbralMax: 200 }
        ];

        const alertasEncontradas = validarLecturasParaAlerta(todasLasLecturas, criterios);
        setGruposDeAlerta(alertasEncontradas);

      } catch (error) {
        console.error("Error al obtener y validar lecturas:", error);
      } finally {
        setLoading(false);
      }
    };

    obtenerYValidarLecturas();
  }, []);

  if (loading) {
    return <p>Cargando y validando lecturas para alertas...</p>;
  }

  return (
    <div className="bg-gray-800 p-4 rounded-xl shadow-lg">
      <h3 className="text-lg font-bold text-white mb-2">Alertas de Condiciones Críticas</h3>
      {gruposDeAlerta.length > 0 ? (
        <ul>
          {gruposDeAlerta.map((grupo, index) => (
            <li key={index} className="text-red-500">
              <strong>Alerta {index + 1}:</strong> Se encontraron 9 lecturas consecutivas cumpliendo las condiciones de temperatura, humedad y CO2.
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-400">No se han detectado condiciones críticas para generar alertas.</p>
      )}
    </div>
  );
};

export default ComponenteDeAlertas;
