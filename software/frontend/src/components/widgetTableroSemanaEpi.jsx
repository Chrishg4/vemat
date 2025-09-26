import React from 'react';
import { useObtenerLecturas } from '../use/useObtenerLecturas';
import { resumirPorSemanaEpi } from '../utils/utilidadesResumen';
import { getEpiWeek } from '../utils/utilidadesSemanaEpi';
import IconoTemperatura from './iconoTemperatura';
import IconoHumedad from './iconoHumedad';
import IconoCo2 from './iconoCo2';
import IconoBioacustica from './iconoBioacustica';
import { MetricDisplaySkeleton } from './SkeletonLoaders';
import AlertaEnhanced from './AlertaEnhanced';
import TarjetaIndicador from './TarjetaIndicador'; // Import the new component

const WidgetTableroSemanaEpi = () => {
  const { data: rawData, loading, error } = useObtenerLecturas();

  if (loading) {
    return (
      <div className="p-4 bg-ia-card rounded-lg shadow-xl text-ia-text">
        <h3 className="text-xl font-bold mb-4">Resumen de la Semana</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricDisplaySkeleton />
          <MetricDisplaySkeleton />
          <MetricDisplaySkeleton />
          <MetricDisplaySkeleton />
        </div>
      </div>
    );
  }

  if (error) {
    return <AlertaEnhanced mensaje={`Error al cargar resumen semanal: ${error.message}`} severity="alta" />;
  }

  const summarizedData = resumirPorSemanaEpi(rawData);
  const { week: currentEpiWeek, year: currentEpiYear } = getEpiWeek(new Date());
  const currentWeekKey = `${currentEpiYear}-EW${String(currentEpiWeek).padStart(2, '0')}`;

  // Buscar datos de la semana actual
  let currentWeekData = summarizedData.find(week => week.key === currentWeekKey);
  
  // Si no hay datos para la semana actual, buscar la última semana con datos
  if (!currentWeekData && summarizedData.length > 0) {
    // Ordenar por fecha descendente para obtener la más reciente
    const sortedData = [...summarizedData].sort((a, b) => {
      // Comparar por año y luego por semana
      if (a.year !== b.year) return b.year - a.year;
      return b.epiWeek - a.epiWeek;
    });
    
    currentWeekData = sortedData[0]; // Tomar la semana más reciente con datos
  }

  if (!currentWeekData) {
    return (
      <div className="p-4 bg-ia-card rounded-lg shadow-xl text-ia-text">
        <h3 className="text-xl font-bold mb-2">Resumen de la Semana Actual (SE{currentEpiWeek}/{currentEpiYear})</h3>
        <p>Aún no hay datos disponibles para la semana epidemiológica actual.</p>
      </div>
    );
  }

  // Determinar si estamos mostrando la semana actual o una semana anterior
  const isCurrentWeek = currentWeekData.key === currentWeekKey;
  
  const metrics = [
    {
      id: 'temperatura',
      titulo: 'Temperatura',
      data: currentWeekData.temperatura,
      unidad: '°C',
      icono: IconoTemperatura,
      color: 'var(--ia-warning)',
    },
    {
      id: 'humedad',
      titulo: 'Humedad',
      data: currentWeekData.humedad,
      unidad: '%',
      icono: IconoHumedad,
      color: 'var(--ia-success)',
    },
    {
      id: 'co2',
      titulo: 'CO2',
      data: currentWeekData.co2,
      unidad: ' ppm',
      icono: IconoCo2,
      color: 'var(--ia-info)',
    },
    {
      id: 'bioacustica',
      titulo: 'Bioacustica',
      data: currentWeekData.acustica,
      unidad: ' Hz',
      icono: IconoBioacustica,
      color: 'var(--ia-error)',
    },
  ];

  return (
    <>
      <h3 className="text-xl font-bold mb-4">
        {isCurrentWeek 
          ? `Resumen de la Semana Actual (${currentWeekData.name})` 
          : `Resumen de la Semana Más Reciente (${currentWeekData.name})`
        }
        {!isCurrentWeek && (
          <span className="block text-sm text-ia-warning mt-1">
            No hay datos para la semana actual (SE{currentEpiWeek}/{currentEpiYear})
          </span>
        )}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <TarjetaIndicador
            key={metric.id}
            titulo={metric.titulo}
            valor={metric.data.avg?.toFixed(1) ?? 'N/A'}
            unidad={metric.unidad}
            icono={metric.icono}
            color={metric.color}
            minValue={metric.data.min?.toFixed(1) ?? 'N/A'}
            maxValue={metric.data.max?.toFixed(1) ?? 'N/A'}
          />
        ))}
      </div>
    </>
  );
};

export default WidgetTableroSemanaEpi;
