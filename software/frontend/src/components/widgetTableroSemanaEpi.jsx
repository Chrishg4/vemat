
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

const MetricDisplay = ({ label, data, unit, icon: IconComponent, color }) => (
  <div className="p-4 bg-ia-card rounded-xl shadow-md flex flex-col items-center justify-center text-ia-text border border-ia-border transition-colors duration-500">
    <div className="flex items-center justify-center w-16 h-16 mb-3 rounded-full" style={{ backgroundColor: color }}>
      <IconComponent className="w-10 h-10" />
    </div>
    <h4 className="text-lg font-semibold text-ia-text-secondary mb-2">{label}</h4>
    <p className="text-4xl font-bold text-ia-text mb-2">
      {data.avg?.toFixed(1) ?? 'N/A'} <span className="text-2xl text-ia-text-secondary">{unit}</span>
    </p>
    <div className="grid grid-cols-2 gap-2 text-center w-full">
      <div>
        <p className="text-xs text-ia-text-secondary">Mín</p>
        <p className="text-md font-bold text-ia-accent">{data.min?.toFixed(1) ?? 'N/A'}{unit}</p>
      </div>
      <div>
        <p className="text-xs text-ia-text-secondary">Máx</p>
        <p className="text-md font-bold text-ia-accent">{data.max?.toFixed(1) ?? 'N/A'}{unit}</p>
      </div>
    </div>
  </div>
);

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
  
  return (
    <div className="p-4 bg-ia-card rounded-lg shadow-xl text-ia-text">
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
        <MetricDisplay label="Temperatura" data={currentWeekData.temperatura} unit="°C" icon={IconoTemperatura} color="var(--ia-warning)" />
        <MetricDisplay label="Humedad" data={currentWeekData.humedad} unit="%" icon={IconoHumedad} color="var(--ia-success)" />
        <MetricDisplay label="CO2" data={currentWeekData.co2} unit=" ppm" icon={IconoCo2} color="var(--ia-info)" />
        <MetricDisplay label="Bioacustica" data={currentWeekData.acustica} unit=" Hz" icon={IconoBioacustica} color="var(--ia-error)" />
      </div>
    </div>
  );
};

export default WidgetTableroSemanaEpi;
