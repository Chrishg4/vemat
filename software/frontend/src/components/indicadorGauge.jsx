// src/components/indicadorGauge.jsx
import React from 'react';
import IconoCo2 from './iconoCo2'; // Importar el icono personalizado
import IconoTemperatura from './iconoTemperatura';
import IconoHumedad from './iconoHumedad';
import IconoBioacustica from './iconoBioacustica';
import { useObtenerLecturas } from '../use/useObtenerLecturas';

const TarjetaIndicador = ({ icono, titulo, valor, unidad, color, minValue, maxValue }) => {
  const IconoComponente = icono;
  return (
    <div className={`bg-ia-card p-6 rounded-2xl shadow-lg flex flex-col items-center justify-center text-ia-text border border-ia-border transition-all duration-500 hover:shadow-xl`}>
      <div className="flex items-center justify-center w-20 h-20 mb-4 rounded-full" style={{ backgroundColor: color }}>
        <IconoComponente className="w-12 h-12" fill="white" />
      </div>
      <h3 className="text-lg font-semibold text-ia-text-secondary">{titulo}</h3>
      <p className="text-4xl font-bold text-ia-text">
        {valor} <span className="text-2xl text-ia-text-secondary">{unidad}</span>
      </p>
      {minValue !== undefined && maxValue !== undefined && (
        <div className="grid grid-cols-2 gap-4 w-full mt-2 text-center">
          <div>
            <p className="text-xs text-ia-text-secondary">Mín</p>
            <p className="text-sm font-bold">{minValue}{unidad}</p>
          </div>
          <div>
            <p className="text-xs text-ia-text-secondary">Máx</p>
            <p className="text-sm font-bold">{maxValue}{unidad}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default function IndicadorGauge() {
  const { latest, data } = useObtenerLecturas();

  // Calcular valores mínimos y máximos de los últimos datos
  const calcularMinMax = (campo) => {
    if (!data || data.length === 0) return { min: null, max: null };
    
    const valores = data.map(item => parseFloat(item[campo])).filter(val => !isNaN(val));
    if (valores.length === 0) return { min: null, max: null };
    
    return {
      min: Math.min(...valores).toFixed(1),
      max: Math.max(...valores).toFixed(1)
    };
  };

  const tempMinMax = calcularMinMax('temperatura');
  const humedadMinMax = calcularMinMax('humedad');
  const co2MinMax = calcularMinMax('co2');
  const acusticaMinMax = calcularMinMax('acustica');

  const indicadores = [
    {
      id: 'temperatura',
      icono: IconoTemperatura,
      titulo: 'Temperatura',
      valor: parseFloat(latest.temperatura || 0).toFixed(1),
      unidad: '°C',
      color: 'var(--ia-warning)',
      minValue: tempMinMax.min,
      maxValue: tempMinMax.max,
    },
    {
      id: 'humedad',
      icono: IconoHumedad,
      titulo: 'Humedad',
      valor: parseFloat(latest.humedad || 0).toFixed(1),
      unidad: '%',
      color: 'var(--ia-success)',
      minValue: humedadMinMax.min,
      maxValue: humedadMinMax.max,
    },
    {
      id: 'co2',
      icono: IconoCo2,
      titulo: 'CO₂',
      valor: parseFloat(latest.co2 || 0).toFixed(0),
      unidad: 'ppm',
      color: 'var(--ia-info)',
      minValue: co2MinMax.min,
      maxValue: co2MinMax.max,
    },
    {
      id: 'acustica',
      icono: IconoBioacustica,
      titulo: 'Bioacústica',
      valor: parseFloat(latest.acustica || 0).toFixed(1),
      unidad: 'Hz',
      color: 'var(--ia-error)',
      minValue: acusticaMinMax.min,
      maxValue: acusticaMinMax.max,
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