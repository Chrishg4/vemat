// src/use/useObtenerHistorialAlertas.js
import { useState, useEffect } from 'react';
import { getAllReadings } from '../services/servicioLecturas'; // Changed import
import { validarLecturasParaAlerta } from '../utils/utilidadesValidacion'; // New import
import { useManejadorErrores } from '../hooks/useManejadorErrores';

export const useObtenerHistorialAlertas = () => {
  const [alertHistory, setAlertHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const { error, handleApiError, clearError } = useManejadorErrores();

  const fetchAlertHistory = async () => {
    clearError();
    setLoading(true);
    
    try {
      // 1. Get all readings
      const todasLasLecturas = await getAllReadings();

      // 2. Define the validation criteria
      const criterios = [
        { campo: 'temperatura', operador: 'entre', umbral: 26, umbralMax: 30 },
        { campo: 'humedad', operador: '>=', umbral: 65 },
        { campo: 'co2', operador: 'entre', umbral: 50, umbralMax: 200 }
      ];

      // 3. Validate the readings
      const gruposDeAlerta = validarLecturasParaAlerta(todasLasLecturas, criterios);

      // 4. Transform the data for the history component
      const processedAlerts = gruposDeAlerta.map(grupo => {
        const ultimaLectura = grupo[grupo.length - 1]; // Get the last reading of the group
        const promedios = grupo.reduce((acc, lectura) => {
            acc.temp += lectura.temperatura;
            acc.hum += lectura.humedad;
            acc.co2 += lectura.co2;
            return acc;
        }, { temp: 0, hum: 0, co2: 0 });

        const avgTemp = (promedios.temp / grupo.length).toFixed(1);
        const avgHum = (promedios.hum / grupo.length).toFixed(1);
        const avgCO2 = (promedios.co2 / grupo.length).toFixed(1);

        return {
          fecha: ultimaLectura.fecha,
          tipo: 'Condiciones Favorables',
          valor: `Condiciones favorables para proliferación de mosquitos detectadas. Fecha: ${new Date(ultimaLectura.fecha).toLocaleDateString('es-CR')}, Hora: ${new Date(ultimaLectura.fecha).toLocaleTimeString('es-CR')}. Promedios (últimas 9 mediciones): Temp: ${avgTemp}°C, Hum: ${avgHum}%, CO2: ${avgCO2}ppm.`,
          rangoNormal: 'Ver detalles',
          estado: 'enviado',
          latitud: ultimaLectura.latitud,
          longitud: ultimaLectura.longitud
        };
      });

      setAlertHistory(processedAlerts);

    } catch (err) {
      handleApiError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlertHistory();
  }, []);

  return {
    alertHistory,
    loading,
    error,
    refreshAlertHistory: fetchAlertHistory
  };
};
