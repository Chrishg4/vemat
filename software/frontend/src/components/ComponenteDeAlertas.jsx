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

  
};

export default ComponenteDeAlertas;
