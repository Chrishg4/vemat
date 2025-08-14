// src/components/indicadorGauge.jsx
import React from 'react';
import { FaTemperatureHigh, FaTint, FaVolumeUp } from 'react-icons/fa';
import IconoCo2 from './iconoCo2'; // Importar el icono personalizado
import { useObtenerLecturas } from '../use/useObtenerLecturas';

const TarjetaIndicador = ({ icono, titulo, valor, unidad, color }) => {
  const IconoComponente = icono;
  return (
    <div className={`bg-gray-800 p-6 rounded-2xl shadow-lg flex flex-col items-center justify-center text-white border border-gray-700`}>
      <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full" style={{ backgroundColor: color }}>
        <IconoComponente className="w-10 h-10" />
      </div>
      <h3 className="text-lg font-semibold text-gray-300">{titulo}</h3>
      <p className="text-4xl font-bold text-white">
        {valor} <span className="text-2xl text-gray-400">{unidad}</span>
      </p>
    </div>
  );
};

export default function IndicadorGauge() {
  const { latest } = useObtenerLecturas();

  const indicadores = [
    {
      id: 'temperatura',
      icono: FaTemperatureHigh,
      titulo: 'Temperatura',
      valor: parseFloat(latest.temperatura).toFixed(1),
      unidad: '°C',
      color: '#ff7300',
    },
    {
      id: 'humedad',
      icono: FaTint,
      titulo: 'Humedad',
      valor: parseFloat(latest.humedad).toFixed(1),
      unidad: '%',
      color: '#387908',
    },
    {
      id: 'co2',
      icono: IconoCo2, // Usar el icono personalizado
      titulo: 'CO₂',
      valor: parseFloat(latest.co2).toFixed(0),
      unidad: 'ppm',
      color: '#0088FE',
    },
    {
      id: 'acustica',
      icono: FaVolumeUp,
      titulo: 'Bioacustica',
      valor: parseFloat(latest.acustica).toFixed(0),
      unidad: 'Hz',
      color: '#FF0000',
    },
  ];

  const fechaFormateada = latest.fecha 
    ? new Date(latest.fecha).toLocaleString('es-CR', { 
        year: 'numeric', month: 'long', day: 'numeric', 
        hour: 'numeric', minute: '2-digit', second: '2-digit',
        timeZone: 'UTC'
      })
    : 'Cargando...';

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-white text-xl font-semibold">
          Lecturas Actuales
        </h2>
        <div className="text-right">
          <p className="text-gray-400 text-sm">ID del Nodo: <span className="font-semibold text-gray-200">{latest.nodo_id || 'N/A'}</span></p>
          <p className="text-gray-400 text-sm">Fecha: <span className="font-semibold text-gray-200">{fechaFormateada}</span></p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {indicadores.map((indicador) => (
          <TarjetaIndicador
            key={indicador.id}
            icono={indicador.icono}
            titulo={indicador.titulo}
            valor={indicador.valor}
            unidad={indicador.unidad}
            color={indicador.color}
          />
        ))}
      </div>
    </div>
  );
}