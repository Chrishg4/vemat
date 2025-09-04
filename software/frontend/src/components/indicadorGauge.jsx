// src/components/indicadorGauge.jsx
import React from 'react';
import IconoCo2 from './iconoCo2'; // Importar el icono personalizado
import IconoTemperatura from './iconoTemperatura';
import IconoHumedad from './iconoHumedad';
import IconoBioacustica from './iconoBioacustica';
import { useObtenerLecturas } from '../use/useObtenerLecturas';

const TarjetaIndicador = ({ icono, titulo, valor, unidad, color }) => {
  const IconoComponente = icono;
  return (
    <div className={`bg-ia-card p-6 rounded-2xl shadow-md flex flex-col items-center justify-center text-ia-text border border-ia-border transition-colors duration-500`}>
      <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-opacity-20 dark:bg-opacity-30" style={{ backgroundColor: color }}>
        <IconoComponente className="w-10 h-10" style={{ color: color }} />
      </div>
      <h3 className="text-lg font-semibold text-ia-text-secondary">{titulo}</h3>
      <p className="text-4xl font-bold text-ia-text">
        {valor} <span className="text-2xl text-ia-text-secondary">{unidad}</span>
      </p>
    </div>
  );
};

export default function IndicadorGauge() {
  const { latest } = useObtenerLecturas();

  const indicadores = [
    {
      id: 'temperatura',
      icono: IconoTemperatura,
      titulo: 'Temperatura',
      valor: parseFloat(latest.temperatura).toFixed(1),
      unidad: '°C',
      color: 'var(--ia-warning)',
    },
    {
      id: 'humedad',
      icono: IconoHumedad,
      titulo: 'Humedad',
      valor: parseFloat(latest.humedad).toFixed(1),
      unidad: '%',
      color: 'var(--ia-success)',
    },
    {
      id: 'co2',
      icono: IconoCo2, // Usar el icono personalizado
      titulo: 'CO₂',
      valor: parseFloat(latest.co2).toFixed(0),
      unidad: 'ppm',
      color: 'var(--ia-info)',
    },
    {
      id: 'acustica',
      icono: IconoBioacustica,
      titulo: 'Bioacustica',
      valor: parseFloat(latest.acustica).toFixed(0),
      unidad: 'Hz',
      color: 'var(--ia-error)',
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
        <h2 className="text-ia-text text-xl font-semibold">
          Lecturas Actuales
        </h2>
        <div className="text-right">
          <p className="text-ia-text-secondary text-sm">ID del Nodo: <span className="font-semibold text-ia-text">{latest.nodo_id || 'N/A'}</span></p>
          <p className="text-ia-text-secondary text-sm">Fecha: <span className="font-semibold text-ia-text">{fechaFormateada}</span></p>
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