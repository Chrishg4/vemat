
import { useState, useEffect } from 'react';
import { getAllReadings } from '../services/servicioLecturas';
import { validarLecturasParaAlerta } from '../utils/utilidadesValidacion';

const useAlertasCriticas = () => {
  const [gruposDeAlerta, setGruposDeAlerta] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const obtenerYValidarLecturas = async () => {
      try {
        setLoading(true);
        const todasLasLecturas = await getAllReadings();

        const criterios = [
          { campo: 'temperatura', operador: 'entre', umbral: 26, umbralMax: 30 },
          { campo: 'humedad', operador: '>=', umbral: 65 },
          { campo: 'co2', operador: 'entre', umbral: 50, umbralMax: 200 }
        ];

        const alertasEncontradas = validarLecturasParaAlerta(todasLasLecturas, criterios);
        
        const alertasConMensaje = alertasEncontradas.map(grupo => {
          if (grupo.length === 0) return null;
          const primeraLectura = grupo[0];
          const ultimaLectura = grupo[grupo.length - 1];

          const fecha = new Date(primeraLectura.fecha).toLocaleDateString('es-ES');
          const horaInicio = new Date(primeraLectura.fecha).toLocaleTimeString('es-ES');
          const horaFin = new Date(ultimaLectura.fecha).toLocaleTimeString('es-ES');

          return {
            lecturas: grupo,
            mensaje: `Alerta: ${fecha} de ${horaInicio} a ${horaFin}`,
            id: `${primeraLectura.nodo_id}-${primeraLectura.fecha}` // ID único para la alerta
          };
        }).filter(Boolean); // Eliminar nulos si hay grupos vacíos

        setGruposDeAlerta(alertasConMensaje);

      } catch (error) {
        console.error("Error al obtener y validar lecturas:", error);
      } finally {
        setLoading(false);
      }
    };

    obtenerYValidarLecturas();
    const interval = setInterval(obtenerYValidarLecturas, 60000); // Actualizar cada minuto

    return () => clearInterval(interval);
  }, []);

  return { gruposDeAlerta, loading };
};

export default useAlertasCriticas;
