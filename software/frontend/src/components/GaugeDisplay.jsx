// src/components/GaugeDisplay.jsx
import React from 'react';
import { FaTemperatureHigh, FaTint, FaVolumeUp } from 'react-icons/fa';
import Co2Icon from './Co2Icon'; // Importar el icono personalizado
import { useGetReadings } from '../use/useGetReadings';

const GaugeCard = ({ icon, title, value, unit, color }) => {
  const IconComponent = icon;
  return (
    <div className={`bg-gray-800 p-6 rounded-2xl shadow-lg flex flex-col items-center justify-center text-white border border-gray-700`}>
      <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full" style={{ backgroundColor: color }}>
        <IconComponent className="w-10 h-10" />
      </div>
      <h3 className="text-lg font-semibold text-gray-300">{title}</h3>
      <p className="text-4xl font-bold text-white">
        {value} <span className="text-2xl text-gray-400">{unit}</span>
      </p>
    </div>
  );
};

export default function GaugeDisplay() {
  const { latest } = useGetReadings();

  const gauges = [
    {
      id: 'temperatura',
      icon: FaTemperatureHigh,
      title: 'Temperatura',
      value: parseFloat(latest.temperatura).toFixed(1),
      unit: '°C',
      color: '#ff7300',
    },
    {
      id: 'humedad',
      icon: FaTint,
      title: 'Humedad',
      value: parseFloat(latest.humedad).toFixed(1),
      unit: '%',
      color: '#387908',
    },
    {
      id: 'co2',
      icon: Co2Icon, // Usar el icono personalizado
      title: 'CO₂',
      value: parseFloat(latest.co2).toFixed(0),
      unit: 'ppm',
      color: '#0088FE',
    },
    {
      id: 'acustica',
      icon: FaVolumeUp,
      title: 'Bioacustica',
      value: parseFloat(latest.acustica).toFixed(0),
      unit: 'Hz',
      color: '#FF0000',
    },
  ];

  const formattedDate = latest.fecha 
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
          <p className="text-gray-400 text-sm">Fecha: <span className="font-semibold text-gray-200">{formattedDate}</span></p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {gauges.map((gauge) => (
          <GaugeCard
            key={gauge.id}
            icon={gauge.icon}
            title={gauge.title}
            value={gauge.value}
            unit={gauge.unit}
            color={gauge.color}
          />
        ))}
      </div>
    </div>
  );
}